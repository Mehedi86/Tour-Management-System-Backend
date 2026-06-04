import cors from "cors";
import express, { type Request, type Response } from "express";
import "./config/passport.js";
import { router } from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import notFound from "./middlewares/notFound.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";

const app = express();

app.use(
  expressSession({
    secret: "your secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome tour-management-system backend",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
