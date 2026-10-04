/* AdFlow - Appointment Validation */
const AppointmentValidation = {
    validate(data) {
        const errors = [];
        if (!data.clientName?.trim()) errors.push('Client name is required.');
        if (!data.date) errors.push('Meeting date is required.');
        else {
            const err = ValidationUtils.futureDate(data.date, 'Meeting date');
            if (err) errors.push(err);
        }
        if (!data.time) errors.push('Meeting time is required.');
        else {
            const err = ValidationUtils.workingHours(data.time);
            if (err) errors.push(err);
        }
        if (!data.purpose?.trim()) errors.push('Purpose is required.');
        if (!data.type) errors.push('Meeting type is required.');
        return errors;
    }
};
window.AppointmentValidation = AppointmentValidation;
