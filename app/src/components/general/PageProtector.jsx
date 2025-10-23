import { useAuth } from "../../context/AuthContext";
import RequireAuth from './RequireAuth';
import ErrorPage from "../../pages/Error";

export default function PageProtector({ component, required_access_level = [] }) {
    const { credential } = useAuth();
    const user_access_level = credential?.role_access_level;

    return (
        <RequireAuth>
            {required_access_level.includes(user_access_level) ? (
                component
            ) : (
                <ErrorPage title="Access Denied" description="You are trying to access content that is restricted"  />
            )}
        </RequireAuth>
    );
}
