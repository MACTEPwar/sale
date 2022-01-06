import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sale.app',
  appName: 'sale',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
    androidScheme: 'http',
    url: 'http://192.168.15.26:4200',
  },
};

export default config;
