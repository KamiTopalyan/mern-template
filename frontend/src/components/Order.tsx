import styles from "../styles/Order.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Order as OrderModel } from "../models/order";
import { MdDelete } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import { formatDate } from "../utils/formatDate";

interface OrderProps {
    OrderModel: OrderModel,
    onOrderClicked: (Order: OrderModel) => void,
    onDeleteOrderClicked: (Order: OrderModel) => void,
}

const Order = ({ OrderModel, onOrderClicked, onDeleteOrderClicked }: OrderProps) => {
    const {
        _id,
        user,
        name,
        price,
        currency,
        count,
        status,
        id,
        createdAt,
        updatedAt
    } = OrderModel;
    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card
            className={`${styles.OrderCard}`}
            >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.Row}>
                <Row className={styleUtils.width100}>
                        <Col xs={3}>
                            <div className={styles.OrderText}>
                                User: {user}
                            </div>
                        </Col>
                        <Col xs={3}>
                            <div className={styles.OrderText}>
                                Item Requested: {name}
                            </div>
                        </Col>
                        <Col xs={3}>
                            <div className={styles.OrderText}>
                                Total Cost: {(count as number) * (price as number) + " " + currency}
                                </div>
                        </Col>
                        <Col xs={3}>
                            <div className={styles.OrderText}>
                                Status: {String(status)}
                                </div>
                        </Col>
                </Row>
                    <AiFillEye
                        className={styles.OrderFooterText}
                        onClick={() => onOrderClicked(OrderModel)}
                    />
                    <MdDelete
                        className={`${styles.OrderFooterText} ms-auto`}
                        onClick={(e) => {
                            onDeleteOrderClicked(OrderModel);
                            e.stopPropagation();
                        }}
                    />
                    
                </Card.Title>
                
                    
            </Card.Body>
            <Card.Footer className={`text-muted ${styles.OrderFooterText}`} >
                    <span>{createdUpdatedText}</span>
                    <span className="ms-auto">Order id: #{_id}</span>
            </Card.Footer>
        </Card>
    )
}

export default Order;