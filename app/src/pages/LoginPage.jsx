import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

export default function LoginPage() {
    const { login, authLoading, authenticated } = useAuth()
    const { notifyConfirm, notifyError } = useNotifications()
    const [showPassword, toggleShowPassword] = useState(false)
    const nav = useNavigate()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // login function
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await login(username, password)
            notifyConfirm("Logged In!")
        } catch (error) {
            notifyError(error)
        }
    }

    // on component load, check if authenticated. navigate to dashbaord if authenticated
    useEffect(() => {
        if (authenticated) {
            nav("/dashboard")
        }
    }, [authenticated])


    return (
        <>
            <div className="container vh-100">
                <div className="d-flex justify-content-center align-items-center h-100">
                    <form onSubmit={handleLogin} className="p-4 d-flex flex-column border shadow rounded col-12 col-lg-6 bg-body-tertiary">
                        <div className="text-center d-flex flex-column">
                            <i className="fs-1 bi bi-motherboard-fill"></i>
                            <div className="span h4 m-0"><b>CL</b>AIMS</div>
                            <div className="span" style={{fontSize:'0.6rem'}}>Computer Laboratory Assets and Inventory Management System</div>
                        </div>


                        <div className="my-4">
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="username" disabled={authLoading} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                <label htmlFor="username">Username</label>
                            </div>

                            <div className="form-floating position-relative">
                                <input type={showPassword ? "text" : "password"} className="form-control" id="floatingPassword" disabled={authLoading} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <label htmlFor="floatingPassword">Password</label>
                                <div className="btn position-absolute end-0 top-50 translate-middle-y me-2" onClick={() => toggleShowPassword(!showPassword)} >
                                    {
                                        showPassword ? (
                                            <i className="bi bi-eye-fill"></i>
                                        ) : (
                                            <i className="bi bi-eye-slash"></i>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary " disabled={authLoading}>
                            {
                                authLoading ? (
                                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                ) : (
                                    "Login"
                                )
                            }
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}