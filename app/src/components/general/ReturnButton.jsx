import { Link } from "react-router-dom";

export default function ReturnButton({to = "/dashboard"}) {
    return (
        <>
            <Link to={to} className="btn btn-outline-primary rounded-pill px-3 mb-3 fw-bold">
                <i class="bi bi-chevron-left"></i> Return
            </Link>
        </>
    )
}