// Doctors section: list with filter + search
document.addEventListener('DOMContentLoaded', initDoctors);

// Render Doctors with filter + search
function initDoctors() {
    const container = document.getElementById('doctor-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchBox = document.getElementById('doctor-search');
    let currentFilter = 'all';

    function displayDoctors() {
        const term = searchBox.value.toLowerCase().trim();
        const list = doctorData.filter(d =>
            (currentFilter === 'all' || d.specialty === currentFilter) &&
            d.name.toLowerCase().includes(term)
        );

        if (list.length === 0) {
            container.innerHTML = `<p class="empty-msg">No doctors found. Try another name or specialty.</p>`;
            return;
        }

        container.innerHTML = list.map(doc => `
            <div class="doctor-card">
                <div class="avatar" aria-hidden="true">${getInitials(doc.name)}</div>
                <h3>${doc.name}</h3>
                <p class="specialty">${doc.specialty}</p>
                <p class="doctor-meta">
                    <i class="fas fa-star" aria-hidden="true"></i> ${doc.rating} &nbsp;|&nbsp;
                    ${doc.experience} yrs exp &nbsp;|&nbsp; ${doc.fee}
                </p>
                <span class="badge ${doc.online ? 'online' : 'offline'}">${doc.online ? 'Available Now' : 'Busy - Book Later'}</span><br>
                <a class="btn btn-primary btn-sm" href="#book" data-doctor="${doc.id}">Book Consultation</a>
            </div>
        `).join('');
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentFilter = btn.dataset.filter;
            displayDoctors();
        });
    });

    searchBox.addEventListener('input', displayDoctors);

    // "Book Consultation" selects that doctor in the booking form below
    container.addEventListener('click', e => {
        const link = e.target.closest('[data-doctor]');
        if (link) selectDoctor(link.dataset.doctor);
    });
    displayDoctors();
}
