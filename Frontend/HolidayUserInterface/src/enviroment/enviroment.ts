export const environment = {
  isProduction: false,
  apiUrl: 'http://192.168.1.140:5144/api',  // Primary: Windows PC HTTP (no certificate issues)
  backupApiUrl: 'http://localhost:5144/api',  // Backup: localhost for testing

  // Images urls
  imageUrl: 'http://192.168.1.140:5144',
  backupImageUrl: 'http://localhost:5144'
};
