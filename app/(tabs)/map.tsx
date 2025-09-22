import { useState, useEffect, useMemo, useRef } from 'react';
import { View, Alert, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { useUser } from '@clerk/clerk-expo';
import MapView, { type Region } from 'react-native-maps';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import supabase from '@/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { MapMarkers } from '@/components/map/MapMarkers';
import { ReportsListSheet } from '@/components/map/ReportsListSheet';
import { FloatingMapActions } from '@/components/map/FloatingMapActions';
import { ReportModal } from '@/components/map/ReportModal';

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function calculateGreatCircleDistanceKM(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadiusKm = 6371; // Mean Earth radius
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | undefined>(undefined);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('Flood');
  const [submitting, setSubmitting] = useState(false);
  const [otherText, setOtherText] = useState('');
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [nearOnly, setNearOnly] = useState(false);

  type Coordinates = {
    latitude: number;
    longitude: number;
  };
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);

  type Report = {
    id: number;
    disaster_type: string;
    location: string;
    country: string;
    coordinates: string;
    created_at: string;
  };

  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState<boolean>(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const DISASTER_TYPES = [
    'Flood',
    'Fire',
    'Earthquake',
    'Tornado',
    'Hurricane',
    'Landslide',
    'Other',
  ];
  const sheetRef = useRef<BottomSheetModal | null>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const listAnimatedPosition = useSharedValue(0);
  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    const sheetHeight = windowHeight - listAnimatedPosition.value;
    const bottom = Math.max(sheetHeight - 56, insets.bottom);
    return { bottom };
  }, [windowHeight, insets.bottom]);

  type ReportMarker = {
    id: number;
    latitude: number;
    longitude: number;
    disaster_type: string;
    created_at: string;
    location?: string;
    coordinates?: string;
  };

  const reportMarkers = useMemo<ReportMarker[]>(() => {
    return reports
      .map((r) => {
        if (!r.coordinates) return null;

        const parts = r.coordinates.split(',');

        if (parts.length !== 2) return null;

        const latitude = parseFloat(parts[0]);
        const longitude = parseFloat(parts[1]);

        if (isNaN(latitude) || isNaN(longitude)) return null;

        return {
          id: r.id,
          latitude,
          longitude,
          disaster_type: r.disaster_type,
          created_at: r.created_at,
          location: r.location,
          coordinates: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
        } as ReportMarker;
      })
      .filter((m): m is ReportMarker => !!m);
  }, [reports]);

  const nearbyReportIds = useMemo<Set<number>>(() => {
    if (!userCoords) return new Set<number>();

    const result = new Set<number>();

    for (const marker of reportMarkers) {
      const distanceKm = calculateGreatCircleDistanceKM(
        userCoords.latitude,
        userCoords.longitude,
        marker.latitude,
        marker.longitude
      );
      if (distanceKm < 5) result.add(marker.id);
    }

    return result;
  }, [userCoords, reportMarkers]);

  const filteredReportMarkers = useMemo<ReportMarker[]>(() => {
    let list = reportMarkers;
    const query = searchQuery.trim().toLowerCase();

    if (query)
      list = list.filter((m) => {
        const type = m.disaster_type?.toLowerCase() ?? '';
        const loc = (m.location ?? '').toLowerCase();
        return type.includes(query) || loc.includes(query);
      });

    if (nearOnly && userCoords) list = list.filter((m) => nearbyReportIds.has(m.id));

    return list;
  }, [reportMarkers, searchQuery, nearOnly, userCoords, nearbyReportIds]);

  function typeEmoji(type: string): string {
    switch (type) {
      case 'Flood':
        return '🌊';
      case 'Fire':
        return '🔥';
      case 'Earthquake':
        return '🌋';
      case 'Tornado':
        return '🌪️';
      case 'Hurricane':
        return '🌀';
      case 'Landslide':
        return '🏔️';
      default:
        return '⚠️';
    }
  }

  function panTo(lat: number, lng: number): void {
    if (!mapRef.current) return;

    mapRef.current.animateCamera(
      {
        center: { latitude: lat, longitude: lng },
        zoom: 16,
      },
      { duration: 600 }
    );
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) return;
      const granted = status === 'granted';
      setHasPermission(granted);
      if (!granted) return;

      const current = await Location.getCurrentPositionAsync({});
      if (!isMounted) return;
      const region: Region = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setInitialRegion(region);
      setUserCoords({ latitude: region.latitude, longitude: region.longitude });
      mapRef.current?.animateCamera({
        center: { latitude: region.latitude, longitude: region.longitude },
        zoom: 16,
      });

      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
        const country = geocode?.[0]?.country ?? null;
        if (isMounted) setUserCountry(country);
      } catch {
        if (isMounted) setUserCountry(null);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchReportsForCountry = async (country: string) => {
      try {
        setReportsError(null);
        setReportsLoading(true);
        const { data, error } = await supabase
          .from('reports')
          .select('id, disaster_type, location, country, created_at, coordinates')
          .eq('is_active', true)
          .eq('country', country)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setReports((data as Report[]) ?? []);
      } catch (e: any) {
        setReportsError(e?.message ?? 'Failed to load reports');
        setReports([]);
      } finally {
        setReportsLoading(false);
      }
    };

    if (userCountry) fetchReportsForCountry(userCountry);
  }, [userCountry]);

  async function refreshReports(): Promise<void> {
    try {
      let country = userCountry;
      try {
        const current = await Location.getCurrentPositionAsync({});
        setUserCoords({ latitude: current.coords.latitude, longitude: current.coords.longitude });
        const geocode = await Location.reverseGeocodeAsync({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
        country = geocode?.[0]?.country ?? country;
        if (country && country !== userCountry) setUserCountry(country);
      } catch {}

      if (!country) return;

      setReportsLoading(true);
      setReportsError(null);
      const { data, error } = await supabase
        .from('reports')
        .select('id, disaster_type, location, country, created_at, coordinates')
        .eq('is_active', true)
        .eq('country', country)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReports((data as Report[]) ?? []);
    } catch (e: any) {
      setReportsError(e?.message ?? 'Failed to refresh');
    } finally {
      setReportsLoading(false);
    }
  }

  async function centerOnUser(): Promise<void> {
    if (!hasPermission || !mapRef.current) return;
    const current = await Location.getCurrentPositionAsync({});
    setUserCoords({ latitude: current.coords.latitude, longitude: current.coords.longitude });
    mapRef.current.animateCamera({
      center: {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      },
      zoom: 16,
    });
  }

  async function handleSubmitReport(): Promise<void> {
    try {
      if (!hasPermission) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const granted = status === 'granted';
        setHasPermission(granted);
        if (!granted) {
          Alert.alert('Permission required', 'Location permission is needed to report a sighting.');
          return;
        }
      }

      setSubmitting(true);

      const finalType = selectedType === 'Other' ? otherText.trim() : selectedType;
      if (!finalType) {
        Alert.alert('Missing type', 'Please enter the disaster type.');
        setSubmitting(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = current.coords;

      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

      const country = geocode?.[0]?.country;
      const location = `${geocode?.[0]?.streetNumber || ''} ${geocode?.[0]?.street || ''}`;
      const coordinates = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

      const { error } = await supabase.from('reports').insert([
        {
          disaster_type: finalType,
          location,
          coordinates,
          country,
          user_id: user?.id,
        },
      ]);

      if (error) throw error;

      Alert.alert('Report submitted', 'Thank you for your report.');
      setReportOpen(false);
      sheetRef.current?.dismiss();
      setOtherText('');
    } catch (e: any) {
      Alert.alert('Report failed', e?.message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1">
        <MapView
          ref={mapRef}
          style={{ height: '100%', width: '100%' }}
          showsUserLocation={!!hasPermission}
          showsMyLocationButton={false}
          initialRegion={initialRegion}>
          <MapMarkers markers={filteredReportMarkers as any} renderEmoji={typeEmoji} />
        </MapView>
        <ReportsListSheet
          markers={filteredReportMarkers as any}
          userCountry={userCountry}
          loading={reportsLoading}
          error={reportsError}
          nearOnly={nearOnly}
          setNearOnly={(v) => setNearOnly(v)}
          onPressItem={(lat, lng) => panTo(lat, lng)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          nearbyReportIds={nearbyReportIds}
          animatedPosition={listAnimatedPosition}
          canNearFilter={!!userCoords}
          renderEmoji={typeEmoji}
        />
        <FloatingMapActions
          animatedStyle={buttonsAnimatedStyle}
          hasPermission={hasPermission}
          onRefresh={refreshReports}
          onCenter={centerOnUser}
          onReport={() => {
            setReportOpen(true);
            sheetRef.current?.present();
          }}
        />

        <ReportModal
          visible={reportOpen}
          onDismiss={() => setReportOpen(false)}
          submitting={submitting}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          otherText={otherText}
          setOtherText={setOtherText}
          onSubmit={handleSubmitReport}
          types={DISASTER_TYPES}
        />
      </View>
    </>
  );
}
