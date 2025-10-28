
import HeaderSection from "../sections/HeaderSection";
import { BarVisualizer, LineVisualizer, PieVisualizer } from "../visualizer/Visualizers"
import { KPICounter } from "../visualizer/KPICounter";
import { Link } from "react-router-dom";
import ComponentProtector from "../general/ComponentProtector";
import SimplyTable from "../visualizer/SimplyTable";

export default function DashboardRoot() {


    return (
        <>
            <HeaderSection />

            <div className="py-3">
                <div className="container-fluid mb-3">
                    <div className="row row-cols-2  row-cols-md-4">
                        <KPICounter title="Total Accounts" type="primary" source="/accounts/analytics/total" />
                        <KPICounter title="Total Locations" type="primary" source="/locations/analytics/total" />
                        <KPICounter title="Total Equipments" type="primary" source="/equipment_sets/analytics/total" />
                        <KPICounter title="Account Activities" type="primary" source="/accounts/analytics/total_activity" />
                    </div>
                </div>

                <div className="container-fluid mb-3">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3">


                        <BarVisualizer title="Equipment per Location" source="/analytics/bar/equipment/location" />
                        <PieVisualizer title="Equipment Issue Ratio" source="/analytics/pie/equipment/issues-ratio" />
                        <LineVisualizer title="Equipment Activity" source="/analytics/line/equipment-activities/week" />
                    </div>
                </div>

                <div className="container-fluid mb-3">
                    <div className="row row-cols-md-2">
                    </div>
                </div>
            </div>
        </>
    );
}
