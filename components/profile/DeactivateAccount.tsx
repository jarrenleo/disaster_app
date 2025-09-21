import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DeactivateAccount() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const canDeactivate = !isSaving && confirmText.trim() === 'Deactivate';

  async function handleDeactivate() {
    if (!user) return;
    try {
      setIsSaving(true);
      await user.delete();
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <View className="flex-row items-center justify-between">
        <Text className="text-base text-foreground">Deactivate account</Text>

        <Button
          variant="ghost"
          disabled={isSaving}
          onPress={() => {
            if (isEditing) {
              setIsEditing(false);
              setConfirmText('');
            } else {
              setIsEditing(true);
            }
          }}>
          <Text className="text-base font-medium text-foreground underline">
            {isEditing ? 'Cancel' : 'Deactivate'}
          </Text>
        </Button>
      </View>

      {isEditing ? (
        <>
          <Text className="mb-2 text-sm text-muted-foreground">
            This will permanently delete your account and data. Type{' '}
            <Text className="font-bold">Deactivate</Text> to confirm.
          </Text>
          <Input
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="Deactivate"
            className="mb-3 mt-1.5"
          />
          <Button
            variant="destructive"
            disabled={!canDeactivate}
            onPress={handleDeactivate}
            className="text-foreground">
            <Text className="text-base font-medium">
              {isSaving ? 'Deactivating…' : 'Deactivate account'}
            </Text>
          </Button>
        </>
      ) : (
        <Text className="text-sm text-muted-foreground">Permanently delete your account</Text>
      )}
    </>
  );
}
