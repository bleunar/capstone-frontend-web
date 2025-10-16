import { useAuth } from "../../context/AuthContext.jsx";
// controls what dashboard is displayed according to the users access level
export function LabManagementController() {
    const { account } = useAuth()
    const user_access_level = account?.access_level;

    // displays the appropriate  of dashbaord based on the user's access level
    switch (user_access_level) {
        case 0: return <DashboardRoot />
        case 1: return <Manage />
    }
}