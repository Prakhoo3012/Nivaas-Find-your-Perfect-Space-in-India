import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes
import  userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import reviewRouter from "./routes/review.routes.js";
import { reqCount } from "./middlewares/requestCount.middleware.js";


app.use("/api/users", userRouter),
app.use("/api/properties", propertyRouter)
app.use("/api/booking", bookingRouter)
app.use("/api/review", reviewRouter);


export { app }