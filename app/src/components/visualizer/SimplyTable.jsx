import { useEffect, useState } from "react";
import { useSystemAPI } from "../../hooks/useSystemAPI";

export default function SimplyList({ title = "", source }) {
    const { API_GET } = useSystemAPI();
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    async function HandleFetch() {
        if (!source) return;
        setLoading(true);
        try {
            const result = await API_GET(source);

            console.log(result);

            // Expected format: { columns: [...], data: [...] }
            if (result?.columns && result?.data) {
                setColumns(result.columns);
                setRows(result.data);
            } else {
                setColumns([]);
                setRows([]);
            }
        } catch (error) {
            console.error("Error fetching list data:", error);
            setColumns([]);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        HandleFetch();
    }, [source]);

    if (loading) return <div className="p-2">Loading...</div>;

    return (
        <div className="col p-2">
            <div className="h-100 rounded border p-3 bg-body-tertiary">
                {title && <div className="h5 mb-3 fw-semibold">{title}</div>}

                {rows.length === 0 ? (
                    <div className="text-muted fst-italic">No data available</div>
                ) : (
                    <ul className="list-group list-group-flush">
                        {rows.map((row, index) => (
                            <li
                                key={index}
                                className="list-group-item d-flex flex-column px-3 py-2 border-0 border-bottom"
                            >
                                <div className="text-secondary small">
                                    {columns.map((col, i) => (
                                        <span key={i} className="me-3">
                                            <strong>{col.replace(/_/g, " ")}:</strong>{" "}
                                            {String(row[col] ?? "")}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
