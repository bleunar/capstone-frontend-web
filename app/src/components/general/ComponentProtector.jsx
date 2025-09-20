import { useAuth } from "../../context/AuthContext";

export default function ComponentProtector({component, required_access_level = []}) {
    const { account } = useAuth();

    const user_access_level = account?.access_level

    if (required_access_level.includes(user_access_level)) {
        return component
    } else {
        return (
            <div className="container">
                <div className="h4">Access Denied</div>
            </div>
        )
    }
}
