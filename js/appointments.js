// My Appointments section: list + simulated consultation room
const doctorReplies = [
    "Thank you. How long have you had these symptoms?",
    "I see. Are you taking any medicines at the moment?",
    "Okay. Please drink plenty of fluids and get rest.",
    "I will send you a digital prescription after this consultation.",
];

document.addEventListener('DOMContentLoaded', () => {
    renderAppointments();
    initConsultationRoom();
});

// My Appointments
function renderAppointments() {
    const list = document.getElementById('appointment-list');

    if (appointments.length === 0) {
        list.innerHTML = `<p class="text-center muted">You have no appointments yet. <a href="#book">Book one now</a>.</p>`;
        return;
    }

    list.innerHTML = appointments.map(a => `
        <div class="appointment-card">
            <div>
                <h3>${a.doctorName} <small>(${a.specialty})</small></h3>
                <p><i class="fas fa-calendar" aria-hidden="true"></i> ${formatDate(a.date)} at ${a.time}
                   &nbsp;|&nbsp; ${a.mode} consultation</p>
                <p>Patient: ${escapeHTML(a.patient)}</p>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-primary btn-sm" onclick="openConsultation(${a.id})">Join</button>
                <button class="btn btn-outline btn-sm" onclick="cancelAppointment(${a.id})">Cancel</button>
            </div>
        </div>
    `).join('');
}

function cancelAppointment(id) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    appointments = appointments.filter(a => a.id !== id);
    saveAppointments();
    renderAppointments();
    showToast('Appointment cancelled.');
}

// Consultation Room (simulated)
let replyIndex = 0;
let callTimer = null;
let lastFocused = null;

function initConsultationRoom() {
    const modal = document.getElementById('consult-modal');

    document.getElementById('close-modal').addEventListener('click', closeConsultation);
    document.getElementById('end-call').addEventListener('click', () => {
        closeConsultation();
        showToast('Consultation ended. Prescription sent to your email.');
    });

    // Close with Escape key or by clicking the dark background
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.hidden) closeConsultation();
    });
    modal.addEventListener('click', e => {
        if (e.target === modal) closeConsultation();
    });

    document.getElementById('chat-form').addEventListener('submit', e => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        addMessage(text, 'patient');
        input.value = '';

        setTimeout(() => {
            addMessage(doctorReplies[replyIndex % doctorReplies.length], 'doctor');
            replyIndex++;
        }, 1000);
    });
}

function openConsultation(id) {
    const appt = appointments.find(a => a.id === id);
    const modal = document.getElementById('consult-modal');
    const status = document.getElementById('call-status');
    const icon = document.querySelector('#video-area i');

    lastFocused = document.activeElement;
    replyIndex = 0;
    document.getElementById('consult-title').textContent = `${appt.mode} Consultation - ${appt.doctorName}`;
    document.getElementById('chat-box').innerHTML = '';
    icon.className = appt.mode === 'Chat' ? 'fas fa-comments' : appt.mode === 'Audio' ? 'fas fa-phone-volume' : 'fas fa-user-doctor';
    status.textContent = 'Connecting to doctor...';

    modal.hidden = false;
    document.getElementById('chat-input').focus();

    clearTimeout(callTimer);
    callTimer = setTimeout(() => {
        status.textContent = `Connected with ${appt.doctorName}`;
        addMessage(`Hello ${appt.patient}, I am ${appt.doctorName}. How can I help you today?`, 'doctor');
    }, 1500);
}

function closeConsultation() {
    clearTimeout(callTimer);
    document.getElementById('consult-modal').hidden = true;
    if (lastFocused) lastFocused.focus();
}

function addMessage(text, sender) {
    const box = document.getElementById('chat-box');
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    msg.textContent = text;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}
