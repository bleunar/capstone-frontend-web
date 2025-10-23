import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import LoadingPage from "../general/LoadingPage.jsx";
import DefaultLayout from "../layout/DefaultLayout.jsx";

// controls the layout according to the user's access level 
export function LayoutController() {
    const [verified, setVerified] = useState(false)
    const { credential, authLoading, authenticated } = useAuth()

    useEffect(() => {
        if(credential){
            setVerified(true)
        }
    }, [credential])

    if(!verified && authLoading && !authenticated) return <LoadingPage full_height />

    switch (credential?.role_access_level) {
        case 0: return <AdminLayout />
        case 1: return <DefaultLayout />
    }
}