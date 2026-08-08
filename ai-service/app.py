from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "NetworkIQ AI Service Running"

@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()

    stock = data["stock"]
    demand = data["demand"]
    transfer_cost = data["transferCost"]

    shortage = max(0, demand - stock)

    priority_score = (demand * 2) + (shortage * 3) - transfer_cost

    if stock < 30:
        recommendation = {
            "recommendation": "Transfer Stock",
            "priorityScore": priority_score,
            "reason": "Low stock detected"
        }
    else:
        recommendation = {
            "recommendation": "No Transfer Needed",
            "priorityScore": priority_score,
            "reason": "Stock level is sufficient"
        }

    return jsonify(recommendation)

if __name__ == "__main__":
    app.run(debug=True)