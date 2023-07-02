import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageListChangedEvent = new Subject<Message[]>();
  messageChanged = new EventEmitter<Message[]>();
  messages: Message[] = [];

  constructor(private http: HttpClient) {}

  getMessages() {
    this.http
      .get<{ message: String; documents: Message[] }>(
        'http://localhost:3000/messages'
      )
      .subscribe(
        (response) => {
          this.messages = response.documents;
          console.log(this.messages);
          this.messages.sort((a, b) => {
            if (parseInt(a.id) > parseInt(b.id)) {
              return 1;
            } else {
              return -1;
            }
          });
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getMessage(id: string) {
    return (
      this.messages.find((message) => {
        return message.id === id;
      }) || null
    );
  }

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach((message) => {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addMessage(message: Message) {
    if (message === undefined || message === null) return;
    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(message);

    this.http
      .post<{ message: String; document: Message }>(
        'http://localhost:3000/messages',
        message,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.messages.push(responseData.document);
        this.messages.sort((a, b) => {
          if (parseInt(a.id) > parseInt(b.id)) {
            return 1;
          } else {
            return -1;
          }
        });
        this.messageListChangedEvent.next(this.messages.slice());
      });
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) return;

    let pos = this.messages.indexOf(originalMessage);

    if (pos < 0) return;

    newMessage.id = originalMessage.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put('http://localhost:3000/messages/' + originalMessage.id, newMessage, {
        headers: headers,
      })
      .subscribe((response) => {
        this.messages[pos] = newMessage;
        this.messages.sort((a, b) => {
          if (parseInt(a.id) > parseInt(b.id)) {
            return 1;
          } else {
            return -1;
          }
        });
        this.messageListChangedEvent.next(this.messages.slice());
      });
  }

  deleteMessage(message: Message) {
    if (!message) return;

    const pos = this.messages.indexOf(message);
    if (pos < 0) return;

    this.http
      .delete('http://localhost:3000/messages/' + message.id)
      .subscribe((response) => {
        this.messages.splice(pos, 1);
        this.messages.sort((a, b) => {
          if (parseInt(a.id) > parseInt(b.id)) {
            return 1;
          } else {
            return -1;
          }
        });
        this.messageListChangedEvent.next(this.messages.slice());
      });
  }

  storeMessages() {
    this.http
      .put(
        'https://spencer-cms-default-rtdb.firebaseio.com/messages.json',
        JSON.stringify(this.messages),
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .subscribe(() => {
        this.messageListChangedEvent.next(this.messages.slice());
      });
  }
}
