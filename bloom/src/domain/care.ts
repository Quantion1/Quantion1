/**
 * The care pathway: what your health system expects of you, and roughly when.
 * One block per country — adding a country is data, not code. Windows are
 * gestational weeks during pregnancy and days since birth afterwards.
 */
export interface CareItem {
  key: string;
  emoji: string;
  label: string;
  phase: 'preg' | 'baby';
  from: number;
  to: number;
  what: string;
  tip: string;
}

export interface CareSystem {
  code: string;
  label: string;
  flag: string;
  care: string;
  note: string;
  items: CareItem[];
}

export const CARE_SYSTEMS: Record<string, CareSystem> = {
  NL: {
    code: 'NL',
    label: 'Netherlands',
    flag: '🇳🇱',
    care: 'Midwife-led (verloskundige)',
    note: 'In the Netherlands your midwife — not a hospital — leads a healthy pregnancy, and kraamzorg comes to your home after the birth.',
    items: [
      { key: 'booking', emoji: '🩺', label: 'Booking appointment with the midwife', phase: 'preg', from: 8, to: 10, what: 'Your first long visit: due date, health history, blood pressure, and who will care for you.', tip: 'Call a practice as soon as you know — the popular ones fill up months ahead.' },
      { key: 'dating', emoji: '🖥️', label: 'Dating scan (termijnecho)', phase: 'preg', from: 10, to: 13, what: 'A short ultrasound that measures the baby to fix your official due date.', tip: 'Every later window in this list is counted from the date this scan gives you.' },
      { key: 'bloods', emoji: '🩸', label: 'First blood tests', phase: 'preg', from: 10, to: 14, what: 'Blood group, rhesus factor, iron and immunity screening — one arm, one visit.', tip: 'Ask for a copy of the results; a maternity ward will ask for your blood group later.' },
      { key: 'nipt', emoji: '🧬', label: 'Screening choice made (NIPT / 13-week scan)', phase: 'preg', from: 11, to: 14, what: 'You decide whether you want prenatal screening at all. Both yes and no are complete answers.', tip: 'NIPT is a blood test you pay for yourself and must book yourself.' },
      { key: 'anomaly', emoji: '🔎', label: 'Anomaly scan (20-weken echo)', phase: 'preg', from: 19, to: 21, what: 'A careful 30-minute look at the baby\'s organs, spine, brain and growth.', tip: 'Bring someone. It is medical, not a photo session, but it is still the best show in town.' },
      { key: 'glucose', emoji: '🍬', label: 'Glucose test if offered', phase: 'preg', from: 24, to: 28, what: 'A sweet drink and two blood draws to rule out pregnancy diabetes.', tip: 'Only offered if you have a risk factor — you may skip this row entirely.' },
      { key: 'pertussis', emoji: '💉', label: '22-week whooping cough jab', phase: 'preg', from: 22, to: 32, what: 'One free vaccination that passes protection to the baby for their first months.', tip: 'Book it at the GGD or your GP — the midwife does not give it.' },
      { key: 'leave', emoji: '📝', label: 'Maternity leave filed with work', phase: 'preg', from: 24, to: 30, what: 'Leave starts 4–6 weeks before the due date; your employer needs it in writing.', tip: 'Put the last working day in the calendar too — it always arrives sooner than you think.' },
      { key: 'birthplan', emoji: '📋', label: 'Birth plan written (geboorteplan)', phase: 'preg', from: 32, to: 36, what: 'A page on pain relief, positions, who is in the room and what happens if plans change.', tip: 'One page beats ten. Anything longer nobody reads at 3am.' },
      { key: 'hospital', emoji: '🎒', label: 'Bag and home-birth kit ready', phase: 'preg', from: 34, to: 37, what: 'Hospital bag packed, or the kraampakket and bed raisers ready if you are staying home.', tip: 'Keep the bag by the door with the ID and insurance card in the outside pocket.' },
      { key: 'maternity_care', emoji: '🤝', label: 'Kraamzorg arranged', phase: 'preg', from: 30, to: 36, what: 'Home postnatal care for 8–10 days: checks on you and the baby, feeding help, and the household.', tip: 'Register early with your insurer — most people book by week 16.' },
      { key: 'register', emoji: '🗂️', label: 'Birth registered at the gemeente', phase: 'baby', from: 0, to: 5, what: 'Legally required within three working days of the birth. Brings the birth certificate.', tip: 'Someone who was not in labour can do this. Send them.' },
      { key: 'heelprick', emoji: '🦶', label: 'Heel prick and hearing test', phase: 'baby', from: 3, to: 8, what: 'A few drops of blood screen for rare conditions; the hearing test takes minutes.', tip: 'Usually comes to your home. No news within a fortnight means all clear.' },
      { key: 'insurance', emoji: '🏥', label: 'Baby added to your insurance', phase: 'baby', from: 0, to: 30, what: 'Your child is insured free, but only once you register them — within four months.', tip: 'Do it the same week; the BSN letter from the gemeente is all you need.' },
      { key: 'first_vax', emoji: '💉', label: 'First jab round at the consultatiebureau', phase: 'baby', from: 42, to: 70, what: 'Around 6–9 weeks: the first vaccinations plus a growth and development check.', tip: 'Feed during or right after — it settles them faster than anything else.' },
      { key: 'pp_check', emoji: '🩺', label: 'Six-week check for you', phase: 'baby', from: 38, to: 50, what: 'Healing, bleeding, contraception, mood and how you actually are.', tip: 'Write down your questions beforehand — the visit is shorter than you expect.' },
    ],
  },
  BE: {
    code: 'BE',
    label: 'Belgium',
    flag: '🇧🇪',
    care: 'Gynaecologist or midwife',
    note: 'Belgian care is usually gynaecologist-led with around ten consultations, plus Kind & Gezin visits after the birth.',
    items: [
      { key: 'booking', emoji: '🩺', label: 'First consultation', phase: 'preg', from: 6, to: 9, what: 'Due date, health history and your choice of gynaecologist or midwife.', tip: 'Ask what the practice charges beyond the mutualiteit refund.' },
      { key: 'bloods', emoji: '🩸', label: 'First blood tests', phase: 'preg', from: 8, to: 12, what: 'Blood group, immunity and iron.', tip: 'Keep the printout for the maternity ward.' },
      { key: 'dating', emoji: '🖥️', label: 'Dating scan', phase: 'preg', from: 11, to: 13, what: 'Confirms the due date and one baby or two.', tip: 'The 12-week scan often includes the first trimester screening.' },
      { key: 'nipt', emoji: '🧬', label: 'NIPT decision', phase: 'preg', from: 11, to: 14, what: 'Largely reimbursed in Belgium; you still choose whether to have it.', tip: 'You need a prescription first.' },
      { key: 'anomaly', emoji: '🔎', label: 'Anomaly scan', phase: 'preg', from: 19, to: 22, what: 'The detailed look at organs and growth.', tip: 'Bring someone with you.' },
      { key: 'glucose', emoji: '🍬', label: 'Glucose challenge test', phase: 'preg', from: 24, to: 28, what: 'Routinely offered to everyone here.', tip: 'Do not skip breakfast rules — read the letter.' },
      { key: 'pertussis', emoji: '💉', label: 'Whooping cough jab', phase: 'preg', from: 24, to: 32, what: 'Given in the second half of pregnancy.', tip: 'Your GP or gynaecologist can do it.' },
      { key: 'leave', emoji: '📝', label: 'Maternity leave filed', phase: 'preg', from: 24, to: 30, what: 'Pre- and postnatal leave notified to employer and mutualiteit.', tip: 'Two letters, not one.' },
      { key: 'hospital', emoji: '🎒', label: 'Hospital bag and pre-admission', phase: 'preg', from: 32, to: 36, what: 'Bag packed and the maternity file registered.', tip: 'Most hospitals want pre-admission papers in advance.' },
      { key: 'register', emoji: '🗂️', label: 'Birth declared at the commune', phase: 'baby', from: 0, to: 15, what: 'Within 15 days of the birth.', tip: 'The hospital often has a desk for this.' },
      { key: 'heelprick', emoji: '🦶', label: 'Heel prick screening', phase: 'baby', from: 3, to: 5, what: 'Done before you leave the maternity ward.', tip: 'Ask when results would reach you.' },
      { key: 'kg_visit', emoji: '🏠', label: 'Kind & Gezin / ONE home visit', phase: 'baby', from: 3, to: 14, what: 'A nurse visits to weigh the baby and answer anything.', tip: 'Save their number in your phone.' },
      { key: 'first_vax', emoji: '💉', label: 'First vaccinations', phase: 'baby', from: 56, to: 80, what: 'Around 8 weeks at the consultatiebureau or GP.', tip: 'Bring the vaccination card every time.' },
      { key: 'pp_check', emoji: '🩺', label: 'Postnatal check', phase: 'baby', from: 38, to: 50, what: 'Six-week check for your body and mood.', tip: 'Pelvic floor physio is reimbursed — ask for the referral.' },
    ],
  },
  UK: {
    code: 'UK',
    label: 'United Kingdom',
    flag: '🇬🇧',
    care: 'NHS midwife-led',
    note: 'NHS care runs on named appointments: a booking appointment, two scans and rising visit frequency near the end.',
    items: [
      { key: 'booking', emoji: '🩺', label: 'Booking appointment', phase: 'preg', from: 8, to: 10, what: 'A long first visit with your community midwife; bloods usually taken here.', tip: 'Self-refer online as soon as you know — do not wait for a GP appointment.' },
      { key: 'dating', emoji: '🖥️', label: '12-week dating scan', phase: 'preg', from: 11, to: 14, what: 'Dates the pregnancy and offers combined screening.', tip: 'Your notes and the red book start here.' },
      { key: 'anomaly', emoji: '🔎', label: '20-week anomaly scan', phase: 'preg', from: 18, to: 21, what: 'Detailed check of the baby\'s development.', tip: 'You can ask not to be told the sex.' },
      { key: 'pertussis', emoji: '💉', label: 'Whooping cough vaccine', phase: 'preg', from: 16, to: 32, what: 'Free at the GP surgery from 16 weeks.', tip: 'Flu jab too, in season.' },
      { key: 'glucose', emoji: '🍬', label: 'Glucose tolerance test if offered', phase: 'preg', from: 24, to: 28, what: 'Offered when you have a risk factor.', tip: 'Fasting — book an early slot.' },
      { key: 'mat_b1', emoji: '📝', label: 'MATB1 form and leave notified', phase: 'preg', from: 20, to: 26, what: 'The midwife gives you the MATB1; your employer needs it for pay.', tip: 'Give notice at least 15 weeks before the due date.' },
      { key: 'birthplan', emoji: '📋', label: 'Birth preferences written', phase: 'preg', from: 32, to: 36, what: 'One page in your notes about pain relief and choices.', tip: 'Discuss it at the 34-week visit.' },
      { key: 'hospital', emoji: '🎒', label: 'Hospital bag ready', phase: 'preg', from: 34, to: 37, what: 'Bag for you, bag for the baby, notes on top.', tip: 'Fit the car seat before week 37.' },
      { key: 'register', emoji: '🗂️', label: 'Birth registered', phase: 'baby', from: 0, to: 42, what: 'Within 42 days at the register office.', tip: 'Book the slot — walk-ins are rare.' },
      { key: 'heelprick', emoji: '🦶', label: 'Newborn blood spot and hearing test', phase: 'baby', from: 5, to: 8, what: 'Day-5 heel prick plus the hearing screen.', tip: 'Both often happen at home.' },
      { key: 'hv_visit', emoji: '🏠', label: 'Health visitor first visit', phase: 'baby', from: 10, to: 21, what: 'Weight, feeding and how you are doing.', tip: 'Ask them about local baby groups.' },
      { key: 'first_vax', emoji: '💉', label: '8-week vaccinations', phase: 'baby', from: 56, to: 70, what: 'First immunisations at the GP.', tip: 'Book at 6 weeks or the slots are gone.' },
      { key: 'pp_check', emoji: '🩺', label: 'GP 6-8 week postnatal check', phase: 'baby', from: 42, to: 56, what: 'Your own appointment, separate from the baby\'s.', tip: 'Say if your mood is not right — this is what it is for.' },
    ],
  },
  DE: {
    code: 'DE',
    label: 'Germany',
    flag: '🇩🇪',
    care: 'Frauenarzt with Mutterpass',
    note: 'German care revolves around the Mutterpass: check-ups every four weeks, then every two from week 32.',
    items: [
      { key: 'booking', emoji: '🩺', label: 'First visit and Mutterpass issued', phase: 'preg', from: 6, to: 9, what: 'Your yellow booklet, which every appointment gets written into.', tip: 'Carry it everywhere from now on.' },
      { key: 'dating', emoji: '🖥️', label: 'First ultrasound', phase: 'preg', from: 9, to: 12, what: 'Confirms dates and heartbeat.', tip: 'Three scans are standard here.' },
      { key: 'bloods', emoji: '🩸', label: 'Blood tests', phase: 'preg', from: 9, to: 13, what: 'Blood group, rhesus, immunity.', tip: 'Written into the Mutterpass.' },
      { key: 'anomaly', emoji: '🔎', label: 'Second screening ultrasound', phase: 'preg', from: 19, to: 22, what: 'The detailed growth and organ scan.', tip: 'The extended version may cost extra.' },
      { key: 'glucose', emoji: '🍬', label: 'Glucose test', phase: 'preg', from: 24, to: 28, what: 'Standard part of the Mutterschaftsrichtlinien.', tip: 'Covered by insurance.' },
      { key: 'pertussis', emoji: '💉', label: 'Pertussis vaccination', phase: 'preg', from: 27, to: 36, what: 'Recommended in the third trimester.', tip: 'The Frauenarzt can give it.' },
      { key: 'midwife', emoji: '🤝', label: 'Hebamme booked for aftercare', phase: 'preg', from: 20, to: 30, what: 'Home visits after the birth, covered by insurance.', tip: 'Book early — good Hebammen are gone by week 20.' },
      { key: 'kurs', emoji: '🧘', label: 'Geburtsvorbereitungskurs', phase: 'preg', from: 25, to: 34, what: 'Birth preparation course, largely reimbursed.', tip: 'Book in the second trimester.' },
      { key: 'klinik', emoji: '🎒', label: 'Clinic registration and bag', phase: 'preg', from: 32, to: 36, what: 'Anmeldung at the birth clinic plus the packed bag.', tip: 'Bring the Mutterpass to the Anmeldung.' },
      { key: 'leave', emoji: '📝', label: 'Mutterschutz notified', phase: 'preg', from: 26, to: 32, what: 'Protection starts six weeks before the due date.', tip: 'Elterngeld application can be prepared now.' },
      { key: 'register', emoji: '🗂️', label: 'Birth registered at the Standesamt', phase: 'baby', from: 0, to: 7, what: 'Within one week of the birth.', tip: 'The clinic gives you the Bescheinigung you need.' },
      { key: 'u1u2', emoji: '👶', label: 'U1 and U2 checks', phase: 'baby', from: 0, to: 10, what: 'The first two of the U-series examinations.', tip: 'U2 happens between day 3 and 10.' },
      { key: 'elterngeld', emoji: '📄', label: 'Elterngeld and Kindergeld filed', phase: 'baby', from: 0, to: 60, what: 'Both are backdated only three months.', tip: 'Do it in the first fortnight.' },
      { key: 'u3', emoji: '⚖️', label: 'U3 check', phase: 'baby', from: 28, to: 42, what: 'Weight, hips and reflexes at 4–5 weeks.', tip: 'Hip ultrasound is part of this one.' },
      { key: 'first_vax', emoji: '💉', label: 'First vaccinations', phase: 'baby', from: 56, to: 70, what: 'From 8 weeks, per STIKO schedule.', tip: 'Bring the Impfpass.' },
    ],
  },
  US: {
    code: 'US',
    label: 'United States',
    flag: '🇺🇸',
    care: 'OB-GYN or midwife practice',
    note: 'US prenatal care is roughly monthly to week 28, then fortnightly, then weekly — and insurance paperwork is part of the pathway.',
    items: [
      { key: 'booking', emoji: '🩺', label: 'First prenatal visit', phase: 'preg', from: 7, to: 10, what: 'History, labs, and confirming the pregnancy with an ultrasound.', tip: 'Check in-network status before you fall in love with a practice.' },
      { key: 'bloods', emoji: '🩸', label: 'First trimester labs', phase: 'preg', from: 8, to: 12, what: 'Blood count, blood type, immunity and infection screening.', tip: 'Ask for the patient-portal results.' },
      { key: 'nipt', emoji: '🧬', label: 'Genetic screening decision', phase: 'preg', from: 10, to: 13, what: 'NIPT and carrier screening are offered; both are optional.', tip: 'Ask what your plan actually covers first.' },
      { key: 'anatomy', emoji: '🔎', label: 'Anatomy scan', phase: 'preg', from: 18, to: 22, what: 'The long detailed ultrasound.', tip: 'Drink water and expect to wait.' },
      { key: 'glucose', emoji: '🍬', label: 'Glucose screening', phase: 'preg', from: 24, to: 28, what: 'The one-hour glucola test, routine for everyone.', tip: 'Bring a snack for afterwards.' },
      { key: 'tdap', emoji: '💉', label: 'Tdap vaccination', phase: 'preg', from: 27, to: 36, what: 'Protects the baby from whooping cough.', tip: 'Third trimester is the sweet spot.' },
      { key: 'leave', emoji: '📝', label: 'Leave and FMLA paperwork', phase: 'preg', from: 20, to: 30, what: 'HR forms, short-term disability and any state leave program.', tip: 'Start earlier than feels necessary — approvals are slow.' },
      { key: 'pediatrician', emoji: '👩‍⚕️', label: 'Pediatrician chosen', phase: 'preg', from: 28, to: 36, what: 'The hospital will ask for a name at discharge.', tip: 'Many practices do meet-and-greet visits.' },
      { key: 'hospital', emoji: '🎒', label: 'Hospital pre-registration and bag', phase: 'preg', from: 32, to: 37, what: 'Pre-register with the birth hospital and pack.', tip: 'Install the car seat — some hospitals check.' },
      { key: 'gbs', emoji: '🧫', label: 'Group B strep swab', phase: 'preg', from: 35, to: 37, what: 'A quick swab that decides on antibiotics in labour.', tip: 'Results stay valid for five weeks.' },
      { key: 'birthcert', emoji: '🗂️', label: 'Birth certificate and SSN filed', phase: 'baby', from: 0, to: 10, what: 'Usually completed with the hospital before discharge.', tip: 'Order two certified copies while you are at it.' },
      { key: 'insurance', emoji: '🏥', label: 'Baby added to insurance', phase: 'baby', from: 0, to: 30, what: 'Most plans give you a 30-day window from the birth.', tip: 'Miss it and you wait for open enrollment.' },
      { key: 'first_ped', emoji: '⚖️', label: 'First pediatric weight check', phase: 'baby', from: 2, to: 5, what: 'A 48–72 hour visit for weight and jaundice.', tip: 'Bring the discharge papers.' },
      { key: 'first_vax', emoji: '💉', label: 'Two-month well visit and vaccines', phase: 'baby', from: 56, to: 70, what: 'Growth check plus the first big round of shots.', tip: 'Ask about infant Tylenol dosing before you leave.' },
      { key: 'pp_check', emoji: '🩺', label: 'Postpartum visit', phase: 'baby', from: 21, to: 56, what: 'Guidance now says a check within 3 weeks, then a full visit by 12.', tip: 'Mood screening is part of it — answer honestly.' },
    ],
  },
  XX: {
    code: 'XX',
    label: 'Somewhere else',
    flag: '🌍',
    care: 'Generic pathway',
    note: 'A neutral schedule you can lean on until your own country is added — windows are wide on purpose.',
    items: [
      { key: 'booking', emoji: '🩺', label: 'First appointment with a care provider', phase: 'preg', from: 6, to: 12, what: 'Dates, history and who will look after you.', tip: 'Whatever the system, this is the row that unlocks the rest.' },
      { key: 'dating', emoji: '🖥️', label: 'Dating scan', phase: 'preg', from: 10, to: 14, what: 'Fixes the due date.', tip: 'Every other window counts from here.' },
      { key: 'bloods', emoji: '🩸', label: 'First blood tests', phase: 'preg', from: 8, to: 14, what: 'Blood group and basic screening.', tip: 'Keep your own copy of results.' },
      { key: 'screening', emoji: '🧬', label: 'Screening choice made', phase: 'preg', from: 10, to: 16, what: 'Whether you want prenatal screening at all.', tip: 'No is a complete answer.' },
      { key: 'anomaly', emoji: '🔎', label: 'Mid-pregnancy scan', phase: 'preg', from: 18, to: 22, what: 'The detailed look at the baby.', tip: 'Take someone with you.' },
      { key: 'vaccines', emoji: '💉', label: 'Pregnancy vaccinations', phase: 'preg', from: 20, to: 34, what: 'Whooping cough and flu where offered.', tip: 'Ask which are free where you live.' },
      { key: 'leave', emoji: '📝', label: 'Leave arranged with work', phase: 'preg', from: 20, to: 32, what: 'Dates agreed and paperwork filed.', tip: 'Earlier is always easier.' },
      { key: 'birthplan', emoji: '📋', label: 'Birth plan written', phase: 'preg', from: 30, to: 36, what: 'Preferences, and a plan B.', tip: 'Keep it to one page.' },
      { key: 'hospital', emoji: '🎒', label: 'Bag packed', phase: 'preg', from: 34, to: 38, what: 'For you and for the baby.', tip: 'By the door, not in the loft.' },
      { key: 'register', emoji: '🗂️', label: 'Birth registered', phase: 'baby', from: 0, to: 30, what: 'Whatever your local deadline is.', tip: 'Check the deadline the week the baby arrives.' },
      { key: 'newborn_screen', emoji: '🦶', label: 'Newborn screening', phase: 'baby', from: 2, to: 10, what: 'Blood spot and hearing checks.', tip: 'Ask how results are sent.' },
      { key: 'first_vax', emoji: '💉', label: 'First vaccinations', phase: 'baby', from: 42, to: 84, what: 'The first scheduled round.', tip: 'Keep the record card somewhere safe.' },
      { key: 'pp_check', emoji: '🩺', label: 'Postnatal check for you', phase: 'baby', from: 30, to: 60, what: 'Your own body and mood, not the baby\'s.', tip: 'Bring your questions in writing.' },
    ],
  },
};

export const COUNTRY_ORDER = ["NL", "BE", "UK", "DE", "US", "XX"];

export const careSystem = (code: string): CareSystem => CARE_SYSTEMS[code] ?? CARE_SYSTEMS.NL;

export type CareState = 'due' | 'soon' | 'later' | 'passed';

/** Where a care item sits relative to now. */
export function careState(item: CareItem, phase: 'preg' | 'baby', position: number): CareState {
  if (item.phase !== phase) return item.phase === 'preg' && phase === 'baby' ? 'passed' : 'later';
  if (position < item.from - 3) return 'later';
  if (position < item.from) return 'soon';
  if (position <= item.to) return 'due';
  return 'passed';
}
