import { Modal } from "react-bootstrap";

export default function FormModal({ children, title, onClose, key, size = 'md' }) {
    return (
        <Modal
            key={key}
            show={true}
            onHide={onClose}
            size={size}
            centered
        >
            <Modal.Header closeButton>
                <div className="h4 m-0 text-capitalize">{title}</div>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
};