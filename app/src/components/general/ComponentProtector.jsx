import { useAuth } from "../../context/AuthContext";
import RequireAuth from './RequireAuth';

export default function ComponentProtector({ component, required_access_level = [] }) {
    const { credential } = useAuth();
    const user_access_level = credential?.role_access_level;

    return (
        <RequireAuth>
            {
                required_access_level.includes(user_access_level) ? (
                    component
                ) : (
                    ""
                )
            }
        </RequireAuth>
    );
}
