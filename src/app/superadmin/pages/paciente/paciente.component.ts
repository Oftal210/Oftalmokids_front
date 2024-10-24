import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AddPacienteComponent } from '../add-paciente/add-paciente.component';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent {
  constructor(
    private _matDialog: MatDialog
  ) {}

  abrirModal(): void {
    this._matDialog.open(AddPacienteComponent, {
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });
  }
}
