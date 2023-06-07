import { Component, OnDestroy, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { NgForm } from '@angular/forms';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css'],
})
export class DocumentEditComponent implements OnInit, OnDestroy {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  id: string;
  subscription: Subscription;

  constructor(
    private docService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id) {
        this.editMode = false;
      }
      this.originalDocument = this.docService.getDocument(this.id);

      if (this.originalDocument) {
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocument = new Document(
      'test',
      value.name,
      value.description,
      value.url
    );
    if (this.editMode) {
      this.docService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.docService.addDocument(newDocument);
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
