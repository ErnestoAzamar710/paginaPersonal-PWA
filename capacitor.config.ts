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
    },
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#000000FF", // Negro con alpha (formato ARGB)
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true, // Cambia a true para mostrar spinner
      spinnerColor: "#FFFFFF", // Color blanco
      splashFullScreen: true,
      splashImmersive: false,
    }
  }
};

export default config;
