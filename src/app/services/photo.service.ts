import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

interface PhotoData {
  webviewPath: string;
  base64: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  photos: PhotoData[] = [];

  constructor() {
    this.loadStoredPhotos();
  }

  async addNewToGallery(): Promise<PhotoData | null> {
    try {
      // Verificar permisos primero
      const permissions = await Camera.checkPermissions();
      if (permissions.camera !== 'granted' || permissions.photos !== 'granted') {
        const newPermissions = await Camera.requestPermissions();
        if (newPermissions.camera !== 'granted' || newPermissions.photos !== 'granted') {
          throw new Error('Permisos de cámara no concedidos');
        }
      }

      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
        allowEditing: false,
        correctOrientation: true,
        width: 800,
        height: 800
      });

      if (!capturedPhoto?.base64String) {
        throw new Error('No se obtuvo imagen válida');
      }

      // Crear URL compatible con móvil
      const webviewPath = `data:image/jpeg;base64,${capturedPhoto.base64String}`;

      const photoData: PhotoData = {
        webviewPath,
        base64: capturedPhoto.base64String
      };

      this.photos.unshift(photoData);
      await this.saveToStorage();

      return photoData;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al tomar foto';
      console.error('Error en addNewToGallery:', errorMessage);
      alert(errorMessage);
      return null;
    }
  }

  async loadStoredPhotos(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'photos' });
      const parsedPhotos = value ? JSON.parse(value) as PhotoData[] : [];
      
      // Asegurar que todas las fotos tengan el formato correcto
      this.photos = parsedPhotos.map(photo => {
        if (photo.base64 && !photo.webviewPath?.startsWith('data:image/')) {
          return {
            ...photo,
            webviewPath: `data:image/jpeg;base64,${photo.base64}`
          };
        }
        return photo;
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar fotos';
      console.error('Error al cargar fotos almacenadas:', errorMessage);
      this.photos = [];
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      await Preferences.set({
        key: 'photos',
        value: JSON.stringify(this.photos)
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar fotos';
      console.error('Error al guardar fotos:', errorMessage);
    }
  }

  async deletePhoto(index: number): Promise<void> {
    if (index >= 0 && index < this.photos.length) {
      this.photos.splice(index, 1);
      await this.saveToStorage();
    }
  }

  async clearPhotos(): Promise<void> {
    this.photos = [];
    await Preferences.remove({ key: 'photos' });
  }
}