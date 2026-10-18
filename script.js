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