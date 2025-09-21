import { useState } from 'react';
import { View, Text } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function UpdatePassword() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const hasPassword = user?.passwordEnabled ?? false;
  const passwordsMatch = newPassword === confirmPassword;
  const meetsLengthRequirements = newPassword.trim().length >= 8;
  const canSave =
    !isSaving &&
    (hasPassword ? currentPassword.trim().length > 0 : true) &&
    meetsLengthRequirements &&
    passwordsMatch;

  async function handleSave() {
    if (!user) return;
    try {
      setIsSaving(true);
      const trimmedNewPassword = newPassword.trim();
      hasPassword
        ? await user.updatePassword({
            currentPassword: currentPassword.trim(),
            newPassword: trimmedNewPassword,
          })
        : await user.updatePassword({ newPassword: trimmedNewPassword });

      setIsEditing(false);
      await user.reload();

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className="text-base text-foreground">Password</Text>

        <Button
          variant="ghost"
          disabled={isSaving}
          onPress={() => {
            if (isEditing) {
              setIsEditing(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            } else {
              setIsEditing(true);
            }
          }}>
          <Text className="text-base font-medium text-foreground underline">
            {isEditing ? 'Cancel' : hasPassword ? 'Edit' : 'Add'}
          </Text>
        </Button>
      </View>

      {isEditing ? (
        <>
          {hasPassword && (
            <Input
              value={currentPassword}
              onChangeText={setCurrentPassword}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              placeholder="Current password"
              className="mb-3"
            />
          )}
          <Input
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            placeholder="New password (min 8 chars)"
            className="mb-3"
          />
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            placeholder="Confirm new password"
            className="mb-3"
          />

          <Button disabled={!canSave} onPress={handleSave}>
            <Text className="text-base font-medium">{isSaving ? 'Saving…' : 'Save'}</Text>
          </Button>
        </>
      ) : (
        <Text className="text-sm text-muted-foreground">
          {hasPassword ? '********' : 'Not provided'}
        </Text>
      )}
    </>
  );
}
