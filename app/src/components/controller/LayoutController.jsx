import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import LoadingPage from "../general/LoadingPage.jsx";
import DefaultLayout from "../layout/DefaultLayout.jsx";

// controls the layout according to the user's access level 
export function LayoutController() {
    const [verified, setVerified] = useState(false)
    const { account, authLoading, authenticated } = useAuth()

    useEffect(() => {
        if(account){
            setVerified(true)
        }
    }, [account])

    if(!verified && authLoading && !authenticated) return <LoadingPage />

    switch (account.access_level) {
        case 0: return <AdminLayout />
        case 1: return <DefaultLayout />
    }
}