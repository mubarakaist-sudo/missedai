export type UrgencyLevel = 'high' | 'medium' | 'low';

export interface ChatMessage {
  id: string;
  raw: string;
  sender: string;
  timestamp?: string;
  text: string;
  index: number;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  isAssignedToUser: boolean;
  deadline?: string;
  timeRemaining?: string;
  urgency: UrgencyLevel;
  urgencyReason: string;
  isCompleted: boolean;
  needsReview?: boolean;
  status: 'pending' | 'completed';
  sourceMessage: ChatMessage;
}

export interface DecisionItem {
  id: string;
  title: string;
  rationale?: string;
  decidedBy: string;
  timestamp?: string;
  urgency: UrgencyLevel;
  sourceMessage: ChatMessage;
  tags?: string[];
}

export interface QuestionItem {
  id: string;
  question: string;
  askedBy: string;
  timestamp?: string;
  isResolved: boolean;
  suggestedAction?: string;
  urgency: UrgencyLevel;
  sourceMessage: ChatMessage;
}

export interface AnalysisSummary {
  topicTitle: string;
  conciseOverview: string;
  totalMessages: number;
  totalSpeakers: number;
  speakers: string[];
  executionTimeMs: number;
  timeframe?: string;
  stats: {
    urgentCount: number;
    assignedToUserCount: number;
    decisionsCount: number;
    unresolvedQuestionsCount: number;
    totalTasksCount: number;
  };
}

export interface AnalysisResult {
  summary: AnalysisSummary;
  urgentItems: TaskItem[];
  userTasks: TaskItem[];
  teamTasks: TaskItem[];
  decisions: DecisionItem[];
  unresolvedQuestions: QuestionItem[];
  allTasks: TaskItem[];
  isAllClear: boolean; // Casual chat with zero urgent asks
}

export interface UserProfile {
  name: string;
  aliases: string[];
}

export interface UserAccount {
  id: string;
  name: string;
  countryCode: string;
  phoneNumber: string;
  fullPhoneNumber: string;
  isWhatsAppVerified: boolean;
  aliases: string[];
  createdAt: string;
}

export type AuthMode = 'signup' | 'login';
export type SignUpStep = 'phone' | 'otp' | 'password' | 'success';
export type LoginStep = 'credentials' | 'otp_login';

