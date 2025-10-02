import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useSystemAPI } from '../../hooks/useSystemAPI';
import FormModal from '../general/FormModal';

const TARGET_ENTITY = 'equipment_sets'
const TARGET_NAME = "Equipment Set"
const BASE_OBJECT = {
    id: "",
    name: "",
    description: "",
    equipment_layout: "",
    created_at: "",
    updated_at: "",
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ADD COMPONENT
export const FormsAdd_Locations = ({ mode = 'button', refetch_data }) => {
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
export const FormsView_Locations = ({ target_id, mode = 'button', refetch_data }) => {
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
export const FormsEdit_Locations = ({ target_id, mode = 'button', refetch_data }) => {
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
export const FormsDelete_Locations = ({ target_id, target_name = "", refetch_data, setParentShowModal }) => {
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
            setData(result[0]);
        } catch (error) {
            notifyError(`Failed to fetch ${TARGET_NAME} data`, error);
        }
    };

    // fetch data on component load
    useEffect(() => {
        // fetch target item data if in edit mode, and target_data has value, and modal is shown
        if (target_id && showModal && submitMode == "edit") {
            handleFetch();
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
                    <label htmlFor="description" className="form-label">Description</label>
                    <input className="form-control"
                        type="text"
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>


                <div className="mb-3">
                    <label htmlFor="equipment_layout" className="form-label">Equipment Layout</label>
                    <select className="form-select" aria-label="Default select example"
                        onChange={handleInputChange}
                        value={data.equipment_layout}
                        id='equipment_layout'
                        name='equipment_layout'
                        required
                    >
                        <option selected hidden>Default (5 Rows)</option>
                        <option value="5">5 Rows</option>
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
            setData(result[0])
        } catch (error) {
            notifyError(`Failed to fetch ${TARGET_NAME}`, error)
        }
    };


    // fetches the data if target_id is assigned/has value
    useEffect(() => {
        handleFetch();
    }, [target_id])

    return (
        <>
            <div className="container my-3">

                <div className="text-start text-md-center">
                    <div className="mb-3">
                        <div className="p text-muted">Name</div>
                        <div className="p fw-bold">{data.name ? data.name :  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
                    </div>

                    <div className="mb-3">
                        <div className="p text-muted">Description</div>
                        <div className="p fw-bold">{data.description ? data.description :  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
                    </div>
                </div>

                <div className="mb-3 text-center rounded" style={{ fontSize: "0.75rem" }}>
                    <div>Created: {data?.created_at ? data.created_at : <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
                    <div>Updated: {data?.updated_at ? data.updated_at : <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
                </div>
            </div>

            <div className="d-flex justify-content-end">
                <FormsDelete_Locations target_id={data?.id} target_name={data?.name} refetch_data={refetch_data} setParentShowModal={setShowModal} />
            </div>
        </>
    )
}

// Preview for Items
export const ItemVisualizerContent_Locations = ({ data, mode = "list" }) => {

    // NOTE: make sure that the NUMBER OF ROWS matches the table setup at the ENTITY MANAGER
    // preview mode for tables
    if (mode == 'list') {
        return (
            <>
                <td>{data.name}</td>
                <td className='text-muted'>{data.description}</td>
            </>
        )
    }

    // preview mode for cards
    if (mode == 'card') {
        return (
            <div className="">
                <div className="p fw-bold">{data.name ? data.name : <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
                <div className="p-2 mt-2 rounded bg-body-tertiary">
                    <div className="p">{data.description ? data.description : <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>}</div>
                </div>
            </div>
        )
    }
}