export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <ul className="pagination justify-content-end align-items-center mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                    Previous
                </button>
            </li>
            {pageNumbers.map(number => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(number)}>
                        {number}
                    </button>
                </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                    Next
                </button>
            </li>
        </ul>
    );
};