import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Logo from '../../assets/img/claims-name-white.png'
import LogoSmall from '../../assets/img/claims-logo.svg'
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export default function AdminLayout() {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);
    const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);
    const closeOffcanvas = () => setShowOffcanvas(false);

    return (
        <div className="d-flex vh-100 vw-100 bg-body">
            <div
                className={`d-none d-md-block ${sidebarExpanded ? "sidebar-expanded" : "sidebar-shrinked"
                    }`}
                style={{
                    width: sidebarExpanded ? "250px" : "69px",
                    transition: "width 0.3s ease",
                }}
            >
                <Sidebar expanded={sidebarExpanded} />
            </div>

            <div className="flex-fill d-flex flex-column min-vh-100">
                <Navbar onToggleSidebar={toggleSidebar} onToggleOffcanvas={toggleOffcanvas} />
                <main className="scroll-container flex-grow-1 overflow-y-scroll">
                    <div className="h-auto p-3 p-md-4">
                        <Outlet />
                    </div>
                </main>
            </div>

            <MobileSidebar show={showOffcanvas} onClose={closeOffcanvas} />
        </div>
    )
}


function Sidebar({ expanded }) {
    const { credential, logout } = useAuth();
    const { notifyConfirm } = useNotifications();
    const location = useLocation();

    const HandleLogout = (e) => {
        e.preventDefault();
        if (confirm("Are you sure to log out your account?")) {
            logout();
            notifyConfirm("Logged Out");
        }
    };

    const isActive = (path, exact = false) => {
        return exact
            ? location.pathname === path
            : location.pathname.startsWith(path);
    };


    return (
        <div
            className="h-100 d-flex flex-column overflow-hidden p-2 bg-primary text-white"
            style={{ transition: "transform 0.3s ease-in-out" }}
        >
            <div className="d-flex justify-content-center align-items-center py-3">
                <a href="/dashboard">
                    <img
                        src={expanded ? Logo : LogoSmall}
                        alt="logo"
                        style={{ height: "2.5rem" }}
                    />
                </a>
            </div>

            <div className="w-100 border-bottom border-white"></div>

            <ul className="nav nav-pills flex-column mb-auto row-gap-2 pt-2">
                <li className="nav-item">
                    <Link
                        to="/dashboard"
                        className={`nav-link d-flex flex-nowrap ${isActive("/dashboard", true)
                                ? "bg-white text-primary fw-bold"
                                : "text-white"
                            }`}
                    >
                        <span className="bi bi-grid me-2"></span>
                        {expanded && <div className="p text-nowrap">Dashboard</div>}
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/dashboard/labs"
                        className={`nav-link d-flex flex-nowrap ${isActive("/dashboard/labs")
                                ? "bg-white text-primary fw-bold"
                                : "text-white"
                            }`}
                    >
                        <span className="bi bi-pc-display me-2"></span>
                        {expanded && <div className="p text-nowrap">Laboratories</div>}
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/dashboard/activities"
                        className={`nav-link d-flex flex-nowrap ${isActive("/dashboard/activities")
                                ? "bg-white text-primary fw-bold"
                                : "text-white"
                            }`}
                    >
                        <span className="bi bi-activity me-2"></span>
                        {expanded && <div className="p text-nowrap">Activities</div>}
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/dashboard/manage"
                        className={`nav-link d-flex flex-nowrap ${isActive("/dashboard/manage")
                                ? "bg-white text-primary fw-bold"
                                : "text-white"
                            }`}
                    >
                        <span className="bi bi-wrench me-2"></span>
                        {expanded && <div className="p text-nowrap">Manage</div>}
                    </Link>
                </li>

            </ul>

            <footer
                className="d-flex flex-column align-items-center"
                data-bs-toggle="collapse"
                data-bs-target="#sidebarProfileCollapse"
                aria-expanded="false"
                aria-controls="sidebarProfileCollapse"
            >
                <i className="bi bi-chevron-up text-white"></i>

                <div className="collapse w-100" id="sidebarProfileCollapse">
                    <div className="d-flex flex-column text-white gap-2 mb-2">
                        <div
                            className="btn btn-outline-danger border-0"
                            onClick={HandleLogout}
                        >
                            <div
                                className={`d-flex justify-content-${
                                    expanded ? "start" : "center"
                                } flex-nowrap`}
                            >
                                <i className="bi bi-box-arrow-right text-white"></i>
                                {expanded && (
                                    <div className="p ms-2 text-white">Logout</div>
                                )}
                            </div>
                        </div>

                        <Link
                            to="/settings"
                            className={`btn border-0 ${
                                isActive("/settings")
                                    ? "btn-light text-primary fw-bold"
                                    : "btn-outline-secondary text-white"
                            }`}
                        >
                            <div
                                className={`d-flex justify-content-${
                                    expanded ? "start" : "center"
                                } flex-nowrap`}
                            >
                                <i className="bi bi-gear"></i>
                                {expanded && (
                                    <div className="p ms-2">Settings</div>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>

                <div
                    className={`py-2 w-100 d-flex justify-content-${
                        expanded ? "start" : "center"
                    } cursor-pointer`}
                >
                    <button className="btn" tabIndex={-1}>
                        <i className="bi bi-person-circle text-white"></i>
                    </button>
                    {expanded && (
                        <div className="text-start">
                            <div className="p fw-bold">{credential?.username}</div>
                            <div className="p fw-light">{credential?.email}</div>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
}


function MobileSidebar({ show, onClose }) {
    return (
        <>
            <div
                className="custom-offcanvas d-flex d-md-none flex-column bg-primary text-white"
                style={{
                    transform: show ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease-in-out",
                }}
            >
                <div className="d-flex border-bottom border-white p-3 d-flex justify-content-between align-items-center">
                    <a href="/dashboard" className="text-decoration-none text-white">
                        <img src={Logo} alt="logo" style={{ height: "1.5rem" }} />
                    </a>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        aria-label="Close"
                        onClick={onClose}
                    ></button>
                </div>

                <div className="offcanvas-body p-3">
                    <ul className="nav nav-pills flex-column gap-3">
                        <li className="nav-item">
                            <Link
                                to="/dashboard"
                                className="nav-link text-white"
                                onClick={onClose}
                            >
                                <i className="bi bi-grid me-2"></i> Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="./labs"
                                className="nav-link text-white"
                                onClick={onClose}
                            >
                                <i className="bi bi-pc-display me-2"></i> Laboratories
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="./activities"
                                className="nav-link text-white"
                                onClick={onClose}
                            >
                                <i className="bi bi-activity me-2"></i> Activities
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="./manage"
                                className="nav-link text-white"
                                onClick={onClose}
                            >
                                <i className="bi bi-wrench me-2"></i> Manage
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {show && (
                <div
                    className="offcanvas-backdrop fade show"
                    onClick={onClose}
                    style={{ zIndex: 1040 }}
                ></div>
            )}
        </>
    );
}



function Navbar({ onToggleSidebar, onToggleOffcanvas }) {
    const { credential, logout } = useAuth();
    const { notifyConfirm } = useNotifications();
    const HandleLogout = (e) => {
        e.preventDefault();

        if (confirm("Are you sure to log out your account?")) {
            logout()
            notifyConfirm("Logged Out")
        }
    }

    return (
        <nav className="navbar navbar-expand-lg px-2 bg-primary bg-opacity-75">
            <div className="container-fluid px-0">
                <button
                    className="btn btn-sm d-md-none me-2"
                    onClick={onToggleOffcanvas}
                >
                    <i className="bi bi-list"></i>
                </button>

                <button
                    className="btn btn-sm d-none d-md-inline me-2"
                    onClick={onToggleSidebar}
                >
                    <i className="bi bi-layout-sidebar-inset"></i>
                </button>

                <div className="ms-auto d-flex align-items-center gap-2">
                    <div class="dropdown">
                        <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="d-flex">
                                <div className="p text-muted me-2">{credential?.username}</div>
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
