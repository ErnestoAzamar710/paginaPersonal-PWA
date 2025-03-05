import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  personas: any[] = [];
  showModal: boolean = false;
  editIndex: number | null = null;

  persona = {
    nombre: '',
    clase: '',
    genero: '',
    fecha: '',
    puntosDeVida: 0,
    fuerza: 0,
    foto: ''
  };

  constructor(public photoService: PhotoService) {}

  openModal(index: number | null = null) {
    if (this.showModal) return; // Evita abrir múltiples modales

    this.editIndex = index;
    if (index !== null) {
      this.persona = { ...this.personas[index] };
    } else {
      this.clearForm();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.clearForm();
  }

  async addPhotoToGallery() {
    await this.photoService.addNewToGallery();
    if (this.photoService.photos.length > 0) {
      this.persona.foto = this.photoService.photos[0].webviewPath || '';
      this.photoService.photos = [this.photoService.photos[0]];
    }
  }

  savePerson() {
    if (!this.validateForm()) {
      alert('Todos los campos son obligatorios y debes tomar una foto.');
      return;
    }

    if (this.editIndex !== null) {
      this.personas[this.editIndex] = { ...this.persona };
    } else {
      this.personas.push({ ...this.persona });
    }

    this.closeModal();
  }

  deletePerson(index: number) {
    this.personas.splice(index, 1);
  }

  validateForm() {
    return (
      this.persona.nombre.trim() !== '' &&
      this.persona.clase.trim() !== '' &&
      this.persona.genero !== '' &&
      this.persona.fecha !== '' &&
      this.persona.puntosDeVida > 0 &&
      this.persona.fuerza > 0 &&
      this.persona.foto.trim() !== ''
    );
  }

  clearForm() {
    this.persona = {
      nombre: '',
      clase: '',
      genero: '',
      fecha: '',
      puntosDeVida: 0,
      fuerza: 0,
      foto: ''
    };
    this.photoService.photos = [];
  }
}