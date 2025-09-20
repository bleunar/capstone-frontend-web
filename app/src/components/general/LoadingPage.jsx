export default function LoadingPage() {
    return (
        <div className="container-fluid" style={{ height: "92vh" }}>
            <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}