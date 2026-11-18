/* Public Open-Meteo API: current Astana weather, never a fabricated offline result. */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    const panel = document.getElementById('weatherPanel');
    if (!panel) return;
    const status = document.getElementById('weatherStatus');
    const details = document.getElementById('weatherDetails');
    const refresh = document.getElementById('weatherRefresh');
    const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=51.1694&longitude=71.4491&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FAlmaty';
    function description(code) {
        if (code === 0) return 'Clear sky';
        if (code <= 3) return 'Partly cloudy or overcast';
        if (code <= 48) return 'Fog';
        if (code <= 57) return 'Drizzle';
        if (code <= 67) return 'Rain';
        if (code <= 77) return 'Snow';
        if (code <= 82) return 'Rain showers';
        if (code <= 86) return 'Snow showers';
        return 'Thunderstorm';
    }
    async function load() {
        if (refresh.disabled) return;
        refresh.disabled = true;
        panel.setAttribute('aria-busy', 'true');
        details.hidden = true;
        status.className = 'text-secondary';
        status.textContent = 'Loading Astana weather...';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        try {
            const response = await fetch(endpoint, { signal: controller.signal });
            if (!response.ok) throw new Error('Weather request failed');
            const data = await response.json();
            const current = data.current;
            if (!current || !['temperature_2m', 'apparent_temperature', 'precipitation', 'weather_code', 'wind_speed_10m'].every(key => typeof current[key] === 'number' && Number.isFinite(current[key])) || typeof current.time !== 'string') {
                throw new Error('Weather response was incomplete');
            }
            const units = data.current_units || {};
            document.getElementById('weatherSummary').textContent = description(current.weather_code) + ' · ' + current.temperature_2m + ' ' + (units.temperature_2m || '°C') + ' · Wind ' + current.wind_speed_10m + ' ' + (units.wind_speed_10m || 'km/h');
            document.getElementById('weatherTime').textContent = 'Observed ' + current.time.replace('T', ' ') + ' (Astana local time). Feels like ' + current.apparent_temperature + ' °C.';
            const indoor = current.temperature_2m < 5 || current.temperature_2m > 30 || current.precipitation > 0 || current.wind_speed_10m > 30 || current.weather_code >= 95;
            document.getElementById('weatherAdvice').textContent = indoor ? 'Consider an indoor session today. Use the schedule below to find a class.' : 'Planning a walk or outdoor warm-up? Check local conditions before heading out, or choose an indoor class below.';
            status.textContent = 'Current weather loaded.';
            details.hidden = false;
        } catch (error) {
            status.className = 'text-danger';
            status.textContent = 'Weather is unavailable right now. Check your connection and select Refresh weather to try again. The class schedule is still available.';
        } finally {
            clearTimeout(timeout);
            refresh.disabled = false;
            panel.removeAttribute('aria-busy');
        }
    }
    refresh.addEventListener('click', load);
    load();
});
