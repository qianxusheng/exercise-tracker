import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';  // Use default import
import { Client, IMessage } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | null = null;  // Initialize as null
  private socketUrl = 'http://localhost:8080/socket'; // Backend WebSocket URL
  public uploadTrigger = new Subject<void>(); 

  constructor() {}

  connect() {
    const socket = new SockJS(this.socketUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000 
    });

    this.stompClient.onConnect = () => {
      console.log("Connected to WebSocket");

      this.stompClient?.subscribe('/topic/report-request', (message: IMessage)  => {
        if (message.body === "start-upload") {
          console.log("Received start-upload trigger, sending data...");
          this.uploadTrigger.next();
        }
      });
    };

    this.stompClient.activate();
  }

  // Disconnect WebSocket connection
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();  // Use deactivate() for proper disconnection
      console.log('WebSocket connection closed');
    }
  }
}

