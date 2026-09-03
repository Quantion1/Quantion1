import React, { useRef, useState } from 'react';
import { Platform, Text, TextInput, View, type TextStyle } from 'react-native';

import { MONTHS, toDayKey } from '@/lib/date';
import { palette, radius, type } from '@/theme';

const daysInMonth = (year: number, month1: number) => new Date(year, month1, 0).getDate();

/** Reads three typed boxes as a real calendar date, or null while it is not one yet. */
function parse(d: string, m: string, y: string): Date | null {
  if (d.length === 0 || m.length === 0 || y.length < 4) return null;
  const day = Number(d);
  const month = Number(m);
  const year = Number(y);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return new Date(year, month - 1, day);
}

const spell = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

/**
 * A typed-in date: day, month, year in three boxes, exactly the way a form on
 * paper asks for it. It reports a date only once all three read as a real one
 * inside the allowed range, so a half-typed year never counts as a choice.
 */
export function DateInput({
  value, onChange, min, max, outOfRange,
}: {
  /** A YYYY-MM-DD key, or '' for nothing chosen yet. */
  value: string;
  onChange: (dayKey: string) => void;
  min?: Date;
  max?: Date;
  /** What to say when the date is real but lands outside min..max. */
  outOfRange?: string;
}) {
  const initial = value ? value.split('-') : ['', '', ''];
  const [day, setDay] = useState(initial[2] ?? '');
  const [month, setMonth] = useState(initial[1] ?? '');
  const [year, setYear] = useState(initial[0] ?? '');
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const parsed = parse(day, month, year);
  const tooEarly = !!(parsed && min && parsed < min);
  const tooLate = !!(parsed && max && parsed > max);
  const ok = !!parsed && !tooEarly && !tooLate;

  /** Every keystroke re-reads all three boxes, so the answer is never stale. */
  const push = (d: string, m: string, y: string) => {
    const next = parse(d, m, y);
    const inRange = next && !(min && next < min) && !(max && next > max);
    onChange(next && inRange ? toDayKey(next) : '');
  };

  const digits = (v: string, len: number) => v.replace(/\D/g, '').slice(0, len);

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
        <Box
          label="Day"
          value={day}
          flex={1}
          onChangeText={(v) => {
            const d = digits(v, 2);
            setDay(d);
            push(d, month, year);
            // Jump on once no second digit could follow — 5 can only be the 5th.
            if (d.length === 2 || Number(d) > 3) monthRef.current?.focus();
          }}
        />
        <Slash />
        <Box
          label="Month"
          value={month}
          flex={1}
          inputRef={monthRef}
          onChangeText={(v) => {
            const m = digits(v, 2);
            setMonth(m);
            push(day, m, year);
            if (m.length === 2 || Number(m) > 1) yearRef.current?.focus();
          }}
        />
        <Slash />
        <Box
          label="Year"
          value={year}
          flex={1.5}
          len={4}
          ph="YYYY"
          inputRef={yearRef}
          onChangeText={(v) => {
            const y = digits(v, 4);
            setYear(y);
            push(day, month, y);
          }}
        />
      </View>

      <Text style={{ ...type.small, color: ok ? palette.sage : parsed ? palette.danger : palette.inkFaint, minHeight: 18 }}>
        {ok && parsed
          ? spell(parsed)
          : parsed
            ? (outOfRange ?? 'That date is outside the range we can use.')
            : day || month || year
              ? 'Keep going — day, month and a four-digit year.'
              : 'Type it in as day, month, year.'}
      </Text>
    </View>
  );
}

function Slash() {
  return <Text style={{ ...type.body, color: palette.inkFaint, paddingBottom: 14 }}>/</Text>;
}

function Box({
  label, value, flex, inputRef, onChangeText, len = 2, ph,
}: {
  label: string;
  value: string;
  flex: number;
  inputRef?: React.RefObject<TextInput | null>;
  onChangeText: (v: string) => void;
  /** Digits this box accepts. */
  len?: number;
  ph?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ flex, gap: 5 }}>
      <Text style={{ ...type.label, color: palette.inkFaint }}>{label.toUpperCase()}</Text>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={ph ?? label.slice(0, 2).toUpperCase()}
        placeholderTextColor={palette.inkFaint}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={len}
        style={[
          {
            borderWidth: 1.5,
            borderColor: focused ? palette.dot : palette.line,
            backgroundColor: palette.card,
            borderRadius: radius.md,
            paddingVertical: 13,
            paddingHorizontal: 8,
            textAlign: 'center',
            ...type.heading,
            fontSize: 19,
            color: palette.ink,
          },
          // The border already shows focus; the browser's own ring on top of it
          // reads as a second, heavier box.
          Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : null,
        ]}
      />
    </View>
  );
}

/**
 * The clock half of the same idea: two typed boxes, hours and minutes. It
 * reports '' until both read as a real time, so a half-typed hour never counts.
 */
export function TimeInput({ value, onChange }: { value: string; onChange: (hhmm: string) => void }) {
  const initial = value ? value.split(':') : ['', ''];
  const [hour, setHour] = useState(initial[0] ?? '');
  const [minute, setMinute] = useState(initial[1] ?? '');
  const minuteRef = useRef<TextInput>(null);

  const ok = hour.length > 0 && minute.length > 0 && Number(hour) < 24 && Number(minute) < 60;

  const push = (h: string, m: string) => {
    const whole = h.length > 0 && m.length > 0 && Number(h) < 24 && Number(m) < 60;
    onChange(whole ? `${h.padStart(2, '0')}:${m.padStart(2, '0')}` : '');
  };
  const digits = (v: string) => v.replace(/\D/g, '').slice(0, 2);

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
        <Box
          label="Hour"
          value={hour}
          flex={1}
          ph="HH"
          onChangeText={(v) => {
            const h = digits(v);
            setHour(h);
            push(h, minute);
            if (h.length === 2 || Number(h) > 2) minuteRef.current?.focus();
          }}
        />
        <Text style={{ ...type.body, color: palette.inkFaint, paddingBottom: 14 }}>:</Text>
        <Box
          label="Minute"
          value={minute}
          flex={1}
          ph="MM"
          inputRef={minuteRef}
          onChangeText={(v) => {
            const m = digits(v);
            setMinute(m);
            push(hour, m);
          }}
        />
        <View style={{ flex: 1.5 }} />
      </View>
      {!ok && (hour || minute) ? (
        <Text style={{ ...type.small, color: palette.danger, minHeight: 18 }}>
          Hours run 0 to 23, minutes 0 to 59.
        </Text>
      ) : null}
    </View>
  );
}
