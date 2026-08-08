import React, { useEffect, useState } from "react";
import API from "../services/api";

function Recommendation() {

    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [inventory, setInventory] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState(null);

    // =========================
    // LOAD INVENTORY
    // =========================
    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {

            const response = await API.get("/inventory");

            const data = response.data || [];

            setInventory(data);

            if (data.length > 0) {

                // Automatically select item with highest shortage
                const item = [...data].sort(
                    (a, b) =>
                        (Number(b.demand) - Number(b.stock)) -
                        (Number(a.demand) - Number(a.stock))
                )[0];

                setSelectedInventory(item);

            } else {

                setMessage("No inventory available for analysis.");
                setMessageType("error");
            }

        } catch (error) {

            console.error("Inventory loading error:", error);

            setMessage(
                "Unable to load inventory. Please make sure Spring Boot is running."
            );

            setMessageType("error");
        }
    };


    // =========================
    // GENERATE AI RECOMMENDATION
    // =========================
    const generateRecommendation = async () => {

        if (!selectedInventory) {

            setMessage("Please select an inventory item first.");
            setMessageType("error");

            return;
        }

        setLoading(true);
        setMessage("");
        setRecommendation(null);

        try {

            const response = await fetch(
                "http://localhost:8082/api/inventory/recommend",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        warehouse:
                            selectedInventory.warehouse,

                        product:
                            selectedInventory.product,

                        stock:
                            Number(selectedInventory.stock),

                        demand:
                            Number(selectedInventory.demand),

                        transferCost:
                            Number(selectedInventory.transferCost)

                    })
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to generate recommendation"
                );
            }

            const data = await response.json();

            setRecommendation(data);

            setMessage(
                "AI recommendation generated successfully."
            );

            setMessageType("success");

        } catch (error) {

            console.error(
                "Recommendation error:",
                error
            );

            setMessage(
                "Unable to generate recommendation. Please make sure the Spring Boot backend and Python AI service are running."
            );

            setMessageType("error");

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // SELECT INVENTORY
    // =========================
    const handleInventoryChange = (e) => {

        const id = Number(e.target.value);

        const item = inventory.find(
            (inventoryItem) =>
                Number(inventoryItem.id) === id
        );

        setSelectedInventory(item || null);

        setRecommendation(null);
        setMessage("");
        setMessageType("");
    };


    // =========================
    // SAVE RECOMMENDATION
    // =========================
    const saveRecommendation = async (decision) => {

        if (!recommendation || !selectedInventory) {

            setMessage(
                "Please generate a recommendation first."
            );

            setMessageType("error");

            return;
        }

        setSaving(true);
        setMessage("");

        try {

            const requestData = {

                warehouse:
                    selectedInventory.warehouse,

                product:
                    selectedInventory.product,

                stock:
                    Number(selectedInventory.stock),

                demand:
                    Number(selectedInventory.demand),

                transferCost:
                    Number(selectedInventory.transferCost),

                recommendation:
                    recommendation.recommendation,

                priorityScore:
                    Number(recommendation.priorityScore),

                reason:
                    recommendation.reason,

                decision:
                    decision

            };

            console.log(
                "Saving recommendation:",
                requestData
            );

            const response = await API.post(
                "/recommendations/history",
                requestData
            );

            console.log(
                "Recommendation saved successfully:",
                response.data
            );

            if (decision === "ACCEPTED") {

                setMessage(
                    "Recommendation accepted and saved successfully."
                );

            } else {

                setMessage(
                    "Recommendation ignored and saved successfully."
                );
            }

            setMessageType("success");

        } catch (error) {

            console.error(
                "Error saving recommendation:",
                error
            );

            if (error.response) {

                console.error(
                    "Server response:",
                    error.response.data
                );

                setMessage(
                    "Failed to save recommendation: " +
                    (
                        error.response.data?.message ||
                        "Server error"
                    )
                );

            } else {

                setMessage(
                    "Failed to save recommendation. Please check that Spring Boot is running."
                );
            }

            setMessageType("error");

        } finally {

            setSaving(false);
        }
    };


    // =========================
    // PRIORITY COLOR
    // =========================
    const getPriorityColor = (score) => {

        if (score >= 300)
            return "#dc2626";

        if (score >= 150)
            return "#f59e0b";

        return "#16a34a";
    };


    return (

        <div style={styles.page}>

            {/* =========================
                HEADER
            ========================= */}

            <div style={styles.headerSection}>

                <div>

                    <div style={styles.smallTitle}>
                        ARTIFICIAL INTELLIGENCE
                    </div>

                    <h1 style={styles.title}>
                        AI Recommendation
                    </h1>

                    <p style={styles.subtitle}>
                        Intelligent inventory decisions powered by the NetworkIQ AI engine.
                    </p>

                </div>

                <div style={styles.aiBadge}>
                    🤖 AI ENGINE
                </div>

            </div>


            {/* =========================
                INVENTORY ANALYSIS CARD
            ========================= */}

            <div style={styles.inputCard}>

                <div>

                    <h2 style={styles.cardTitle}>
                        Inventory Analysis
                    </h2>

                    <p style={styles.cardDescription}>
                        Select an inventory item and generate an AI-powered recommendation.
                    </p>

                </div>


                {/* INVENTORY SELECTOR */}

                <div style={styles.selectorContainer}>

                    <label style={styles.selectorLabel}>
                        Select Inventory
                    </label>

                    <select
                        value={
                            selectedInventory
                                ? selectedInventory.id
                                : ""
                        }
                        onChange={handleInventoryChange}
                        style={styles.select}
                    >

                        <option value="">
                            Select inventory
                        </option>

                        {inventory.map((item) => (

                            <option
                                key={item.id}
                                value={item.id}
                            >

                                {item.warehouse} -{" "}
                                {item.product} -
                                Stock: {item.stock} -
                                Demand: {item.demand}

                            </option>

                        ))}

                    </select>

                </div>


                {/* INVENTORY INFORMATION */}

                {selectedInventory && (

                    <div style={styles.dataGrid}>

                        <div style={styles.dataBox}>

                            <span style={styles.dataLabel}>
                                Warehouse
                            </span>

                            <strong>
                                {selectedInventory.warehouse}
                            </strong>

                        </div>


                        <div style={styles.dataBox}>

                            <span style={styles.dataLabel}>
                                Product
                            </span>

                            <strong>
                                {selectedInventory.product}
                            </strong>

                        </div>


                        <div style={styles.dataBox}>

                            <span style={styles.dataLabel}>
                                Current Stock
                            </span>

                            <strong
                                style={{
                                    color:
                                        Number(selectedInventory.stock) <
                                        Number(selectedInventory.demand)
                                            ? "#dc2626"
                                            : "#16a34a"
                                }}
                            >

                                {selectedInventory.stock}

                            </strong>

                        </div>


                        <div style={styles.dataBox}>

                            <span style={styles.dataLabel}>
                                Demand
                            </span>

                            <strong>
                                {selectedInventory.demand}
                            </strong>

                        </div>


                        <div style={styles.dataBox}>

                            <span style={styles.dataLabel}>
                                Transfer Cost
                            </span>

                            <strong>
                                {selectedInventory.transferCost}
                            </strong>

                        </div>

                    </div>

                )}


                {/* GENERATE BUTTON */}

                <button
                    onClick={generateRecommendation}
                    disabled={
                        loading ||
                        !selectedInventory
                    }
                    style={
                        loading ||
                        !selectedInventory
                            ? styles.disabledButton
                            : styles.generateButton
                    }
                >

                    {loading
                        ? "🤖 Analyzing..."
                        : "🤖 Generate AI Recommendation"}

                </button>

            </div>


            {/* =========================
                MESSAGE
            ========================= */}

            {message && (

                <div
                    style={
                        messageType === "success"
                            ? styles.successMessage
                            : styles.errorBox
                    }
                >

                    {messageType === "success"
                        ? "✓ "
                        : "⚠️ "}

                    {message}

                </div>

            )}


            {/* =========================
                RECOMMENDATION RESULT
            ========================= */}

            {recommendation && (

                <div style={styles.resultCard}>

                    <div style={styles.resultHeader}>

                        <div>

                            <div style={styles.smallTitle}>
                                AI ANALYSIS COMPLETE
                            </div>

                            <h2 style={styles.resultTitle}>
                                Recommendation Result
                            </h2>

                        </div>

                        <div style={styles.successBadge}>
                            ✓ Generated
                        </div>

                    </div>


                    {/* RECOMMENDATION */}

                    <div style={styles.recommendationBox}>

                        <div style={styles.robotIcon}>
                            🤖
                        </div>

                        <div>

                            <span style={styles.dataLabel}>
                                RECOMMENDATION
                            </span>

                            <h2 style={styles.recommendationText}>
                                {recommendation.recommendation}
                            </h2>

                        </div>

                    </div>


                    {/* SCORE AND REASON */}

                    <div style={styles.resultGrid}>

                        <div style={styles.scoreCard}>

                            <span style={styles.dataLabel}>
                                PRIORITY SCORE
                            </span>

                            <div style={styles.scoreRow}>

                                <strong style={styles.score}>
                                    {recommendation.priorityScore}
                                </strong>

                                <span
                                    style={{
                                        ...styles.priorityBadge,

                                        backgroundColor:
                                            getPriorityColor(
                                                Number(
                                                    recommendation.priorityScore
                                                )
                                            )
                                    }}
                                >

                                    {Number(
                                        recommendation.priorityScore
                                    ) >= 300
                                        ? "HIGH"
                                        : Number(
                                            recommendation.priorityScore
                                        ) >= 150
                                            ? "MEDIUM"
                                            : "LOW"}

                                </span>

                            </div>


                            <div style={styles.progressBackground}>

                                <div
                                    style={{
                                        ...styles.progress,

                                        width: `${Math.min(
                                            (
                                                Number(
                                                    recommendation.priorityScore
                                                ) / 500
                                            ) * 100,
                                            100
                                        )}%`,

                                        backgroundColor:
                                            getPriorityColor(
                                                Number(
                                                    recommendation.priorityScore
                                                )
                                            )
                                    }}
                                >

                                </div>

                            </div>

                        </div>


                        <div style={styles.reasonCard}>

                            <span style={styles.dataLabel}>
                                AI REASON
                            </span>

                            <p style={styles.reason}>
                                ⚠️ {recommendation.reason}
                            </p>

                        </div>

                    </div>


                    {/* =========================
                        RECOMMENDED ACTION
                    ========================= */}

                    <div style={styles.decisionSection}>

                        <h3>
                            Recommended Action
                        </h3>

                        <div style={styles.actionRow}>

                            {/* ACCEPT */}

                            <button
                                style={
                                    saving
                                        ? styles.disabledAcceptButton
                                        : styles.acceptButton
                                }
                                disabled={saving}
                                onClick={() =>
                                    saveRecommendation(
                                        "ACCEPTED"
                                    )
                                }
                            >

                                {saving
                                    ? "Saving..."
                                    : "✓ Accept Recommendation"}

                            </button>


                            {/* IGNORE */}

                            <button
                                style={
                                    saving
                                        ? styles.disabledIgnoreButton
                                        : styles.ignoreButton
                                }
                                disabled={saving}
                                onClick={() =>
                                    saveRecommendation(
                                        "IGNORED"
                                    )
                                }
                            >

                                {saving
                                    ? "Saving..."
                                    : "✕ Ignore"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}


/* =========================
   STYLES
========================= */

const styles = {

    page: {
        padding: "35px",
        backgroundColor: "#f8fafc",
        minHeight: "calc(100vh - 80px)",
        boxSizing: "border-box"
    },


    headerSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },


    smallTitle: {
        fontSize: "12px",
        fontWeight: "700",
        color: "#2563eb",
        letterSpacing: "1.5px",
        marginBottom: "8px"
    },


    title: {
        margin: "0",
        fontSize: "36px",
        color: "#0f172a"
    },


    subtitle: {
        color: "#64748b",
        fontSize: "16px",
        marginTop: "8px"
    },


    aiBadge: {
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        padding: "12px 18px",
        borderRadius: "25px",
        fontWeight: "700",
        fontSize: "13px"
    },


    inputCard: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.08)",
        marginBottom: "25px"
    },


    cardTitle: {
        margin: "0",
        color: "#0f172a",
        fontSize: "22px"
    },


    cardDescription: {
        color: "#64748b",
        marginTop: "8px"
    },


    selectorContainer: {
        marginTop: "25px",
        marginBottom: "20px"
    },


    selectorLabel: {
        display: "block",
        fontSize: "12px",
        color: "#475569",
        fontWeight: "700",
        marginBottom: "8px"
    },


    select: {
        width: "100%",
        padding: "13px",
        borderRadius: "9px",
        border: "1px solid #cbd5e1",
        backgroundColor: "#ffffff",
        fontSize: "15px",
        color: "#0f172a",
        cursor: "pointer"
    },


    dataGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "15px",
        marginTop: "25px",
        marginBottom: "25px"
    },


    dataBox: {
        backgroundColor: "#f8fafc",
        padding: "18px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    },


    dataLabel: {
        fontSize: "11px",
        color: "#64748b",
        fontWeight: "700",
        letterSpacing: "1px"
    },


    generateButton: {
        backgroundColor: "#2563eb",
        color: "#ffffff",
        border: "none",
        padding: "14px 24px",
        borderRadius: "9px",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer"
    },


    disabledButton: {
        backgroundColor: "#94a3b8",
        color: "#ffffff",
        border: "none",
        padding: "14px 24px",
        borderRadius: "9px",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "not-allowed"
    },


    errorBox: {
        backgroundColor: "#fef2f2",
        color: "#b91c1c",
        padding: "18px",
        borderRadius: "10px",
        marginBottom: "25px",
        border: "1px solid #fecaca"
    },


    successMessage: {
        backgroundColor: "#f0fdf4",
        color: "#15803d",
        padding: "18px",
        borderRadius: "10px",
        marginBottom: "25px",
        border: "1px solid #bbf7d0",
        fontWeight: "600"
    },


    resultCard: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.08)"
    },


    resultHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
    },


    resultTitle: {
        margin: "0",
        color: "#0f172a",
        fontSize: "26px"
    },


    successBadge: {
        backgroundColor: "#dcfce7",
        color: "#15803d",
        padding: "8px 14px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "13px"
    },


    recommendationBox: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        backgroundColor: "#eff6ff",
        border: "1px solid #bfdbfe",
        padding: "22px",
        borderRadius: "12px",
        marginBottom: "20px"
    },


    robotIcon: {
        fontSize: "38px"
    },


    recommendationText: {
        margin: "7px 0 0",
        color: "#1d4ed8",
        fontSize: "24px"
    },


    resultGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
    },


    scoreCard: {
        padding: "22px",
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0"
    },


    scoreRow: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginTop: "10px"
    },


    score: {
        fontSize: "34px",
        color: "#0f172a"
    },


    priorityBadge: {
        color: "#ffffff",
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "11px",
        fontWeight: "700"
    },


    progressBackground: {
        height: "10px",
        backgroundColor: "#e2e8f0",
        borderRadius: "10px",
        marginTop: "15px",
        overflow: "hidden"
    },


    progress: {
        height: "100%",
        borderRadius: "10px"
    },


    reasonCard: {
        padding: "22px",
        backgroundColor: "#fff7ed",
        borderRadius: "12px",
        border: "1px solid #fed7aa"
    },


    reason: {
        fontSize: "17px",
        color: "#9a3412",
        marginTop: "15px"
    },


    decisionSection: {
        marginTop: "25px",
        paddingTop: "20px",
        borderTop: "1px solid #e2e8f0"
    },


    actionRow: {
        display: "flex",
        gap: "12px",
        marginTop: "15px"
    },


    acceptButton: {
        backgroundColor: "#16a34a",
        color: "#ffffff",
        border: "none",
        padding: "12px 20px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: "pointer"
    },


    disabledAcceptButton: {
        backgroundColor: "#86efac",
        color: "#ffffff",
        border: "none",
        padding: "12px 20px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: "not-allowed"
    },


    ignoreButton: {
        backgroundColor: "#ffffff",
        color: "#64748b",
        border: "1px solid #cbd5e1",
        padding: "12px 20px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: "pointer"
    },


    disabledIgnoreButton: {
        backgroundColor: "#f1f5f9",
        color: "#94a3b8",
        border: "1px solid #cbd5e1",
        padding: "12px 20px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: "not-allowed"
    }

};


export default Recommendation;