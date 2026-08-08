import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Inventory() {
    const [inventory, setInventory] = useState([]);

    const [form, setForm] = useState({
        warehouse: "",
        product: "",
        stock: "",
        demand: "",
        transferCost: ""
    });

    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            const response = await API.get("/inventory");
            setInventory(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addInventory = async (e) => {
        e.preventDefault();

        try {
            await API.post("/inventory", {
                warehouse: form.warehouse,
                product: form.product,
                stock: Number(form.stock),
                demand: Number(form.demand),
                transferCost: Number(form.transferCost)
            });

            setMessage("Inventory added successfully.");

            setForm({
                warehouse: "",
                product: "",
                stock: "",
                demand: "",
                transferCost: ""
            });

            setShowForm(false);

            loadInventory();

        } catch (error) {
            console.log(error);
            setMessage("Failed to add inventory.");
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            <Sidebar />

            <div style={{ flex: 1 }}>

                <Navbar />

                <div style={{ padding: "30px" }}>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <h1 style={{ marginBottom: "5px" }}>
                                Inventory Management
                            </h1>

                            <p style={{ color: "#64748b" }}>
                                Manage warehouse inventory and stock information.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                backgroundColor: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            {showForm ? "Close Form" : "+ Add Inventory"}
                        </button>
                    </div>

                    {message && (
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "15px",
                                backgroundColor: "#eff6ff",
                                color: "#1d4ed8",
                                borderRadius: "8px"
                            }}
                        >
                            {message}
                        </div>
                    )}

                    {showForm && (
                        <form
                            onSubmit={addInventory}
                            style={{
                                marginTop: "25px",
                                padding: "25px",
                                backgroundColor: "#ffffff",
                                borderRadius: "12px",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                            }}
                        >

                            <h2>Add New Inventory</h2>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: "15px",
                                    marginTop: "20px"
                                }}
                            >

                                <input
                                    type="text"
                                    name="warehouse"
                                    placeholder="Warehouse"
                                    value={form.warehouse}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="product"
                                    placeholder="Product"
                                    value={form.product}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />

                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="Stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />

                                <input
                                    type="number"
                                    name="demand"
                                    placeholder="Demand"
                                    value={form.demand}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />

                                <input
                                    type="number"
                                    name="transferCost"
                                    placeholder="Transfer Cost"
                                    value={form.transferCost}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />

                            </div>

                            <button
                                type="submit"
                                style={{
                                    marginTop: "20px",
                                    backgroundColor: "#16a34a",
                                    color: "white",
                                    border: "none",
                                    padding: "12px 25px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}
                            >
                                Save Inventory
                            </button>

                        </form>
                    )}

                    <div
                        style={{
                            marginTop: "30px",
                            backgroundColor: "white",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.06)"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead>

                                <tr style={{ backgroundColor: "#f8fafc" }}>

                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Warehouse</th>
                                    <th style={thStyle}>Product</th>
                                    <th style={thStyle}>Stock</th>
                                    <th style={thStyle}>Demand</th>
                                    <th style={thStyle}>Transfer Cost</th>

                                </tr>

                            </thead>

                            <tbody>

                                {inventory.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="6"
                                            style={{
                                                textAlign: "center",
                                                padding: "30px",
                                                color: "#64748b"
                                            }}
                                        >
                                            No inventory found.
                                        </td>
                                    </tr>

                                ) : (

                                    inventory.map(item => (

                                        <tr key={item.id}>

                                            <td style={tdStyle}>{item.id}</td>

                                            <td style={tdStyle}>
                                                {item.warehouse}
                                            </td>

                                            <td style={tdStyle}>
                                                {item.product}
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight: "600",
                                                    color:
                                                        item.stock < item.demand
                                                            ? "#dc2626"
                                                            : "#16a34a"
                                                }}
                                            >
                                                {item.stock}
                                            </td>

                                            <td style={tdStyle}>
                                                {item.demand}
                                            </td>

                                            <td style={tdStyle}>
                                                {item.transferCost}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

const inputStyle = {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "14px",
    outline: "none"
};

const thStyle = {
    padding: "15px",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
    color: "#475569"
};

const tdStyle = {
    padding: "15px",
    borderBottom: "1px solid #e2e8f0"
};

export default Inventory;