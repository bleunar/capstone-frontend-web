import { useEffect, useState } from "react";
import FormModal from "../components/general/FormModal";
// import { useSystemAPI } from "../hooks/useSystemAPI"; // disable for now

const DUMMY_LOCATIONS = [
    { id: 1, name: "Main Branch – Iloilo" },
    { id: 2, name: "Cebu IT Office" },
]

const DUMMY_ACTIVITIES = {
    1: [
        { id: 101, equipment_set_component: "Router", equipment_set_name: "Rack 1", account_name: "John Doe", time_elapsed: "10m ago", equipment_set_component_value_old: "Offline", equipment_set_component_value_current: "Online" },
        { id: 102, equipment_set_component: "Switch", equipment_set_name: "Rack 2", account_name: "Jane Dela Cruz", time_elapsed: "30m ago", equipment_set_component_value_old: "Down", equipment_set_component_value_current: "Active" },
    ],
    2: [
        { id: 201, equipment_set_component: "Server PSU", equipment_set_name: "Server A", account_name: "Mark Santos", time_elapsed: "1h ago", equipment_set_component_value_old: "Faulty", equipment_set_component_value_current: "Replaced" },
    ]
}


export default function ActivitiesPage() {
    const [selectedActivities, setSelectedActivities] = useState([])
    const [locations, setLocations] = useState([])

    useEffect(() => {
        setLocations(DUMMY_LOCATIONS) // Replace with API_GET later
    }, [])

    // --- SELECT HANDLERS ---
    const handleSelectOne = (activityId, checked) => {
        setSelectedActivities(prev =>
            checked ? [...prev, activityId] : prev.filter(id => id !== activityId)
        )
    }

    const handleSelectAllInLocation = (locationId, activityIds, selectAll) => {
        setSelectedActivities(prev => {
            if (selectAll) {
                // Add all that aren't already selected
                const newIds = activityIds.filter(id => !prev.includes(id))
                return [...prev, ...newIds]
            } else {
                // Remove all from this location
                return prev.filter(id => !activityIds.includes(id))
            }
        })
    }

    const handleSelectAllGlobal = (selectAll) => {
        if (selectAll) {
            // Combine all activity IDs across locations
            const allIds = locations.flatMap(loc =>
                (DUMMY_ACTIVITIES[loc.id] || []).map(a => a.id)
            )
            setSelectedActivities(allIds)
        } else {
            setSelectedActivities([])
        }
    }

    // === Check global selection ===
    const allActivityIds = locations.flatMap(loc =>
        (DUMMY_ACTIVITIES[loc.id] || []).map(a => a.id)
    )
    const allSelected = allActivityIds.length > 0 && selectedActivities.length === allActivityIds.length

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="h2 fw-bold">System Activities</div>
                <EmailStagingFormModal selectedActivities={selectedActivities} />
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
                <div className="h5 mb-0">Today</div>
                <button
                    className={`btn btn-sm ${allSelected ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handleSelectAllGlobal(!allSelected)}
                >
                    {allSelected ? "Deselect All" : "Select All"}
                </button>
            </div>

            <hr />

            {locations.map((loc) => (
                <LocationActivities
                    key={loc.id}
                    lab_data={loc}
                    selectedActivities={selectedActivities}
                    onSelectOne={handleSelectOne}
                    onSelectAll={handleSelectAllInLocation}
                />
            ))}
        </div>
    )
}
function LocationActivities({ lab_data, selectedActivities, onSelectOne, onSelectAll }) {
    const [locationActivities, setLocationActivities] = useState([])

    useEffect(() => {
        if (lab_data?.id) {
            setTimeout(() => {
                setLocationActivities(DUMMY_ACTIVITIES[lab_data.id] || [])
            }, 300)
        }
    }, [lab_data])

    const activityIds = locationActivities.map(a => a.id)
    const allSelected = activityIds.length > 0 && activityIds.every(id => selectedActivities.includes(id))

    return (
        <div className="mb-3">
            <div className="d-flex justify-content-start gap-2 align-items-center">
                <div className="h5">{lab_data?.name}</div>
                <button
                    className={`btn btn-sm ${allSelected ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => onSelectAll(lab_data.id, activityIds, !allSelected)}
                >
                    {allSelected ? "Deselect All" : "Select All"}
                </button>
            </div>

            <ul className="list-group list-group-flush">
                {locationActivities.map((item) => (
                    <ActivityItem
                        key={item.id}
                        item={item}
                        checked={selectedActivities.includes(item.id)}
                        onSelectChange={onSelectOne}
                    />
                ))}
            </ul>
        </div>
    )
}

