import type { Ticket } from "../types/Ticket";

export const tickets: Ticket[] = [
  {
    id: 1,
    code: "VN-051",
    userId: 1,

    title: "Entrevista não reconheceu meu microfone",
    description:
      "O sistema não reconheceu meu microfone durante a entrevista.",

    category: "ai_interview",
    status: "in_analysis",

    createdAt: "2026-09-14T14:00:00",
    updatedAt: "2026-09-14T14:32:00",

    interviewId: 25,
  },
];