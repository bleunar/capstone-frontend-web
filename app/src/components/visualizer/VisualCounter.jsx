// Component parameters
//      title                 ---> name of the data
//      count                 ---> data value
//      unit_type             ---> data measurement
//      type                  ---> info, danger, secondary (follow the usage of bootstrap's color scheme)

export default function VisualCounter({ title, count, unit_type='', type = "primary" }) {
    return (
        <div className="col p-1">
            <div className={`p-1 rounded border shadow d-flex justify-content-center text-light text-start flex-column h-100 bg-${type}`}>
                <div className="p text-center">{title}</div>
                <div className="d-flex align-items-baseline justify-content-center">
                    <div className="h4 mb-0 fw-bold">{count}</div>
                    <div className="p ps-1" style={{ fontSize: '0.75rem' }}>{unit_type ? unit_type : ""}</div>
                </div>
            </div>
        </div>
    )
}