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
            
            const fullNameInput = document.getElementById('fullName');
            const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/; 
            if (fullNameInput.value.trim() === '' || !namePattern.test(fullNameInput.value.trim()) || fullNameInput.value.trim().length < 2) {
                fullNameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                fullNameInput.classList.remove('is-invalid');
                fullNameInput.classList.add('is-valid');
            }
            
            const emailInput = document.getElementById('email');
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            if (!emailPattern.test(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } 
            else {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
            }

            const passwordInput = document.getElementById('password');
            if (passwordInput.value.length < 6) {
                passwordInput.classList.add('is-invalid');
                isValid = false;
            } else {
                passwordInput.classList.remove('is-invalid');
                passwordInput.classList.add('is-valid');
            }

            const confirmPasswordInput = document.getElementById('confirmPassword');
            if (confirmPasswordInput.value !== passwordInput.value || confirmPasswordInput.value === '') {
                confirmPasswordInput.classList.add('is-invalid');
                isValid = false;
            } else {
                confirmPasswordInput.classList.remove('is-invalid');
                confirmPasswordInput.classList.add('is-valid');
            }

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

// Trainer Booking Modal Logic
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

            const selectedTrainerName = trainerInput.value;
            trainerForm.reset();
            trainerInput.value = selectedTrainerName;
            bookingMessage.textContent = 'Form validated successfully for ' + selectedTrainerName + '.';
            bookingMessage.style.color = 'green';
        });
    }
});

// Membership Calculator Logic
document.addEventListener('DOMContentLoaded', function() {
    const membershipPlan = document.getElementById('membershipPlan');
    const membershipDuration = document.getElementById('membershipDuration');
    const membershipTotal = document.getElementById('membershipTotal');
    const membershipExplanation = document.getElementById('membershipExplanation');

    if (membershipPlan && membershipDuration && membershipTotal && membershipExplanation) {
        const prices = {
            monthly: 20000,
            monthlyTrainer: 50000,
            annual: 200000,
            annualTrainer: 500000,

            // Object method: calculate the selected plan's total price.
            calculateTotal(plan, duration) {
                return this[plan] * duration;
            }
        };

        function calculateMembership() {
            const selectedPlan = membershipPlan.value;
            const duration = Number(membershipDuration.value);

            if (membershipDuration.value.trim() === '' || !Number.isInteger(duration) || duration < 1 || duration > 36) {
                membershipTotal.textContent = 'Invalid Duration';
                membershipExplanation.textContent = 'Please enter a whole number from 1 to 36.';
                return;
            }

            const price = prices[selectedPlan];
            const total = prices.calculateTotal(selectedPlan, duration);
            const period = selectedPlan.startsWith('annual') ? 'year' : 'month';
            const periodLabel = duration === 1 ? period : period + 's';

            membershipTotal.textContent = 'Total: ' + total.toLocaleString('en-US') + ' ₸';
            membershipExplanation.textContent = duration + ' ' + periodLabel + ' × ' + price.toLocaleString('en-US') + ' ₸';
        }

        membershipPlan.addEventListener('change', calculateMembership);
        membershipDuration.addEventListener('input', calculateMembership);
        calculateMembership();
    }
});

// Schedule Filtering Logic
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
                scheduleFilterResult.textContent = 'Showing all ' + visibleClasses + ' training classes.';
            } else {
                scheduleFilterResult.textContent = 'Found ' + visibleClasses + ' ' + trainingFilter.options[trainingFilter.selectedIndex].text.trim() + ' classes.';
            }
        }

        trainingFilter.addEventListener('change', filterSchedule);
        resetScheduleFilter.addEventListener('click', function() {
            trainingFilter.value = 'all';
            filterSchedule();
        });
        filterSchedule();
    }
});

// Contact Form Validation Logic
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactRegistrationForm');
    const contactFormMessage = document.getElementById('contactFormMessage');

    if (contactForm && contactFormMessage) {
        const nextButton = document.getElementById('contactNext');
        const backButton = document.getElementById('contactBack');
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.hidden = true
        const firstStepFields = document.querySelectorAll('[data-step="1"]');
        const secondStepFields = document.querySelectorAll('[data-step="2"]');
        for(const field of secondStepFields){
            field.hidden = true;
        }
        nextButton.addEventListener('click', function(){
            for(const field of firstStepFields){
                field.hidden = true;
            }
        
            for(const field of secondStepFields){
                field.hidden = false;
        }
        backButton.disabled = false;
        nextButton.hidden = true;
        submitButton.hidden = false;
        }
    )
    function showFirstStep() {
        for(const field of firstStepFields){
            field.hidden = false;
        }

        for(const field of secondStepFields){
            field.hidden = true;
        }
        backButton.disabled = true;
        nextButton.hidden = false;
        submitButton.hidden = true;
    }
    backButton.addEventListener('click', showFirstStep);

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
            const phoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 15;
            const trainingValid = training !== '';

            validateField(fullNameInput, nameValid);
            validateField(emailInput, emailValid);
            validateField(phoneInput, phoneValid);
            validateField(trainingInput, trainingValid);

            const formValid = nameValid && emailValid && phoneValid && trainingValid;

            if (formValid) {
                contactForm.reset();
                contactFormMessage.textContent = 'Registration submitted successfully!';
                contactFormMessage.className = 'alert alert-success mt-3';

                const inputs = contactForm.querySelectorAll('.is-valid, .is-invalid');
                inputs.forEach(function(input) {
                    input.classList.remove('is-valid', 'is-invalid');
                });
            } else {
                if (!nameValid || !emailValid || !phoneValid) {
                    showFirstStep();
                }
                contactFormMessage.textContent = 'Please correct the highlighted fields.';
                contactFormMessage.className = 'alert alert-danger mt-3';
            }
        });

        contactForm.addEventListener('reset', function() {
            showFirstStep();
            const inputs = contactForm.querySelectorAll('.is-valid, .is-invalid');
            inputs.forEach(function(input) {
                input.classList.remove('is-valid', 'is-invalid');
            });
            contactFormMessage.textContent = '';
            contactFormMessage.className = 'mt-3';
        });
    }
});



