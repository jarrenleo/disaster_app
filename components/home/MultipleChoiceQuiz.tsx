import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

export type Question = {
  question: string;
  options: Record<string, string>; // { A: '...', B: '...' }
  answer: string; // 'A'
};

type MultipleChoiceQuizProps = {
  questions: Question[];
  onSubmit: (score: number) => void;
};

export function MultipleChoiceQuiz({ questions, onSubmit }: MultipleChoiceQuizProps) {
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  function selectAnswer(index: number, key: string) {
    setAnswers((prev) => ({ ...prev, [index]: key }));
  }

  function computeScore() {
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (answers[i] && answers[i] === q.answer) score += 1;
    }

    return score;
  }

  function handleSubmit() {
    if (submitting) return;

    setSubmitting(true);

    const score = computeScore();
    onSubmit(score);

    setSubmitting(false);
  }

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 16 }}>
        {questions.map((q, index) => (
          <View key={index} className="mb-6 rounded-2xl border border-border bg-accent p-4">
            <Text className="mb-3 text-base font-semibold">
              {index + 1}. {q.question}
            </Text>
            <View className="gap-2">
              {Object.entries(q.options).map(([key, label]) => {
                const selected = answers[index] === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => selectAnswer(index, key)}
                    className={`flex-row items-center justify-between rounded-lg border px-3 py-3 ${selected ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                    role="button">
                    <Text className={`text-base ${selected ? 'text-primary' : ''}`}>
                      {key}. {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
      <View className="mt-4" style={{ marginBottom: insets.bottom + 16 }}>
        <Button onPress={handleSubmit} disabled={submitting}>
          <Text>Submit Answers</Text>
        </Button>
      </View>
    </View>
  );
}
