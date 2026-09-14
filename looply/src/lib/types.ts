export type DailyGoal = 10 | 20 | 30;
export type ExerciseType = "mcq" | "fill" | "order" | "type" | "output";
export type MascotLook = "classic" | "shades" | "crown";
export type Language = "javascript" | "typescript" | "python" | "jsx" | "sql";

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  code?: string;
  language?: Language;
  options?: string[];
  pieces?: string[];
  answer: string | string[];
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  xp: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  blurb: string;
  lessons: Lesson[];
  chestGems: number;
}

export interface Track {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  accent: string;
  units: Unit[];
}

export interface LessonResult {
  perfect: boolean;
  xp: number;
  completedAt: string;
}

export interface Mistake {
  exerciseId: string;
  lessonId: string;
}

export interface GameState {
  onboardingComplete: boolean;
  displayName: string;
  dailyGoal: DailyGoal;
  activeTrackId: string;
  hearts: number;
  lastHeartRefillDate: string | null;
  gems: number;
  xp: number;
  weeklyXp: number;
  weekId: string;
  todayXp: number;
  todayDate: string | null;
  streak: number;
  lastActiveDate: string | null;
  streakFreezes: number;
  completedLessons: Record<string, LessonResult>;
  openedChests: string[];
  mistakeBank: Mistake[];
  achievements: string[];
  mascot: MascotLook;
  doubleXpLessons: number;
  createdAt: string | null;
}

export type ShopItemId = "hearts" | "freeze" | "double" | "shades" | "crown";

export type Action =
  | { type: "TICK"; now: number }
  | {
      type: "ONBOARD";
      name: string;
      trackId: string;
      dailyGoal: DailyGoal;
      now: number;
    }
  | {
      type: "COMPLETE_LESSON";
      lessonId: string;
      perfect: boolean;
      earnedXp: number;
      mistakes: Mistake[];
      now: number;
    }
  | { type: "OPEN_CHEST"; unitId: string }
  | { type: "LOSE_HEART"; mistake?: Mistake }
  | { type: "BUY"; item: ShopItemId }
  | { type: "SET_TRACK"; trackId: string }
  | { type: "CLEAR_MISTAKE"; exerciseId: string }
  | { type: "RESET" };

export interface Achievement {
  id: string;
  title: string;
  hint: string;
  emoji: string;
}
