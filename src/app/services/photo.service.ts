import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  photos: { filePath: string; webviewPath: string; base64: string }[] = [];

  constructor() {
    this.loadStoredPhotos();
  }

  async addNewToGallery(): Promise<{ filePath: string; webviewPath: string; base64: string } | null> {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90
      });

      if (!capturedPhoto || !capturedPhoto.webPath) {
        console.error('No se obtuvo una imagen válida.');
        return null;
      }

      const savedPhoto = await this.savePhoto(capturedPhoto);
      this.photos.unshift(savedPhoto);

      // Guardar en Preferences
      Preferences.set({
        key: 'photos',
        value: JSON.stringify(this.photos),
      });

      return savedPhoto;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }

  private async savePhoto(photo: Photo): Promise<{ filePath: string; webviewPath: string; base64: string }> {
    const fileName = `${new Date().getTime()}.jpeg`;
    const base64Data = await this.readAsBase64(photo);

    const savedFile = await Filesystem.writeFile({
      path: `photos/${fileName}`,
      data: base64Data,
      directory: Directory.Data
    });

    return {
      filePath: savedFile.uri, // Ruta del archivo en el almacenamiento de la app
      webviewPath: photo.webPath || '', // URL web (para iOS y Android, no PWA)
      base64: base64Data // Imagen en formato Base64 (para PWA)
    };
  }

  private async readAsBase64(photo: Photo): Promise<string> {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  async loadStoredPhotos() {
    const storedPhotos = await Preferences.get({ key: 'photos' });
    this.photos = storedPhotos.value ? JSON.parse(storedPhotos.value) : [];
  }
}
