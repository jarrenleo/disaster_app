import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Text as UIText } from '@/components/ui/text';

export type ReportMarker = {
  id: number;
  latitude: number;
  longitude: number;
  disaster_type: string;
  created_at: string;
  location?: string;
  coordinates?: string;
};

type MapMarkersProps = {
  markers: ReportMarker[];
  renderEmoji: (type: string) => string;
};

export function MapMarkers({ markers, renderEmoji }: MapMarkersProps) {
  return (
    <>
      {markers.map((m) => (
        <Marker
          key={m.id}
          coordinate={{ latitude: m.latitude, longitude: m.longitude }}
          anchor={{ x: 0.6, y: 0.6 }}
          title={`${m.disaster_type} @ ${m.location}`}
          description={new Date(m.created_at).toLocaleString()}>
          <View pointerEvents="none">
            <UIText style={{ fontSize: 32, lineHeight: 32 * 1.15 }}>
              {renderEmoji(m.disaster_type)}
            </UIText>
          </View>
        </Marker>
      ))}
    </>
  );
}
