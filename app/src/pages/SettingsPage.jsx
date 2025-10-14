import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { antiRacismCheck } from "../services/helper";

export default function SettingsPage() {
    const { settings, editAccountSettings } = useAuth()
    const [currentSettings, setCurrentSettings] = useState()
    // submit updated settings
    const handleSubmit = async () => {
        try {
            await editAccountSettings(currentSettings)
            notifyInform("Updated account settings")
        } catch (error) {
            notifyError("Failed to Update Account Settings")
        }
    }
    const { notifyInform, notifyError } = useNotifications()
    const [allowSubmit, setAllowSubmit] = useState(false);


    // reset settings modifications
    const handleReset = () => {
        setCurrentSettings(settings)
    }

    // initialize settings
    useEffect(() => {
        setCurrentSettings(settings)
    }, [settings])


    // check if old settings is the same with updated settings
    useEffect(() => {
        if (settings && currentSettings) {
            const settings_matched = antiRacismCheck(currentSettings, settings);

            if (settings_matched) {
                setAllowSubmit(false)
            } else {
                setAllowSubmit(true)
            }
        }

    }, [currentSettings])
    return (
        <>
            <div className="mb-3 rounded">
                <div className="h2 fw-bold w-100 text-start">Settings</div>
                <div className="d-flex flex-column">
                    <div className="h4 mb-3">General</div>

                    <div className="form-check form-switch mb-3 mx-4">
                        <input className="form-check-input" type="checkbox" id="darkModeSwitch" checked={currentSettings?.enable_dark_mode == 1} onChange={() => setCurrentSettings({ ...currentSettings, enable_dark_mode: currentSettings.enable_dark_mode == 0 ? 1 : 0 })} />
                        <label className="form-check-label" htmlFor="darkModeSwitch">
                            Dark Mode
                        </label>
                    </div>

                    <hr className="my-4" />

                    <div className="h4 mb-3">Notification</div>

                    <div className="mb-4 mx-4">
                        <div className="p">Location</div>
                        <div className="input-group">
                            <select className="form-select" id="notificationAxisY" value={currentSettings?.notification_position} onChange={(e) => setCurrentSettings({ ...currentSettings, notification_position: e.target.value })}>
                                <option value="top-0 start-50 translate-middle-x">Top Center</option>
                                <option value="bottom-0 start-50 translate-middle-x">Bottom Center</option>
                                <option value="bottom-0 end-0">Bottom Left</option>
                            </select>
                        </div>
                    </div>



                    <div className="mb-4 mx-4">
                        <div className="p">Timeout Duration</div>
                        <div className="input-group">
                            <select className="form-select" id="notificationTimeout" value={currentSettings?.notification_duration} onChange={(e) => setCurrentSettings({ ...currentSettings, notification_duration: e.target.value })}>
                                <option value="2">Fast</option>
                                <option value="4">Medium</option>
                                <option value="6">Slow</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center gap-2">
                <div className="btn btn-secondary" onClick={() => handleReset()}>Reset</div>
                <button className="btn btn-primary" disabled={!allowSubmit} onClick={() => handleSubmit()}>Update</button>
            </div>
        </>
    )
}