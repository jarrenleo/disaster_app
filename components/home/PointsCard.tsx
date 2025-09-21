import { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import supabase from '@/lib/supabase';
import { RedeemModal } from './RedeemModal';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RefreshCw } from 'lucide-react-native';

export function PointsCard() {
  const { userId } = useAuth();
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemVisible, setRedeemVisible] = useState<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  const loadPoints = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const [completedChallengesData, pointsRedeemedData] = await Promise.all([
      supabase.from('completed_challenges').select('points').eq('user_id', userId),
      supabase.from('users').select('points_redeemed').eq('clerk_id', userId).limit(1),
    ]);

    if (!isMountedRef.current) return;

    if (completedChallengesData.error) {
      setError(completedChallengesData.error.message);
      setLoading(false);
      return;
    }

    let pointsRedeemed = 0;
    if (pointsRedeemedData.error) {
      setError(pointsRedeemedData.error.message);
      setLoading(false);
    } else {
      pointsRedeemed = (pointsRedeemedData.data?.[0]?.points_redeemed as number | null) ?? 0;
    }

    const totalPointsEarned = (completedChallengesData.data ?? []).reduce(
      (sum: number, row: any) => sum + ((row?.points as number | null) ?? 0),
      0
    );

    const totalAvailablePoints = Math.max(0, totalPointsEarned - pointsRedeemed);
    if (!isMountedRef.current) return;
    setPoints(totalAvailablePoints);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    isMountedRef.current = true;
    loadPoints();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadPoints]);

  function handleRedeem() {
    setRedeemVisible(true);
  }

  async function handleRefresh() {
    await loadPoints();
  }

  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-center justify-between">
          <CardTitle>Points</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onPress={handleRefresh}
            disabled={loading}
            accessibilityLabel="Refresh points">
            <Icon as={RefreshCw} size={18} className="text-muted-foreground" />
          </Button>
        </View>
        <CardDescription>Your earned points available to redeem</CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        {loading ? (
          <View className="flex-row items-center gap-3">
            <ActivityIndicator />
            <Text className="text-muted-foreground">Loading points…</Text>
          </View>
        ) : error ? (
          <Text className="text-destructive">{error}</Text>
        ) : (
          <Text className="text-4xl font-extrabold">{points}</Text>
        )}
      </CardContent>
      <CardFooter className="mt-2 flex-row gap-2">
        <Button onPress={handleRedeem} disabled={loading || !!error || (points ?? 0) <= 0}>
          <Text>Redeem</Text>
        </Button>
      </CardFooter>
      <RedeemModal
        visible={redeemVisible}
        onClose={() => setRedeemVisible(false)}
        availablePoints={points ?? 0}
        userId={userId ?? null}
      />
    </Card>
  );
}
