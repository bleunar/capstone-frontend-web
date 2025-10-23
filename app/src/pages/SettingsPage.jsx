import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { antiRacismCheck } from "../services/helper";
import LoadingPage from "../components/general/LoadingPage";

export default function SettingsPage() {
    const [selectedTab, setSelectedTab] = useState(1);

    function HandleTabChange(tab) {
        setSelectedTab(tab)
    }

    return (
        <>
            <div className="h2 text-start fw-bold ps-3 mb-3 d-none d-xl-inline-block">Settings</div>
            <div className="d-flex flex-column flex-xl-row">
                <div className="h2 text-center fw-bold ps-3 mb-3 d-xl-none d-block">Settings</div>
                <div className="nav nav-tabs d-flex d-xl-none my-3" id="v-pills-tab" role="tablist">
                    <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" onClick={() => HandleTabChange(1)}>
                        General
                    </button>
                    <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" onClick={() => HandleTabChange(2)}>
                        Profile
                    </button>
                    <button className="nav-link" id="v-pills-credential-tab" data-bs-toggle="pill" data-bs-target="#v-pills-credential" type="button" role="tab" onClick={() => HandleTabChange(1)}>
                        Credentials
                    </button>
                </div>

                <div className="nav nav-pills flex-row flex-xl-column d-none d-xl-flex" id="v-pills-tab" role="tablist" style={{ width: '200px' }}>
                    <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" onClick={() => HandleTabChange(1)}>
                        General
                    </button>
                    <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" onClick={() => HandleTabChange(2)}>
                        Profile
                    </button>
                    <button className="nav-link" id="v-pills-credential-tab" data-bs-toggle="pill" data-bs-target="#v-pills-credential" type="button" role="tab" onClick={() => HandleTabChange(3)}>
                        Credentials
                    </button>
                </div>


                <div className="tab-content flex-fill p-0 pt-xl-0" id="v-pills-tabContent">
                    <div className="tab-pane fade shadow-lg rounded show p-4 ms-0 ms-xl-3 bg-body-tertiary active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        <GeneralSettings tab={selectedTab} />
                    </div>
                    <div className="tab-pane fade shadow-lg rounded p-4 ms-0 ms-xl-3 bg-body-tertiary " id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                        <ProfileSettings tab={selectedTab} />
                    </div>
                    <div className="tab-pane fade shadow-lg rounded p-4 ms-0 ms-xl-3 bg-body-tertiary " id="v-pills-credential" role="tabpanel" aria-labelledby="v-pills-credential-tab">
                        <CredentialSettings tab={selectedTab} />
                    </div>
                </div>
            </div>
        </>
    )
}

function GeneralSettings({ tab }) {
    const TAB_NUMBER = 1

    const { settings, editAccountSettings, fetchAccountSettings, authFetching } = useAuth()
    const [currentSettings, setCurrentSettings] = useState()
    const { notifyInform, notifyError } = useNotifications()
    const [allowSubmit, setAllowSubmit] = useState(false);


    // submit updated settings
    async function HandleSubmit() {
        try {
            await editAccountSettings(currentSettings)
            notifyInform("Updated Settings")
        } catch (error) {
            notifyError("Failed to update Account Settings")
        }
    }


    // reset settings modifications
    function HandleRefresh() {
        fetchAccountSettings();
    }


    // check if the tab is shown
    useEffect(() => {
        if (tab === TAB_NUMBER && settings) {
            setCurrentSettings(settings)
        }
    }, [tab, settings])



    // check if old settings is the same with updated settings
    useEffect(() => {
        if (settings && currentSettings) {
            const data_matched = antiRacismCheck(currentSettings, settings);

            if (data_matched) {
                setAllowSubmit(false)
            } else {
                setAllowSubmit(true)
            }
        }
    }, [currentSettings])

    if (authFetching) return <LoadingPage />
    return (
        <>
            <div className="mb-3 rounded">
                <div className="d-flex flex-column">
                    <div className="mb-4">
                        <div className="h4">General</div>
                        <div className="form-check form-switch mb-3 mx-4">
                            <input className="form-check-input" type="checkbox" id="darkModeSwitch" checked={currentSettings?.enable_dark_mode == 1} onChange={() => setCurrentSettings({ ...currentSettings, enable_dark_mode: currentSettings.enable_dark_mode == 0 ? 1 : 0 })} />
                            <label className="form-check-label" htmlhtmlFor="darkModeSwitch">
                                Dark Mode
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="h4">Notification</div>

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
            </div>

            <div className="d-flex justify-content-center gap-2">
                <div className="btn btn-outline-secondary" onClick={() => HandleRefresh()}>Refresh</div>
                <button className="btn btn-primary" disabled={!allowSubmit} onClick={() => HandleSubmit()}>Update</button>
            </div>
        </>
    )
}




