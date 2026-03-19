import cors from "cors"
import express, { type Request, type Response } from "express"
import { router } from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import notFound from "./middlewares/notFound.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "welcome tour-management-system backend"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app;
