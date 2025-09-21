import { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text as UIText } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ReportModalProps = {
  visible: boolean;
  onDismiss: () => void;
  submitting: boolean;
  selectedType: string;
  setSelectedType: (t: string) => void;
  otherText: string;
  setOtherText: (t: string) => void;
  onSubmit: () => void;
  types: string[];
};

export function ReportModal({
  visible,
  onDismiss,
  submitting,
  selectedType,
  setSelectedType,
  otherText,
  setOtherText,
  onSubmit,
  types,
}: ReportModalProps) {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal | null>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const renderBackdrop = useMemo(
    () => (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  useEffect(() => {
    if (visible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [visible]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundComponent={({ style }: BottomSheetBackgroundProps) => (
        <View className="rounded-t-2xl border-t border-border bg-card" style={style} />
      )}
      handleComponent={() => (
        <View className="items-center pt-2">
          <View className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </View>
      )}
      onDismiss={onDismiss}>
      <BottomSheetView className="bg-card">
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-lg">Report Sighting</CardTitle>
          </CardHeader>
          <CardContent>
            <UIText className="mb-3 text-muted-foreground">Select a type:</UIText>
            <View className="flex-row flex-wrap gap-2">
              {types.map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  size="sm"
                  className={cn(
                    'rounded-full',
                    selectedType === t ? 'border-primary bg-primary/10' : undefined
                  )}
                  onPress={() => setSelectedType(t)}>
                  <UIText className={selectedType === t ? 'font-semibold text-primary' : undefined}>
                    {t}
                  </UIText>
                </Button>
              ))}
            </View>
            {selectedType === 'Other' ? (
              <View className="mt-4">
                <UIText className="mb-2 text-muted-foreground">Enter disaster type</UIText>
                <Input
                  placeholder="e.g. Volcanic Ash"
                  value={otherText}
                  onChangeText={setOtherText}
                  autoFocus
                  returnKeyType="done"
                />
              </View>
            ) : null}
          </CardContent>
          <CardFooter className="justify-end gap-2" style={{ paddingBottom: insets.bottom + 8 }}>
            <Button variant="ghost" onPress={onDismiss} disabled={submitting}>
              <UIText>Cancel</UIText>
            </Button>
            <Button onPress={onSubmit} disabled={submitting}>
              <UIText>{submitting ? 'Submitting...' : 'Submit'}</UIText>
            </Button>
          </CardFooter>
        </Card>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
