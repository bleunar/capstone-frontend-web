import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useSystemAPI } from '../../hooks/useSystemAPI';
import FormModal from '../general/FormModal';

const TARGET_ENTITY = 'account_roles'
const TARGET_NAME = "Account Role"
const BASE_OBJECT = {
    name: "",
    access_level: "",
    created_at: "",
    updated_at: ""
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ADD COMPONENT
export const FormsAdd_AccountRoles = ({ mode = 'button', refetch_data }) => {
    const [showModal, setShowModal] = useState(false);

    if (mode === 'form') {
        return <FormsInputField submitMode="add" showModal={showModal} setShowModal={setShowModal} refetch_data={refetch_data} />;
    }

    return (
        <div>
            <button type="button" className="btn btn-primary d-flex gap-2" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-lg">
                </i><div className="d-none d-md-block">Add</div>
            </button>
            {showModal && (
                <FormModal onClose={() => setShowModal(false)}>
                    <FormsInputField submitMode="add" showModal={showModal} setShowModal={setShowModal} refetch_data={refetch_data} />
                </FormModal>
            )}
        </div>
    );
};

// VIEW COMPONENT
export const FormsView_AccountRoles = ({ target_id, mode = 'button', refetch_data }) => {
    const [showModal, setShowModal] = useState(false);

    if (mode == 'form') {
        return (
            <FormsView target_id={target_id} refetch_data={refetch_data} />
        );
    }

    return (
        <>
            <div>
                <button type="button" className="btn btn-outline-secondary border-0" onClick={() => setShowModal(true)}>
                    <i className="bi bi-three-dots"></i>
                </button>

                {showModal && (
                    <FormModal onClose={() => setShowModal(false)}>
                        <FormsView target_id={target_id} refetch_data={refetch_data} setShowModal={setShowModal} />
                    </FormModal>
                )}
            </div>
        </>
    );
};

// EDIT COMPONENT
export const FormsEdit_AccountRoles = ({ target_id, mode = 'button', refetch_data }) => {
    const [showModal, setShowModal] = useState(false);

    if (mode === 'form') {
        return <FormsInputField target_id={target_id} submitMode='edit' showModal setShowModal={setShowModal} refetch_data={refetch_data} />;
    }

    return (
        <div>
            <button type="button" className="btn btn-outline-secondary border-0" onClick={() => setShowModal(true)}>
                <i className="bi bi-pencil-square"></i>
            </button>

            {showModal && (
                <FormModal key={target_id} onClose={() => setShowModal(false)}>
                    <FormsInputField target_id={target_id} submitMode='edit' showModal setShowModal={setShowModal} refetch_data={refetch_data} />
                </FormModal>
            )}
        </div>
    );
};

// DELETE COMPONENT
export const FormsDelete_AccountRoles = ({ target_id, target_name = "", refetch_data, setParentShowModal }) => {
    const [showModal, setShowModal] = useState(false);
    const { notifyError, notifyConfirm } = useNotifications();
    const { API_DELETE } = useSystemAPI();

    const handleDelete = async () => {
        try {
            await API_DELETE(`/${TARGET_ENTITY}/${target_id}`);
            notifyConfirm(`${TARGET_NAME} deleted successfully`);
            setShowModal(false);
            setParentShowModal(false);
            refetch_data();
        } catch (error) {
            notifyError(`Failed to delete ${TARGET_NAME}`, error);
        }
    };

    const [timeLeft, setTimeLeft] = useState(5);
    const [isTimeUp, setIsTimeUp] = useState(false);

    useEffect(() => {
        if (showModal) {
            if (timeLeft === 0) {
                setIsTimeUp(true);
                return;
            }
            const intervalId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [showModal, timeLeft]);

    return (
        <div key={`del${target_id}_`}>
            <button type="button" className="btn btn-outline-danger" onClick={() => setShowModal(true)}>
                <i className="bi bi-trash"></i> Delete
            </button>

            {showModal && (
                <FormModal key={target_id} title="Confirm Deletion" onClose={() => setShowModal(false)} size='sm'>
                    <div className="text-center">
                        <p>Are you sure you want to permanently delete <strong>{target_name}</strong>?</p>
                        <p className="text-danger">This action cannot be undone.</p>
                        <div className="d-flex justify-content-center gap-3 mt-4">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Abort</button>
                            <button className="btn btn-danger" disabled={!isTimeUp} onClick={handleDelete}>{isTimeUp ? "I Confirm" : timeLeft}</button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// INPUT Field
const FormsInputField = ({ target_id, submitMode = "add", showModal, setShowModal, refetch_data }) => {
    const { notifyError, notifyConfirm } = useNotifications();
    const { API_PUT, API_GET, API_POST } = useSystemAPI();
    const [data, setData] = useState(BASE_OBJECT);
    const [extraData, setExtraData] = useState({})


    // hadnle input changes to data for all input fields
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
    };


    // ADD AND EDIT OPERATIONS
    const handleEdit = async () => {
        try {
            await API_PUT(`/${TARGET_ENTITY}/${target_id}`, data);
            notifyConfirm(`${TARGET_NAME} updated successfully`);
            refetch_data();
            setShowModal(false);
        } catch (error) {
            notifyError(`Failed to update ${TARGET_NAME}`, error);
        }
    };

    const handleAdd = async () => {
        try {
            await API_POST(`/${TARGET_ENTITY}/`, data)
            refetch_data();
            setShowModal(false);
            setData(BASE_OBJECT);
            notifyConfirm(`${TARGET_NAME} added successfuly`)
        } catch (error) {
            notifyError(`Failed to Create ${TARGET_NAME}`, error)
        }
    };

    // handling submissions
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitMode == "add") {
            handleAdd();
        } else {
            handleEdit();
        }
    };

    // handling fetch of target item
    const handleFetch = async () => {
        try {
            const result = await API_GET(`/${TARGET_ENTITY}?id=${target_id}`);
            setData(result.data[0]);
        } catch (error) {
            notifyError(`Failed to fetch ${TARGET_NAME} data`, error);
        }
    };

    // handling fetch of extra data
    const handleFetchExtraData = async () => {
        try {
            const result = await API_GET("/access_levels")
            setExtraData({ ...extraData, access_levels: result.data })
        } catch (error) {
            notifyError(`Failed to fetch extra data for ${TARGET_NAME}`, error)
        }
    }

    // fetch data on component load
    useEffect(() => {
        // fetch target item data if in edit mode, and target_data has value, and modal is shown
        if (target_id && showModal && submitMode == "edit") {
            handleFetch();
        }

        // fetch extra data if modal is shown
        if (showModal) {
            handleFetchExtraData()
        }

    }, [showModal, target_id]);


    return (
        <>

            <div className="h4 text-center mb-4">{submitMode == "add" ? "New" : "Update"} {TARGET_NAME}</div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input className="form-control"
                        type="text"
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="access_level" className="form-label">Access Level</label>
                    <select className="form-select" aria-label="Default select example"
                        onChange={handleInputChange}
                        value={data.access_level}
                        id='access_level'
                        name='access_level'
                        required
                    >
                        <option selected hidden>Select Access Level</option>
                        {
                            extraData && extraData.access_levels && extraData.access_levels.map((item, key) => (
                                <option key={key} value={item.id}>{item.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </>
    )
};

// PREVIEW for modals
const FormsView = ({ target_id, refetch_data, setShowModal }) => {
    const [data, setData] = useState({});
    const [extraData, setExtraData] = useState({})
    const { notifyError } = useNotifications()
    const { API_GET } = useSystemAPI()

    // fetches the data
    const handleFetch = async () => {
        try {
            const result = await API_GET(`/${TARGET_ENTITY}?id=${target_id}`)
            setData(result.data[0])
        } catch (error) {
            notifyError(`Failed to fetch ${TARGET_NAME}`, error)
        }
    };


    // handling fetch of extra data
    const handleFetchExtraData = async () => {
        try {
            const result = await API_GET(`/access_levels?id=${data.access_level}`)
            setExtraData({ ...extraData, access_level: result.data })
        } catch (error) {
            notifyError(`Failed to fetch extra data for ${TARGET_NAME}`, error)
        }
    }

    // fetches extra data if data has been set 
    useEffect(() => {
        if (data.id) {
            handleFetchExtraData()
        }
    }, [data])

    // fetches the data if target_id is assigned/has value
    useEffect(() => {
        handleFetch();
    }, [target_id])

    return (
        <>
            <div className="container my-4">
                <div className="mb-4">
                    <div className="row row-cols-2 p-2">
                        <div className="col text-muted border-end">Name</div>
                        <div className="col">{data.name}</div>
                    </div>

                    <div className="row row-cols-2 p-2">
                        <div className="col text-muted border-end">Access Level</div>
                        <div className="col">{extraData && extraData.access_level ? `${extraData.access_level.name} [${extraData.access_level.id}]` : "..."}</div>
                    </div>
                </div>


                <div className="mb-3 text-center rounded" style={{ fontSize: "0.75rem" }}>
                    <div>Created: {data?.created_at ? data.created_at : "..."}</div>
                    <div>Updated: {data?.updated_at ? data.updated_at : "..."}</div>
                </div>
            </div>


            <div className="d-flex justify-content-start">
                <FormsDelete_AccountRoles target_id={data?.id} target_name={data?.name} refetch_data={refetch_data} setParentShowModal={setShowModal} />
            </div>
        </>
    )
}

// Preview for Items
export const ItemVisualizerContent_AccountRoles = ({ data, mode = "list" }) => {
    const [extraData, setExtraData] = useState({})
    const { notifyError } = useNotifications()
    const { API_GET } = useSystemAPI()

    // handling fetch of extra data
    const handleFetchExtraData = async () => {
        try {
            const result = await API_GET(`/access_levels?id=${data.access_level}`)
            setExtraData({ ...extraData, access_level: result.data })
        } catch (error) {
            console.error(error)
            notifyError(`Failed to fetch extra data for ${TARGET_NAME}`, error)
        }
    }

    // fetches extra data if data has been set 
    useEffect(() => {
        if (data.id) {
            handleFetchExtraData()
        }
    }, [data])

    // NOTE: make sure that the NUMBER OF ROWS matches the table setup at the ENTITY MANAGER
    // preview mode for tables
    if (mode == 'list') {
        return (
            <>
                <td>{data.name}</td>
                <td>{extraData?.access_level ? extraData.access_level.name : <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}</td>
            </>
        )
    }

    // preview mode for cards
    if (mode == 'card') {
        return (
            <div className="">
                <div className="p fw-bold">{data.name}</div>
                <div className="p">System Access Level: {extraData?.access_level ? extraData.access_level.name : <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
            </div>
        )
    }
}