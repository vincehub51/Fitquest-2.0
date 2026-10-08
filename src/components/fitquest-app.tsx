import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const C = {
  background: '#121212',
  surface: '#2C2C2C',
  surfaceLight: '#3A3A3A',
  lime: '#CCFF00',
  orange: '#FF5F1F',
  white: '#FFFFFF',
  muted: '#888888',
};
const splashUsesNativeDriver = Platform.OS !== 'web';

type Tab = 'Home' | 'My Plan' | 'Session' | 'History' | 'Profile';
type IconName = keyof typeof MaterialIcons.glyphMap;
type Exercise = { name: string; sets: string; reps: string; weight: string };
type DayPlan = { day: string; label: string; rest: boolean; exercises: Exercise[] };
type SessionExercise = Exercise & { status: 'pending' | 'done' | 'skipped' };

const workoutDays: DayPlan[] = [
  {
    day: 'Mon',
    label: 'Upper\nBody',
    rest: false,
    exercises: [
      { name: 'Bench Press', sets: '4', reps: '8', weight: '70 kg' },
      { name: 'Overhead Press', sets: '3', reps: '10', weight: '40 kg' },
      { name: 'Pull-Ups', sets: '4', reps: '6', weight: 'BW' },
      { name: 'Dumbbell Row', sets: '3', reps: '12', weight: '25 kg' },
      { name: 'Tricep Dips', sets: '3', reps: '15', weight: 'BW' },
      { name: 'Bicep Curl', sets: '3', reps: '12', weight: '15 kg' },
    ],
  },
  {
    day: 'Tue',
    label: 'Upper\nBody',
    rest: false,
    exercises: [
      { name: 'Squat', sets: '4', reps: '8', weight: '80 kg' },
      { name: 'Romanian DL', sets: '3', reps: '10', weight: '60 kg' },
      { name: 'Leg Press', sets: '3', reps: '12', weight: '120 kg' },
      { name: 'Leg Curl', sets: '3', reps: '15', weight: '40 kg' },
      { name: 'Calf Raise', sets: '4', reps: '20', weight: '60 kg' },
    ],
  },
  { day: 'Wed', label: 'Rest\nDay', rest: true, exercises: [] },
  {
    day: 'Thu',
    label: 'Push\nDay',
    rest: false,
    exercises: [
      { name: 'Incline Press', sets: '4', reps: '10', weight: '60 kg' },
      { name: 'Lateral Raise', sets: '3', reps: '15', weight: '10 kg' },
      { name: 'Cable Fly', sets: '3', reps: '12', weight: '15 kg' },
      { name: 'Skull Crusher', sets: '3', reps: '12', weight: '30 kg' },
    ],
  },
  {
    day: 'Fri',
    label: 'Pull\nDay',
    rest: false,
    exercises: [
      { name: 'Deadlift', sets: '3', reps: '6', weight: '100 kg' },
      { name: 'Barbell Row', sets: '4', reps: '8', weight: '60 kg' },
      { name: 'Face Pull', sets: '3', reps: '15', weight: '20 kg' },
      { name: 'Hammer Curl', sets: '3', reps: '12', weight: '12 kg' },
    ],
  },
  { day: 'Sat', label: 'Rest\nDay', rest: true, exercises: [] },
  { day: 'Sun', label: 'Rest\nDay', rest: true, exercises: [] },
];

const initialSessionExercises: SessionExercise[] = [
  { name: 'Bench Press', sets: '4', reps: '8', weight: '70', status: 'pending' },
  { name: 'Overhead Press', sets: '3', reps: '10', weight: '40', status: 'pending' },
  { name: 'Pull-Ups', sets: '4', reps: '6', weight: 'BW', status: 'pending' },
  { name: 'Dumbbell Row', sets: '3', reps: '12', weight: '25', status: 'pending' },
  { name: 'Tricep Dips', sets: '3', reps: '15', weight: 'BW', status: 'pending' },
];

const tabs: { label: Tab; icon: IconName }[] = [
  { label: 'Home', icon: 'home' },
  { label: 'My Plan', icon: 'calendar-month' },
  { label: 'Session', icon: 'play-circle' },
  { label: 'History', icon: 'history' },
  { label: 'Profile', icon: 'person-outline' },
];

function Label({
  children,
  style,
  numberOfLines,
}: {
  children: React.ReactNode;
  style?: object;
  numberOfLines?: number;
}) {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.text, style]}>
      {children}
    </Text>
  );
}

