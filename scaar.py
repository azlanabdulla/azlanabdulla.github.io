from flask import Flask, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)

def analyze_image(image):
    # Dummy function to simulate object detection
    return "Phone, Water Bottle, Spectacles"  # Replace with actual detection logic

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['image']
    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    result = analyze_image(img)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
