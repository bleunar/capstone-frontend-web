import { Link, useNavigate } from "react-router-dom";
import ComponentProtector from "../general/ComponentProtector";

export default function ManagerController() {
    return (
        <>
            <div className="container-fluid">
                <div className="h2 fw-bold mb-4 text-center text-sm-start">Manage System</div>
                <div className="row row-cols-1 row-cols-lg-2 row-cols-xxl-3">
                    
                    {/* ACCOUNT ROLE */}
                    <ComponentProtector
                        required_access_level={[0, 1, 2, 3]}
                        component={(
                            <div className="col p-2">
                                <div className="card">
                                    <div className="card-header fw-bold text-center bg-body-tertiary">
                                        Accounts
                                    </div>
                                    <ul className="list-group text-start list-group-flush">

                                        <ComponentProtector required_access_level={[0,1]}
                                            component={
                                                (
                                                    <Link to="./accounts/roles" className="list-group-item d-flex justify-content-between flex-fill">
                                                        <div className="p">Account Roles</div>
                                                        <i className="bi bi-chevron-right"></i>
                                                    </Link>
                                                )
                                            }
                                        />

                                        <Link to="./accounts" className="list-group-item d-flex justify-content-between flex-fill">
                                            <div className="p">Accounts</div>
                                            <i className="bi bi-chevron-right"></i>
                                        </Link>


                                        <ComponentProtector required_access_level={[0,1]}
                                            component={
                                                (
                                                    <Link to="./accounts/activities" className="list-group-item d-flex justify-content-between flex-fill">
                                                        <div className="p">Account Activities</div>
                                                        <i className="bi bi-chevron-right"></i>
                                                    </Link>
                                                )
                                            }
                                        />
                                    </ul>
                                </div>
                            </div>
                        )} />


                    <div className="col p-2">
                        <div className="card">
                            <div className="card-header fw-bold text-center bg-body-tertiary">
                                Manage Computer Laboratory
                            </div>
                            <ul className="list-group text-start list-group-flush">
                                <Link to="./lab/" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Locations</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>

                                <Link to="./lab/equipments" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Equipments</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>
                            </ul>
                        </div>
                    </div>


                    <div className="col p-2 d-none">
                        <div className="card">
                            <div className="card-header fw-bold text-center bg-body-tertiary">
                                Manage Tickets
                            </div>
                            <ul className="list-group text-start list-group-flush">
                                <Link to="./lab/" className="list-group-item d-flex justify-content-between flex-fill">
                                    <div className="p">Ticket Management</div>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>

                                <Link to="./lab/equipments" className="list-group-item d-flex justify-content-between flex-fill">
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