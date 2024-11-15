import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { SuperadminService } from '../../../servicios/superadmin.service';
import { Subject, Subscription } from 'rxjs'; // Importar Subject
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { error } from 'console';


interface ConsultData {
  period: string;
  consultations: number;
  newPatients: number;
}

interface Appointment {
  name: string;
  type: string;
  time: string;
  date: string;
}

interface Condition {
  name: string;
  patients: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnDestroy {

  consultData: ConsultData[] = [
    { period: 'Ene-Feb', consultations: 15, newPatients: 5 },
    { period: 'Mar-Abr', consultations: 20, newPatients: 8 },
    { period: 'May-Jun', consultations: 25, newPatients: 10 },
    { period: 'Jul-Ago', consultations: 30, newPatients: 12 },
    { period: 'Sep-Oct', consultations: 28, newPatients: 7 },
    { period: 'Nov-Dic', consultations: 35, newPatients: 15 }
  ];

  appointments: Appointment[] = [
    { name: 'Ana Garcia', type: 'Control mensual', time: '15:30', date: 'Nov 8, 2024' },
    { name: 'Ana Garcia', type: 'Control mensual', time: '15:30', date: 'Nov 8, 2024' },
    { name: 'Ana Garcia', type: 'Control mensual', time: '15:30', date: 'Nov 8, 2024' }
  ];

  conditions: Condition[] = [
    { name: 'Miopia', patients: 8 },
    { name: 'Astigmatismo', patients: 6 },
    { name: 'Hipermetropia', patients: 4 }
  ];

  stats = {
    parentsRegistered: { value: 24, increase: '20%' },
    childrenRegistered: { value: 18, increase: '15%' },
    consultationsThisMonth: { value: 45, increase: '25%' },
    upcomingAppointments: { value: 12, period: 'Próximos 7 días' }
  };

  padres: number = 0;
  hijos: number = 0;

  private padresSubscription!: Subscription;
  constructor(
    private superadminService: SuperadminService,

  ) { }


  ngOnDestroy() {
    if (this.padresSubscription) {
      this.padresSubscription.unsubscribe();
    }
  }


  obtenerPadresRegistrados() {
    this.padresSubscription = this.superadminService.obtenerPadres()
      .subscribe(data => {
        this.padres = data;
      },
        err => {
          console.log(err);
        });
  }

  obtenerHijosRegistrados() {
    this.padresSubscription = this.superadminService.obtenerRegistroPaciente().subscribe(
      data => {
        this.hijos = data;
      },
      error=>{
        console.log(error);
      }
    )
  }



}
