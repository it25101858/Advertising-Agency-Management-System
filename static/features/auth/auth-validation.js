/* ============================================================================
   AdFlow - Auth Validation Module
   ============================================================================ */

const AuthValidation = {
    validateLogin(email, password) {
        const errors = [];
        const emailErr = ValidationUtils.email(email);
        if (emailErr) errors.push(emailErr);
        const passErr = ValidationUtils.password(password);
        if (passErr) errors.push(passErr);
        return errors;
    },

    validateRegister(data) {
        const errors = [];
        const nameErr = ValidationUtils.minLength(data.fullName, 2, 'Full Name');
        if (nameErr) errors.push(nameErr);
        const emailErr = ValidationUtils.email(data.email);
        if (emailErr) errors.push(emailErr);
        const passErr = ValidationUtils.password(data.password);
        if (passErr) errors.push(passErr);
        return errors;
    }
};

window.AuthValidation = AuthValidation;
