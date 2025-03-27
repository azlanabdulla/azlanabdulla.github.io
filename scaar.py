from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def chatbot_response(user_input):
    responses = {
        "hello": "Hello! How can I assist you today?",
        "how are you": "I'm just a bot, but I'm functioning perfectly!",
        "your name": "I'm SCAAR, your AI assistant.",
        "bye": "Goodbye! Have a great day!"
    }
    return responses.get(user_input.lower(), "I'm not sure about that, but I'm learning!")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    response = chatbot_response(user_message)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
