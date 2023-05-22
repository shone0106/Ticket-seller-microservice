import { Publisher, Subjects, TicketUpdatedEvent } from "@_tickets/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}


