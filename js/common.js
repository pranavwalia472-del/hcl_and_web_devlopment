// --- Shared by every section of the page ---
// Data Mockups
const doctorData = [
    { id: 1, name: "Dr. Emma Clarke", specialty: "General", experience: 10, rating: 4.8, fee: "£30", online: true },
    { id: 2, name: "Dr. James Patel", specialty: "Cardiology", experience: 15, rating: 4.9, fee: "£75", online: true },
    { id: 3, name: "Dr. Olivia Hughes", specialty: "Dermatology", experience: 8, rating: 4.7, fee: "£55", online: false },
    { id: 4, name: "Dr. Oliver Bennett", specialty: "Paediatrics", experience: 12, rating: 4.8, fee: "£50", online: true },
    { id: 5, name: "Dr. Sophie Walker", specialty: "General", experience: 6, rating: 4.6, fee: "£30", online: true },
    { id: 6, name: "Dr. Harry Thompson", specialty: "Cardiology", experience: 20, rating: 4.9, fee: "£90", online: false },
];

let appointments = loadAppointments();

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initScrollSpy();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', open);
    });

    // Close the mobile menu after jumping to a section
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Highlight the menu link of the section currently on screen
function initScrollSpy() {
    const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    if (sections.length === 0) return;

    function update() {
        const y = window.scrollY + 120;
        let current = sections[0];
        sections.forEach(s => { if (s.offsetTop <= y) current = s; });
        // At the very bottom, the last (short) section is the current one
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
            current = sections[sections.length - 1];
        }
        links.forEach(l => {
            const on = l.getAttribute('href') === '#' + current.id;
            l.classList.toggle('active', on);
            if (on) l.setAttribute('aria-current', 'location');
            else l.removeAttribute('aria-current');
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

function getInitials(name) {
    return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('');
}

// --- Helpers ---
function loadAppointments() {
    try {
        return JSON.parse(localStorage.getItem('appointments')) || [];
    } catch {
        return [];
    }
}

function saveAppointments() {
    try {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    } catch {
        // Storage not available - appointments stay for this visit only
    }
}

function formatDate(dateStr) {
    return new Date(dateStr + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Toast Notification
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => toast.classList.remove('show'), 3000);
}
