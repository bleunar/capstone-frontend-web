import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {FaLaptop,FaUsers,FaUserCheck,FaUserTimes,FaExclamationTriangle,FaQuestionCircle,FaFileAlt,FaCogs, FaCheckCircle,} from "react-icons/fa";
import {PieChart,Pie,Cell,Tooltip,Legend,BarChart,Bar,XAxis,YAxis,CartesianGrid,ResponsiveContainer,LineChart,Line,AreaChart,Area,
} from "recharts";
import { toast } from "react-toastify";
import { useSystemAPI } from "../../hooks/useSystemAPI";
import "../../assets/css/dashboard.css";

const COLORS = {
  primary: "#0D6EFD",
  secondary: "#4e79a7",
  success: "#59a14f",
  danger: "#e15759",
  info: "#9c6ade",
  warning: "#ff9d76",
};

const DASHBOARD_DATA_TEMPLATE = {
  equipment: {
    total: 0,
    issues: 0,
  },
  equipment_sets: {
    total: 0,
    maintenance: 0,
    issues: 0,
  },
  account:{
    total:0,
  }
}

export default function AdminDashboard() {
  const { api_get, api_loading } = useSystemAPI();
  const [data, setDashboardData] = useState(DASHBOARD_DATA_TEMPLATE);

  useEffect(() => {
    const fetchr = async () => {
      try {
        setDashboardData(await GetDashboardData())
      } catch (error) {
        console.log(error)
      }

      if (api_get) {
        fetchr();
      }
    }
  }, [api_get]);

  const summaryItems = [
    { title: "Total Computers", value: data.equipment_sets.total, icon: <FaCogs />, color: "#4e79a7", bg: "#edf2f9" },
    { title: "Operational", value: data.equipment_sets.total - (data.equipment_sets.issues + data.equipment_sets.maintenance) , icon: <FaUserCheck />, color: "#59a14f", bg: "#eaf7ef" },
    { title: "Not Operational", value: (data.equipment_sets.issues + data.equipment_sets.maintenance), icon: <FaUserTimes />, color: "#e15759", bg: "#fdecec" },
    { title: "Total Users", value: data.account.total, icon: <FaUsers />, color: "#0D6EFD", bg: "#eaf2ff" },
    { title: "Reports Submitted", value: 21, icon: <FaFileAlt />, color: "#9c6ade", bg: "#f4ecfb" },
    { title: "Total Equipment", value: data.equipment.total, icon: <FaCheckCircle />, color: "#59a14f", bg: "#fff2eb" },
    { title: "Equipment Issues", value: data.equipment.issues, icon: <FaQuestionCircle />, color: "#ff9d76", bg: "#fdecec" },
  ];

  if (api_loading) {
    return (
      <Container fluid className="my-4 text-center">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="my-4">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="kpi-row mb-4">
        {summaryItems.map((item, idx) => (
          <Card
            key={idx}
            className="kpi-card shadow-sm"
            style={{ backgroundColor: item.bg }}
          >
            <Card.Body>
              <div className="kpi-icon" style={{ color: item.color }}>
                {item.icon}
              </div>
              <h6 className="kpi-title">{item.title}</h6>
              <div className="kpi-value">{item.value ?? 0}</div>
            </Card.Body>
          </Card>
        ))}
      </div>

      
      <Row className="g-4">
       
      <Col xs={12} md={6} lg={6}>
        <Card className="chart-card shadow-sm">
            <Card.Body>
              <Card.Title>Computer Status</Card.Title>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Operational", value: data.equipment.total },
                      { name: "Not Operational", value: data.equipment.issues },
                    ]}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110} // bigger pie
                    label
                  >
                    <Cell fill={COLORS.success} />
                    <Cell fill={COLORS.danger} />
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={6} lg={6}>
        <Card className="chart-card shadow-sm">
          <Card.Body>
            <Card.Title>Computer Parts Status</Card.Title>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={computerPartStatus}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                barCategoryGap="30%"  
                barGap={8}             
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                    allowDecimals={false}     // integers only
                    domain={[0, 'auto']}      // start from 0 up to automatic max
                    tickCount={Math.max(
                      2,
                      Math.ceil(
                        Math.max(...computerPartStatus.map(d =>
                          Math.max(d.operational, d.notOperational, d.missing, d.damaged)
                        )) + 1
                      )
                    )}
                    interval={0}              // force all ticks to show
                  />
                <Tooltip />
                <Legend verticalAlign="top" align="center" />
                <Bar dataKey="operational"    fill="green"   barSize={20} />
                <Bar dataKey="notOperational" fill="#FFC107" barSize={20} />
                <Bar dataKey="missing"        fill="#DC3545" barSize={20} />
                <Bar dataKey="damaged"        fill="#6C757D" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>



        {/* Labs & Computers */}
      <Col xs={12} md={6} lg={6}>
        <Card className="chart-card shadow-sm">
          <Card.Body>
            <Card.Title>Labs & Computers</Card.Title>
            <ResponsiveContainer width="100%" height={340}>
              <LineChart
                data={labsComputers}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <defs>
                  {/* Gradient for line stroke */}
                  <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D6EFD" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0D6EFD" stopOpacity={0.2} />
                  </linearGradient>

                  {/* Gradient for the fill under the line */}
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D6EFD" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0D6EFD" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="lab"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
                <Legend verticalAlign="top" align="center" />

                <Line
                  type="monotone"
                  dataKey="computers"
                  stroke="url(#lineColor)"
                  strokeWidth={3.5}
                  fill="url(#areaFill)"
                  fillOpacity={1}
                  dot={{ r: 6, stroke: "#0D6EFD", strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 8, fill: "#0D6EFD" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>


        {/* Damage vs Missing */}
      <Col xs={12} md={6} lg={6}>
        <Card className="chart-card shadow-sm">
          <Card.Body>
            <Card.Title>Damage vs Missing per Lab</Card.Title>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart
                data={damageMissing}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="damagedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e15759" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#e15759" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="missingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D6EFD" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0D6EFD" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="lab"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "6px" }}
                />
                <Legend verticalAlign="top" align="center" />

                <Area
                  type="monotone"
                  dataKey="damaged"
                  stroke="#e15759"
                  fill="url(#damagedGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="missing"
                  stroke="#0D6EFD"
                  fill="url(#missingGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>

      </Row>
    </Container>
  );
}


