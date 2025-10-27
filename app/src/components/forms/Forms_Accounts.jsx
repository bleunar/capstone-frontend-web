import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useSystemAPI } from '../../hooks/useSystemAPI';
import FormModal from '../general/FormModal';

const TARGET_ENTITY = 'accounts'
const TARGET_NAME = "Account"
const BASE_OBJECT = {
    role_id: "",
    role_name: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    birth_date: "",
    email: "",
    username: "",
    password: "",
    status: "",
    created_at: "",
    updated_at: ""
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ADD COMPONENT
export const FormsAdd_Accounts = ({ mode = 'button', refetch_data }) => {
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
                <FormModal size='lg' onClose={() => setShowModal(false)}>
                    <FormsInputField submitMode="add" showModal={showModal} setShowModal={setShowModal} refetch_data={refetch_data} />
                </FormModal>
            )}
        </div>
    );
};

// VIEW COMPONENT
export const FormsView_Accounts = ({ target_id, mode = 'button', refetch_data }) => {
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
                    <FormModal size='lg' onClose={() => setShowModal(false)}>
                        <FormsView target_id={target_id} refetch_data={refetch_data} setShowModal={setShowModal} />
                    </FormModal>
                )}
            </div>
        </>
    );
};

// EDIT COMPONENT
export const FormsEdit_Accounts = ({ target_id, mode = 'button', refetch_data }) => {
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
                <FormModal size='lg' key={target_id} onClose={() => setShowModal(false)}>
                    <FormsInputField target_id={target_id} submitMode='edit' showModal setShowModal={setShowModal} refetch_data={refetch_data} />
                </FormModal>
            )}
        </div>
    );
};

