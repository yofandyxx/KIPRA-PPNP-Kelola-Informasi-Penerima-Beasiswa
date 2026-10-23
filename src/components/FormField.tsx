import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface Props extends TextInputProps { label: string; error?: string; required?: boolean; helper?: string; }

export default function FormField({ label, error, required = false, helper, style, ...rest }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}{required ? <Text style={styles.required}> *</Text> : null}</Text>
      <TextInput style={[styles.input, !!error && styles.inputError, style]} placeholderTextColor={colors.textMuted} {...rest} />
      {error ? <Text style={styles.error}>{error}</Text> : helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { ...typography.caption, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 },
  required: { color: colors.red500 },
  input: { ...typography.body, color: colors.textPrimary, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: 12, minHeight: 46, textAlignVertical: 'top' },
  inputError: { borderColor: colors.red500, backgroundColor: colors.red100 },
  error: { ...typography.tiny, color: colors.red600, marginTop: 4 },
  helper: { ...typography.tiny, color: colors.textMuted, marginTop: 4 },
});