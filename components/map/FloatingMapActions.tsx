import Animated from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Crosshair, AlertTriangle, RefreshCw } from 'lucide-react-native';

type FloatingMapActionsProps = {
  animatedStyle: any;
  hasPermission: boolean | null;
  onRefresh: () => void;
  onCenter: () => void;
  onReport: () => void;
};

export function FloatingMapActions({
  animatedStyle,
  hasPermission,
  onRefresh,
  onCenter,
  onReport,
}: FloatingMapActionsProps) {
  return (
    <Animated.View className="absolute right-4 gap-3" style={[animatedStyle, { zIndex: 100 }]}>
      <Button
        variant="secondary"
        size="icon"
        className="h-12 w-12 rounded-full bg-background/90 dark:bg-background/70"
        accessibilityLabel="Refresh reports"
        onPress={onRefresh}>
        <Icon as={RefreshCw} size={18} />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-12 w-12 rounded-full bg-background/90 dark:bg-background/70"
        onPress={onCenter}
        disabled={!hasPermission}
        accessibilityLabel="Center on my location">
        <Icon as={Crosshair} size={20} />
      </Button>
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-primary"
        accessibilityLabel="Report a disaster sighting"
        onPress={onReport}>
        <Icon as={AlertTriangle} size={20} />
      </Button>
    </Animated.View>
  );
}
