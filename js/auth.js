/* Coursework-only localStorage authentication simulation, not a production login system. */
(function () {
    'use strict';
    const USERS = 'atlas-users';
    const SESSION = 'atlas-session';
    const V = window.AtlasValidation;
    function users() {
        const result = JSON.parse(localStorage.getItem(USERS) || '[]');
        if (!Array.isArray(result) || result.some(user => !user || typeof user.email !== 'string' || typeof user.name !== 'string' || typeof user.password !== 'string')) {
            throw new Error('Saved accounts could not be read. Check browser storage before trying again.');
        }
        return result;
    }
    function currentUser() {
        const email = localStorage.getItem(SESSION);
        return email ? users().find(user => user.email === email) : null;
    }
    function message(element, text, success = false) {
        element.className = 'alert mt-3 ' + (success ? 'alert-success' : 'alert-danger');
        element.textContent = text;
        element.hidden = false;
    }
    function updateNavigation(user) {
        document.querySelectorAll('[data-account-link]').forEach(link => {
            link.textContent = user ? 'My Profile' : 'Log In';
            link.href = user ? 'profile.html' : 'login.html';
        });
    }
    function renderProfile() {
        const profile = document.getElementById('memberProfile');
        if (!profile) return;
        let user;
        try { user = currentUser(); }
        catch (error) {
            message(document.getElementById('profileStatus'), error.message);
            return;
        }
        if (!user) { window.location.replace('login.html'); return; }
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profilePhone').textContent = user.phone || 'Not provided';
        profile.hidden = false;
        const list = document.getElementById('profileBookings');
        list.replaceChildren();
        try {
            const bookings = V.readBookings().filter(booking => booking && booking.email === user.email);
            document.getElementById('noBookings').hidden = bookings.length > 0;
            bookings.slice().reverse().forEach(booking => {
                const item = document.createElement('li');
                item.className = 'list-group-item bg-body text-body';
                item.textContent = (booking.training || 'Training session') + ' — ' + new Date(booking.createdAt).toLocaleString('en-GB');
                list.append(item);
            });
        } catch (error) {
            message(document.getElementById('profileStatus'), 'Saved demo bookings could not be loaded.');
        }
    }
    document.addEventListener('DOMContentLoaded', function () {
        try { updateNavigation(currentUser()); } catch (error) { updateNavigation(null); }
        renderProfile();
        const signup = document.getElementById('signupForm');
        if (signup) signup.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('signupName');
            const email = document.getElementById('signupEmail');
            const phone = document.getElementById('signupPhone');
            const password = document.getElementById('signupPassword');
            const confirm = document.getElementById('signupConfirm');
            const status = document.getElementById('authStatus');
            const checks = [
                V.field(name, V.name(name.value) ? '' : 'Enter your full name (at least 2 characters).'),
                V.field(email, V.email(email.value) ? '' : 'Enter a valid email address.'),
                V.field(phone, V.phone(phone.value) ? '' : 'Enter a valid phone number with 10–15 digits.'),
                V.field(password, V.password(password.value) ? '' : V.passwordHint),
                V.field(confirm, confirm.value && confirm.value === password.value ? '' : 'Passwords must match.')
            ];
            if (checks.includes(false)) {
                message(status, 'Please correct the highlighted fields.');
                signup.querySelector('.is-invalid').focus();
                return;
            }
            try {
                const accounts = users();
                const normalizedEmail = email.value.trim().toLowerCase();
                if (accounts.some(user => user.email === normalizedEmail)) {
                    V.field(email, 'An account with this email already exists. Log in instead.');
                    email.focus();
                    message(status, 'This email is already registered.');
                    return;
                }
                accounts.push({ name: name.value.trim(), email: normalizedEmail, phone: phone.value.trim(), password: password.value });
                localStorage.setItem(USERS, JSON.stringify(accounts));
                window.location.assign('login.html?registered=1');
            } catch (error) {
                message(status, 'Could not save your account. Allow browser storage and try again.');
            }
        });
        const login = document.getElementById('loginForm');
        if (login) {
            if (new URLSearchParams(window.location.search).get('registered') === '1') {
                message(document.getElementById('authStatus'), 'Account created. Log in with your new details.', true);
            }
            login.addEventListener('submit', function (event) {
                event.preventDefault();
                const email = document.getElementById('loginEmail');
                const password = document.getElementById('loginPassword');
                const status = document.getElementById('authStatus');
                const checks = [V.field(email, V.email(email.value) ? '' : 'Enter a valid email address.'), V.field(password, V.password(password.value) ? '' : V.passwordHint)];
                if (checks.includes(false)) { message(status, 'Please correct the highlighted fields.'); login.querySelector('.is-invalid').focus(); return; }
                try {
                    const account = users().find(user => user.email === email.value.trim().toLowerCase() && user.password === password.value);
                    if (!account) { message(status, 'Email or password is incorrect. Please try again.'); return; }
                    localStorage.setItem(SESSION, account.email);
                    window.location.assign('profile.html');
                } catch (error) {
                    message(status, 'Login could not be completed. Allow browser storage and check your saved accounts.');
                }
            });
        }
        const logout = document.getElementById('logoutButton');
        if (logout) logout.addEventListener('click', function () {
            try { localStorage.removeItem(SESSION); window.location.replace('login.html'); }
            catch (error) { message(document.getElementById('profileStatus'), 'Could not log out. Check browser storage and try again.'); }
        });
    });
    // Recheck when another tab logs out or when Back restores a cached profile.
    window.addEventListener('storage', function (event) {
        if (![USERS, SESSION, 'atlas-bookings', null].includes(event.key)) return;
        try { updateNavigation(currentUser()); } catch (error) { updateNavigation(null); }
        renderProfile();
    });
    window.addEventListener('pageshow', () => renderProfile());
})();
