import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sale.app',
  appName: 'sale',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
  },
};

export default config;
