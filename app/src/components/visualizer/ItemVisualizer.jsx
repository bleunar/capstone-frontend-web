import { useEffect, useState } from "react"

// component used to display items in a list (for managing entities)
export default function ItemVisualizer({ data, mode = "list", card_content, list_content, handleCheckboxChange, checkList, preview_button = null, edit_button = null }) {
    const [itemMode, setItemMode] = useState("list")

    useEffect(() => {
        setItemMode(mode)
    }, [mode])


    if (itemMode == "list") {
        return (
            <>
                <tr>

                    {
                        list_content
                    }

                    {
                        preview_button || edit_button ?
                            <td>
                                <div className="d-flex gap-2 justify-content-end">
                                    {
                                        edit_button ? edit_button : ""
                                    }

                                    {
                                        preview_button ? preview_button : ""
                                    }
                                </div>
                            </td> :
                            <></>
                    }
                </tr>
            </>
        )
    }

    return (
        <div className="col p-1">
            <div className="card shadow h-100">
                <div className="card-body">
                    {
                        card_content
                    }
                </div>
                <div className="card-footer">
                    {
                        preview_button || edit_button ?
                            <div className="d-flex justify-content-end">
                                <div className="d-flex gap-2">
                                    {
                                        edit_button ? edit_button : ""
                                    }

                                    {
                                        preview_button ? preview_button : ""
                                    }
                                </div>
                            </div> :
                            <></>
                    }
                </div>
            </div>
        </div>
    )
}