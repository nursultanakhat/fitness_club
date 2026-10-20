document.addEventListener('DOMContentLoaded', function() {
    
    
    // TASK 5: Live Date and Time in Header
    function updateDateTime() {
        const dateTimeElement = document.getElementById('current-datetime');
        if (dateTimeElement) {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    

    // TASK 4: Change Background Color with JS
    const colorBtn = document.getElementById('change-bg-btn');
    if (colorBtn) {
        const bgColors = [
            '#ff5733', 
            '#33ff57', 
            '#3357ff', 
            '#f333ff', 
            '#ffff33'  
        ];
        let colorIndex = 0;
        
        colorBtn.addEventListener('click', function() {
            colorIndex = (colorIndex + 1) % bgColors.length;
            // Apply color with 'important' to override Bootstrap's bg-dark class
            document.body.style.setProperty('background', bgColors[colorIndex], 'important');
        });
    }

    // TASK 2: Accordion for FAQs
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight && content.style.maxHeight !== "0px") {
                content.style.maxHeight = "0px";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // TASK 3: Popup Form Open / Close
    const openPopupBtn = document.getElementById('open-popup-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popupOverlay = document.getElementById('popup-overlay');

    if (openPopupBtn && popupOverlay) {
        openPopupBtn.addEventListener('click', function() {
            popupOverlay.style.display = 'flex';
        });
    }

    if (closePopupBtn && popupOverlay) {
        closePopupBtn.addEventListener('click', function() {
            popupOverlay.style.display = 'none';
        });
    }

    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(event) {
            if (event.target === popupOverlay) {
                popupOverlay.style.display = 'none';
            }
        });
    }

    // TASK 1: Form Validation
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            let isValid = true;

            // 1. Full Name
            const fullNameInput = document.getElementById('fullName');
            if (fullNameInput.value.trim() === '') {
                fullNameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                fullNameInput.classList.remove('is-invalid');
                fullNameInput.classList.add('is-valid');
            }

            // 2. Email
            const emailInput = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
            }

            // 3. Password 
            const passwordInput = document.getElementById('password');
            if (passwordInput.value.length < 6) {
                passwordInput.classList.add('is-invalid');
                isValid = false;
            } else {
                passwordInput.classList.remove('is-invalid');
                passwordInput.classList.add('is-valid');
            }

            // 4. Confirm Password
            const confirmPasswordInput = document.getElementById('confirmPassword');
            if (confirmPasswordInput.value !== passwordInput.value || confirmPasswordInput.value === '') {
                confirmPasswordInput.classList.add('is-invalid');
                isValid = false;
            } else {
                confirmPasswordInput.classList.remove('is-invalid');
                confirmPasswordInput.classList.add('is-valid');
            }

            // If all fields are valid
            if (isValid) {
                alert('Success! Your form has been successfully validated and submitted.');
                bookingForm.reset();
                
                fullNameInput.classList.remove('is-valid');
                emailInput.classList.remove('is-valid');
                passwordInput.classList.remove('is-valid');
                confirmPasswordInput.classList.remove('is-valid');
                
                if (popupOverlay) {
                    popupOverlay.style.display = 'none';
                }
            }
        });
    }

});

document.addEventListener('DOMContentLoaded', function() {

    const modal = document.getElementById('trainerModal');
    const closeButton = document.getElementById('closeTrainerModal');
    const trainerInput = document.getElementById('selectedTrainer');
    const trainerForm = document.getElementById('trainerForm');
    const bookingMessage = document.getElementById('bookingMessage');

    if (modal && closeButton && trainerInput && trainerForm && bookingMessage) {

        const bookButtons = document.querySelectorAll('.book-trainer');

        bookButtons.forEach(function(button) {

            button.addEventListener('click', function() {

                trainerForm.reset();

                trainerInput.value = button.dataset.trainer;

                bookingMessage.textContent = '';

                modal.style.display = 'flex';

                modal.setAttribute('aria-hidden', 'false');

                document.getElementById('trainerName').focus();

            });

        });

        function closeModal() {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }

        closeButton.addEventListener('click', closeModal);

        modal.addEventListener('click', function(event) {

            if (event.target === modal) {
                closeModal();
            }

        });

        document.addEventListener('keydown', function(event) {

            if (event.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }

        });

        trainerForm.addEventListener('submit', function(event) {

            event.preventDefault();

            const name = document.getElementById('trainerName').value.trim();
            const email = document.getElementById('trainerEmail').value.trim();

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (name === '') {

                bookingMessage.textContent = 'Please enter your full name.';
                bookingMessage.style.color = 'red';

                return;
            }

            if (!emailPattern.test(email)) {

                bookingMessage.textContent = 'Please enter a valid email address.';
                bookingMessage.style.color = 'red';

                return;
            }

            bookingMessage.textContent = 'Booking submitted successfully!';
            bookingMessage.style.color = 'green';

            trainerForm.reset();

        });

    }


    const membershipPlan = document.getElementById('membershipPlan');
    const membershipDuration = document.getElementById('membershipDuration');
    const membershipTotal = document.getElementById('membershipTotal');
    const membershipExplanation = document.getElementById('membershipExplanation');

    if (
        membershipPlan &&
        membershipDuration &&
        membershipTotal &&
        membershipExplanation
    ) {

        const prices = {
            monthly: 20000,
            monthlyTrainer: 50000,
            annual: 200000,
            annualTrainer: 500000
        };

        function calculateMembership() {

            const selectedPlan = membershipPlan.value;

            const duration = Number(membershipDuration.value);

            if (
                membershipDuration.value.trim() === '' ||
                !Number.isInteger(duration) ||
                duration < 1 ||
                duration > 36
            ) {

                membershipTotal.textContent = 'Invalid Duration';

                membershipExplanation.textContent =
                    'Please enter a whole number from 1 to 36.';

                return;
            }

            const price = prices[selectedPlan];

            const total = price * duration;

            const period = selectedPlan.startsWith('annual')
                ? 'year'
                : 'month';

            const periodLabel = duration === 1
                ? period
                : period + 's';

            membershipTotal.textContent =
                'Total: ' + total.toLocaleString('en-US') + ' ₸';

            membershipExplanation.textContent =
                duration + ' ' + periodLabel +
                ' × ' + price.toLocaleString('en-US') + ' ₸';

        }

        membershipPlan.addEventListener('change', calculateMembership);

        membershipDuration.addEventListener('input', calculateMembership);

        calculateMembership();

    }

});

