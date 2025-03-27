function sendMessage() {
    let userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;
    
    let chatBox = document.getElementById('chat-box');
    let userMessage = `<div class="message user-message">${userInput}</div>`;
    chatBox.innerHTML += userMessage;
    document.getElementById('user-input').value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
    
    fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: userInput})
    })
    .then(response => response.json())
    .then(data => {
        let botMessage = `<div class="message bot-message">${data.response}</div>`;
        chatBox.innerHTML += botMessage;
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => console.error('Error:', error));
}
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