// DELETE COMPONENT
export const FormsDelete_Accounts = ({ target_id, target_name = "", refetch_data, setParentShowModal }) => {
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
            notifyError(error)
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
                <FormModal size='sm' key={target_id} title="Confirm Deletion" onClose={() => setShowModal(false)}>
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
            notifyError(error)
        }
    };

    const handleAdd = async () => {
        try {
            const result = await API_POST(`/${TARGET_ENTITY}/`, data)
            refetch_data();
            setShowModal(false);
            setData(BASE_OBJECT);
            notifyConfirm(`${TARGET_NAME} added successfuly`)
        } catch (error) {
            notifyError(error)
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
            console.error(`Failed to fetch ${TARGET_NAME} data`, error);
        }
    };

    // handling fetch of extra data
    const handleFetchExtraData = async () => {
        try {
            const result = await API_GET("/account_roles")
            setExtraData({ ...extraData, account_roles: result })
        } catch (error) {
            console.error(`Failed to fetch extra data for ${TARGET_NAME}`, error)
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

            <div className="h4">Profile</div>

            <form onSubmit={handleSubmit} noValidate>

                <div className="mb-4">
                    <div className="container-fluid">
                        <div className="row row-cols-1 row-cols-sm-3">
                            <div className="col p-1">
                                <input className="form-control"
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={data.first_name}
                                    onChange={handleInputChange}
                                    placeholder='First Name'
                                    required
                                />
                            </div>
                            <div className="col p-1">
                                <input className="form-control"
                                    type="text"
                                    id="middle_name"
                                    name="middle_name"
                                    value={data.middle_name}
                                    onChange={handleInputChange}
                                    placeholder='Middle Name'
                                    required
                                />
                            </div>
                            <div className="col p-1">
                                <input className="form-control"
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={data.last_name}
                                    onChange={handleInputChange}
                                    placeholder='Last Name'
                                    required
                                />
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
                                    <select className="form-select" aria-label="Default select example"
                                    name='gender'
                                    id='gender'
                                    onChange={handleInputChange}
                                    value={data.gender}>
                                        <option selected hidden>Select Gender</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col p-1">
                                <div className="mb-3">
                                    <label htmlFor="birth_date" className="form-label">Birth Date</label>
                                    <input type="date" className="form-control" id="birth_date" name="birth_date" onChange={handleInputChange} value={data.birth_date} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h4">Credentials</div>

                <div className="mb-3">
                    <label htmlFor="access_level" className="form-label">Role</label>
                    <select className="form-select" aria-label="Default select example"
                        onChange={handleInputChange}
                        value={data.role_id}
                        id='role_id'
                        name='role_id'
                        required
                    >
                        <option selected hidden>Select Role</option>
                        {
                            extraData && extraData.account_roles && extraData.account_roles.map((item, key) => (
                                <option key={key} value={item.id}>{item.name}</option>
                            ))
                        }
                    </select>
                </div>


                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input className="form-control"
                        type="email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>


                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <div className="input-group">
                        <input className="form-control"
                            type="text"
                            id="username"
                            name="username"
                            value={data.username}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-title="Generate Username">
                            <i class="bi bi-arrow-clockwise"></i>
                        </div>
                    </div>
                </div>


                {
                    submitMode == 'add' && (
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">{submitMode == 'edit' ? "Password (Leave blank to keep old password)" : "Default Password"}</label>
                            <input className="form-control"
                                type="text"
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )
                }



                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select className="form-select" aria-label="Default select example"
                        onChange={handleInputChange}
                        value={data.status}
                        id='status'
                        name='status'
                    >
                        <option selected hidden>Default (Active)</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
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
            console.error(`Failed to fetch ${TARGET_NAME}`), error
        }
    };

    // not necessary to fetch extra data

    // fetches the data if target_id is assigned/has value
    useEffect(() => {
        handleFetch();
    }, [target_id])

    return (
        <>
            <div className="container my-4">
                <div className="mb-4">
                    <div className="row row-cols-2 p-2">
                        <div className="col text-muted border-end">Full Name</div>
                        <div className="col">{data?.first_name} {data?.middle_name} {data?.last_name}</div>
                    </div>

                    <div className="row row-cols-2 p-2">
                        <div className="col text-muted border-end">Gender</div>
                        <div className="col">{data?.gender ? data.gender : "..."}</div>
                    </div>

                    <div className="row row-cols-2 p-2">
                        <div className="col text-muted border-end">Birth Date</div>
                        <div className="col">{data?.birth_date ? data.birth_date : "..."}</div>
                    </div>

                    <hr />

                    <div className="row row-cols-2 p-2">
                        <div className="col text-muted border-end">Username</div>
                        <div className="col">{data?.username ? data.username : "..."}</div>
                    </div>

                    <div className="row row-cols-2 p-2">
                        <div className="col text-muted border-end">Email</div>
                        <div className="col">{data?.email ? data.email : "..."}</div>
                    </div>

                    <div className="row row-cols-2 p-2">
                        <div className="col text-muted border-end">Role</div>
                        <div className="col">{data?.role_name ? data.role_name : "..."}</div>
                    </div>
                </div>

                <div className="mb-3 text-center rounded" style={{ fontSize: "0.75rem" }}>
                    <div>Created: {data?.created_at ? data.created_at : "..."}</div>
                    <div>Updated: {data?.updated_at ? data.updated_at : "..."}</div>
                </div>
            </div>


            <div className="d-flex justify-content-start">
                <FormsDelete_Accounts target_id={data?.id} target_name={data?.name} refetch_data={refetch_data} setParentShowModal={setShowModal} />
            </div>
        </>
    )
}

// Preview for Items
export const ItemVisualizerContent_Accounts = ({ data, mode = "list" }) => {

    // NOTE: make sure that the NUMBER OF ROWS matches the table setup at the ENTITY MANAGER
    // preview mode for tables
    if (mode == 'list') {
        return (
            <>
                <td className='text-capitalize'>{data.first_name} {data.middle_name} {data.last_name}</td>
                <td>{data.username}</td>
                <td>{data.email}</td>
                <td>{data.role_name}</td>
            </>
        )
    }

    // preview mode for cards
    if (mode == 'card') {
        return (
            <div>
                <div className="p fw-bold text-capitalize">{data.first_name} {data.middle_name} {data.last_name}</div>
                <div className="p"> {data.username}</div>
                <div className="p"> {data.role_name}</div>
            </div>
        )
    }
}