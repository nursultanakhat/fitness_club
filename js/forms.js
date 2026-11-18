/* A single owner for each demo form prevents duplicate timers and submissions. */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    const V = window.AtlasValidation;
    function setup(formId, ids, statusId, training) {
        const form = document.getElementById(formId);
        if (!form) return;
        let busy = false;
        let timer;
        const status = document.getElementById(statusId);
        const button = form.querySelector('[type="submit"]');
        const originalLabel = button.innerHTML;
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (busy) return;
            const name = document.getElementById(ids.name);
            const email = document.getElementById(ids.email);
            const phone = document.getElementById(ids.phone);
            const checks = [
                V.field(name, V.name(name.value) ? '' : 'Enter your full name (at least 2 characters).'),
                V.field(email, V.email(email.value) ? '' : 'Enter a valid email address.'),
                V.field(phone, V.phone(phone.value) ? '' : 'Enter 10–15 digits; a leading +, spaces, parentheses and hyphens are allowed.')
            ];
            status.className = 'small mt-3 text-danger';
            if (checks.includes(false)) {
                status.textContent = 'Please correct the highlighted fields.';
                form.querySelector('.is-invalid').focus();
                return;
            }
            try {
                V.saveBooking({ name: name.value.trim(), email: email.value.trim(), phone: phone.value.trim(), training: training() });
            } catch (error) {
                status.textContent = error.message;
                return;
            }
            busy = true;
            button.disabled = true;
            form.setAttribute('aria-busy', 'true');
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Please wait...';
            status.className = 'small mt-3 text-secondary';
            status.textContent = 'Saving your demo request...';
            timer = setTimeout(function () {
                busy = false;
                button.disabled = false;
                button.innerHTML = originalLabel;
                form.removeAttribute('aria-busy');
                status.className = 'small mt-3 text-success';
                status.textContent = 'Demo booking saved on this device. No booking has been sent to the club.';
                const selectedTrainer = document.getElementById('selectedTrainer');
                const trainer = selectedTrainer && selectedTrainer.value;
                form.reset();
                if (selectedTrainer) selectedTrainer.value = trainer;
                V.clear(form);
                if (formId === 'booking-form') {
                    document.getElementById('toast-message-text').textContent = status.textContent;
                    window.jQuery('#custom-toast').stop(true, true).fadeIn().delay(3500).fadeOut();
                }
            }, 900);
        });
        // Disable only the submit button so invalid attempts and correction remain predictable.
        window.addEventListener('pagehide', () => clearTimeout(timer));
    }
    setup('booking-form', { name: 'fullName', email: 'email', phone: 'bookingPhone' }, 'bookingFormStatus', () => 'Training session');
    setup('trainerForm', { name: 'trainerName', email: 'trainerEmail', phone: 'trainerPhone' }, 'bookingMessage', () => 'Personal training with ' + document.getElementById('selectedTrainer').value);

    const overlay = document.getElementById('popup-overlay');
    const opener = document.getElementById('open-popup-btn');
    if (overlay && opener) {
        opener.addEventListener('click', () => document.getElementById('fullName').focus());
        function close() {
            overlay.style.display = 'none';
            opener.focus();
        }
        document.getElementById('close-popup-btn').addEventListener('click', close);
        overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
        document.addEventListener('keydown', function (event) {
            if (overlay.style.display === 'none') return;
            if (event.key === 'Escape') close();
            if (event.key !== 'Tab') return;
            const fields = [...overlay.querySelectorAll('button, input, a[href]')].filter(item => !item.disabled);
            const first = fields[0], last = fields[fields.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        });
    }
});
