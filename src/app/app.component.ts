import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private NotificationService: NotificationService = inject(NotificationService);
  private platform: Platform = inject(Platform);
  public isLoading: boolean = true; // Añadida propiedad para controlar el estado de carga

  constructor() {
    this.showSplash();
  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      this.NotificationService.init();
      // Ocultar splash y loading después de inicialización
      setTimeout(() => {
        this.hideSplash();
        this.isLoading = false; // Cambiamos el estado cuando todo está listo
      }, 3000);
    });  
  }

  private async showSplash() {
    await SplashScreen.show({
      autoHide: false,
      showDuration: 3000
    });
  
    // Solo ejecutar en dispositivos nativos (evitar error en web)
    if (!this.platform.is('capacitor')) {
      return;
    }
  
    try {
      await (SplashScreen as any).setBackgroundColor({ color: '#000000FF' });
    } catch (error) {
      console.log('Función no disponible en web:', error);
    }
  }

  private async hideSplash() {
    await SplashScreen.hide();
  }
}