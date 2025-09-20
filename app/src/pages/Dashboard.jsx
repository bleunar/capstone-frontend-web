import { useAuth } from "../context/AuthContext.jsx"
import LoadingComponent from "../components/general/LoadingPage.jsx"
import HeaderSection from "../components/dashboard_sections/HeaderSection.jsx"
import { DashboardController } from "../components/general/DashboardController.jsx";
import GeneralSystemInfromation from "../components/dashboard_sections/GeneralSystemInformation.jsx";

export default function Dashboard() {
    const { authLoading } = useAuth()

    // shows the loading page component if the authentication is loading
    if (authLoading) {
        return <LoadingComponent />;
    }

    return (
        <>
            <div className="container">
                {
                    <HeaderSection />           // global header section, displays the username and time
                }

                {
                    // <GeneralSystemInfromation />
                }

                {
                    <DashboardController />     // dashboard content controller. displays the proper dashboard based on the access level of the current user
                }
            </div>
        </>
    )
}

