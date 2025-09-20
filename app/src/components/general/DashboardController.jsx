import { useAuth } from "../../context/AuthContext.jsx";
import DashboardContentRoot from "../dashboard/DashboardContentRoot.jsx"
import DashboardContentDefault from "../dashboard/DashboardContentDefault.jsx"
import DashboardContentGuest from "../dashboard/DashboardContentGuest.jsx"
import DashboardContentAdministrator from "../dashboard/DashboardContentAdministrator.jsx";
import DashboardContentManager from "../dashboard/DashboardContentManager.jsx";
import DashboardContentTechnician from "../dashboard/DashboardContentTechnician.jsx";

// controls what dashboard is displayed according to the users access level
export function DashboardController() {
    const { account } = useAuth()
    const user_access_level = account?.access_level;

    // displays the appropriate content of dashbaord based on the user's access level
    switch (user_access_level) {
        case 0: return <DashboardContentRoot />
        case 1: return <DashboardContentAdministrator />
        case 2: return <DashboardContentManager />
        case 3: return <DashboardContentTechnician />
        case 4: return <DashboardContentDefault />
        case 5: return <DashboardContentGuest />
    }
}