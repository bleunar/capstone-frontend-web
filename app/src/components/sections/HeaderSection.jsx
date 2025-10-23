import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import useDateTime from "../../hooks/useDateTime";

export default function HeaderSection() {
    const { profile, credential } = useAuth()
    const {time, date} = useDateTime()

    return (
        <>
            <div className="container-fluid m-0 py-4">
                    <div className="row row-cols-1 row-cols-md-2 text-center">
                        <div className="text-md-start flex-fill">
                            <div className="h4 fw-bold mb-0 text-capitalize">
                                Hello, {profile && profile.first_name ? `${profile?.first_name} ${profile?.last_name}` : <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                            </div>
                            <div className="p">{credential?.email ? credential.email : <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
                        </div>

                        <div className="text-md-end mb-3 mb-md-0 flex-fill d-none d-md-block">
                            {                
                                <div className="flex-fill">
                                    <div className="h4 mb-0 p-0 fw-bold">{time}</div>
                                    <div className="p">{date}</div>
                                </div>
                            }
                        </div>
                    </div>
            </div>
        </>
    )

} 