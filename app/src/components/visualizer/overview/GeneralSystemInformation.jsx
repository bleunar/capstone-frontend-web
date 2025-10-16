import { useState, useEffect } from "react"
import VisualCounter from "../VisualCounter.jsx"
import { apiService } from "../../../services/apiService.js"
import { useErrorHandler } from "../../../hooks/useErrorHandler.jsx"

export default function GeneralSystemInfromation() {
    const [equipmentData, setEquipmentData] = useState([])
    const [loading, setLoading] = useState(true)
    const { handleError } = useErrorHandler()

    // Fetch equipment metrics from API
    useEffect(() => {
        const fetchEquipmentMetrics = async () => {
            setLoading(true)
            try {
                const result = await apiService.getEquipmentDashboardMetrics()
                if (result.success && result.data) {
                    // Transform API data to match component structure
                    const transformedData = [
                        {
                            count: result.data.operational_count || 0,
                            title: "Operational",
                            description: "Equipment working properly",
                            type: "primary"
                        },
                        {
                            count: result.data.maintenance_count || 0,
                            title: "Maintenance",
                            description: "Under maintenance",
                            type: "info"
                        },
                        {
                            count: result.data.issues_count || 0,
                            title: "Issues",
                            description: "Requires attention",
                            type: "danger"
                        }
                    ]
                    setEquipmentData(transformedData)
                } else {
                    // Fallback to equipment status if dashboard metrics not available
                    const statusResult = await apiService.getEquipmentStatus({ chart_type: 'pie' })
                    if (statusResult.success && statusResult.data) {
                        const statusData = statusResult.data
                        const transformedData = statusData.map(item => ({
                            count: item.count || 0,
                            title: item.label || 'Unknown',
                            type: item.label?.toLowerCase() === 'active' ? 'success' :
                                item.label?.toLowerCase() === 'maintenance' ? 'info' : 'danger'
                        }))
                        setEquipmentData(transformedData)
                    }
                }
            } catch (error) {
                handleError(error, false)
                // Fallback data in case of error
                setEquipmentData([
                    { count: 0, title: "Operational", type: "primary" },
                    { count: 0, title: "Maintenance", type: "info" },
                    { count: 0, title: "Issues", type: "danger" }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchEquipmentMetrics()
    }, [handleError])

    const parsedData = equipmentData.map(item => ({
        ...item,
        count: Number(item.count),
    }));

    const total = parsedData.reduce((sum, item) => sum + item.count, 0);

    if (loading) {
        return (
            <p class="placeholder-glow">
                <span class="placeholder w-100 shadow rounded" style={{height: '4vh'}}></span>
            </p>
        )
    }

    return (
        <>
            <div className="progress-stacked shadow mb-3" style={{ height: "4vh" }} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Equipment Status Overview">
                {parsedData.map((item, index) => (
                    <div
                        key={index}
                        className="progress h-100"
                        role="progressbar"
                        aria-label={`${item.title} segment`}
                        aria-valuenow={item.count}
                        aria-valuemin="0"
                        aria-valuemax={total}
                        style={{ width: total > 0 ? `${(item.count / total) * 100}%` : '33.33%' }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title={`${item.title}: ${item.count} (${total > 0 ? Math.round((item.count / total) * 100) : 0}%)`}
                    >
                        <div className={`progress-bar bg-${item.type}`}>
                            <i className={`bi m-0 ${item.type === 'success' ? 'bi-check-square-fill' :
                                    item.type === 'info' ? 'bi-tools' :
                                        'bi-exclamation-triangle-fill'
                                }`}></i>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}