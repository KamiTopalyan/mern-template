import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { sign, verify } from "jsonwebtoken";

import "dotenv/config";
import env from "../util/validateEnv";

export const verifyJWT: RequestHandler = (req: any, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
        throw createHttpError(401, "Unauthorized");
    }
    
    const token = authHeader.split(' ')[1]

    verify(
        token,
        env.ACCESS_TOKEN_SECRET,
        (err: any, decoded: any) => {
            if (err) {
                throw createHttpError(403, "Forbidden");
            }
            req.body.username = decoded.UserInfo.username
            req.body.userId = decoded.UserInfo.userId
            next()
        }
    )
};