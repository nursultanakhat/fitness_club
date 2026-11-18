/* Shared JavaScript validation; native browser validation is disabled on every form. */
(function () {
    'use strict';
    const passwordHint = 'Use at least 8 characters with an uppercase letter, a lowercase letter, a number and a symbol.';
    function phone(value) {
        const text = value.trim();
        const digits = text.replace(/\D/g, '');
        return /^\+?[\d ()-]+$/.test(text) && digits.length >= 10 && digits.length <= 15;
    }
    function field(input, error) {
        let feedback = document.getElementById(input.id + '-error');
        if (!feedback) {
            feedback = input.parentElement.querySelector('.invalid-feedback');
        }
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.after(feedback);
        }
        feedback.id = input.id + '-error';
        feedback.textContent = error || '';
        const descriptions = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
        descriptions.add(feedback.id);
        input.setAttribute('aria-describedby', [...descriptions].join(' '));
        input.setAttribute('aria-invalid', String(Boolean(error)));
        input.classList.toggle('is-invalid', Boolean(error));
        input.classList.toggle('is-valid', !error);
        return !error;
    }
    function readBookings() {
        const value = JSON.parse(localStorage.getItem('atlas-bookings') || '[]');
        if (!Array.isArray(value)) throw new Error('Saved demo bookings could not be read. Please check browser storage.');
        return value;
    }
    function saveBooking(data) {
        try {
            const bookings = readBookings();
            bookings.push({ ...data, email: data.email.trim().toLowerCase(), createdAt: new Date().toISOString() });
            localStorage.setItem('atlas-bookings', JSON.stringify(bookings));
        } catch (error) {
            throw new Error('Could not save this demo request. Allow browser storage and try again.');
        }
    }
    window.AtlasValidation = {
        phone, field, saveBooking, readBookings, passwordHint,
        email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
        name: value => value.trim().length >= 2 && /\p{L}/u.test(value),
        password: value => value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9\s]/.test(value),
        clear: form => {
            form.querySelectorAll('.is-valid, .is-invalid').forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
                input.removeAttribute('aria-invalid');
            });
        }
    };
})();
