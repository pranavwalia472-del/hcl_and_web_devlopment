// Book section: 3-step booking wizard
document.addEventListener('DOMContentLoaded', initBookingWizard);

// Booking Wizard
function initBookingWizard() {
    const form = document.getElementById('booking-form');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const indicatorSteps = document.querySelectorAll('.step');
    const stepLabel = document.getElementById('step-label');
    const stepNames = ['Patient Details', 'Consultation Details', 'Confirm Appointment'];
    const doctorSelect = document.getElementById('doctor-select');
    const dateInput = document.getElementById('appt-date');
    let currentStep = 0;

    // Fill doctor dropdown
    doctorSelect.innerHTML = doctorData.map(d =>
        `<option value="${d.id}">${d.name} (${d.specialty}) - ${d.fee}</option>`
    ).join('');

    // Don't allow past dates
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    dateInput.min = today;
    dateInput.value = today;

    function goTo(step) {
        steps[currentStep].classList.remove('active');
        currentStep = step;
        steps[currentStep].classList.add('active');
        indicatorSteps.forEach((s, idx) => s.classList.toggle('active', idx <= currentStep));
        stepLabel.textContent = `Step ${currentStep + 1} of 3: ${stepNames[currentStep]}`;
        if (currentStep === 2) updateSummary();
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) goTo(currentStep + 1);
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => goTo(currentStep - 1));
    });

    function validateStep(step) {
        const fields = steps[step].querySelectorAll('[required]');
        const errorBox = document.getElementById(`error-${step + 1}`);
        let message = '';

        fields.forEach(f => {
            let ok = f.value.trim() !== '';
            if (ok && f.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
            if (ok && f.type === 'tel') ok = /^[0-9+\-\s]{7,15}$/.test(f.value);
            if (ok && f.type === 'date') ok = f.value >= today;

            f.classList.toggle('invalid', !ok);
            f.setAttribute('aria-invalid', !ok);
            if (!ok && !message) {
                message = `Please check the "${f.labels[0].textContent}" field.`;
                f.focus();
            }
        });

        if (errorBox) errorBox.textContent = message;
        return message === '';
    }

    function updateSummary() {
        const data = getFormData();
        document.getElementById('summary').innerHTML = `
            <p><strong>Patient:</strong> ${escapeHTML(data.name)}</p>
            <p><strong>Doctor:</strong> ${data.doctor.name} (${data.doctor.specialty})</p>
            <p><strong>Date &amp; Time:</strong> ${formatDate(data.date)} at ${data.time}</p>
            <p><strong>Type:</strong> ${data.mode} consultation</p>
            <p><strong>Fee:</strong> ${data.doctor.fee}</p>
            <p><strong>Symptoms:</strong> ${escapeHTML(data.symptoms)}</p>
        `;
    }

    function getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            symptoms: document.getElementById('symptoms').value.trim(),
            doctor: doctorData.find(d => d.id == doctorSelect.value),
            date: dateInput.value,
            time: document.getElementById('appt-time').value,
            mode: document.querySelector('input[name="mode"]:checked').value,
        };
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = getFormData();
        appointments.push({
            id: Date.now(),
            patient: data.name,
            doctorName: data.doctor.name,
            specialty: data.doctor.specialty,
            date: data.date,
            time: data.time,
            mode: data.mode,
        });
        saveAppointments();
        renderAppointments();

        // Start a fresh booking and take the patient to their appointments
        form.reset();
        dateInput.value = today;
        goTo(0);
        document.getElementById('appointments').scrollIntoView();
        showToast('Appointment booked! See it in My Appointments.');
    });
}

// Called by "Book Consultation" on a doctor card
function selectDoctor(id) {
    const doctorSelect = document.getElementById('doctor-select');
    if (doctorData.some(d => d.id == id)) {
        doctorSelect.value = id;
        showToast('Doctor selected. Please fill in your details.');
    }
}
