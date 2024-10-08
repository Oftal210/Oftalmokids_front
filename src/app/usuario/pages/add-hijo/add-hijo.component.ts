import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-add-hijo',
  templateUrl: './add-hijo.component.html',
  styleUrl: './add-hijo.component.css'
})
export class AddHijoComponent {
  constructor(
    public _matDialogRef: MatDialogRef<AddHijoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  cerrar(): void {
    this._matDialogRef.close();
  }
}
