import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

interface Props { visible: boolean; title: string; message: string; confirmLabel?: string; cancelLabel?: string; destructive?: boolean; onConfirm: () => void; onCancel: () => void; }

export default function ConfirmDialog({ visible, title, message, confirmLabel = 'Ya', cancelLabel = 'Batal', destructive = false, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}><Text style={styles.cancelText}>{cancelLabel}</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: destructive ? colors.red600 : colors.navy900 }]} onPress={onConfirm}><Text style={styles.confirmText}>{confirmLabel}</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(7,20,38,0.45)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  card: { width: '100%', maxWidth: 400, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing['2xl'], ...shadows.elevated },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  message: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  button: { flex: 1, minHeight: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  cancel: { backgroundColor: colors.surfaceMuted },
  cancelText: { ...typography.caption, fontWeight: '700', color: colors.textSecondary },
  confirmText: { ...typography.caption, fontWeight: '700', color: colors.white },
});