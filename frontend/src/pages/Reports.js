import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Reports() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {

        try {

            const response = await API.get(
                "/recommendations/history"
            );

            setHistory(response.data || []);

        } catch (error) {

            console.error(
                "History loading error:",
                error
            );

            setMessage(
                "Unable to load recommendation history."
            );

        } finally {

            setLoading(false);
        }
    };

    const getPriorityColor = (score) => {

        if (score >= 300) {
            return "#dc2626";
        }

        if (score >= 150) {
            return "#f59e0b";
        }

        return "#16a34a";
    };

    const getDecisionStyle = (decision) => {

        if (decision === "ACCEPTED") {

            return {
                backgroundColor: "#dcfce7",
                color: "#15803d"
            };

        }

        return {
            backgroundColor: "#f1f5f9",
            color: "#64748b"
        };
    };

    return (

        <div style={styles.pageWrapper}>

            <Sidebar />

            <div style={styles.mainContent}>

                <Navbar />

                <div style={styles.container}>

                    {/* Header */}

                    <div style={styles.header}>

                        <div>

                            <div style={styles.smallTitle}>
                                AI ANALYTICS
                            </div>

                            <h1 style={styles.title}>
                                Recommendation Reports
                            </h1>

                            <p style={styles.subtitle}>
                                Review previous AI inventory decisions and recommendations.
                            </p>

                        </div>

                        <button
                            onClick={loadHistory}
                            style={styles.refreshButton}
                        >
                            ↻ Refresh
                        </button>

                    </div>


                    {/* Statistics */}

                    <div style={styles.statsGrid}>

                        <div style={styles.statCard}>

                            <div style={styles.statIcon}>
                                📊
                            </div>

                            <div>
                                <span style={styles.statLabel}>
                                    TOTAL RECOMMENDATIONS
                                </span>

                                <h2 style={styles.statNumber}>
                                    {history.length}
                                </h2>
                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIcon}>
                                ✓
                            </div>

                            <div>
                                <span style={styles.statLabel}>
                                    ACCEPTED
                                </span>

                                <h2 style={styles.statNumber}>
                                    {
                                        history.filter(
                                            item =>
                                                item.decision === "ACCEPTED"
                                        ).length
                                    }
                                </h2>
                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIcon}>
                                ⚠️
                            </div>

                            <div>
                                <span style={styles.statLabel}>
                                    HIGH PRIORITY
                                </span>

                                <h2 style={styles.statNumber}>
                                    {
                                        history.filter(
                                            item =>
                                                Number(item.priorityScore) >= 300
                                        ).length
                                    }
                                </h2>
                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIcon}>
                                🤖
                            </div>

                            <div>
                                <span style={styles.statLabel}>
                                    AI DECISIONS
                                </span>

                                <h2 style={styles.statNumber}>
                                    {history.length}
                                </h2>
                            </div>

                        </div>

                    </div>


                    {/* Error */}

                    {message && (

                        <div style={styles.errorBox}>
                            ⚠️ {message}
                        </div>

                    )}


                    {/* Report Table */}

                    <div style={styles.tableCard}>

                        <div style={styles.tableHeader}>

                            <div>

                                <h2 style={styles.tableTitle}>
                                    Recommendation History
                                </h2>

                                <p style={styles.tableSubtitle}>
                                    AI-generated inventory decisions
                                </p>

                            </div>

                        </div>


                        {loading ? (

                            <div style={styles.loading}>
                                🤖 Loading recommendation history...
                            </div>

                        ) : history.length === 0 ? (

                            <div style={styles.emptyState}>

                                <div style={styles.emptyIcon}>
                                    📋
                                </div>

                                <h3>
                                    No recommendations yet
                                </h3>

                                <p>
                                    Generate an AI recommendation to see it here.
                                </p>

                            </div>

                        ) : (

                            <div style={styles.tableWrapper}>

                                <table style={styles.table}>

                                    <thead>

                                        <tr>

                                            <th style={styles.th}>
                                                ID
                                            </th>

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
                                                Recommendation
                                            </th>

                                            <th style={styles.th}>
                                                Priority
                                            </th>

                                            <th style={styles.th}>
                                                Reason
                                            </th>

                                            <th style={styles.th}>
                                                Decision
                                            </th>

                                            <th style={styles.th}>
                                                Date
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {history.map((item) => (

                                            <tr
                                                key={item.id}
                                                style={styles.tr}
                                            >

                                                <td style={styles.td}>
                                                    #{item.id}
                                                </td>

                                                <td style={styles.td}>
                                                    <strong>
                                                        {item.warehouse}
                                                    </strong>
                                                </td>

                                                <td style={styles.td}>
                                                    {item.product}
                                                </td>

                                                <td
                                                    style={{
                                                        ...styles.td,
                                                        color:
                                                            Number(item.stock) <
                                                            Number(item.demand)
                                                                ? "#dc2626"
                                                                : "#16a34a",
                                                        fontWeight: "700"
                                                    }}
                                                >
                                                    {item.stock}
                                                </td>

                                                <td style={styles.td}>
                                                    {item.demand}
                                                </td>

                                                <td style={styles.td}>

                                                    <span
                                                        style={
                                                            styles.recommendationBadge
                                                        }
                                                    >
                                                        {item.recommendation}
                                                    </span>

                                                </td>

                                                <td style={styles.td}>

                                                    <span
                                                        style={{
                                                            ...styles.priorityBadge,
                                                            backgroundColor:
                                                                getPriorityColor(
                                                                    Number(
                                                                        item.priorityScore
                                                                    )
                                                                )
                                                        }}
                                                    >
                                                        {item.priorityScore}
                                                    </span>

                                                </td>

                                                <td style={styles.td}>
                                                    {item.reason}
                                                </td>

                                                <td style={styles.td}>

                                                    <span
                                                        style={{
                                                            ...styles.decisionBadge,
                                                            ...getDecisionStyle(
                                                                item.decision
                                                            )
                                                        }}
                                                    >

                                                        {item.decision ===
                                                        "ACCEPTED"
                                                            ? "✓ ACCEPTED"
                                                            : "✕ IGNORED"}

                                                    </span>

                                                </td>

                                                <td style={styles.td}>

                                                    {item.createdAt
                                                        ? new Date(
                                                            item.createdAt
                                                        ).toLocaleString()
                                                        : "-"}

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}


/* =========================
   STYLES
========================= */

const styles = {

    pageWrapper: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc"
    },

    mainContent: {
        flex: 1
    },

    container: {
        padding: "35px"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },

    smallTitle: {
        color: "#2563eb",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "1.5px",
        marginBottom: "8px"
    },

    title: {
        margin: "0",
        fontSize: "34px",
        color: "#0f172a"
    },

    subtitle: {
        color: "#64748b",
        fontSize: "15px",
        marginTop: "8px"
    },

    refreshButton: {
        border: "none",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "18px",
        marginBottom: "25px"
    },

    statCard: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow: "0 4px 15px rgba(15, 23, 42, 0.06)"
    },

    statIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "10px",
        backgroundColor: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },

    statLabel: {
        display: "block",
        color: "#64748b",
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "1px"
    },

    statNumber: {
        margin: "5px 0 0",
        color: "#0f172a",
        fontSize: "27px"
    },

    errorBox: {
        backgroundColor: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px"
    },

    tableCard: {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.07)",
        overflow: "hidden"
    },

    tableHeader: {
        padding: "22px 25px",
        borderBottom: "1px solid #e2e8f0"
    },

    tableTitle: {
        margin: "0",
        color: "#0f172a",
        fontSize: "20px"
    },

    tableSubtitle: {
        margin: "6px 0 0",
        color: "#64748b",
        fontSize: "13px"
    },

    tableWrapper: {
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "1200px"
    },

    th: {
        padding: "15px",
        textAlign: "left",
        backgroundColor: "#f8fafc",
        color: "#475569",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.5px",
        borderBottom: "1px solid #e2e8f0",
        whiteSpace: "nowrap"
    },

    tr: {
        borderBottom: "1px solid #f1f5f9"
    },

    td: {
        padding: "15px",
        color: "#334155",
        fontSize: "13px",
        verticalAlign: "middle"
    },

    recommendationBadge: {
        backgroundColor: "#eff6ff",
        color: "#1d4ed8",
        padding: "6px 10px",
        borderRadius: "15px",
        fontWeight: "600",
        whiteSpace: "nowrap"
    },

    priorityBadge: {
        color: "#ffffff",
        padding: "5px 9px",
        borderRadius: "15px",
        fontSize: "11px",
        fontWeight: "700"
    },

    decisionBadge: {
        padding: "6px 10px",
        borderRadius: "15px",
        fontSize: "10px",
        fontWeight: "700",
        whiteSpace: "nowrap"
    },

    loading: {
        textAlign: "center",
        padding: "50px",
        color: "#64748b",
        fontSize: "15px"
    },

    emptyState: {
        textAlign: "center",
        padding: "60px 20px",
        color: "#64748b"
    },

    emptyIcon: {
        fontSize: "40px",
        marginBottom: "10px"
    }

};

export default Reports;