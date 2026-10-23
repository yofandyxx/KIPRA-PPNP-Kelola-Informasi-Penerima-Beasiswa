import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../constants/theme';

interface Props { children: React.ReactNode; scroll?: boolean; padded?: boolean; style?: ViewStyle; }

export default function ScreenContainer({ children, scroll = false, padded = true, style }: Props) {
  const content = <View style={[padded && styles.padded, style]}>{children}</View>;
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        ) : content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  padded: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  scrollContent: { flexGrow: 1, paddingBottom: spacing['3xl'] },
});