from flask import Flask, request, jsonify
from flask_cors import CORS

import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the SVM classifier model
with open('model_final.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Load the pre-trained scaler
with open('scaler.pkl', 'rb') as scaler_file:
    sc_X = pickle.load(scaler_file)

@app.route('/predict', methods=['POST'])
def predict_forest_fire():
    try:
        # Get input data from the POST request
        data = request.get_json()
        print("Recieved Data")

        # Extract input features
        temperature = data['temperature']
        humidity = data['humidity']
        wind_speed = data['windSpeed']
        wind_degree = data['windDegree']

       

        # Preprocess the input features using the pre-trained scaler
        input_features = np.array([[temperature, humidity, wind_speed, wind_degree]])
        
        
        input_features = sc_X.transform(input_features)

        # Make predictions using the loaded SVM model
        class_probabilities = model.predict_proba(input_features)

        # The first element of class_probabilities is the probability of class 0 (No forest fire)
        # The second element is the probability of class 1 (Forest fire)
        print(class_probabilities[0][1])
        forest_fire_probability = class_probabilities[0][1] * 100  # Convert to percentage



        # Return the forest fire probability as JSON response
        response_data = {'chance': forest_fire_probability}
        return jsonify(response_data)

    except Exception as e:
        error_message = str(e)
        print("Error: ", error_message)
        return jsonify({'error': error_message}), 400

if __name__ == '__main__':
    app.run(debug=True)