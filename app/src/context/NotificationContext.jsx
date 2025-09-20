import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import useAudio from "../hooks/useAudio";

const NotificationContext = createContext();
let counter = 0;

function create_id () {
    counter+=1
    const new_id =  `${Date.now()}${counter}`
    return new_id
}

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
    const { settings, authenticated } = useAuth()

    // notification config from user's settings
    const [notificationPostition, setNotificationPosition] = useState()
    const [notificationTimeout, setNotificationTimeout] = useState(1000)
    const timeoutRef = useRef(notificationTimeout);
    const [notificationMessages, setNotificationMessages] = useState([]); // notification data
    const {play} = useAudio()


    // keep the timeout reference updated
    useEffect(() => {
        timeoutRef.current = notificationTimeout;
    }, [notificationTimeout]);

    
    // called when sending notifiaction to confirm actions
    const notifyConfirm = useCallback((text, description = "") => {
        const id = create_id();

        setNotificationMessages(prev => [...prev, { id, type: 'success', text, description, icon: "bi-check-circle" }]);

        // play success sound
        play("success");
        setTimeout(() => {
            setNotificationMessages(prev => prev.filter(item => item.id !== id));
        }, timeoutRef.current);
    }, []);


    // called when sending notifiaction to inform users of errors
    const notifyError = useCallback((text, description = "") => {
        const id = create_id();

        setNotificationMessages(prev => [...prev, { id, type: 'danger', text, description, icon: "bi-exclamation-circle" }]);

        // play error sound
        play("error");
        setTimeout(() => {
            setNotificationMessages(prev => prev.filter(item => item.id !== id));
        }, timeoutRef.current);
    }, []);


    // called when sending notifiaction to inform users of errors
    const notifyInform = useCallback((text, description = "") => {
        const id = create_id();

        setNotificationMessages(prev => [...prev, { id, type: 'info', text, description, icon: "bi-info-circle" }]);

        // play inform sound
        play("inform");
        setTimeout(() => {
            setNotificationMessages(prev => prev.filter(item => item.id !== id));
        }, timeoutRef.current);
    }, []);


    // handle notification configuration from user's settings
    useEffect(() => {
        setNotificationPosition(settings?.notification_position ? settings?.notification_position : 'top-0 start-50 translate-middle-x')

        setNotificationTimeout(1000 * (settings?.notification_duration ? settings.notification_duration : 3))
    }, [settings])


    return (
        <NotificationContext.Provider value={{ notifyConfirm, notifyError, notifyInform }}>
            {children}



            <div className={`toast-container position-fixed ${notificationPostition} p-3`} style={{ zIndex: 2000 }}>
            {
                authenticated && (
                    <div className="" style={{height: '6vh'}}></div>
                )
            }

                {notificationMessages.map(item => (
                    <div key={item.id} className={`toast align-items-end shadow rounded-pill show mb-2 bg-body`}>
                        <div className="d-flex">
                            <div className="toast-body p-1 flex-fill">
                                <div className="d-flex align-items-center justify-content-between gap-2 px-2">
                                    <div className="text-start ms-2 flex-fill">
                                        <div className="p mb-0 text-capitalize">{item.text}</div>
                                        <div className="text-start text-muted text-capitalize" style={{fontSize:"0.55rem"}}>{item.description ? item.description : ""}</div>
                                    </div>

                                    <i className={`bi ${item.icon} fs-4 text-${item.type}`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}
