import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { XIcon } from 'lucide-react-native';
import Flood from '@/assets/guides/flood.json';
import Fire from '@/assets/guides/fire.json';
import Earthquake from '@/assets/guides/earthquake.json';
import Tornado from '@/assets/guides/tornado.json';
import Hurricane from '@/assets/guides/hurricane.json';
import Landslide from '@/assets/guides/landslide.json';

type GuidesModalProps = {
  visible: boolean;
  onClose: () => void;
};

type Guide = {
  title: string;
  sections: { heading: string; items: string[] }[];
};

const GUIDE_FILES: Record<string, any> = {
  Flood,
  Fire,
  Earthquake,
  Tornado,
  Hurricane,
  Landslide,
};

const CATEGORIES = Object.keys(GUIDE_FILES);

export function GuidesModal({ visible, onClose }: GuidesModalProps) {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<string>(CATEGORIES[0]);

  const guide: Guide = GUIDE_FILES[category];

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
          <Text className="text-lg font-semibold">Guides</Text>
          <View className="w-6" />
        </View>

        <ScrollView className="flex-1 px-6">
          <View className="mb-4 flex-row flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={cat === category ? 'default' : 'outline'}
                size="sm"
                onPress={() => setCategory(cat)}>
                <Text>{cat}</Text>
              </Button>
            ))}
          </View>

          <Text className="mb-2 text-xl font-semibold">{guide.title}</Text>
          {guide.sections.map((section, i) => (
            <View key={i} className="mb-6 rounded-2xl border border-border bg-accent p-4">
              <Text className="mb-2 text-base font-semibold">{section.heading}</Text>
              <View className="gap-2">
                {section.items.map((item, idx) => (
                  <Text key={idx} className="text-muted-foreground">
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}
