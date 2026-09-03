import React from 'react';
import { Modal, View } from 'react-native';
import { create } from 'zustand';

import { palette, radius, shadow } from '@/theme';
import { Body, Button, Title } from './ui';

export interface ConfirmButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface ConfirmState {
  open?: { title: string; message?: string; buttons: ConfirmButton[] };
  ask: (title: string, message: string | undefined, buttons: ConfirmButton[]) => void;
  close: () => void;
}

const useConfirmStore = create<ConfirmState>((set) => ({
  ask: (title, message, buttons) => set({ open: { title, message, buttons } }),
  close: () => set({ open: undefined }),
}));

/**
 * Same shape as RN's Alert.alert, but React Native Web's Alert is a no-op stub —
 * every confirmation silently did nothing in the browser. This renders a real
 * dialog on every platform instead.
 */
export function confirmAlert(title: string, message?: string, buttons: ConfirmButton[] = [{ text: 'OK' }]) {
  useConfirmStore.getState().ask(title, message, buttons);
}

/** Mounted once at the root; there is only ever one dialog on screen. */
export function ConfirmDialog() {
  const open = useConfirmStore((s) => s.open);
  const close = useConfirmStore((s) => s.close);

  if (!open) return null;

  const press = (b: ConfirmButton) => {
    close();
    b.onPress?.();
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={close}>
      <View style={{ flex: 1, backgroundColor: palette.backdrop, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <View style={[{ backgroundColor: palette.card, borderRadius: radius.xl, padding: 24, gap: 10, width: '100%', maxWidth: 340 }, shadow.lift]}>
          <Title>{open.title}</Title>
          {!!open.message && <Body>{open.message}</Body>}
          <View style={{ gap: 8, marginTop: 6 }}>
            {open.buttons.map((b) => (
              <Button
                key={b.text}
                title={b.text}
                tone={b.style === 'destructive' ? 'danger' : b.style === 'cancel' ? 'ghost' : 'ink'}
                full
                onPress={() => press(b)}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
