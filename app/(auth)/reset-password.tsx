import { ResetPasswordForm } from '@/components/reset-password-form';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function ResetPasswordScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="grow items-center justify-center p-4 sm:p-6"
      keyboardDismissMode="interactive">
      <View className="w-full max-w-sm">
        <ResetPasswordForm />
      </View>
    </ScrollView>
  );
}
