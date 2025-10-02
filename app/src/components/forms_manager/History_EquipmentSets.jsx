import { useEffect, useState, useMemo } from "react";
import { useSystemAPI } from "../../hooks/useSystemAPI";
import { useNavigate } from "react-router-dom";

export default function History_Accounts({showReturnButton = true}) {
    const { API_GET } = useSystemAPI();
    const nav = useNavigate()
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("desc"); // asc desc
    const [filterType, setFilterType] = useState("all");
    const [filterAccount, setFilterAccount] = useState("all");
    const [timeRange, setTimeRange] = useState({ from: "", to: "" });
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 10;

    const fetchHistory = async () => {
        try {
            const res = await API_GET("/account_logs");
            setHistory(res || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // handling filter search and sort
    const filteredData = useMemo(() => {
        let data = [...history];

        // search
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                (item) =>
                    item.description?.toLowerCase().includes(q) ||
                    item.action?.toLowerCase().includes(q) ||
                    item.account_username?.toLowerCase().includes(q)
            );
        }

        // by type
        if (filterType !== "all") {
            data = data.filter((item) => item.action === filterType);
        }

        // by account
        if (filterAccount !== "all") {
            data = data.filter((item) => item.account_id === filterAccount);
        }

        // by time range
        if (timeRange.from) {
            data = data.filter(
                (item) => new Date(item.created_at) >= new Date(timeRange.from)
            );
        }
        if (timeRange.to) {
            data = data.filter(
                (item) => new Date(item.created_at) <= new Date(timeRange.to)
            );
        }

        // by timestamp
        data.sort((a, b) => {
            const timeA = new Date(a.created_at).getTime();
            const timeB = new Date(b.created_at).getTime();
            return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
        });

        return data;
    }, [history, search, filterType, filterAccount, timeRange, sortOrder]);


    // pagination
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    return (
        <>
            <div className="container">
                {
                    showReturnButton && (

                        <div className="d-flex my-3 justify-content-start align-items-center">
                            <div className="btn btn-primary" onClick={() => nav("/dashboard/manage")}>
                                <i class="bi bi-caret-left-fill"></i> Return
                            </div>
                        </div>
                    )
                }

                {/* Controls */}
                <div className="d-flex flex-wrap gap-2 mb-4 p-3 border rounded bg-body-tertiary">
                    {/* Search */}
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{ maxWidth: "400px" }}
                    />

                    <div className="input-group mb-3 flex-wrap">
                        {/* type filter */}
                        <select
                            className="form-select"
                            value={filterType}
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="all">All Types</option>
                            <option value="LOGIN">Login</option>
                            <option value="LOGOUT">Logout</option>
                            <option value="ACTIONS">Action</option>
                        </select>

                        {/* account filter */}
                        <select
                            className="form-select"
                            value={filterAccount}
                            onChange={(e) => {
                                setFilterAccount(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="all">All Accounts</option>
                            {[...new Set(history.map((h) => h.account_id))].map((id) => (
                                <option key={id} value={id}>
                                    {history.find((h) => h.account_id === id)?.account_username}
                                </option>
                            ))}
                        </select>

                        {/* time range */}
                        <input
                            type="date"
                            className="form-control"
                            value={timeRange.from}
                            onChange={(e) => {
                                setTimeRange({ ...timeRange, from: e.target.value });
                                setCurrentPage(1);
                            }}
                        />
                        <input
                            type="date"
                            className="form-control"
                            value={timeRange.to}
                            onChange={(e) => {
                                setTimeRange({ ...timeRange, to: e.target.value });
                                setCurrentPage(1);
                            }}
                        />

                        {/* sort */}
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                            }
                        >
                            Order: {sortOrder === "asc" ? <i class="bi bi-sort-up"></i> : <i class="bi bi-sort-down"></i>}
                        </button>
                    </div>
                </div>

                <div className="pb-3 rounded border bg-body-tertiary overflow-hidden">
                    <table className="table table-sm table-responsive">
                        <thead>
                            <tr className="text-center">
                                <th>Timestamp</th>
                                <th>Account</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr className="text-center">
                                    <td colSpan="4" className="text-center">
                                        No results found
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, idx) => (
                                    <tr key={idx} className="text-center">
                                        <td>{new Date(item.created_at).toLocaleString()}</td>
                                        <td>{item.account_username}</td>
                                        <td className="">{item.action}</td>
                                        <td>{item.description ? item.description : ""}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* paginationess */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                            <button
                                className="btn btn-outline-secondary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                Prev
                            </button>
                            <span>
                                Page {currentPage} / {totalPages}
                            </span>
                            <button
                                className="btn btn-outline-secondary"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}