document.addEventListener('DOMContentLoaded', function() {

    const stars = document.querySelectorAll('#rating-stars .star');
    const ratingResult = document.getElementById('rating-result');

    if (stars.length > 0 && ratingResult) {
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const val = this.getAttribute('data-value');
                
                stars.forEach(s => {
                    if (s.getAttribute('data-value') <= val) {
                        s.style.color = '#f59e0b'; // Gold
                        s.style.transform = 'scale(1.2)';
                    } else {
                        s.style.color = '#cbd5e1'; // Gray
                        s.style.transform = 'scale(1)';
                    }
                    setTimeout(() => { s.style.transform = 'scale(1)'; }, 200);
                });

                // Modify content dynamically using textContent
                ratingResult.textContent = `Thank you! You rated Atlas Fitness Club ${val} out of 5 stars. ⭐`;
            });
        });
    }

    const switchGreeting = document.getElementById('switch-greeting');
    if (switchGreeting) {
        const currentHour = new Date().getHours();
        let timeOfDay;

        if (currentHour >= 5 && currentHour < 12) {
            timeOfDay = 'morning';
        } else if (currentHour >= 12 && currentHour < 18) {
            timeOfDay = 'afternoon';
        } else {
            timeOfDay = 'evening';
        }

        let message = '';
        switch (timeOfDay) {
            case 'morning':
                message = '🌅 Good Morning! Kickstart your day with high energy at Atlas Fitness!';
                break;
            case 'afternoon':
                message = '☀️ Good Afternoon! Power through your midday training session!';
                break;
            case 'evening':
                message = '🌙 Good Evening! Unwind, build muscle, and relax after work or studies!';
                break;
            default:
                message = '👋 Welcome to Atlas Fitness Club!';
        }
        switchGreeting.textContent = message;
    }

    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) {
        soundBtn.addEventListener('click', function() {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5 note
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
            } catch (err) {
                console.log('Audio context error:', err);
            }
            alert('🎵 Sound effect played successfully via Web Audio API!');
        });
    }

    const catalogContainer = document.getElementById('dynamic-catalog-container');
    if (catalogContainer) {
        const servicesData = [
            { id: 1, title: '⚡ Advanced CrossFit', category: 'strength', duration: '60 min', trainer: 'Alex', price: '25,000 ₸' },
            { id: 2, title: '🧘‍♀️ Pro Yoga & Flow', category: 'cardio', duration: '50 min', trainer: 'Maria', price: '20,000 ₸' },
            { id: 3, title: '🥊 Endurance Boxing', category: 'cardio', duration: '55 min', trainer: 'Daniel', price: '22,000 ₸' },
            { id: 4, title: '🏋️‍♂️ Heavy Powerlifting', category: 'strength', duration: '80 min', trainer: 'Alex', price: '30,000 ₸' }
        ];

        function renderCatalog(filterCategory) {
            const filtered = filterCategory === 'all' 
                ? servicesData 
                : servicesData.filter(item => item.category === filterCategory);

            const htmlCards = filtered.map(item => `
                <div class="col-md-6">
                    <div class="p-3 border rounded-3 bg-light shadow-sm h-100">
                        <h4 class="h6 fw-bold text-dark mb-1">${item.title}</h4>
                        <p class="small text-secondary mb-1"><strong>Category:</strong> ${item.category.toUpperCase()} | <strong>Duration:</strong> ${item.duration}</p>
                        <p class="small text-muted mb-1"><strong>Trainer:</strong> ${item.trainer}</p>
                        <p class="small text-primary fw-bold mb-0">Price: ${item.price}</p>
                    </div>
                </div>
            `).join('');

            catalogContainer.innerHTML = htmlCards;
        }

        renderCatalog('all');

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
                filterBtns.forEach(b => b.classList.add('btn-outline-primary'));
                this.classList.add('active', 'btn-primary');
                this.classList.remove('btn-outline-primary');

                const category = this.getAttribute('data-filter');
                renderCatalog(category);
            });
        });
    }

});
document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('.navbar-nav .nav-link');

    menuLinks.forEach(function (link, index) {
        link.addEventListener('keydown', function (event) {
            if(event.key === 'ArrowRight' && menuLinks[index+1]){
                event.preventDefault();
                menuLinks[index + 1].focus();
            }
            if(event.key === 'ArrowLeft' && menuLinks[index - 1]){
                event.preventDefault();
                menuLinks[index - 1].focus();
            }
        });
    });
});