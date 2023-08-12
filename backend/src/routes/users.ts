import express from "express";
import * as UserController from "../controllers/users";
import { verifyJWT } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyJWT, UserController.getAuthenticatedUser);

router.post("/refresh", UserController.refresh);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

export default router;