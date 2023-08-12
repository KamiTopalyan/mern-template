import { Button, Modal } from "react-bootstrap";
import { Order } from "../models/order";
import OrderStyle from "../styles/Order.module.css"
import modalStyles from "../styles/modals.module.css"
import { User } from "../models/user";
import { Order as OrderModel } from "../models/order";

interface orderToViewProps {
    orderToView: Order,
    onDismiss: () => void,
    loggedInUser: User | null,
    onDeleteOrderClicked: (Order: OrderModel) => void,
    onApproveOrderClicked: (Order: OrderModel) => void,
    onRejectOrderClicked: (Order: OrderModel) => void,
}   

const ViewOrderData = ({ orderToView, onDismiss, loggedInUser, onApproveOrderClicked, onDeleteOrderClicked, onRejectOrderClicked}: orderToViewProps) => {

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header className={`${modalStyles.modalBody}`} closeButton>
                <Modal.Title>
                    {orderToView?.user}'s request
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className={`${OrderStyle.OrderText} ${modalStyles.modalBody}`}>
                <p>Item Requested: {orderToView?.name}</p>
                <p>Count: {orderToView?.count.toString()}</p>
                <p>Type of Count: {orderToView?.countType}</p>
                <p>Price: {orderToView?.price.toString()}</p>
                <p>Currency: {orderToView?.currency}</p>
                <p>Reason for request: {orderToView?.reason}</p>
                <p>Extra Notes: {orderToView?.notes}</p>
            </Modal.Body>

            <Modal.Footer className={`${modalStyles.modalBody}`}>
                <Button className={modalStyles.modalButton}
                        onClick={(e) => {
                            onDeleteOrderClicked(orderToView);
                            e.stopPropagation();
                            onDismiss()
                        }}
                >
                    Delete
                </Button>
                {loggedInUser?.isAdmin &&
                    <Button className={modalStyles.modalButton}
                        onClick={(e) => {
                            onApproveOrderClicked(orderToView);
                            e.stopPropagation();
                            onDismiss()
                        }}
                    >
                        Approve
                    </Button>
                }
                {loggedInUser?.isAdmin &&
                    <Button className={modalStyles.modalButton}
                        onClick={(e) => {
                            onRejectOrderClicked(orderToView);
                            e.stopPropagation();
                            onDismiss()
                        }}
                    >
                        Reject
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ViewOrderData;