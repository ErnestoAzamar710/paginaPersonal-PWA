import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Preferences } from '@capacitor/preferences'; // Para verificar almacenamiento local

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {
  constructor(private router: Router) {}

  async ngOnInit() {
    // Intentar obtener el usuario desde el almacenamiento local
    const { value } = await Preferences.get({ key: 'user' });
    if (value) {
      // Si el usuario existe en el almacenamiento local, no necesitas estar en línea
      console.log('Usuario encontrado en almacenamiento local');
      // Continuar normalmente
    } else {
      // Si no hay usuario, redirige a la pantalla de login
      console.log('Usuario no encontrado, redirigiendo al login');
      this.router.navigate(['/login']);
    }
  }
}
