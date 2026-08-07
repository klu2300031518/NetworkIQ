from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/recommend", methods=["GET"])
def recommend():

    recommendation = {
        "product": "Milk",
        "from": "Hyderabad",
        "to": "Bangalore",
        "quantity": 50,
        "reason": "Low stock detected in Bangalore"
    }

    return jsonify(recommendation)

if __name__ == "__main__":
    app.run(port=5000, debug=True)