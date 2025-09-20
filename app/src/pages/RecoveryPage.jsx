import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

export default function RecoveryPage() {
    const { login, authLoading, authenticated } = useAuth()
    const { notifyConfirm, notifyError } = useNotifications()
    const nav = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            notifyConfirm("OTP CODE SENT!")
        } catch (error) {
            notifyError(error)
        }
    }

    // useEffect(() => {
    //     if (authenticated) {
    //         nav("/dashboard")
    //     }
    // }, [authenticated])


    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-center align-items-center h-100">
                    <form onSubmit={handleSubmit} className="p-4 d-flex flex-column border shadow rounded col-12 col-lg-6 bg-body-tertiary">
                        <div className="h4 text-center">Recovery</div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="text" className="form-control" required />
                        </div>

                        {
                            (
                                <div className="btn btn-primary">Send OTP</div>
                            )
                        }

                        <hr />

                        <div className="mb-3">
                            <label className="form-label">OTP Code</label>
                            <div className="d-flex gap-2">
                                <input type="text" className="form-control flex-fill" required />
                                <div className="btn btn-secondary">Resend</div>
                            </div>
                        </div>

                        <hr />

                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" required />
                        </div>
                        <div className="btn btn-primary">Reset</div>
                    </form>
                </div>
            </div>
        </>
    )
}