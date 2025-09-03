import { Component } from '@angular/core';
import { VisitorsForm } from '../visitors-form/visitor-form';
import { VisitorsTable } from '../visitors-table/visitors-table';
import { Visitor } from 'src/app/shared/interfaces/visitor';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-visitors-page',
  standalone: true,
  imports: [VisitorsForm, VisitorsTable, MatButton],
  templateUrl: './visitors-page.html',
  styleUrls: ['./visitors-page.css']
})
export class VisitorsPage {
  showForm = false;
  visitorsList: Visitor[] = [];

  addVisitor(visitor: Visitor) {
    this.visitorsList.push(visitor);
    this.showForm = false;  // hide form after submit
  };
};
