import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


// parameter usage for each visualizer:
//      title (optional)    : title of the visualizer, does not show title if nothing is passed [OPTIONAL]
//      data (required)     : a formatted setup specific for each visualizer
//      options             : configuration of the visualizer, uses default if noting is passed [OPTIONAL]

export const BarVisualizer = ({ title, description = "", data, options }) => (
    <div className="h-100">
        <div className="p-3 rounded shadow border bg-body-tertiary h-100 d-flex flex-column">
            {title && <div className="p mb-0 fw-bold">{title}</div>}
            {description && <div className="text-muted mb-0" style={{fontSize:'0.75rem'}}>{description}</div>}
            <div className="flex-grow-1" style={{maxHeight:'350px'}}>
                <Bar data={data} options={{ maintainAspectRatio: false, ...options }} />
            </div>
        </div>
    </div>
);

export const PieVisualizer = ({ title, description = "",  data, options }) => (
    <div className="h-100">
        <div className="p-3 rounded shadow border bg-body-tertiary h-100 d-flex flex-column">
            {title && <div className="p mb-0 fw-bold">{title}</div>}
            {description && <div className="text-muted mb-0" style={{fontSize:'0.75rem'}}>{description}</div>}
            <div className="flex-grow-1" style={{maxHeight:'350px'}}>
                <Pie data={data} options={{ maintainAspectRatio: false, ...options }} />
            </div>
        </div>
    </div>
);

export const LineVisualizer = ({ title, description = "",  data, options }) => (
    <div className="h-100" >
        <div className="p-3 rounded shadow border bg-body-tertiary h-100 d-flex flex-column">
            {title && <div className="p mb-0 fw-bold">{title}</div>}
            {description && <div className="text-muted mb-0" style={{fontSize:'0.75rem'}}>{description}</div>}
            <div className="flex-grow-1" style={{maxHeight:'350px'}}>
                <Line data={data} options={{ maintainAspectRatio: false, ...options }} />
            </div>
        </div>
    </div>
);




// SAMPLE FORMAT FOR THE DATA

    // const barData = {
    // labels: ["Jan", "Feb", "Mar", "Apr"],
    // datasets: [
    //     {
    //     label: "Sales",
    //     data: [120, 90, 150, 200],
    //     backgroundColor: "rgba(75, 192, 192, 0.5)"
    //     }
    // ]
    // };


    // const pieData = {
    // labels: ["Red", "Blue", "Yellow"],
    // datasets: [
    //     {
    //     label: "Votes",
    //     data: [12, 19, 3],
    //     backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    //     }
    // ]
    // };


    // const lineData = {
    // labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    // datasets: [
    //     {
    //     label: "Visitors",
    //     data: [30, 50, 40, 60, 70],
    //     borderColor: "rgba(75,192,192,1)",
    //     fill: false,
    //     tension: 0.3
    //     }
    // ]
    // };
