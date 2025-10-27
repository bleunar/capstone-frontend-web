import { useState, useEffect } from "react";
import VisualCounter from "../VisualCounter.jsx";
import { BarVisualizer, PieVisualizer, LineVisualizer } from "../Visualizers.jsx";
import { useDashboardAnalytics } from "../../../hooks/useDashboardAnalytics.jsx";

export default function DashboardHomeRoot() {
    const { loading, dashboardData } = useDashboardAnalytics();
    const [chartData, setChartData] = useState({
        barData: null,
        pieData: null,
        lineData: null
    });

    // Transform API data to chart format
    useEffect(() => {
        if (dashboardData.equipmentByLocation?.chart_data) {
            setChartData(prev => ({
                ...prev,
                barData: dashboardData.equipmentByLocation.chart_data
            }));
        }

        if (dashboardData.equipmentStatus?.chart_data) {
            setChartData(prev => ({
                ...prev,
                pieData: dashboardData.equipmentStatus.chart_data
            }));
        }

        if (dashboardData.accountCounts?.chart_data) {
            setChartData(prev => ({
                ...prev,
                lineData: dashboardData.accountCounts.chart_data
            }));
        }
    }, [dashboardData]);

    // Fallback data for when API data is not available
    const fallbackBarData = {
        labels: ["Lab 1", "Lab 2", "Lab 3", "Lab 4"],
        datasets: [
            {
                label: "Equipment Sets",
                data: [12, 8, 15, 10],
                backgroundColor: "rgba(54, 162, 235, 0.75)"
            }
        ]
    };

    const fallbackPieData = {
        labels: ["Operational", "Issues", "Maintenance"],
        datasets: [
            {
                label: "Equipment Status",
                data: [1, 3, 21],
                backgroundColor: ["#28a745", "#dc3545", "#ffc107"]
            },
        ]
    };

    const fallbackLineData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Account Activity",
                data: [0, 0, 0, 0, 0, 0],
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                tension: 0.1
            }
        ]
    };

    // Get summary metrics from dashboard data
    const getSummaryMetrics = () => {
        if (dashboardData.equipmentMetrics) {
            return [
                {
                    count: dashboardData.equipmentMetrics.total_equipment || 0,
                    title: "Total Equipment",
                    description: "Equipment sets managed",
                    type: "secondary"
                },
                {
                    count: dashboardData.equipmentMetrics.issues_count || 0,
                    title: "Active Issues",
                    description: "Requiring attention",
                    type: "danger"
                },
                {
                    count: dashboardData.equipmentMetrics.locations_count || 0,
                    title: "Locations",
                    description: "Laboratory locations",
                    type: "info"
                }
            ];
        }

        return [
            { count: 76, title: "Total Equipment", description: "Loading...", type: "secondary" },
            { count: 15, title: "Active Issues", description: "Loading...", type: "secondary" },
            { count: 23, title: "Locations", description: "Loading...", type: "secondary" },
            { count: 53, title: "Locations", description: "Loading...", type: "secondary" }
        ];
    };

    if (loading) {
        return (
            <div className="row px-2 mb-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 placeholder-glow">
                <div className="col p-1" style={{height: '8vh'}}>
                    <span class="placeholder rounded h-100"></span>
                </div>
            </div>
        );
    }

    const summaryMetrics = getSummaryMetrics();

    return (
        <>
            {/* Summary Metrics */}
            <div className="row px-2 mb-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4">
                {summaryMetrics.map((item, key) => (
                    <VisualCounter
                        key={key}
                        count={item.count}
                        title={item.title}
                        description={item.description}
                        type={item.type}
                    />
                ))}
            </div>

            {/* Analytics Charts */}
           <div className="container-fluid">
             <div className="mb-4 row row-cols-1 row-cols-lg-3">
                <div className="col p-2">
                    <LineVisualizer
                        title="Account Activity"
                        data={chartData.lineData || fallbackLineData}
                    />
                </div>
                <div className="col p-2">
                    <BarVisualizer
                        title="Equipment by Location"
                        data={chartData.barData || fallbackBarData}
                    />
                </div>
                <div className="col p-2">
                    <PieVisualizer
                        title="Equipment Status"
                        data={chartData.pieData || fallbackPieData}
                    />
                </div>
            </div>
           </div>

            <div className="container-fluid">
                <div className="row row-cols-3">
                    <div className="col"></div>
                </div>
            </div>

        </>
    );
};
