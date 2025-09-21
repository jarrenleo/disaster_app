import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UpdateUsername() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setUsername(user?.username || '');
  }, []);

  async function handleSave() {
    if (!user) return;

    try {
      setIsSaving(true);
      const newUsername = username.trim();
      if (!newUsername) return;

      await user.update({ username: newUsername });
      await user.reload();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className="text-base text-foreground">Username</Text>

        <Button
          variant="ghost"
          disabled={isSaving}
          onPress={() => {
            if (isEditing) {
              setIsEditing(false);
              setUsername(user?.username || '');
            } else {
              setUsername(user?.username || '');
              setIsEditing(true);
            }
          }}>
          <Text className="text-base font-medium text-foreground underline">
            {isEditing ? 'Cancel' : user?.username ? 'Edit' : 'Add'}
          </Text>
        </Button>
      </View>

      {isEditing ? (
        <>
          <Input
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter preferred username"
            className="mb-3"
          />

          <Button disabled={isSaving || !username.trim().length} onPress={handleSave}>
            <Text className="text-base font-medium">{isSaving ? 'Saving…' : 'Save'}</Text>
          </Button>
        </>
      ) : (
        <Text className="text-sm text-muted-foreground">{user?.username || 'Not provided'}</Text>
      )}
    </>
  );
}
