document.addEventListener('DOMContentLoaded', function() {
    // Glow effect for hero title
    const glowEffect = document.getElementById("glowEffect");

    document.addEventListener("mousemove", (e) => {
        const boundingBox = glowEffect.getBoundingClientRect();
        const x = e.clientX - boundingBox.left;
        const y = e.clientY - boundingBox.top;

        glowEffect.style.setProperty("--cursor-x", `${x}px`);
        glowEffect.style.setProperty("--cursor-y", `${y}px`);
    });

    // Navbar hide on scroll
    let prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
        let currentScrollPos = window.pageYOffset;
        document.querySelector(".navbar").style.top = prevScrollpos > currentScrollPos ? "0" : "-80px";
        prevScrollpos = currentScrollPos;
    };

    // Make event cards clickable with respective pages
    const eventMappings = {
        '#eventImage1': 'workshop.html',
        '#eventImage2': 'autoshow.html',
        '#eventImage3': 'proshow.html',
        '.event-card1': 'workshop.html',
        '.event-card2': 'autoshow.html',
        '.event-card3': 'proshow.html'
    };

    Object.keys(eventMappings).forEach(selector => {
        document.querySelectorAll(selector).forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                window.location.href = eventMappings[selector];
            });
        });
    });

    // Make images zoomable when clicked
    document.querySelectorAll(".event-card1 img, .event-card2 img, .event-card3 img").forEach(img => {
        img.addEventListener("click", function(e) {
            e.stopPropagation(); // Prevent triggering the card's click event
            this.classList.toggle("zoomed");
        });
    });
});
