import { Link, useNavigate } from "react-router-dom";
import ComponentProtector from "../general/ComponentProtector";

export default function ManagerController({ showReturnButton = false }) {
    const nav = useNavigate()

    return (
        <>
            <div className="container">

                {
                    showReturnButton && (

                        <div className="d-flex my-3 justify-content-start align-items-center">
                            <div className="btn btn-primary" onClick={() => nav("/dashboard")}>
                                <i class="bi bi-caret-left-fill"></i> Return Home
                            </div>
                        </div>
                    )
                }

                <div className="row">
                    {/* ---------- Account Management Links ----------  */}
                    <div className="col-12 col-md-6 col-xl-4 p-2">
                        <div className="card">
                            <div className="card-header text-light fw-bold text-center bg-secondary">
                                Account Management
                            </div>
                            <ul className="list-group text-start list-group-flush">
                                <Link to="/dashboard/manage/accounts/overview" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Overview</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>

                                <ComponentProtector required_access_level={[0]}
                                    component={
                                        (
                                            <Link to="/dashboard/manage/accounts/role" className="list-group-item d-flex justify-content-between flex-fill">
                                                <div className="p">Account Roles</div>
                                                <i className="bi bi-chevron-right"></i>
                                            </Link>
                                        )
                                    }
                                />

                                <Link to="/dashboard/manage/accounts" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Accounts</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>

                                <Link to="/dashboard/manage/accounts/history" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">History</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>
                            </ul>
                        </div>
                    </div>

                    {/* ---------- Account Management Links ----------  */}
                    <div className="col-12 col-md-6 col-xl-4 p-2">
                        <div className="card">
                            <div className="card-header text-light fw-bold text-center bg-secondary">
                                Manage Computer Laboratory
                            </div>
                            <ul className="list-group text-start list-group-flush">
                                <Link to="/dashboard/manage/lab/overview" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Overview</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>

                                <Link to="/dashboard/manage/lab/" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Computer Laboratories</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>

                                <Link to="/dashboard/manage/lab/equipments" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Equipments</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>

                                <Link to="/dashboard/manage/lab/equipments/history" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">History</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>
                            </ul>
                        </div>
                    </div>

                    {/* ---------- Account Management Links ----------  */}
                    <div className="col-12 col-md-6 col-xl-4 p-2">
                        <div className="card">
                            <div className="card-header text-light fw-bold text-center bg-secondary">
                                Ticket Management (Unfinished)
                            </div>
                            <ul className="list-group text-start list-group-flush">
                                <Link to="/dashboard/manage/tickets/overview" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Overview</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>

                                <Link to="/dashboard/manage/tickets" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Tickets</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>

                                <Link to="/dashboard/manage/tickets/history" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">History</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}