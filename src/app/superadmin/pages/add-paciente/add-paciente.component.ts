import { Component, Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-paciente',
  templateUrl: './add-paciente.component.html',
  styleUrl: './add-paciente.component.css'
})
export class AddPacienteComponent {
  constructor(
    public _matDialogRef: MatDialogRef<AddPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  cerrar(): void {
    this._matDialogRef.close();
  }
}
