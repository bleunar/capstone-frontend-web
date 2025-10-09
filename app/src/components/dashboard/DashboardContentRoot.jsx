import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LabManagement from "../forms_manager/Manage_Laboratory";
import DashboardHomeRoot from "../visualizer/overview/DashboardRoot";
import GeneralSystemInfromation from "../visualizer/overview/GeneralSystemInformation";
import ManagerController from "../general/ManagerController";
import HeaderSection from "../dashboard_sections/HeaderSection";
import "../../assets/css/dashboard.tabs.css";

export default function DashboardContentRoot() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab") || "home";
    const [activeTab, setActiveTab] = useState(tabParam);

    // Sync tab state with URL query param
    useEffect(() => {
        setActiveTab(tabParam);
    }, [tabParam]);

    // When user clicks a tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    // Style logic for tabs
    const tabClass = (tab) =>
        `nav-link ${activeTab === tab ? "bg-body text-body border border-bottom-0" : ""}`;
    return (
        <>
            <HeaderSection />

            <div className="container-fluid m-0 px-0">
                {/* ========== TAB BUTTONS ========== */}
                <ul className="nav nav-tabs justify-content-center bg-primary border-0" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={tabClass("home")}
                            onClick={() => handleTabChange("home")}
                            type="button"
                            role="tab"
                        >
                            Home
                        </button>
                    </li>

                    <li className="nav-item" role="presentation">
                        <button
                            className={tabClass("comlab")}
                            onClick={() => handleTabChange("comlab")}
                            type="button"
                            role="tab"
                        >
                            Computer Laboratory
                        </button>
                    </li>

                    <li className="nav-item" role="presentation">
                        <button
                            className={tabClass("manage")}
                            onClick={() => handleTabChange("manage")}
                            type="button"
                            role="tab"
                        >
                            Manage
                        </button>
                    </li>
                </ul>

                {/* ========== TAB CONTENTS ========== */}
                <div className="container">
                    {activeTab === "home" && (
                        <div className="tab-pane fade show active py-5" id="home-tab-pane">
                            <GeneralSystemInfromation />
                            <DashboardHomeRoot />
                        </div>
                    )}

                    {activeTab === "comlab" && (
                        <div className="tab-pane fade show active p-3" id="comlab-tab-pane">
                            <h2>Manage Computer Laboratory</h2>
                            <LabManagement />
                        </div>
                    )}

                    {activeTab === "manage" && (
                        <div className="tab-pane fade show active p-3" id="manage-tab-pane">
                            <ManagerController />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
