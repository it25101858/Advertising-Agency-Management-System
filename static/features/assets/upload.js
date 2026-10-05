/* AdFlow - Assets Upload Module */
const Upload = {
    setupZone(zoneId, fileInputId) {
        const zone  = document.getElementById(zoneId);
        const input = document.getElementById(fileInputId);
        if (!zone || !input) return;

        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            const files = e.dataTransfer?.files;
            if (files?.length) { input.files = files; handleFileSelected(input); }
        });

        input.addEventListener('change', () => handleFileSelected(input));
    }
};

function handleFileSelected(input) {
    const file = input.files?.[0];
    if (!file) return;
    const preview = document.getElementById('uploadPreview');
    if (!preview) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    preview.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--blue-soft);border-radius:8px;border:1px solid var(--border-blue)">
        <div style="font-size:2rem">${isImage ? '🖼️' : isVideo ? '🎬' : '📄'}</div>
        <div>
            <div style="font-weight:700;font-size:0.9rem">${file.name}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">${FormatUtils.fileSize(file.size)} • ${file.type || 'Unknown type'}</div>
        </div>
        <button class="btn btn-sm btn-ghost" style="margin-left:auto" onclick="clearUpload()">✕ Remove</button>
    </div>`;

    if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cssText = 'max-height:120px;border-radius:8px;margin-top:8px;object-fit:contain';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

function clearUpload() {
    const input = document.getElementById('assetFile');
    const preview = document.getElementById('uploadPreview');
    if (input) input.value = '';
    if (preview) preview.innerHTML = '';
}

window.Upload = Upload;
window.handleFileSelected = handleFileSelected;
window.clearUpload = clearUpload;
