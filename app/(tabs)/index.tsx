import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { View, Alert, Pressable } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrophyIcon, BookOpenIcon } from 'lucide-react-native';
import { ChallengesModal } from '@/components/home/ChallengesModal';
import { GuidesModal } from '@/components/home/GuidesModal';
import { PointsCard } from '@/components/home/PointsCard';

export default function HomeTabScreen() {
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();

  useEffect(() => {
    void userId;
  }, [userId]);

  function onRedeemPress() {
    Alert.alert('Redeem', 'Redemption flow coming soon.');
  }

  const [showChallenges, setShowChallenges] = useState(false);
  const [showGuides, setShowGuides] = useState(false);

  function onPressChallenges() {
    setShowChallenges(true);
  }

  function onPressGuides() {
    setShowGuides(true);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
        <Text className="mb-6 text-3xl font-bold text-foreground">Home</Text>
        <PointsCard />
        <View className="mt-8">
          <Text className="mb-4 text-lg font-semibold text-foreground">Apps</Text>
          <View className="flex-row flex-wrap">
            <Pressable
              className="mb-6 w-1/4 items-center"
              onPress={onPressChallenges}
              role="button">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-accent">
                <Icon as={TrophyIcon} size={32} className="text-accent-foreground" />
              </View>
              <Text className="mt-2 text-sm font-medium">Challenges</Text>
            </Pressable>
            <Pressable className="mb-6 w-1/4 items-center" onPress={onPressGuides} role="button">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-accent">
                <Icon as={BookOpenIcon} size={32} className="text-accent-foreground" />
              </View>
              <Text className="mt-2 text-sm font-medium">Guides</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ChallengesModal visible={showChallenges} onClose={() => setShowChallenges(false)} />
      <GuidesModal visible={showGuides} onClose={() => setShowGuides(false)} />
    </>
  );
}
