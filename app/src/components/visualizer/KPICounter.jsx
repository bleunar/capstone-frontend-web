// Component parameters
//      title                 ---> name of the data
//      count                 ---> data value
//      unit_type             ---> data measurement
//      type                  ---> info, danger, secondary (follow the usage of bootstrap's color scheme)

import { useEffect, useState } from "react"
import { useSystemAPI } from "../../hooks/useSystemAPI"


export function KPICounter({ title, unit_type = "", type = "primary", source = "" }) {
    const { API_GET } = useSystemAPI();
    const [value, setValue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    async function HandleFetch() {
        if (!source) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await API_GET(source);

            let result = null;

            if (response == null) {
                result = 0;
            } else if (typeof response === "object") {
                result =
                    response.data ??
                    response.value ??
                    response.count ??
                    response.total ??
                    0;
            } else {
                result = response;
            }

            // normalization
            if (typeof result === "object" || result === undefined || result === null) {
                result = 0;
            }
            setValue(result);
        } catch (err) {
            console.error("KPICounter fetch error:", err);
            setError("Failed to load");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        HandleFetch();
    }, [source]);

    return (
        <div className="col p-2">
            <div
                className={`p-1 d-flex justify-content-center text-light text-start flex-column h-100 bg-body-tertiary rounded border text-body ${type}`}
            >
                <div className="d-flex align-items-baseline justify-content-center">
                    <div className="h2 mb-0 fw-bold">
                        {isLoading
                            ? (
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            )
                            : error
                            ? "⚠️"
                            : typeof value === "number" || typeof value === "string"
                            ? value
                            : "0"}
                    </div>
                    {unit_type && (
                        <div className="ps-1" style={{ fontSize: "0.75rem" }}>
                            {unit_type}
                        </div>
                    )}
                </div>
                <div className="p text-center">{title}</div>
            </div>
        </div>
    );
}