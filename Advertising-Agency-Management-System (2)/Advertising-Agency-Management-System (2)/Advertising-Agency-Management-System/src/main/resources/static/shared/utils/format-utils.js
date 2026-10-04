/* ============================================================================
   AdFlow - Format Utilities
   Currency, numbers, strings, file sizes, etc.
   ============================================================================ */

const FormatUtils = {
    /**
     * Format number as LKR currency: 'LKR 1,200,000.00'
     */
    currency(amount) {
        return 'LKR ' + Number(amount || 0).toLocaleString('en-LK', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
        });
    },

    /**
     * Compact currency for display: 'LKR 1.2M', 'LKR 500K'
     */
    currencyCompact(amount) {
        const n = Number(amount || 0);
        if (n >= 1_000_000) return `LKR ${(n / 1_000_000).toFixed(1)}M`;
        if (n >= 1_000)     return `LKR ${(n / 1_000).toFixed(0)}K`;
        return `LKR ${n.toFixed(0)}`;
    },

    /**
     * Format percentage: '75%'
     */
    percent(value, decimals = 0) {
        return `${Number(value || 0).toFixed(decimals)}%`;
    },

    /**
     * Format budget utilization percentage
     */
    budgetPercent(spent, budget) {
        if (!budget) return 0;
        return Math.min(100, Math.round((spent / budget) * 100));
    },

    /**
     * Format file size: '2.4 MB'
     */
    fileSize(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    },

    /**
     * Capitalize first letter: 'hello' → 'Hello'
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    /**
     * Title case: 'hello world' → 'Hello World'
     */
    titleCase(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
    },

    /**
     * Humanize enum values: 'IN_PROGRESS' → 'In Progress'
     */
    humanize(str) {
        if (!str) return '';
        return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    },

    /**
     * Truncate string with ellipsis: 'Long text...'
     */
    truncate(str, max = 60) {
        if (!str || str.length <= max) return str || '';
        return str.slice(0, max).trimEnd() + '…';
    },

    /**
     * Initials from full name: 'Kasun Perera' → 'KP'
     */
    initials(name) {
        if (!name) return '?';
        return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
    },

    /**
     * Get color class for progress percentage
     */
    progressColor(percent) {
        if (percent >= 90) return 'red';
        if (percent >= 70) return 'amber';
        return 'green';
    },

    /**
     * Format invoice number: 'INV-2026-001'
     */
    invoiceNumber(id) {
        return `INV-2026-${String(id).padStart(3, '0')}`;
    },

    /**
     * Format phone: '+94771234567' → '+94 77 123 4567'
     */
    phone(str) {
        if (!str) return '';
        const digits = str.replace(/\D/g, '');
        if (digits.startsWith('94') && digits.length === 11) {
            return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
        }
        return str;
    },

    /**
     * Mask email for privacy: 'kasun@dialog.lk' → 'k***n@dialog.lk'
     */
    maskEmail(email) {
        if (!email) return '';
        const [local, domain] = email.split('@');
        if (local.length <= 2) return email;
        return `${local[0]}${'*'.repeat(local.length - 2)}${local.slice(-1)}@${domain}`;
    },

    /**
     * Generate a consistent color from a string (for avatars)
     */
    colorFromString(str) {
        const colors = ['#2563EB','#8B5CF6','#EC4899','#10B981','#F59E0B','#EF4444','#06B6D4','#F97316'];
        let hash = 0;
        for (const c of (str || '')) hash = c.charCodeAt(0) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }
};

window.FormatUtils = FormatUtils;
