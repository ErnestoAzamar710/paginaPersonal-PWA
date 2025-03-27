import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Preferences } from '@capacitor/preferences';
import { getAuth, signOut } from 'firebase/auth';
import { NavController } from '@ionic/angular'; // Importar NavController para redirigir

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
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

  constructor(public photoService: PhotoService, private navCtrl: NavController) {} // Inyectamos NavController

  // Al cargar la página, se cargan las fotos almacenadas
  async ngOnInit() {
    await this.photoService.loadStoredPhotos();
    this.personas = await this.loadPersonas();

    // Mostrar el JSON almacenado en la consola
    const storedPhotos = await Preferences.get({ key: 'photos' });
    console.log('📸 Fotos guardadas:', JSON.parse(storedPhotos.value || '[]'));
  }

  // Abre el modal para agregar/editar una persona
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

  // Cierra el modal
  closeModal() {
    this.showModal = false;
    this.clearForm();
  }

  // Agregar una foto a la galería
  async addPhotoToGallery() {
    const newPhoto = await this.photoService.addNewToGallery();
  
    if (!newPhoto) {
      alert('No se pudo obtener la foto.');
      return;
    }
  
    this.persona.foto = newPhoto.base64; // Guarda la imagen en Base64
  }

  // Guardar los datos de la persona
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
    this.savePersonas(); // Guarda las personas después de agregar/editar
  }

  // Eliminar una persona
  deletePerson(index: number) {
    this.personas.splice(index, 1);
    this.savePersonas(); // Guarda las personas después de eliminar
  }

  // Validar que el formulario esté completo
  validateForm() {
    return (
      this.persona.nombre.trim() !== '' &&
      this.persona.clase.trim() !== '' &&
      this.persona.genero !== '' &&
      this.persona.fecha !== '' &&
      this.persona.puntosDeVida > 0 &&
      this.persona.fuerza > 0 &&
      typeof this.persona.foto === 'string' && 
      this.persona.foto.trim() !== ''
    );
  }

  // Limpiar el formulario
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

  // Método para cargar las personas (puedes almacenarlas en localStorage o en una base de datos)
  async loadPersonas() {
    const storedPersonas = await Preferences.get({ key: 'personas' });
    if (storedPersonas.value) {
      return JSON.parse(storedPersonas.value);
    }
    return [];
  }

  // Método para guardar las personas (se puede hacer con Preferences o almacenamiento local)
  async savePersonas() {
    await Preferences.set({
      key: 'personas',
      value: JSON.stringify(this.personas)
    });
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
      this.navCtrl.navigateRoot('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
