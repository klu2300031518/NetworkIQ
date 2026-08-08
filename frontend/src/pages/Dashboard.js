import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";

import { FaBoxes } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";

import API from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {

        try {

            setLoading(true);

            // Get real inventory data
            const inventoryResponse =
                await API.get("/inventory");

            // Get recommendation history
            const recommendationResponse =
                await API.get("/recommendations/history");

            setInventory(
                inventoryResponse.data || []
            );

            setRecommendations(
                recommendationResponse.data || []
            );

        } catch (error) {

            console.error(
                "Dashboard data loading error:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LIVE STATISTICS
    // =========================

    // Number of inventory records
    const totalInventory = inventory.length;


    // Number of AI recommendations
    const totalRecommendations =
        recommendations.length;


    // Number of low-stock inventory records
    const lowStockCount =
        inventory.filter(
            item =>
                Number(item.stock || 0) <
                Number(item.demand || 0)
        ).length;


    // Number of saved reports
    const totalReports =
        recommendations.length;


    return (

        <div style={{ display: "flex" }}>

            <Sidebar />

            <div style={{ flex: 1 }}>

                <Navbar />

                <div style={{ padding: "30px" }}>

                    {/* =========================
                        HEADER
                    ========================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "30px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    marginBottom: "8px",
                                    color: "#0f172a"
                                }}
                            >
                                Dashboard
                            </h1>

                            <p
                                style={{
                                    color: "#64748b",
                                    margin: 0
                                }}
                            >
                                AI Powered Inventory Optimization System
                            </p>

                        </div>


                        {/* Refresh button */}

                        <button
                            onClick={loadDashboardData}
                            style={{
                                backgroundColor: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "11px 18px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >

                            ↻ Refresh

                        </button>

                    </div>


                    {/* =========================
                        DASHBOARD CARDS
                    ========================= */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(4, 1fr)",
                            gap: "20px"
                        }}
                    >

                        {/* INVENTORY */}

                        <DashboardCard
                            icon={<FaBoxes />}
                            title="Inventory"
                            value={
                                loading
                                    ? "..."
                                    : totalInventory
                            }
                            color="#2563eb"
                            onClick={() =>
                                navigate("/inventory")
                            }
                        />


                        {/* AI RECOMMENDATIONS */}

                        <DashboardCard
                            icon={<FaRobot />}
                            title="AI Recommendations"
                            value={
                                loading
                                    ? "..."
                                    : totalRecommendations
                            }
                            color="#16a34a"
                            onClick={() =>
                                navigate("/recommendation")
                            }
                        />


                        {/* ANALYTICS */}

                        <DashboardCard
                            icon={<FaChartBar />}
                            title="Low Stock Items"
                            value={
                                loading
                                    ? "..."
                                    : lowStockCount
                            }
                            color="#ea580c"
                            onClick={() =>
                                navigate("/analytics")
                            }
                        />


                        {/* REPORTS */}

                        <DashboardCard
                            icon={<FaFileAlt />}
                            title="Reports"
                            value={
                                loading
                                    ? "..."
                                    : totalReports
                            }
                            color="#9333ea"
                            onClick={() =>
                                navigate("/reports")
                            }
                        />

                    </div>


                    {/* =========================
                        QUICK OVERVIEW
                    ========================= */}

                    <div
                        style={{
                            marginTop: "30px",
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, 1fr)",
                            gap: "20px"
                        }}
                    >

                        {/* Total Stock */}

                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "22px",
                                borderRadius: "12px",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.06)"
                            }}
                        >

                            <div
                                style={{
                                    color: "#64748b",
                                    fontSize: "13px",
                                    fontWeight: "600"
                                }}
                            >
                                TOTAL STOCK
                            </div>

                            <h2
                                style={{
                                    margin: "8px 0 0",
                                    color: "#0f172a"
                                }}
                            >
                                {loading
                                    ? "..."
                                    : inventory.reduce(
                                        (total, item) =>
                                            total +
                                            Number(
                                                item.stock || 0
                                            ),
                                        0
                                    )}
                            </h2>

                        </div>


                        {/* Total Demand */}

                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "22px",
                                borderRadius: "12px",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.06)"
                            }}
                        >

                            <div
                                style={{
                                    color: "#64748b",
                                    fontSize: "13px",
                                    fontWeight: "600"
                                }}
                            >
                                TOTAL DEMAND
                            </div>

                            <h2
                                style={{
                                    margin: "8px 0 0",
                                    color: "#0f172a"
                                }}
                            >
                                {loading
                                    ? "..."
                                    : inventory.reduce(
                                        (total, item) =>
                                            total +
                                            Number(
                                                item.demand || 0
                                            ),
                                        0
                                    )}
                            </h2>

                        </div>


                        {/* Accepted Recommendations */}

                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "22px",
                                borderRadius: "12px",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.06)"
                            }}
                        >

                            <div
                                style={{
                                    color: "#64748b",
                                    fontSize: "13px",
                                    fontWeight: "600"
                                }}
                            >
                                ACCEPTED AI DECISIONS
                            </div>

                            <h2
                                style={{
                                    margin: "8px 0 0",
                                    color: "#16a34a"
                                }}
                            >
                                {loading
                                    ? "..."
                                    : recommendations.filter(
                                        item =>
                                            item.decision ===
                                            "ACCEPTED"
                                    ).length}
                            </h2>

                        </div>

                    </div>


                    {/* =========================
                        SYSTEM STATUS
                    ========================= */}

                    <div
                        style={{
                            marginTop: "30px",
                            backgroundColor: "#ffffff",
                            padding: "25px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.06)"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: 0,
                                color: "#0f172a"
                            }}
                        >
                            System Overview
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(3, 1fr)",
                                gap: "20px"
                            }}
                        >

                            <div>

                                <span
                                    style={{
                                        color: "#64748b",
                                        fontSize: "13px"
                                    }}
                                >
                                    Inventory System
                                </span>

                                <div
                                    style={{
                                        color: "#16a34a",
                                        fontWeight: "700",
                                        marginTop: "5px"
                                    }}
                                >
                                    ● Connected
                                </div>

                            </div>


                            <div>

                                <span
                                    style={{
                                        color: "#64748b",
                                        fontSize: "13px"
                                    }}
                                >
                                    AI Recommendation Engine
                                </span>

                                <div
                                    style={{
                                        color: "#16a34a",
                                        fontWeight: "700",
                                        marginTop: "5px"
                                    }}
                                >
                                    ● Active
                                </div>

                            </div>


                            <div>

                                <span
                                    style={{
                                        color: "#64748b",
                                        fontSize: "13px"
                                    }}
                                >
                                    Database
                                </span>

                                <div
                                    style={{
                                        color: "#16a34a",
                                        fontWeight: "700",
                                        marginTop: "5px"
                                    }}
                                >
                                    ● Connected
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;