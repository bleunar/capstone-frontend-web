import LabManagement from "../forms_manager/Manage_Laboratory";
import OverviewGeneral from "../overview/Overview_General";
import GeneralSystemInfromation from "../dashboard_sections/GeneralSystemInformation";
import ManagerController from "../general/ManagerController";

export default function DashboardContentRoot() {

    return (
        <div className="container px-0">

            {/* ========== TAB BUTTONS ========== */}
            <ul className="nav nav-tabs" id="myTab" role="tablist">

                {/* Home (Active) */}
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" data-bs-toggle="tab" type="button" role="tab"
                        aria-selected="true"
                        data-bs-target="#home-tab-pane"
                        aria-controls="home-tab-pane"
                        id="home-tab"
                    >
                        Home
                    </button>
                </li>

                {/* Computer Lab */}
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" type="button" role="tab"
                        aria-selected="false"
                        data-bs-target="#comlab-tab-pane"
                        aria-controls="comlab-tab-pane"
                        id="comlab-tab"
                    >
                        Computer Laboratory
                    </button>
                </li>

                {/* Manage */}
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" type="button" role="tab"
                        aria-selected="false"
                        data-bs-target="#profile-tab-pane"
                        aria-controls="profile-tab-pane"
                        id="profile-tab"
                    >
                        Manage
                    </button>
                </li>
            </ul>

            {/* TAB CONTENTS */}
            <div className="tab-content" id="myTabContent">

                {/* Home (Active) */}
                <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                    <div className="py-5">
                        {
                            <GeneralSystemInfromation />
                        }
                        {
                            <OverviewGeneral />
                        }
                    </div>
                </div>

                {/* Computer Lab */}
                <div className="tab-pane fade" id="comlab-tab-pane" role="tabpanel" aria-labelledby="comlab-tab" tabIndex="0">
                    <div className="p-3">
                        {
                            <LabManagement />
                        }
                    </div>
                </div>

                {/* Manage */}
                <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                    <div className="p-3">
                        {
                            <ManagerController />
                        }
                    </div>
                </div>


            </div>

        </div>
    )
}