document.addEventListener('DOMContentLoaded', function() {

    const trainingFilter = document.getElementById('trainingFilter');
    const resetScheduleFilter = document.getElementById('resetScheduleFilter');
    const scheduleTable = document.getElementById('scheduleTable');
    const scheduleFilterResult = document.getElementById('scheduleFilterResult');

    if (trainingFilter && resetScheduleFilter && scheduleTable && scheduleFilterResult) {

        const scheduleRows = scheduleTable.querySelectorAll('tbody tr');

        function filterSchedule() {

            const selectedTraining = trainingFilter.value.toLowerCase();
            let visibleClasses = 0;

            scheduleRows.forEach(function(row) {

                const cells = row.querySelectorAll('td');

                cells.forEach(function(cell) {

                    const trainingName = cell.textContent.trim().toLowerCase();

                    if (selectedTraining === 'all' || trainingName === selectedTraining) {

                        cell.classList.remove('schedule-hidden');
                        cell.classList.add('schedule-visible');

                        visibleClasses++;

                    } else {

                        cell.classList.add('schedule-hidden');
                        cell.classList.remove('schedule-visible');

                    }

                });

            });

            if (selectedTraining === 'all') {

                scheduleFilterResult.textContent =
                    'Showing all ' + visibleClasses + ' training classes.';

            } else {

                scheduleFilterResult.textContent =
                    'Found ' + visibleClasses + ' ' +
                    trainingFilter.options[trainingFilter.selectedIndex].text.trim() +
                    ' classes.';

            }

        }

        trainingFilter.addEventListener('change', filterSchedule);

        resetScheduleFilter.addEventListener('click', function() {

            trainingFilter.value = 'all';
            filterSchedule();

        });

        filterSchedule();

    }


    const contactForm = document.getElementById('contactRegistrationForm');
    const contactFormMessage = document.getElementById('contactFormMessage');

    if (contactForm && contactFormMessage) {

        const fullNameInput = document.getElementById('contactFullName');
        const emailInput = document.getElementById('contactEmail');
        const phoneInput = document.getElementById('contactPhone');
        const trainingInput = document.getElementById('contactTraining');

        function validateField(input, isValid) {

            if (isValid) {

                input.classList.remove('is-invalid');
                input.classList.add('is-valid');

            } else {

                input.classList.remove('is-valid');
                input.classList.add('is-invalid');

            }

            return isValid;

        }

        contactForm.addEventListener('submit', function(event) {

            event.preventDefault();

            const fullName = fullNameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const training = trainingInput.value;

            const nameValid = fullName.length >= 2;

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailValid = emailPattern.test(email);

            const phoneDigits = phone.replace(/\D/g, '');
            const phoneValid = phoneDigits.length >= 10 &&
                               phoneDigits.length <= 15;

            const trainingValid = training !== '';

            validateField(fullNameInput, nameValid);
            validateField(emailInput, emailValid);
            validateField(phoneInput, phoneValid);
            validateField(trainingInput, trainingValid);

            const formValid =
                nameValid &&
                emailValid &&
                phoneValid &&
                trainingValid;

            if (formValid) {

                contactFormMessage.textContent =
                    'Registration submitted successfully!';

                contactFormMessage.className =
                    'alert alert-success mt-3';

                contactForm.reset();

                const inputs = contactForm.querySelectorAll(
                    '.is-valid, .is-invalid'
                );

                inputs.forEach(function(input) {

                    input.classList.remove('is-valid', 'is-invalid');

                });

            } else {

                contactFormMessage.textContent =
                    'Please correct the highlighted fields.';

                contactFormMessage.className =
                    'alert alert-danger mt-3';

            }

        });

        contactForm.addEventListener('reset', function() {

            const inputs = contactForm.querySelectorAll(
                '.is-valid, .is-invalid'
            );

            inputs.forEach(function(input) {

                input.classList.remove('is-valid', 'is-invalid');

            });

            contactFormMessage.textContent = '';
            contactFormMessage.className = 'mt-3';

        });

    }

});