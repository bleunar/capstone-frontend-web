import { useEffect, useRef, useState } from "react"
import FormModal from "../general/FormModal"
import { useSystemAPI } from "../../hooks/useSystemAPI"
import copy from "copy-to-clipboard"
import { useNotifications } from "../../context/NotificationContext"

const BASE_OBJECT = {
    id: "",
    location_id: "",
    name: "",
    requires_avr: "false",
    requires_headset: "false",
    plugged_power_cable: "true",
    plugged_display_cable: "true",
    connectivity: "",
    performance: "",
    status: "",
    issue: "",
    created_at: "",
    updated_at: ""
}

const BASE_OBJECT_COMPONENTS = {
    equipment_set_id: "",
    system_unit_name: "Lenovo NUC Intel",
    system_unit_serial_number: "abc",
    monitor_name: "Lenovo Monitor 19in.",
    monitor_serial_number: "abcd",
    keyboard_name: "Lenovo Keyboard",
    keyboard_serial_number: "abcde",
    mouse_name: "Lenovo Mouse",
    mouse_serial_number: "abcdef",
    avr_name: "",
    avr_serial_number: "",
    headset_name: "",
    headset_serial_number: "",
    updated_at: ""
}

export default function Item_EquipmentSet({ equipment_set }) {
    const { API_PUT } = useSystemAPI()
    const { notifyInform, notifyConfirm, notifyError } = useNotifications()
    const [showModal, toggleShowModal] = useState(false)
    const [equipment, setEquipment] = useState(BASE_OBJECT)
    const [equipmentComponents, setEquipmentComponents] = useState(BASE_OBJECT_COMPONENTS)

    // handle close modal
    const handleCloseModal = () => {
        toggleShowModal(false)
    }

    // hadnle input changes to for equipment sets
    const handleInputChangeEquipments = (e) => {
        const { name, value, type, checked } = e.target;
        setEquipment(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
    };

    // handle input changes for equipment set components
    const handleInputChangeEquipmentComponents = (e) => {
        const { name, value, type, checked } = e.target;
        setEquipmentComponents(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
    };


    // handle fetch of equipment set
    async function updateEquipment() {
        try {
            await API_PUT(`/equipment_sets/${target_id}`, equipment)
            notifyInform("Successfully updated the Equipment Set")
        } catch (error) {
            notifyError("Failed to update equipment set", error)
            console.error(error)
        }
    }


    // handle fetch of equipment set components
    async function updateEquipmentComponents() {
        try {
            await API_PUT(`/equipment_set_components/${target_id}`, equipmentComponents)
            notifyInform("Successfully updated the Equipment Set")
        } catch (error) {
            notifyError("Failed to update components", error)
            console.error(error)
        }
    }

    function HandleUpdate(e) {
        e.preventDefault()
    }


    // handling collapsed component to show
    const refShowSerialNumber = useRef([])
    const [clickedShowAllSerial, toggleClickedShowAllSerial] = useState(false)

    const handleShowAllSerial = () => {
        refShowSerialNumber.current.forEach((btn) => btn?.click());
        toggleClickedShowAllSerial(true)
    };


    useEffect(() => {
        if (!showModal) {
            toggleClickedShowAllSerial(false)
        }
    }, [showModal])


    // handle display of icons for equipment set components and status
    const [issueIcons, setIssueIcons] = useState(null)
    const [allIcons, setAllIcons] = useState(null)


    function HandleIconDisplay() {
        const { ISSUE_ICONS, ALL_ICONS } = checkEquipmentSetIssues(equipment, equipmentComponents);
        setIssueIcons(ISSUE_ICONS)
        setAllIcons(ALL_ICONS)
    }


    // update icons on equipment set and component data update
    useEffect(() => {
        if (equipment_set) {
            console.log(equipment_set)
            setEquipment(equipment_set)
        }
        HandleIconDisplay()
    }, [equipment_set])


    return (
        <>
            <div className="col p-1">
                <div className="w-100 bg-secondary bg-opacity-50 position-relative cursor-pointer hover-show-source hover-hide-source" style={{ height: "150px" }} onClick={() => toggleShowModal(!showModal)}>
                    <div className="p-2 d-flex position-absolute top-0 start-0">
                        <div className="h5 fw-bold">{equipment.name}</div>
                    </div>

                    <div className=" d-flex gap-1 justify-content-end rounded-pill p-2 position-absolute w-100 bottom-0 hover-hide-client">
                        {
                            issueIcons
                        }
                    </div>

                    <div className="p-2 d-flex gap-1 justify-content-end position-absolute pe-2 w-100 bottom-0 hover-show-client">
                        <div className="d-flex gap-1 justify-content-between">
                            {
                                allIcons
                            }
                        </div>
                    </div>
                </div>
            </div>

            {
                showModal &&
                <FormModal title={`${equipment.name} Overview`} onClose={handleCloseModal} size="md">
                    <div className="p-3">
                        <div className="d-flex gap-2 justify-content-start">
                            <p className="d-inline-flex gap-1">
                                <button className="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2">
                                    Status
                                </button>
                            </p>

                            <p className="d-inline-flex gap-1">
                                <button className="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                    Configurations
                                </button>
                            </p>

                            <p className="d-inline-flex gap-1">
                                <button className={`btn btn-sm btn-secondary ${clickedShowAllSerial ? "visually-hidden" : ""}`} onClick={() => handleShowAllSerial()} disabled={clickedShowAllSerial}>Show Serial Numbers</button>
                            </p>
                        </div>

                            <div className="container-fluid">
                                <div className="row row-cols-1 mb-3">
                                    {/* System Unit */}
                                    <EquipmentComponentItem
                                        handleInputChangeEquipmentComponents={handleInputChangeEquipmentComponents}
                                        item_name={equipmentComponents.system_unit_name}
                                        item_serial_number={equipmentComponents.system_unit_serial_number}
                                        item_type="system_unit"
                                        refShowSerialNumber={refShowSerialNumber}
                                        refKey={0} Mouse
                                    />

                                    {/* Monitor */}
                                    <EquipmentComponentItem
                                        handleInputChangeEquipmentComponents={handleInputChangeEquipmentComponents}
                                        item_name={equipmentComponents.monitor_name}
                                        item_serial_number={equipmentComponents.monitor_serial_number}
                                        item_type="monitor"
                                        refShowSerialNumber={refShowSerialNumber}
                                        refKey={1}
                                    />

                                    {/* Keyboard */}
                                    <EquipmentComponentItem
                                        handleInputChangeEquipmentComponents={handleInputChangeEquipmentComponents}
                                        item_name={equipmentComponents.keyboard_name}
                                        item_serial_number={equipmentComponents.keyboard_serial_number}
                                        item_type="keyboard"
                                        refShowSerialNumber={refShowSerialNumber}
                                        refKey={2}
                                    />

                                    {/* Mouse */}
                                    <EquipmentComponentItem
                                        handleInputChangeEquipmentComponents={handleInputChangeEquipmentComponents}
                                        item_name={equipmentComponents.mouse_name}
                                        item_serial_number={equipmentComponents.mouse_serial_number}
                                        item_type="mouse"
                                        refShowSerialNumber={refShowSerialNumber}
                                        refKey={3}
                                    />

                                    {
                                        equipment.requires_avr == 'true' ? (
                                            <EquipmentComponentItem
                                                handleInputChangeEquipmentComponents={handleInputChangeEquipmentComponents}
                                                item_name={equipmentComponents.avr_name}
                                                item_serial_number={equipmentComponents.avr_serial_number}
                                                item_type="avr"
                                                refShowSerialNumber={refShowSerialNumber}
                                                refKey={4}
                                            />
                                        ) : ""
                                    }

                                    {
                                        equipment.requires_headset == "true" ? (
                                            <EquipmentComponentItem
                                                handleInputChangeEquipmentComponents={handleInputChangeEquipmentComponents}
                                                item_name={equipmentComponents.headset_name}
                                                item_serial_number={equipmentComponents.headset_serial_number}
                                                item_type="headset"
                                                refShowSerialNumber={refShowSerialNumber}
                                                refKey={5}
                                            />
                                        ) : ''
                                    }
                                </div>
                            </div>

                        <div className="form-check form-check mb-3">
                            <input className="form-check-input" type="checkbox" id="plugged_power_cable" name="plugged_power_cable" value={equipment.plugged_power_cable} checked={equipment.plugged_power_cable == "true"} onChange={(e) => setEquipment({ ...equipment, plugged_power_cable: equipment.plugged_power_cable == "true" ? "false" : "true" })} />
                            <label className="form-check-label" htmlFor="plugged_power_cable">Power Cable Plugged</label>
                        </div>

                        <div className="form-check form-check mb-3">
                            <input className="form-check-input" type="checkbox" id="plugged_display_cable" name="plugged_display_cable" value={equipment.plugged_display_cable} checked={equipment.plugged_display_cable == "true"} onChange={(e) => setEquipment({ ...equipment, plugged_display_cable: equipment.plugged_display_cable == "true" ? "false" : "true" })} />
                            <label className="form-check-label" htmlFor="plugged_display_cable">Display Cable Plugged</label>
                        </div>

                        <div className="collapse" id="collapseExample2">
                            <div className="card card-body mb-3">
                                <div className="mb-3">
                                    <label className="form-check-label" htmlFor="status">Status</label>
                                    <select className="form-select mb-3" aria-label="Default select example" id="status" name="status" value={equipment.status} onChange={handleInputChangeEquipments}>
                                        <option value="active">Active</option>
                                        <option value="suspended">Maintenance</option>
                                        <option value="maintenance">Disabled</option>
                                    </select>
                                </div>


                                <div className="mb-3">
                                    <label className="form-check-label" htmlFor="internet_connectivity">Internet Connectivity</label>
                                    <select className="form-select mb-3" aria-label="Default select example" id="internet_connectivity" name="internet_connectivity" value={equipment.internet_connectivity} onChange={handleInputChangeEquipments}>
                                        <option value="stable">Stable</option>
                                        <option value="unstable">Unstable</option>
                                        <option value="untested">Untested</option>
                                    </select>
                                </div>


                                <div className="mb-3">
                                    <label className="form-check-label" htmlFor="functionability">Computer Performance</label>
                                    <select className="form-select mb-3" aria-label="Default select example" id="functionability" name="functionability" value={equipment.functionability} onChange={handleInputChangeEquipments}>
                                        <option value="stable">Stable</option>
                                        <option value="unstable">Unstable</option>
                                        <option value="untested">Untested</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Issues</label>
                                        <a className=" link-underline cursor-pointer border-0" onClick={() => setEquipment({ ...equipment, issue: '' })}>Clear Issues</a>
                                    </div>
                                    <textarea className="form-control" id="issue" name="issue" value={equipment.issue} onChange={handleInputChangeEquipments} rows="4"></textarea>
                                </div>
                            </div>
                        </div>


                        <div className="collapse" id="collapseExample">
                            <div className="card card-body mb-3">
                                <div className="form-check form-check mb-3">
                                    <input className="form-check-input" type="checkbox" id="requires_avr" value={equipment.requires_avr} checked={equipment.requires_avr == "true"} onChange={(e) => setEquipment({ ...equipment, requires_avr: equipment.requires_avr == "true" ? "false" : "true" })} />
                                    <label className="form-check-label" htmlFor="requires_avr">Requires AVR Unit</label>
                                </div>


                                <div className="form-check form-check mb-3">
                                    <input className="form-check-input" type="checkbox" id="requires_headset" value={equipment.requires_headset} checked={equipment.requires_headset == "true"} onChange={(e) => setEquipment({ ...equipment, requires_headset: equipment.requires_headset == "true" ? "false" : "true" })} />
                                    <label className="form-check-label" htmlFor="requires_headset">Includes Headphones</label>
                                </div>
                            </div>
                        </div>


                        <div className="d-flex justify-content-center">
                            <div className="btn btn-primary flex" onClick={HandleUpdate}>Update</div>
                        </div>
                    </div>
                </FormModal>
            }
        </>
    )
}


// component for Equipment Set
function EquipmentComponentItem({ item_name, item_serial_number, item_type, handleInputChangeEquipmentComponents, refShowSerialNumber, refKey }) {
    const { notifyInform } = useNotifications()


    // handle copy text to clipboard
    const handleCopy = (text) => {
        copy(text)
        notifyInform("Copied to Clipboard", text)
    }

    // list of icons 
    const ICONS = {
        system_unit: <i className="pe-3 fs-5 bi bi-pc"></i>,
        monitor: <i className="pe-3 fs-5 bi bi-display-fill"></i>,
        keyboard: <i className="pe-3 fs-5 bi bi-keyboard"></i>,
        mouse: <i className="pe-3 fs-5 bi bi-mouse"></i>,
        avr: <i className="pe-3 fs-5 bi bi-power"></i>,
        headset: <i className="pe-3 fs-5 bi bi-headset"></i>,
        camera: <i className="pe-3 fs-5 bi bi-camera"></i>,
    };

    return (
        <div className="col p-1">
            <div className="rounded p-2 px-3 border bg-body-tertiary">
                <div className="d-flex align-items-center justify-content-between">
                    {
                        ICONS[item_type]
                    }
                    <div className="p flex-fill">
                        <input type="text" className="form-control border-0 bg-transparent rounded-0" id={`${item_type}_name`} name={`${item_type}_name`} placeholder="Enter Brand/Model" value={item_name} onChange={handleInputChangeEquipmentComponents} />
                    </div>
                    <div className="d-flex gap-2">
                        <div className="px-2">
                            <span className={`badge text-light text-bg-${item_serial_number && item_name ? "success" : "danger"}`}>{item_serial_number && item_name ? "Active" : "Missing"}</span>
                        </div>
                        <div className="btn btn-outline-secondary border-0 btn-sm" data-bs-toggle="collapse" data-bs-target={`#collapse_${item_type}`} aria-expanded="false" aria-controls={`collapse_${item_type}`} ref={(el) => (refShowSerialNumber.current[refKey] = el)}>
                            <i className="bi bi-chevron-down"></i>
                        </div>
                    </div>
                </div>

                <div className="collapse" id={`collapse_${item_type}`}>
                    <div className="p-2">
                        <div className="d-flex justify-content-between align-items-center border rounded position-relative">
                            <div className="input-group">
                                <div className="form-floating">
                                    <input type="text" className="form-control border-0" id={`${item_type}_serial_number`} name={`${item_type}_serial_number`} placeholder="Serial Number" value={item_serial_number} onChange={handleInputChangeEquipmentComponents} />
                                    <label htmlFor={`${item_type}_serial_number`}>Serial Number</label>
                                </div>
                            </div>

                            <div className="btn btn-outline-secondary border-0 p-2 me-2 position-absolute end-0 top-50 translate-middle-y" style={{ zIndex: '999' }} onClick={() => handleCopy(item_serial_number)} data-toggle="tooltip" data-placement="top" title="Copy Serial Number">
                                <i className="i bi-copy text-muted cursor-pointer"></i>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}


// HELPER FUNCTION TO DISPLAY ICONS WITH PROPER STATUS
const checkEquipmentSetIssues = (equipment, equipmentComponents) => {
    const issueIcons = [];  // icons for issues in equipment and components
    const allIcons = [];    // all icons, showing the issues

    // SYSTEM UNIT
    const systemUnitOk =
        equipmentComponents?.system_unit_name &&
        equipmentComponents?.system_unit_serial_number;

    allIcons.push(
        <i
            key="system"
            className={`bi fs-4 bi-pc ${systemUnitOk ? "" : "text-danger"}`}
        ></i>
    );
    if (!systemUnitOk) {
        issueIcons.push(
            <i key="system-issue" className="bi fs-4 bi-pc"></i>
        );
    }


    // MONITOR
    const monitorOk =
        equipmentComponents?.monitor_name &&
        equipmentComponents?.monitor_serial_number;

    allIcons.push(
        <i
            key="monitor"
            className={`bi fs-4 bi-display ${monitorOk ? "" : "text-danger"}`}
        ></i>
    );
    if (!monitorOk) {
        issueIcons.push(
            <i key="monitor-issue" className="bi fs-4 bi-display"></i>
        );
    }


    // KEYBOARD
    const keyboardOK =
        equipmentComponents?.keyboard_name &&
        equipmentComponents?.keyboard_serial_number;

    allIcons.push(
        <i
            key="keyboard"
            className={`bi fs-4 bi-keyboard ${keyboardOK ? "" : "text-danger"}`}
        ></i>
    );
    if (!keyboardOK) {
        issueIcons.push(
            <i key="keyboard-issue" className="bi fs-4 bi-keyboard"></i>
        );
    }


    // MOUSE
    const mouseOK =
        equipmentComponents?.mouse_name &&
        equipmentComponents?.mouse_serial_number;

    allIcons.push(
        <i
            key="mouse"
            className={`bi fs-4 bi-mouse ${mouseOK ? "" : "text-danger"}`}
        ></i>
    );
    if (!mouseOK) {
        issueIcons.push(
            <i key="mouse-issue" className="bi fs-4 bi-mouse"></i>
        );
    }


    // POWER CABLE
    const powerOk = equipment.plugged_power_cable === "true";

    allIcons.push(
        <i
            key="power"
            className={`bi fs-4 bi-plug-fill ${powerOk ? "" : "text-danger"}`}
        ></i>
    );
    if (!powerOk) {
        issueIcons.push(
            <i key="power-issue" className="bi fs-4 bi-plug-fill"></i>
        );
    }

    // DISPLAY CABLE
    const displayOk = equipment.plugged_display_cable === "true";

    allIcons.push(
        <i
            key="display"
            className={`bi fs-4 bi-displayport ${displayOk ? "" : "text-danger"}`}
        ></i>
    );
    if (!displayOk) {
        issueIcons.push(
            <i key="display-issue" className="bi fs-4 bi-displayport"></i>
        );
    }

    return {
        ISSUE_ICONS: issueIcons,
        ALL_ICONS: allIcons,
    };
};
