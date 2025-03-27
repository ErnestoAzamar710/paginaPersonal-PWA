import { Component, OnInit } from '@angular/core';
import { EldenringService } from '../services/eldenring.service';
import { getAuth, signOut } from 'firebase/auth';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences'; // Para eliminar datos del usuario

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  bosses: any[] = [];
  filteredBosses: any[] = [];
  searchTerm: string = '';

  constructor(
    private eldenringService: EldenringService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eldenringService.getAllBosses().subscribe((response: any[]) => {
      this.bosses = response;
      this.filteredBosses = response;
    });
  }

  filterBosses() {
    this.filteredBosses = this.bosses.filter(boss =>
      boss.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Método para cerrar sesión
  async logout() {
    const auth = getAuth();
    
    try {
      await signOut(auth); // Cerrar sesión en Firebase
      console.log('Sesión cerrada');

      // Eliminar los datos del usuario almacenados localmente
      await Preferences.remove({ key: 'user' });

      // Redirigir a la página de login
      this.router.navigate(['/login']); // Redirige al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
