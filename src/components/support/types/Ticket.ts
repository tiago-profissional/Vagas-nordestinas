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