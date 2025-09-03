import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Visitor } from 'src/app/shared/interfaces/visitor';
import {sortBy} from 'lodash-es';


type SortDirection = 'asc' | 'desc' | 'none';

@Component({
  selector: 'app-visitors-table',
  standalone: true,
  imports: [],
  templateUrl: './visitors-table.html',
  styleUrls: ['./visitors-table.css']
})
export class VisitorsTable {
@Input() data: Visitor[] | undefined;
@Output() visitorClicked = new EventEmitter<Visitor>();

  visitorData: Visitor[] = [];

  //show only a selective document fields in list
  sortOrder: Partial<Record<keyof Visitor, SortDirection>> = {
    firstName: 'none',
    lastName: 'none',
    phoneNumber: 'none',
    isFamily: 'none'
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.visitorData = [...this.data];
    };
  };

  onVisitorClicked(visitor: Visitor): void {
    console.log("Visitor clicked:", visitor);
    this.visitorClicked.emit(visitor);
  };

  sortData(sortKey: keyof Visitor): void {
    // safety check
    if (!this.data) return;

    // desc
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.visitorData = sortBy(this.data, sortKey).reverse();
    // asc
    } else {
      this.sortOrder[sortKey] = 'asc';
      this.visitorData = sortBy(this.data, sortKey);
    };

    // reset all other columns
    for (let key in this.sortOrder) {
      if (key !== sortKey) {
        this.sortOrder[key as keyof Visitor] = 'none';
      };
    };
  };

  sortSign(sortKey: keyof Visitor) {
    if (this.sortOrder[sortKey] === 'asc') return '\u2191';
    else if (this.sortOrder[sortKey] === 'desc') return '\u2193';
    else return '';
    };
};
