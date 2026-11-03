/* Assignment 6: Tasks 1, 3, 6 and 8. Loaded only by pages 5 and 6. */
(function ($) {
    'use strict';

    $(document).ready(function () {
        if (!$('body').hasClass('assignment6-page')) return;

        // Tasks 1 and 3: live filtering and safe highlighting of class names.
        const $table = $('#scheduleTable');
        if ($table.length) {
            const $search = $('#scheduleSearch');
            const $type = $('#trainingFilter');
            const $cells = $table.find('tbody td');
            $cells.each(function () {
                $(this).data('className', $(this).text().trim());
            });

            function highlight($cell, text, keyword) {
                $cell.empty();
                if (!keyword) {
                    $cell.text(text);
                    return;
                }
                const lowerText = text.toLowerCase();
                let position = 0;
                let match = lowerText.indexOf(keyword);
                while (match !== -1) {
                    $cell.append(document.createTextNode(text.slice(position, match)));
                    // User input is never interpreted as HTML or a regular expression.
                    $('<mark>', { class: 'schedule-search-match' })
                        .text(text.slice(match, match + keyword.length)).appendTo($cell);
                    position = match + keyword.length;
                    match = lowerText.indexOf(keyword, position);
                }
                $cell.append(document.createTextNode(text.slice(position)));
            }

            function filterSchedule() {
                const keyword = $search.val().trim().toLowerCase();
                const selectedType = $type.val().toLowerCase();
                let count = 0;
                $cells.each(function () {
                    const $cell = $(this);
                    const text = $cell.data('className');
                    const lowerText = text.toLowerCase();
                    const matches = (selectedType === 'all' || lowerText === selectedType)
                        && lowerText.includes(keyword);
                    $cell.toggleClass('schedule-visible', matches)
                        .toggleClass('schedule-hidden', !matches);
                    if (matches) {
                        count += 1;
                        highlight($cell, text, keyword);
                    } else {
                        // Keep each weekday column in place, including empty results.
                        $cell.empty();
                    }
                });
                const message = !keyword && selectedType === 'all'
                    ? 'Showing all ' + count + ' training classes.'
                    : count === 0
                        ? 'No classes match your search. Try another name or reset the filters.'
                        : 'Found ' + count + ' matching ' + (count === 1 ? 'class.' : 'classes.');
                $('#scheduleFilterResult').text(message);
            }

            $search.on('input.assignment6', filterSchedule);
            $type.on('change.assignment6', filterSchedule);
            $('#resetScheduleFilter').on('click.assignment6', function () {
                $search.val('');
                $type.val('all');
                filterSchedule();
                $search.trigger('focus');
            });
            filterSchedule();
        }

        // Task 6: one submit handler owns validation, loading, completion and reset.
        const $form = $('#contactRegistrationForm');
        if ($form.length) {
            const $next = $('#contactNext');
            const $back = $('#contactBack');
            const $submit = $form.find('[type="submit"]');
            const $message = $('#contactFormMessage');
            const originalButton = $submit.html();
            let step = 1;
            let busy = false;
            let pendingTimer = null;
            let controlStates = [];

            function showStep(number) {
                step = number;
                $form.find('[data-step="1"]').prop('hidden', number !== 1);
                $form.find('[data-step="2"]').prop('hidden', number !== 2);
                $next.prop('hidden', number !== 1);
                $submit.prop('hidden', number !== 2);
                $back.prop('disabled', number === 1);
            }

            function validateField(selector, valid) {
                $(selector).toggleClass('is-valid', valid)
                    .toggleClass('is-invalid', !valid)
                    .attr('aria-invalid', String(!valid));
                return valid;
            }

            function validateDetails() {
                const nameValid = validateField('#contactFullName', $('#contactFullName').val().trim().length >= 2);
                const emailValid = validateField('#contactEmail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#contactEmail').val().trim()));
                const digits = $('#contactPhone').val().replace(/\D/g, '');
                const phoneValid = validateField('#contactPhone', digits.length >= 10 && digits.length <= 15);
                return nameValid && emailValid && phoneValid;
            }

            function showError() {
                $message.attr('class', 'alert alert-danger mt-3')
                    .text('Please correct the highlighted fields.');
                $form.find('.is-invalid:visible').first().trigger('focus');
            }

            function nextStep() {
                if (validateDetails()) {
                    $message.attr('class', 'mt-3').empty();
                    showStep(2);
                    $('#contactTraining').trigger('focus');
                } else {
                    showError();
                }
            }

            function stopLoading() {
                clearTimeout(pendingTimer);
                pendingTimer = null;
                busy = false;
                controlStates.forEach(function (state) {
                    state.element.disabled = state.disabled;
                });
                controlStates = [];
                $form.removeAttr('aria-busy');
                $submit.html(originalButton);
            }

            $next.on('click.assignment6', nextStep);
            $back.on('click.assignment6', function () {
                showStep(1);
                $('#contactFullName').trigger('focus');
            });

            $form.on('submit.assignment6', function (event) {
                event.preventDefault();
                if (busy) return;
                // Enter on the first step behaves like the Next button.
                if (step === 1) {
                    nextStep();
                    return;
                }
                const detailsValid = validateDetails();
                const trainingValid = validateField('#contactTraining', $('#contactTraining').val() !== '');
                if (!detailsValid || !trainingValid) {
                    showStep(detailsValid ? 2 : 1);
                    showError();
                    return;
                }

                busy = true;
                controlStates = $form.find('input, select, textarea, button').toArray().map(function (element) {
                    const state = { element: element, disabled: element.disabled };
                    element.disabled = true;
                    return state;
                });
                $form.attr('aria-busy', 'true');
                $submit.html('<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Please wait...');
                $message.attr('class', 'mt-3').text('Please wait...');

                // The assignment asks for a simulated server delay; no data is sent.
                pendingTimer = setTimeout(function () {
                    $form[0].reset();
                    $message.attr('class', 'alert alert-success mt-3')
                        .text('Demo registration completed successfully. No registration has been sent.');
                }, 1500);
            });

            $form.on('reset.assignment6', function () {
                stopLoading();
                showStep(1);
                $form.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid').removeAttr('aria-invalid');
                $message.attr('class', 'mt-3').empty();
            });
            showStep(1);
        }

        // Task 8: copy the displayed contact details, with honest success/failure feedback.
        function legacyCopy(text) {
            const activeElement = document.activeElement;
            const $temporary = $('<textarea>', { class: 'a6-copy-buffer', readonly: true }).val(text).appendTo('body');
            $temporary[0].select();
            let copied = false;
            try {
                copied = document.execCommand('copy');
            } finally {
                $temporary.remove();
                if (activeElement) activeElement.focus({ preventScroll: true });
            }
            if (!copied) throw new Error('Clipboard unavailable');
        }

        $('.a6-copy-button').on('click.assignment6', async function () {
            const $button = $(this);
            if ($button.data('copying')) return;
            const $tooltip = $('#' + $button.attr('aria-describedby'));
            const text = $('#' + $button.attr('data-copy-target')).text().trim();
            clearTimeout($button.data('feedbackTimer'));
            $button.data('copying', true);
            try {
                if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
                    try {
                        await navigator.clipboard.writeText(text);
                    } catch (error) {
                        legacyCopy(text);
                    }
                } else {
                    legacyCopy(text);
                }
                $button.find('.a6-copy-icon').text('✓');
                $button.find('.a6-copy-label').text('Copied');
                $tooltip.text('Copied to clipboard!');
            } catch (error) {
                $button.find('.a6-copy-icon').text('!');
                $button.find('.a6-copy-label').text('Try again');
                $tooltip.text('Copy unavailable. Select and copy the text manually.');
            } finally {
                $button.data('copying', false);
                $tooltip.prop('hidden', false);
                $('#contactCopyStatus').text($tooltip.text());
                $button.data('feedbackTimer', setTimeout(function () {
                    $button.find('.a6-copy-icon').text('⧉');
                    $button.find('.a6-copy-label').text('Copy');
                    $tooltip.prop('hidden', true);
                }, 2500));
            }
        });

        // Preserve arrow-key navigation on these two pages only.
        const $links = $('.navbar-nav .nav-link');
        $links.on('keydown.assignment6', function (event) {
            const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
            const target = direction && $links.get($links.index(this) + direction);
            if (target && $links.index(this) + direction >= 0) {
                event.preventDefault();
                target.focus();
            }
        });
    });
})(jQuery);
