import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Pagination from "../general/Pagination.jsx"
import { useSystemAPI } from "../../hooks/useSystemAPI"
import ItemVisualizer from "../visualizer/ItemVisualizer"
import { useNotifications } from "../../context/NotificationContext"
import { useErrorHandler } from "../../hooks/useErrorHandler.jsx"
import { apiService } from "../../services/apiService"
import ReturnButton from "../general/ReturnButton";

const TARGET_ENTITY = "equipment_sets"
const TARGET_NAME = "Equipment Set"
const PAGINATION_ITEMS = 12

export default function EquipmentSetsManagement() {
    const nav = useNavigate()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [itemVisualMode, toggleItemVisualMode] = useState("card")
    const { notifyError, notifySuccess } = useNotifications()
    const { handleError } = useErrorHandler()

    // search logic
    const processedData = useMemo(() => {
        let computedData = data;

        if (searchQuery) {
            computedData = computedData.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
        return computedData;
    }, [data, searchQuery, PAGINATION_ITEMS]);


    // pagination logic
    const totalPages = Math.ceil(processedData.length / PAGINATION_ITEMS);
    const currentPageData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PAGINATION_ITEMS;
        const lastPageIndex = firstPageIndex + PAGINATION_ITEMS;
        return processedData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, processedData]);


    // event handling
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };


    // toggle item view mode 
    const handleToggleItemVisualMode = () => {
        toggleItemVisualMode(itemVisualMode == "list" ? "card" : "list")
    }


    // fetch data 
    const handleFetchData = async () => {
        setLoading(true)
        try {
            const result = await apiService.getEquipmentSets()
            if (result.success) {
                setData(result.data || [])
            } else {
                handleError(new Error(result.error))
                notifyError(`Failed to fetch ${TARGET_NAME} data`)
            }
        } catch (error) {
            handleError(error)
            notifyError(`Failed to fetch ${TARGET_NAME} data`)
        } finally {
            setLoading(false)
        }
    }


    // fetch data upon component load
    useEffect(() => {
        handleFetchData();
    }, [])


    return (
        <>
            <ReturnButton to="/dashboard/manage" />


            <div className="container-fluid">
                <div className="p-4 my-4 border rounded bg-body-tertiary shadow">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="h4 text-center">Manage {TARGET_NAME}</div>
                        <button
                            className="btn btn-primary d-flex gap-2"
                            onClick={() => {/* TODO: Implement add equipment set */ }}
                        >
                            <i className="bi bi-plus-lg"></i>
                            <div className="d-none d-md-block">Add Equipment Set</div>
                        </button>
                    </div>

                    <div className="d-flex align-items-end justify-content-between gap-3 mb-3 flex-wrap">
                        <div className="d-flex flex-fill flex-wrap justify-content-end gap-2">

                            <div className="flex-fill">
                                <input type="searchQuery" className="form-control" id="search_query_input" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                            </div>

                            <div className="d-flex gap-2">
                                <div className="btn btn-outline-secondary border-secondary-subtles" onClick={() => handleToggleItemVisualMode()}>
                                    {
                                        itemVisualMode == "list" ? (
                                            <i className="bi bi-grid"></i>
                                        ) : (
                                            <i className="bi bi-list-ul"></i>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-4">

                        {
                            itemVisualMode == "list" ? (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Location</th>
                                                <th scope="col">Set Number</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Functionality</th>
                                                <th scope="col">Connectivity</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading equipment sets...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentPageData && currentPageData.map((item, key) => (
                                                    <tr key={key}>
                                                        <td>{item.location_name || 'Unknown Location'}</td>
                                                        <td>{item.location_set_number}</td>
                                                        <td>
                                                            <span className={`badge bg-${item.status === 'active' ? 'success' :
                                                                item.status === 'maintenance' ? 'warning' : 'danger'
                                                                }`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge bg-${item.functionability === 'functional' ? 'success' : 'danger'
                                                                }`}>
                                                                {item.functionability}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge bg-${item.internet_connectivity === 'stable' ? 'success' :
                                                                item.internet_connectivity === 'unstable' ? 'warning' : 'danger'
                                                                }`}>
                                                                {item.internet_connectivity}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                    onClick={() => {/* TODO: View equipment set */ }}
                                                                    title="View Details"
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => {/* TODO: Edit equipment set */ }}
                                                                    title="Edit"
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4">
                                    {loading ? (
                                        <div className="col-12 text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading equipment sets...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        currentPageData && currentPageData.map((item, key) => (
                                            <div key={key} className="col mb-3">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <h6 className="card-title">
                                                            {item.location_name || 'Unknown Location'} - Set {item.location_set_number}
                                                        </h6>
                                                        <div className="mb-2">
                                                            <small className="text-muted">Status:</small>
                                                            <span className={`badge bg-${item.status === 'active' ? 'success' :
                                                                item.status === 'maintenance' ? 'warning' : 'danger'
                                                                } ms-2`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        <div className="mb-2">
                                                            <small className="text-muted">Functionality:</small>
                                                            <span className={`badge bg-${item.functionability === 'functional' ? 'success' : 'danger'
                                                                } ms-2`}>
                                                                {item.functionability}
                                                            </span>
                                                        </div>
                                                        <div className="mb-3">
                                                            <small className="text-muted">Connectivity:</small>
                                                            <span className={`badge bg-${item.internet_connectivity === 'stable' ? 'success' :
                                                                item.internet_connectivity === 'unstable' ? 'warning' : 'danger'
                                                                } ms-2`}>
                                                                {item.internet_connectivity}
                                                            </span>
                                                        </div>
                                                        {item.issue_description && (
                                                            <div className="mb-3">
                                                                <small className="text-muted">Issue:</small>
                                                                <p className="small text-danger">{item.issue_description}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="card-footer bg-transparent">
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary flex-fill"
                                                                onClick={() => {/* TODO: View equipment set */ }}
                                                            >
                                                                <i className="bi bi-eye"></i> View
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary flex-fill"
                                                                onClick={() => {/* TODO: Edit equipment set */ }}
                                                            >
                                                                <i className="bi bi-pencil"></i> Edit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )
                        }

                        {
                            currentPageData.length == 0 ? (
                                <div className="p text-center">No Data</div>
                            ) : ""
                        }

                        <div className="d-flex justify-content-center mt-3">
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}