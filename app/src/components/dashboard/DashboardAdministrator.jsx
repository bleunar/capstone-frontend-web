import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/dashboard.css";
import {
    FaLaptop, FaUsers, FaUserCheck, FaUserTimes, FaExclamationTriangle,
    FaQuestionCircle, FaFileAlt, FaCogs
} from "react-icons/fa";
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    AreaChart, Area
} from "recharts";


const COLORS = {
    primary: "#006633",
    secondary: "#4e79a7",
    success: "#59a14f",
    danger: "#e15759",
    info: "#9c6ade",
    warning: "#ff9d76",
};

const KPI = ({ title, value, icon, color, bg }) => (
    <div className="col p-1">
        <Card className="kpi-card shadow-sm text-dark h-100" style={{ backgroundColor: bg }}>
            <Card.Body>
                <div className="kpi-icon" style={{ color }}>{icon}</div>
                <h6 className="kpi-title">{title}</h6>
                <div className="kpi-value">{value ?? 0}</div>
            </Card.Body>
        </Card>
    </div>
);


const ChartCard = ({ title, children }) => (
    <Card className="chart-card shadow-sm bg-body-tertiary h-100">
        <Card.Body>
            <Card.Title className="fw-bold text-center mb-3">{title}</Card.Title>
            {children}
        </Card.Body>
    </Card>
);


export default function DashboardAdministrator() {
    const [computerPartStatus, setComputerPartStatus] = useState([]);
    const [labsComputers, setLabsComputers] = useState([]);
    const [damageMissing, setDamageMissing] = useState([]);

    // NOTE: MISSING STATS FETCH

    const summaryItems = [
        { title: "Total Labs", value: 67, icon: <FaLaptop />, color: "#0D6EFD", bg: "#eaf2ff" },
        { title: "Total Computers", value: 67, icon: <FaCogs />, color: "#4e79a7", bg: "#edf2f9" },
        { title: "Operational Parts", value: 67, icon: <FaUserCheck />, color: "#59a14f", bg: "#eaf7ef" },
        { title: "Not Operational", value: 67, icon: <FaUserTimes />, color: "#e15759", bg: "#fdecec" },
        { title: "Total Users", value: 67, icon: <FaUsers />, color: "#0D6EFD", bg: "#eaf2ff" },
        { title: "Reports", value: 67, icon: <FaFileAlt />, color: "#9c6ade", bg: "#f4ecfb" },
        { title: "Damaged", value: 67, icon: <FaExclamationTriangle />, color: "#ff9d76", bg: "#fff2eb" },
        { title: "Missing", value: 67, icon: <FaQuestionCircle />, color: "#e15759", bg: "#fdecec" },
    ];

    return (
        <>
            <div className="container-fluid mb-3">
                {/* KPIs */}
                <div className="row row-cols-2 row-cols-sm-3 row-cols-xl-4 mb-3">
                    {summaryItems.map((item, idx) => (
                        <KPI key={idx} {...item} />
                    ))}
                </div>
            </div>

            <div className="container-fluid mb-3">
                <Row className="row-cols-1 row-cols-lg-2 row-cols-xxl-3">
                    {/* Computer Status Pie */}
                    <Col className="p-1">
                        <ChartCard title="Computer Status">
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Operational", value: 67 ?? 0 },
                                            { name: "Not Operational", value: 67 ?? 0 },
                                        ]}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={110}
                                        label
                                    >
                                        <Cell fill={COLORS.success} />
                                        <Cell fill={COLORS.danger} />
                                    </Pie>
                                    <Tooltip />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </Col>

                    {/* Computer Parts Status Bar */}
                    <Col className="p-1">
                        <ChartCard title="Computer Parts Status">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={computerPartStatus} margin={{ top: 20, right: 20, left: 0, bottom: 20 }} barCategoryGap="30%" barGap={8}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" />
                                    <YAxis allowDecimals={false} domain={[0, 'auto']} />
                                    <Tooltip />
                                    <Legend verticalAlign="top" align="center" />
                                    <Bar dataKey="operational" fill={COLORS.success} barSize={20} />
                                    <Bar dataKey="notOperational" fill={COLORS.warning} barSize={20} />
                                    <Bar dataKey="missing" fill={COLORS.danger} barSize={20} />
                                    <Bar dataKey="damaged" fill={COLORS.secondary} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </Col>

                    {/* Labs & Computers */}
                    <Col className="p-1">
                        <ChartCard title="Labs & Computers">
                            <ResponsiveContainer width="100%" height={340}>
                                <BarChart data={labsComputers} margin={{ top: 30, right: 30, left: 20, bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="2 4" stroke="#d6d6d6" />
                                    <XAxis dataKey="lab" tick={{ fill: "#333", fontSize: 14 }} interval={0} angle={-20} dy={10} />
                                    <YAxis allowDecimals={false} tick={{ fill: "#333", fontSize: 14 }} />
                                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ccc", borderRadius: "8px", fontSize: 14 }} />
                                    <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: 14, marginBottom: 10 }} />
                                    <Bar dataKey="computers" fill="#36A420" barSize={40} radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </Col>

                    {/* Damage vs Missing */}
                    <Col className="p-1">
                        <ChartCard title="Damage vs Missing per Lab">
                            <ResponsiveContainer width="100%" height={340}>
                                <AreaChart data={damageMissing} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                                    <defs>
                                        <linearGradient id="damagedGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={COLORS.danger} stopOpacity={0.9} />
                                            <stop offset="100%" stopColor={COLORS.danger} stopOpacity={0.2} />
                                        </linearGradient>
                                        <linearGradient id="missingGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.9} />
                                            <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="lab" interval={0} angle={-30} textAnchor="end" height={60} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "6px" }} />
                                    <Legend verticalAlign="top" align="center" />
                                    <Area type="monotone" dataKey="damaged" stroke={COLORS.danger} fill="url(#damagedGradient)" strokeWidth={2} activeDot={{ r: 6 }} />
                                    <Area type="monotone" dataKey="missing" stroke={COLORS.primary} fill="url(#missingGradient)" strokeWidth={2} activeDot={{ r: 6 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </Col>
                </Row>
            </div>
        </>
    )
}
