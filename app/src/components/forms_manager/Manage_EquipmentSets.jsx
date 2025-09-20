import { useEffect, useState, useMemo } from "react"
import Pagination from "../misc/Pagination"
import { useSystemAPI } from "../../hooks/useSystemAPI"
import ItemVisualizer from "../visualizer/ItemVisualizer"
import { useNotifications } from "../../context/NotificationContext"
import { FormsAdd_Locations, FormsEdit_Locations, FormsView_Locations, ItemVisualizerContent_Locations } from "../forms/Forms_Locations"

const TARGET_ENTITY = "equipment_sets"
const TARGET_NAME = "Equipment Set"
const PAGINATION_ITEMS = 12

export default function LocationsManagement({showReturnButton = true}) {
    const [data, setData] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [itemVisualMode, toggleItemVisualMode] = useState("card")
    const { notifyError } = useNotifications()
    const { API_GET } = useSystemAPI()

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
        try {
            const result = await API_GET(`/${TARGET_ENTITY}/`)
            setData(result.data)
        } catch (error) {
            notifyError(`failed to fetch ${TARGET_ENTITY} data`)
        }
    }


    // fetch data upon component load
    useEffect(() => {
        handleFetchData();
    }, [])


    return (
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
            <div className="p-4 my-4 border rounded bg-body-tertiary shadow">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="h4 text-center">Manage {TARGET_NAME}</div>
                    {
                        <FormsAdd_Locations refetch_data={handleFetchData} />
                    }
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
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentPageData && currentPageData.map((item, key) => (
                                                <ItemVisualizer
                                                    key={key}
                                                    data={item}
                                                    mode="list"
                                                    card_content={<ItemVisualizerContent_Locations data={item} mode="card" />}
                                                    list_content={<ItemVisualizerContent_Locations data={item} mode="list" />}
                                                    preview_button={<FormsView_Locations target_id={item.id} refetch_data={handleFetchData} />}
                                                    edit_button={<FormsEdit_Locations target_id={item.id} refetch_data={handleFetchData} />}
                                                />
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4">
                                {
                                    currentPageData && currentPageData.map((item, key) => (
                                        <ItemVisualizer
                                            key={key}
                                            data={item}
                                            mode="card"
                                            card_content={<ItemVisualizerContent_Locations data={item} mode="card" />}
                                            list_content={<ItemVisualizerContent_Locations data={item} mode="list" />}
                                            preview_button={<FormsView_Locations target_id={item.id} refetch_data={handleFetchData} />}
                                            edit_button={<FormsEdit_Locations target_id={item.id} refetch_data={handleFetchData} />}
                                        />
                                    ))
                                }
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

    )
}