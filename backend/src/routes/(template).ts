import express from "express";
import * as orderController from "../controllers/(template)";

const router = express.Router();

router.get("/", orderController.getOrders);

router.get("/:orderId", orderController.getOrder);

router.post("/", orderController.createOrder);

router.patch("/:orderId", orderController.updateOrder);

router.delete("/:orderId", orderController.deleteOrder);

export default router;