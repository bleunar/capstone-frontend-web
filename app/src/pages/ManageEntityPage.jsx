import { useAuth } from "../context/AuthContext.jsx"
import LoadingComponent from "../components/general/LoadingPage.jsx"

export default function ManageEntityPage() {
    const { authLoading } = useAuth()

    // shows the loading page component if the authentication is loading
    if (authLoading) {
        return <LoadingComponent />;
    }

    return (
        <>
            <div className="container">
                manager here
            </div>
        </>
    )
}

