function processImage() {
    const imageUpload = document.getElementById('imageUpload').files[0];
    if (!imageUpload) {
        alert('Please select an image first.');
        return;
    }
    const formData = new FormData();
    formData.append('image', imageUpload);
    
    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('output').innerText = 'Detected: ' + data.result;
    })
    .catch(error => console.error('Error:', error));
}
