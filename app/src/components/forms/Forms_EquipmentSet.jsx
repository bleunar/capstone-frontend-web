import { useEffect, useRef, useState } from "react"
import FormModal from "../general/FormModal"
import { useSystemAPI } from "../../hooks/useSystemAPI"
import copy from "copy-to-clipboard"
import { useNotifications } from "../../context/NotificationContext"
import { MdCable } from "react-icons/md";
import { LuCable } from "react-icons/lu";

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
    system_unit_name: "",
    system_unit_serial_number: "",
    monitor_name: "",
    monitor_serial_number: "",
    keyboard_name: "",
    keyboard_serial_number: "",
    mouse_name: "",
    mouse_serial_number: "",
    avr_name: "",
    avr_serial_number: "",
    headset_name: "",
    headset_serial_number: "",
    updated_at: ""
}

export default function Item_EquipmentSet({ target_id, display_data, refresh_parent }) {
    const { API_GET, API_PUT } = useSystemAPI()
    const { notifyInform, notifyConfirm, notifyError } = useNotifications()

    const [showModal, toggleShowModal] = useState(false)

    const [equipment, setEquipment] = useState({})
    const [equipmentComponents, setEquipmentComponents] = useState({})

    // icons to display issues
    const [issueIcons, setIssueIcons] = useState(null)
    const [allIcons, setAllIcons] = useState(null)


    // handle close modal
    function HandleCloseModal () {
        toggleShowModal(false)
    }


    // handles input changes on input fields
    function HandleInputChangeEquipments (e) {
        const { name, value, type, checked } = e.target;
        setEquipment(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
    };

    function HandleInputChangeEquipmentComponents (e) {
        const { name, value, type, checked } = e.target;
        setEquipmentComponents(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
    };



    // HANDLE UPDATES
    async function HandleUpdate(e) {
        e.preventDefault();
        try {
            await UpdateEquipment();
            await UpdateEquipmentComponents();

            const { ISSUE_ICONS, ALL_ICONS } = checkEquipmentSetIssues({
                ...equipment,
                ...equipmentComponents,
            });
            setIssueIcons(ISSUE_ICONS);
            setAllIcons(ALL_ICONS);

            notifyInform("Equipment and components updated successfully!");
            toggleShowModal(false);
        } catch (error) {
            notifyError(error);
        }
    }


    async function UpdateEquipment() {
        try {
            await API_PUT(`/equipment_sets/${equipment?.id}`, equipment)
            refresh_parent()
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }

    async function UpdateEquipmentComponents() {
        try {
            await API_PUT(`/equipment_set_components/${equipment?.id}`, equipmentComponents)
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
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



    // HANDLE ICONS

    useEffect(() => {
        const { ISSUE_ICONS, ALL_ICONS } = checkEquipmentSetIssues(display_data);
        setIssueIcons(ISSUE_ICONS)
        setAllIcons(ALL_ICONS)
    }, [display_data])


    useEffect(() => {
        if(showModal) {
            FetchData();
        }
    }, [showModal])


    async function FetchData() {
        try {
            // fetch equipment and components in parallel
            const [equipmentResult, componentsResult] = await Promise.all([
                API_GET(`/equipment_sets?id=${target_id}`),
                API_GET(`/equipment_set_components/${target_id}`)
            ]);

            setEquipment(equipmentResult[0]);
            setEquipmentComponents(componentsResult);
        } catch (error) {
            console.error(error);
        }
    }
    

    return (
        <>
            <div className="col p-1">
                <div className="w-100 bg-primary position-relative cursor-pointer hover-show-source hover-hide-source" style={{ height: "150px" }} onClick={() => toggleShowModal(!showModal)}>
                    <div className="p-2 d-flex position-absolute top-0 start-0">
                        <div className="h4 fw-bold">{display_data?.equipment_set_name}</div>
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
                <FormModal title={`${equipment?.name} Overview`} onClose={HandleCloseModal} size="lg">
                    <div className="container-fluid">
                        <div className="row row-cols-1 mb-3">
                            {/* System Unit */}
                            <EquipmentComponentItem
                                HandleInputChangeEquipmentComponents={HandleInputChangeEquipmentComponents}
                                item_name={equipmentComponents?.system_unit_name}
                                item_serial_number={equipmentComponents?.system_unit_serial_number}
                                item_type="system_unit"
                                refShowSerialNumber={refShowSerialNumber}
                                refKey={0} Mouse
                            />

                            {/* Monitor */}
                            <EquipmentComponentItem
                                HandleInputChangeEquipmentComponents={HandleInputChangeEquipmentComponents}
                                item_name={equipmentComponents?.monitor_name}
                                item_serial_number={equipmentComponents?.monitor_serial_number}
                                item_type="monitor"
                                refShowSerialNumber={refShowSerialNumber}
                                refKey={1}
                            />

                            {/* Keyboard */}
                            <EquipmentComponentItem
                                HandleInputChangeEquipmentComponents={HandleInputChangeEquipmentComponents}
                                item_name={equipmentComponents?.keyboard_name}
                                item_serial_number={equipmentComponents?.keyboard_serial_number}
                                item_type="keyboard"
                                refShowSerialNumber={refShowSerialNumber}
                                refKey={2}
                            />

                            {/* Mouse */}
                            <EquipmentComponentItem
                                HandleInputChangeEquipmentComponents={HandleInputChangeEquipmentComponents}
                                item_name={equipmentComponents?.mouse_name}
                                item_serial_number={equipmentComponents?.mouse_serial_number}
                                item_type="mouse"
                                refShowSerialNumber={refShowSerialNumber}
                                refKey={3}
                            />

                            {
                                equipment?.requires_avr == 'true' ? (
                                    <EquipmentComponentItem
                                        HandleInputChangeEquipmentComponents={HandleInputChangeEquipmentComponents}
                                        item_name={equipmentComponents?.avr_name}
                                        item_serial_number={equipmentComponents?.avr_serial_number}
                                        item_type="avr"
                                        refShowSerialNumber={refShowSerialNumber}
                                        refKey={4}
                                    />
                                    ) : ""
                                }

                                {
                                    equipment?.requires_headset == "true" ? (
                                        <EquipmentComponentItem
                                            HandleInputChangeEquipmentComponents={HandleInputChangeEquipmentComponents}
                                            item_name={equipmentComponents?.headset_name}
                                            item_serial_number={equipmentComponents?.headset_serial_number}
                                            item_type="headset"
                                            refShowSerialNumber={refShowSerialNumber}
                                            refKey={5}
                                        />
                                    ) : ''
                                }

                                <div className="col-6 p-1 ps-0">
                                    <div className="rounded p-2 px-3 border bg-body-tertiary">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="form-check form-switch d-flex gap-2 align-items-center">
                                                <input className="form-check-input" type="checkbox" id="plugged_power_cable" name="plugged_power_cable" value={equipment?.plugged_power_cable} checked={equipment?.plugged_power_cable == "true"} onChange={(e) => setEquipment({ ...equipment, plugged_power_cable: equipment?.plugged_power_cable == "true" ? "false" : "true" })} />
                                                <label className="form-check-label" htmlFor="plugged_power_cable">Power Cable</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6 p-1 pe-0">
                                    <div className="rounded p-2 px-3 border bg-body-tertiary">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="form-check form-switch d-flex gap-2 align-items-center">
                                                <input className="form-check-input" type="checkbox" id="plugged_display_cable" name="plugged_display_cable" value={equipment?.plugged_display_cable} checked={equipment?.plugged_display_cable == "true"} onChange={(e) => setEquipment({ ...equipment, plugged_display_cable: equipment?.plugged_display_cable == "true" ? "false" : "true" })} />
                                                <label className="form-check-label" htmlFor="plugged_display_cable">Display Cable</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                           
                        </div>

                        



                        <div className="mb-4">
                            <div className="d-flex align-items-center justify-content-start gap-1">
                                <button className="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2">
                                    Status and Configurations
                                </button>

                                <button className={`btn btn-sm btn-secondary ${clickedShowAllSerial ? "visually-hidden" : ""}`} onClick={() => handleShowAllSerial()} disabled={clickedShowAllSerial}>Show Serial Numbers</button>
                            </div>
                        </div>

                        <div className="collapse" id="collapseExample2">
                            <div>
                                <div className="p-3 bg-body-tertiary rounded mb-4">
                                    <div className="container-fluid mb-5">
                                        <div className="row row-cols-2 row-gap-4">
                                            <div className="col">
                                                <label for="equipment_name" name="name" class="form-label">Equipment Set Name</label>
                                                <input type="email" class="form-control" id="equipment_name" name="name" placeholder="Equipment Name" value={equipment?.name} onChange={HandleInputChangeEquipments} />
                                            </div>

                                            <div className="col">
                                                <label for="equipment_name" name="name" class="form-label">Location</label>
                                                <input type="email" class="form-control" id="equipment_name" name="name" disabled value={equipment?.location_name} />
                                            </div>

                                            <div className="col">
                                                <label className="form-check-label mb-1" htmlFor="requires_avr">AVR Unit</label>
                                                <select className="form-select" aria-label="Default select example" id="requires_avr" name="requires_avr" value={equipment?.requires_avr} onChange={HandleInputChangeEquipments}>
                                                    <option value="true">Required</option>
                                                    <option value="false">Not Required</option>
                                                </select>
                                            </div>

                                            <div className="col">
                                                <label className="form-check-label mb-1" htmlFor="requires_headset">Includes Headset</label>
                                                <select className="form-select" aria-label="Default select example" id="requires_headset" name="requires_headset" value={equipment?.requires_headset} onChange={HandleInputChangeEquipments}>
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="container-fluid mb-3">
                                        <div className="row row-cols-3 row-gap-4">
                                            <div className="col">
                                                <label className="form-check-label mb-1" htmlFor="status">Status</label>
                                                <select className="form-select" aria-label="Default select example" id="status" name="status" value={equipment?.status} onChange={HandleInputChangeEquipments}>
                                                    <option value="active">Active</option>
                                                    <option value="suspended">Maintenance</option>
                                                    <option value="maintenance">Disabled</option>
                                                </select>
                                            </div>

                                            <div className="col">
                                                <label className="form-check-label mb-1" htmlFor="connectivity">Internet</label>
                                                <select className="form-select" aria-label="Default select example" id="connectivity" name="connectivity" value={equipment?.connectivity} onChange={HandleInputChangeEquipments}>
                                                    <option value="stable">Stable</option>
                                                    <option value="unstable">Unstable</option>
                                                    <option value="untested">Untested</option>
                                                </select>
                                            </div>

                                            <div className="col">
                                                <label className="form-check-label mb-1" htmlFor="performance">Performance</label>
                                                <select className="form-select" aria-label="Default select example" id="performance" name="performance" value={equipment?.performance} onChange={HandleInputChangeEquipments}>
                                                    <option value="stable">Stable</option>
                                                    <option value="unstable">Unstable</option>
                                                    <option value="untested">Untested</option>
                                                </select>
                                            </div>

                                            <div className="col-12">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Issues</label>
                                                    {
                                                        equipment?.issue && (
                                                            <a className="text-muted cursor-pointer border-0" onClick={() => setEquipment({ ...equipment, issue: '' })}>Clear Issues</a>
                                                        )
                                                    }
                                                </div>
                                                <textarea className="form-control" id="issue" name="issue" value={equipment?.issue} onChange={HandleInputChangeEquipments} rows="3"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center align-items-center">
                            <div className="btn btn-primary fw-bold" onClick={HandleUpdate}>Update</div>
                        </div>
                    </FormModal>
            }
        </>
    )
}


// component for Equipment Set
function EquipmentComponentItem({ item_name, item_serial_number, item_type, HandleInputChangeEquipmentComponents, refShowSerialNumber, refKey }) {
    const { notifyInform } = useNotifications()


    // handle copy text to clipboard
    const handleCopy = (text) => {
        copy(text)
        notifyInform("Copied to Clipboard", text)
    }

    // list of icons 
    const ICONS = {
        system_unit: <i className="pe-3 fs-5 bi bi-pc" data-toggle="tooltip" data-placement="top" title="System Unit"></i>,
        monitor: <i className="pe-3 fs-5 bi bi-display-fill" data-toggle="tooltip" data-placement="top" title="Monitor"></i>,
        keyboard: <i className="pe-3 fs-5 bi bi-keyboard" data-toggle="tooltip" data-placement="top" title="Keyboard"></i>,
        mouse: <i className="pe-3 fs-5 bi bi-mouse" data-toggle="tooltip" data-placement="top" title="Mouse"></i>,
        avr: <i className="pe-3 fs-5 bi bi-power" data-toggle="tooltip" data-placement="top" title="AVR Unit"></i>,
        headset: <i className="pe-3 fs-5 bi bi-headset" data-toggle="tooltip" data-placement="top" title="Headset Unit"></i>,
    };

    return (
        <div className="col p-1 px-0">
            <div className="rounded p-2 px-3 border bg-body-tertiary">
                <div className="d-flex align-items-center justify-content-between">
                    {
                        ICONS[item_type]
                    }
                    <div className="p flex-fill">
                        <input type="text" className="form-control border-0 bg-transparent rounded-0" id={`${item_type}_name`} name={`${item_type}_name`} placeholder="Enter Brand or Model" value={item_name} onChange={HandleInputChangeEquipmentComponents} />
                    </div>
                    <div className="d-flex gap-2">
                        <div className="px-2">
                            {(() => {
                                const isNamePresent = !!item_name?.trim();
                                const isSerialPresent = !!item_serial_number?.trim();

                                let badgeColor = "danger";
                                let badgeText = "Missing";

                                if (isNamePresent && isSerialPresent) {
                                    badgeColor = "success";
                                    badgeText = "Active";
                                } else if (isNamePresent || isSerialPresent) {
                                    badgeColor = "secondary";
                                    badgeText = "Incomplete";
                                }

                                return (
                                    <span className={`badge text-light text-bg-${badgeColor}`}>
                                        {badgeText}
                                    </span>
                                );
                            })()}

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
                                    <input type="text" className="form-control border-0" id={`${item_type}_serial_number`} name={`${item_type}_serial_number`} placeholder="Serial Number" value={item_serial_number} onChange={HandleInputChangeEquipmentComponents} />
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
const checkEquipmentSetIssues = (data) => {
    const issueIcons = [];  // icons for issues in equipment and components
    const allIcons = [];    // all icons, showing the issues

    // SYSTEM UNIT
    const systemUnitOk =
        data?.system_unit_name &&
        data?.system_unit_serial_number;

    allIcons.push(
        <i
            key="system"
            className={`bi fs-5 opacity-75 bi-pc ${systemUnitOk ? "" : "text-danger"}`}
        ></i>
    );
    if (!systemUnitOk) {
        issueIcons.push(
            <i key="system-issue" className="bi fs-5 opacity-75 bi-pc"></i>
        );
    }


    // MONITOR
    const monitorOk =
        data?.monitor_name &&
        data?.monitor_serial_number;

    allIcons.push(
        <i
            key="monitor"
            className={`bi fs-5 opacity-75 bi-display ${monitorOk ? "" : "text-danger"}`}
        ></i>
    );
    if (!monitorOk) {
        issueIcons.push(
            <i key="monitor-issue" className="bi fs-5 opacity-75 bi-display"></i>
        );
    }


    // KEYBOARD
    const keyboardOK =
        data?.keyboard_name &&
        data?.keyboard_serial_number;

    allIcons.push(
        <i
            key="keyboard"
            className={`bi fs-5 opacity-75 bi-keyboard ${keyboardOK ? "" : "text-danger"}`}
        ></i>
    );
    if (!keyboardOK) {
        issueIcons.push(
            <i key="keyboard-issue" className="bi fs-5 opacity-75 bi-keyboard"></i>
        );
    }


    // MOUSE
    const mouseOK =
        data?.mouse_name &&
        data?.mouse_serial_number;

    allIcons.push(
        <i
            key="mouse"
            className={`bi fs-5 opacity-75 bi-mouse ${mouseOK ? "" : "text-danger"}`}
        ></i>
    );
    if (!mouseOK) {
        issueIcons.push(
            <i key="mouse-issue" className="bi fs-5 opacity-75 bi-mouse"></i>
        );
    }


    // POWER CABLE
    const powerOk = data.plugged_power_cable === "true";

    allIcons.push(
        <i key="power" className={`fs-5 opacity-75 ${powerOk ? "" : "text-danger"}`}>
            <LuCable />
        </i>
    );
    if (!powerOk) {
        issueIcons.push(
            <i key="power-issue" className="fs-5 opacity-75">
                <LuCable />
            </i>
        );
    }

    // DISPLAY CABLE
    const displayOk = data.plugged_display_cable === "true";

    allIcons.push(
        <i key="display" className={`fs-5 opacity-75 ${displayOk ? "" : "text-danger"}`}>
            <MdCable />
        </i>
    );
    if (!displayOk) {
        issueIcons.push(
            <i key="display-issue" className="fs-5 opacity-75">
                <MdCable />
            </i>
        );
    }

    return {
        ISSUE_ICONS: issueIcons,
        ALL_ICONS: allIcons,
    };
};
