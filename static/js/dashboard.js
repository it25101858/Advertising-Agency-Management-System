document.addEventListener('DOMContentLoaded', async () => {
    const user = ApiClient.getCurrentUser();
    if (user) {
        const nameEl = document.getElementById('userDisplayName');
        if (nameEl) nameEl.innerText = user.fullName;
        const roleEl = document.getElementById('userDisplayRole');
        if (roleEl) roleEl.innerText = user.role.replace(/_/g, ' ');
    }

    try {
        const [camps, appts, tasks, invs] = await Promise.all([
            CampaignApi.getAll(),
            AppointmentApi.getAll(),
            TaskApi.getAll(),
            InvoiceApi.getAll()
        ]);
        if (camps) document.getElementById('statCampaigns').innerText = camps.data.length;
        if (appts) document.getElementById('statAppointments').innerText = appts.data.length;
        if (tasks) document.getElementById('statTasks').innerText = tasks.data.length;
        if (invs) document.getElementById('statInvoices').innerText = invs.data.length;
    } catch(e) {}
});
