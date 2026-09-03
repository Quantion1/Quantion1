import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Dot } from '@/components/Dot';
import { Body, Button, Card, Heading, Label, Small, Title, ping, tap } from '@/components/ui';
import { usePremium, useStore } from '@/state/store';
import { palette, radius, shadow, type } from '@/theme';
import { useScheme } from '@/theme/scheme';

type Plan = 'monthly' | 'annual' | 'lifetime';

const PLANS: { id: Plan; title: string; price: string; per: string; note?: string; badge?: string }[] = [
  { id: 'monthly', title: 'Monthly', price: '€6.99', per: 'per month', note: 'Stop whenever' },
  { id: 'annual', title: 'Annual', price: '€44.99', per: '€3.75 a month', note: '14 days free first', badge: 'SAVE 46%' },
  { id: 'lifetime', title: 'Once', price: '€89', per: 'and never again', note: 'Everything, including what comes later' },
];

const ROWS: [string, string, string][] = [
  ['Every tracker, unlimited logs', 'Yes', 'Yes'],
  ['Moments, badges and Dot', 'All', 'All'],
  ['Weekly cards', 'The Veg Aisle', 'Every pack'],
  ['Insights range', '7 days', '30 · 90 days'],
  ['Read-outs', 'First two', 'All'],
  ['Sleep raster & stretch trend', '—', 'Yes'],
  ['Feeding balance & intervals', '—', 'Yes'],
  ['Weight against WHO band', '—', 'Yes'],
  ['Daily review', 'Yes', 'Yes'],
  ['Photos', '12', 'Unlimited'],
  ['PDF and CSV export', '—', 'Yes'],
  ['A second carer on the same baby', '—', 'Yes'],
];

export default function Paywall() {
  // Repaints this screen (and everything under it) when the theme changes.
  useScheme();
  const router = useRouter();
  const premium = usePremium();
  const setPremium = useStore((s) => s.setPremium);
  const cancelPremium = useStore((s) => s.cancelPremium);
  const [plan, setPlan] = useState<Plan>('annual');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.paper }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: palette.dotSoft, paddingTop: 52, paddingBottom: 26, paddingHorizontal: 24, alignItems: 'center', gap: 8 }}>
          <Pressable onPress={() => { tap(); router.back(); }} style={{ position: 'absolute', top: 16, right: 20 }} hitSlop={14}>
            <Text style={{ fontSize: 20, color: palette.inkSoft }}>✕</Text>
          </Pressable>
          <Dot stage="sit" size={120} />
          <Title style={{ fontSize: 26 }}>Nest, in full</Title>
          <Body style={{ textAlign: 'center', maxWidth: 300 }}>
            You already do the hard part at three in the morning. Premium is what turns all that logging into answers.
          </Body>
        </View>

        <View style={{ padding: 20, gap: 18 }}>
          {premium ? (
            <Card tint={palette.sageSoft}>
              <Heading>Premium is on</Heading>
              <Body style={{ marginTop: 4, marginBottom: 12 }}>Every range, every pack, every chart. Thank you.</Body>
              <Button title="Turn it off (demo)" tone="quiet" full onPress={() => cancelPremium()} />
            </Card>
          ) : (
            <>
              <View style={{ gap: 10 }}>
                {PLANS.map((p) => {
                  const on = plan === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => { tap(); setPlan(p.id); }}
                      style={[
                        {
                          borderRadius: radius.lg, borderWidth: 2,
                          borderColor: on ? palette.dot : palette.line,
                          backgroundColor: on ? palette.dotSoft : palette.card,
                          padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
                        },
                        shadow.rest,
                      ]}
                    >
                      <View
                        style={{
                          width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                          borderColor: on ? palette.dotDeep : palette.line,
                          backgroundColor: on ? palette.dotDeep : 'transparent',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {on && <Text style={{ color: palette.white, fontSize: 11 }}>✓</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ ...type.heading, fontSize: 16, color: palette.ink }}>{p.title}</Text>
                          {!!p.badge && (
                            <View style={{ backgroundColor: palette.dot, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2 }}>
                              <Text style={{ ...type.label, fontSize: 9.5, color: palette.ink }}>{p.badge}</Text>
                            </View>
                          )}
                        </View>
                        {!!p.note && <Small>{p.note}</Small>}
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ ...type.heading, fontSize: 17, color: palette.ink }}>{p.price}</Text>
                        <Small style={{ fontSize: 10.5 }}>{p.per}</Small>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <Button
                title={plan === 'annual' ? 'Start 14 days free' : 'Unlock everything'}
                tone="ink"
                size="lg"
                full
                onPress={() => { setPremium(plan); ping(); router.back(); }}
              />
              <Small style={{ textAlign: 'center' }}>
                Prototype — no payment is taken. In production this is App Store and Play Billing.
              </Small>
            </>
          )}

          <View style={{ gap: 10 }}>
            <Label>What changes</Label>
            <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: palette.line, overflow: 'hidden', backgroundColor: palette.card }}>
              <View style={{ flexDirection: 'row', backgroundColor: palette.cardSunk, paddingVertical: 9, paddingHorizontal: 12 }}>
                <Text style={{ ...type.label, flex: 1, color: palette.inkFaint }}>FEATURE</Text>
                <Text style={{ ...type.label, width: 74, textAlign: 'center', color: palette.inkFaint }}>FREE</Text>
                <Text style={{ ...type.label, width: 84, textAlign: 'center', color: palette.dotDeep }}>PREMIUM</Text>
              </View>
              {ROWS.map(([f, a, b], i) => (
                <View key={f} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderTopWidth: i ? 1 : 0, borderTopColor: palette.lineSoft }}>
                  <Text style={{ ...type.small, flex: 1, color: palette.ink }}>{f}</Text>
                  <Text style={{ ...type.small, width: 74, textAlign: 'center', color: palette.inkFaint, fontSize: 11.5 }}>{a}</Text>
                  <Text style={{ ...type.bodyMed, width: 84, textAlign: 'center', color: palette.dotDeep, fontSize: 11.5 }}>{b}</Text>
                </View>
              ))}
            </View>
          </View>

          <Card tint={palette.cardSunk}>
            <Heading>Why there's a price</Heading>
            <Body style={{ marginTop: 4, fontSize: 13.5 }}>
              No ads, and nothing about you or your baby is sold to anyone. Premium is what pays for it. Logging stays
              free forever — losing access to your own records would be indefensible.
            </Body>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
