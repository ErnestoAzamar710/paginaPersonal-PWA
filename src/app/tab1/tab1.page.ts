import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut, User } from 'firebase/auth';
import { Preferences } from '@capacitor/preferences'; // Importar para eliminar datos del usuario

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  user: any = null; // Variable para almacenar los datos del usuario

  constructor(private cdRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    const auth = getAuth();

    // Verificar si hay un usuario actual en Firebase
    if (auth.currentUser) {
      this.user = auth.currentUser; // Si hay un usuario en Firebase
    } else {
      // Si no hay usuario en Firebase, intentar cargar desde Preferences
      this.loadUserFromPreferences();
    }

    console.log('Usuario obtenido:', this.user); // Añadido para depurar

    this.cdRef.detectChanges();
  }

  // Cargar el usuario desde Preferences (almacenamiento local)
  async loadUserFromPreferences() {
    const storedUser = await Preferences.get({ key: 'user' });
    console.log(storedUser.value)
    if (storedUser.value) {
      this.user = JSON.parse(storedUser.value); // Restaurar el usuario
      console.log('Usuario cargado desde Preferences:', this.user);
    } else {
      console.log('No se encontró el usuario en Preferences');
    }
  }

  // Método para cerrar sesión
  async logout() {
    const auth = getAuth();

    try {
      await signOut(auth); // Cerrar sesión en Firebase
      console.log('Sesión cerrada');

      // Eliminar los datos del usuario almacenados localmente si es necesario
      await Preferences.remove({ key: 'user' });

      // Redirigir a la página de login
      this.router.navigate(['/login']); // Redirige al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
