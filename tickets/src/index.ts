import mongoose from 'mongoose'
import { app } from './app'
import createHttpError from 'http-errors'
import { natsWrapper } from './nats-wrapper'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

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

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI)
    console.log("tickets DB connected")
    app.listen(3000, () => {
      console.log(`tickets server running`)
    })
  }
  catch (error) {
    console.log(error)
  }
}

start()
