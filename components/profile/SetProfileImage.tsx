import { useState } from 'react';
import { View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { Button } from '@/components/ui/button';
import { Image } from 'expo-image';

export default function SetProfileImage() {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();

  async function handlePickImage() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1.0,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];
      if (!asset.uri) return;

      setIsUploading(true);
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      if (!user) return;
      await user.setProfileImage({ file: blob });
      await user.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <View className="flex-row items-center justify-between">
        <Text className="mb-2 text-base text-foreground">Profile image</Text>

        <Button variant="ghost" disabled={isUploading} onPress={handlePickImage}>
          <Text className="text-base font-medium text-foreground underline">Edit</Text>
        </Button>
      </View>

      <Image
        source={user?.imageUrl}
        style={{ width: 80, height: 80, borderRadius: 9999 }}
        contentFit="cover"
      />
    </>
  );
}
