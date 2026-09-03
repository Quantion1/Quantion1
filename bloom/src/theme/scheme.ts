import { useColorScheme } from 'react-native';

import { useStore } from '@/state/store';
import { applyScheme, type SchemeName } from './index';

/**
 * Puts the right scheme in place and keeps this component re-rendering whenever
 * the preference changes.
 *
 * Styles read colours straight off `palette` while they render, so the active
 * scheme has to be correct *before* any child renders — which is why the switch
 * happens here in the render pass rather than in an effect afterwards. It is a
 * plain idempotent assignment derived from state, so running it on every render
 * costs nothing and can never leave the tree half-repainted.
 *
 * Call it from every screen: subscribing there is what makes that screen (and
 * everything it renders) repaint the moment the theme changes.
 */
export function useScheme(): SchemeName {
  const pref = useStore((s) => s.settings.theme);
  const system = useColorScheme();
  // Anything other than an explicit 'dark' — including a store saved before this
  // setting existed — follows the phone.
  const resolved: SchemeName =
    pref === 'dark' ? 'dark' : pref === 'light' ? 'light' : system === 'dark' ? 'dark' : 'light';
  applyScheme(resolved);
  return resolved;
}
