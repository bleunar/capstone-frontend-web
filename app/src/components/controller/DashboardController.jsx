import { useAuth } from "../../context/AuthContext.jsx";
import DashboardRoot from "../dashboard/DashboardRoot.jsx"
import DashboardDefault from "../dashboard/DashboardDefault.jsx"
import DashboardGuest from "../dashboard/DashboardGuest.jsx"
import DashboardAdministrator from "../dashboard/DashboardAdministrator.jsx";
import DashboardManager from "../dashboard/DashboardManager.jsx";
import DashboardTechnician from "../dashboard/DashboardTechnician.jsx";

// controls what dashboard is displayed according to the users access level
export function DashboardController() {
    const { account } = useAuth()
    const user_access_level = account?.access_level;

    // displays the appropriate  of dashbaord based on the user's access level
    switch (user_access_level) {
        case 0: return <DashboardRoot />
        case 1: return <DashboardAdministrator />
        case 2: return <DashboardManager />
        case 3: return <DashboardTechnician />
        case 4: return <DashboardDefault />
        case 5: return <DashboardGuest />
    }
}