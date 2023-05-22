import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler } from "@_tickets/common";
import { createChargeRouter } from "./routes/new";
import createHttpError from "http-errors";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  throw createHttpError(404, 'Endpoint not found')
});

app.use(errorHandler);

export { app };
