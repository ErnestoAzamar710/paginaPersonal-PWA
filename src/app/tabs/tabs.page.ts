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
    const { value } = await Preferences.get({ key: 'user' });
    if (!value) {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}