import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  private documentChangeSub: Subscription;

  constructor(private documentService: DocumentService) {}
  ngOnInit(): void {
    this.documents = this.documentService.getDocuments();
    this.documentChangeSub =
      this.documentService.documentListChangedEvent.subscribe(
        (documents: Document[]) => {
          this.documents = documents;
        }
      );
  }

  ngOnDestroy(): void {
    this.documentChangeSub.unsubscribe();
  }
}