function Icon({
  name,
  color = C.muted,
  size = 20,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return <MaterialIcons name={name} color={color} size={size} />;
}

function Splash({ onDone }: { onDone: () => void }) {
  const [animation] = useState(() => ({
    scale: new Animated.Value(0.5),
    opacity: new Animated.Value(0),
  }));
  const { scale, opacity } = animation;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: splashUsesNativeDriver }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: splashUsesNativeDriver,
        }),
      ]),
      Animated.delay(2100),
    ]);
    animation.start(({ finished }) => {
      if (finished) onDone();
    });
    return () => animation.stop();
  }, [onDone, opacity, scale]);

  return (
    <View style={styles.splash}>
      <Animated.View style={[styles.splashLogo, { opacity, transform: [{ scale }] }]}>
        <Label style={styles.splashInitials}>FQ</Label>
      </Animated.View>
      <Animated.View style={{ opacity }}>
        <Label style={styles.splashTitle}>FITQUEST</Label>
        <Label style={styles.splashSubtitle}>YOUR DIGITAL FITNESS ECOSYSTEM</Label>
      </Animated.View>
    </View>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotVisible, setForgotVisible] = useState(false);

  const submit = () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.loginContent} keyboardShouldPersistTaps="handled">
          <View style={styles.brandPill}>
            <View style={styles.onlineDot} />
            <Label style={styles.brandText}>FITQUEST</Label>
          </View>
          <Label style={styles.loginTitle}>Welcome{'\n'}Back.</Label>
          <Label style={styles.loginIntro}>
            Sign in with the credentials your coach provided.
          </Label>

          <View style={styles.loginForm}>
            <View style={styles.inputWrap}>
              <Icon name="mail-outline" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor={C.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            <View style={styles.inputWrap}>
              <Icon name="lock-outline" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={C.muted}
                secureTextEntry={secure}
                style={styles.input}
              />
              <Pressable onPress={() => setSecure(!secure)} hitSlop={10}>
                <Icon name={secure ? 'visibility-off' : 'visibility'} />
              </Pressable>
            </View>
            {!!error && <Label style={styles.errorText}>{error}</Label>}
            <Pressable style={styles.forgotLink} onPress={() => setForgotVisible(true)}>
              <Label style={styles.orangeText}>Forgot password?</Label>
            </Pressable>
            <Pressable
              style={[styles.primaryButton, styles.loginButton]}
              disabled={loading}
              onPress={submit}>
              {loading ? (
                <ActivityIndicator color={C.background} />
              ) : (
                <Label style={styles.primaryButtonText}>Sign In</Label>
              )}
            </Pressable>
          </View>
          <View style={styles.infoNote}>
            <Icon name="info-outline" size={18} />
            <Label style={styles.infoNoteText}>
              New to FitQuest? Your coach will create your account and share your login credentials.
            </Label>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <InfoModal
        visible={forgotVisible}
        title="Forgot Password?"
        message="Please contact your coach to reset your password."
        onClose={() => setForgotVisible(false)}
        showCancel={false}
      />
    </SafeAreaView>
  );
}

