import { useNavigate } from "react-router-dom"

// USAGE
//      title       --> title of the error 
//      description --> short description of the error
//      redirect    --> defaults to /dashboard,

export default function ErrorPage({ title, description, redirect = "/dashboard" }) {
    const nav = useNavigate()

    return (
        <>
            <div className="container h-100">
                <div className="d-flex justify-content-center align-items-center">
                    <div>
                        <div className="h4">{title}</div>
                        <div className="p">{description}</div>
                        <div className="btn btn-primary" onClick={() => nav(redirect)}>Return</div>
                    </div>
                </div>
            </div>
        </>
    )
}