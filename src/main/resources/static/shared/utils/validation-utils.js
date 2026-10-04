/* ============================================================================
   AdFlow - Validation Utilities
   Common field-level and form-level validators
   ============================================================================ */

const ValidationUtils = {
    /**
     * Required field check
     */
    required(value, fieldName = 'Field') {
        if (!value || String(value).trim() === '') return `${fieldName} is required.`;
        return null;
    },

    /**
     * Email format check
     */
    email(value) {
        if (!value) return 'Email is required.';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value) ? null : 'Please enter a valid email address.';
    },

    /**
     * Minimum length check
     */
    minLength(value, min, fieldName = 'Field') {
        if (!value) return `${fieldName} is required.`;
        if (value.trim().length < min) return `${fieldName} must be at least ${min} characters.`;
        return null;
    },

    /**
     * Person Name check (Letters and spaces only, no numbers)
     */
    personName(value, fieldName = 'Name') {
        if (!value || !value.trim()) return `${fieldName} is required.`;
        const trimmed = value.trim();
        if (trimmed.length < 2) return `${fieldName} must be at least 2 characters.`;
        if (/\d/.test(trimmed)) return `${fieldName} cannot contain numbers. Only letters are allowed.`;
        if (!/^[A-Za-z\s.'-]+$/.test(trimmed)) return `${fieldName} must contain letters only.`;
        return null;
    },

    /**
     * Maximum length check
     */
    maxLength(value, max, fieldName = 'Field') {
        if (value && value.length > max) return `${fieldName} must be at most ${max} characters.`;
        return null;
    },

    /**
     * Numeric check
     */
    numeric(value, fieldName = 'Field') {
        if (value === '' || value === null || value === undefined) return `${fieldName} is required.`;
        if (isNaN(Number(value))) return `${fieldName} must be a number.`;
        return null;
    },

    /**
     * Positive number check
     */
    positive(value, fieldName = 'Field') {
        const err = this.numeric(value, fieldName);
        if (err) return err;
        if (Number(value) <= 0) return `${fieldName} must be greater than 0.`;
        return null;
    },

    /**
     * Phone number check (Sri Lanka format)
     */
    phone(value) {
        if (!value) return null; // optional
        const re = /^(\+94|0)[0-9]{9}$/;
        const clean = value.replace(/[\s-]/g, '');
        return re.test(clean) ? null : 'Enter a valid phone number (e.g., +94771234567 or 0771234567).';
    },

    /**
     * Date in future check
     */
    futureDate(dateStr, fieldName = 'Date') {
        if (!dateStr) return `${fieldName} is required.`;
        const d = new Date(dateStr);
        const today = new Date(); today.setHours(0,0,0,0);
        if (d < today) return `${fieldName} must be today or in the future.`;
        return null;
    },

    /**
     * Date range check (end must be after start)
     */
    dateRange(startStr, endStr) {
        if (!startStr || !endStr) return 'Both start and end dates are required.';
        if (new Date(endStr) <= new Date(startStr)) return 'End date must be after start date.';
        return null;
    },

    /**
     * Working hours check (08:00 - 17:00)
     */
    workingHours(timeStr) {
        if (!timeStr) return 'Time is required.';
        const [h, m] = timeStr.split(':').map(Number);
        const minutes = h * 60 + m;
        if (minutes < 480 || minutes > 1020) {
            return 'Appointment time must be within working hours (08:00 AM – 05:00 PM).';
        }
        return null;
    },

    /**
     * URL check (optional)
     */
    url(value) {
        if (!value) return null;
        try { new URL(value); return null; }
        catch { return 'Please enter a valid URL (e.g., https://example.com).'; }
    },

    /**
     * Password strength check
     */
    password(value) {
        if (!value) return 'Password is required.';
        if (value.length < 6) return 'Password must be at least 6 characters.';
        return null;
    },

    /**
     * Password confirm match
     */
    passwordMatch(password, confirm) {
        if (!confirm) return 'Please confirm your password.';
        if (password !== confirm) return 'Passwords do not match.';
        return null;
    },

    /**
     * Tax rate must be 0-100
     */
    taxRate(value) {
        const n = Number(value);
        if (isNaN(n) || n < 0 || n > 100) return 'Tax rate must be between 0 and 100.';
        return null;
    },

    /**
     * Star rating check (1-5)
     */
    rating(value) {
        const n = Number(value);
        if (!Number.isInteger(n) || n < 1 || n > 5) return 'Rating must be an integer from 1 to 5.';
        return null;
    },

    /* ── DOM Helpers ─────────────────────────────────────────────────── */

    /**
     * Validate all fields in a form and show inline errors
     * validations: [{ field: 'fieldId', rules: ['required', 'email', ...] }]
     */
    validateForm(validations) {
        let isValid = true;
        this.clearErrors();
        for (const v of validations) {
            const el = document.getElementById(v.field);
            if (!el) continue;
            for (const rule of v.rules) {
                let error = null;
                if (typeof rule === 'function') {
                    error = rule(el.value);
                } else if (rule === 'required') {
                    error = this.required(el.value, v.label || v.field);
                } else if (rule === 'email') {
                    error = this.email(el.value);
                } else if (rule === 'password') {
                    error = this.password(el.value);
                }
                if (error) {
                    this.showFieldError(el, error);
                    isValid = false;
                    break;
                }
            }
        }
        return isValid;
    },

    showFieldError(el, message) {
        el.classList.add('is-invalid');
        const existing = el.parentNode.querySelector('.form-error');
        if (existing) { existing.textContent = message; existing.classList.add('visible'); }
        else {
            const span = document.createElement('span');
            span.className = 'form-error visible';
            span.textContent = message;
            el.parentNode.appendChild(span);
        }
    },

    clearErrors() {
        document.querySelectorAll('.form-control.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        document.querySelectorAll('.form-error.visible').forEach(el => {
            el.classList.remove('visible');
            el.textContent = '';
        });
    }
};

window.ValidationUtils = ValidationUtils;
