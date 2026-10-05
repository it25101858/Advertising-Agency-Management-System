window.Utils = {
    formatCurrency(amount) {
        return 'LKR ' + Number(amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });
    },
    formatDate(dateStr) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `glass-panel toast-box toast-${type}`;
        toast.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:14px 20px;z-index:9999;border-left:4px solid ' + 
            (type === 'success' ? '#06d6a0' : '#ef476f') + ';animation:fadeIn 0.3s ease;';
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }
};
