import { EventEmitter, Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    // this.maxDocumentId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach((document) => {
      let currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  getDocuments() {
    this.http
      .get<{ message: String; documents: Document[] }>(
        'http://localhost:3000/documents'
      )
      .subscribe(
        (response) => {
          this.documents = response.documents;
          this.documents.sort((a, b) => {
            if (parseInt(a.id) > parseInt(b.id)) {
              return 1;
            } else {
              return -1;
            }
          });
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getDocument(id: string) {
    return (
      this.documents.find((document) => {
        return document.id === id;
      }) || null
    );
  }

  addDocument(document: Document) {
    if (!document) return;
    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: String; document: Document }>(
        'http://localhost:3000/documents',
        document,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
        this.documents.sort((a, b) => {
          if (parseInt(a.id) > parseInt(b.id)) {
            return 1;
          } else {
            return -1;
          }
        });
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (
      originalDocument === undefined ||
      originalDocument === null ||
      newDocument === null ||
      newDocument === undefined
    )
      return;

    let pos = this.documents.indexOf(originalDocument);

    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe((response) => {
        this.documents[pos] = newDocument;
        this.documents.sort((a, b) => {
          if (parseInt(a.id) > parseInt(b.id)) {
            return 1;
          } else {
            return -1;
          }
        });
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe((response) => {
        this.documents.splice(pos, 1);
        this.documents.sort((a, b) => {
          if (parseInt(a.id) > parseInt(b.id)) {
            return 1;
          } else {
            return -1;
          }
        });
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  storeDocuments() {
    this.http
      .put(
        'https://spencer-cms-default-rtdb.firebaseio.com/documents.json',
        JSON.stringify(this.documents),
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }
}
