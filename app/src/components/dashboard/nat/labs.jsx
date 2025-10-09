import { useEffect, useState } from "react";
import {
  FaDesktop,
  FaMouse,
  FaKeyboard,
  FaHeadphones,
  FaServer,
  FaPlug,
  FaWifi,
  FaTimes,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useSystemAPI } from "../../hooks/useSystemAPI";
import "../../assets/css/labs.css";  

const statusColors = {
  operational: { color: "#28a745", label: "Operational", priority: 0 },
  notOperational: { color: "#ffc107", label: "Not Operational", priority: 1 },
  damaged: { color: "#dc3545", label: "Damaged", priority: 2 },
  missing: { color: "#6c757d", label: "Missing", priority: 3 },
};

function StatusButtons({ part, compId, status, handleStatusChange }) {
  const statuses = ["operational", "notOperational", "damaged", "missing"];
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6 }}>
      {statuses.map((s) => (
        <button
          key={s}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `1px solid ${statusColors[s].color}`,
            backgroundColor: status === s ? statusColors[s].color : "transparent",
            cursor: "pointer",
            boxShadow: hovered === s ? `0 0 6px ${statusColors[s].color}` : "none",
          }}
          onClick={() => handleStatusChange(compId, part, s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(null)}
          title={statusColors[s].label}

          
        />
      ))}
    </div>
  );
}

