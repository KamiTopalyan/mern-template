import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Order } from "../models/order";
import { refresh } from "./users_api";
import axios from "axios"

const url = process.env.NODE_ENV === 'production' ? 'http://178.244.224.244:3001' : 'http://localhost:3001';

async function fetchData(endpoint: RequestInfo, method: "post" | "get" | "patch" | "delete", data?: Object) {
    const jwtAccessCookie = document.cookie
        .split(";")
        .find((cookie) => cookie.includes("jwt-access"));

    const jwtRefreshCookie = document.cookie
        .split(";")
        .find((cookie) => cookie.includes("jwt-refresh"));

    if (!jwtAccessCookie && jwtRefreshCookie) {
        await refresh(jwtRefreshCookie)
    }
    
    const response = await axios({
      method: method,
      url: url + endpoint,
      data: data,
      headers: {
        Authorization:
          "Bearer " +
          document.cookie
            .split(";")
            .find((cookie) => cookie.includes("jwt-access"))
            ?.split("=")[1],
      },
    });
    
    if (response.status === 200 || response.status === 201) {
        return response;
    } else {
        const errorBody = await response.data();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export async function download() {
    const response = await fetchData("/api/orders/download", "get");
    return response.status;
}

export async function fetchOrders(): Promise<Order[]> {
    const response = await fetchData("/api/orders", "get");
    return response.data;
}

export interface OrderInput {
    name: string,
    price: Number,
    currency: "TL" | "USD" | "EURO" | "GPD",
    countType: "piece" | "package", 
    count: Number,
    reason?: String,
    url?: String,
    notes?: String,
}

export async function createOrder(order: OrderInput): Promise<Order> {
    const response = await fetchData("/api/orders", "post", order);
    return response.data;
}

export async function updateOrder(orderId: string, order: OrderInput): Promise<Order> {
    const response = await fetchData("/api/orders/" + orderId, "patch", order);
    return response.data;
}

export async function approveOrder(orderId: string): Promise<Order> {
    const response = await fetchData("/api/orders/approveOrder/" + orderId, "patch")
    return response.data;
}

export async function rejectOrder(orderId: string): Promise<Order> {
    const response = await fetchData("/api/orders/rejectOrder/" + orderId, "patch");
    return response.data;
}

export async function deleteOrder(orderId: string) {
    await fetchData("/api/orders/" + orderId, "delete");
}


