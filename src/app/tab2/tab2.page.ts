import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Preferences } from '@capacitor/preferences';
import { getAuth, signOut } from 'firebase/auth';
import { NavController } from '@ionic/angular'; // Importar NavController para redirigir
interface Persona {
  nombre: string;
  clase: string;
  genero: string;
  fecha: string;
  puntosDeVida: number;
  fuerza: number;
  foto: string;
}
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  personas: Persona[] = [];
  showModal: boolean = false;
  editIndex: number | null = null;

  persona: Persona = {
    nombre: '',
    clase: '',
    genero: '',
    fecha: '',
    puntosDeVida: 0,
    fuerza: 0,
    foto: ''
  };

  constructor(
    public photoService: PhotoService,
    private navCtrl: NavController,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.photoService.loadStoredPhotos();
    this.personas = await this.loadPersonas();
  }

  openModal(index: number | null = null): void {
    if (this.showModal) return;

    this.editIndex = index;
    if (index !== null) {
      this.persona = { ...this.personas[index] };
    } else {
      this.clearForm();
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.clearForm();
  }

  async addPhotoToGallery(): Promise<void> {
    try {
      const newPhoto = await this.photoService.addNewToGallery();
      
      if (!newPhoto) {
        alert('No se pudo obtener la foto.');
        return;
      }
      
      this.persona.foto = newPhoto.webviewPath;
      this.cdRef.detectChanges();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al acceder a la cámara';
      console.error('Error en addPhotoToGallery:', errorMessage);
      alert(errorMessage);
    }
  }

  savePerson(): void {
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
    this.savePersonas();
  }

  deletePerson(index: number): void {
    if (index >= 0 && index < this.personas.length) {
      this.personas.splice(index, 1);
      this.savePersonas();
    }
  }

  validateForm(): boolean {
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

  clearForm(): void {
    this.persona = {
      nombre: '',
      clase: '',
      genero: '',
      fecha: '',
      puntosDeVida: 0,
      fuerza: 0,
      foto: ''
    };
  }

  async loadPersonas(): Promise<Persona[]> {
    try {
      const { value } = await Preferences.get({ key: 'personas' });
      if (!value) return [];

      const parsed = JSON.parse(value) as Persona[];
      return parsed.map(p => ({
        ...p,
        foto: p.foto?.startsWith('data:image/') ? p.foto : `data:image/jpeg;base64,${p.foto}`
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar personas';
      console.error('Error al cargar personas:', errorMessage);
      return [];
    }
  }

  async savePersonas(): Promise<void> {
    try {
      await Preferences.set({
        key: 'personas',
        value: JSON.stringify(this.personas)
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar personas';
      console.error('Error al guardar personas:', errorMessage);
    }
  }

  async logout(): Promise<void> {
    const auth = getAuth();
    
    try {
      await signOut(auth);
      await Preferences.remove({ key: 'user' });
      this.navCtrl.navigateRoot('/login');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cerrar sesión';
      console.error('Error al cerrar sesión:', errorMessage);
    }
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/default.jpg';
    imgElement.onerror = null; // Prevenir bucle infinito
  }
}