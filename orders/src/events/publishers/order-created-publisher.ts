import { Publisher, OrderCreatedEvent, Subjects } from "@_tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}
