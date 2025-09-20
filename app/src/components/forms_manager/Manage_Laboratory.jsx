import { useEffect, useState } from "react";
import Item_EquipmentSet from "../forms/Forms_EquipmentSet";
import { useSystemAPI } from "../../hooks/useSystemAPI";

export default function LabManagement() {
    const { API_GET } = useSystemAPI();
    const [locations, setLocations] = useState([]);

    const fetchLocations = async () => {
        try {
            const result = await API_GET("/locations");
            setLocations(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    return <LocationTabs locations={locations} />;
}

function LocationTabs({ locations }) {
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        if (locations && locations.length > 0 && !activeTab) {
            setActiveTab(locations[0].id);
        }
    }, [locations, activeTab]);

    return (
        <>
            <div className="d-flex justify-content-between mb-3 flex-wrap-reverse">
                <ul className="nav nav-pills gap-2" id="myTab" role="tablist">
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
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-5">
                            {activeTab === item.id && (
                                <LabEquipments location_id={item.id} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function LabEquipments({ location_id }) {
    const [equipmentSets, setEquipmentSets] = useState([1, 2, 3, 4, 5]);
    const { API_GET } = useSystemAPI();

    const fetchEquipmentSets = async () => {
        try {
            const result = await API_GET(
                `/equipment_sets?location_id=${location_id}`
            );
            setEquipmentSets(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (location_id) {
            // fetchEquipmentSets();
        }
    }, [location_id]);

    return (
        <>
            {
                equipmentSets && equipmentSets.map((item, key) => (
                    <Item_EquipmentSet key={item} target_id={item} />
                ))
            }
        </>
    );
}
