import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import BackgroundImage from '../assets/img/phinma-ui.jpg'
import LogoName from '../assets/img/claims-name-transparent.png'

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
            <div className="vh-100 vw-100 position-relative">
                <img
                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                    src={BackgroundImage}
                />
                <div
                    className="position-absolute top-0 start-0 vw-100 vh-100"
                    style={{
                        backgroundColor: "rgba(50, 100, 50, 0.75)",
                        zIndex: 1,
                    }}
                ></div>

                <div className="position-relative container d-flex justify-content-center align-items-center h-100" style={{zIndex: '99999'}}>
                    <form onSubmit={handleLogin} className="p-4 d-flex flex-column border shadow shadow-lg rounded col-12 col-lg-6 bg-body-tertiary">
                        <div className="text-center d-flex flex-column mb-5">
                            <div>
                                <img
                                    src={LogoName}
                                    style={{
                                        height: '2.5rem'
                                    }}
                                />
                            </div>
                            <div className="span" style={{fontSize:'0.75rem'}}>Computer Laboratory Assets and Inventory Management System</div>
                        </div>


                        <div className="mb-3">
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

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary" disabled={authLoading}>
                            {
                                authLoading ? (
                                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                ) : (
                                    "Login"
                                )
                            }
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}