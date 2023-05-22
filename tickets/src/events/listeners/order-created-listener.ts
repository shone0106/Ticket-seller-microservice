import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@_tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        try {
            //find the ticket the order is reserving
            const ticket = await Ticket.findById(data.ticket.id)

            if (!ticket) {
                throw new Error('ticket not found')
            }

            //mark the ticket as being reserved by setting its orderId property
            ticket.set({ orderId: data.id })

            await ticket.save()

            await new TicketUpdatedPublisher(this.client).publish({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
                orderId: ticket.orderId,
                version: ticket.version
            })

            msg.ack()
        }
        catch (error) {
            console.log(error)
        }
    }
}