function LabGrid({ labs, selectLab, deleteLab }) {
  return (
    <div className="d-flex flex-wrap gap-3 justify-content-center">
      {labs.map((lab) => (
        <div
          key={lab.id}
          onClick={() => selectLab(lab)}
          style={{
            position: "relative",
            background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
            borderRadius: 16,
            border: "1px solid #dee2e6",
            padding: "25px 20px",
            cursor: "pointer",
            textAlign: "center",
            width: 250,
            minHeight: 160,
            boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow =
              "0 8px 18px rgba(0, 123, 255, 0.25)";
            e.currentTarget.style.background =
              "linear-gradient(135deg, #ffffff, #f1f3f6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.08)";
            e.currentTarget.style.background =
              "linear-gradient(135deg, #f8f9fa, #e9ecef)";
          }}
        >
          {/* action icons top-right */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: "10px",
            }}
            onClick={(e) => e.stopPropagation()} // prevent selectLab
          >
            <FaTrashAlt
              size={18}
              color="red"
              style={{ cursor: "pointer" }}
              title="Delete"
              onClick={() => deleteLab(lab)}
            />
            <FaEdit
              size={18}
              color="orange"
              style={{ cursor: "pointer" }}
              title="Edit"
              onClick={() => {
                // open edit modal or navigate to edit page
                openEditLab(lab);
              }}
            />
          </div>

          
          <div
            style={{
              backgroundColor: "#0d6efd20",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 12px auto",
            }}
          >
            <FaDesktop size={28} color="#0d6efd" />
          </div>
          <h5 style={{ color: "#0d6efd", fontWeight: 600, marginBottom: 6 }}>
            {lab.name}
          </h5>
          <span
            style={{
              backgroundColor: "#e7f1ff",
              color: "#0d6efd",
              padding: "3px 10px",
              borderRadius: 12,
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {lab.location}
          </span>
        </div>
      ))}
    </div>
  );
}


function AddLabModal({ addLab, onClose }) {
  const { api_post, api_loading } = useSystemAPI();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLab = await api_post("/add_laboratory", {
        data: { lab_name: name, location: location }
      });
      addLab(newLab);
      toast.success(`Laboratory "${name}" added successfully`);
      onClose();
    } catch (err) {
      console.error("Error adding lab:", err);
      toast.error(`Failed to add laboratory: ${err}`);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h5 className="mb-0">Add Laboratory</h5>
          <button onClick={onClose} className="btn-close text-white">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Laboratory Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Laboratory Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Add Lab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function AddComputerModal({ lab, addComputer, onClose }) {
  const { api_post, api_loading } = useSystemAPI();
  const [pcNumber, setPcNumber] = useState("");
  const [parts, setParts] = useState({
    monitor: "",
    systemUnit: "",
    keyboard: "",
    mouse: "",
    headphone: "",
    hdmi: "",
    power: "",
    wifi: "",
  });

  const handleChange = (e) => {
    setParts({ ...parts, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComputer = await api_post("/computer", {
        data: {
          name: pcNumber,
          lab_name: lab.name,
          spec: JSON.stringify(parts),
        },
      });
      addComputer(newComputer);
      toast.success(`Computer "${pcNumber}" added to ${lab.name}`);
      onClose();
    } catch (err) {
      console.error("Error adding computer:", err);
      toast.error(`Failed to add computer: ${err}`);
    }
  };

  const partIcons = {
    monitor: <FaDesktop className="text-primary" />,
    systemUnit: <FaServer className="text-primary" />,
    keyboard: <FaKeyboard className="text-primary" />,
    mouse: <FaMouse className="text-primary" />,
    headphone: <FaHeadphones className="text-primary" />,
    hdmi: <FaPlug className="text-primary" />,
    power: <FaPlug className="text-primary" />,
    wifi: <FaWifi className="text-primary" />,
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card large">
        <div className="modal-header">
          <h5 className="mb-0">Add Computer – {lab.name}</h5>
          <button onClick={onClose} className="btn-close text-white">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="mb-3">
            <label className="form-label fw-bold">PC Number</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaDesktop className="text-success" />
              </span>
              <input
                type="text"
                className="form-control"
                value={pcNumber}
                onChange={(e) => setPcNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <h6 className="fw-bold text-primary mt-3 mb-3">Parts Serial Numbers</h6>
          <div className="row g-3">
            {Object.keys(parts).map((p) => (
              <div key={p} className="col-md-6">
                <label className="form-label text-capitalize">
                  {p} Serial Number
                </label>
                <div className="input-group">
                  <span className="input-group-text">{partIcons[p]}</span>
                  <input
                    type="text"
                    name={p}
                    className="form-control"
                    value={parts[p]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Add Computer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LabDetail({ lab, computers, back, addComputer, deleteComputer }) {
  const { api_get, api_post, api_delete, api_loading } = useSystemAPI();
  const [statuses, setStatuses] = useState({});
  const [selectedPC, setSelectedPC] = useState(null);
  const [showAddComputer, setShowAddComputer] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");


  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await api_get("/locations");
        const newStatuses = {};
        data.forEach((row) => {
          newStatuses[row.com_id] = {
            hdmi: row.hdmi,
            headphone: row.headphone,
            keyboard: row.keyboard,
            monitor: row.monitor,
            mouse: row.mouse,
            power: row.power,
            systemUnit: row.systemUnit,
            wifi: row.wifi,
          };
        });
        setStatuses(newStatuses);
      } catch (err) {
        console.error("Error fetching statuses:", err);
        toast.error(`Failed to load computer statuses: ${err}`);
      }
    };
    fetchStatuses();
  }, [api_get]);
  
  console.log(statuses);
  const labComputers = computers.filter((c) => c.lab === lab.name);
  const partIcons = {
    monitor: FaDesktop,
    systemUnit: FaServer,
    keyboard: FaKeyboard,
    mouse: FaMouse,
    headphone: FaHeadphones,
    hdmi: FaPlug,
    power: FaPlug,
    wifi: FaWifi,
  };

  const getStatusStyle = (compId, part) =>
  statusColors[statuses[compId]?.[part] || "operational"];
  const setStatus = (compId, part, status) =>
    
    setStatuses((prev) => ({
      
      ...prev,
      [compId]: { ...prev[compId], [part]: status },
      
    }));

    const handleStatusChange = async (compId, part, newStatus) => {
      setStatus(compId, part, newStatus);
      try {
        await api_post("/update_computer_status", {
          compId: compId,
          part: part,
          status: newStatus
        });
        toast.success(`${part} status updated to ${newStatus}`);
      } catch (err) {
        console.error("Error updating status:", err);
        toast.error(`Failed to update status: ${err}`);
        // Revert the status change on error
        setStatuses(prev => ({
          ...prev,
          [compId]: { ...prev[compId], [part]: prev[compId]?.[part] || "operational" }
        }));
      }
    };
    const getPCColor = (pc) => {
      const partStatuses = Object.keys(pc.parts).map(
        (p) => statuses[pc.id]?.[p] || "operational"
      );
      const worst = partStatuses.reduce(
        (max, curr) =>
          statusColors[curr].priority > statusColors[max].priority ? curr : max,
        "operational"
      );
      return statusColors[worst].color;
    };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button onClick={back} className="btn btn-secondary btn-sm">
          ← Back to Labs
        </button>
        <button onClick={() => setShowAddComputer(true)} className="btn btn-primary">
          + Add Computer
        </button>
      </div>
      {saveMsg && (
        <div
          style={{backgroundColor: "#28a745",color: "white",padding: "5px 10px",
            borderRadius: "6px",marginBottom: "15px",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {saveMsg}
        </div>
      )}
      <h3 style={{ color: "#0d6efd", marginBottom: 15 }}>
        {lab.name} – {lab.location}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 20,
        }}
      >
        {labComputers.map((pc) => (
          <div
            key={pc.id}
            onClick={() => setSelectedPC(pc)}
            style={{
              background: "#fff",
              border: "1px solid #e0e6ed",
              borderRadius: 10,
              padding: "20px 10px",
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
            }}
          >
            <FaDesktop size={50} color={getPCColor(pc)} />
            <h6 style={{ marginTop: 10, color: "#0d6efd" }}>PC {pc.pcNumber}</h6>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#6c757d" }}>
              {pc.lab}
            </p><div
            
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: "10px",
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <FaTrashAlt
              size={18}
              color="red"
              style={{ cursor: "pointer" }}
              title="Delete"
              onClick={() => deleteComputer(pc)}
            />
           
          </div>



            
          </div>
        ))}
      </div>

      {selectedPC && (
        <div className="modal-backdrop">
          <div className="modal-card large">
            <div className="modal-header">
              <span>PC {selectedPC.pcNumber} – Update Status</span>
              <button
                onClick={() => setSelectedPC(null)}
                className="btn-close text-white"
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 12,
                }}
              >
                {Object.keys(selectedPC.parts).map((part) => {
                  const Icon = partIcons[part];
                  const style = getStatusStyle(selectedPC.id, part);
                  return (
                    <div
                      key={part}
                      style={{
                        textAlign: "center",
                        padding: 12,
                        borderRadius: 10,
                        background: "#f8f9fa",
                      }}
                    >
                      <Icon size={50} color={style.color} />
                      <div style={{ textTransform: "capitalize", marginTop: 6 }}>
                        {part}
                      </div>
                      <div style={{ fontSize: 12, color: "#495057", marginTop: 4 }}>
                        {selectedPC.parts[part]}
                      </div>
                      <StatusButtons
                        part={part}
                        compId={selectedPC.id}
                        status={statuses[selectedPC.id]?.[part] || "operational"}
                        handleStatusChange={handleStatusChange}
                      />
                    </div>
                  );
                })}
                
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 20,
                  marginTop: 25,
                  flexWrap: "wrap",
                  background: "#f8f9fa",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                {Object.keys(statusColors).map((s) => (
                  <div
                    key={s}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: statusColors[s].color,
                        border: "1px solid #ccc",
                      }}
                    />
                    <span style={{ fontSize: 14, color: "#495057" }}>
                      {statusColors[s].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
             <button
              onClick={() => {
                setSelectedPC(null);
                setSaveMsg("Status updated successfully!");
                setTimeout(() => setSaveMsg(""), 4000);
              }}
              className="btn"
              style={{
                backgroundColor: "#28a745",
                color: "white",
                fontWeight: "600",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Save
            </button>
             
            </div>
          </div>
        </div>
      )}

      {showAddComputer && (
        <AddComputerModal
          lab={lab}
          addComputer={addComputer}
          onClose={() => setShowAddComputer(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const { api_get, api_post, api_delete, api_loading } = useSystemAPI();
  const [selectedLab, setSelectedLab] = useState(null);
  const [labs, setLabs] = useState([]);
  const [computers, setComputers] = useState([]);
  const [showAddLab, setShowAddLab] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labsData, computersData] = await Promise.all([
          api_get("/locations"),
        ]);
        setLabs(labsData);
        setComputers(computersData);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error(`Failed to load laboratory data: ${err}`);
      }
    };
    fetchData();
  }, [api_get]);
  const addLab = (lab) => setLabs((prev) => [...prev, lab]);
  const addComputer = (comp) => setComputers((prev) => [...prev, comp]);
  
  const deleteLab = async (lab) => {
    if (window.confirm(`Are you sure you want to delete laboratory "${lab.name}"?`)) {
      try {
        await api_delete(`/delete_lab/${lab.id}`);
        setLabs(prev => prev.filter(l => l.id !== lab.id));
        toast.success(`Laboratory "${lab.name}" deleted successfully`);
      } catch (err) {
        console.error("Error deleting lab:", err);
        toast.error(`Failed to delete laboratory: ${err}`);
      }
    }
  };
  
  const deleteComputer = async (computer) => {
    if (window.confirm(`Are you sure you want to delete computer "${computer.pcNumber}"?`)) {
      try {
        await api_delete(`/delete_computer/${computer.id}`);
        setComputers(prev => prev.filter(c => c.id !== computer.id));
        toast.success(`Computer "${computer.pcNumber}" deleted successfully`);
      } catch (err) {
        console.error("Error deleting computer:", err);
        toast.error(`Failed to delete computer: ${err}`);
      }
    }
  };
  

  return (
    <div style={{ padding: 40, background: "#f1f3f6", minHeight: "100vh" }}>
      {!selectedLab && (
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h2 style={{ marginBottom: 20, color: "#0d6efd" }}>
            Laboratories and Computers
          </h2>
          <button
            onClick={() => setShowAddLab(true)}
            className="btn btn-primary"
          >
            + Add Laboratory
          </button>
        </div>
      )}
      {!selectedLab ? (
        <LabGrid labs={labs} selectLab={setSelectedLab} deleteLab={deleteLab} />
      ) : (
        <LabDetail
          lab={selectedLab}
          computers={computers}
          back={() => setSelectedLab(null)}
          addComputer={addComputer}
          deleteComputer={deleteComputer}
        />
      )}
      {showAddLab && (
        <AddLabModal addLab={addLab} onClose={() => setShowAddLab(false)} />
      )}
    </div>
  );
}
