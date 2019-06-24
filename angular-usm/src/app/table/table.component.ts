import { Component } from '@angular/core';
import {set, bindState} from 'xsm'

interface Data {
    id: number;
    label: string;
}

@Component({
  styleUrls: ['../currentStyle.css'],
  selector: 'app-table',
  template: `
    <table *ngIf="!loading;else LOADING" class="table table-hover table-striped test-data">
        <tbody>
            <tr [class.danger]="item.id===selected" *ngFor="let item of rows; trackBy: itemById">
                <td class="col-md-1">{{item.id}}</td>
                <td class="col-md-4">
                    <a href="#">{{item.label}}</a>
                </td>
                <td class="col-md-1"><a href="#"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                <td class="col-md-6"></td>
            </tr>
        </tbody>
    </table>
    <ng-template #LOADING><span>loading</span></ng-template>
`
})
export class TableComponent {
  loading: boolean = false;
  rows: Array<Data> = [];

  constructor() {
      bindState(this, {loading: false, rows: []});
  }

  itemById(index: number, item) {
      return item.id;
  }
}
