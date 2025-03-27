function sendMessage() {
    let userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;
    
    let chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
    document.getElementById('user-input').value = '';
    
    fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: userInput})
    })
    .then(response => response.json())
    .then(data => {
        chatBox.innerHTML += `<p><strong>SCAAR:</strong> ${data.response}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => console.error('Error:', error));
}
