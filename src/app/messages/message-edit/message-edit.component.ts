import {
  Component,
  ElementRef,
  EventEmitter,
  ViewChild,
  Output,
} from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css'],
})
export class MessageEditComponent {
  currentSender: string = 'Spencer Rafada';

  @ViewChild('subject') subjectRef: ElementRef;
  @ViewChild('msgText') msgTextRef: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  onSendMessage(event) {
    event.preventDefault();
    const msgSubject = this.subjectRef.nativeElement.value;
    const msgText = this.msgTextRef.nativeElement.value;
    const newMsg = new Message('1', msgSubject, msgText, this.currentSender);
    this.addMessageEvent.emit(newMsg);
  }
  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }
}
