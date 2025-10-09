import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import DefaultProfilePicture from  '../../assets/img/default_profile.jpg'
import LogoName from  '../../assets/img/claims-name-white.png'
import { useEffect, useState } from "react";

export default function NavigationBarOffcanvas() {
    const { logout  } = useAuth()

    const handleLogout = (e) => {
        e.preventDefault();

        if (confirm("Are you sure to log out your account?")) {
            logout()
            notifyConfirm("Logged Out")
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top py-0 bg-primary" aria-label="Offcanvas navbar large">
                <div className="container-fluid p-2">
                    <a className="navbar-brand text-light h4 m-0 p-0 d-flex align-items-center justify-content-center" href="/dashboard">
                        <img src={LogoName} style={{height:'2rem'}} alt="logo" />
                    </a>
                    <button className="navbar-toggler bg-transparent border-0 rounded-0 p-2 " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2" aria-label="Toggle navigation">
                        <i className="bi bi-list text-secondary fs-1"></i>
                    </button>

                    <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title fw-bold" id="offcanvasNavbar2Label">Menu</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>

                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1">
                                <div className="nav-item">
                                    <div className="dropdown text-end">
                                        <a href="#"
                                            className="d-block link-body-emphasis text-decoration-none"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src={DefaultProfilePicture} alt="profile" width="32" height="32" className="rounded-circle" />
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end text-small z-3">
                                            <li>
                                                <Link className="dropdown-item" to="/settings">Settings</Link>
                                            </li>

                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>

                                            <li>
                                                <a className="dropdown-item cursor-pointer" onClick={handleLogout}>Logout</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}