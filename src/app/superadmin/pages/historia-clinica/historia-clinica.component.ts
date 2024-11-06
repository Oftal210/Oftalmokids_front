import { Component, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {

  // documento del paciente
  idhijo: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.idhijo = this.route.snapshot.paramMap.get('id');
    // Cargar el usuario con el ID obtenido
    console.log(this.idhijo);
  }

  // Método para navegar
  irMonitoreo() {
    this.router.navigate(['/monitoreo', this.idhijo]); // Enviar el ID
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
