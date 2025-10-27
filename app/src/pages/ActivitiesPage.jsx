import { useEffect, useState } from "react";
import FormModal from "../components/general/FormModal";
import { useSystemAPI } from "../hooks/useSystemAPI";
import { useNotifications } from "../context/NotificationContext";
import { useEmailService } from "../hooks/useEmail";


const ACTION_LABELS = {
    system_unit_name: "System Unit Name",
    monitor_name: "Display Name",
    keyboard_name: "Keyboard Name",
    mouse_name: "Mouse Name",
    avr_name: "AVR Name",
    headset_name: "Headset Name",
    system_unit_serial_number: "System Unit Serial",
    monitor_serial_number: "Display Serial",
    keyboard_serial_number: "Keyboard Serial",
    mouse_serial_number: "Mouse Serial",
    avr_serial_number: "AVR Serial",
    headset_serial_number: "Headset Serial",
    requires_avr: "Requires AVR",
    requires_headset: "Requires Headset",
    plugged_display_cable: "Display Cable Plugged",
    plugged_power_cable: "Power Cable Plugged",
    connectivity: "Connectivity",
    performance: "Performance",
    status: "Status",
    name: "Equipment Set Name",
    issue: "Equipment Issues",
};


export default function ActivitiesPage() {
    const [selectedActivities, setSelectedActivities] = useState([])
    const [locations, setLocations] = useState([])
    const [activitiesByLocation, setActivitiesByLocation] = useState({})
    const { API_GET } = useSystemAPI()
    const { notifyError } = useNotifications()

    useEffect(() => {
        FetchLocations()
    }, [])

    async function FetchLocations() {
        try {
            const result = await API_GET("/locations")
            setLocations(result)
        } catch (error) {
            notifyError(error)
        }
    }

    // --- Called by child component after fetching ---
    const handleActivitiesFetched = (locationId, activities) => {
        setActivitiesByLocation(prev => ({ ...prev, [locationId]: activities }))
    }

    // --- SELECT HANDLERS ---
    const handleSelectOne = (activityId, checked) => {
        setSelectedActivities(prev =>
            checked ? [...prev, activityId] : prev.filter(id => id !== activityId)
        )
    }

    const handleSelectAllInLocation = (locationId, activityIds, selectAll) => {
        setSelectedActivities(prev => {
            if (selectAll) {
                const newIds = activityIds.filter(id => !prev.includes(id))
                return [...prev, ...newIds]
            } else {
                return prev.filter(id => !activityIds.includes(id))
            }
        })
    }

    const handleSelectAllGlobal = (selectAll) => {
        if (selectAll) {
            const allIds = Object.values(activitiesByLocation).flat().map(a => a.id)
            setSelectedActivities(allIds)
        } else {
            setSelectedActivities([])
        }
    }

    const allActivityIds = Object.values(activitiesByLocation).flat().map(a => a.id)
    const allSelected = allActivityIds.length > 0 && selectedActivities.length === allActivityIds.length

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="h2 fw-bold">System Activities</div>
                <EmailStagingFormModal
                    selectedActivities={selectedActivities}
                    activitiesByLocation={activitiesByLocation}
                    refresh={FetchLocations}
                />
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
                <div className="h4 fw-bold mb-0">Today</div>
                <button
                    className={`btn btn-sm ${allSelected ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handleSelectAllGlobal(!allSelected)}
                >
                    {allSelected ? "Deselect All" : "Select All"}
                </button>
            </div>

            <hr />

            {locations && locations.map((loc) => (
                <LocationActivities
                    key={loc.id}
                    lab_data={loc}
                    selectedActivities={selectedActivities}
                    onSelectOne={handleSelectOne}
                    onSelectAll={handleSelectAllInLocation}
                    onActivitiesFetched={handleActivitiesFetched}
                />
            ))}
        </div>
    )
}

function LocationActivities({ lab_data, selectedActivities, onSelectOne, onSelectAll, onActivitiesFetched }) {
    const [locationActivities, setLocationActivities] = useState([])
    const { API_GET } = useSystemAPI()
    const { notifyError } = useNotifications()


    useEffect(() => {
        if (lab_data?.id) {
            FetchActivities(lab_data.id)
        }
    }, [lab_data])

    async function FetchActivities(id) {
        try {
            const result = await API_GET("/equipment_set_activity/today/" + id)
            setLocationActivities(result)
            onActivitiesFetched(id, result)
        } catch (error) {
            notifyError(error)
        }
    }

    const activityIds = locationActivities.map(a => a.id)
    const allSelected = activityIds.length > 0 && activityIds.every(id => selectedActivities.includes(id))

    if (locationActivities.length === 0) return null

    return (
        <>
            <div className="mb-3">
                <div className="d-flex justify-content-between gap-2">
                    <div className="d-flex align-items-baseline gap-2">
                        <div className="h4">{lab_data?.name}</div>
                        <div className="small text-muted">{lab_data?.description}</div>
                    </div>
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

            <hr className="border border-3" />
        </>
    )
}


function ActivityItem({ item, checked, onSelectChange }) {
    const handleChange = () => {
        onSelectChange(item.id, !checked);
    };

    const hasPrevious = item.previous_value !== null && item.previous_value !== undefined && item.previous_value !== '';

    return (
        <li className="list-group-item py-2 px-0">
            <div className={`d-flex align-items-center justify-content-between border-start border-5 mx-3 ps-2 border-primary rounded ${checked ? "border-opacity-100" : "border-opacity-10"}`}>
                <div className="d-flex flex-fill align-items-center cursor-pointer" onClick={handleChange}>
                    <div>
                        <div className="fw-semibold">
                            Updated <b>{ACTION_LABELS[item.action] || item.action}</b> on <b>{item.equipment_set_name}</b>
                        </div>
                        <div className="text-muted small">
                            {item.performed_by_username} • {item.created_at}
                        </div>
                    </div>
                </div>

                <div className="d-none d-lg-flex align-items-center gap-3">
                    {hasPrevious ? (
                        <>
                            <div className="text-muted">{item.previous_value ? item.previous_value : "None"}</div>
                            <i className="bi bi-arrow-right"></i>
                        </>
                    ) : null}

                    <div
                        className={`text-bg-primary bg-opacity-${checked ? "100" : "50"} px-2 py-1 rounded`}
                    >
                        {item.current_value ? item.current_value : "None"}
                    </div>
                </div>

                <div className="ms-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </li>

    );
}

function EmailStagingFormModal({ selectedActivities, activitiesByLocation, refresh }) {
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState("select_all");
    const { API_GET, API_POST } = useSystemAPI();
    const { notifyError, notifyConfirm } = useNotifications();
    const [accounts, setAccounts] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const {EMAIL_SEND, EMAIL_LOADING} = useEmailService()

    // --- Fetch system authority accounts ---
    async function FetchTargetAccount() {
        try {
            const result = await API_GET("/accounts");
            setAccounts(result);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (showModal) {
            FetchTargetAccount();
        }
    }, [showModal]);

    // --- Determine which activities to show based on mode ---
    const allActivities = Object.values(activitiesByLocation).flat();
    const filteredActivities =
        viewMode === "selected_only"
            ? allActivities.filter((a) => selectedActivities.includes(a.id))
            : allActivities;

    // group by location
    const groupedByLocation = {};
    filteredActivities.forEach((a) => {
        if (!groupedByLocation[a.location_id]) groupedByLocation[a.location_id] = [];
        groupedByLocation[a.location_id].push(a);
    });

    
    function formatActivitiesForEmail() {
        return Object.entries(groupedByLocation).map(([locId, acts]) => {
            const locationName = acts[0]?.location_name || "Unknown Location";
            const lines = acts.map(
                (act) =>
                    `• Updated ${ACTION_LABELS[act.action] || act.action} on ${act.equipment_set_name} (${act.performed_by_username})`
            );
            return `${locationName}:\n${lines.join("\n")}`;
        });
    }


    async function HandleSend() {
        try {
            setIsSending(true);

            const emailList = accounts.map((a) => a.email).filter(Boolean);

            // group activities by location
            const grouped = Object.values(
                filteredActivities.reduce((acc, act) => {
                    if (!acc[act.location_id]) {
                        acc[act.location_id] = {
                            location_id: act.location_id,
                            location_name: act.location_name || "Unknown Location",
                            activities: [],
                        };
                    }
                    acc[act.location_id].activities.push(act);
                    return acc;
                }, {})
            );

            // cleared id's
            const clearedIds = filteredActivities.map((a) => a.id);

            const payload = {
                accounts: emailList,
                locations: grouped,
                cleared_activities: clearedIds,
            };

            const resultClear = await API_POST("/equipment_set_activity/clear", {cleared_activities: clearedIds});
            notifyConfirm("Activity cleared successfully!");

            const resultEmail = await EMAIL_SEND(payload)
            notifyConfirm("Email Sent successfully!");

            setShowModal(false);
            refresh()
        } catch (error) {
            console.error(error);
            notifyError("Failed to send email activities");
        } finally {
            setIsSending(false);
        }
    }



    // --- Summary info ---
    const totalActivities = filteredActivities.length;
    const uniqueLocationCount = Object.keys(groupedByLocation).length;

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
                <FormModal size="md" title="Staging" onClose={() => setShowModal(false)}>
                    <div className="mb-3">
                        <div className="p">Activities to Share:</div>
                        <RadioToggleGroup
                            selected={viewMode}
                            onChange={(mode) => setViewMode(mode)}
                            disabled={selectedActivities.length === 0}
                        />
                    </div>

                    <div className="mb-3">
                        <div className="p">Sent to email of:</div>
                        <div className="d-flex gap-1 flex-wrap">
                            {accounts.map((account) => (
                                <div className="badge text-bg-primary" key={account.id}>
                                    {account.full_name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr />

                    <div className="my-5">
                        <div className="mb-3">
                            <div className="p fw-semibold text-center">Activities to Share</div>

                            {totalActivities > 0 ? (
                                <div className="text-muted small mb-2 text-center">
                                    Showing {viewMode === "selected_only" ? "selected" : "all"}{" "}
                                    {totalActivities} {totalActivities === 1 ? "activity" : "activities"}{" "}
                                    from {uniqueLocationCount}{" "}
                                    {uniqueLocationCount === 1 ? "location" : "locations"}.
                                </div>
                            ) : (
                                <div className="text-muted small mb-2">No activities to display.</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <div className="text-center">
                                <a
                                    className="text-muted small"
                                    data-bs-toggle="collapse"
                                    href="#collapse_email_staging"
                                    role="button"
                                    aria-expanded="false"
                                    aria-controls="collapse_email_staging"
                                >
                                    <span>Preview Email Content</span>
                                </a>
                            </div>

                            <div className="collapse mt-2" id="collapse_email_staging">
                                <div className="card card-body border-0 shadow-sm bg-body-tertiary">
                                    {totalActivities > 0 ? (
                                        <ul className="list-group list-group-flush">
                                            {Object.entries(groupedByLocation).map(([locId, acts]) => (
                                                <li key={locId} className="list-group-item py-3 bg-body-tertiary">
                                                    <div className="fw-semibold mb-1">
                                                        {acts[0]?.location_name || "Unknown Location"}
                                                    </div>
                                                    <ul className="list-unstyled ms-3">
                                                        {acts.map((act) => (
                                                            <li key={act.id} className="text-muted small">
                                                                • Updated <b>{ACTION_LABELS[act.action] || act.action}</b> on{" "}
                                                                <b>{act.equipment_set_name}</b>{" "}
                                                                (<i>{act.performed_by_username}</i>)
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-muted">No activities to display</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            className="btn btn-primary w-100"
                            onClick={HandleSend}
                            disabled={isSending || totalActivities === 0}
                        >
                            {EMAIL_LOADING ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Sending...
                                </>
                            ) : (
                                "Send"
                            )}
                        </button>
                    </div>
                </FormModal>
            )}
        </>
    );
}


// --- Toggle group with parent-controlled state ---
function RadioToggleGroup({ selected, onChange, disabled }) {
    return (
        <div
            className="btn-group"
            role="group"
            aria-label="Basic radio toggle button group"
        >
            <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="selected_only"
                autoComplete="off"
                checked={selected === "selected_only"}
                onChange={() => onChange("selected_only")}
                disabled={disabled}
            />
            <label
                className={`btn btn-outline-primary ${disabled ? "disabled opacity-50" : ""
                    }`}
                htmlFor="selected_only"
            >
                Selected Only
            </label>

            <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="select_all"
                autoComplete="off"
                checked={selected === "select_all"}
                onChange={() => onChange("select_all")}
            />
            <label className="btn btn-outline-primary" htmlFor="select_all">
                All
            </label>
        </div>
    );
}
