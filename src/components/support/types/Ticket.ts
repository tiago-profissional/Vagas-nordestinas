export type TicketStatus =
  | "in_analysis"
  | "waiting_for_user"
  | "resolved";

export type TicketCategory =
  | "ai_interview"
  | "resume_comparison"
  | "jobs"
  | "account"
  | "other";

export interface Ticket {
  id: number;
  code: string;
  userId: number;

  title: string;
  description: string;

  category: TicketCategory;
  status: TicketStatus;

  createdAt: string;
  updatedAt: string;

  jobId?: number;
  resumeId?: number;
  interviewId?: number;
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  in_analysis: "Em análise",
  waiting_for_user: "Aguardando resposta",
  resolved: "Resolvido",
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  ai_interview: "AI Interview",
  resume_comparison: "Comparação de currículo",
  jobs: "Vagas",
  account: "Conta",
  other: "Outros",
}

