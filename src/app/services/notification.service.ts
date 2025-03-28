import { Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import OneSignal from 'onesignal-cordova-plugin';
import { environment } from 'src/environments/environment';
import { INotification } from '../models/notification.model';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private isInitialized = false;

  /**
   * Inicializa el servicio de notificaciones push
   */
  init() {
    const isPushNotificationAvailable = Capacitor.isPluginAvailable('PushNotifications');
    console.log('Push notifications available:', isPushNotificationAvailable);

    if(isPushNotificationAvailable) {
      PushNotifications.requestPermissions().then((result) => {
        console.log('Permisos para notificaciones:', result);
        
        // Inicializar OneSignal
        OneSignal.initialize(environment.oneSignalID);
        this.isInitialized = true;

        // Configurar el manejo de clics en notificaciones
        OneSignal.Notifications.addEventListener('click', async (e) => {
          console.log('Notificación clickeada:', e.notification);
          const notification: any = e.notification;
          if(notification.additionalData['url']){
            await Browser.open(notification.additionalData['url'])
          }
        });

      }).catch(error => {
        console.error('Error al solicitar permisos:', error);
      });
    }
  }

  /**
   * Envía una notificación a través de OneSignal API
   */
  async sendNotification(notification: INotification): Promise<boolean> {
    try {
      // 1. Validación de fecha
      const dateObj = new Date(notification.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Fecha inválida: ${notification.date}`);
      }

      // 2. Formatear fecha para OneSignal
      const formattedDate = this.formatDateForOneSignal(dateObj);

      // 3. Construir el cuerpo de la solicitud
      const requestBody = {
        app_id: environment.oneSignalID,
        contents: { "en": notification.body },
        headings: { "en": notification.title },
        url: notification.url,
        send_after: formattedDate,
        // Cambiar a filtros que siempre funcionen:
        filters: [
          {"field": "session_count", "relation": ">", "value": "0"},
          {"operator": "OR"},
          {"field": "last_session", "relation": ">", "value": "30"}
        ]
      };

      console.log('Enviando notificación:', JSON.stringify(requestBody, null, 2));

      // 4. Enviar la solicitud
      const response = await CapacitorHttp.post({
        url: 'https://onesignal.com/api/v1/notifications',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${environment.oneSignalRestApi}`
        },
        data: requestBody
      });

      console.log('Respuesta completa:', JSON.stringify(response, null, 2));

      // 5. Manejar respuesta
      if (response.status === 200) {
        if (response.data?.errors) {
          console.error('Errores de OneSignal:', response.data.errors);
          return false;
        }
        return true;
      }
      return false;

    } catch (error) {
      console.error('Error completo:', error);
      return false;
    }
  }

  private formatDateForOneSignal(date: Date): string {
    const timezoneOffset = -date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ` +
           `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')} ` +
           `GMT${offsetSign}${offsetHours.toString().padStart(2, '0')}${offsetMinutes.toString().padStart(2, '0')}`;
  }
}