import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.js";
import session from "express-session";
import cors from "cors";
import productRouter from "./routes/product.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(cors({
    credentials: true,
    origin: true
}));
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use('/auth', authRouter);
app.use('/api/products', productRouter);
app.use(notFound)
app.use(errorHandler)

app.listen(8000, () => {
    console.log(`app running on port: 8000`);
})