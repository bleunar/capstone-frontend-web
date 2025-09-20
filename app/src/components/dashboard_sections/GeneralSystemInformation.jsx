import VisualCounter from "../visualizer/VisualCounter"

// TEMP DATA for DEMONSTRATION
const test_data = [
    {
        count: "53",
        title: "Operational",
        type: "success"
    },
    {
        count: "5",
        title: "Maintenance",
        description: "Available Now",
        type: "info"
    },
    {
        count: "1",
        title: "Issues",
        type: "danger"
    },
]

export default function GeneralSystemInfromation() {
    const parsedData = test_data.map(item => ({
        ...item,
        count: Number(item.count),
    }));

    const total = parsedData.reduce((sum, item) => sum + item.count, 0);

    return (
        <>
            <div class="progress-stacked mb-3 shadow" style={{ height: "3vh" }} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Tooltip on bottom">
                <div class="progress h-100" role="progressbar" aria-label="Segment one" aria-valuenow={test_data[0].count} aria-valuemin="0" aria-valuemax={total} style={{ width:  `${(test_data[0].count / total) * 100}% ` }} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Operational Ratio">
                    <div class="progress-bar bg-success">
                        <i class="bi m-0 bi-check-square-fill"></i>
                    </div>
                </div>
                <div class="progress h-100" role="progressbar" aria-label="Segment two" aria-valuenow={test_data[1].count} aria-valuemin="0" aria-valuemax={total} style={{ width:  `${(test_data[1].count / total) * 100}% ` }} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Maintenance Ratio">
                    <div class="progress-bar bg-primary">
                        <i class="bi m-0 bi-tools"></i>
                    </div>
                </div>
                <div class="progress h-100" role="progressbar" aria-label="Segment three" aria-valuenow={test_data[2].count} aria-valuemin="0" aria-valuemax={total} style={{ width: `${(test_data[2].count / total) * 100}% ` }} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Issue Ratio">
                    <div class="progress-bar bg-danger">
                        <i class="bi m-0 bi-exclamation-triangle-fill"></i>
                    </div>
                </div>
            </div>



            <div className="row px-2 mb-3 row-cols-1 row-cols-sm-3">
                {
                    test_data.map((item, key) =>
                        <VisualCounter
                            key={key}
                            count={item.count}
                            title={item.title}
                            type={item.type}
                        />
                    )
                }
            </div>
        </>
    )
}