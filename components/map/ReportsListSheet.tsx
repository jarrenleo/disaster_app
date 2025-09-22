import { useRef, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text as UIText } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { ChevronRight } from 'lucide-react-native';

export type ReportMarker = {
  id: number;
  latitude: number;
  longitude: number;
  disaster_type: string;
  created_at: string;
  location?: string;
  coordinates?: string;
};

type ReportsListSheetProps = {
  markers: ReportMarker[];
  userCountry: string | null;
  loading: boolean;
  error: string | null;
  nearOnly: boolean;
  setNearOnly: (v: boolean) => void;
  onPressItem: (lat: number, lng: number) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  nearbyReportIds: Set<number>;
  animatedPosition: any;
  canNearFilter?: boolean;
  renderEmoji?: (type: string) => string;
};

export function ReportsListSheet({
  markers,
  userCountry,
  loading,
  error,
  nearOnly,
  setNearOnly,
  onPressItem,
  searchQuery,
  setSearchQuery,
  nearbyReportIds,
  animatedPosition,
  canNearFilter = true,
  renderEmoji,
}: ReportsListSheetProps) {
  const insets = useSafeAreaInsets();
  const listSnapPoints = useMemo(() => [70, '65%'], []);
  const listSheetRef = useRef<BottomSheet | null>(null);

  return (
    <BottomSheet
      ref={listSheetRef}
      index={0}
      snapPoints={listSnapPoints}
      enablePanDownToClose={false}
      animatedPosition={animatedPosition}
      backgroundComponent={({ style }: BottomSheetBackgroundProps) => (
        <View className="rounded-t-2xl border-t border-border bg-card" style={style} />
      )}
      handleComponent={() => (
        <View className="items-center pt-2">
          <View className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
          <View className="mb-3 mt-2 items-center">
            <UIText className="text-sm text-muted-foreground">
              Active reports in {userCountry ?? 'your area'}
            </UIText>
            <UIText className="text-xs text-muted-foreground">
              {loading ? 'Loading…' : `${markers.length} active`}
            </UIText>
          </View>
        </View>
      )}>
      <BottomSheetView className="bg-card">
        {loading ? (
          <View className="items-center justify-center py-6">
            <UIText className="mt-2 text-muted-foreground">Loading reports…</UIText>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-6">
            <UIText className="text-red-500">{error}</UIText>
          </View>
        ) : (
          <BottomSheetFlatList
            data={markers}
            keyExtractor={(item: ReportMarker) => String(item.id)}
            contentContainerStyle={{ paddingBottom: insets.bottom + 8, paddingHorizontal: 8 }}
            ListHeaderComponent={
              <View className="mb-2 px-2">
                <Input
                  placeholder="Search type or location"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                />
                <View className="mt-2 flex-row items-center justify-between">
                  <UIText className="text-xs text-muted-foreground">
                    {markers.length} result{markers.length === 1 ? '' : 's'}
                  </UIText>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onPress={() => setNearOnly(!nearOnly)}
                    disabled={!canNearFilter}>
                    <UIText className={nearOnly ? 'font-semibold text-primary' : undefined}>
                      Near you only
                    </UIText>
                  </Button>
                </View>
              </View>
            }
            ListEmptyComponent={
              <View className="items-center justify-center py-6">
                <UIText className="text-muted-foreground">
                  {searchQuery.trim() ? `No results for "${searchQuery}"` : 'No active reports'}
                </UIText>
              </View>
            }
            renderItem={({ item }: { item: ReportMarker }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPressItem(item.latitude, item.longitude)}
                className="mb-2 rounded-2xl bg-card p-3">
                <View className="flex-row items-center">
                  <View className="mr-3 items-center justify-center">
                    <UIText style={{ fontSize: 32, lineHeight: 32 * 1.1 }}>
                      {renderEmoji ? renderEmoji(item.disaster_type) : '⚠️'}
                    </UIText>
                  </View>
                  <View className="flex-1">
                    <View className="mb-2 flex-row items-center gap-2">
                      <UIText className="flex-shrink text-base font-extrabold">
                        {item.disaster_type} @ {item.location}
                      </UIText>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <UIText className="text-xs text-muted-foreground">
                        Reported:{' '}
                        {new Date(item.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        ,{' '}
                        {new Date(item.created_at).toLocaleDateString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </UIText>
                      {nearbyReportIds.has(item.id) ? (
                        <View className="rounded-sm bg-destructive px-2 py-0.5">
                          <UIText className="text-[10px] font-extrabold tracking-wider text-white">
                            NEAR YOU
                          </UIText>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}
