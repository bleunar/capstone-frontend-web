import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { FaBars, FaHome, FaNetworkWired, FaClipboardList, FaUserEdit, FaToolbox, FaWrench, FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import Logo from '../../assets/img/claims-name-white.png'
import LogoSmall from '../../assets/img/claims-logo.svg'

export default function DefaultLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { credential, authLoading, authenticated, logout } = useAuth()
    const { notifyConfirm } = useNotifications();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const [sidebarUserOptionChevronOrientation, setSidebarUserOptionChevronOrientation] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


    const HandleLogout = (e) => {
        e.preventDefault();

        if (confirm("Are you sure to log out your account?")) {
            logout()
            notifyConfirm("Logged Out")
        }
    }


    const sidebarLinks = [
        { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
        { icon: <FaNetworkWired />, label: "Labs & Computers", path: "./labs" },
        { icon: <FaClipboardList />, label: "Activities", path: "./activities" },
    ];

    const handleSidebarChevron = () => {
        setSidebarUserOptionChevronOrientation(!sidebarUserOptionChevronOrientation)
    }


    return (
        <div style={{ height: "100vh" }}>
            <header
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#004d26",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {isMobile && (
                        <FaBars size={22} style={{ cursor: "pointer", color: "#FFCC00" }} onClick={toggleSidebar} />
                    )}
                    <img src={Logo} alt="logo" style={{ height: '2.5rem' }} />

                </div>
            </header>

            <aside
                style={{
                    position: "fixed",
                    top: 0,
                    left: sidebarOpen ? 0 : isMobile ? "-280px" : "0",
                    width: "280px",
                    height: "100%",
                    backgroundColor: "#003d1f",
                    paddingTop: "60px",
                    boxShadow: "2px 0 12px rgba(0,0,0,0.25)",
                    transition: "all 0.3s ease",
                    zIndex: 900,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <div className="text-light bg-primary d-flex flex-column text-center m-3 p-2 rounded">
                        <div className="w-100 bg-primary" data-bs-toggle="collapse" data-bs-target="#collapse_profile" aria-expanded="false" aria-controls="collapse_profile" onClick={() => handleSidebarChevron()} style={{ backgroundColor: '#004d26' }}>
                            <i className="bi bi-person-circle fs-1"></i>
                            <h5 className="h5 mb-0 fw-bold">
                                {credential?.username || "Loading..."}
                            </h5>
                            <p className="mb-0">{credential?.role_name || "Fetching role..."}</p>
                        </div>

                        <div class="collapse" id="collapse_profile">
                            <div className="d-flex flex-column gap-2 pt-3">
                                <Link to="./settings" className="btn btn-secondary btn-sm">
                                    <FaUserEdit size={18} />
                                    Settings
                                </Link>
                                <div className="btn btn-danger btn-sm" onClick={HandleLogout}>
                                    <FaDoorOpen size={18} />
                                    Logout
                                </div>
                            </div>
                        </div>

                        <div className="btn btn-sm bg-primary" data-bs-toggle="collapse" data-bs-target="#collapse_profile" aria-expanded="false" aria-controls="collapse_profile" onClick={() => handleSidebarChevron()} style={{ backgroundColor: '#004d26' }}>
                            {
                                sidebarUserOptionChevronOrientation ? <i class="bi bi-chevron-compact-up"></i> : <i class="bi bi-chevron-compact-down"></i>
                            }
                        </div>
                    </div>
                    {/* Sidebar Navigation */}
                    <nav style={{ marginTop: "1rem" }}>
                        <ul style={{ listStyle: "none", padding: "0 1rem" }} className="d-flex flex-column gap-2">
                            <Link to="/dashboard" className="btn btn-secondary w-100 d-flex justify-content-start align-items-center gap-2">
                                <FaHome /> Dashboard
                            </Link>
                            <Link to="./labs" className="btn btn-secondary w-100 d-flex justify-content-start align-items-center gap-2">
                                <FaNetworkWired /> Computers & Labs
                            </Link>
                            <Link to="./manage" className="btn btn-secondary w-100 d-flex justify-content-start align-items-center gap-2">
                                <FaWrench /> Manage
                            </Link>
                            <Link to="./activities" className="btn btn-secondary w-100 d-flex justify-content-start align-items-center gap-2">
                                <FaClipboardList /> Activities
                            </Link>
                        </ul>
                    </nav>
                </div>
            </aside>

            <main
                style={{
                    marginLeft: isMobile ? "0" : "280px",
                    marginTop: "60px",
                    padding: "25px",
                    minHeight: "100vh",
                    transition: "all 0.3s ease",
                }}
            >
                <Outlet />
            </main>
        </div>
    )
}