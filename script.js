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

    // TASK 1 & TASK 6: Form Validation & Loading Spinner
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
                const $btn = $('#submit-btn');
                
                if ($btn.length > 0) {
                    $btn.prop('disabled', true);
                    $btn.html(`
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Please wait...
                    `);
                }

                setTimeout(function() {
                    showToast('Success! Your form has been successfully validated and submitted.');
                    
                    bookingForm.reset();
                    
                    fullNameInput.classList.remove('is-valid');
                    emailInput.classList.remove('is-valid');
                    passwordInput.classList.remove('is-valid');
                    confirmPasswordInput.classList.remove('is-valid');
                    
                    if ($btn.length > 0) {
                        $btn.prop('disabled', false);
                        $btn.html('Submit Booking');
                    }
                    
                    if (popupOverlay) {
                        popupOverlay.style.display = 'none';
                    }
                }, 1500);
            }
        });
    }

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

// Schedule/contact initialization moved to js/schedule-contact.js (pages 5 and 6 only).

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
                osc.frequency.setValueAtTime(659.25, audioCtx.currentTime);
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

// jQuery Tasks (Task 0, Task 1, Task 2, Task 3, Task 4, Task 6 & Task 7)
$(document).ready(function() {
    console.log("jQuery is ready!");

    // 1. Функция показа всплывающего уведомления (Task 7)
    function showToast(message) {
        const $toast = $('#custom-toast');
        $('#toast-message-text').text(message);
        $toast.fadeIn();

        setTimeout(function() {
            $toast.fadeOut();
        }, 3500);
    }

    // --- Task 1, Task 2 & Task 3: Поиск, автоподсказки и подсветка ---
    $('#searchInput').on('keyup', function() {
        let keyword = $(this).val().trim();
        let $suggestionsBox = $('#suggestions');
        
        $suggestionsBox.empty();
        
        let suggestionsList = ["Gym Area", "Group Programs", "Personal Training", "Yoga and Stretching", "CrossFit", "Pilates"];

        if (keyword.length > 0) {
            let matches = suggestionsList.filter(item => item.toLowerCase().includes(keyword.toLowerCase()));
            matches.forEach(match => {
                $suggestionsBox.append(`<div class="suggestion-item dropdown-item p-2" style="cursor: pointer;">${match}</div>`);
            });
            $suggestionsBox.show();
        } else {
            $suggestionsBox.hide();
        }

        // Убираем старую подсветку
        $('.service-card mark').each(function() {
            $(this).replaceWith($(this).text());
        });

        // Подсвечиваем найденный текст (Task 3)
        if (keyword.length > 0) {
            let regex = new RegExp('(' + keyword + ')', 'gi');
            $('.service-card h3, .service-card p').each(function() {
                let html = $(this).html();
                if (!html.includes('mark')) {
                    let newHtml = html.replace(regex, '<mark style="background-color: #ffeb3b; padding: 0 2px; border-radius: 2px;">$1</mark>');
                    $(this).html(newHtml);
                }
            });
        }
    });

    // Клик по автоподсказке
    $(document).on('click', '.suggestion-item', function() {
        $('#searchInput').val($(this).text()).trigger('keyup');
        $('#suggestions').hide();
    });

    // --- Task 4: Scroll Progress Bar ---
    $(window).on('scroll', function() {
        let sTop = $(window).scrollTop();
        let docHeight = $(document).height() - $(window).height();
        let scrollPercent = (sTop / docHeight) * 100;
        $('#scroll-progress-bar').css('width', scrollPercent + '%');
    });

    // --- Task 6 & Task 7: Валидация формы, спиннер загрузки и уведомление ---
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
            } else {
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

            // Если всё валидно — запускаем анимацию и тост
            if (isValid) {
                const $btn = $('#submit-btn');
                
                if ($btn.length > 0) {
                    $btn.prop('disabled', true);
                    $btn.html(`
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Please wait...
                    `);
                }

                setTimeout(function() {
                    // Вызываем наше красивое уведомление (Task 7)
                    showToast('Success! Your form has been successfully validated and submitted.');
                    
                    bookingForm.reset();
                    
                    fullNameInput.classList.remove('is-valid');
                    emailInput.classList.remove('is-valid');
                    passwordInput.classList.remove('is-valid');
                    confirmPasswordInput.classList.remove('is-valid');
                    
                    if ($btn.length > 0) {
                        $btn.prop('disabled', false);
                        $btn.html('Submit Booking');
                    }
                    
                    const popupOverlay = document.getElementById('popup-overlay'); // или ваш класс оверлея
                    if (popupOverlay) {
                        popupOverlay.style.display = 'none';
                    }
                }, 1500);
            }
        });
    }

});

}); 
$(document).ready(function () {
    const $root = $("html");
    const $themeButton = $("#theme-toggle");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function applyTheme(theme) {
        $root.attr("data-bs-theme", theme);

        const isDark = theme === "dark";

        $("#theme-icon").text(isDark ? "☀" : "☾");
        $("#theme-label").text(isDark ? "Light mode" : "Dark mode");

        $themeButton.attr({
            "aria-label": isDark
                ? "Switch to light theme"
                : "Switch to dark theme",
            "aria-pressed": String(isDark)
        });
    }

    let savedTheme;

    try {
        savedTheme = localStorage.getItem("atlas-theme");
    } catch (error) {
        savedTheme = null;
    }

    applyTheme(
        savedTheme === "light" || savedTheme === "dark"
            ? savedTheme
            : $root.attr("data-bs-theme") === "light"
                ? "light"
                : "dark"
    );

    $themeButton.on("click.atlas", function () {
        const theme =
            $root.attr("data-bs-theme") === "dark" ? "light" : "dark";

        applyTheme(theme);

        try {
            localStorage.setItem("atlas-theme", theme);
        } catch (error) {
        }
    });

    if (!$("body").is(".trainers-page, .pricing-page")) {
        return;
    }

    function updateVisibleContent() {
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();

        $(".fitness-counter").each(function () {
            const $counter = $(this);
            const counterTop = $counter.offset().top;
            const counterBottom = counterTop + $counter.outerHeight();

            if (
                $counter.data("started") ||
                counterTop >= viewportBottom ||
                counterBottom <= viewportTop
            ) {
                return;
            }

            $counter.data("started", true);

            const target = Number($counter.attr("data-target"));

            $counter.text("0");

            $({ value: 0 }).animate(
                { value: target },
                {
                    duration: prefersReducedMotion ? 0 : 1800,
                    easing: "swing",

                    step: function () {
                        $counter.text(
                            Math.floor(this.value).toLocaleString("en-US")
                        );
                    },

                    complete: function () {
                        $counter.text(target.toLocaleString("en-US"));
                    }
                }
            );
        });

        $(".fitness-lazy[data-src]").each(function () {
            const $image = $(this);
            const imageTop = $image.offset().top;
            const imageBottom = imageTop + $image.outerHeight();

            if (
                imageTop < viewportBottom &&
                imageBottom > viewportTop
            ) {
                const source = $image.attr("data-src");

                $image.one("load", function () {
                    $image.addClass("is-loaded");
                });

                $image.one("error", function () {
                    $image
                        .attr("alt", "Image unavailable")
                        .addClass("is-loaded");
                });

                $image
                    .removeAttr("data-src")
                    .attr("src", source);
            }
        });
    }

    $(window).on(
        "scroll.atlasContent resize.atlasContent",
        updateVisibleContent
    );

    updateVisibleContent();

    const $plan = $("#membershipPlan");
    const $duration = $("#membershipDuration");
    const $copyButton = $("#copyMembership");
    const $copyFeedback = $("#copyFeedback");

    let copyTimer;
    let quoteVersion = 0;
    let copying = false;

    function resetCopyFeedback() {
        clearTimeout(copyTimer);

        $copyButton.find(".copy-icon").text("⧉");
        $copyButton.find(".copy-label").text("Copy quote");

        $copyFeedback
            .removeClass("is-visible")
            .text("");
    }

    function calculateMembership() {
        if (!$plan.length) {
            return;
        }

        quoteVersion++;
        resetCopyFeedback();

        const prices = {
            monthly: 20000,
            monthlyTrainer: 50000,
            annual: 200000,
            annualTrainer: 500000
        };

        const selectedPlan = $plan.val();
        const duration = Number($duration.val());

        const valid =
            Object.prototype.hasOwnProperty.call(prices, selectedPlan) &&
            Number.isInteger(duration) &&
            duration >= 1 &&
            duration <= 36;

        $duration.attr("aria-invalid", String(!valid));
        $copyButton.prop("disabled", !valid || copying);

        if (!valid) {
            $("#membershipTotal").text("Invalid Duration");

            $("#membershipExplanation").text(
                "Please enter a whole number from 1 to 36."
            );

            return;
        }

        const price = prices[selectedPlan];
        const total = price * duration;

        const period = selectedPlan.startsWith("annual")
            ? "year"
            : "month";

        const periodLabel = duration === 1
            ? period
            : period + "s";

        $("#membershipTotal").text(
            "Total: " + total.toLocaleString("en-US") + " ₸"
        );

        $("#membershipExplanation").text(
            duration + " " + periodLabel +
            " × " + price.toLocaleString("en-US") + " ₸"
        );
    }

    $plan.on("change.atlas", calculateMembership);
    $duration.on("input.atlas", calculateMembership);

    calculateMembership();

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const previousFocus = document.activeElement;

        const $temporaryField = $("<textarea>")
            .val(text)
            .attr("readonly", "")
            .css({
                position: "fixed",
                left: "-9999px",
                top: "0"
            })
            .appendTo("body");

        try {
            $temporaryField[0].select();

            if (!document.execCommand("copy")) {
                throw new Error("Copy failed");
            }
        } finally {
            $temporaryField.remove();

            if (previousFocus) {
                previousFocus.focus();
            }
        }
    }

    $copyButton.on("click.atlas", async function () {
        if (copying || $(this).prop("disabled")) {
            return;
        }

        resetCopyFeedback();

        const copiedVersion = quoteVersion;

        const planName = $plan
            .find("option:selected")
            .text()
            .trim()
            .replace(/\s+/g, " ");

        const quote = [
            "Atlas Fitness Club",
            planName,
            $("#membershipExplanation").text(),
            $("#membershipTotal").text()
        ].join("\n");

        copying = true;
        $copyButton.prop("disabled", true);

        try {
            await copyText(quote);

            if (copiedVersion === quoteVersion) {
                $copyButton.find(".copy-icon").text("✓");
                $copyButton.find(".copy-label").text("Copied");

                $copyFeedback
                    .text("Copied to clipboard!")
                    .addClass("is-visible");
            }
        } catch (error) {
            if (copiedVersion === quoteVersion) {
                $copyFeedback
                    .text("Copy unavailable. Please copy the quote manually.")
                    .addClass("is-visible");
            }
        } finally {
            copying = false;

            $copyButton.prop(
                "disabled",
                $duration.attr("aria-invalid") === "true"
            );

            if (copiedVersion === quoteVersion) {
                copyTimer = setTimeout(resetCopyFeedback, 3000);
            }
        }
    });

    const $modal = $("#trainerModal");
    const $trainerForm = $("#trainerForm");
    let bookingOpener = null;

    function closeTrainerModal() {
        $modal.hide().attr("aria-hidden", "true");
        $("body").removeClass("booking-open");

        if (bookingOpener) {
            bookingOpener.focus();
        }
    }

    $(".book-trainer").on("click.atlas", function () {
        if (!$trainerForm.length) {
            return;
        }

        bookingOpener = this;

        $trainerForm[0].reset();

        $("#selectedTrainer").val($(this).attr("data-trainer"));

        $("#bookingMessage")
            .text("")
            .removeClass("text-success text-danger");

        $modal
            .css("display", "flex")
            .attr("aria-hidden", "false");

        $("body").addClass("booking-open");
        $("#trainerName").trigger("focus");
    });

    $("#closeTrainerModal").on("click.atlas", closeTrainerModal);

    $modal.on("click.atlas", function (event) {
        if (event.target === this) {
            closeTrainerModal();
        }
    });

    $(document).on("keydown.atlasBooking", function (event) {
        if (!$modal.is(":visible")) {
            return;
        }

        if (event.key === "Escape") {
            closeTrainerModal();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const $fields = $modal
            .find("button, input, textarea, select, a[href]")
            .filter(":visible")
            .filter(":enabled");

        const firstField = $fields[0];
        const lastField = $fields[$fields.length - 1];

        if (event.shiftKey && document.activeElement === firstField) {
            event.preventDefault();
            lastField.focus();
        } else if (
            !event.shiftKey &&
            document.activeElement === lastField
        ) {
            event.preventDefault();
            firstField.focus();
        }
    });

    $trainerForm.on("submit.atlas", function (event) {
        event.preventDefault();

        const name = $("#trainerName").val().trim();
        const email = $("#trainerEmail").val().trim();
        const trainer = $("#selectedTrainer").val();
        const $message = $("#bookingMessage");

        $message.removeClass("text-success text-danger");

        if (name.length < 2) {
            $message
                .addClass("text-danger")
                .text("Please enter your full name.");

            $("#trainerName").trigger("focus");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $message
                .addClass("text-danger")
                .text("Please enter a valid email address.");

            $("#trainerEmail").trigger("focus");
            return;
        }

        $message
            .addClass("text-success")
            .text(
                "Demo: booking details validated for " +
                trainer +
                ". No booking has been sent."
            );
    });
});