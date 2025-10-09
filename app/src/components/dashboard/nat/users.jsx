import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUserPlus, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSystemAPI } from "../../hooks/useSystemAPI";
import "../../assets/css/users.css";

export default function UsersRoles() {
  const { api_get, api_post, api_put, api_delete, api_loading } = useSystemAPI();
  const [users, setUsers] = useState([]);
  const [roles] = useState([
    "Admin",
    "Lab Assistant",
    "Faculty",
    "Guest",
    "Lab Adviser",
  ]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api_get("/get_users");
        const transformed = data.map((u) => ({
          name: u.name?.trim(),
          email: u.email,
          role: u.role?.trim(),
        }));
        setUsers(transformed);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error(`Failed to fetch users: ${err}`);
      }
    };
    fetchUsers();
  }, [api_get]);

  const handleAddUser = () => {
    setSelectedUser({ name: "", email: "", role: "" });
    setModalType("add");
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType("edit");
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType("view");
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await api_delete(`/delete_user/${encodeURIComponent(user.email)}`);
        setUsers(users.filter((u) => u.email !== user.email));
        toast.success(`User ${user.name} deleted successfully`);
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error(`Failed to delete user: ${err}`);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "add") {
        await api_post("/add_user", selectedUser);
        setUsers([...users, selectedUser]);
        toast.success(`User ${selectedUser.name} added successfully`);
      } else if (modalType === "edit") {
        await api_put(`/update_user/${encodeURIComponent(selectedUser.email)}`, selectedUser);
        setUsers(users.map(u => u.email === selectedUser.email ? selectedUser : u));
        toast.success(`User ${selectedUser.name} updated successfully`);
      }
      setModalType("");
      setSelectedUser(null);
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error(`Failed to save user: ${err}`);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mt-4 ">
     
      <h2 className="fw text-primary" style={{ textAlign: "center" }}>
        Users & Roles</h2>
     <div className="d-flex justify-content-end mb-3">
  <button className="btn btn-success shadow-sm" onClick={handleAddUser} disabled={api_loading}>
    <FaUserPlus /> {api_loading ? "Loading..." : "Add User"}
  </button>
</div>
      <div className="row mb-3 g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="🔍 Search by name/email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select shadow-sm"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        user.role === "Admin"
                          ? "danger"
                          : user.role === "Lab Assistant"
                          ? "success"
                          : user.role === "Faculty"
                          ? "primary"
                          : "secondary"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-primary"
                      title="View User"
                      onClick={() => handleViewUser(user)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      title="Edit User"
                      onClick={() => handleEditUser(user)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      title="Delete User"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalType && (
        <div className="modal show d-block modal-overlay">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "view"
                    ? "View User"
                    : modalType === "edit"
                    ? "Edit User"
                    : "Add User"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalType("")}
                ></button>
              </div>
              <div className="modal-body">
                {modalType === "view" ? (
                  <div>
                    <p>
                      <strong>Name:</strong> {selectedUser.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {selectedUser.role}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedUser.name}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={selectedUser.email}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={selectedUser.role}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            role: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      {modalType === "edit" ? "Update" : "Add"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
