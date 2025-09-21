import { VerifyEmailForm } from '@/components/verify-email-form';
import { ScrollView, View } from 'react-native';

export default function VerifyEmailScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="grow items-center justify-center p-4 sm:p-6"
      keyboardDismissMode="interactive">
      <View className="w-full max-w-sm">
        <VerifyEmailForm />
      </View>
    </ScrollView>
  );
}
