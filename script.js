document.addEventListener("DOMContentLoaded", function () {
    // Glow effect for hero title
    const glowEffect = document.getElementById("glowEffect");
    if (glowEffect) {
        document.addEventListener("mousemove", (e) => {
            const boundingBox = glowEffect.getBoundingClientRect();
            const x = e.clientX - boundingBox.left;
            const y = e.clientY - boundingBox.top;
            glowEffect.style.setProperty("--cursor-x", `${x}px`);
            glowEffect.style.setProperty("--cursor-y", `${y}px`);
        });
    }
});
