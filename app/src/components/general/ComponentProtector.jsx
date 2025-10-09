import { useAuth } from "../../context/AuthContext";
import { Alert, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RequireAuth from './RequireAuth';

export default function ComponentProtector({ component, required_access_level = [] }) {
    const { account } = useAuth();
    const navigate = useNavigate();

    const user_access_level = account?.access_level;

    return (
        <RequireAuth>
            {required_access_level.includes(user_access_level) ? (
                component
            ) : (
                <Container className="mt-5">
                    <Alert variant="warning">
                        <Alert.Heading>
                            <i className="bi bi-shield-exclamation me-2"></i>
                            Access Denied
                        </Alert.Heading>
                        <p>
                            You don't have the required permissions to access this resource.
                            Please contact your administrator if you believe this is an error.
                        </p>
                        <hr />
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
                                <i className="bi bi-house me-1"></i>
                                Go to Dashboard
                            </Button>
                            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                                <i className="bi bi-arrow-left me-1"></i>
                                Go Back
                            </Button>
                        </div>
                    </Alert>
                </Container>
            )}
        </RequireAuth>
    );
}
