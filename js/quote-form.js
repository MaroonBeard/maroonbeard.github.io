/* ============================================
   Quote Form - Validation & File Upload
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quoteForm');
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('artwork');
    const fileList = document.getElementById('fileList');
    const formSuccess = document.getElementById('formSuccess');

    let uploadedFiles = [];

    if (!form) return;

    // --- File Upload Handling ---
    if (fileUpload && fileInput) {
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });

        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('dragover');
        });

        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', () => {
            handleFiles(fileInput.files);
            fileInput.value = '';
        });
    }

    function handleFiles(files) {
        const maxSize = 10 * 1024 * 1024; // 10MB

        Array.from(files).forEach(file => {
            if (file.size > maxSize) {
                alert(`"${file.name}" exceeds the 10MB limit and was not added.`);
                return;
            }
            if (uploadedFiles.length >= 5) {
                alert('Maximum 5 files allowed.');
                return;
            }
            uploadedFiles.push(file);
        });

        renderFileList();
    }

    function renderFileList() {
        if (!fileList) return;
        fileList.innerHTML = '';

        uploadedFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'file-list-item';

            const name = document.createElement('span');
            name.textContent = `${file.name} (${formatSize(file.size)})`;

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.innerHTML = '&times;';
            removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
            removeBtn.addEventListener('click', () => {
                uploadedFiles.splice(index, 1);
                renderFileList();
            });

            item.appendChild(name);
            item.appendChild(removeBtn);
            fileList.appendChild(item);
        });
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // --- Form Validation ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;

        // Required fields
        const requiredFields = [
            { id: 'name', message: 'Please enter your name.' },
            { id: 'email', message: 'Please enter a valid email address.' },
            { id: 'product-type', message: 'Please select a product type.' },
            { id: 'description', message: 'Please describe your project.' }
        ];

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input || !input.value.trim()) {
                showError(input, field.message);
                isValid = false;
            }
        });

        // Email format check
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }
        }

        if (!isValid) {
            const firstError = form.querySelector('.form-group.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Form is valid - show success
        // TODO: Wire up form submission service (Formspree, EmailJS, etc.)
        form.style.display = 'none';
        formSuccess.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function showError(input, message) {
        if (!input) return;
        const group = input.closest('.form-group');
        if (group) {
            group.classList.add('has-error');
            input.classList.add('error');
            const errorSpan = group.querySelector('.form-error');
            if (errorSpan) errorSpan.textContent = message;
        }
    }

    function clearErrors() {
        form.querySelectorAll('.form-group.has-error').forEach(group => {
            group.classList.remove('has-error');
        });
        form.querySelectorAll('.form-control.error').forEach(input => {
            input.classList.remove('error');
        });
    }
});
