import { Component } from '@angular/core';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {
  currentStep: number = 1;

  // Función para ir al siguiente paso
  nextStep() {
    if (this.currentStep < 10) {
      this.currentStep++;
    }
  }

  // Función para ir al paso anterior
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
