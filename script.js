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

// Cursor Blob Follow Effect
const cursorBlob = document.getElementById('cursor-blob');
if (cursorBlob) {
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;

        // Smooth follow animation
        cursorBlob.animate({
            transform: `translate(${clientX}px, ${clientY}px)`
        }, { duration: 3000, fill: "forwards" });
    });
}
