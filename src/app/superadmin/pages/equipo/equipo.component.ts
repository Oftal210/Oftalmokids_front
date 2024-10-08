import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AddAdminComponent } from '../add-admin/add-admin.component';
@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})

export class EquipoComponent {

  constructor(
    private _matDialog: MatDialog
  ) {}

  abrirModal(): void {
    this._matDialog.open(AddAdminComponent, {
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });
  }
}
