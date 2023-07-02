import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;

  constructor(private http: HttpClient) {}

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach((contact) => {
      let currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  getContacts() {
    this.http
      .get<{ message: String; documents: Contact[] }>(
        'http://localhost:3000/contacts'
      )
      .subscribe(
        (response) => {
          this.contacts = response.documents;
          this.contacts.sort((a, b) => {
            if (parseInt(a.id) > parseInt(b.id)) {
              return 1;
            } else {
              return -1;
            }
          });
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getContact(id: string): Contact {
    return (
      this.contacts.find((contact) => {
        return contact.id === id;
      }) || null
    );
  }

  addContact(contact: Contact) {
    if (contact === undefined || contact === null) return;
    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: String; document: Contact }>(
        'http://localhost:3000/contacts',
        contact,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.contacts.push(responseData.document);
        this.contacts.sort((a, b) => {
          if (parseInt(a.id) > parseInt(b.id)) {
            return 1;
          } else {
            return -1;
          }
        });
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (
      originalContact === undefined ||
      originalContact === null ||
      newContact === null ||
      newContact === undefined
    )
      return;

    let pos = this.contacts.indexOf(originalContact);

    if (pos < 0) return;

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    const contactsListClonse = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClonse);
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
