import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular'; 
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  constructor(private router: Router) {}

  ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
    }
  }
}
