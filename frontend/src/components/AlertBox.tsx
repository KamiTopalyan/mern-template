import { Alert } from "react-bootstrap";

interface alertBoxProps {
    message: string,
    header: string,
    onDismiss: () => void,
    variant: string,
}   

const AlertBox = ({ message, header, onDismiss, variant}: alertBoxProps) => {

    return (
        <Alert variant={variant} onClose={onDismiss} dismissible>
        <Alert.Heading>{header}</Alert.Heading>
        <p>
            {message}
        </p>
        </Alert>
    );
}

export default AlertBox