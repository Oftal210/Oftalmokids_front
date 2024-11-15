import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {
  currentStep: number = 1;

  formularioForm: FormGroup;

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // variable para tomar el rol de usuario
  rolUsuarioActual!: number;

  // variable para tomar el documento de usuario
  documentoPadre: string = '';
  documentoHijo: string = '';
  accionModulo: string = '';
  idHijo: string = '';
  idHistoriaClinica!: number;
  datoInsertado: boolean = false;
  ocultarMotivoConsulta: boolean = false;
  disableed: boolean = true;
  

  // tomamos elementos del HTML
  @ViewChild('selectDiagnosticos') selectDiag!: ElementRef<HTMLSelectElement>;
  @ViewChild('motivoConsulta') txaMotivo!: ElementRef<HTMLSelectElement>;

  // variable para guardar los registros de los hijos
  historia: any[] = [];
  
  antecePersonal: any[] = [];

  anteceVisual: any[] = [];

  agudezaVisual: any[] = [];

  retinoscopia: any[] = [];

  alineamiento: any[] = [];

  versiones: any[] = [];

  ducciones: any[] = [];
  
  Motalidad: any [] = [];

  Exploracion: any[] = [];

  oftalmoscipiaForma: any[] = [];

  diagnosticoHechos: any[] = [];

  diagnosticos: any[] = [];

  hijo: any[] = [];

  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private superadminservice: SuperadminService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formularioForm = this.fb.group({
      // Hoja 1
      historiaForm: this.fb.group({
        fecha: [''],
        hora: [''],
        hijoNombre: [''],
        hijoApellido: [''],
        padreNombre: [''],
        padreApellido: [''],
        direccion: [''],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        motivoConsulta: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
      }),

      // Hoja 2
      antePersoForm: this.fb.group({
        edad_embarazo_madre: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        fue_alto_riesgo: ['', [Validators.required, this.validarSelect()]],
        especifique_riesgo: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        semanas_gestacion: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        tipo_parto: ['', [Validators.required, this.validarSelect()]],
        complicaciones_parto: ['', [Validators.required, this.validarSelect()]],
        especifique_complicaciones: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        uso_incubadora: ['', [Validators.required, this.validarSelect()]],
        tiempo_incubadora: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        puntaje_apgar: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        respiro_lloro_alnacer: ['', [Validators.required, this.validarSelect()]],
        emfermedad_en_embarazo: ['', [Validators.required, this.validarSelect()]],
        especifque_enfermedad_emb: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        medicamente_en_embarazo: ['', [Validators.required, this.validarSelect()]],
        especifique_medicamento: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        emfermedad_sistemica: ['', [Validators.required, this.validarSelect()]],
        especifique_enfer_sistemica: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        alergia: ['', [Validators.required, this.validarSelect()]],
        especifique_alergia: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        cirugia_general_ocular: ['', [Validators.required, this.validarSelect()]],
      }),

      // Hoja 3
      anteVisualForm: this.fb.group({
        //enviar el id de la historia clinica
        correcion_optica: ['', [Validators.required, this.validarSelect()]],
        edad_lente_primera_vez: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        cuantos_cambio_rx: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        motivo_cambio_rx: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        material_tratamiento_optico: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        indicaciones_uso: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        fecha_ultimo_examen: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
      }),

      // Hoja 4
      agudezaForm: this.fb.group({
        test: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        distancia: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        od_sc_vl: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        od_vp: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        od_ph: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        os_sc_vl: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        os_vp: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        os_ph: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        lensome_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        lensome_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        od_cc_vl: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        od_vp_lenso: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        os_cc_vl: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        os_vp_lenso: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        queratome_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        queratome_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
      }),

      // Hoja 5
      retinoscopiaForm: this.fb.group({
        retino_tecnica: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        retino_ciclople: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        retino_refrac_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        retino_subjet_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        retino_final_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        retino_refrac_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        retino_subjet_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        retino_final_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
      }),

      // Hoja 6
      alineamientoForm: this.fb.group({
        hirschberg: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        bruckner: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        covet_test_vl: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        covet_test_vp: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        esta_acomo_flex: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        esta_acomo_aa: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
      }),

      // Hoja 7
      versionesForm: this.fb.group({
        observacion_versiones: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
      }),

      // Hoja 8
      duccMotaliExploForm: this.fb.group({
        // PARA DUCCIONES
        ducc_normal_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        ducc_parecia_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        ducc_paralisis_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        ducc_normal_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        ducc_parecia_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        ducc_paralisis_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],

        // PARA MOTALIDAD OCULAR
        mo_seguimiento_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        mo_sacadicos_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        mo_seguimiento_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        mo_sacadicos_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        mo_seguimiento_ao: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        mo_sacadicos_ao: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],

        // PARA EXPLORACION DE EXTERNOS
        explo_exter_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        explo_exter_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
      }),

      // Hoja 9
      oftalmoscipiaForma: this.fb.group({
        medi_refrin_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        refle_fovea_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        papila_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        excav_fisio_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        profundidad_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        vasos_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        rela_arte_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        macula_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        reti_perif_od: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],

        medi_refrin_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        refle_fovea_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        papila_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        excav_fisio_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        profundidad_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        vasos_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        rela_arte_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        macula_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        reti_perif_os: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
      }),

      // Hoja 10
      diagnostico: this.fb.group({
        diagnostico: ['', [Validators.required, this.validarSelect()]],
        tratamiento_diagnostico: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        pronostico_diagnostico: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
        control_diagnostico: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/)]],
      })

    })
  }

  // FUNCIONES PARA VALIDAR LOS INPUT's ↓
  // SELECT
  // metodo para validar el valor del select y que no sea vacio
  validarSelect() {
    return (control: AbstractControl) => {
      // validamos que la opcion seleccionada no sea "Seleccion uno" que esta invisible en el DOM
      return control.value === '' ? { seleccionInvalida: true } : null;
    };
  }

  // FUNCIONES PARA VALIDAR LOS INPUT's ↑


  // metodo que incia al iniciar el componente
  ngOnInit() {
    
    // verificamos el rol para sacarlo al login
    if (this.documentoAdministrador) {

      // convertimos la variable a tipo JSON
      var docAdministrador = JSON.parse(this.documentoAdministrador);

      // tomamos el id_rol y lo guardamos aparte
      this.rolUsuarioActual = docAdministrador.id_rol; 

      // verificamos quien puede entrar al modulo
      if(docAdministrador.id_rol != 1 && docAdministrador.id_rol != 2){
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
    
    // tomamos de la URL el documento del hijo
    this.documentoHijo = this.route.snapshot.paramMap.get('id') || '';
    
    // tomamos de la URL el documento del hijo
    this.accionModulo = this.route.snapshot.paramMap.get('flag') || '';
    
    // metodo para esperar hasta que se termine de realizar al completo
    this.buscarDocumentoPadre().then(() => {

      // Esta función se ejecutará después de que buscarDocumentoPadre se complete 
      this.obtenerDatosDelPadre();
      
      // verificamos si se va a agregar todo o solo el diagnostico
      if (this.accionModulo){

        if (this.rolUsuarioActual == 1) {
          // pasamos al usuario a la pagina 10 donde esta lo que se va a modificar
          this.currentStep = 10;
        }

        // llamamos a la funcion para traer los datos de la historia clinica
        this.cargarRegistroHistoria().then(() => {

          // llamamos a la funcion para traer los datos de antecedente visual
          this.cargarRegistroAnteceVisual();

          // llamamos a la funcion para traer los datos de agudeza visual
          this.cargarRegistroAgudezaVisual();

          // llamamos a la funcion para traer los datos de retinoscopia
          this.cargarRegistroRetinoscopia();

          // llamamos a la funcion para traer los datos del alineamiento motor
          this.cargarRegistroAlineamiento();

          // llamamos a la funcion para traer los datos de las versiones
          this.cargarRegistroVersiones();

          // llamamos a la funcion para traer los datos de las ducciones
          this.cargarRegistroDucciones();

          // llamamos a la funcion para traer los datos de la motalidad ocular
          this.cargarRegistroMotalidad();

          // llamamos a la funcion para traer los datos de la exploracion de externo
          this.cargarRegistroExploracion();

          // llamamos a la funcion para traer los datos de la oftalmoscopia
          this.cargarRegistroOftalmoscopia();

          // llamamos a la funcion para traer los datos de la historia clinica
          this.cargarRegistrosDiagnosticos();
        });
      } else {

        // metodo para tomar los datos del localstorage en caso de que existan
        const savedValues = JSON.parse(localStorage.getItem('formValues') || '{}');
        // aplicamos lo que tengamos en el localstorage
        this.formularioForm.patchValue(savedValues);
  
        // Escuchar cambios en el formulario principal y guardar en localStorage 
        this.formularioForm.valueChanges.subscribe(values => { 
          localStorage.setItem('formValues', JSON.stringify(values)); 
        });
  
        // Establecer fecha y hora actuales en los controles del formulario 
        const currentDate = new Date(); 
        const currentDateString = currentDate.toISOString().split('T')[0]; 
        const currentTimeString = currentDate.toTimeString().split(' ')[0].substring(0, 5);
        this.formularioForm.get('historiaForm')?.patchValue({
          fecha: currentDateString,
          hora: currentTimeString,
        });
      }

    }) 
    .catch((error) => { 
      console.error('Error en la obtención del documento del padre:', error); 
    });

    this.cargarRegistroDiagnostico();
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  // FUNCIONES PARA TOMAR DATOS NECESARIOS DE LAS ENTIDADES RELACIONADAS
  // funcion para traer a los hijos 
  cargarRegistroDiagnostico(): void {
    this.superadminservice.obtenerRegustroDiagnostico()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.diagnosticos = data;
      } else {
        alert('no hay diagnosticos');
      }
    })
  }

  // funcion para traer el dato del padre
  buscarDocumentoPadre (): Promise<void> {
    return new Promise((resolve, reject) => {
      this.superadminservice.buscarPaciente(this.documentoHijo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        // validmaos que el status sea correcto
        if (!data.mensaje){
          this.hijo = data;
          this.documentoPadre = data.hijo.id_usuario;
          this.idHijo = data.hijo.id;
          console.log(this.idHijo);
          const datosParaHijo = {
            hijoNombre: data.hijo.nombre,
            hijoApellido: data.hijo.apellido,
            direccion: data.hijo.direccion
          };
          this.formularioForm.get('historiaForm')?.patchValue(datosParaHijo);
          resolve(); // Resolución de la promesa después de completar la tarea
        } else {
          alert('el hijo no esta registrado');
          reject('El hijo no está registrado, error en reject');
        }
      });
    });
  }

  // funcion para navegar entre los fomrularios con los botones
  accederSeciones(num: number){
    if (num && num > 0 && num <= 10) {
      this.currentStep = num;
    }
  }

  // funcion para traer el dato del padre
  obtenerDatosDelPadre() {
    this.superadminservice.buscarPadre(this.documentoPadre)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      // validmaos que el status sea correcto
      if (!data.mensaje){
        const datosParaPadre = {
          padreNombre: data.usuario.nombre,
          padreApellido: data.usuario.apellido,
          telefono: data.usuario.telefono
        }
        this.formularioForm.get('historiaForm')?.patchValue(datosParaPadre);
      } else {
        alert('el padre no esta registrado');
      }
    });
  }
  // FUNCIONES PARA TOMAR DATOS NECESARIOS DE LAS ENTIDADES RELACIONADAS


  // FUNCIONES PARA EL FUNCIONAMIENTO DEL FORMULARIO
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

  totalSteps(): number { return Object.keys(this.formularioForm.controls).length; }


  isCurrentStep(step: number): boolean {
    return this.currentStep === step; 
  } 
  
  isCurrentFormValid(): boolean { 
    const formGroupNames = Object.keys(this.formularioForm.controls); 
    const currentFormGroupName = formGroupNames[this.currentStep - 1]; 
    const currentFormGroup = this.formularioForm.get(currentFormGroupName) as FormGroup; 
    if (currentFormGroup.valid) { 
      return true; 
    } else { 
      currentFormGroup.markAllAsTouched(); 
      return false; 
    } 
  }

  isInvalid(formGroupName: string, controlName: string): boolean { 
    const control = this.formularioForm.get([formGroupName, controlName]); 
    return control ? control.invalid && control.touched : false; 
  }
  // FUNCIONES PARA EL FUNCIONAMIENTO DEL FORMULARIO



  async guardarHistoriaClinica() { 
    // validamos que el fomrulario este correctamn
    if (this.formularioForm.valid) {
      console.log(this.formularioForm.value);
      alert('espere mientras se guarda la historia clinica');

      // Mostrar el overlay para evitar la interacción del usuario
      document.getElementById('overlay')!.style.display = 'block';
      
      try {
        // realizamos las siguientes funciones para insertar cada dato necesario
        await this.guardarRegistrosHistoriaClinica();

        await this.guardarRegistrosAntecedenteVisual();

        await this.guardarRegistrosAgudezaVisual();

        await this.guardarRegistrosRetinoscopia();

        await this.guardarRegistrosAlineamiento();

        await this.guardarRegistrosVersiones();

        await this.guardarRegistrosDucciones();

        await this.guardarRegistrosMotalidades();

        await this.guardarRegistrosExploracion();

        await this.guardarRegistrosOftalmoscopias();
        
        await this.guardarRegistrosDiagnostico();

        console.log(this.datoInsertado);

        if (this.datoInsertado) {

          this.formularioForm.reset();

          // Limpiar el localstorage cuando se necesite
          localStorage.removeItem('formularioForm');

          // Mostrar alerta de éxito 
          alert('Todos los registros se han guardado correctamente.');
        } 
      }catch (error) { 
        console.error('Error al guardar los registros:', error);
        // Mostrar alerta de error 
        alert('Ocurrió un error al guardar los registros. Por favor, intenta nuevamente.');
      } finally { 
        // Ocultar el overlay para permitir la interacción del usuario 
        document.getElementById('overlay')!.style.display = 'none'; 
      } 
    } else {
      console.log('Formulario no válido'); 
      alert('Datos invalidos')
    }
    //this.verificarEstadoPadre();
  }

  // FUNCIONES DE AGREGACION DE HISTORIA CLINICA ↓
  // Funcion para insertar la historia clinica
  guardarRegistrosHistoriaClinica(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(!this.formularioForm.invalid){
        console.log('es verdadero');
        const historiaFormValues = this.formularioForm.get('historiaForm')?.value;
        const antePersoFormValues = this.formularioForm.get('antePersoForm')?.value;

        this.superadminservice.guardarRegistroHistoriaClinica( 
          this.idHijo,
          this.documentoPadre, 
          antePersoFormValues.edad_embarazo_madre, 
          Boolean(antePersoFormValues.fue_alto_riesgo), 
          antePersoFormValues.especifique_riesgo, 
          antePersoFormValues.semanas_gestacion, 
          antePersoFormValues.tipo_parto, 
          Boolean(antePersoFormValues.complicaciones_parto),
          antePersoFormValues.especifique_complicaciones,
          Boolean(antePersoFormValues.uso_incubadora),
          antePersoFormValues.tiempo_incubadora,
          antePersoFormValues.puntaje_apgar,
          Boolean(antePersoFormValues.respiro_lloro_alnacer),
          Boolean(antePersoFormValues.emfermedad_en_embarazo),
          antePersoFormValues.especifque_enfermedad_emb,
          Boolean(antePersoFormValues.medicamente_en_embarazo),
          antePersoFormValues.especifique_medicamento,
          Boolean(antePersoFormValues.emfermedad_sistemica),
          antePersoFormValues.especifique_enfer_sistemica,
          Boolean(antePersoFormValues.alergia), 
          antePersoFormValues.especifique_alergia,
          Boolean(antePersoFormValues.cirugia_general_ocular),
          historiaFormValues.fecha,
          historiaFormValues.hora,
          historiaFormValues.direccion,

        ).pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => { 
          
          // verificamos si existe un registro ya
          if (response.existe) {
            alert('Ya existe un registro de historia clinica para este hijo')
          } else {
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar la historia clinica')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta de historia clinica')
              this.idHistoriaClinica = response.historia_clinica.id;
              this.datoInsertado = true;
            }
          }          
          resolve();
        }, error => {
          console.error('Error al guardar el registro', error);
          this.datoInsertado = false;
          reject(error);
        })
      }
    });
  }

  // Funcion para insertar el antecedente visual
  guardarRegistrosAntecedenteVisual(): Promise<void> {
    console.log('entro a antece visu');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const anteceVisualDatos = this.formularioForm.get('anteVisualForm')?.value;
  
          this.superadminservice.guardarRegistroAntecedenteVisual(

            this.idHistoriaClinica,
            Boolean(anteceVisualDatos.correcion_optica),
            anteceVisualDatos.edad_lente_primera_vez,
            anteceVisualDatos.cuantos_cambio_rx,
            anteceVisualDatos.motivo_cambio_rx,
            anteceVisualDatos.material_tratamiento_optico,
            anteceVisualDatos.indicaciones_uso,
            anteceVisualDatos.fecha_ultimo_examen,
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status antevisu: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar el antecedente visual')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en antecedente visual')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto antecedente visual');
      }
    });
  }

  // Funcion para insertar la agudeza visual
  guardarRegistrosAgudezaVisual(): Promise<void> {
    console.log('entro a agudeza visua');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const agudezaVisuDatos = this.formularioForm.get('agudezaForm')?.value;
          console.log(agudezaVisuDatos);
  
          this.superadminservice.guardarRegistroAgudezaVisual(

            this.idHistoriaClinica,
            agudezaVisuDatos.test,
            agudezaVisuDatos.distancia,
            agudezaVisuDatos.od_sc_vl,
            agudezaVisuDatos.od_vp,
            agudezaVisuDatos.od_ph,
            agudezaVisuDatos.os_sc_vl,
            agudezaVisuDatos.os_vp,
            agudezaVisuDatos.os_ph,
            agudezaVisuDatos.lensome_od,
            agudezaVisuDatos.lensome_os,
            agudezaVisuDatos.od_cc_vl,
            agudezaVisuDatos.od_vp_lenso,
            agudezaVisuDatos.os_cc_vl,
            agudezaVisuDatos.os_vp_lenso,
            agudezaVisuDatos.queratome_od,
            agudezaVisuDatos.queratome_os,
            
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status agudeza visu: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar la agudeza visual')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en agudeza visual')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto en agudeza visual');
      }
    });
  }

  // Funcion para insertar la retinoscopia
  guardarRegistrosRetinoscopia(): Promise<void> {
    console.log('entro a retinoscopia');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const retinoscopiaDatos = this.formularioForm.get('retinoscopiaForm')?.value;
  
          this.superadminservice.guardarRegistroRetinoscopia(

            this.idHistoriaClinica,
            retinoscopiaDatos.retino_tecnica,
            retinoscopiaDatos. retino_ciclople,
            retinoscopiaDatos. retino_refrac_od,
            retinoscopiaDatos. retino_subjet_od,
            retinoscopiaDatos. retino_final_od,
            retinoscopiaDatos. retino_refrac_os,
            retinoscopiaDatos. retino_subjet_os,
            retinoscopiaDatos.retino_final_os,
            
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status retinos: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar la retinosco')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en retinosco')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto la retinosco');
      }
    });
  }

  // Funcion para insertar el alineamiento motor
  guardarRegistrosAlineamiento(): Promise<void> {
    console.log('entro a alineamiento');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const alineamientoDatos = this.formularioForm.get('alineamientoForm')?.value;
  
          this.superadminservice.guardarRegistroAlineamientoMotor(

            this.idHistoriaClinica,
            alineamientoDatos.hirschberg,
            alineamientoDatos.bruckner,
            alineamientoDatos.covet_test_vl,
            alineamientoDatos.covet_test_vp,
            alineamientoDatos.esta_acomo_flex,
            alineamientoDatos.esta_acomo_aa,
            
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status alineam: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar el alineam')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en alineam')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto el alineami');
      }
    });
  }

  // Funcion para insertar las versiones
  guardarRegistrosVersiones(): Promise<void> {
    console.log('entro a version');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const versionDatos = this.formularioForm.get('versionesForm')?.value;
  
          this.superadminservice.guardarRegistroVersiones(

            this.idHistoriaClinica,
            versionDatos.observacion_versiones,
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status version: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar en versiones')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en versiones')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto en versiones');
      }
    });
  }

  // Funcion para insertar las ducciones
  guardarRegistrosDucciones(): Promise<void> {
    console.log('entro a ducciones');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const duccionDatos = this.formularioForm.get('duccMotaliExploForm')?.value;
  
          this.superadminservice.guardarRegistroDucciones(

            this.idHistoriaClinica,
            duccionDatos.ducc_normal_od,
            duccionDatos.ducc_parecia_od,
            duccionDatos.ducc_paralisis_od,
            duccionDatos.ducc_normal_os,
            duccionDatos.ducc_parecia_os,
            duccionDatos.ducc_paralisis_os,
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status duccion: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar en duccion')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en duccion')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto en duccion');
      }
    });
  }

  // Funcion para insertar las motalidades oculares
  guardarRegistrosMotalidades(): Promise<void> {
    console.log('entro a motalidad');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const motalidadDatos = this.formularioForm.get('duccMotaliExploForm')?.value;
  
          this.superadminservice.guardarRegistroMotalidadOcular(

            this.idHistoriaClinica,
            motalidadDatos.mo_seguimiento_od,
            motalidadDatos.mo_sacadicos_od,
            motalidadDatos.mo_seguimiento_os,
            motalidadDatos.mo_sacadicos_os,
            motalidadDatos.mo_seguimiento_ao,
            motalidadDatos.mo_sacadicos_ao,
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status motalidad: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar en motalidad')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en motalidad')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto en motalidad');
      }
    });
  }

  // Funcion para insertar las exploracionres
  guardarRegistrosExploracion(): Promise<void> {
    console.log('entro a exploracion');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const exploracionDatos = this.formularioForm.get('duccMotaliExploForm')?.value;
  
          this.superadminservice.guardarRegistroExploracionExternos(

            this.idHistoriaClinica,
            exploracionDatos.explo_exter_od,
            exploracionDatos.explo_exter_os,
            
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status explo: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar en explo')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en explo')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto en explo');
      }
    });
  }

  // Funcion para insertar las oftalmoscopias
  guardarRegistrosOftalmoscopias(): Promise<void> {
    console.log('entro a oftalmoscopia');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const oftalmosDatos = this.formularioForm.get('oftalmoscipiaForma')?.value;
  
          this.superadminservice.guardarRegistroOftalmoscopia(

            this.idHistoriaClinica,
            oftalmosDatos.medi_refrin_od,
            oftalmosDatos.refle_fovea_od,
            oftalmosDatos.papila_od,
            oftalmosDatos.excav_fisio_od,
            oftalmosDatos.profundidad_od,
            oftalmosDatos.vasos_od,
            oftalmosDatos.rela_arte_od,
            oftalmosDatos.macula_od,
            oftalmosDatos.reti_perif_od,
            oftalmosDatos.medi_refrin_os,
            oftalmosDatos.refle_fovea_os,
            oftalmosDatos.papila_os,
            oftalmosDatos.excav_fisio_os,
            oftalmosDatos.profundidad_os,
            oftalmosDatos.vasos_os,
            oftalmosDatos.rela_arte_os,
            oftalmosDatos.macula_os,
            oftalmosDatos.reti_perif_os,
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status oftalmo: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar en oftalmo')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en oftalmo')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto en oftalmo');
      }
    });
  }

  // Funcion para insertar los diagnosticos x historia clinica
  guardarRegistrosDiagnostico(): Promise<void> {
    console.log('entro a diagnostico');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          console.log('es verdadero');
          const diagnosticoDatos = this.formularioForm.get('diagnostico')?.value;
          const historiaDatos = this.formularioForm.get('historiaForm')?.value;
  
          this.superadminservice.guardarRegistroDiagxHistoriaClinica(

            this.idHistoriaClinica,
            diagnosticoDatos.diagnostico,
            historiaDatos.motivoConsulta,
            diagnosticoDatos.tratamiento_diagnostico,
            diagnosticoDatos.pronostico_diagnostico,
            diagnosticoDatos.control_diagnostico,

            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            console.log(response);
            console.log('status diagn: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              console.log('error al insertar en diagn')
              this.datoInsertado = false;
            } else {
              // salio bien   
              console.log('insercion correcta en diagn')
              this.datoInsertado = true;
            }
            resolve();

          }, error => {
            console.error('Error al guardar el registro', error);
            this.datoInsertado = false;
            reject(error);
          })
        }
      } else {
        console.log(this.datoInsertado);
        console.log('no se inserto en diagn');
      }
    });
  }

  verificarEstadoPadre() { 
    // Verifica si el formulario principal es inválido 
    if (this.formularioForm.invalid) { 
      // Itera sobre cada FormGroup anidado 
      for (const formGroupName in this.formularioForm.controls) { 
        if (this.formularioForm.controls.hasOwnProperty(formGroupName)) { 
          const formGroup = this.formularioForm.get(formGroupName) as FormGroup; 
          this.verificarEstadoFormGroup(formGroup, formGroupName); 
        } 
      } 
    } else { 
      console.log('El formulario principal es válido'); 
    } 
  } 
  
  private verificarEstadoFormGroup(formGroup: FormGroup, formGroupName: string) { 
    // Itera sobre cada control del FormGroup anidado 
    for (const controlName in formGroup.controls) { 
      if (formGroup.controls.hasOwnProperty(controlName)) { 
        const control = formGroup.get(controlName) as AbstractControl; 
        if (control && control.invalid) { 
          // Imprimir el nombre del control y su estado 
          console.log(`${formGroupName}.${controlName} es inválido:`, control.errors); 
        } else { 
          console.log(`${formGroupName}.${controlName} es válido`); 
        } 
      } 
    } 
  }
  // FUNCIONES DE AGREGACION DE HISTORIA CLINICA ↑


  // Funcion para obtener datos de la historia clinica
  cargarRegistroHistoria(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.superadminservice.obtenerRegistroHistoria(this.idHijo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if(!data.mensaje){
          this.idHistoriaClinica = data.id;
          this.formularioForm.get('historiaForm')?.patchValue({
            fecha: data.fecha,
            hora: data.hora,
          });
          this.formularioForm.get('antePersoForm')?.patchValue({
            edad_embarazo_madre:            data.edad_embarazo,
            fue_alto_riesgo:                data.alto_riesgo === 1 ? 'true' : 'false',
            especifique_riesgo:             data.especificar_riesgo,
            semanas_gestacion:              data.semanas_gestacion,
            tipo_parto:                     data.tipo_parto, 
            complicaciones_parto:           data.complicacion  === 1 ? 'true' : 'false',
            especifique_complicaciones:     data.especificar_compli,
            uso_incubadora:                 data.uso_incubadora  === 1 ? 'true' : 'false',
            tiempo_incubadora:              data.tiempo_incubadora,
            puntaje_apgar:                  data.apgar_incubadora,
            respiro_lloro_alnacer:          data.respiro_lloro_nacer  === 1 ? 'true' : 'false',
            emfermedad_en_embarazo:         data.enfermedades_embarazo  === 1 ? 'true' : 'false',
            especifque_enfermedad_emb:      data.especificar_enfermedades,
            medicamente_en_embarazo:        data.medicamento_embarazo  === 1 ? 'true' : 'false',
            especifique_medicamento:        data.especificar_medicamento,
            emfermedad_sistemica:           data.enfermedad_sistemica  === 1 ? 'true' : 'false',
            especifique_enfer_sistemica:    data.especif_enferm_sistemica,
            alergia:                        data.alergia  === 1 ? 'true' : 'false',
            especifique_alergia:            data.especificar_alergia,
            cirugia_general_ocular:         data.cirugia_ocular  === 1 ? 'true' : 'false',
          });
        } else {
          alert('No se encontro historia clinica del paciente')
          this.router.navigate(['/paciente']);
        }
        resolve();
      })
    });  
  }

  // Funcion para obtener datos de antecedente visual
  cargarRegistroAnteceVisual () {
    this.superadminservice.obtenerRegistroAnteVisual(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('anteVisualForm')?.patchValue({
          correcion_optica:             data.correcion_optica === 1 ? 'true' : 'false',
          edad_lente_primera_vez:       data.edad_lentes_prim_vez,
          cuantos_cambio_rx:            data.cuantos_cambio_rx,
          motivo_cambio_rx:             data.motivo_cambio_rx,
          material_tratamiento_optico:  data.material_tratam_optic,
          indicaciones_uso:             data.indicacion_uso,
          fecha_ultimo_examen:          data.fecha_ultimo_examen,
        });
      } else {
        alert('No se encontro antecedente visual del paciente')
        //this.router.navigate(['/paciente']);
      }
      
    })
  }

  // Funcion para obtener datos de antecedente visual
  cargarRegistroAgudezaVisual () {
    this.superadminservice.obtenerRegistroAgudeza(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('agudezaForm')?.patchValue({
          test:           data.agude_visu_test,
          distancia:      data.agude_visu_distan,
          od_sc_vl:       data.od_sc_vl,
          od_vp:          data.od_vp,
          od_ph:          data.od_ph,
          os_sc_vl:       data.os_sc_vl,
          os_vp:          data.os_vp,
          os_ph:          data.os_ph,
          lensome_od:     data.lensome_od,
          lensome_os:     data.lensome_os,
          od_cc_vl:       data.od_cc_vl,
          od_vp_lenso:    data.od_vp_lenso,
          os_cc_vl:       data.os_cc_vl,
          os_vp_lenso:    data.os_vp_lenso,
          queratome_od:   data.queratome_od,
          queratome_os:   data.queratome_os,
        });
      } else {
        alert('No se encontro la agudeza visual del paciente')
        //this.router.navigate(['/paciente']);
      }
    })
  }

  // Funcion para obtener datos de la retinoscopia
  cargarRegistroRetinoscopia () {
    this.superadminservice.obtenerRegistroRetinoscopia(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('retinoscopiaForm')?.patchValue({
          retino_tecnica:     data.retino_tecnica,
          retino_ciclople:    data.retino_ciclople,
          retino_refrac_od:   data.retino_refrac_od,
          retino_subjet_od:   data.retino_subjet_od,
          retino_final_od:    data.retino_final_od,
          retino_refrac_os:   data.retino_refrac_os,
          retino_subjet_os:   data.retino_subjet_os,
          retino_final_os:    data.retino_final_os
        });
      } else {
        alert('No se encontro la agudeza visual del paciente')
        //this.router.navigate(['/paciente']);
      }
      
    })
  }

  // Funcion para obtener datos del alineamiento motor
  cargarRegistroAlineamiento () {
    this.superadminservice.obtenerRegistroAlineamiento(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('alineamientoForm')?.patchValue({
          hirschberg:       data.test_hirschberg,
          bruckner:         data.test_bruckner,
          covet_test_vl:    data.covet_test_vl,
          covet_test_vp:    data.covet_test_vp,
          esta_acomo_flex:  data.esta_acomo_flex,
          esta_acomo_aa:    data.esta_acomo_aa,
        });
      } else {
        alert('No se encontro la agudeza visual del paciente')
        //this.router.navigate(['/paciente']);
      }
      
    })
  }

  // Funcion para obtener datos de las versiones
  cargarRegistroVersiones () {
    this.superadminservice.obtenerRegistroVersiones(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('versionesForm')?.patchValue({
          observacion_versiones:  data.observacion
        });
      } else {
        alert('No se encontro la agudeza visual del paciente')
        //this.router.navigate(['/paciente']);
      }
      
    })
  }

  // Funcion para obtener datos de las ducciones
  cargarRegistroDucciones () {
    this.superadminservice.obtenerRegistroDucciones(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('duccMotaliExploForm')?.patchValue({
          ducc_normal_od:     data.ducc_normal_od,
          ducc_parecia_od:    data.ducc_parecia_od,
          ducc_paralisis_od:  data.ducc_paralisis_od,
          ducc_normal_os:     data.ducc_normal_os,
          ducc_parecia_os:    data.ducc_parecia_os,
          ducc_paralisis_os:  data.ducc_paralisis_os,
        });
      } else {
        alert('No se encontro la agudeza visual del paciente')
        //this.router.navigate(['/paciente']);
      }
      
    })
  }

  // Funcion para obtener datos de la motalidad ocular
  cargarRegistroMotalidad () {
    this.superadminservice.obtenerRegistroMotalidad(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('duccMotaliExploForm')?.patchValue({
          mo_seguimiento_od:  data.mo_seguimiento_od,
          mo_sacadicos_od:    data.mo_sacadicos_od,
          mo_seguimiento_os:  data.mo_seguimiento_os,
          mo_sacadicos_os:    data.mo_sacadicos_os,
          mo_seguimiento_ao:  data.mo_seguimiento_ao,
          mo_sacadicos_ao:    data.mo_sacadicos_ao,
        });
      } else {
        alert('No se encontro la agudeza visual del paciente')
        //this.router.navigate(['/paciente']);
      }
      
    })
  }

  // Funcion para obtener datos de la exploracion de externos
  cargarRegistroExploracion () {
    this.superadminservice.obtenerRegistroExploracion(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('duccMotaliExploForm')?.patchValue({
          explo_exter_od:  data.explo_exter_od,
          explo_exter_os:  data.explo_exter_os,
        });
      } else {
        alert('No se encontro la agudeza visual del paciente')
        //this.router.navigate(['/paciente']);
      }
      
    })
  }

  // Funcion para obtener datos de la oftalmoscopia
  cargarRegistroOftalmoscopia () {
    this.superadminservice.obtenerRegistroOftalmoscopia(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('oftalmoscipiaForma')?.patchValue({
          medi_refrin_od:   data.medi_refrin_od,
          refle_fovea_od:   data.refle_fovea_od,
          papila_od:        data.papila_od,
          excav_fisio_od:   data.excav_fisio_od,
          profundidad_od:   data.profundidad_od,
          vasos_od:         data.vasos_od,
          rela_arte_od:     data.rela_arte_od,
          macula_od:        data.macula_od,
          reti_perif_od:    data.reti_perif_od,
          medi_refrin_os:   data.medi_refrin_os,
          refle_fovea_os:   data.refle_fovea_os,
          papila_os:        data.papila_os,
          excav_fisio_os:   data.excav_fisio_os,
          profundidad_os:   data.profundidad_os,
          vasos_os:         data.vasos_os,
          rela_arte_os:     data.rela_arte_os,
          macula_os:        data.macula_os,
          reti_perif_os:    data.reti_perif_os,
        });
      } else {
        alert('No se encontro la oftalmoscopia del paciente')
        //this.router.navigate(['/paciente']);
      }
      
    })
  }

  // Funcion para obtener datos de la historia clinica
  cargarRegistrosDiagnosticos(): void {
    this.superadminservice.obtenerRegistrosDiagnosticos(this.idHistoriaClinica)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        console.log(data);
        this.diagnosticoHechos = data;
        const objetoMasReciente = this.diagnosticoHechos.reduce((a, b) => new Date(a.fecha) > new Date(b.fecha) ? a : b);
        this.formularioForm.get('diagnostico')?.patchValue({
          diagnostico:               objetoMasReciente.id_diagnostico,
          tratamiento_diagnostico:   objetoMasReciente.tratamiento,
          pronostico_diagnostico:    objetoMasReciente.pronostico,
          control_diagnostico:       objetoMasReciente.control,
        });

        this.formularioForm.get('historiaForm')?.patchValue({
          motivoConsulta: objetoMasReciente.motivo_consulta,
        })

        setTimeout(() => {
          if (this.selectDiag){
            this.selectDiag.nativeElement.value = objetoMasReciente.id.toString();
          }
          
        }, 1000);
      } else {
        alert('No se encontro historia clinica del paciente')
        //this.router.navigate(['/paciente']);
      }
    })
  }

  // Funcion para llenar los cambios al cambiar de consulta
  cambioDatoSelectFecha(event: Event): void{

    // cambiso el valor para quitar la caja de texto
    this.ocultarMotivoConsulta = false;

    // tomamos el target de elemento
    const target = event.target as HTMLSelectElement;

    // guardamos el valor y lo pasamos a tipo number
    const idSeleccionado = Number(target.value);

    // buscamos el registro con el valor guardado anteriormente
    const registroSelect = this.diagnosticoHechos.find(item  => item.id == idSeleccionado);

    // validamos que haya dato y rellenamos los campos necesarios
    if (registroSelect) {
      this.formularioForm.get('diagnostico')?.patchValue({
        diagnostico: registroSelect.id_diagnostico,
        tratamiento_diagnostico: registroSelect.tratamiento,
        pronostico_diagnostico: registroSelect.pronostico,
        control_diagnostico: registroSelect.control
      });

      this.formularioForm.get('historiaForm')?.patchValue({
        motivoConsulta: registroSelect.motivo_consulta,
      })
    }
  }

  // funcion para limpiar las cajas de texto
  limpiarCajasDiagnostico() {
    this.formularioForm.get('diagnostico')?.reset();
    if (this.selectDiag) {
      this.selectDiag.nativeElement.value = ''; // Reinicia al valor predeterminado
    }
    this.ocultarMotivoConsulta = true;
  }

  // funcion para agregar un diagnostico nuevo
  agregarDiagnosticoNuevo() {
    if (this.txaMotivo && this.txaMotivo.nativeElement) {  
      
      if(!this.formularioForm.get('diagnostico')?.invalid &&  this.txaMotivo.nativeElement.value != ''){
        console.log('es verdadero');
        const diagnosticoDatos = this.formularioForm.get('diagnostico')?.value;
        const motivoConsulta = this.txaMotivo.nativeElement.value;
        console.log(motivoConsulta);
        this.superadminservice.guardarRegistroDiagxHistoriaClinica(

          this.idHistoriaClinica,
          diagnosticoDatos.diagnostico,
          motivoConsulta,
          diagnosticoDatos.tratamiento_diagnostico,
          diagnosticoDatos.pronostico_diagnostico,
          diagnosticoDatos.control_diagnostico,

        ).pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => { 
          console.log(response);
          console.log('status diagn: '+response.status)
          // varificamos si se inserto o hubo error
          if (response.status != 200 && response.status != 201) {
            // hubo error
            console.log('error al insertar en diagnostico, verifiquue los datos y vuelva a intentarlo')
            
          } else {
            // salio bien   
            console.log('El diagnostico se agrego correcta')
            location.reload();
          }
        }, error => {
          console.error('Error al guardar el registro', error);
          this.datoInsertado = false;
        })
      } else {
        console.log('faltan datos por agregar');
      }
    } else {
      console.log('rellene el motivo de la consulta')
      this.ocultarMotivoConsulta = true;
    }
  }
}
