from flask import Flask, request, jsonify, make_response
from flask_restx import Api, Resource, fields
from flask_cors import CORS  # Import CORS
import joblib
import numpy as np
import pandas as pd
import sys
import time

flask_app = Flask(__name__)
CORS(flask_app)  # Enable CORS for your Flask app

app = Api(
    app=flask_app,
    version="1.0",
    title="Mushroom Classifier",
    description="You can check whether your mushroom is edible or not by using Mushroom Classifier.",
)

name_space = app.namespace(
    "Mushroom Classifier", description="Can I eat this mushroom?"
)

model = app.model(
    "Prediction params",
    {
        "capColor": fields.String(
            required=True, description="Cap-color", help="Cap-color cannot be blank"
        ),
        "gillColor": fields.String(
            required=True, description="Gill-color", help="Gill-color cannot be blank"
        ),
        "ringType": fields.String(
            required=True, description="Ring-type", help="Ring-type cannot be blank"
        ),
        "stalkColorAbv": fields.String(
            required=False,
            description="Stalk-color-above-ring",
            help="Stalk-color-above-ring should be filled if ring exists.",
        ),
        "stalkColorAbv": fields.String(
            required=False,
            description="Stalk-color-above-ring",
            help="Stalk-color-above-ring should be filled if ring exists.",
        ),
        "stalkColorBlw": fields.String(
            required=False,
            description="Stalk-color-below-ring",
            help="Stalk-color-below-ring should be filled if ring exists.",
        ),
        "veilColor": fields.String(
            required=True,
            description="veil-color",
            help="Veil-color cannot be blank.",
        ),
        "bruise": fields.String(
            required=True,
            description="bruise",
            help="Bruise cannot be blank.",
        ),
    },
)

classifier = joblib.load("classifier.joblib")


@app.route("/", methods=["POST", "OPTIONS"])
class MainClass(Resource):
    def options(self):
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "*")
        return response

    @app.expect(model)
    def post(self):
        try:
            formData = request.json
            data = formData
            df = pd.read_csv("mushrooms.csv")
            X = df[
                [
                    "cap-color",
                    "bruises",
                    "gill-color",
                    "stalk-color-above-ring",
                    "stalk-color-below-ring",
                    "ring-type",
                    "veil-color",
                ]
            ]

            # Apply one-hot encoding to the categorical features
            X_encoded = pd.get_dummies(X)
            X_encoded.columns = X_encoded.columns.astype(str)

            # Apply one-hot encoding to the new data
            data_encoded = pd.get_dummies(pd.DataFrame([data], columns=X.columns))
            data_encoded = data_encoded.reindex(columns=X_encoded.columns, fill_value=0)

            print(data_encoded)

            # Make predictions
            prediction = classifier.predict(data_encoded)
            print("prediction: ", prediction[0])
            time.sleep(3)
            response = jsonify(
                {
                    "statusCode": 200,
                    "status": "Prediction made",
                    "result": prediction[0],
                }
            )
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
        except Exception as error:
            return jsonify(
                {
                    "statusCode": 500,
                    "status": "Could not make prediction",
                    "error": str(error),
                }
            )


if __name__ == "__main__":
    flask_app.run(debug=True)
