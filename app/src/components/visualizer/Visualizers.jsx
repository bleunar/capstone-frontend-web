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
import { useNotifications } from "../../context/NotificationContext";
import { useEffect, useState } from "react";
import { useSystemAPI } from "../../hooks/useSystemAPI";

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


const baseBarData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
        {
            label: "Sales",
            data: [120, 90, 150, 200],
            backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
    ],
};

const basePieData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
        {
            label: "Votes",
            data: [12, 19, 3],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
    ],
};

const baseLineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
        {
            label: "Visitors",
            data: [30, 50, 40, 60, 70],
            borderColor: "rgba(75,192,192,1)",
            fill: false,
            tension: 0.3,
        },
    ],
};

export function BarVisualizer({ title = "", options = {}, source }) {
    const { API_GET } = useSystemAPI();
    const [data, setData] = useState(baseBarData);
    const [loading, setLoading] = useState(true);

    async function HandleFetch() {
        setLoading(true);
        try {
            const response = await API_GET(source)
            const result = response?.data || response

            if (result?.labels && result?.datasets) {
                setData(result);
            } else {
                setData(baseBarData);
            }
        } catch (error) {
            console.error(error);
            setData(baseBarData);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (source) HandleFetch();
    }, [source]);

    if (loading) return <div className="p">Loading...</div>;

    return (
        <div className="col p-2">
            <div className="h-100">
                <div className="rounded shadow border bg-body-tertiary h-100 d-flex flex-column overflow-hidden">
                    {title && (
                        <div className="p-2 px-3 border-bottom">
                            <div className="p mb-0 m-0">{title}</div>
                        </div>
                    )}
                    <div className="p-3">
                        <div className="flex-grow-1" style={{ maxHeight: "400px" }}>
                            <Bar data={data} options={{ maintainAspectRatio: false, ...options }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function PieVisualizer({ title = "", options = {}, source }) {
    const { API_GET } = useSystemAPI();
    const [data, setData] = useState(basePieData);
    const [loading, setLoading] = useState(true);

    async function HandleFetch() {
        setLoading(true);
        try {
            const response = await API_GET(source)
            const result = response?.data || response

            if (result?.labels && result?.datasets) {
                setData(result);
            } else {
                setData(basePieData);
            }
        } catch (error) {
            console.error(error);
            setData(basePieData);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (source) HandleFetch();
    }, [source]);

    if (loading) return <div className="p">Loading...</div>;

    return (
        <div className="col p-2">
            <div className="h-100">
                <div className="rounded shadow border bg-body-tertiary h-100 d-flex flex-column overflow-hidden">
                    {title && (
                        <div className="p-2 px-3 border-bottom">
                            <div className="p mb-0 m-0">{title}</div>
                        </div>
                    )}
                    <div className="p-3">
                        <div className="flex-grow-1" style={{ maxHeight: "400px" }}>
                            <Pie data={data} options={{ maintainAspectRatio: false, ...options }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function LineVisualizer({ title = "", options = {}, source }) {
    const { API_GET } = useSystemAPI();
    const [data, setData] = useState(baseLineData);
    const [loading, setLoading] = useState(true);

    async function HandleFetch() {
        setLoading(true);
        try {
            const response = await API_GET(source)
            const result = response?.data || response

            if (result?.labels && result?.datasets) {
                setData(result);
            } else {
                setData(baseLineData);
            }
        } catch (error) {
            console.error(error);
            setData(baseLineData);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (source) HandleFetch();
    }, [source]);

    if (loading) return <div className="p">Loading...</div>;

    return (
        <div className="col p-2">
            <div className="h-100">
                <div className="rounded shadow border bg-body-tertiary h-100 d-flex flex-column overflow-hidden">
                    {title && (
                        <div className="p-2 px-3 border-bottom">
                            <div className="p mb-0 m-0">{title}</div>
                        </div>
                    )}
                    <div className="p-3">
                        <div className="flex-grow-1" style={{ maxHeight: "400px" }}>
                            <Line data={data} options={{ maintainAspectRatio: false, ...options }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
