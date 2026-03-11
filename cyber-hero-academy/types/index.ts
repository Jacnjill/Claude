// ─── Database row types (mirrors Supabase schema) ────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  xp: number;
  level: number;
  avatar_url: string | null;
  created_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  order_index: number;
  icon: string;
  color_accent: string;
  created_at: string;
}

export interface ComicPanel {
  id: number;
  image_url: string | null;
  dialogue: string;
  speaker: string;     // e.g. "Raja" | "Narrator" | "Villain"
  caption: string | null;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  story_content: string;          // Markdown intro text
  comic_panels: ComicPanel[];     // JSONB array
  order_index: number;
  created_at: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  question: string;
  options: QuizOption[];   // JSONB array
  correct_answer: string;  // option id
  explanation: string;
  order_index: number;
}

export interface Progress {
  id: string;
  user_id: string;
  module_id: string;
  lesson_id: string | null;
  completion_status: 'not_started' | 'in_progress' | 'completed';
  score: number | null;
  xp_awarded: number;
  completed_at: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition_type: 'mission_complete' | 'perfect_score' | 'streak';
  condition_value: number;
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

// ─── App-level types ──────────────────────────────────────────────────────────

export interface LevelThreshold {
  level: number;
  xpRequired: number;
  title: string;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xpRequired: 0,    title: 'Recruit'       },
  { level: 2, xpRequired: 100,  title: 'Cadet'         },
  { level: 3, xpRequired: 250,  title: 'Agent'         },
  { level: 4, xpRequired: 500,  title: 'Specialist'    },
  { level: 5, xpRequired: 900,  title: 'Elite Defender'},
];

export interface ModuleWithProgress extends Module {
  progress: Progress | null;
  lessonCount: number;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;          // percentage 0–100
  xpEarned: number;
  isPerfect: boolean;
}
