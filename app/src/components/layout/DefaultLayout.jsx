import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { FaBars, FaHome, FaNetworkWired, FaClipboardList, FaUserEdit } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import Logo from '../../assets/img/claims-name-white.png'
import LogoSmall from '../../assets/img/claims-logo.svg'

export default function DefaultLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { account, authLoading, authenticated, logout } = useAuth()
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
        { icon: <FaClipboardList />, label: "Reports", path: "./reports" },
    ];

    const handleSidebarChevron = () => {
        setSidebarUserOptionChevronOrientation(!sidebarUserOptionChevronOrientation)
    }


    return (
        <div style={{ height: "100vh", backgroundColor: "#f6f8fa" }}>
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
                    <div className="d-flex flex-column text-center m-3 p-2 rounded" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" onClick={() => handleSidebarChevron()} style={{ backgroundColor: '#004d26' }}>
                        <i className="bi bi-person-circle fs-1"></i>
                        <h5 className="h5 text-white">
                            {account?.username || "Loading..."}
                        </h5>
                        <p>{account?.role_name || "Fetching role..."}</p>

                        <div class="collapse" id="collapseExample">
                            <div className="d-flex flex-column gap-2">
                                <Link to="./settings/account">
                                    <div className="btn btn-outline-secondary">
                                        <FaUserEdit size={18} />
                                        Edit Profile
                                    </div>
                                </Link>
                                <div className="btn btn-outline-danger" onClick={HandleLogout}>
                                    Logout
                                </div>
                            </div>
                        </div>

                        <div className="btn btn-sm">
                            {
                                sidebarUserOptionChevronOrientation ? <i class="bi bi-chevron-compact-up"></i> : <i class="bi bi-chevron-compact-down"></i>
                            }
                        </div>
                    </div>
                    {/* Sidebar Navigation */}
                    <nav style={{ marginTop: "1rem" }}>
                        <ul style={{ listStyle: "none", padding: "0 1rem" }}>
                            {sidebarLinks.map((link, i) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <li key={i} style={{ marginBottom: "0.75rem" }}>
                                        <button
                                            className="btn btn-secondary w-100 d-flex justify-content-start gap-2"
                                            onClick={() => {
                                                navigate(link.path);
                                                if (isMobile) setSidebarOpen(false);
                                            }}
                                        >
                                            {React.cloneElement(link.icon, { size: 18 })}
                                            {!isMobile && link.label}
                                        </button>
                                    </li>
                                );
                            })}
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
                    backgroundColor: "#f6f8fa",
                    transition: "all 0.3s ease",
                }}
            >
                <Outlet />
            </main>
        </div>
    )
}