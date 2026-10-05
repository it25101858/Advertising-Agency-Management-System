/* AdFlow - Feedback Form Module */
const FeedbackForm = {
    _editId: null,
    _rating: 0,

    open(feedback = null) {
        this._editId = feedback?.id || null;
        this._rating = feedback?.rating || 0;
        Modal.setTitle('feedbackModal', feedback ? 'Edit Feedback' : 'Submit Feedback');
        const f = feedback || {};
        const user = StorageUtils.getUser();

        document.getElementById('feedbackModalBody').innerHTML = `
        <div class="form-group">
            <label class="form-label">Campaign</label>
            <input type="text" id="fbCampaign" class="form-control" value="${f.campaignTitle || f.campaign || ''}" placeholder="5G Mega Launch 2026">
        </div>
        <div class="form-group">
            <label class="form-label">Rating <span class="required">*</span></label>
            <div class="star-rating" id="starRating">
                ${[1,2,3,4,5].map(i => `
                    <span class="star ${i <= this._rating ? 'filled' : 'empty'}"
                          onclick="FeedbackForm.setRating(${i})"
                          onmouseover="FeedbackForm.hoverStar(${i})"
                          onmouseout="FeedbackForm.resetHover()">
                        ${i <= this._rating ? '⭐' : '☆'}
                    </span>`).join('')}
            </div>
            <input type="hidden" id="fbRating" value="${this._rating}">
        </div>
        <div class="form-group">
            <label class="form-label">Comments <span class="required">*</span></label>
            <textarea id="fbComment" class="form-control" rows="4" placeholder="Share your detailed feedback..." minlength="10" required>${f.comment || ''}</textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="Modal.close('feedbackModal')">Cancel</button>
            <button class="btn btn-primary" onclick="FeedbackForm.save()">${feedback ? 'Update' : 'Submit Feedback'}</button>
        </div>`;

        Modal.open('feedbackModal');
    },

    setRating(n) {
        this._rating = n;
        document.getElementById('fbRating').value = n;
        const stars = document.querySelectorAll('#starRating .star');
        stars.forEach((s, i) => {
            s.className = `star ${i < n ? 'filled' : 'empty'}`;
            s.textContent = i < n ? '⭐' : '☆';
        });
    },

    hoverStar(n) {
        const stars = document.querySelectorAll('#starRating .star');
        stars.forEach((s, i) => { s.textContent = i < n ? '⭐' : '☆'; });
    },

    resetHover() { this.setRating(this._rating); },

    getData() {
        return {
            id:       this._editId,
            campaign: document.getElementById('fbCampaign')?.value?.trim(),
            rating:   Number(document.getElementById('fbRating')?.value || 0),
            comment:  document.getElementById('fbComment')?.value?.trim()
        };
    },

    async save() {
        const data = this.getData();
        if (!data.rating || data.rating < 1 || data.rating > 5) { Toast.error('Please select a rating (1–5 stars).'); return; }
        if (!data.comment || data.comment.length < 10) { Toast.error('Please write a comment (min. 10 characters).'); return; }

        const btn = document.querySelector('#feedbackModal .btn-primary');
        await Loader.withButton(btn, async () => {
            try {
                const action = this._editId ? 'update' : 'create';
                await FeedbackApi[action](data);
                Toast.success(this._editId ? 'Feedback updated.' : 'Feedback submitted! Thank you.');
                Modal.close('feedbackModal');
                if (typeof loadFeedback === 'function') loadFeedback();
            } catch (err) {
                Toast.error(err.message || 'Failed to submit feedback.');
            }
        });
    }
};
window.FeedbackForm = FeedbackForm;
