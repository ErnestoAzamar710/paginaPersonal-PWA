import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut, User } from 'firebase/auth';
import { Preferences } from '@capacitor/preferences'; // Importar para eliminar datos del usuario
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  user: any = null;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadUserFromPreferences();
  }

  // Cargar usuario desde almacenamiento local
  async loadUserFromPreferences() {
    const { value } = await Preferences.get({ key: 'user' });
    if (value) {
      this.user = JSON.parse(value);
      console.log('Usuario cargado:', this.user);
    } else {
      console.log('No hay usuario almacenado');
      this.router.navigate(['/login']);
    }
  }

  // Método para cerrar sesión
  async logout() {
    try {
      // Eliminar datos del usuario
      await Preferences.remove({ key: 'user' });
      
      // Mostrar confirmación
      const toast = await this.toastController.create({
        message: 'Sesión cerrada correctamente',
        duration: 2000,
        position: 'top'
      });
      await toast.present();
      
      // Redirigir al login
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      const toast = await this.toastController.create({
        message: 'Error al cerrar sesión',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }
}