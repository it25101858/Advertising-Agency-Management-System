/* ============================================================================
   AdFlow - Date Utilities
   ============================================================================ */

const DateUtils = {
    /**
     * Format ISO date string → '15 Mar 2026'
     */
    format(dateStr) {
        if (!dateStr) return '—';
        try {
            return new Date(dateStr).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        } catch { return dateStr; }
    },

    /**
     * Format ISO datetime → '15 Mar 2026, 10:30 AM'
     */
    formatDateTime(dateStr) {
        if (!dateStr) return '—';
        try {
            return new Date(dateStr).toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            });
        } catch { return dateStr; }
    },

    /**
     * Format time string HH:MM:SS → '10:30 AM'
     */
    formatTime(timeStr) {
        if (!timeStr) return '—';
        try {
            const [h, m] = timeStr.split(':').map(Number);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const hr = h % 12 || 12;
            return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
        } catch { return timeStr; }
    },

    /**
     * Get today as YYYY-MM-DD for input[type=date]
     */
    today() {
        return new Date().toISOString().split('T')[0];
    },

    /**
     * Get tomorrow as YYYY-MM-DD
     */
    tomorrow() {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    },

    /**
     * Is the given date string in the past?
     */
    isPast(dateStr) {
        return dateStr && new Date(dateStr) < new Date();
    },

    /**
     * Is the given date string today?
     */
    isToday(dateStr) {
        return dateStr && dateStr === this.today();
    },

    /**
     * Get relative time label: 'Today', 'Tomorrow', '3 days ago', etc.
     */
    relative(dateStr) {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        const now  = new Date();
        const diff = Math.round((date - now) / 86400000);
        if (diff === 0)  return 'Today';
        if (diff === 1)  return 'Tomorrow';
        if (diff === -1) return 'Yesterday';
        if (diff > 0)    return `In ${diff} days`;
        return `${Math.abs(diff)} days ago`;
    },

    /**
     * Parse a time string into a sortable number (minutes from midnight)
     */
    timeToMinutes(timeStr) {
        const [h, m] = (timeStr || '00:00').split(':').map(Number);
        return h * 60 + m;
    },

    /**
     * Is the given time within working hours? (08:00 - 17:00)
     */
    isWorkingHours(timeStr) {
        const mins = this.timeToMinutes(timeStr);
        return mins >= 480 && mins <= 1020;
    },

    /**
     * Days until due date
     */
    daysUntil(dateStr) {
        if (!dateStr) return null;
        return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    }
};

window.DateUtils = DateUtils;
