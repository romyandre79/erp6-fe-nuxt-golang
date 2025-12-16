import { ref } from 'vue';
import { useApi } from './useApi';

export const useBackupRestore = () => {
    const { post, donlotFile } = useApi();
    const loading = ref(false);
    const progress = ref(0);
    const error = ref('');
    const success = ref('');

    const backupDatabase = async () => {
        try {
            loading.value = true;
            progress.value = 10;
            // Fake progress for backup since we don't get real-time feedback from download
            const timer = setInterval(() => {
                if (progress.value < 90) progress.value += 10;
            }, 500);

            // Use donlotFile which is specifically designed for downloading files
            await donlotFile('/api/admin/db/backup', {}, 'backup.sql');

            clearInterval(timer);
            progress.value = 100;
            
            success.value = 'Backup downloaded successfully';
            setTimeout(() => success.value = '', 3000);
        } catch (e: any) {
            error.value = e.message || 'Backup Failed';
            setTimeout(() => error.value = '', 3000);
        } finally {
            loading.value = false;
            progress.value = 0;
        }
    };

    const restoreDatabase = async (file: File) => {
        try {
            loading.value = true;
            progress.value = 0;
            error.value = '';

            const formData = new FormData();
            formData.append('file', file);

            // XMLHttpRequest to track upload progress
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/admin/db/restore');
                const token = localStorage.getItem('token');
                if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        progress.value = Math.round((event.loaded / event.total) * 100);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(xhr.statusText || 'Upload failed'));
                    }
                };

                xhr.onerror = () => reject(new Error('Network error'));
                xhr.send(formData);
            });

            success.value = 'Database restored successfully';
            setTimeout(() => success.value = '', 3000);
        } catch (e: any) {
            error.value = e.message || 'Restore Failed';
            setTimeout(() => error.value = '', 3000);
        } finally {
            loading.value = false;
            progress.value = 0;
        }
    };

    return {
        backupDatabase,
        restoreDatabase,
        loading,
        progress,
        error,
        success
    };
};
