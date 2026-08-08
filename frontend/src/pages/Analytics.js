import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

function Analytics() {

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get("/inventory");

            setInventory(response.data);

        } catch (err) {

            console.error("Analytics error:", err);

            setError(
                "Unable to load inventory data. Please make sure the Spring Boot backend is running."
            );

        } finally {

            setLoading(false);

        }
    };

    // -----------------------------
    // Calculate statistics
    // -----------------------------

    const totalItems = inventory.length;

    const totalStock = inventory.reduce(
        (sum, item) => sum + Number(item.stock || 0),
        0
    );

    const totalDemand = inventory.reduce(
        (sum, item) => sum + Number(item.demand || 0),
        0
    );

    const lowStockItems = inventory.filter(
        item => Number(item.stock || 0) < Number(item.demand || 0)
    );

    const sufficientStockItems = inventory.filter(
        item => Number(item.stock || 0) >= Number(item.demand || 0)
    );

    // -----------------------------
    // Chart data
    // -----------------------------

    const stockDemandData = inventory.map(item => ({
        name: `${item.warehouse} - ${item.product}`,
        stock: Number(item.stock || 0),
        demand: Number(item.demand || 0)
    }));

    const stockStatusData = [
        {
            name: "Low Stock",
            value: lowStockItems.length
        },
        {
            name: "Sufficient Stock",
            value: sufficientStockItems.length
        }
    ];

    const COLORS = ["#ef4444", "#22c55e"];

    // -----------------------------
    // Loading
    // -----------------------------

    if (loading) {

        return (
            <div style={{ display: "flex" }}>

                <Sidebar />

                <div style={{ flex: 1 }}>

                    <Navbar />

                    <div style={styles.loadingContainer}>
                        <h2>Loading Analytics...</h2>
                        <p>Fetching inventory data from the backend.</p>
                    </div>

                </div>

            </div>
        );
    }

    return (

        <div style={{ display: "flex" }}>

            <Sidebar />

            <div style={{ flex: 1 }}>

                <Navbar />

                <div style={styles.container}>

                    {/* Page Header */}

                    <div style={styles.header}>

                        <div>

                            <div style={styles.label}>
                                AI ANALYTICS
                            </div>

                            <h1 style={styles.title}>
                                Inventory Analytics
                            </h1>

                            <p style={styles.subtitle}>
                                Analyze inventory levels, demand and stock availability.
                            </p>

                        </div>

                        <button
                            onClick={loadInventory}
                            style={styles.refreshButton}
                        >
                            ↻ Refresh
                        </button>

                    </div>


                    {/* Error */}

                    {error && (

                        <div style={styles.error}>
                            ⚠️ {error}
                        </div>

                    )}


                    {/* Statistics */}

                    <div style={styles.statsGrid}>

                        <div style={styles.statCard}>

                            <div style={styles.statIcon}>
                                📦
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    TOTAL ITEMS
                                </div>

                                <div style={styles.statValue}>
                                    {totalItems}
                                </div>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIcon}>
                                📊
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    TOTAL STOCK
                                </div>

                                <div style={styles.statValue}>
                                    {totalStock}
                                </div>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIcon}>
                                📈
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    TOTAL DEMAND
                                </div>

                                <div style={styles.statValue}>
                                    {totalDemand}
                                </div>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIcon}>
                                ⚠️
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    LOW STOCK
                                </div>

                                <div style={styles.statValueRed}>
                                    {lowStockItems.length}
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Stock vs Demand */}

                    <div style={styles.chartCard}>

                        <div style={styles.cardHeader}>

                            <div>

                                <h2 style={styles.cardTitle}>
                                    Stock vs Demand
                                </h2>

                                <p style={styles.cardSubtitle}>
                                    Compare current stock with product demand.
                                </p>

                            </div>

                        </div>

                        {inventory.length === 0 ? (

                            <div style={styles.empty}>
                                No inventory data available.
                            </div>

                        ) : (

                            <div style={{ width: "100%", height: 400 }}>

                                <ResponsiveContainer>

                                    <BarChart
                                        data={stockDemandData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 80
                                        }}
                                    >

                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="name"
                                            angle={-35}
                                            textAnchor="end"
                                            interval={0}
                                        />

                                        <YAxis />

                                        <Tooltip />

                                        <Legend />

                                        <Bar
                                            dataKey="stock"
                                            name="Current Stock"
                                            fill="#2563eb"
                                            radius={[5, 5, 0, 0]}
                                        />

                                        <Bar
                                            dataKey="demand"
                                            name="Demand"
                                            fill="#f97316"
                                            radius={[5, 5, 0, 0]}
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>

                        )}

                    </div>


                    {/* Lower Section */}

                    <div style={styles.twoColumn}>

                        {/* Stock Status */}

                        <div style={styles.chartCard}>

                            <h2 style={styles.cardTitle}>
                                Stock Status
                            </h2>

                            <p style={styles.cardSubtitle}>
                                Inventory availability overview.
                            </p>

                            {inventory.length === 0 ? (

                                <div style={styles.empty}>
                                    No data available.
                                </div>

                            ) : (

                                <div style={{ width: "100%", height: 300 }}>

                                    <ResponsiveContainer>

                                        <PieChart>

                                            <Pie
                                                data={stockStatusData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                dataKey="value"
                                                label
                                            >

                                                {stockStatusData.map(
                                                    (entry, index) => (

                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index]}
                                                        />

                                                    )
                                                )}

                                            </Pie>

                                            <Tooltip />

                                            <Legend />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>

                            )}

                        </div>


                        {/* Low Stock Products */}

                        <div style={styles.chartCard}>

                            <h2 style={styles.cardTitle}>
                                ⚠️ Low Stock Products
                            </h2>

                            <p style={styles.cardSubtitle}>
                                Products where demand is greater than available stock.
                            </p>

                            {lowStockItems.length === 0 ? (

                                <div style={styles.successBox}>
                                    ✓ All inventory levels are sufficient.
                                </div>

                            ) : (

                                <div>

                                    {lowStockItems.map(item => (

                                        <div
                                            key={item.id}
                                            style={styles.lowStockItem}
                                        >

                                            <div>

                                                <strong>
                                                    {item.product}
                                                </strong>

                                                <div style={styles.itemWarehouse}>
                                                    {item.warehouse}
                                                </div>

                                            </div>

                                            <div style={styles.stockNumbers}>

                                                <span style={styles.stockRed}>
                                                    Stock: {item.stock}
                                                </span>

                                                <span>
                                                    Demand: {item.demand}
                                                </span>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* Inventory Analysis Table */}

                    <div style={styles.chartCard}>

                        <h2 style={styles.cardTitle}>
                            Inventory Analysis
                        </h2>

                        <p style={styles.cardSubtitle}>
                            Detailed stock and demand analysis.
                        </p>

                        <div style={styles.tableWrapper}>

                            <table style={styles.table}>

                                <thead>

                                    <tr>

                                        <th style={styles.th}>
                                            Warehouse
                                        </th>

                                        <th style={styles.th}>
                                            Product
                                        </th>

                                        <th style={styles.th}>
                                            Stock
                                        </th>

                                        <th style={styles.th}>
                                            Demand
                                        </th>

                                        <th style={styles.th}>
                                            Difference
                                        </th>

                                        <th style={styles.th}>
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {inventory.map(item => {

                                        const stock = Number(item.stock || 0);
                                        const demand = Number(item.demand || 0);
                                        const difference = stock - demand;
                                        const lowStock = difference < 0;

                                        return (

                                            <tr key={item.id}>

                                                <td style={styles.td}>
                                                    {item.warehouse}
                                                </td>

                                                <td style={styles.td}>
                                                    {item.product}
                                                </td>

                                                <td style={styles.td}>
                                                    {stock}
                                                </td>

                                                <td style={styles.td}>
                                                    {demand}
                                                </td>

                                                <td
                                                    style={{
                                                        ...styles.td,
                                                        color: lowStock
                                                            ? "#dc2626"
                                                            : "#16a34a",
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {difference}
                                                </td>

                                                <td style={styles.td}>

                                                    <span
                                                        style={
                                                            lowStock
                                                                ? styles.lowBadge
                                                                : styles.goodBadge
                                                        }
                                                    >

                                                        {lowStock
                                                            ? "LOW STOCK"
                                                            : "SUFFICIENT"}

                                                    </span>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}


// ----------------------------------
// Styles
// ----------------------------------

const styles = {

    container: {
        padding: "35px",
        background: "#f7f9fc",
        minHeight: "calc(100vh - 70px)"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "30px"
    },

    label: {
        color: "#2563eb",
        fontWeight: "bold",
        fontSize: "14px",
        letterSpacing: "2px",
        marginBottom: "8px"
    },

    title: {
        fontSize: "42px",
        margin: "0 0 8px 0",
        color: "#111827"
    },

    subtitle: {
        fontSize: "18px",
        color: "#64748b",
        margin: 0
    },

    refreshButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "14px 24px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer"
    },

    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "16px",
        borderRadius: "10px",
        marginBottom: "25px"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "25px"
    },

    statCard: {
        background: "white",
        borderRadius: "14px",
        padding: "25px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.06)"
    },

    statIcon: {
        fontSize: "32px",
        background: "#eff6ff",
        padding: "15px",
        borderRadius: "12px"
    },

    statLabel: {
        fontSize: "13px",
        color: "#64748b",
        fontWeight: "bold",
        letterSpacing: "1px"
    },

    statValue: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#111827",
        marginTop: "5px"
    },

    statValueRed: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#dc2626",
        marginTop: "5px"
    },

    chartCard: {
        background: "white",
        borderRadius: "14px",
        padding: "28px",
        marginBottom: "25px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.06)"
    },

    cardHeader: {
        display: "flex",
        justifyContent: "space-between"
    },

    cardTitle: {
        fontSize: "24px",
        margin: "0 0 8px 0",
        color: "#111827"
    },

    cardSubtitle: {
        color: "#64748b",
        marginTop: "0",
        marginBottom: "25px"
    },

    twoColumn: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "25px"
    },

    empty: {
        textAlign: "center",
        padding: "50px",
        color: "#64748b"
    },

    successBox: {
        background: "#dcfce7",
        color: "#166534",
        padding: "20px",
        borderRadius: "10px",
        fontWeight: "bold"
    },

    lowStockItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px",
        borderBottom: "1px solid #e5e7eb"
    },

    itemWarehouse: {
        color: "#64748b",
        fontSize: "14px",
        marginTop: "5px"
    },

    stockNumbers: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        textAlign: "right"
    },

    stockRed: {
        color: "#dc2626",
        fontWeight: "bold"
    },

    tableWrapper: {
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    th: {
        background: "#f8fafc",
        padding: "15px",
        textAlign: "left",
        color: "#475569",
        fontSize: "14px",
        borderBottom: "1px solid #e2e8f0"
    },

    td: {
        padding: "15px",
        borderBottom: "1px solid #e2e8f0",
        color: "#334155"
    },

    lowBadge: {
        background: "#fee2e2",
        color: "#dc2626",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold"
    },

    goodBadge: {
        background: "#dcfce7",
        color: "#16a34a",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold"
    },

    loadingContainer: {
        padding: "60px",
        textAlign: "center"
    }

};

export default Analytics;