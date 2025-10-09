import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import useDateTime from "../../hooks/useDateTime";

export default function HeaderSection() {
    const { account } = useAuth()
    const {time, date} = useDateTime()

    return (
        <>
            <div className="container-fluid m-0 text-white bg-primary py-5">
                <div className="container">
                    <div className="row row-cols-1 row-cols-md-2 text-center">
                        <div className="text-md-start flex-fill">
                            <div className="h4 fw-bold mb-0 text-capitalize">
                                Hello, {account && account.first_name ? `${account?.first_name} ${account?.last_name}` : <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                            </div>
                            <div className="p">{account?.email ? account.email : <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
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
            </div>
        </>
    )

} 