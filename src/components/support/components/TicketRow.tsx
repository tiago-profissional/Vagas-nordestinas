import type { Ticket } from "../types/Ticket";

interface TicketRowProps {
  ticket: Ticket;
}

export default function TicketRow({ ticket }: TicketRowProps) {
  return (
    <div className="ticket-row">
      <div>
        <strong>
          #{ticket.code} — {ticket.title}
        </strong>
      </div>

      <span>{ticket.category}</span>
      <span>{ticket.status}</span>
      <span>{ticket.updatedAt}</span>
    </div>
  );
}