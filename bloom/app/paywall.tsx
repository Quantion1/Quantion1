import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mascot } from '@/components/Mascot';
import { Body, Button3D, Heading, Label, success, tap } from '@/components/ui';
import { useStore, usePremium } from '@/state/store';
import { palette, radius, shadow } from '@/theme';

type Plan = 'monthly' | 'annual' | 'lifetime';

const PLANS: { id: Plan; title: string; price: string; per: string; note?: string; badge?: string }[] = [
  { id: 'monthly', title: 'Monthly', price: '€7.99', per: 'per month', note: 'Cancel any time' },
  { id: 'annual', title: 'Annual', price: '€49.99', per: '€4.16 / month', note: '7-day free trial', badge: 'SAVE 48%' },
  { id: 'lifetime', title: 'Lifetime', price: '€99', per: 'one payment', note: 'All future features' },
];

const COMPARISON: { label: string; free: string; premium: string }[] = [
  { label: 'Log feeds, sleep, diapers, symptoms', free: '✓', premium: '✓' },
  { label: 'Streaks, XP, quests and badges', free: '✓', premium: '✓' },
  { label: 'Week-by-week journey content', free: 'Current only', premium: 'All 40 weeks + 12 months' },
  { label: 'History', free: 'Last 7 days', premium: 'Unlimited' },
  { label: 'Analytics range', free: '7 days', premium: '30 / 90 days + all time' },
  { label: 'Sleep raster & stretch trends', free: '—', premium: '✓' },
  { label: 'Feeding balance & interval analysis', free: '—', premium: '✓' },
  { label: 'Growth vs WHO percentile curves', free: '—', premium: '✓' },
  { label: 'Doctor-ready PDF & CSV export', free: '—', premium: '✓' },
  { label: 'Multi-caregiver sharing', free: '—', premium: '✓' },
  { label: 'Unlimited streak freezes', free: '1 per month', premium: 'Unlimited' },
  { label: 'Mascot outfits & themes', free: '2', premium: 'All' },
];

export default function Paywall() {
  const router = useRouter();
  const premium = usePremium();
  const setPremium = useStore((s) => s.setPremium);
  const cancelPremium = useStore((s) => s.cancelPremium);
  const [plan, setPlan] = useState<Plan>('annual');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[palette.grape, palette.blossom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 54, paddingBottom: 28, paddingHorizontal: 20, alignItems: 'center', gap: 8 }}
        >
          <Pressable
            onPress={() => {
              tap();
              router.back();
            }}
            style={{ position: 'absolute', top: 14, right: 18 }}
            hitSlop={14}
          >
            <Text style={{ fontSize: 24, color: palette.white, fontWeight: '900' }}>✕</Text>
          </Pressable>
          <Mascot size={100} mood="cheer" />
          <Text style={{ fontSize: 30, fontWeight: '900', color: palette.white, letterSpacing: -0.6 }}>Bloom Premium</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: 300 }}>
            You already do the hard part. Premium turns all that logging into answers.
          </Text>
        </LinearGradient>

        <View style={{ padding: 20, gap: 18 }}>
          {premium ? (
            <View style={{ backgroundColor: palette.mintSoft, borderRadius: radius.lg, padding: 18, gap: 10 }}>
              <Heading>👑 Premium is active</Heading>
              <Body>Every chart, range and export is unlocked. Thanks for supporting Bloom.</Body>
              <Button3D title="Cancel (demo)" tone="neutral" full onPress={() => cancelPremium()} />
            </View>
          ) : (
            <>
              {/* plans */}
              <View style={{ gap: 10 }}>
                {PLANS.map((p) => {
                  const active = plan === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => {
                        tap();
                        setPlan(p.id);
                      }}
                      style={{
                        borderRadius: radius.lg,
                        borderWidth: 3,
                        borderColor: active ? palette.grape : palette.line,
                        backgroundColor: active ? palette.grapeSoft : palette.white,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        ...shadow.card,
                      }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          borderWidth: 3,
                          borderColor: active ? palette.grape : palette.line,
                          backgroundColor: active ? palette.grape : 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {active && <Text style={{ color: palette.white, fontSize: 12, fontWeight: '900' }}>✓</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontSize: 16, fontWeight: '900', color: palette.ink }}>{p.title}</Text>
                          {!!p.badge && (
                            <View style={{ backgroundColor: palette.sunny, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 }}>
                              <Text style={{ fontSize: 10, fontWeight: '900', color: palette.white }}>{p.badge}</Text>
                            </View>
                          )}
                        </View>
                        {!!p.note && <Text style={{ fontSize: 12, fontWeight: '700', color: palette.inkSoft }}>{p.note}</Text>}
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, fontWeight: '900', color: palette.ink }}>{p.price}</Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: palette.inkFaint }}>{p.per}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <Button3D
                title={plan === 'annual' ? 'Start 7-day free trial' : 'Unlock Premium'}
                tone="grape"
                size="lg"
                full
                icon="👑"
                onPress={() => {
                  setPremium(plan);
                  success();
                  router.back();
                }}
              />
              <Text style={{ fontSize: 11, fontWeight: '700', color: palette.inkFaint, textAlign: 'center' }}>
                Prototype only — no payment is taken. In production this is wired to App Store / Play Billing.
              </Text>
            </>
          )}

          {/* comparison */}
          <View style={{ gap: 10 }}>
            <Label>Free vs Premium</Label>
            <View style={{ borderRadius: radius.lg, borderWidth: 2, borderColor: palette.line, overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row', backgroundColor: palette.cloud, paddingVertical: 10, paddingHorizontal: 12 }}>
                <Text style={{ flex: 1, fontSize: 11, fontWeight: '900', color: palette.inkFaint }}>FEATURE</Text>
                <Text style={{ width: 76, fontSize: 11, fontWeight: '900', color: palette.inkFaint, textAlign: 'center' }}>FREE</Text>
                <Text style={{ width: 88, fontSize: 11, fontWeight: '900', color: palette.grapeDark, textAlign: 'center' }}>PREMIUM</Text>
              </View>
              {COMPARISON.map((row, i) => (
                <View
                  key={row.label}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 11,
                    paddingHorizontal: 12,
                    backgroundColor: i % 2 ? palette.white : '#FCFBFE',
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 12, fontWeight: '700', color: palette.ink }}>{row.label}</Text>
                  <Text style={{ width: 76, fontSize: 11, fontWeight: '800', color: palette.inkFaint, textAlign: 'center' }}>{row.free}</Text>
                  <Text style={{ width: 88, fontSize: 11, fontWeight: '900', color: palette.grapeDark, textAlign: 'center' }}>{row.premium}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ backgroundColor: palette.cloud, borderRadius: radius.lg, padding: 16, gap: 6 }}>
            <Heading>Why we charge</Heading>
            <Body style={{ fontSize: 13 }}>
              Bloom has no ads and sells nothing about you or your baby. Premium is what pays for it. Core tracking stays
              free forever — you should never lose access to your own records.
            </Body>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
