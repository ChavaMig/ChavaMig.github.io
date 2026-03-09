// Smooth Scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Intersection Observer for scroll animations (fade in)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class to major elements and observe them
document.querySelectorAll('.section, .glass-panel, .timeline-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});


// Fetch GitHub Repositories Dynamically
async function fetchGitHubRepos() {
    const username = 'ChavaMig';
    const reposContainer = document.getElementById('github-repos');

    // Fallback data in case the API fails
    const fallbackRepos = [
        { name: 'Actividad-de-aprendizaje', description: 'Entornos de desarrollo', language: 'JavaScript', html_url: 'https://github.com/ChavaMig/Actividad-de-aprendizaje' },
        { name: 'PROYECTO', description: 'Entornos', language: 'JavaScript', html_url: 'https://github.com/ChavaMig/PROYECTO' },
        { name: 'AA_Datos', description: 'Acceso a datos project', language: 'Java', html_url: 'https://github.com/ChavaMig/AA_Datos' },
        { name: 'AA_AccesoDatos', description: 'Acceso a datos project', language: 'Java', html_url: 'https://github.com/ChavaMig/AA_AccesoDatos' }
    ];

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (!response.ok) throw new Error('Network response was not ok');
        const repos = await response.json();

        // Filter out forked or visually unappealing repos if necessary, or just take top 4
        const displayRepos = repos.slice(0, 4);
        renderRepos(displayRepos, reposContainer);
    } catch (error) {
        console.error('Error fetching GitHub repos, using fallback data:', error);
        renderRepos(fallbackRepos, reposContainer);
    }
}

function renderRepos(repos, container) {
    container.innerHTML = '';
    repos.forEach(repo => {
        // Assign colors based on language
        let langColor = '#8b949e';
        if (repo.language === 'JavaScript') langColor = '#f1e05a';
        else if (repo.language === 'Java') langColor = '#b07219';
        else if (repo.language === 'HTML') langColor = '#e34c26';
        else if (repo.language === 'CSS') langColor = '#563d7c';

        const repoHTML = `
            <a href="${repo.html_url}" target="_blank" class="repo-card glass-panel fade-in visible">
                <div class="repo-header">
                    <i class="far fa-folder-open"></i>
                    <span class="repo-title">${repo.name.replace(/-/g, ' ')}</span>
                </div>
                <p class="repo-desc">${repo.description || 'A repository by ChavaMig.'}</p>
                <div class="repo-meta">
                    ${repo.language ? `<span><span class="lang-dot" style="background-color: ${langColor}"></span>${repo.language}</span>` : ''}
                    ${repo.stargazers_count ? `<span><i class="far fa-star"></i> ${repo.stargazers_count}</span>` : ''}
                </div>
            </a>
        `;
        container.innerHTML += repoHTML;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubRepos();
});

// Interactive Particle Background (Space/Nodes effect)
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;

    // Mouse tracking
    let mouse = {
        x: null,
        y: null,
        radius: 150
    }

    window.addEventListener('mousemove', function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Resize canvas
    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // Particle Class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = x;
            this.baseY = y;
        }
        // Draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        // Check particle position, move, and draw
        update() {
            // Check if particle is still within canvas
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Check collision/distance between mouse and particle
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * 5;
                const directionY = forceDirectionY * force * 5;

                // Move particles away from mouse
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return slowly
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 20;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }

            // Base movement
            this.x += this.directionX * 0.5;
            this.y += this.directionY * 0.5;
            this.draw();
        }
    }

    // Create particle array
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.5;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            let color = 'rgba(139, 148, 158, 0.7)'; // Match text-secondary

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Draw lines connecting particles
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                    opacityValue = 1 - (distance / 20000);

                    // Highlight lines near mouse
                    let distToMouse = Math.sqrt(
                        Math.pow(mouse.x - particlesArray[a].x, 2) +
                        Math.pow(mouse.y - particlesArray[a].y, 2)
                    );

                    if (distToMouse < mouse.radius * 1.5) {
                        ctx.strokeStyle = `rgba(88, 166, 255, ${opacityValue})`;
                    } else {
                        ctx.strokeStyle = `rgba(139, 148, 158, ${opacityValue * 0.1})`;
                    }

                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    initParticles();
    animateParticles();
}
