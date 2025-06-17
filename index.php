<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
<!DOCTYPE html>
<html lang="ar" dir="rtl" id="htmlRoot">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare R2 Uploader</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body class="d-flex align-items-center min-vh-100" style="background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%);">
    <div class="position-fixed top-0 end-0 m-4 d-flex gap-2" style="z-index:999;">
        <button id="langToggle" class="btn btn-outline-light shadow-sm" title="Change Language / تغيير اللغة">
            <i class="bi bi-translate"></i>
        </button>

    </div>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card glass-card shadow-lg border-0" style="max-width:420px;width:100%;backdrop-filter:blur(8px);background:rgba(255,255,255,0.80);">
            <div class="card-header text-center bg-transparent border-0 pb-0">
                <div class="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow" style="background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%); width:84px; height:84px;">
                    <img src="logo.svg" alt="شعار الموقع" style="height:48px;filter:drop-shadow(0 2px 8px #0002);">
                </div>
                <h3 class="fw-bold mb-4" style="color:#4e54c8;" data-ar="رفع الملفات إلى Cloudflare R2" data-en="Cloudflare R2 Uploader">رفع الملفات إلى Cloudflare R2</h3>
                <p class="lead mb-0" style="color:#222; font-size:1.05rem;" data-ar="مرحبًا بك في خدمة رفع الملفات السحابية العصرية والآمنة.<br>ارفع ملفاتك واحصل على رابط مباشر لمشاركتها فورًا!" data-en="Welcome to the modern and secure cloud file upload service.<br>Upload your files and get a direct link instantly!">مرحبًا بك في خدمة رفع الملفات السحابية العصرية والآمنة.<br>ارفع ملفاتك واحصل على رابط مباشر لمشاركتها فورًا!</p>
            </div>
            <div class="card-body p-4">
                <form id="uploadForm" enctype="multipart/form-data">
                    <div class="mb-4">
                        <label for="fileToUpload" class="form-label fw-semibold" data-ar="اختر ملفًا للرفع" data-en="Choose a file to upload">اختر ملفًا للرفع</label>
                        <input type="file" class="form-control form-control-lg" id="fileToUpload" name="fileToUpload" required>
                    </div>
                    <div class="mb-3 d-none" id="progressContainer">
                        <label class="form-label" data-ar="تقدم الرفع" data-en="Upload Progress">تقدم الرفع</label>
                        <div class="progress" style="height:18px;">
                            <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated bg-gradient" 
                                role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                0%
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mt-2">
                            <small id="uploadSpeed" data-ar="السرعة: 0 KB/s" data-en="Speed: 0 KB/s">السرعة: 0 KB/s</small>
                            <small id="uploadedSize">0 KB / 0 KB</small>
                        </div>
                    </div>
                    <div class="d-grid gap-2">
                        <div class="d-flex gap-2 justify-content-center">
                            <button type="submit" class="btn btn-primary btn-lg shadow fw-bold" style="background: linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%); border: none;" data-ar="رفع الملف" data-en="Upload File">رفع الملف <i class="bi bi-cloud-arrow-up ms-2"></i></button>
                            <button type="button" id="cancelUploadBtn" class="btn btn-outline-danger btn-lg shadow fw-bold d-none" data-ar="إلغاء" data-en="Cancel"><i class="bi bi-x-circle"></i> إلغاء</button>
                        </div>
                    </div>
                </form>
                <div class="mt-4 d-none" id="resultContainer">
                    <div class="alert alert-success text-center">
                        <h5 class="mb-2" data-ar="تم الرفع بنجاح!" data-en="Upload Successful!">تم الرفع بنجاح!</h5>
                        <div class="input-group">
                            <input id="fileUrl" type="text" class="form-control text-center bg-white border-0 fw-bold" style="font-size:1rem;" readonly>
                            <button class="btn btn-outline-success" type="button" id="copyBtn" title="نسخ الرابط" data-ar="نسخ" data-en="Copy"><i class="bi bi-clipboard"></i></button>
                        </div>
                        <small class="text-success mt-2 d-block" data-ar="انسخ الرابط وشاركه مع من تريد" data-en="Copy the link and share it!">انسخ الرابط وشاركه مع من تريد</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="main.js"></script>
</body>
</html>