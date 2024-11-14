import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showDropdown = false;
  
  // Permite abrir el menú del perfil y cerrar sesión
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}