function GetDashboardData() {
  const {api_get} = useSystemAPI()
  const [data, getData] = useState(DASHBOARD_DATA_TEMPLATE)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          equipmentStatus,
          equipmentFunctionality,
          equipmentConnectivity,
          equipmentSets,
          equipmentSetsMaintenance,
          accountCounts
        ] = await Promise.all([
          api_get(`/analytics/equipment/status`),
          api_get(`/analytics/equipment/functionality`),
          api_get(`/analytics/equipment/connectivity`),
          api_get(`/equipment_sets`),
          api_get(`/equipment_sets?status=maintenance`),
          api_get(`/analytics/accounts/counts`)
        ]);
        setData({
          equipment: {
            total: equipmentStatus.data.metadata?.total_records || 0,
            issues:
              (equipmentFunctionality.data.metadata?.total_records || 0) -
              (equipmentFunctionality.data.data?.find(d => d.label === "functional")?.count || 0)
          },
          equipment_sets: {
            total: equipmentSets.data.data?.length || 0,
            maintenance: equipmentSetsMaintenance.data.data?.length || 0,
            issues:
              (equipmentConnectivity.data.metadata?.total_records || 0) -
              (equipmentConnectivity.data.data?.find(d => d.label === "connected")?.count || 0)
          },
          account: {
            total: accountCounts.data.metadata?.total_accounts || 0
          }
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error(`Failed to load laboratory data: ${err}`);
      }
    };
    fetchData();
  }, [api_get])

  return data
}