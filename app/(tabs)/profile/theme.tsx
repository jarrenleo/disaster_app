import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ArrowLeftIcon } from 'lucide-react-native';

export default function ThemeScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useColorScheme();

  const selected: 'system' | 'light' | 'dark' = (colorScheme as any) ?? 'system';
  return (
    <View className="flex-1 px-6" style={{ paddingTop: insets.top }}>
      <Button
        variant="ghost"
        onPress={() => router.back()}
        className="mb-4 h-10 w-10 rounded-full bg-muted">
        <Icon as={ArrowLeftIcon} className="size-5" />
      </Button>

      <Text className="mb-6 text-3xl font-bold text-foreground">Theme</Text>

      <View className="mb-8 rounded-2xl bg-secondary p-4">
        <View className="rounded-2xl bg-card p-4">
          <View className="h-7 w-32 rounded-lg bg-primary" />
          <View className="mt-4 h-7 rounded-lg bg-muted" />
          <View className="mt-4 h-36 rounded-lg bg-muted" />
        </View>
      </View>

      <View className="flex-row items-center justify-between px-6">
        <Button
          variant="ghost"
          className={`rounded-xl ${selected === 'system' ? 'bg-muted' : null}`}
          onPress={() => setColorScheme('system')}>
          <Text
            className={`text-base text-foreground ${selected === 'system' ? 'font-semibold' : 'font-normal'}`}>
            System
          </Text>
        </Button>
        <Button
          variant="ghost"
          className={`rounded-xl ${selected === 'light' ? 'bg-muted' : null}`}
          onPress={() => setColorScheme('light')}>
          <Text
            className={`text-base text-foreground ${selected === 'light' ? 'font-semibold' : 'font-normal'}`}>
            Light
          </Text>
        </Button>
        <Button
          variant="ghost"
          className={`rounded-xl ${selected === 'dark' ? 'bg-muted' : null}`}
          onPress={() => setColorScheme('dark')}>
          <Text
            className={`text-base text-foreground ${selected === 'dark' ? 'font-semibold' : 'font-normal'}`}>
            Dark
          </Text>
        </Button>
      </View>
    </View>
  );
}
