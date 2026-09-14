export type ExerciseType = "mcq" | "order" | "blank" | "bug" | "output";

type BaseExercise = {
  id: string;
  prompt: string;
  explanation: string;
  code?: string;
};

export type McqExercise = BaseExercise & {
  type: "mcq";
  choices: string[];
  answer: number;
};

export type OrderExercise = BaseExercise & {
  type: "order";
  tokens: string[];
};

export type BlankExercise = BaseExercise & {
  type: "blank";
  choices: string[];
  answer: string;
};

export type BugExercise = BaseExercise & {
  type: "bug";
  lines: string[];
  answer: number;
};

export type OutputExercise = BaseExercise & {
  type: "output";
  choices: string[];
  answer: number;
};

export type Exercise =
  | McqExercise
  | OrderExercise
  | BlankExercise
  | BugExercise
  | OutputExercise;

export type Lesson = {
  id: string;
  title: string;
  blurb: string;
  xp: number;
  exercises: Exercise[];
};

export type Unit = {
  id: string;
  title: string;
  subtitle: string;
  language: string;
  accent: string;
  lessons: Lesson[];
};

export type LessonResult = {
  perfect: boolean;
  missed: number;
  xp: number;
  at: string;
};

export type MistakeRef = {
  unitId: string;
  lessonId: string;
  exerciseId: string;
};

export type DailyGoal = 10 | 20 | 30;

export type ProgressState = {
  onboarded: boolean;
  displayName: string;
  dailyGoal: DailyGoal;
  sound: boolean;
  xp: number;
  bits: number;
  streak: number;
  lastActiveDate: string | null;
  dailyXp: number;
  dailyXpDate: string;
  weeklyXp: number;
  weekId: string;
  completed: Record<string, LessonResult>;
  mistakes: MistakeRef[];
  badges: string[];
};

export type Submission =
  | { kind: "index"; index: number }
  | { kind: "tokens"; tokens: string[] }
  | { kind: "text"; value: string };

export type ProgressAction =
  | { type: "HYDRATE"; state: ProgressState }
  | { type: "TICK"; today: string; weekId: string; yesterday: string }
  | { type: "ONBOARD"; displayName: string; dailyGoal: DailyGoal }
  | {
      type: "COMPLETE_LESSON";
      key: string;
      missed: number;
      xp: number;
      today: string;
      weekId: string;
      yesterday: string;
    }
  | { type: "ADD_MISTAKES"; refs: MistakeRef[] }
  | { type: "CLEAR_MISTAKE"; ref: MistakeRef }
  | { type: "TOGGLE_SOUND" }
  | { type: "RESET"; today: string; weekId: string };
