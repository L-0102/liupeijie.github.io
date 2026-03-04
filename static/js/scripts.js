const content_dir = 'contents/';
const config_file = 'config.yml';
const sections = [
    { id: 'home' },
    { id: 'publications' },
    { id: 'experience' },
    { id: 'awards' },
];
const section_names = sections.map(s => s.id);
const THEME_STORAGE_KEY = 'site-theme';
let heroBackgroundInstance = null;

function getStoredTheme() {
    try {
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        if (value === 'light' || value === 'dark') {
            return value;
        }
    } catch (e) {
        console.log('Theme storage not available', e);
    }
    return 'light';
}

function setStoredTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
        console.log('Unable to persist theme', e);
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('bi-sun-fill', 'bi-moon-fill');
            icon.classList.add(theme === 'light' ? 'bi-sun-fill' : 'bi-moon-fill');
        }
        toggleBtn.setAttribute(
            'aria-label',
            theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
        );
    }
}

function initTheme() {
    const initialTheme = getStoredTheme();
    applyTheme(initialTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) {
        return;
    }

    toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        setStoredTheme(next);
    });
}

function initNav() {
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.forEach(responsiveNavItem => {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
}

function loadConfig() {
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log('Unknown id and value: ' + key + ',' + yml[key].toString());
                }
            });
        })
        .catch(error => console.log(error));
}

function initReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('reveal-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach(el => {
        if (!el.classList.contains('reveal-visible')) {
            observer.observe(el);
        }
    });
}

function initHeroTyping() {
    const el = document.querySelector('.hero-keywords');
    if (!el) {
        return;
    }
    const fullText = el.textContent.trim();
    if (!fullText) {
        return;
    }

    el.textContent = '';
    const textSpan = document.createElement('span');
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'hero-keywords-cursor';
    cursorSpan.textContent = '|';
    el.appendChild(textSpan);
    el.appendChild(cursorSpan);

    let index = 0;
    const delay = 70;

    function typeNext() {
        if (index <= fullText.length) {
            textSpan.textContent = fullText.slice(0, index);
            index += 1;
            window.setTimeout(typeNext, delay);
        } else {
            cursorSpan.classList.add('hero-keywords-cursor--blink');
        }
    }

    typeNext();
}

function initHeroBackground() {
    const section = document.querySelector('.top-section');
    if (!section || !window.VANTA || !window.THREE) {
        return;
    }

    if (heroBackgroundInstance && typeof heroBackgroundInstance.destroy === 'function') {
        heroBackgroundInstance.destroy();
        heroBackgroundInstance = null;
    }

    heroBackgroundInstance = window.VANTA.NET({
        el: section,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x3948d2,
        backgroundAlpha: 0.0,
        points: 10.0,
        maxDistance: 22.0,
        spacing: 16.0,
    });
}

function loadMarkdownSections() {
    marked.use({ mangle: false, headerIds: false });
    section_names.forEach(name => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                const container = document.getElementById(name + '-md');
                if (!container) {
                    return;
                }
                container.innerHTML = html;
                container.classList.add('reveal');
                if (name === 'experience') {
                    container.classList.add('experience-timeline');
                }
            })
            .then(() => {
                if (typeof MathJax !== 'undefined' && MathJax.typeset) {
                    MathJax.typeset();
                }
                initReveal();
            })
            .catch(error => console.log(error));
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    loadConfig();

    initHeroTyping();
    initHeroBackground();

    document.querySelectorAll('section header, #avatar img').forEach(el => {
        el.classList.add('reveal');
    });

    initReveal();
    loadMarkdownSections();
});
