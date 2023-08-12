import { useEffect, useState } from 'react';
import {    Row, Spinner } from "react-bootstrap";
import { Order as OrderModel } from '../models/order';
import * as OrdersApi from "../network/orders_api";
import styles from "../styles/Order.module.css";
import ViewOrderData from './ViewOrderData';
import Order from './Order';
import { User } from "../models/user";
interface OrdersListPageProps {
    loggedInUser: User | null,
}

const OrdersPageLoggedInView = ({ loggedInUser }: OrdersListPageProps) => {

    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [ordersLoading, OrdersLoading] = useState(true);
    const [showOrdersLoadingError, setOrdersLoadingError] = useState(false);

    const [showAddOrderDialog, setShowAddOrderDialog] = useState(false);
    const [orderToView, setOrderToView] = useState<OrderModel>(orders[0]);

    useEffect(() => {
        async function Orders() {
            try {
                setOrdersLoadingError(false);
                OrdersLoading(true);
                const orders = await OrdersApi.fetchOrders();
                setOrders(orders);
            } catch (error) {
                console.error(error);
                setOrdersLoadingError(true);
            } finally {
                OrdersLoading(false);
            }
        }
        Orders();
    }, []);
    
    async function deleteOrder(order: OrderModel) {
        try {
            await OrdersApi.deleteOrder(order._id);
            setOrders(orders.filter(existingOrder => existingOrder._id !== order._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function approveOrder(order: OrderModel) {
        try {
            await OrdersApi.approveOrder(order._id);
            setOrders(await OrdersApi.fetchOrders());
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function rejectOrder(order: OrderModel) {
        try {
            await OrdersApi.rejectOrder(order._id);
            setOrders(await OrdersApi.fetchOrders());
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const ordersGrid =
        <Row className={`g-4 ${styles.OrderListGrid}`}>
            {orders.map(order => (
                <div key={order._id}>
                    <Order
                        OrderModel={order}
                        onOrderClicked={() => {
                            setOrderToView(order)
                            setShowAddOrderDialog(true)
                        }}
                        onDeleteOrderClicked={deleteOrder}
                    />
                </div>
            ))}
        </Row>

    return (
        <>
            {ordersLoading && <Spinner animation='border' variant='primary' />}
            {showOrdersLoadingError && <p>Something went wrong. Please refresh the page.</p>}
            {!ordersLoading && !showOrdersLoadingError &&
                <>
                    {orders.length > 0
                        ? ordersGrid
                        : <p>You don't have any orders yet</p>
                    }
                </>
            }
            {showAddOrderDialog &&
                <ViewOrderData
                    loggedInUser={loggedInUser}
                    orderToView={orderToView}
                    onDismiss={() => setShowAddOrderDialog(false)}
                    onDeleteOrderClicked={deleteOrder}
                    onApproveOrderClicked={approveOrder}
                    onRejectOrderClicked={rejectOrder}
                />
            }
        </>
    );
}

export default OrdersPageLoggedInView;