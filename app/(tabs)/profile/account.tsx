import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ArrowLeftIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import SetProfileImage from '@/components/profile/SetProfileImage';
import UpdateUsername from '@/components/profile/UpdateUsername';
import { Separator } from '@/components/ui/separator';

export default function AccountInfoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
      <Button
        variant="ghost"
        onPress={() => router.back()}
        className="mb-4 h-10 w-10 rounded-full bg-muted">
        <Icon as={ArrowLeftIcon} className="size-5" />
      </Button>
      <Text className="mb-12 text-3xl font-bold text-foreground">Account info</Text>

      <SetProfileImage />

      <Separator className="mb-4 mt-6" />

      <UpdateUsername />
    </View>
  );
}
