import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'holaIONIC',
  webDir: 'www',
  plugins: {
    CapacitorHttp:{
      enabled: true
    },
    PushNotifications:{
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
