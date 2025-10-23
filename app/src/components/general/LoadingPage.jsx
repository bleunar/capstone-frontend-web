export default function LoadingPage({full_height = false}) {
    return (
        <div className="container-fluid" style={{ height: full_height ? "92vh" : 'fit_content' }}>
            <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}