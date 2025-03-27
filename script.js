const backendUrl = "https://4f733bac-3889-43ea-9dc1-b2de6101b63f-00-2ns6wq4vt04d6.sisko.replit.dev";  // Your Replit backend URL

function sendMessage() {
    let userInput = document.getElementById('user-input').value.trim();
    if (userInput === '') return;

    let chatBox = document.getElementById('chat-box');

    // Append user message
    let userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerText = userInput;
    chatBox.appendChild(userMessage);

    // Clear input field
    document.getElementById('user-input').value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Send request to Replit backend
    fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.response) return;

        // Append bot response
        let botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.innerText = data.response;
        chatBox.appendChild(botMessage);

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => console.error('Fetch error:', error));
}
