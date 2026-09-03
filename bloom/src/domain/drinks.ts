import type { ComponentType } from 'react';

import { WaterBottle } from '@/components/icons';

export interface Drink {
  id: string;
  /** Used unless `icon` is set. */
  emoji?: string;
  /** For a vessel no emoji represents — drawn at whatever size the caller asks for. */
  icon?: ComponentType<{ size?: number; color?: string }>;
  label: string;
  ml: number;
}

export const DRINKS: Drink[] = [
  { id: 'glass', emoji: '🥛', label: 'Glass', ml: 200 },
  { id: 'mug', emoji: '☕', label: 'Mug', ml: 250 },
  { id: 'bottle', icon: WaterBottle, label: 'Bottle', ml: 500 },
  { id: 'stanley', emoji: '🥤', label: 'The big one', ml: 1200 },
];
