export function ComponentIcons({ type, status="light" }) {
    const color = hasProduct ? "text-blue-600" : "text-red-600";

    switch (type) {
        case "system_unit":
            return <i className={`pe-3 fs-5 bi bi-pc text-${status}`}></i>;
        case "monitor":
            return <i className={`pe-3 fs-5 bi bi-display text-${status}`}></i>;
        case "keyboard":
            return <i className={`pe-3 fs-5 bi bi-keyboard text-${status}`}></i>;
        case "mouse":
            return <i className={`pe-3 fs-5 bi bi-mouse text-${status}`}></i>;
        case "avr":
            return <i className={`pe-3 fs-5 bi bi-power text-${status}`}></i>;
        case "headset":
            return <i className={`pe-3 fs-5 bi bi-headset text-${status}`}></i>;
        case "camera":
            return <i className={`pe-3 fs-5 bi bi-camera text-${status}`}></i>;

        default:
            return <AlertCircle className={`w-6 h-6 ${color}`} />;
    }
}