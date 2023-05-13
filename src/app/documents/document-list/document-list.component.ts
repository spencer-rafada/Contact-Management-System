import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'This document', 'is a scam', 'www.com'),
    new Document('2', 'This document', 'is a 3', 'www.com'),
    new Document('3', 'This document', 'is a 4', 'www.com'),
    new Document('4', 'This document', 'is a 5', 'www.com'),
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
