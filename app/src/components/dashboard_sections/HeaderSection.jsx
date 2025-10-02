import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ClockFormatted from "../../services/Clock";

export default function HeaderSection() {
    const { account } = useAuth()

    return (
        <>
            <div className="my-5">
                <div className="row row-cols-1 row-cols-md-2 text-center">
                    <div className="text-md-start mb-3 mb-md-0 flex-fill">
                        {
                            <ClockFormatted />
                        }
                    </div>

                    <div className="text-md-end flex-fill">
                        <div className="h4 mb-0 text-capitalize">
                            Hello, {account && account.first_name ? `${account?.first_name} ${account?.last_name}` : <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                        </div>
                        <div className="p text-muted fw-light">{account?.email ? account.email : <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
                    </div>

                </div>
            </div>
        </>
    )

} 