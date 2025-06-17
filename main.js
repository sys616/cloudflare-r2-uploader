// main.js

document.addEventListener('DOMContentLoaded', function () {

    // رفع الملف AJAX
    const uploadForm = document.getElementById('uploadForm');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const resultContainer = document.getElementById('resultContainer');
    const fileUrl = document.getElementById('fileUrl');
    const uploadSpeed = document.getElementById('uploadSpeed');
    const uploadedSize = document.getElementById('uploadedSize');

    let xhr = null;
    const cancelBtn = document.getElementById('cancelUploadBtn');

    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const fileInput = document.getElementById('fileToUpload');
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('fileToUpload', file);

        progressContainer.classList.remove('d-none');
        progressBar.style.width = '0%';
        progressBar.innerText = '0%';
        uploadSpeed.innerText = 'السرعة: 0 KB/s';
        uploadedSize.innerText = `0 KB / ${(file.size / 1024).toFixed(2)} KB`;
        resultContainer.classList.add('d-none');

        let lastLoaded = 0;
        let lastTime = Date.now();

        xhr = new XMLHttpRequest();
        xhr.open('POST', 'upload.php', true);
        // إظهار زر الإلغاء
        cancelBtn.classList.remove('d-none');
        cancelBtn.disabled = false;

        cancelBtn.onclick = function() {
            if (xhr) {
                xhr.abort();
                cancelBtn.classList.add('d-none');
                progressContainer.classList.add('d-none');
                resultContainer.classList.add('d-none');
                progressBar.style.width = '0%';
                progressBar.innerText = '0%';
            }
        };
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percent + '%';
                progressBar.innerText = percent + '%';
                uploadedSize.innerText = `${(e.loaded / 1024).toFixed(2)} KB / ${(e.total / 1024).toFixed(2)} KB`;
                const now = Date.now();
                const speed = ((e.loaded - lastLoaded) / 1024) / ((now - lastTime) / 1000);
                uploadSpeed.innerText = `السرعة: ${speed.toFixed(2)} KB/s`;
                lastLoaded = e.loaded;
                lastTime = now;
            }
        };
        xhr.onload = function () {
            progressContainer.classList.add('d-none');
            if (xhr.status === 200) {
                try {
                    const res = JSON.parse(xhr.responseText);
                    if (res.success && res.file && res.file.url) {
                        fileUrl.value = res.file.url;
                        resultContainer.classList.remove('d-none');
                    } else {
                        fileUrl.href = '#';
                        fileUrl.innerText = '';
                        resultContainer.classList.add('d-none');
                        alert(res.error || 'حدث خطأ أثناء رفع الملف!');
                    }
                } catch {
                    alert('حدث خطأ غير متوقع!');
                }
            } else {
                alert('فشل الاتصال بالخادم!');
            }
        };
        xhr.onerror = function () {
            progressContainer.classList.add('d-none');
            alert('حدث خطأ في الاتصال بالخادم!');
        };
        xhr.send(formData);
    });

    // زر النسخ (يعمل دائمًا بعد تحميل الصفحة)
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            if (fileUrl.value) {
                navigator.clipboard.writeText(fileUrl.value).then(() => {
                    copyBtn.innerHTML = '<i class="bi bi-clipboard-check"></i>';
                    copyBtn.classList.remove('btn-outline-success');
                    copyBtn.classList.add('btn-success');
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                        copyBtn.classList.remove('btn-success');
                        copyBtn.classList.add('btn-outline-success');
                    }, 1200);
                });
            }
        });
    }

    // منطق تبديل اللغة
    const langToggle = document.getElementById('langToggle');
    const htmlRoot = document.getElementById('htmlRoot');
    function setLang(lang) {
        if (lang === 'en') {
            htmlRoot.setAttribute('lang', 'en');
            htmlRoot.setAttribute('dir', 'ltr');
        } else {
            htmlRoot.setAttribute('lang', 'ar');
            htmlRoot.setAttribute('dir', 'rtl');
        }
        document.querySelectorAll('[data-ar][data-en]').forEach(el => {
            el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ar');
        });
        localStorage.setItem('lang', lang);
    }
    if (langToggle) {
        langToggle.addEventListener('click', function () {
            const current = htmlRoot.getAttribute('lang') === 'ar' ? 'en' : 'ar';
            setLang(current);
        });
    }
    // عند تحميل الصفحة، طبّق اللغة المحفوظة
    setLang(localStorage.getItem('lang') || 'ar');
});
