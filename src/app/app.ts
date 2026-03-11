import cors from "cors"
import express, { type Request, type Response } from "express"
import { router } from "./routes/index.js";

const app = express();

app.use(express.json())
app.use(cors())

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "welcome tour-management-system backend"
    })
})

export default app;
