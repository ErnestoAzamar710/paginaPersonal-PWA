import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, User } from 'firebase/auth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  user: User | null = null; // Variable para almacenar los datos del usuario

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    const auth = getAuth();
    this.user = auth.currentUser; // Obtiene el usuario autenticado actual

    console.log('Usuario obtenido:', this.user); // Añadido para depurar

    this.cdRef.detectChanges();
  }
}
