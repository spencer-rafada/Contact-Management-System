import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Test', 'This is a test', 'Yuna'),
    new Message('1', 'My Message', 'This is another test', 'Mina'),
    new Message('1', 'Bro', 'When is the test due', 'Yuna'),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
