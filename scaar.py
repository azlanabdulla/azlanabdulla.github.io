from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# Simple AI chatbot logic
def chatbot_response(user_input):
    responses = {
        "hello": "Hello! How can I assist you today?",
        "hi": "Hi there!",
        "how are you": "I'm just a bot, but I'm here to help!",
        "bye": "Goodbye! Have a great day!"
    }
    return responses.get(user_input.lower(), "I'm not sure how to respond to that.")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    print("Received:", data)  # Debugging
    user_message = data.get('message', '')
    response = chatbot_response(user_message)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
