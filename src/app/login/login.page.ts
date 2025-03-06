import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular'; 
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule]
})
export class LoginPage {
  constructor(private navCtrl: NavController) { }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    
    signInWithPopup(auth, provider)
      .then((result) => {
        // El usuario ha iniciado sesión correctamente
        const user = result.user;
        console.log('User:', user);
        
        // Redirigir a la página de tabs (o la página que desees)
        this.navCtrl.navigateRoot('/tabs');
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  }
}