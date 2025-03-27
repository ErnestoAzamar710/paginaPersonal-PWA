import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { Preferences } from '@capacitor/preferences'; // Importar para almacenar datos localmente
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule]
})
export class LoginPage implements OnInit {
  user: User | null = null; // Variable para almacenar los datos del usuario

  constructor(private router: Router) { }

  async ngOnInit() {
    // Cargar información del usuario almacenado localmente
    const storedUser = await Preferences.get({ key: 'user' });

    if (storedUser.value) {
      // Si el usuario está almacenado
      this.user = JSON.parse(storedUser.value);
      console.log('Usuario cargado:', this.user);
      this.router.navigate(['/tabs']); // Redirigir si el usuario está almacenado
    } else {
      console.log('No hay usuario almacenado');
    }
  }

  // Función para guardar los datos completos del usuario en Preferences
  async saveUserData(user: { displayName: string, email: string, uid: string, photoURL?: string }) {
    // Guardar la información completa del usuario en Preferences
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(user) // Guardar todo el objeto de usuario
    });

    // Verificar si el valor se guardó correctamente
    const storedUser = await Preferences.get({ key: 'user' });
    if (storedUser.value) {
      console.log('Datos del usuario guardados correctamente:', JSON.parse(storedUser.value));
    } else {
      console.error('Error al guardar los datos del usuario en Preferences');
    }
  }

  // Inicio de sesión con Google
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Guardar todos los datos del usuario en Preferences
      await this.saveUserData({
        displayName: user.displayName || '',
        email: user.email || '',
        uid: user.uid,
        photoURL: user.photoURL || ''
      });

      // Redirigir a la página de tabs
      this.router.navigate(['/tabs']);
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
    }
  }
}
