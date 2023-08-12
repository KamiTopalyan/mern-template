import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users";
import orderRoutes from "./routes/(template)"
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { verifyJWT } from "./middleware/auth";
import bodyParser from "body-parser";
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"

const options: cors.CorsOptions = {
    credentials: true,
    optionsSuccessStatus: 200
};

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(cors(options))

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use("/api/noVerificationRoute", userRoutes);
app.use("/api/VerificationRequiredRoute", verifyJWT, orderRoutes);

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

export default app;