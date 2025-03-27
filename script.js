document.addEventListener("DOMContentLoaded", function () {
    // Load 3D Model
    const modelContainer = document.getElementById("model-container");
    if (modelContainer) {
        const iframe = document.createElement("iframe");
        iframe.src = "https://modelviewer.dev/examples/3d-model.glb"; // Replace with actual model URL
        iframe.style.width = "100%";
        iframe.style.height = "400px";
        iframe.style.border = "none";
        modelContainer.appendChild(iframe);
    }
});
