import { useAuth } from "../context/AuthContext.jsx"
import LoadingComponent from "../components/general/LoadingPage.jsx"
import { DashboardController } from "../components/general/DashboardController.jsx";

export default function Dashboard() {
    const { authLoading } = useAuth()

    // shows the loading page component if the authentication is loading
    if (authLoading) {
        return <LoadingComponent />;
    }

    return (
        <>
            <DashboardController />
        </>
    )
}

