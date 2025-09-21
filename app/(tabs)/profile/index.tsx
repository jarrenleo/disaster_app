import { View, Text, FlatList, Dimensions } from 'react-native';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Icon } from '@/components/ui/icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import {
  ShieldHalfIcon,
  User2Icon,
  SunMoonIcon,
  LogOutIcon,
  ChevronRightIcon,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { signOut } = useAuth();

  const { imageUrl, username, firstName, emailAddresses, createdAt } = user || {};

  const tempName = emailAddresses?.[0]?.emailAddress.split('@')[0];

  const joinDate = createdAt
    ? new Date(createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' })
    : undefined;

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth / 2;

  const cards = [
    {
      id: '1',
      title: 'Bronze',
      description: 'Accumulate 50 points',
    },
    {
      id: '2',
      title: 'Silver',
      description: 'Accumulate 100 points',
    },
    {
      id: '3',
      title: 'Gold',
      description: 'Accumulate 500 points',
    },
    {
      id: '4',
      title: 'Platinum',
      description: 'Accumulate 1,000 points',
    },
    {
      id: '5',
      title: 'Emerald',
      description: 'Accumulate 2,500 points',
    },
    {
      id: '6',
      title: 'Diamond',
      description: 'Accumulate 5,000 points',
    },
    {
      id: '7',
      title: 'Master',
      description: 'Accumulate 7,500 points',
    },
    {
      id: '8',
      title: 'Challenger',
      description: 'Accumulate 10,000 points',
    },
  ];

  return (
    <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
      <Text className="mb-6 text-3xl font-bold text-foreground">Profile</Text>

      <View className="mb-6 flex-col items-center">
        <Image
          source={imageUrl}
          contentFit="cover"
          style={{ width: 100, height: 100, borderRadius: 9999 }}
        />
        <Text className="mt-4 text-2xl font-medium text-foreground">
          {username || firstName || tempName}
        </Text>
        <Text className="text-normal text-muted-foreground">Joined {joinDate}</Text>
      </View>

      <View className="mb-6">
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={cardWidth}
          snapToAlignment="start"
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <Card style={{ width: cardWidth }} className="rounded-xl border-0">
              <CardHeader></CardHeader>
              <CardContent>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          )}
        />
      </View>

      <Button
        variant="ghost"
        onPress={() => router.push('/profile/account')}
        className="h-auto w-full justify-start rounded-xl py-4">
        <Icon as={User2Icon} className="mr-2 size-5" />
        <Text className="text-base text-foreground">Account information</Text>
        <Icon as={ChevronRightIcon} className="ml-auto size-5 text-muted-foreground" />
      </Button>

      <Button
        variant="ghost"
        onPress={() => router.push('/profile/security')}
        className="h-auto w-full justify-start rounded-xl py-4">
        <Icon as={ShieldHalfIcon} className="mr-2 size-5" />
        <Text className="text-base text-foreground">Login & security</Text>
        <Icon as={ChevronRightIcon} className="ml-auto size-5 text-muted-foreground" />
      </Button>

      <Button
        variant="ghost"
        onPress={() => router.push('/profile/theme')}
        className="h-auto w-full justify-start rounded-xl py-4">
        <Icon as={SunMoonIcon} className="mr-2 size-5" />
        <Text className="text-base text-foreground">Theme</Text>
        <Icon as={ChevronRightIcon} className="ml-auto size-5 text-muted-foreground" />
      </Button>

      <Separator className="my-2" />

      <Button
        variant="ghost"
        onPress={async () => await signOut()}
        className="h-auto w-full justify-start rounded-xl py-4">
        <Icon as={LogOutIcon} className="mr-2 size-5" />
        <Text className="text-base text-foreground">Log out</Text>
      </Button>
    </View>
  );
}
