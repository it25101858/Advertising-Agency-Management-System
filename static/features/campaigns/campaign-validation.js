/* AdFlow - Campaign Validation */
const CampaignValidation = {
    validate(data) {
        const errors = [];
        if (!data.name?.trim())   errors.push('Campaign name is required.');
        if (!data.client?.trim()) errors.push('Client name is required.');
        if (!data.start)          errors.push('Start date is required.');
        if (!data.end)            errors.push('End date is required.');
        if (data.start && data.end) {
            const rangeErr = ValidationUtils.dateRange(data.start, data.end);
            if (rangeErr) errors.push(rangeErr);
        }
        const budgetErr = ValidationUtils.positive(data.budget, 'Budget');
        if (budgetErr) errors.push(budgetErr);
        else if (data.budget % 100 !== 0) errors.push('Budget must be in multiples of 100.');
        return errors;
    }
};
window.CampaignValidation = CampaignValidation;
