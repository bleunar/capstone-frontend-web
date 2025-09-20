import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import copy from "copy-to-clipboard"
import { useNotifications } from "../context/NotificationContext"
import DefaultProfilePicture from '../assets/img/default_profile.jpg'


export default function ProfilePage() {
    const { account } = useAuth()
    const { notifyInform } = useNotifications()

    const handleCopy = (test) => {
        if (copy(test)) {
            notifyInform("text copied")
        }
    }

    return (
        <>
            <div className="container py-3">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <Link to="/dashboard" className="btn btn-secondary"><i className="bi bi-caret-left-fill"></i> Return Home</Link>

                    <div className="btn-group" role="group" aria-label="Basic outlined example">
                        <button type="button" className="btn btn-outline-secondary">Report Issues</button>
                        <button type="button" className="btn btn-secondary">Edit</button>
                    </div>
                </div>


                <div className="mb-3 d-flex justify-content-center align-items-center">
                    <img src={DefaultProfilePicture} style={{ height: "20vh" }} className="img-fluid shadow border rounded-circle " alt="test-image"></img>
                </div>

                <div className="text-center mb-3">
                    <div className="h4 text-uppercase fw-bold">{account?.first_name} {account?.middle_name} {account?.last_name}</div>
                    <div className="p text-uppercase">{account?.role_name}{account?.organization_name ? ` at ${account.organization_name} ${account.branch_name}` : ""}</div>
                </div>

                <div className="row px-2 row-cols-1 row-cols-lg-2 mb-3">

                    <div className="col p-1">
                        <div className="rounded border p-3 bg-body-tertiary">

                            <div className="row row-cols-2 p-2">
                                <div className="col text-muted border-end">First Name</div>
                                <div className="col text-capitalize">{account?.first_name ? account.first_name : "..."}</div>
                            </div>

                            <div className="row row-cols-2 p-2">
                                <div className="col text-muted border-end">Middle Name</div>
                                <div className="col text-capitalize">{account?.middle_name ? account.middle_name : "..."}</div>
                            </div>

                            <div className="row row-cols-2 p-2">
                                <div className="col text-muted border-end">Last Name</div>
                                <div className="col text-capitalize">{account?.last_name ? account.last_name : "..."}</div>
                            </div>
                        </div>
                    </div>


                    <div className="col p-1">
                        <div className="rounded border p-3 bg-body-tertiary">

                            <div className="row row-cols-2 p-2">
                                <div className="col text-muted border-end">Username</div>
                                <div className="col">{account?.username ? account.username : "..."}</div>
                            </div>

                            <div className="row row-cols-2 p-2">
                                <div className="col text-muted border-end">Email</div>
                                <div className="col">{account?.email ? account.email : "..."}</div>
                            </div>

                            <div className="row row-cols-2 p-2">
                                <div className="col text-muted border-end">Role</div>
                                <div className="col text-capitalize">{account?.role_name ? account.role_name : "..."}</div>
                            </div>
                        </div>
                    </div>
                </div>


                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Equipments</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Activity</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Tickets</button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane border p-3 border-top-0 fade show active py-3" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                        <div className="p">Lists of Equipments <br />  - Sample<br />  - Sample<br />  - Sample<br />  - Sample<br />  - Sample</div>
                    </div>
                    <div className="tab-pane border p-3 border-top-0 fade py-3" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                        <div className="p">Shows tables of the account's recent activities</div>
                    </div>
                    <div className="tab-pane border p-3 border-top-0 fade py-3" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabIndex="0">
                        <div className="p">List of Tickets submitted</div>
                    </div>
                </div>
            </div>
        </>
    )
}