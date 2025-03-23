// script.js
async function askNeoSphere() {
    const question = document.getElementById("question").value;
    
    if (!question) {
        alert("Please enter a question!");
        return;
    }
    
    const response = await fetch("http://127.0.0.1:8000/ask/?question=" + encodeURIComponent(question));
    const data = await response.json();
    
    document.getElementById("response").innerText = "NeoSphere: " + data.answer;
}
