import { Link, useNavigate } from "react-router-dom"

export default function ErrorPage({ title, description, redirect = "/dashboard" }) {
    const nav = useNavigate()

    return (
        <>
            <div className="p-5 bg-primary border text-white d-flex flex-column justify-content-center align-items-center">
                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center borde mb-3 w-100">
                    <i class="bi bi-shield-fill-exclamation" style={{ fontSize: "67px" }}></i>
                    <div className="mb-3 ps-3 text-center text-md-start">
                        <div className="h4 fw-bold">{title}</div>
                        <div className="p">{description}<br /> Please <b>contact the administrator </b>if you think this is an issue.</div>
                    </div>
                </div>
                <Link to={redirect} className="btn btn-outline-secondary">Return home</Link>
            </div>
        </>
    )
}