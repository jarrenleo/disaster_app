import { ForgotPasswordForm } from '@/components/forgot-password-form';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="grow items-center justify-center p-4 sm:p-6"
      keyboardDismissMode="interactive">
      <View className="w-full max-w-sm">
        <ForgotPasswordForm />
      </View>
    </ScrollView>
  );
}
