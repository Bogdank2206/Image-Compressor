export async function handleDownload(link: string) {
    try {
        const response = await fetch(link);

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server error');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'compressed-images.html';

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Ошибка при скачивании:', error);
        alert('Не удалось скачать файл.');
    }
}