function ActivityItem({ item, checked, onSelectChange }) {
    const handleChange = () => {
        onSelectChange(item.id, !checked)
    }

    return (
        <li className="list-group-item py-2 px-0">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex flex-fill align-items-center" onClick={handleChange}>
                    <input
                        className="form-check-input me-2"
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange}
                    />
                    <div>
                        <div className="fw-semibold">
                            Updated <b>{item.equipment_set_component}</b> on <b>{item.equipment_set_name}</b>
                        </div>
                        <div className="text-muted small">{item.account_name} • {item.time_elapsed}</div>
                    </div>
                </div>

                <div className="d-none d-lg-flex align-items-center gap-3">
                    <div className="text-muted">{item.equipment_set_component_value_old}</div>
                    <i className="bi bi-arrow-right"></i>
                    <div className="text-bg-secondary bg-opacity-75 px-2 py-1 rounded">
                        {item.equipment_set_component_value_current}
                    </div>
                </div>
            </div>
        </li>
    )
}

function EmailStagingFormModal({ selectedActivities }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                type="button"
                className="btn btn-primary d-flex gap-2"
                onClick={() => setShowModal(true)}
            >
                <i className="bi bi-share-fill"></i>
                <div className="d-none d-md-block">Share</div>
            </button>

            {showModal && (
                <FormModal size="lg" title="Staging" onClose={() => setShowModal(false)}>
                    <div className="p text-muted">
                        System Activities will be sent to the following accounts via email
                    </div>

                    <div className="mb-3">
                        <div className="p">Activities to Share</div>
                        <RadioToggleGroup />
                    </div>

                    <div className="mb-3">
                        <div className="p">Sent to:</div>
                        <div className="d-flex gap-1 flex-wrap">
                            <div className="btn btn-outline-primary btn-sm">John Doe</div>
                            <div className="btn btn-outline-primary btn-sm">Alberto Rodriguez</div>
                            <div className="btn btn-primary btn-sm">
                                <i className="bi bi-plus-lg"></i>
                            </div>
                        </div>
                    </div>

                    <p className="mb-3">
                        <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapsePreview"
                            aria-expanded="false"
                            aria-controls="collapsePreview"
                        >
                            Preview Email Content
                        </button>
                    </p>

                    <div className="collapse" id="collapsePreview">
                        <div className="card card-body">
                            {selectedActivities.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {selectedActivities.map((id) => (
                                        <li key={id} className="list-group-item">
                                            Activity #{id} selected
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-muted">No activities selected</div>
                            )}
                        </div>
                    </div>

                    <div className="text-center mt-3">
                        <div className="btn btn-primary">Send</div>
                    </div>
                </FormModal>
            )}
        </>
    );
}

function RadioToggleGroup() {
    const [selected, setSelected] = useState("select_all");

    const handleChange = (e) => {
        setSelected(e.target.id);
    };

    return (
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="select_all"
                autoComplete="off"
                checked={selected === "select_all"}
                onChange={handleChange}
            />
            <label className="btn btn-outline-primary" htmlFor="select_all">
                All
            </label>

            <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="selected_only"
                autoComplete="off"
                checked={selected === "selected_only"}
                onChange={handleChange}
            />
            <label className="btn btn-outline-primary" htmlFor="selected_only">
                Selected Only
            </label>
        </div>
    );
}
