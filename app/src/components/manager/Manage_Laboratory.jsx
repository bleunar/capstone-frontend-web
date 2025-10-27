import { useEffect, useState } from "react";
import Item_EquipmentSet from "../forms/Forms_EquipmentSet";
import { useSystemAPI } from "../../hooks/useSystemAPI";
import ReturnButton from "../general/ReturnButton";
import FormModal from "../general/FormModal";
import { useNotifications } from "../../context/NotificationContext";
import { FormsAdd_Locations } from "../forms/Forms_Locations";
import { KPICounter } from "../visualizer/KPICounter";

export default function LabManagement() {
    const { API_GET } = useSystemAPI();
    const [locations, setLocations] = useState([]);
    const [activeTab, setActiveTab] = useState("");

    async function FetchLocations() {
        try {
            const result = await API_GET("/locations");
            setLocations(result);
        } catch (error) {
            console.error(error);
        }
    };

    // fetch if auth is completed
    useEffect(() => {
        FetchLocations();
    }, []);

    // set tab to index 0 if location is fetched
    useEffect(() => {
        if (locations && locations.length > 0 && !activeTab) {
            setActiveTab(locations[0].id);
        }
    }, [locations, activeTab]);
    return (
        <>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="h2 fw-bold mb-3">Manage Computer Laboratory</div>
                    <div className="d-flex gap-2">
                        <AddEquipmentsModal locations={locations} />
                        <FormsAdd_Locations mode="button" refetch_data={FetchLocations} />
                    </div>
                </div>

                <div className="d-flex justify-content-between mb-3 flex-wrap-reverse">
                    <ul className="nav nav-pills gap-2 justify-content-start w-100" id="myTab" role="tablist">
                        {locations.map((item) => (
                            <li key={item.id} className="nav-item" role="presentation">
                                <button
                                    className={`nav-link border-primary border ${activeTab === item.id ? "active" : ""
                                        }`}
                                    type="button"
                                    role="tab"
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                        <li>
                        </li>
                    </ul>
                </div>

                <div className="tab-content" id="myTabContent">
                    {locations.map((item) => (
                        <div
                            key={item.id}
                            className={`tab-pane fade ${activeTab === item.id ? "show active" : ""
                                }`}
                            id={`tab-pane-${item.id}`}
                            role="tabpanel"
                            aria-labelledby={`tab-${item.id}`}
                            tabIndex="1"
                        >
                            <div className="container-fluid">
                                    {activeTab === item.id && (
                                        <LabEquipments location_id={item.id} current_active_tab={activeTab} />
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}


function LabEquipments({ location_id, current_active_tab }) {
    const [loading, setLoading] = useState(false)
    const [equipmentSets, setEquipmentSets] = useState([]);
    const { API_GET } = useSystemAPI();
    const { notifyError } = useNotifications()

    async function FetchEquipmentSets() {
        try {
            const result = await API_GET(
                `/equipment_sets/location/${location_id}`
            );
            setEquipmentSets(result);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    };

    function Refresh() {
        FetchEquipmentSets()
    }

    useEffect(() => {
        if (location_id && current_active_tab == location_id) {
            FetchEquipmentSets();
        }
    }, [location_id, current_active_tab]);


    if (loading) return (
        <div className="d-flex justify-content-center align-items-center w-100">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    )


    return (
        <>
            <div className="container-fluid">
                <div className="row row-cols-2">
                        <KPICounter title="Total Equipments" type="primary" source={`/equipment_sets/analytics/total/location/${location_id}`} />
                        <KPICounter title="With Issues" type="primary" source={`/equipment_sets/analytics/issues/total/location/${location_id}`} />
                </div>
            </div>

            <hr />

            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 row-cols-xxl-5">
                {
                    equipmentSets && equipmentSets.map((item, key) => (
                        <Item_EquipmentSet key={key} target_id={item.equipment_set_id} display_data={item} refresh_parent={Refresh} />
                    ))
                }

                {
                    equipmentSets && equipmentSets.length == 0 && (
                        <div className="text-center w-100">No Items</div>
                    )
                }
            </div>
        </>
    );
}



function AddEquipmentsModal({ locations }) {
    const [showModal, setShowModal] = useState(false);

    function HandleCloseParentModal() {
        setShowModal(false)
    }

    return (
        <>
            <button
                type="button"
                className="btn btn-primary d-flex gap-2"
                onClick={() => setShowModal(true)}
            >
                <i className="bi bi-plus"></i>
                <div className="d-none d-md-block">Add Equipment</div>
            </button>

            {showModal && (
                <FormModal size="lg" title={`Add Equipments`} onClose={() => setShowModal(false)}>
                    <div className="my-3">
                        <ul class="nav nav-tabs justify-content-center" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="tab1-tab" data-bs-toggle="tab" data-bs-target="#single_panel" type="button" role="tab" aria-controls="single_panel" aria-selected="true">
                                    Single
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="tab2-tab" data-bs-toggle="tab" data-bs-target="#multi_panel" type="button" role="tab" aria-controls="multi_panel" aria-selected="false">
                                    Multiple
                                </button>
                            </li>
                        </ul>

                        <div class="tab-content mt-3" id="myTabContent">
                            <div class="tab-pane fade show active" id="single_panel" role="tabpanel" aria-labelledby="tab1-tab">
                                <AddSingleEquipment locations={locations} closeModal={HandleCloseParentModal} />
                            </div>

                            <div class="tab-pane fade" id="multi_panel" role="tabpanel" aria-labelledby="tab2-tab">
                                <AddBatchEquipment locations={locations} closeModal={HandleCloseParentModal} />
                            </div>
                        </div>

                    </div>
                </FormModal>
            )}
        </>
    );
}

const BASE_SINGLE_EQUIPMENT = {
    location_id: '',
    name: 'PC #',
    system_unit_name: 'System Unit',
    monitor_name: 'Monitor',
    keyboard_name: 'Keyboard',
    mouse_name: 'Mouse',
    avr_name: 'AVR Unit',
    headset_name: 'Headset Unit',
    plugged_power_cable: '',
    plugged_display_cable: '',
    requires_avr: '',
    requires_headset: '',
}

function AddSingleEquipment({ locations, closeModal }) {
    const [newEquipment, setNewEquipment] = useState(BASE_SINGLE_EQUIPMENT)
    const [errorMessage, setErrorMessage] = useState("");
    const { API_POST } = useSystemAPI()
    const { notifyConfirm, notifyError } = useNotifications()


    const HandleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewEquipment((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrorMessage("");
    };

    const validateForm = () => {
        const missing = [];
        if (!newEquipment.location_id) missing.push("Location");
        if (!newEquipment.name?.trim()) missing.push("Name");

        if (missing.length > 0) {
            setErrorMessage(`Please fill in the following fields: ${missing.join(", ")}`);
            return false;
        }

        setErrorMessage("");
        return true;
    };

    async function HandleSubmit(e) {
        e.preventDefault()

        if (!validateForm()) return; // stop if invalid

        try {
            API_POST("/equipment_sets/single", newEquipment)
            notifyConfirm("Success")
            closeModal()
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setNewEquipment({...newEquipment, "name": newEquipment.name.toUpperCase()})
    }, [newEquipment?.name])

    return (
        <>
            <div className="container-fluid">
                <div className="mb-3">
                    <label htmlFor="target_location" className="form-label">
                        Select Target Location:
                    </label>

                    <select
                        className="form-select"
                        id="target_location"
                        aria-label="Select target location"
                        value={newEquipment.location_id}
                        onChange={HandleInputChange}
                        name="location_id"
                    >
                        <option hidden>Select a Location</option>
                        {locations &&
                            locations.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                    </select>
                </div>


                <div class="mb-3">
                    <label for="name" class="form-label">System Unit Name</label>
                    <input type="text" class="form-control" id="name" name="name" placeholder="PC #" value={newEquipment.name} onChange={HandleInputChange} />
                </div>


                <div className="mb-3 text-start">
                    <button class="btn btn-outline-secondary btn-sm " type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        Set Default Values
                    </button>
                </div>


                <div class="collapse" id="collapseExample">
                    <div className="mb-3">
                        <div className="h4">Default Values</div>
                        <hr />
                        <div className="container-fluid">
                            <div className="row row-cols-2">
                                <div className="col p-1">
                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" id="requires_headset" name="requires_headset" value={newEquipment.requires_headset} onChange={HandleInputChange} />
                                        <label class="form-check-label" for="requires_headset">
                                            Includes Headset Unit
                                        </label>
                                    </div>
                                </div>

                                <div className="col p-1">
                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" id="requires_avr" name="requires_avr" value={newEquipment.requires_avr} onChange={HandleInputChange} />
                                        <label class="form-check-label" for="requires_avr">
                                            Includes AVR Unit
                                        </label>
                                    </div>
                                </div>
                                <div class="col p-1">
                                    <label for="system_unit_name" class="form-label">System Unit Brand/Model</label>
                                    <input type="text" class="form-control" id="system_unit_name" name="system_unit_name" value={newEquipment.system_unit_name} onChange={HandleInputChange} />
                                </div>

                                <div class="col p-1">
                                    <label for="monitor_name" class="form-label">Monitor Brand/Model</label>
                                    <input type="text" class="form-control" id="monitor_name" name="monitor_name" value={newEquipment.monitor_name} onChange={HandleInputChange} />
                                </div>

                                <div class="col p-1">
                                    <label for="equipment_set_nakeyboard_nameme" class="form-label">Keyboard Brand/Model</label>
                                    <input type="text" class="form-control" id="keyboard_name" name="keyboard_name" value={newEquipment.keyboard_name} onChange={HandleInputChange} />
                                </div>

                                <div class="col p-1">
                                    <label for="mouse_name" class="form-label">Mouse Brand/Model</label>
                                    <input type="text" class="form-control" id="mouse_name" name="mouse_name" value={newEquipment.mouse_name} onChange={HandleInputChange} />
                                </div>

                                {
                                    newEquipment.requires_avr && (
                                        <div class="col p-1">
                                            <label for="avr_name" class="form-label">AVR Unit Brand/Model</label>
                                            <input type="text" class="form-control" id="avr_name" name="avr_name" value={newEquipment.avr_name} onChange={HandleInputChange} />
                                        </div>
                                    )
                                }

                                {
                                    newEquipment.requires_headset && (
                                        <div class="col p-1">
                                            <label for="headset_name" class="form-label">Headset Unit Brand/Model</label>
                                            <input type="text" class="form-control" id="headset_name" name="headset_name" value={newEquipment.headset_name} onChange={HandleInputChange} />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>


                {errorMessage && (
                    <div className="mt-2 text-danger small text-center">
                        {errorMessage}
                    </div>
                )}

                <div className="text-center">
                    <div className="btn btn-primary" type="submit" onClick={HandleSubmit}>Submit</div>
                </div>
            </div>
        </>
    )
}



// ------------------
const BASE_BATCH_EQUIPMENT = {
    location_id: '',
    prefix: 'PC ',
    count: '5',
    system_unit_name: 'System Unit',
    monitor_name: 'Monitor',
    keyboard_name: 'Keyboard',
    mouse_name: 'Mouse',
    avr_name: 'AVR Unit',
    headset_name: 'Headset Unit',
    plugged_power_cable: '',
    plugged_display_cable: '',
    requires_avr: '',
    requires_headset: '',
}

function AddBatchEquipment({ locations, closeModal }) {
    const [newEquipments, setNewEquipments] = useState(BASE_BATCH_EQUIPMENT);
    const [errorMessage, setErrorMessage] = useState("");
    const { API_POST } = useSystemAPI();
    const { notifyConfirm, notifyError } = useNotifications();

    const HandleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewEquipments((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrorMessage("");
    };

    const validateForm = () => {
        const missing = [];
        if (!newEquipments.location_id) missing.push("Location");
        if (!newEquipments.prefix?.trim()) missing.push("Prefix");
        if (!newEquipments.count || newEquipments.count < 1) missing.push("Count");

        if (missing.length > 0) {
            setErrorMessage(`Please fill in the following fields: ${missing.join(", ")}`);
            return false;
        }

        setErrorMessage("");
        return true;
    };

    async function HandleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await API_POST("/equipment_sets/batch", newEquipments);
            notifyConfirm("Success");
            closeModal();
        } catch (error) {
            notifyError(error);
        }
    }

    useEffect(() => {
        setNewEquipments({...newEquipments, "prefix": newEquipments.prefix.toUpperCase()})
    }, [newEquipments?.prefix])

    return (
        <>
            <div className="container-fluid">
                {/* Location */}
                <div className="mb-3">
                    <label htmlFor="target_location" className="form-label">
                        Select Target Location:
                    </label>

                    <select
                        className="form-select"
                        id="target_location"
                        aria-label="Select target location"
                        value={newEquipments.location_id}
                        onChange={HandleInputChange}
                        name="location_id"
                    >
                        <option hidden>Select a Location</option>
                        {locations &&
                            locations.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Prefix & Count */}
                <div className="row row-cols-1 row-cols-md-2 mb-3">
                    <div className="col">
                        <label htmlFor="prefix" className="form-label">Prefix</label>
                        <input
                            type="text"
                            className="form-control"
                            id="prefix"
                            name="prefix"
                            placeholder="PC #"
                            value={newEquipments.prefix}
                            onChange={HandleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="count" className="form-label">Count</label>
                        <input
                            type="number"
                            min={1}
                            max={50}
                            className="form-control"
                            id="count"
                            name="count"
                            value={newEquipments.count}
                            onChange={HandleInputChange}
                        />
                    </div>
                </div>

                {/* Default Values Section */}
                <div className="mb-3 text-start">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseExample"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                    >
                        Set Default Values
                    </button>
                </div>

                {/* Preview Section */}
                <div className="p-3 my-3 rounded bg-body-tertiary">
                    <div className="text-muted text-nowrap mb-3 text-center">
                        This will create {newEquipments.count || 0} counts of Equipments:
                    </div>
                    <div className="d-flex gap-2 align-items-center flex-wrap justify-content-center">
                        {Array.from({ length: newEquipments.count || 0 }).map((_, i) => (
                            <div key={i} className="p-1 bg-primary rounded text-nowrap small text-white">
                                {newEquipments.prefix}
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>


                <div className="collapse" id="collapseExample">
                    <div className="mb-3">
                        <div className="h4">Default Values</div>
                        <hr />
                        <div className="container-fluid">
                            <div className="row row-cols-2">
                                <div className="col p-1">
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="requires_avr_batch"
                                            name="requires_avr"
                                            checked={newEquipments.requires_avr}
                                            onChange={HandleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="requires_avr_batch">
                                            Includes AVR Unit
                                        </label>
                                    </div>
                                </div>

                                <div className="col p-1">
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="requires_headset_batch"
                                            name="requires_headset"
                                            checked={newEquipments.requires_headset}
                                            onChange={HandleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="requires_headset_batch">
                                            Includes Headset Unit
                                        </label>
                                    </div>
                                </div>

                                <div className="col p-1">
                                    <label htmlFor="system_unit_name" className="form-label">
                                        System Unit Brand/Model
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="system_unit_name"
                                        name="system_unit_name"
                                        value={newEquipments.system_unit_name}
                                        onChange={HandleInputChange}
                                    />
                                </div>

                                <div className="col p-1">
                                    <label htmlFor="monitor_name" className="form-label">
                                        Monitor Brand/Model
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="monitor_name"
                                        name="monitor_name"
                                        value={newEquipments.monitor_name}
                                        onChange={HandleInputChange}
                                    />
                                </div>

                                <div className="col p-1">
                                    <label htmlFor="keyboard_name" className="form-label">
                                        Keyboard Brand/Model
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="keyboard_name"
                                        name="keyboard_name"
                                        value={newEquipments.keyboard_name}
                                        onChange={HandleInputChange}
                                    />
                                </div>

                                <div className="col p-1">
                                    <label htmlFor="mouse_name" className="form-label">
                                        Mouse Brand/Model
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="mouse_name"
                                        name="mouse_name"
                                        value={newEquipments.mouse_name}
                                        onChange={HandleInputChange}
                                    />
                                </div>

                                {newEquipments.requires_avr && (
                                    <div className="col p-1">
                                        <label htmlFor="avr_name" className="form-label">
                                            AVR Unit Brand/Model
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="avr_name"
                                            name="avr_name"
                                            value={newEquipments.avr_name}
                                            onChange={HandleInputChange}
                                        />
                                    </div>
                                )}

                                {newEquipments.requires_headset && (
                                    <div className="col p-1">
                                        <label htmlFor="headset_name" className="form-label">
                                            Headset Unit Brand/Model
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="headset_name"
                                            name="headset_name"
                                            value={newEquipments.headset_name}
                                            onChange={HandleInputChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {errorMessage && (
                    <div className="mt-2 text-danger small text-center">
                        {errorMessage}
                    </div>
                )}


                <div className="text-center mt-3">
                    <button className="btn btn-primary" type="submit" onClick={HandleSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}
