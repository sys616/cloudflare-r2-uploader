<?php
// إعدادات إظهار الأخطاء - يجب وضعها في بداية الملف
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;
use Aws\Exception\AwsException;

// تحميل متغيرات البيئة من ملف .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// تسجيل معلومات الملفات المرفوعة للتشخيص
file_put_contents('upload_log.txt', date('Y-m-d H:i:s') . ' - ' . json_encode($_FILES) . "\n", FILE_APPEND);

// التحقق من طلب AJAX
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'طريقة طلب غير صالحة']);
    exit;
}

// التحقف من وجود ملف للرفع
if (!isset($_FILES['fileToUpload']) || $_FILES['fileToUpload']['error'] !== UPLOAD_ERR_OK) {
    $errorMessage = 'حدث خطأ أثناء رفع الملف: ';
    
    if (isset($_FILES['fileToUpload'])) {
        switch ($_FILES['fileToUpload']['error']) {
            case UPLOAD_ERR_INI_SIZE:
                $errorMessage .= 'حجم الملف أكبر من الحد المسموح به في php.ini';
                break;
            case UPLOAD_ERR_FORM_SIZE:
                $errorMessage .= 'حجم الملف أكبر من الحد المسموح به في النموذج';
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMessage .= 'تم رفع جزء من الملف فقط';
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMessage .= 'لم يتم رفع أي ملف';
                break;
            default:
                $errorMessage .= 'خطأ غير معروف';
        }
    }
    
    echo json_encode(['error' => $errorMessage]);
    exit;
}

try {
    // إعداد عميل S3 لـ Cloudflare R2
    $s3Client = new S3Client([
        'version' => 'latest',
        'region' => $_ENV['AWS_DEFAULT_REGION'],
        'endpoint' => $_ENV['AWS_ENDPOINT'],
        'credentials' => [
            'key' => $_ENV['AWS_ACCESS_KEY_ID'],
            'secret' => $_ENV['AWS_SECRET_ACCESS_KEY'],
        ],
    ]);
    
    // الحصول على معلومات الملف
    $file = $_FILES['fileToUpload'];
    $fileName = basename($file['name']);
    $fileType = $file['type'];
    $fileTmpPath = $file['tmp_name'];
    
    // إنشاء اسم فريد للملف لتجنب استبدال الملفات الموجودة
    $uniqueFileName = time() . '_' . $fileName;
    
    // رفع الملف إلى Cloudflare R2
    $result = $s3Client->putObject([
        'Bucket' => $_ENV['AWS_BUCKET'],
        'Key' => $uniqueFileName,
        'Body' => fopen($fileTmpPath, 'r'),
        'ContentType' => $fileType,
        'ACL' => 'public-read',
    ]);
    
    // إنشاء رابط للملف المرفوع
    $fileUrl = rtrim($_ENV['PUBLIC_BUCKET_URL'], '/') . '/' . $uniqueFileName;
    
    // إرجاع النتيجة
    echo json_encode([
        'success' => true,
        'message' => 'تم رفع الملف بنجاح',
        'file' => [
            'name' => $fileName,
            'url' => $fileUrl,
            'size' => $file['size'],
            'type' => $fileType,
            'uploaded_at' => date('Y-m-d H:i:s'),
        ],
    ]);
    
} catch (S3Exception $e) {
    echo json_encode(['error' => 'خطأ في S3: ' . $e->getMessage()]);
} catch (AwsException $e) {
    echo json_encode(['error' => 'خطأ في AWS: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['error' => 'خطأ غير متوقع: ' . $e->getMessage()]);
}