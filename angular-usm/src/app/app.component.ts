import { Component, VERSION } from '@angular/core';
import {set,setMany,setcfg} from 'xsm'

setcfg({framework: 'Angular', debug: false});

interface Data {
    id: number;
    label: string;
}

@Component({
    styleUrls: ['./currentStyle.css'],
    selector: 'app-root',
    template: `<div class="container">
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Angular+XSM</h1>
            </div>
            <div class="col-md-6">
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="run" (click)="syncrow()" ref="text">Create a row synchronously</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="runlots" (click)="asyncrow()">Create a row asynchronously</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="clear" (click)="clear()">Clear</button>
                </div>
            </div>
        </div>
    </div>
    <app-table></app-table>
</div>`
})

export class AppComponent {
    constructor() {
        console.info(VERSION.full);
    }

    syncrow() {
        set('rows', [{id: 1, label: 'this is a sync apple'}]);
    }

    asyncrow() {
        set('loading', true);
        setTimeout(() => setMany({loading: false, rows: [{id: 1, label: 'this is an async apple'}]}), 1000);
    }

    clear() {
        set('rows', []);
    }
}
