import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from '../../assets/img/claims-name-white.png'
import LogoSmall from '../../assets/img/claims-logo.svg'
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export default function DefaultLayout() {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);
    const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);
    const closeOffcanvas = () => setShowOffcanvas(false);

    return (
        <div className="d-flex vh-100 bg-body">
            <div
                className={`d-none d-md-block ${sidebarExpanded ? "sidebar-expanded" : "sidebar-shrinked"
                    }`}
                style={{
                    width: sidebarExpanded ? "300px" : "67px",
                    transition: "width 0.3s ease",
                }}
            >
                <Sidebar expanded={sidebarExpanded} />
            </div>

            <div className="flex-grow-1 d-flex flex-column min-vh-100">
                <Navbar onToggleSidebar={toggleSidebar} onToggleOffcanvas={toggleOffcanvas} />
                <main className="p-4 scroll-container flex-grow-1">
                    <div className="h-auto w-100">
                        <Outlet />
                    </div>
                </main>
            </div>

            <MobileSidebar show={showOffcanvas} onClose={closeOffcanvas} />
        </div>
    )
}


function Sidebar({ expanded }) {
    const { account, logout } = useAuth();
    const { notifyConfirm } = useNotifications();
    const HandleLogout = (e) => {
        e.preventDefault();

        if (confirm("Are you sure to log out your account?")) {
            logout()
            notifyConfirm("Logged Out")
        }
    }

    return (
        <div className="h-100 d-flex flex-column overflow-hidden p-2 bg-primary text-white">
            <div className="d-flex justify-content-center align-items-center py-3">
                <a href="/dashboard">
                    {
                        expanded ? (
                            <img src={Logo} alt="logo" style={{ height: '2.5rem' }} />
                        ) : (
                            <img src={LogoSmall} alt="logo-sm" style={{ height: '2.5rem' }} />
                        )
                    }
                </a>
            </div>
            <div className="w-100 border-bottom border-white"></div>

            <ul className="nav nav-pills flex-column mb-auto row-gap-2 pt-2">
                <li className="nav-item">
                    <Link to="/dashboard" className="nav-link text-white d-flex flex-nowrap">
                        <i className="bi bi-grid me-2 me-md-0"></i>
                        {expanded && (
                            <div className="p ps-2 text-nowrap">Dashboard</div>
                        )}
                    </Link>
                </li>
                <div className="nav-item">
                    <Link to="./labs" className="nav-link text-white d-flex flex-nowrap">
                        <i className="bi bi-pc-display me-2 me-md-0"></i>
                        {expanded && (
                            <div className="p ps-2 text-nowrap">Computer Laboratories</div>
                        )}
                    </Link>
                </div>
                <div className="nav-item">
                    <Link to="./activities" className="nav-link text-white d-flex flex-nowrap">
                        <i className="bi bi-activity me-2 me-md-0"></i>
                        {expanded && (
                            <div className="p ps-2 text-nowrap">Activities</div>
                        )}
                    </Link>
                </div>
            </ul>

            <footer className="d-flex flex-column align-items-center" data-bs-toggle="collapse" data-bs-target="#sidebarProfileCollapse" aria-expanded="false" aria-controls="sidebarProfileCollapse">
                <i className="bi bi-chevron-up text-white"></i>

                <div className="collapse w-100" id="sidebarProfileCollapse">
                    <div className="d-flex flex-column text-white gap-2 mb-2">
                        <div className="btn btn-outline-danger border-0" onClick={HandleLogout}>
                            <div className={`d-flex justify-content-${expanded ? "start" : "center"} flex-nowrap`}>
                                <i class="bi bi-box-arrow-right text-white"></i>
                                {
                                    expanded && (
                                        <div className="p ms-2 text-white">Logout</div>
                                    )
                                }
                            </div>
                        </div>
                        <Link to='./settings' className="btn btn-outline-secondary border-0">
                            <div className={`d-flex justify-content-${expanded ? "start" : "center"} flex-nowrap`}>
                                <i className="bi bi-gear text-white"></i>
                                {
                                    expanded && (
                                        <div className="p ms-2 text-white">Settings</div>
                                    )
                                }
                            </div>
                        </Link>
                    </div>
                </div>
                <div className={`py-2 w-100 d-flex justify-content-${expanded ? "start" : "center"} cursor-pointer`}>
                    <button className="btn" tabIndex={-1}>
                        <i className="bi bi-person-circle text-white"></i>
                    </button>
                    {
                        expanded && (

                            <div className="text-start">
                                <div className="p fw-bold">{account?.username}</div>
                                <div className="p fw-light">{account?.email}</div>
                            </div>
                        )
                    }
                </div>
            </footer>
        </div>
    );
}


function MobileSidebar({ show, onClose }) {
    return (
        <div
            className={`offcanvas offcanvas-start d-flex d-md-none bg-primary ${show ? "show" : ""}`}
            tabIndex="-1"
            style={{ visibility: show ? "visible" : "hidden" }}
        >
            <div className="offcanvas-header">
                <div className="d-flex justify-content-center align-items-center">
                    <a href="/dashboard">
                        
                        <img src={Logo} alt="logo-sm" style={{ height: '1.5rem' }} />
                    </a>
                </div>
                <button
                    type="button"
                    className="btn-close text-reset"
                    onClick={onClose}
                ></button>
            </div>
            <div className="offcanvas-body">
                <ul className="nav nav-pills flex-column mb-auto gap-3">
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-link text-wrap text-white" onClick={onClose}>
                            <i className="bi bi-grid me-2 me-md-0"></i> Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="./labs" className="nav-link text-wrap text-white" onClick={onClose}>
                            <i className="bi bi-pc-display me-2 me-md-0"></i> Computer Laboratory
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/activities" className="nav-link text-wrap text-white" onClick={onClose}>
                            <i className="bi bi-activity me-2 me-md-0"></i> Activities
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}


function Navbar({ onToggleSidebar, onToggleOffcanvas }) {
    const { account, logout } = useAuth();
    const { notifyConfirm } = useNotifications();
    const HandleLogout = (e) => {
        e.preventDefault();

        if (confirm("Are you sure to log out your account?")) {
            logout()
            notifyConfirm("Logged Out")
        }
    }

    return (
        <nav className="navbar navbar-expand-lg px-2">
            <div className="container-fluid px-0">
                <button
                    className="btn d-md-none me-2 me-md-0"
                    onClick={onToggleOffcanvas}
                >
                    <i className="bi bi-list"></i>
                </button>

                <button
                    className="btn d-none d-md-inline me-2 me-md-0"
                    onClick={onToggleSidebar}
                >
                    <i className="bi bi-layout-sidebar-inset"></i>
                </button>

                <div className="ms-auto d-flex align-items-center gap-2">
                    <div class="dropdown">
                        <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="d-flex">
                                <div className="p text-muted fw-light me-2">{account?.username}</div>
                                <i className="bi bi-person-circle"></i>
                            </div>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <Link class="dropdown-item" to="./settings">
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <div class="dropdown-item" onClick={HandleLogout}>
                                    Logout
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
