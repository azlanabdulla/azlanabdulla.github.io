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

    // Navbar hide on scroll (optimized)
    let prevScrollpos = window.pageYOffset;
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            let currentScrollPos = window.pageYOffset;
            requestAnimationFrame(() => {
                navbar.style.top = prevScrollpos > currentScrollPos ? "0" : "-80px";
                prevScrollpos = currentScrollPos;
            });
        });
    }

    // Event card redirection
    const eventMappings = {
        '#eventImage1': 'workshop.html',
        '#eventImage2': 'autoshow.html',
        '#eventImage3': 'proshow.html',
        '.event-card1': 'workshop.html',
        '.event-card2': 'autoshow.html',
        '.event-card3': 'proshow.html'
    };
    
    Object.entries(eventMappings).forEach(([selector, url]) => {
        document.querySelectorAll(selector).forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => window.location.href = url);
        });
    });

    // Make images zoomable when clicked
    document.querySelectorAll(".event-card1 img, .event-card2 img, .event-card3 img").forEach(img => {
        img.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent triggering the card's click event
            this.classList.toggle("zoomed");
        });
    });

    // Hamburger menu toggle with fixed color
    const menuToggle = document.querySelector(".hamburger-menu");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle && navLinks) {
        menuToggle.style.color = "#ffcc00"; // Set color to ffcc00
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navLinks.classList.toggle("open");
        });
    }

    // Yellow line passing through menu item on hover/click
    document.querySelectorAll(".nav-links a").forEach(link => {
        const hoverEffect = () => link.classList.add("hovered");
        const removeEffect = () => link.classList.remove("hovered");
        link.addEventListener("mouseenter", hoverEffect);
        link.addEventListener("mouseleave", removeEffect);
        link.addEventListener("touchstart", () => {
            hoverEffect();
            setTimeout(removeEffect, 500);
        });
    });
});
