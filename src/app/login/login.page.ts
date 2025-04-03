import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { INotification } from '../models/notification.model';
import { NotificationService } from '../services/notification.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule]
})
export class LoginPage {
  private notificationService = inject(NotificationService);
  private toastController = inject(ToastController);
  private router = inject(Router);
  
  user = {
    displayName: '',
    email: '',
    uid: 'UID_EJEMPLO',
    photoURL: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  };

  async login() {
    // Guardar usuario
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(this.user)
    });
  
    // Crear fecha válida (2 segundos en el futuro)
    const notificationDate = new Date();
    notificationDate.setSeconds(notificationDate.getSeconds() + 2);
  
    const notification: INotification = {
      title: 'Inicio de sesión exitoso',
      body: `Bienvenido ${this.user.email}`,
      date: notificationDate.toISOString(), // Usar ISO string
      url: 'https://tudominio.com/inicio'
    };
  
    try {
      const success = await this.notificationService.sendNotification(notification);
      if (success) {
        this.router.navigate(['/tabs']);
      } else {
        await this.showToast('No se pudo enviar la notificación', 'warning');
      }
    } catch (error) {
      await this.showToast('Error al comunicarse con el servidor', 'danger');
      console.error('Error completo en login:', error);
    }
  }
  
  private async showToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}