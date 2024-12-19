import { RemoteWebCache } from 'whatsapp-web.js';

export class CustomWebCache extends RemoteWebCache {
    async getLatestWebVersion(): Promise<string> {
        // Return a known working version
        return '2.2404.7';
    }

    async download(): Promise<void> {
        // No-op as we're using a static version
        return;
    }
}