function ProfileSettings({ tab }) {
    const TAB_NUMBER = 2

    const { profile, editAccountProfile, fetchAccountProfile, authFetching } = useAuth()
    const [currentSettings, setCurrentSettings] = useState()
    const { notifyInform, notifyError } = useNotifications()
    const [allowSubmit, setAllowSubmit] = useState(false);


    // submit updated settings
    async function HandleSubmit() {
        try {
            await editAccountProfile(currentSettings)
            notifyInform("Updated Settings")
        } catch (error) {
            notifyError("Failed to update Account Settings")
        }
    }


    // reset settings modifications
    function HandleRefresh() {
        setCurrentSettings(profile)
    }


    // check if the tab is shown
    useEffect(() => {
        if (tab === TAB_NUMBER && profile) {
            setCurrentSettings(profile)
        }
    }, [tab, profile])


    useEffect(() => {
        HandleRefresh()
    }, [])


    // check if old settings is the same with updated settings
    useEffect(() => {
        if (profile && currentSettings) {
            const data_matched = antiRacismCheck(currentSettings, profile);

            if (data_matched) {
                setAllowSubmit(false)
            } else {
                setAllowSubmit(true)
            }
        }
    }, [currentSettings])


    if (authFetching) return <LoadingPage />
    return (
        <>
            <div className="mb-3 rounded">
                <div className="d-flex flex-column">
                    <div className="mb-4">
                        <div className="h4">Profile</div>
                        <div className="container-fluid">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3">
                                <div className="col p-1">
                                    <div className="mb-3">
                                        <label htmlFor="first_name" className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="first_name" />
                                    </div>
                                </div>
                                <div className="col p-1">
                                    <div className="mb-3">
                                        <label htmlFor="middle_name" className="form-label">Middle Name</label>
                                        <input type="text" className="form-control" id="middle_name" />
                                    </div>
                                </div>
                                <div className="col p-1">
                                    <div className="mb-3">
                                        <label htmlFor="last_name" className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="last_name" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="container-fluid">
                            <div className="row row-cols-1 row-cols-md-2">
                                <div className="col p-1">
                                    <div className="mb-3">
                                        <label htmlFor="gender" className="form-label">Gender</label>
                                        <select className="form-select" aria-label="Default select example" id="gender">
                                            <option selected>Select Gender</option>
                                            <option value="1">Female</option>
                                            <option value="2">Male</option>
                                            <option value="3">Others</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col p-1">
                                    <div className="mb-3">
                                        <label htmlFor="birth_date" className="form-label">Birth Date</label>
                                        <input type="date" className="form-control" id="birth_date" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center gap-2">
                <div className="btn btn-outline-secondary" onClick={() => HandleRefresh()}>Refresh</div>
                <button className="btn btn-primary" disabled={!allowSubmit || true} onClick={() => HandleSubmit()}>Update</button>
            </div>
        </>
    )
}




function CredentialSettings({ tab }) {
    const TAB_NUMBER = 3

    const { credential, editAccountCredential, fetchAccountCredential, authFetching } = useAuth()
    const [currentSettings, setCurrentSettings] = useState()
    const { notifyInform, notifyError } = useNotifications()
    const [allowSubmit, setAllowSubmit] = useState(false);


    // submit updated settings
    async function HandleSubmit() {
        try {
            await editAccountCredential(currentSettings)
            notifyInform("Updated Settings")
        } catch (error) {
            notifyError("Failed to update Account Settings")
        }
    }


    // reset settings modifications
    function HandleRefresh() {
        setCurrentSettings(settings)
    }


    // check if the tab is shown
    useEffect(() => {
        if (tab === TAB_NUMBER) {
            fetchAccountCredential();
        }
    }, [tab])


    // check if old settings is the same with updated settings
    useEffect(() => {
        if (credential && currentSettings) {
            const data_matched = antiRacismCheck(currentSettings, credential);

            if (data_matched) {
                setAllowSubmit(false)
            } else {
                setAllowSubmit(true)
            }
        }
    }, [currentSettings])

    if (authFetching) return <LoadingPage />
    return (
        <>
            <div className="rounded">
                <div className="d-flex flex-column">
                    <div className="">
                        <div className="h4">Password</div>
                        <div className="container-fluid">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3">
                                <div className="col p-1">
                                    <div className="mb-3">
                                        <label htmlFor="old_password" className="form-label">Old Password</label>
                                        <input type="password" className="form-control" id="old_password" />
                                    </div>
                                </div>
                                <div className="col p-1">
                                    <div className="mb-3">
                                        <label htmlFor="new_password" className="form-label">Updated Password</label>
                                        <input type="password" className="form-control" id="new_passwod" />
                                    </div>
                                </div>
                                <div className="col p-1">
                                    <div className="mb-3">
                                        <label htmlFor="confirm_new_password" className="form-label">Confirm Updated Password</label>
                                        <input type="password" className="form-control" id="confirm_new_password" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="btn btn-primary" disabled>Update Password</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}