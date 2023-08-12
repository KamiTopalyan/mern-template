import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import "dotenv/config";
import env from "../util/validateEnv";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.body.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}



export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        const accessToken = sign(
        {
            "UserInfo": {
                "username": newUser.username,
                "userId": newUser._id,
            }
        },
            env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        const refreshToken = sign(
        {
            "UserInfo": {
                "username": newUser.username,
                "userId": newUser._id,
            }
        },
            env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({"accessToken": accessToken, "refreshToken": refreshToken});
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ username: username }).select("+password +email").exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

    const accessToken = sign(
        {
            "UserInfo": {
                "username": user.username,
                "userId": user._id,
            }
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = sign(
        {
            "UserInfo": {
                "username": user.username,
                "userId": user._id,
            }
        },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    res.json({"accessToken": accessToken, "refreshToken": refreshToken});

    } catch (error) {
        next(error);
    }
};

export const refresh: RequestHandler = (req, res, next) => {
    const refreshToken = req.body.refreshCookie.split('=')[1];

    if (!refreshToken) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    verify(
        refreshToken,
        env.REFRESH_TOKEN_SECRET,
        async (err: any, decoded: any) => {
            if(err) {
                console.log(err)
                return res.status(403).json({ message: 'Forbidden' })
            }

            const user = await UserModel.findOne({ username: decoded.UserInfo.username }).exec();

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' })
            }

            const accessToken = sign(
                {
                    "UserInfo": {
                        "username": user.username,
                        "userId": user._id,
                    }
                },
                env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })

        }
    )
}

export const logout: RequestHandler = (req, res, next) => {
    const cookies = req.cookies
    console.log(cookies)
    if (!cookies?.jwt) {
        throw createHttpError(400, "No tokens");
    }
    
    res.clearCookie('jwt-refresh', { httpOnly: true, sameSite: 'none'})

    res.json({ message: 'Cookie cleared' })
};