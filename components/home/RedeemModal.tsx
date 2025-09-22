import { useMemo, useRef, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Minus, Plus, XIcon } from 'lucide-react-native';

type RedeemModalProps = {
  visible: boolean;
  onClose: () => void;
  availablePoints: number;
  userId: string | null;
};

export function RedeemModal({ visible, onClose, availablePoints, userId }: RedeemModalProps) {
  const insets = useSafeAreaInsets();

  const maxRedeemable = useMemo(
    () => Math.floor(Math.max(0, availablePoints) / 10) * 10,
    [availablePoints]
  );
  const minRedeemable = 10;
  const [amount, setAmount] = useState<number>(
    Math.min(Math.max(minRedeemable, 10), Math.max(minRedeemable, maxRedeemable))
  );
  const [confirmed, setConfirmed] = useState<boolean>(false);

  // Reset when opened/closed or points change
  const lastVisibleRef = useRef<boolean>(visible);
  if (lastVisibleRef.current !== visible) {
    lastVisibleRef.current = visible;
    setConfirmed(false);
    const next = Math.min(Math.max(minRedeemable, 10), Math.max(minRedeemable, maxRedeemable));
    setAmount(next);
  }

  const canDecrease = amount > minRedeemable;
  const canIncrease = amount + 10 <= maxRedeemable;
  const canConfirm =
    maxRedeemable >= minRedeemable && amount >= minRedeemable && amount <= maxRedeemable;

  const payload = confirmed
    ? JSON.stringify({
        type: 'redeem_points',
        version: 1,
        userId: userId ?? null,
        points: amount,
        ts: Date.now(),
      })
    : '';

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="fullScreen">
      <View
        className="flex-1 bg-background"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View className="flex-row items-center justify-between px-6 pb-2 pt-6">
          <Pressable onPress={onClose} role="button">
            <Icon as={XIcon} size={24} className="text-muted-foreground" />
          </Pressable>
          <Text className="text-lg font-semibold">Redeem Points</Text>
          <View className="w-6" />
        </View>

        {!confirmed ? (
          <View className="flex-1 px-6 pt-4">
            <Text className="text-muted-foreground">Available points</Text>
            <Text className="mb-6 text-3xl font-extrabold">{availablePoints}</Text>

            <Text className="mb-2 text-base font-medium">Choose amount to redeem</Text>
            <View className="items-center justify-center rounded-2xl border border-border bg-accent p-4">
              <View className="flex-row items-center gap-6">
                <Button
                  variant="outline"
                  size="icon"
                  onPress={() => setAmount((v) => Math.max(minRedeemable, v - 10))}
                  disabled={!canDecrease}>
                  <Icon as={Minus} size={18} />
                </Button>
                <Text className="text-4xl font-extrabold">{amount}</Text>
                <Button
                  variant="outline"
                  size="icon"
                  onPress={() => setAmount((v) => Math.min(maxRedeemable, v + 10))}
                  disabled={!canIncrease}>
                  <Icon as={Plus} size={18} />
                </Button>
              </View>
              <Text className="mt-2 text-xs text-muted-foreground">Step: 10 points</Text>
            </View>

            {maxRedeemable < minRedeemable ? (
              <Text className="mt-4 text-destructive">You need at least 10 points to redeem.</Text>
            ) : null}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <View className="mb-4 items-center">
              <Text className="text-muted-foreground">Show this QR code to redeem</Text>
              <Text className="text-lg font-semibold">{amount} points</Text>
            </View>
            <View className="rounded-2xl border border-border bg-card p-4">
              {payload ? <QRCode value={payload} size={220} /> : null}
            </View>
          </View>
        )}

        <View className="mt-auto px-6 pb-6" style={{ paddingBottom: insets.bottom + 16 }}>
          {!confirmed ? (
            <Button onPress={() => setConfirmed(true)} disabled={!canConfirm}>
              <Text>Confirm & Generate QR</Text>
            </Button>
          ) : (
            <Button onPress={onClose}>
              <Text>Done</Text>
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
}
