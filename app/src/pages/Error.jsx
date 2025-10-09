import { useNavigate } from "react-router-dom"

export default function ErrorPage({ title, description, redirect = "/dashboard" }) {
    const nav = useNavigate()

    return (
        <>
            <div className="container" style={{height:"80vh"}}>
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="d-flex flex-column justify-content-center align-items-center p-3 bg-body-tertiary border rounded shadow">
                        <div className="h4">{title}</div>
                        <div className="p mb-3">{description}</div>
                        <div className="btn btn-primary" onClick={() => nav(redirect)}>Return</div>
                    </div>
                </div>
            </div>
        </>
    )
}