function InfoModal({
  visible,
  title,
  message,
  onClose,
  actionLabel = 'OK',
  onAction,
  showCancel = true,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  showCancel?: boolean;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Label style={styles.modalTitle}>{title}</Label>
          <Label style={styles.modalMessage}>{message}</Label>
          <View style={styles.modalActions}>
            {showCancel && (
              <Pressable onPress={onClose} style={styles.modalCancel}>
                <Label style={styles.mutedText}>Cancel</Label>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                onAction?.();
                onClose();
              }}
              style={styles.modalAction}>
              <Label style={styles.limeText}>{actionLabel}</Label>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function MainApp({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>('Home');
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <View style={styles.screen}>
          {tab === 'Home' && <Home onPlan={() => setTab('My Plan')} />}
          {tab === 'My Plan' && <MyPlan />}
          {tab === 'Session' && <Session />}
          {tab === 'History' && <History />}
          {tab === 'Profile' && <Profile onSignOut={onSignOut} />}
        </View>
        <View style={styles.nav}>
          {tabs.map((item) => {
            const selected = tab === item.label;
            if (item.label === 'Session') {
              return (
                <Pressable
                  key={item.label}
                  onPress={() => setTab(item.label)}
                  style={[styles.sessionNavButton, selected && styles.sessionNavSelected]}>
                  <Icon name={item.icon} color={selected ? C.white : C.orange} size={27} />
                </Pressable>
              );
            }
            return (
              <Pressable
                key={item.label}
                onPress={() => setTab(item.label)}
                style={[styles.navItem, selected && styles.navSelected]}>
                <Icon name={item.icon} color={selected ? C.lime : C.muted} size={22} />
                <Label style={[styles.navLabel, selected && styles.limeText]}>{item.label}</Label>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function Home({ onPlan }: { onPlan: () => void }) {
  const exercises = workoutDays[0].exercises.slice(0, 4);
  return (
    <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
      <View style={styles.greetingRow}>
        <View>
          <Label style={styles.mutedText}>Good morning,</Label>
          <Label style={styles.greetingName}>Erl Yves 👋</Label>
        </View>
        <View style={styles.coachPill}>
          <Icon name="sports" color={C.orange} size={15} />
          <Label style={styles.coachText}>Coach: Whelster</Label>
        </View>
      </View>
      <View style={styles.notification}>
        <Icon name="notifications-active" color={C.orange} size={18} />
        <Label style={styles.notificationText}>
          Coach assigned you a new plan: &quot;Phase 2 Hypertrophy&quot;
        </Label>
        <Label style={styles.notificationTime}>2h ago</Label>
      </View>
      <View style={styles.todayCard}>
        <View style={styles.todayCardTop}>
          <Label style={styles.dayBadge}>DAY 3 · WEEK 2</Label>
          <Label style={styles.phaseText}>Phase 2 Hypertrophy</Label>
        </View>
        <Label style={styles.workoutTitle}>Upper Body{'\n'}Strength</Label>
        <View style={styles.workoutMeta}>
          <Meta icon="timer" text="45 min" />
          <Meta icon="fitness-center" text="6 exercises" />
          <Meta icon="local-fire-department" text="~320 kcal" />
        </View>
      </View>
      <View style={styles.statsRow}>
        <Stat label="Plan Progress" value="38%" color={C.lime} />
        <Stat label="Sessions Done" value="9" color={C.orange} />
        <Stat label="Streak" value="7d" color={C.lime} />
      </View>
      <View style={styles.sectionHeader}>
        <Label style={styles.sectionTitle}>Today&apos;s Exercises</Label>
        <Pressable onPress={onPlan}>
          <Label style={styles.limeText}>View full plan ›</Label>
        </Pressable>
      </View>
      {exercises.map((exercise) => (
        <View key={exercise.name} style={styles.homeExercise}>
          <View style={styles.exerciseIcon}>
            <Icon name="fitness-center" color={C.lime} size={18} />
          </View>
          <Label style={styles.exerciseName} numberOfLines={1}>{exercise.name}</Label>
          <Label style={styles.mutedText}>{exercise.sets}×{exercise.reps}</Label>
          <Label style={styles.weightBadge}>{exercise.weight}</Label>
        </View>
      ))}
    </ScrollView>
  );
}

function Meta({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.metaItem}>
      <Icon name={icon} size={13} />
      <Label style={styles.metaText}>{text}</Label>
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Label style={[styles.statValue, { color }]}>{value}</Label>
      <Label style={styles.statLabel}>{label}</Label>
    </View>
  );
}

function MyPlan() {
  const [selectedDay, setSelectedDay] = useState(1);
  const selected = workoutDays[selectedDay];
  return (
    <View style={styles.flex}>
      <View style={styles.planHeader}>
        <Label style={styles.pageTitle}>My Plan</Label>
        <View style={styles.readOnlyRow}>
          <Icon name="lock-outline" size={13} />
          <Label style={styles.caption}>Assigned by Coach Whelster — read only</Label>
        </View>
        <Label style={styles.phaseBadge}>Phase 2 Hypertrophy · Week 2 of 8</Label>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroller}>
          {workoutDays.map((day, index) => {
            const active = selectedDay === index;
            return (
              <Pressable
                key={day.day}
                onPress={() => setSelectedDay(index)}
                style={[styles.dayTile, active && !day.rest && styles.dayTileActive]}>
                <Label style={[styles.dayName, active && !day.rest && styles.darkText]}>{day.day}</Label>
                <Icon
                  name={day.rest ? 'hotel' : 'bolt'}
                  color={active && !day.rest ? C.background : C.muted}
                  size={14}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      {selected.rest ? (
        <View style={styles.restPrompt}>
          <View style={styles.restIcon}><Icon name="hotel" size={36} /></View>
          <Label style={styles.restTitle}>Rest Day</Label>
          <Label style={styles.mutedText}>Recovery is part of the program.</Label>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.planList} showsVerticalScrollIndicator={false}>
          {selected.exercises.map((exercise, index) => (
            <View key={exercise.name} style={styles.planExercise}>
              <View style={styles.numberIcon}><Label style={styles.numberText}>{index + 1}</Label></View>
              <Label style={styles.planExerciseName} numberOfLines={1}>{exercise.name}</Label>
              <View style={styles.exerciseDetails}>
                <Label style={styles.exerciseDetailText}>{exercise.sets} sets × {exercise.reps} reps</Label>
                <Label style={styles.planWeight}>{exercise.weight}</Label>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function Session() {
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [items, setItems] = useState<SessionExercise[]>(initialSessionExercises);
  const [finishVisible, setFinishVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const completedCount = items.filter((item) => item.status === 'done').length;
  const timer = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (!started) return undefined;
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [started]);

  const updateItem = (index: number, update: Partial<SessionExercise>) => {
    setItems((current) => current.map((item, i) => i === index ? { ...item, ...update } : item));
  };

  return (
    <View style={styles.flex}>
      <View style={styles.sessionHeader}>
        <View style={styles.flex}>
          <Label style={styles.sessionTitle}>Workout Session</Label>
          <Label style={styles.mutedText}>Upper Body Strength · Day 3</Label>
        </View>
        {started && (
          <Pressable onPress={() => setFinishVisible(true)} style={styles.finishChip}>
            <Label style={styles.orangeText}>Finish</Label>
          </Pressable>
        )}
      </View>
      {started && (
        <View style={styles.timerBar}>
          <View style={styles.timerLeft}>
            <Icon name="timer" color={C.orange} size={18} />
            <Label style={styles.timerText}>{timer}</Label>
          </View>
          <View style={styles.timerLeft}>
            <View style={styles.onlineDot} />
            <Label style={styles.mutedText}>{completedCount}/{items.length} done</Label>
          </View>
        </View>
      )}
      {!started ? (
        <View style={styles.startPrompt}>
          <View style={styles.startIcon}><Icon name="play-arrow" color={C.orange} size={44} /></View>
          <Label style={styles.restTitle}>Ready to train?</Label>
          <Label style={styles.startDescription}>
            Start your session to log sets, reps, and weight in real time.
          </Label>
          <Pressable style={styles.startButton} onPress={() => { setSaved(false); setStarted(true); }}>
            <Icon name="play-arrow" color={C.white} size={22} />
            <Label style={styles.startButtonText}>Start Session</Label>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.sessionList} keyboardShouldPersistTaps="handled">
            {items.map((item, index) => (
              <SessionCard
                key={item.name}
                index={index}
                item={item}
                onChange={(update) => updateItem(index, update)}
              />
            ))}
          </ScrollView>
          <View style={styles.finishButtonWrap}>
            <Pressable style={styles.primaryButton} onPress={() => setFinishVisible(true)}>
              <Label style={styles.primaryButtonText}>Finish & Save Session</Label>
            </Pressable>
            {saved && <Label style={styles.savedMessage}>Session saved!</Label>}
          </View>
        </>
      )}
      <InfoModal
        visible={finishVisible}
        title="Finish Session?"
        message={`${completedCount} of ${items.length} exercises completed.\nDuration: ${timer}`}
        actionLabel="Save"
        onClose={() => setFinishVisible(false)}
        onAction={() => setSaved(true)}
      />
    </View>
  );
}

function SessionCard({
  item,
  index,
  onChange,
}: {
  item: SessionExercise;
  index: number;
  onChange: (update: Partial<SessionExercise>) => void;
}) {
  const borderColor = item.status === 'done' ? C.lime : item.status === 'skipped' ? C.orange : 'transparent';
  const toggleStatus = (status: 'done' | 'skipped') => {
    onChange({ status: item.status === status ? 'pending' : status });
  };
  return (
    <View style={[styles.sessionCard, { borderColor }]}>
      <View style={styles.sessionCardHead}>
        <View style={styles.smallNumber}><Label style={styles.numberText}>{index + 1}</Label></View>
        <Label style={styles.sessionExerciseName} numberOfLines={1}>{item.name}</Label>
        <Label style={styles.sessionPlanText}>
          Plan: {initialSessionExercises[index].sets}×{initialSessionExercises[index].reps} @ {initialSessionExercises[index].weight}
        </Label>
      </View>
      <View style={styles.logFields}>
        <LogInput label="Sets" value={item.sets} onChangeText={(sets) => onChange({ sets })} />
        <LogInput label="Reps" value={item.reps} onChangeText={(reps) => onChange({ reps })} />
        <LogInput label="Weight" value={item.weight} onChangeText={(weight) => onChange({ weight })} />
      </View>
      <View style={styles.statusButtons}>
        <Pressable
          onPress={() => toggleStatus('done')}
          style={[styles.statusButton, item.status === 'done' && styles.doneStatus]}>
          <Icon name="check-circle" color={item.status === 'done' ? C.lime : C.muted} size={16} />
          <Label style={[styles.statusLabel, item.status === 'done' && styles.limeText]}>Done</Label>
        </Pressable>
        <Pressable
          onPress={() => toggleStatus('skipped')}
          style={[styles.statusButton, item.status === 'skipped' && styles.skippedStatus]}>
          <Icon name="skip-next" color={item.status === 'skipped' ? C.orange : C.muted} size={16} />
          <Label style={[styles.statusLabel, item.status === 'skipped' && styles.orangeText]}>Skip</Label>
        </Pressable>
      </View>
    </View>
  );
}

function LogInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.logInputContainer}>
      <Label style={styles.logLabel}>{label}</Label>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.logInput}
        textAlign="center"
        selectTextOnFocus
      />
    </View>
  );
}

const historyRows = [
  { date: 'Today', name: 'Upper Body Strength', duration: '45 min', status: 'In Progress', done: 2, total: 6 },
  { date: 'Apr 4, 2026', name: 'Leg Day', duration: '52 min', status: 'Completed', done: 5, total: 5 },
  { date: 'Apr 3, 2026', name: 'Push Day', duration: '38 min', status: 'Completed', done: 4, total: 4 },
  { date: 'Apr 2, 2026', name: 'Rest Day', duration: '—', status: 'Rest', done: 0, total: 0 },
  { date: 'Apr 1, 2026', name: 'Pull Day', duration: '60 min', status: 'Completed', done: 4, total: 4 },
  { date: 'Mar 31, 2026', name: 'Upper Body Strength', duration: '48 min', status: 'Completed', done: 6, total: 6 },
  { date: 'Mar 30, 2026', name: 'Leg Day', duration: '55 min', status: 'Partial', done: 3, total: 5 },
  { date: 'Mar 29, 2026', name: 'Rest Day', duration: '—', status: 'Rest', done: 0, total: 0 },
];

function History() {
  return (
    <View style={styles.flex}>
      <View style={styles.historyHeader}>
        <Label style={styles.pageTitle}>History</Label>
        <View style={styles.historyStats}>
          <SummaryChip value="9" label="Sessions" color={C.lime} />
          <SummaryChip value="7" label="Day Streak" color={C.orange} />
          <SummaryChip value="38%" label="Plan Done" color={C.lime} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.historyList} showsVerticalScrollIndicator={false}>
        {historyRows.map((row) => {
          const rest = row.status === 'Rest';
          const statusColor = row.status === 'Completed' ? C.lime : row.status === 'Rest' ? C.muted : C.orange;
          return (
            <View key={`${row.date}-${row.name}`} style={styles.historyCard}>
              <View style={[styles.historyIcon, rest && styles.historyRestIcon]}>
                <Icon name={rest ? 'hotel' : 'fitness-center'} color={rest ? C.muted : statusColor} size={20} />
              </View>
              <View style={styles.historyMain}>
                <Label style={styles.historyName}>{row.name}</Label>
                <Label style={styles.historyDate}>{row.date}</Label>
              </View>
              <View style={styles.historyRight}>
                <Label style={[styles.statusPill, { color: statusColor, backgroundColor: `${statusColor}1A` }]}>
                  {row.status}
                </Label>
                <Label style={styles.historyDate}>{row.duration}</Label>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function SummaryChip({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={styles.summaryChip}>
      <Label style={[styles.summaryValue, { color }]}>{value}</Label>
      <Label style={styles.summaryLabel}>{label}</Label>
    </View>
  );
}

function Profile({ onSignOut }: { onSignOut: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.profileContent} showsVerticalScrollIndicator={false}>
      <Label style={styles.pageTitle}>My Profile</Label>
      <View style={styles.readOnlyRow}>
        <Icon name="lock-outline" size={13} />
        <Label style={styles.caption}>Managed by Coach Whelster</Label>
      </View>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Label style={styles.avatarText}>EY</Label></View>
        <View style={styles.profileDetails}>
          <Label style={styles.profileName}>Erl Yves Tagaro</Label>
          <Label style={styles.profileSubtext}>erl@fitquest.com</Label>
          <Label style={styles.profileSubtext}>+63 912 345 6789</Label>
        </View>
      </View>
      <ProfileSection title="Body Metrics">
        <View style={styles.metricsGrid}>
          {[
            ['72 kg', 'Weight'],
            ['175 cm', 'Height'],
            ['18%', 'Body Fat'],
            ['23.5', 'BMI'],
          ].map(([value, label]) => (
            <View key={label} style={styles.metricCard}>
              <Label style={styles.metricValue}>{value}</Label>
              <Label style={styles.caption}>{label}</Label>
            </View>
          ))}
        </View>
      </ProfileSection>
      <ProfileSection title="Fitness Goal & Status">
        <InfoRows rows={[
          ['Goal', 'Build Muscle & Increase Strength'],
          ['Status', 'Active — Phase 2 Hypertrophy'],
          ['Plan Progress', '38% complete'],
        ]} />
      </ProfileSection>
      <ProfileSection title="Dietary Preferences">
        <InfoRows rows={[
          ['Diet Type', 'High Protein'],
          ['Allergies', 'None'],
          ['Daily Calories', '2,800 kcal target'],
          ['Water Intake', '3.0 L / day'],
        ]} />
      </ProfileSection>
      <Pressable style={styles.signOutButton} onPress={onSignOut}>
        <Icon name="logout" color={C.orange} size={18} />
        <Label style={styles.orangeText}>Sign Out</Label>
      </Pressable>
    </ScrollView>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.profileSection}>
      <Label style={styles.profileSectionTitle}>{title}</Label>
      {children}
    </View>
  );
}

function InfoRows({ rows }: { rows: [string, string][] }) {
  return (
    <View style={styles.infoRows}>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.infoRow}>
          <Label style={styles.infoRowLabel}>{label}</Label>
          <Label style={styles.infoRowValue}>{value}</Label>
        </View>
      ))}
    </View>
  );
}

export default function FitQuestApp() {
  const [screen, setScreen] = useState<'splash' | 'login' | 'app'>('splash');
  const [signedIn, setSignedIn] = useState(false);
  const finishSplash = useMemo(() => () => setScreen('login'), []);

  return (
    <View style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={C.background} />
      {screen === 'splash' && <Splash onDone={finishSplash} />}
      {screen === 'login' && (
        <Login
          onLogin={() => {
            setSignedIn(true);
            setScreen('app');
          }}
        />
      )}
      {screen === 'app' && signedIn && (
        <MainApp onSignOut={() => { setSignedIn(false); setScreen('login'); }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.background },
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: C.background },
  screen: { flex: 1, backgroundColor: C.background },
  text: { color: C.white, fontFamily: Platform.OS === 'web' ? 'Arial' : 'Roboto' },
  splash: { flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' },
  splashLogo: {
    width: 96, height: 96, borderRadius: 28, backgroundColor: C.lime,
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
    shadowColor: C.lime, shadowOpacity: 0.35, shadowRadius: 25, shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  splashInitials: { color: C.background, fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  splashTitle: { fontSize: 32, fontWeight: '900', letterSpacing: 6, textAlign: 'center' },
  splashSubtitle: { color: C.lime, opacity: 0.8, fontSize: 11, fontWeight: '600', letterSpacing: 3, marginTop: 8 },
  loginContent: { paddingHorizontal: 28, paddingTop: 64, paddingBottom: 32 },
  brandPill: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 8, backgroundColor: '#CCFF001A', borderWidth: 1, borderColor: '#CCFF0040',
  },
  onlineDot: { height: 8, width: 8, borderRadius: 4, backgroundColor: C.lime },
  brandText: { color: C.lime, marginLeft: 8, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  loginTitle: { marginTop: 24, fontSize: 44, fontWeight: '900', letterSpacing: -1.5, lineHeight: 47 },
  loginIntro: { marginTop: 12, color: C.muted, fontSize: 15, lineHeight: 23 },
  loginForm: { marginTop: 48 },
  inputWrap: {
    minHeight: 58, backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', marginBottom: 16,
  },
  input: { flex: 1, color: C.white, fontSize: 15, paddingVertical: 16, paddingHorizontal: 12, outlineStyle: 'none' } as object,
  forgotLink: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 34 },
  errorText: { color: C.orange, fontSize: 12, marginTop: -8, marginBottom: 12 },
  primaryButton: {
    minHeight: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.lime, flexDirection: 'row',
  },
  loginButton: { minHeight: 56, shadowColor: C.lime, shadowOpacity: 0.25, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  primaryButtonText: { color: C.background, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  infoNote: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface,
    borderColor: C.surfaceLight, borderWidth: 1, borderRadius: 12, padding: 16, marginTop: 40,
  },
  infoNoteText: { flex: 1, color: C.muted, fontSize: 12, lineHeight: 18, marginLeft: 12 },
  orangeText: { color: C.orange, fontSize: 13, fontWeight: '700' },
  limeText: { color: C.lime, fontWeight: '700' },
  mutedText: { color: C.muted, fontSize: 13 },
  darkText: { color: C.background },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 28, backgroundColor: '#000000AA' },
  modalCard: { backgroundColor: C.surface, padding: 20, borderRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalMessage: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 22 },
  modalCancel: { padding: 10, marginRight: 8 },
  modalAction: { padding: 10 },
  nav: {
    minHeight: 72, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.surfaceLight,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 7,
  },
  navItem: { minWidth: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12 },
  navSelected: { backgroundColor: '#CCFF001A' },
  navLabel: { color: C.muted, fontSize: 10, marginTop: 3 },
  sessionNavButton: {
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FF5F1F26', borderColor: '#FF5F1F66', borderWidth: 1.5,
  },
  sessionNavSelected: { backgroundColor: C.orange },
  pageContent: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 32 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greetingName: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginTop: 2 },
  coachPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: C.surface },
  coachText: { color: C.muted, fontSize: 11, fontWeight: '500', marginLeft: 6 },
  notification: {
    flexDirection: 'row', alignItems: 'center', marginTop: 20, padding: 14, borderRadius: 12,
    backgroundColor: '#FF5F1F14', borderColor: '#FF5F1F40', borderWidth: 1,
  },
  notificationText: { flex: 1, fontSize: 13, fontWeight: '500', marginHorizontal: 10 },
  notificationTime: { color: C.muted, fontSize: 11 },
  todayCard: { marginTop: 24, padding: 20, borderRadius: 20, borderColor: '#CCFF0033', borderWidth: 1, backgroundColor: '#CCFF000D' },
  todayCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayBadge: { backgroundColor: C.lime, color: C.background, fontSize: 11, fontWeight: '800', letterSpacing: 0.5, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  phaseText: { color: C.muted, fontSize: 11 },
  workoutTitle: { fontSize: 28, fontWeight: '900', lineHeight: 31, letterSpacing: -0.5, marginTop: 14 },
  workoutMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { color: C.muted, fontSize: 11, marginLeft: 4 },
  statsRow: { flexDirection: 'row', marginTop: 28 },
  statCard: { flex: 1, padding: 14, borderRadius: 14, backgroundColor: C.surface, marginRight: 10 },
  statValue: { fontSize: 22, fontWeight: '900' },
  statLabel: { color: C.muted, fontSize: 10, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  homeExercise: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, backgroundColor: C.surface, marginBottom: 10 },
  exerciseIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#CCFF001A', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  exerciseName: { flex: 1, fontSize: 14, fontWeight: '600', marginRight: 8 },
  weightBadge: { color: C.lime, backgroundColor: C.background, fontSize: 12, fontWeight: '700', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 10 },
  planHeader: { paddingHorizontal: 24, paddingTop: 28 },
  pageTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  readOnlyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  caption: { color: C.muted, fontSize: 12, marginLeft: 5 },
  phaseBadge: { alignSelf: 'flex-start', color: C.lime, backgroundColor: '#CCFF001A', borderColor: '#CCFF0033', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, fontSize: 12, fontWeight: '600', marginTop: 10 },
  dayScroller: { marginTop: 20, height: 72, flexGrow: 0 },
  dayTile: { width: 56, height: 72, borderRadius: 14, backgroundColor: C.surface, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  dayTileActive: { backgroundColor: C.lime },
  dayName: { color: C.muted, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  restPrompt: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  restIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  restTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  planList: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 },
  planExercise: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, padding: 16, marginBottom: 10 },
  numberIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#CCFF001A', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  numberText: { color: C.lime, fontSize: 14, fontWeight: '800' },
  planExerciseName: { flex: 1, fontSize: 14, fontWeight: '600', marginRight: 6 },
  exerciseDetails: { alignItems: 'flex-end' },
  exerciseDetailText: { color: C.muted, fontSize: 11 },
  planWeight: { color: C.lime, fontSize: 12, fontWeight: '700', marginTop: 3 },
  sessionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 28 },
  sessionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  finishChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#FF5F1F26', borderColor: '#FF5F1F66', borderWidth: 1 },
  timerBar: { marginHorizontal: 24, marginTop: 16, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: C.surface, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timerLeft: { flexDirection: 'row', alignItems: 'center' },
  timerText: { fontSize: 18, fontWeight: '800', letterSpacing: 1, marginLeft: 8 },
  startPrompt: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  startIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#FF5F1F1F', borderColor: '#FF5F1F4D', borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  startDescription: { color: C.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 2 },
  startButton: { backgroundColor: C.orange, borderRadius: 14, minWidth: 220, minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  startButtonText: { fontSize: 16, fontWeight: '800', marginLeft: 6 },
  sessionList: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 4 },
  sessionCard: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1.5, padding: 16, marginBottom: 12 },
  sessionCardHead: { flexDirection: 'row', alignItems: 'center' },
  smallNumber: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#CCFF001A', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  sessionExerciseName: { flex: 1, fontSize: 13, fontWeight: '700', marginRight: 3 },
  sessionPlanText: { color: C.muted, fontSize: 9 },
  logFields: { flexDirection: 'row', gap: 10, marginTop: 14 },
  logInputContainer: { flex: 1 },
  logLabel: { color: C.muted, fontSize: 11, fontWeight: '600', marginBottom: 4 },
  logInput: { backgroundColor: C.background, color: C.white, fontSize: 14, fontWeight: '700', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 4, outlineStyle: 'none' } as object,
  statusButtons: { flexDirection: 'row', gap: 10, marginTop: 14 },
  statusButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderColor: C.surfaceLight, borderWidth: 1, backgroundColor: C.background, paddingVertical: 10 },
  doneStatus: { backgroundColor: '#CCFF0026', borderColor: C.lime },
  skippedStatus: { backgroundColor: '#FF5F1F26', borderColor: C.orange },
  statusLabel: { color: C.muted, fontSize: 13, fontWeight: '600', marginLeft: 6 },
  finishButtonWrap: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8 },
  savedMessage: { textAlign: 'center', color: C.lime, fontSize: 12, marginTop: 8 },
  historyHeader: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
  historyStats: { flexDirection: 'row', gap: 10, marginTop: 16 },
  summaryChip: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: C.surface },
  summaryValue: { fontSize: 20, fontWeight: '900' },
  summaryLabel: { color: C.muted, fontSize: 10 },
  historyList: { paddingHorizontal: 24, paddingBottom: 24 },
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, padding: 16, marginBottom: 10 },
  historyIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#CCFF001A', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  historyRestIcon: { backgroundColor: C.background },
  historyMain: { flex: 1 },
  historyName: { fontSize: 13, fontWeight: '600' },
  historyDate: { color: C.muted, fontSize: 12, marginTop: 3 },
  historyRight: { alignItems: 'flex-end' },
  statusPill: { fontSize: 10, fontWeight: '700', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  profileContent: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 32 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 18, backgroundColor: C.surface, marginTop: 24, marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 18, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { color: C.background, fontSize: 22, fontWeight: '900' },
  profileDetails: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800' },
  profileSubtext: { color: C.muted, fontSize: 13, marginTop: 4 },
  profileSection: { marginBottom: 20 },
  profileSectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '47%', minHeight: 67, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 14, backgroundColor: C.surface },
  metricValue: { color: C.lime, fontSize: 20, fontWeight: '800' },
  infoRows: { padding: 16, borderRadius: 14, backgroundColor: C.surface, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  infoRowLabel: { width: 110, color: C.muted, fontSize: 13 },
  infoRowValue: { flex: 1, fontSize: 13, fontWeight: '600' },
  signOutButton: { minHeight: 52, borderRadius: 14, borderColor: C.orange, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
});
