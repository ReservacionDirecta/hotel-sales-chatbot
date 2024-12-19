import { LocalWebCache } from 'whatsapp-web.js';

export class CustomLocalWebCache extends LocalWebCache {
    async persist(indexHtml: string) {
        try {
            console.log('Attempting to extract WhatsApp Web version...');

            // Array of possible regex patterns to match WhatsApp Web version
            const patterns = [
                /manifest-(\d+\.\d+\.\d+)\.js/,
                /manifest-(\d+\.\d+\.\d+)\.json/,
                /version["']:\s*["'](\d+\.\d+\.\d+)["']/,
                /WhatsApp\/(\d+\.\d+\.\d+)/,
                /(?:whatsapp|version)[^"]*"(\d+\.\d+\.\d+)"/i,
                /\b(\d{1,2}\.\d{4}\.\d{1,3})\b/
            ];

            for (const pattern of patterns) {
                const match = indexHtml.match(pattern);
                if (match && match[1]) {
                    console.log(`Found version: ${match[1]} using pattern: ${pattern}`);
                    return match[1];
                }
            }

            // If no version found, use recent known versions
            const knownVersions = [
                '2.2401.6',
                '2.2402.1',
                '2.2403.0',
                '2.2404.1'
            ];

            console.warn('Could not detect WhatsApp Web version, using latest known version');
            return knownVersions[knownVersions.length - 1];

        } catch (error) {
            console.error('Error in CustomLocalWebCache:', error);
            return '2.2404.1'; // Latest known stable version
        }
    }
}
