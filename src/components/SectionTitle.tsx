import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

export default function SectionTitle({ title, action, style }: { title: string; action?: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md, marginTop: spacing.sm },
  title: { ...typography.h3, color: colors.textPrimary },
});