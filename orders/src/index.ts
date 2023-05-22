import mongoose from 'mongoose'
import { app } from './app'
import createHttpError from 'http-errors'
import { natsWrapper } from './nats-wrapper'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener'
import { PaymentCreatedListener } from './events/listeners/payment-created-listener'

async function start() {
  try {
    if (!process.env.JWT_KEY || !process.env.MONGO_URI
      || !process.env.NATS_CLIENT_ID || !process.env.NATS_URL 
      || !process.env.NATS_CLUSTER_ID) {
      throw createHttpError(400, 'env variables not found')
    }

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connetion closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI)
    console.log("orders DB connected")
    app.listen(3000, () => {
      console.log(`order server running`)
    })
  }
  catch (error) {
    console.log(error)
  }
}

start()
