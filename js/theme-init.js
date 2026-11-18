/* Restore the saved palette before the first paint. */
(function () {
    'use strict';
    try {
        const theme = localStorage.getItem('atlas-theme');
        if (theme === 'light' || theme === 'dark') {
            document.documentElement.setAttribute('data-bs-theme', theme);
        }
    } catch (error) {
        // The page's default palette remains usable when storage is unavailable.
    }
})();
