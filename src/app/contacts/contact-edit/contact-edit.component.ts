import { Component } from '@angular/core';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent {
  groupContacts: Contact[];
  contact: Contact;

  onSubmit(form: NgForm) {}

  onCancel() {}
}
