import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AddHijoComponent } from '../add-hijo/add-hijo.component';

@Component({
  selector: 'app-list-hijo',
  templateUrl: './list-hijo.component.html',
  styleUrl: './list-hijo.component.css'
})
export class ListHijoComponent {
  constructor(
    private _matDialog: MatDialog
  ) {}

  abrirModal(): void {
    this._matDialog.open(AddHijoComponent, {
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });
  }
}
