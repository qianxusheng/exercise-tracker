import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WebSocketService } from './websocket.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<router-outlet></router-outlet>',
  imports: [RouterModule],  
})

export class AppComponent implements OnInit{
  constructor(private webSocketService: WebSocketService){}

  ngOnInit(): void {
    this.webSocketService.connect();
  }
}
