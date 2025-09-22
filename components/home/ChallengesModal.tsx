import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import supabase from '@/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MultipleChoiceQuiz, type Question } from './MultipleChoiceQuiz';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { CheckIcon, XIcon } from 'lucide-react-native';

type ChallengesModalProps = {
  visible: boolean;
  onClose: () => void;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ChallengesModal({ visible, onClose }: ChallengesModalProps) {
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedMonths, setCompletedMonths] = useState<Set<number>>(new Set());
  const [questionsThisMonth, setQuestionsThisMonth] = useState<Question[] | null>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizKey, setQuizKey] = useState<number>(0);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!visible || !userId) return;

      setLoading(true);
      setError(null);

      try {
        const [completedChallengesData, challengesData] = await Promise.all([
          supabase
            .from('completed_challenges')
            .select('month, year')
            .eq('user_id', userId)
            .eq('year', currentYear),
          supabase
            .from('challenges')
            .select('questions')
            .eq('year', currentYear)
            .eq('month', currentMonth)
            .limit(1),
        ]);

        if (!isMounted) return;

        // Completed months set for the current year
        if (completedChallengesData.error) {
          setError(completedChallengesData.error.message);
          setCompletedMonths(new Set());
        } else {
          const months = new Set<number>(
            (completedChallengesData.data ?? []).map((r: any) => r.month as number)
          );
          setCompletedMonths(months);
        }

        // Questions for this month
        if (challengesData.error) {
          setError((prev) => prev ?? challengesData.error.message);
          setQuestionsThisMonth(null);
        } else {
          const questions = (challengesData.data?.[0]?.questions as Question[] | undefined) ?? null;
          setQuestionsThisMonth(questions);
        }
      } catch (e: any) {
        if (!isMounted) return;

        setError(e?.message ?? 'Failed to load challenges');
        setCompletedMonths(new Set());
        setQuestionsThisMonth(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [visible, userId, currentYear, currentMonth]);

  const hasCompletedCurrentMonth = completedMonths.has(currentMonth);
  const canStartChallenge =
    !!(questionsThisMonth && questionsThisMonth.length > 0) && !hasCompletedCurrentMonth;

  function onStartChallenge() {
    if (!canStartChallenge) return;
    setShowQuiz(true);
  }

  async function handleQuizSubmit(score: number) {
    const total = questionsThisMonth?.length ?? 0;
    const passed = score >= 3;

    if (passed && userId) {
      const { error: insertError } = await supabase
        .from('completed_challenges')
        .insert({ user_id: userId, month: currentMonth, year: currentYear });

      if (insertError) {
        Alert.alert('Error', insertError.message);
        return;
      }

      setCompletedMonths((prev) => new Set<number>([...prev, currentMonth]));
      setShowQuiz(false);
      Alert.alert('Great job!', `You scored ${score}/${total}. Challenge completed!`);
    } else {
      Alert.alert('Try again', `You scored ${score}/${total}. Score at least 3/5 to pass.`);
      setQuizKey(Date.now());
    }
  }

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
          <Pressable onPress={showQuiz ? () => setShowQuiz(false) : onClose} role="button">
            <Icon as={XIcon} size={24} className="text-muted-foreground" />
          </Pressable>
          <Text className="text-lg font-semibold">Challenges</Text>
          <View className="w-6" />
        </View>
        <View className="px-6">
          <Text className="text-muted-foreground">
            Complete a challenge each month to earn points.
          </Text>
        </View>
        {showQuiz ? (
          <View className="mt-4 flex-1 px-6">
            {questionsThisMonth ? (
              <MultipleChoiceQuiz
                key={quizKey}
                questions={questionsThisMonth}
                onSubmit={handleQuizSubmit}
              />
            ) : null}
          </View>
        ) : (
          <View className="mt-6 px-6">
            <Text className="mb-4 text-xl font-semibold">{currentYear}</Text>
            {loading ? (
              <View className="flex-row items-center gap-3 py-2">
                <ActivityIndicator />
                <Text className="text-muted-foreground">Loading…</Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap">
                {MONTHS.map((month, idx) => {
                  const monthNumber = idx + 1; // 1-12
                  const isCompleted = completedMonths.has(monthNumber);
                  const isPast = monthNumber < currentMonth;
                  return (
                    <View key={month} className="mb-4 w-1/4 px-1">
                      <View className="items-center justify-center rounded-2xl bg-accent p-4">
                        <Text className="mb-2 text-base font-medium">{month}</Text>
                        {isCompleted ? (
                          <View className="h-9 w-9 items-center justify-center rounded-full bg-green-500">
                            <Icon as={CheckIcon} size={18} className="text-white" />
                          </View>
                        ) : isPast ? (
                          <View className="h-9 w-9 items-center justify-center rounded-full bg-red-500">
                            <Icon as={XIcon} size={18} className="text-white" />
                          </View>
                        ) : (
                          <View className="h-9 w-9 items-center justify-center rounded-full bg-accent">
                            <Text className="text-bold text-xl text-muted-foreground">1</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            {error ? <Text className="mt-2 text-destructive">{error}</Text> : null}
          </View>
        )}

        {!showQuiz ? (
          <View className="mt-auto px-6 pb-6">
            <Button onPress={onStartChallenge} disabled={!canStartChallenge || loading}>
              <Text>Start Challenge</Text>
            </Button>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
