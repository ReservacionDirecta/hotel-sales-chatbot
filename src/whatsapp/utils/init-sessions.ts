import { mkdir } from 'fs/promises';
import { join } from 'path';

export async function initializeSessionsDirectory() {
  const sessionsPath = join(process.cwd(), 'whatsapp-sessions');
  
  try {
    await mkdir(sessionsPath, { recursive: true });
    console.log('WhatsApp sessions directory created successfully');
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error('Error creating WhatsApp sessions directory:', error);
      throw error;
    }
  }
  
  return sessionsPath;
}
