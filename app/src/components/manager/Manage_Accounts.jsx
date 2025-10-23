import { useEffect, useState, useMemo } from "react"
import Pagination from "../general/Pagination.jsx"
import { useSystemAPI } from "../../hooks/useSystemAPI"
import ItemVisualizer from "../visualizer/ItemVisualizer"
import { useNotifications } from "../../context/NotificationContext"
import { useErrorHandler } from "../../hooks/useErrorHandler.jsx"
import { FormsAdd_Accounts, FormsEdit_Accounts, FormsView_Accounts, ItemVisualizerContent_Accounts } from "../forms/Forms_Accounts"
import { useNavigate } from "react-router-dom"
import ReturnButton from "../general/ReturnButton";

const TARGET_ENTITY = "accounts"
const TARGET_NAME = "Account"
const PAGINATION_ITEMS = 12

export default function AccountsManagement() {
    const nav = useNavigate()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [itemVisualMode, toggleItemVisualMode] = useState("card")
    const { notifyError } = useNotifications()
    const { handleError } = useErrorHandler()
    const { API_GET, API_LOADING } = useSystemAPI()

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
            const result = await API_GET(`/${TARGET_ENTITY}/`)
            setData(result || [])
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
                <div className="mb-3">
                    <div className="d-flex justify-content-end gap-2">
                        <input type="searchQuery" className="form-control" style={{ maxWidth: "500px" }} id="search_query_input" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />

                        <div className="btn btn-outline-secondary border-secondary-subtles" onClick={() => handleToggleItemVisualMode()}>
                            {
                                itemVisualMode == "list" ? (
                                    <i className="bi bi-grid"></i>
                                ) : (
                                    <i className="bi bi-list-ul"></i>
                                )
                            }
                        </div>


                        {
                            <FormsAdd_Accounts refetch_data={handleFetchData} />
                        }

                    </div>
                </div>


                <div className="p-3">

                    {
                        itemVisualMode == "list" ? (
                            <div className="table-py-2 table-responsive rounded bg-body">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">Full Name</th>
                                            <th scope="col">Username</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Role</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(loading || API_LOADING) ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading accounts...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            currentPageData && currentPageData.map((item, key) => (
                                                <ItemVisualizer
                                                    key={key}
                                                    data={item}
                                                    mode="list"
                                                    card_content={<ItemVisualizerContent_Accounts data={item} mode="card" />}
                                                    list_content={<ItemVisualizerContent_Accounts data={item} mode="list" />}
                                                    preview_button={<FormsView_Accounts target_id={item.id} refetch_data={handleFetchData} />}
                                                    edit_button={<FormsEdit_Accounts target_id={item.id} refetch_data={handleFetchData} />}
                                                />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-gap-4">
                                {(loading || API_LOADING) ? (
                                    <div className="col-12 text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading accounts...</span>
                                        </div>
                                    </div>
                                ) : (
                                    currentPageData && currentPageData.map((item, key) => (
                                        <ItemVisualizer
                                            key={key}
                                            data={item}
                                            mode="card"
                                            card_content={<ItemVisualizerContent_Accounts data={item} mode="card" />}
                                            list_content={<ItemVisualizerContent_Accounts data={item} mode="list" />}
                                            preview_button={<FormsView_Accounts target_id={item.id} refetch_data={handleFetchData} />}
                                            edit_button={<FormsEdit_Accounts target_id={item.id} refetch_data={handleFetchData} />}
                                        />
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
        </>
    )
}