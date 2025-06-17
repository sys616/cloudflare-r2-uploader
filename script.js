document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileToUpload');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const uploadSpeed = document.getElementById('uploadSpeed');
    const uploadedSize = document.getElementById('uploadedSize');
    const resultContainer = document.getElementById('resultContainer');
    const fileUrl = document.getElementById('fileUrl');
    const recentFiles = document.getElementById('recentFiles');
    
    // تخزين الملفات المرفوعة مؤخرًا في التخزين المحلي
    let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    
    // عرض الملفات المرفوعة مؤخرًا
    function displayRecentFiles() {
        recentFiles.innerHTML = '';
        
        if (uploadedFiles.length === 0) {
            recentFiles.innerHTML = '<div class="text-center p-3">لا توجد ملفات مرفوعة حتى الآن</div>';
            return;
        }
        
        uploadedFiles.forEach(function(file, index) {
            const fileItem = document.createElement('a');
            fileItem.href = file.url;
            fileItem.target = '_blank';
            fileItem.className = 'list-group-item list-group-item-action file-item d-flex align-items-center';
            
            // تحديد أيقونة الملف بناءً على نوعه
            let fileIconClass = 'bi bi-file';
            if (file.type.includes('image')) {
                fileIconClass = 'bi bi-file-image';
            } else if (file.type.includes('pdf')) {
                fileIconClass = 'bi bi-file-pdf';
            } else if (file.type.includes('word') || file.type.includes('document')) {
                fileIconClass = 'bi bi-file-word';
            } else if (file.type.includes('excel') || file.type.includes('sheet')) {
                fileIconClass = 'bi bi-file-excel';
            } else if (file.type.includes('video')) {
                fileIconClass = 'bi bi-file-play';
            } else if (file.type.includes('audio')) {
                fileIconClass = 'bi bi-file-music';
            } else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar')) {
                fileIconClass = 'bi bi-file-zip';
            }
            
            // تنسيق حجم الملف
            const fileSize = formatFileSize(file.size);
            
            fileItem.innerHTML = `
                <div class="file-icon"><i class="${fileIconClass}"></i></div>
                <div class="file-info flex-grow-1">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">${fileSize} • ${file.uploaded_at}</div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-danger delete-file" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            
            recentFiles.appendChild(fileItem);
        });
        
        // إضافة مستمعي الأحداث لأزرار الحذف
        document.querySelectorAll('.delete-file').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                uploadedFiles.splice(index, 1);
                localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                displayRecentFiles();
            });
        });
    }
    
    // تنسيق حجم الملف
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // حساب سرعة الرفع
    function calculateSpeed(loaded, total, startTime) {
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000; // بالثواني
        const speed = loaded / elapsedTime; // بايت/ثانية
        
        return formatFileSize(speed) + '/s';
    }
    
    // عرض الملفات المرفوعة مؤخرًا عند تحميل الصفحة
    displayRecentFiles();
    
    // إضافة مستمع الحدث لنموذج الرفع
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = fileInput.files[0];
        if (!file) {
            alert('الرجاء اختيار ملف للرفع');
            return;
        }
        
        const formData = new FormData();
        formData.append('fileToUpload', file);
        
        // إظهار شريط التقدم
        progressContainer.classList.remove('d-none');
        resultContainer.classList.add('d-none');
        
        // إنشاء طلب AJAX
        const xhr = new XMLHttpRequest();
        const startTime = new Date().getTime();
        
        // مراقبة تقدم الرفع
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percentComplete + '%';
                progressBar.textContent = percentComplete + '%';
                progressBar.setAttribute('aria-valuenow', percentComplete);
                
                // تحديث سرعة الرفع وحجم الملف المرفوع
                uploadSpeed.textContent = 'السرعة: ' + calculateSpeed(e.loaded, e.total, startTime);
                uploadedSize.textContent = formatFileSize(e.loaded) + ' / ' + formatFileSize(e.total);
            }
        });
        
        // معالجة استجابة الخادم
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    
                    if (response.success) {
                        // إظهار رسالة النجاح
                        resultContainer.classList.remove('d-none');
                        fileUrl.href = response.file.url;
                        fileUrl.textContent = response.file.url;
                        
                        // إضافة الملف إلى قائمة الملفات المرفوعة مؤخرًا
                        uploadedFiles.unshift(response.file);
                        
                        // الاحتفاظ بآخر 10 ملفات فقط
                        if (uploadedFiles.length > 10) {
                            uploadedFiles = uploadedFiles.slice(0, 10);
                        }
                        
                        // حفظ القائمة في التخزين المحلي
                        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                        
                        // تحديث قائمة الملفات المرفوعة مؤخرًا
                        displayRecentFiles();
                        
                        // إعادة تعيين النموذج
                        uploadForm.reset();
                    } else {
                        alert('خطأ: ' + response.error);
                    }
                } catch (e) {
                    alert('حدث خطأ أثناء معالجة استجابة الخادم');
                    console.error(e);
                }
            } else {
                alert('حدث خطأ أثناء رفع الملف. الرجاء المحاولة مرة أخرى.');
            }
        });
        
        // معالجة أخطاء الشبكة
        xhr.addEventListener('error', function() {
            alert('حدث خطأ في الشبكة أثناء رفع الملف. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
        });
        
        // إرسال الطلب
        xhr.open('POST', 'upload.php', true);
        xhr.send(formData);
    });
});