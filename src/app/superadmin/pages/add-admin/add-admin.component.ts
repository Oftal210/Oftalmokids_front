import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {
  constructor(
    public _matDialogRef: MatDialogRef<AddAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  cerrar(): void {
    this._matDialogRef.close();
  }
}
