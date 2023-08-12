import { Container } from "react-bootstrap";
import OrderListLoggedInView from "../components/OrderListLoggedInView";
import OrderListLoggedOutView from "../components/OrderListLoggedOutView";
import { User } from "../models/user";
import styles from "../styles/Order.module.css";

interface OrdersListPageProps {
    loggedInUser: User | null,
}

const OrdersListPage = ({ loggedInUser }: OrdersListPageProps) => {
    return (
        <Container className={styles.OrderListPage}>
            <>
                {loggedInUser
                    ? <OrderListLoggedInView loggedInUser={loggedInUser}/>
                    : <OrderListLoggedOutView />
                }
            </>
        </Container>
    );
}

export default OrdersListPage;