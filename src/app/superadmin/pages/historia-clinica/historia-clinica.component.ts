import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Para usar al hacer la llamada al API
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicio para comunicarse con el API
import { SuperadminService } from '../../../servicios/superadmin.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn  } from '@angular/forms';
import { BlobOptions } from 'buffer';
import { DEFAULT_CIPHERS } from 'tls';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent implements AfterViewInit {
  currentStep: number = 1;

  formularioForm: FormGroup;

  readonlyPadre: boolean = false;

  // variable para tomar el documento de usuario
  documentoAdministrador = sessionStorage.getItem('identity')?.replace(/^"|"$/g, '');

  // variable para tomar el rol de usuario
  rolUsuarioActual!: number;

  // variable para tomar el documento de usuario
  documentoPadre: string = '';
  documentoHijo: string = '';
  accionModulo: string = '';
  idHijo: string = '';
  edadPaciente: string = '';
  idHistoriaClinica!: number;
  datoInsertado: boolean = false;
  ocultarMotivoConsulta: boolean = false;
  disableed: boolean = true;
  existeHistoria: boolean = false;
  correctoInsercion: boolean = false;
  fechaActual!: string;
  nombreBoton!: string;
  limpiarCajas: boolean = true;
  vistaCargara: boolean = false;
  fechaDiagnosticoSelec!: string;

  cajasForm = {
    antevisua: false,
    agudeza: false,
    retino: false,
    alinea: false,
    version: false,
    duccion: false,
    motali: false,
    explo: false,
    oftalmo: false,
    diag: false
  }
  

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
        fecha:          [''],
        hora:           [''],
        hijoNombre:     [''],
        hijoApellido:   [''],
        padreNombre:    [''],
        padreApellido:  [''],
        direccion:      [''],
        telefono:       [''],
        motivoConsulta: ['', Validators.required],
      }),

      // Hoja 2
      antePersoForm: this.fb.group({
        edad_embarazo_madre: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],

        fue_alto_riesgo: ['', [Validators.required, this.validarSelect()]],
        especifique_riesgo: ['', Validators.required],

        semanas_gestacion: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        tipo_parto: ['', [Validators.required, this.validarSelect()]],

        complicaciones_parto: ['', [Validators.required, this.validarSelect()]],
        especifique_complicaciones: ['', Validators.required],

        uso_incubadora: ['', [Validators.required, this.validarSelect()]],
        tiempo_incubadora: ['', Validators.required],
        puntaje_apgar: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        respiro_lloro_alnacer: ['', [Validators.required, this.validarSelect()]],

        emfermedad_en_embarazo: ['', [Validators.required, this.validarSelect()]],
        especifque_enfermedad_emb: ['', Validators.required],

        medicamente_en_embarazo: ['', [Validators.required, this.validarSelect()]],
        especifique_medicamento: ['', Validators.required],
        
        emfermedad_sistemica: ['', [Validators.required, this.validarSelect()]],
        especifique_enfer_sistemica: ['', Validators.required],
        alergia: ['', [Validators.required, this.validarSelect()]],
        especifique_alergia: ['', Validators.required],
        cirugia_general_ocular: ['', [Validators.required, this.validarSelect()]],
      }),

      // Hoja 3
      anteVisualForm: this.fb.group({
        //enviar el id de la historia clinica
        correcion_optica: ['', [Validators.required, this.validarSelect()]],
        edad_lente_primera_vez: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        cuantos_cambio_rx: ['', Validators.required],
        motivo_cambio_rx: ['', Validators.required],
        material_tratamiento_optico: ['', Validators.required],
        indicaciones_uso: ['', Validators.required],
        fecha_ultimo_examen: ['', Validators.required],
      }),

      // Hoja 4
      agudezaForm: this.fb.group({
        test:         ['', Validators.required],
        distancia:    ['', Validators.required],
        od_sc_vl:     ['', Validators.required],
        od_vp:        ['', Validators.required],
        od_ph:        ['', Validators.required],
        os_sc_vl:     ['', Validators.required],
        os_vp:        ['', Validators.required],
        os_ph:        ['', Validators.required],
        lensome_od:   ['', Validators.required],
        lensome_os:   ['', Validators.required],
        od_cc_vl:     ['', Validators.required],
        od_vp_lenso:  ['', Validators.required],
        os_cc_vl:     ['', Validators.required],
        os_vp_lenso:  ['', Validators.required],
        queratome_od: ['', Validators.required],
        queratome_os: ['', Validators.required],
      }),

      // Hoja 5
      retinoscopiaForm: this.fb.group({
        retino_tecnica:   ['', Validators.required],
        retino_ciclople:  ['', Validators.required],
        retino_refrac_od: ['', Validators.required],
        retino_subjet_od: ['', Validators.required],
        retino_final_od:  ['', Validators.required],
        retino_refrac_os: ['', Validators.required],
        retino_subjet_os: ['', Validators.required],
        retino_final_os:  ['', Validators.required],
      }),

      // Hoja 6
      alineamientoForm: this.fb.group({
        hirschberg:           ['', Validators.required],
        bruckner:             ['', Validators.required],
        angulo_kapa:          ['', Validators.required],
        covet_test_vl:        ['', Validators.required],
        covet_test_vp:        ['', Validators.required],
        esta_acomo_flex_od:   ['', Validators.required],
        esta_acomo_flex_os:   ['', Validators.required],
        esta_acomo_aa_od:     ['', Validators.required],
        esta_acomo_aa_os:     ['', Validators.required],
      }),

      // Hoja 7
      versionesForm: this.fb.group({
        observacion_versiones: ['', Validators.required],
        rsd_oii: ['', Validators.required],
        rld_rmi: ['', Validators.required],
        rid_osi: ['', Validators.required],
        oid_rsi: ['', Validators.required],
        rmd_rli: ['', Validators.required],
        osd_rii: ['', Validators.required],
      }),

      // Hoja 8
      duccionForm: this.fb.group({
        ducc_normal_od:     ['', Validators.required],
        ducc_parecia_od:    ['', Validators.required],
        ducc_paralisis_od:  ['', Validators.required],
        ducc_normal_os:     ['', Validators.required],
        ducc_parecia_os:    ['', Validators.required],
        ducc_paralisis_os:  ['', Validators.required],
      }),

      // Hoja 8
      motalidadForm: this.fb.group({
        mo_seguimiento_od:  ['', Validators.required],
        mo_sacadicos_od:    ['', Validators.required],
        mo_seguimiento_os:  ['', Validators.required],
        mo_sacadicos_os:    ['', Validators.required],
        mo_seguimiento_ao:  ['', Validators.required],
        mo_sacadicos_ao:    ['', Validators.required],
      }),

      // Hoja 8
      exploracionForm: this.fb.group({
        explo_exter_od: ['', Validators.required],
        explo_exter_os: ['', Validators.required],
      }),

      // Hoja 9
      oftalmoscipiaForma: this.fb.group({
        medi_refrin_od: ['', Validators.required],
        refle_fovea_od: ['', Validators.required],
        papila_od:      ['', Validators.required],
        excav_fisio_od: ['', Validators.required],
        
        vasos_od:       ['', Validators.required],
        rela_arte_od:   ['', Validators.required],
        reti_perif_od:  ['', Validators.required],

        medi_refrin_os: ['', Validators.required],
        refle_fovea_os: ['', Validators.required],
        papila_os:      ['', Validators.required],
        excav_fisio_os: ['', Validators.required],
        
        vasos_os:       ['', Validators.required],
        rela_arte_os:   ['', Validators.required],
        reti_perif_os:  ['', Validators.required],
      }),

      // Hoja 10
      diagnostico: this.fb.group({
        diagnostico:              ['', [Validators.required, this.validarSelect()]],
        tratamiento_diagnostico:  ['', Validators.required],
        pronostico_diagnostico:   ['', Validators.required],
        control_diagnostico:      ['', Validators.required],
      })

    });

    // Validaciones para los formularios con select
    // Escuchar cambios en el select 'fue_alto_riesgo'
    this.formularioForm.get('antePersoForm.fue_alto_riesgo')?.valueChanges.subscribe((valor) => {
        // tomamos el campo que se asocia al select 
        const input = this.formularioForm.get('antePersoForm.especifique_riesgo');
        // si el valor es true pasa a ser requerido para enviar
        if(valor === 'true'){
          input?.enable();
          input?.setValidators(Validators.required);
        } else {
          // si no lo es se desabilita y se quita que sea requerido
          input?.disable();
          input?.clearValidators();
        }
        // reinciamos validaciones y valores
        input?.updateValueAndValidity();
    });

    // Escuchar cambios en el select 'fue_alto_riesgo'
    this.formularioForm.get('antePersoForm.complicaciones_parto')?.valueChanges.subscribe((valor) => {
      // tomamos el campo que se asocia al select 
      const input = this.formularioForm.get('antePersoForm.especifique_complicaciones');
      // si el valor es true pasa a ser requerido para enviar
      if(valor === 'true'){
        input?.enable();
        input?.setValidators(Validators.required);
      } else {
        // si no lo es se desabilita y se quita que sea requerido
        input?.disable();
        input?.clearValidators();
      }
      // reinciamos validaciones y valores
      input?.updateValueAndValidity();
    });

    // Escuchar cambios en el select 'uso_incubadora'
    this.formularioForm.get('antePersoForm.uso_incubadora')?.valueChanges.subscribe((valor) => {
      // tomamos el campo que se asocia al select 
      const input = this.formularioForm.get('antePersoForm.tiempo_incubadora');
      // si el valor es true pasa a ser requerido para enviar
      if(valor === 'true'){
        input?.enable();
        input?.setValidators(Validators.required);
      } else {
        // si no lo es se desabilita y se quita que sea requerido
        input?.disable();
        input?.clearValidators();
      }
      // reinciamos validaciones y valores
      input?.updateValueAndValidity();
    });

    // Escuchar cambios en el select 'emfermedad_en_embarazo'
    this.formularioForm.get('antePersoForm.emfermedad_en_embarazo')?.valueChanges.subscribe((valor) => {
      // tomamos el campo que se asocia al select 
      const input = this.formularioForm.get('antePersoForm.especifque_enfermedad_emb');
      // si el valor es true pasa a ser requerido para enviar
      if(valor === 'true'){
        input?.enable();
        input?.setValidators(Validators.required);
      } else {
        // si no lo es se desabilita y se quita que sea requerido
        input?.disable();
        input?.clearValidators();
      }
      // reinciamos validaciones y valores
      input?.updateValueAndValidity();
    });

    // Escuchar cambios en el select 'medicamente_en_embarazo'
    this.formularioForm.get('antePersoForm.medicamente_en_embarazo')?.valueChanges.subscribe((valor) => {
      // tomamos el campo que se asocia al select 
      const input = this.formularioForm.get('antePersoForm.especifique_medicamento');
      // si el valor es true pasa a ser requerido para enviar
      if(valor === 'true'){
        input?.enable();
        input?.setValidators(Validators.required);
      } else {
        // si no lo es se desabilita y se quita que sea requerido
        input?.disable();
        input?.clearValidators();
      }
      // reinciamos validaciones y valores
      input?.updateValueAndValidity();
    });

    // Escuchar cambios en el select 'emfermedad_sistemica'
    this.formularioForm.get('antePersoForm.emfermedad_sistemica')?.valueChanges.subscribe((valor) => {
      // tomamos el campo que se asocia al select 
      const input = this.formularioForm.get('antePersoForm.especifique_enfer_sistemica');
      // si el valor es true pasa a ser requerido para enviar
      if(valor === 'true'){
        input?.enable();
        input?.setValidators(Validators.required);
      } else {
        // si no lo es se desabilita y se quita que sea requerido
        input?.disable();
        input?.clearValidators();
      }
      // reinciamos validaciones y valores
      input?.updateValueAndValidity();
    });

    // Escuchar cambios en el select 'alergia'
    this.formularioForm.get('antePersoForm.alergia')?.valueChanges.subscribe((valor) => {
      // tomamos el campo que se asocia al select 
      const input = this.formularioForm.get('antePersoForm.especifique_alergia');
      // si el valor es true pasa a ser requerido para enviar
      if(valor === 'true'){
        input?.enable();
        input?.setValidators(Validators.required);
      } else {
        // si no lo es se desabilita y se quita que sea requerido
        input?.disable();
        input?.clearValidators();
      }
      // reinciamos validaciones y valores
      input?.updateValueAndValidity();
    });

    // Escuchar cambios en el select 'correcion_optica'
    this.formularioForm.get('anteVisualForm.correcion_optica')?.valueChanges.subscribe((valor) => {
      // tomamos los campo que se asocia al select 
      const input   = this.formularioForm.get('anteVisualForm.edad_lente_primera_vez');
      const input2  = this.formularioForm.get('anteVisualForm.cuantos_cambio_rx');
      const input3  = this.formularioForm.get('anteVisualForm.material_tratamiento_optico');
      const input4  = this.formularioForm.get('anteVisualForm.indicaciones_uso');
      const input5  = this.formularioForm.get('anteVisualForm.fecha_ultimo_examen');
      

      // si el valor es true pasa a ser requerido para enviar
      if(valor === 'true'){
        // cambios para los inputs segun el valor del select
        input?.enable();
        input?.setValidators([Validators.required, Validators.pattern('^[0-9]{1,2}$')]);

        input2?.enable();
        input2?.setValidators(Validators.required);

        input3?.enable();
        input3?.setValidators(Validators.required);

        input4?.enable();
        input4?.setValidators(Validators.required);

        input5?.enable();
        input5?.setValidators([Validators.required, this.validarFecha(this.formularioForm)]);
      } else {
        // si no lo es se desabilita y se quita que sea requerido
        input?.disable();
        input?.reset();
        input?.clearValidators();

        input2?.disable();
        input2?.reset();
        input2?.clearValidators();

        input3?.disable();
        input3?.reset();
        input3?.clearValidators();

        input4?.disable();
        input4?.reset();
        input4?.clearValidators();

        input5?.disable();
        input5?.reset();
        input5?.clearValidators();
      }
      // reinciamos validaciones y valores
      input?.updateValueAndValidity();
    });
  }

  // FUNCIONES PARA VALIDAR LOS INPUT's ↓
  // SELECT

  // metodo para validar que el ingreso de datos sea correcto
  validarTecla(event: KeyboardEvent): void {
    const teclasPermitidas = [
      'Backspace', // Borrar
      'Delete',    // Eliminar
      'ArrowLeft', // Flecha izquierda
      'ArrowRight', // Flecha derecha
      'Tab',       // Tabulación
      '@',         // Permitir el símbolo '@'
      'x',          // Permitir la letra 'x'
    ];
  
    const teclaPresionada = event.key;
  
    // Si la tecla está en las permitidas, no bloqueamos su comportamiento
    if (teclasPermitidas.includes(teclaPresionada)) {
      return;
    }
  
    // Bloquea únicamente las letras
    const esLetra = /^[a-zA-ZáéíóúÁÉÍÓÚÑñ]$/.test(teclaPresionada) && teclaPresionada !== 'x';
    if (esLetra) {
      event.preventDefault();
    }
  }

  // metodo para validar el valor del select y que no sea vacio
  validarSelect() {
    return (control: AbstractControl) => {
      // validamos que la opcion seleccionada no sea "Seleccion uno" que esta invisible en el DOM
      return control.value === '' ? { seleccionInvalida: true } : null;
    };
  }

  // metodo para validar que la fecha sea igual inferior a la actual
  validarFecha(formulario: FormGroup) {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaSeleccionada = new Date(control.value);
      const fechaActual = new Date(); // tomamos la fecha actual
      const fechaMinima = new Date(
        // sacamos los calculos necesarios
        fechaActual.getFullYear() - 17, // calculo del año
        fechaActual.getMonth(),         // calculo del mes
        fechaActual.getDate()           // tomamos el dato
      );
      // validamos que la fecha sea igual o menor a hoy
      if (fechaSeleccionada > fechaActual) {
        return { fechaInvalida: true }; // si es dejamos pasar
      }
      // validamos que la fecha sea como mucho igual o menor a 17
      if (fechaSeleccionada < fechaMinima) {
        return { fechaInvalida: true }; // si es dejamos pasar
      }
      return null;
    };
  }

  // metodo que incia al iniciar el componente
  ngAfterViewInit(): void {
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

    this.cargarRegistroDiagnostico();
    
    // metodo para esperar hasta que se termine de realizar al completo
    this.cargarDocumentoHijo().then(() => {

      // Esta función se ejecutará después de que cargarDocumentoHijo se complete 
      this.obtenerDatosDelPadre();

      // buscar si el hijo tiene historia clinica
      this.buscarHisoriaClinica().then(() =>{
        // verificamos si se va a agregar todo o solo el diagnostico
        if (this.existeHistoria){
          
          this.currentStep = 10;
          
          if(this.rolUsuarioActual == 2){
            this.readonlyPadre = true;
          }

          // llamamos a la funcion para traer los datos de la historia clinica
          this.cargarRegistroHistoria().then(() => {

            // llamamos a la funcion para traer los datos de la historia clinica
            this.cargarRegistrosDiagnosticos().then(() => {
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
            });
          });
        } else {

          if(this.rolUsuarioActual == 1) {
            const today = new Date();
            this.fechaActual = today.toISOString().split('T')[0];

            // metodo para tomar los datos del localstorage en caso de que existan
            const savedValues = JSON.parse(localStorage.getItem(`formValues_${this.documentoHijo}`) || '{}');

            // Eliminamos el grupo `historiaForm` del objeto `savedValues`
            if (savedValues.historiaForm) {
              delete savedValues.historiaForm; // Excluir valores de historiaForm
            }

            // aplicamos lo que tengamos en el localstorage
            this.formularioForm.patchValue(savedValues);
      
            // Escuchar cambios en el formulario principal y guardar en localStorage 
            this.formularioForm.valueChanges.subscribe(values => { 
              localStorage.setItem(`formValues_${this.documentoHijo}`, JSON.stringify(values));
            });
      
            // Establecer fecha y hora actuales en los controles del formulario 
            const currentDate = new Date(); 
            const currentDateString = currentDate.toISOString().split('T')[0]; 
            const currentTimeString = currentDate.toTimeString().split(' ')[0].substring(0, 5);
            this.formularioForm.get('historiaForm')?.patchValue({
              fecha: currentDateString,
              hora: currentTimeString,
            });
          } else {
            this.mostrarAlerta('', 'Este paciente no tiene historia clinica', 'info');
            this.router.navigate(['/hijo']);
          }
        }
      });
      setTimeout(() => {
        this.vistaCargara = true;
      }, 1000);
    })
    .catch((error) => { 
      console.error('Error en la obtención del documento del padre:', error); 
    });
  }

  // funcion para finalizar la consulta y evitar que la pagina se quede cargando
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // funcion para verificar si el hijo tiene historia clinica
  buscarHisoriaClinica(): Promise<void> {
    // buscamos la historia 
    return new Promise((resolve, reject) => {
      this.superadminservice.obtenerRegistroHistoria(this.idHijo)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
          if(!data.status) {
            this.existeHistoria = true;
          }
          //console.log(this.existeHistoria)
          resolve();
      });
    });
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
        this.mostrarAlerta('', 'No hay diagnosticos', 'info');
      }
    })
  }

  // funcion para traer el dato del padre
  cargarDocumentoHijo (): Promise<void> {
    return new Promise((resolve, reject) => {
      this.superadminservice.buscarPaciente(this.documentoHijo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        // validmaos que el status sea correcto
        if (!data.mensaje){
          this.hijo = data.hijo;
          this.documentoPadre = data.hijo.id_usuario;
          this.idHijo = data.hijo.id;
          this.edadPaciente = data.hijo.edad;
          //console.log(this.idHijo);
          const datosParaHijo = {
            hijoNombre: data.hijo.nombre,
            hijoApellido: data.hijo.apellido,
            direccion: data.hijo.direccion,
          };
          this.formularioForm.get('historiaForm')?.patchValue(datosParaHijo);
          resolve(); // Resolución de la promesa después de completar la tarea
        } else {
          this.mostrarAlerta('', 'El hijo no esta registrado', 'error');
          if (this.rolUsuarioActual == 1) {
            this.router.navigate(['/paciente']);
          } else {
            this.router.navigate(['/hijo']);
          }
          
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
    this.cambiarNombreBoton();
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
        this.mostrarAlerta('', 'El padre no esta registrado', 'error');
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
    this.cambiarNombreBoton();
  }

  // Función para ir al paso anterior
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    this.cambiarNombreBoton();
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
      //console.log(this.formularioForm.value);
      this.mostrarAlerta('', 'Espere mientras se guarda la historia clinica', 'info');

      // Mostrar el overlay para evitar la interacción del usuario
      document.getElementById('overlay')!.style.display = 'block';
      
      try {
        // realizamos las siguientes funciones para insertar cada dato necesario
        await this.guardarRegistrosHistoriaClinica();

        await this.guardarRegistrosDiagnostico();

        await this.guardarRegistrosAntecedenteVisual();

        await this.guardarRegistrosAgudezaVisual();

        await this.guardarRegistrosRetinoscopia();

        await this.guardarRegistrosAlineamiento();

        await this.guardarRegistrosVersiones();

        await this.guardarRegistrosDucciones();

        await this.guardarRegistrosMotalidades();

        await this.guardarRegistrosExploracion();

        await this.guardarRegistrosOftalmoscopias();

        //console.log(this.datoInsertado);

        if (this.datoInsertado) {

          this.formularioForm.reset();

          // Limpiar el localstorage cuando se necesite
          localStorage.removeItem(`formValues_${this.documentoHijo}`);

          // verificamos si se inserto la historia
          this.correctoInsercion = true;

          // Mostrar alerta de éxito 
          this.mostrarAlerta('', 'Todos los registros se han guardado correctamente.', 'success');
        } 

      }catch (error) { 
        console.error('Error al guardar los registros:', error);
        // Mostrar alerta de error 
        this.mostrarAlerta('', 'Ocurrió un error al guardar los registros. Por favor, intenta nuevamente.', 'error');

        document.getElementById('overlay')!.style.display = 'none'; 
      } finally { 
        // Ocultar el overlay para permitir la interacción del usuario 
        document.getElementById('overlay')!.style.display = 'none'; 
      } 
    } else {
      //console.log('Formulario no válido'); 
      this.formularioForm.markAllAsTouched();
      this.validarFormulario();
    }
    document.getElementById('overlay')!.style.display = 'none';
    if (this.correctoInsercion == true) {
      this.router.navigate(['/paciente']);
    }
    //this.verificarEstadoPadre();
  }

  // funcion para validar que formulario falta por ser rellenado
  validarFormulario() {
    const historiaFormInvalid   = this.formularioForm.get('historiaForm')?.invalid;
    const antePersoFormInvalid  = this.formularioForm.get('antePersoForm')?.invalid;
    const anteVisualForm      = this.formularioForm.get('anteVisualForm')?.invalid;
    const agudezaForm         = this.formularioForm.get('agudezaForm')?.invalid;
    const retinoscopiaForm    = this.formularioForm.get('retinoscopiaForm')?.invalid;
    const alineamientoForm    = this.formularioForm.get('alineamientoForm')?.invalid;
    const versionesForm       = this.formularioForm.get('versionesForm')?.invalid;
    const duccionForm = this.formularioForm.get('duccionForm')?.invalid;
    const motalidadForm = this.formularioForm.get('motalidadForm')?.invalid;
    const exploracionForm = this.formularioForm.get('exploracionForm')?.invalid;
    const oftalmoscipiaForma  = this.formularioForm.get('oftalmoscipiaForma')?.invalid;
    const diagnostico         = this.formularioForm.get('diagnostico')?.invalid;
  
    switch (true) {
      case historiaFormInvalid:
        this.mostrarAlerta('', 'Faltan Datos de Anamnesis, Primera Hoja', 'warning');
        this.currentStep = 1;
        break;
      case antePersoFormInvalid:
        this.mostrarAlerta('', 'Faltan Datos en Antecedente Personal, Segunda Hoja', 'warning');
        this.currentStep = 2;
        break;
      case anteVisualForm:
        this.mostrarAlerta('', 'Faltan Datos en Antecedente Visual, Tercera Hoja', 'warning');
        this.currentStep = 3;
        break;
      case agudezaForm:
        this.mostrarAlerta('', 'Faltan Datos en Agudeza Visual, Cuarta Hoja', 'warning');
        this.currentStep = 4;
        break;
      case retinoscopiaForm:
        this.mostrarAlerta('', 'Faltan Datos en Retinoscopía, Quinta Hoja', 'warning');
        this.currentStep = 5;
        break;
      case alineamientoForm:
        this.mostrarAlerta('', 'Faltan Datos en Alineamiento Motor, Sexta Hoja', 'warning');
        this.currentStep = 6;
        break;
      case versionesForm:
        this.mostrarAlerta('', 'Faltan Datos en Antecedente Versiones, Septima Hoja', 'warning');
        this.currentStep = 7;
        break;
      case duccionForm:
        this.mostrarAlerta('', 'Faltan Datos en Ducciones, Octava Hoja', 'warning');
        this.currentStep = 8;
        break;
      case motalidadForm:
        this.mostrarAlerta('', 'Faltan Datos en Motalidad, Octava Hoja', 'warning');
        this.currentStep = 8;
        break;
      case exploracionForm:
        this.mostrarAlerta('', 'Faltan Datos en Exploracion, Octava Hoja', 'warning');
        this.currentStep = 8;
        break;
      case oftalmoscipiaForma:
        this.mostrarAlerta('', 'Faltan Datos en Oftalmoscopía, Novena Hoja', 'warning');
        this.currentStep = 9;
        break;
      case diagnostico:
        this.mostrarAlerta('', 'Faltan Datos en Diagnostico, Ultima Hoja', 'warning');
        this.currentStep = 10;
        break;
      default:
      break;
    }
  }


  // FUNCIONES DE AGREGACION DE HISTORIA CLINICA ↓
  // Funcion para insertar la historia clinica
  guardarRegistrosHistoriaClinica(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(!this.formularioForm.invalid){
        //console.log('es verdadero');
        const historiaFormValues = this.formularioForm.get('historiaForm')?.value;
        const antePersoFormValues = this.formularioForm.get('antePersoForm')?.value;

        this.superadminservice.guardarRegistroHistoriaClinica(
          this.idHijo,
          this.documentoPadre, 
          antePersoFormValues.edad_embarazo_madre, 
          Boolean(antePersoFormValues.fue_alto_riesgo === 'true'),
          antePersoFormValues.especifique_riesgo, 
          antePersoFormValues.semanas_gestacion, 
          antePersoFormValues.tipo_parto, 
          Boolean(antePersoFormValues.complicaciones_parto === 'true'),
          antePersoFormValues.especifique_complicaciones,
          Boolean(antePersoFormValues.uso_incubadora === 'true'),
          antePersoFormValues.tiempo_incubadora,
          antePersoFormValues.puntaje_apgar,
          Boolean(antePersoFormValues.respiro_lloro_alnacer === 'true'),
          Boolean(antePersoFormValues.emfermedad_en_embarazo === 'true'),
          antePersoFormValues.especifque_enfermedad_emb,
          Boolean(antePersoFormValues.medicamente_en_embarazo === 'true'),
          antePersoFormValues.especifique_medicamento,
          Boolean(antePersoFormValues.emfermedad_sistemica === 'true'),
          antePersoFormValues.especifique_enfer_sistemica,
          Boolean(antePersoFormValues.alergia === 'true'), 
          antePersoFormValues.especifique_alergia,
          Boolean(antePersoFormValues.cirugia_general_ocular === 'true'),
          historiaFormValues.fecha,
          historiaFormValues.hora,
          historiaFormValues.direccion,

        ).pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => { 
          
          // verificamos si existe un registro ya
          if (response.existe) {
            this.mostrarAlerta('', 'Ya existe un registro de historia clinica para este hijo', 'info');
            document.getElementById('overlay')!.style.display = 'none'; 
          } else {
            //console.log(response)
            //console.log(response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              
              // hubo error
              //console.log('error al insertar la historia clinica')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta de historia clinica')
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
    //console.log('entro a antece visu');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
          const anteceVisualDatos = this.formularioForm.get('anteVisualForm')?.value;
  
          this.superadminservice.guardarRegistroAntecedenteVisual(

            this.idHistoriaClinica,
            Boolean(anteceVisualDatos.correcion_optica === 'true'),
            anteceVisualDatos.edad_lente_primera_vez,
            anteceVisualDatos.cuantos_cambio_rx,
            anteceVisualDatos.motivo_cambio_rx,
            anteceVisualDatos.material_tratamiento_optico,
            anteceVisualDatos.indicaciones_uso,
            anteceVisualDatos.fecha_ultimo_examen,
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            //console.log(response);
            //console.log('status antevisu: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar el antecedente visual')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en antecedente visual')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto antecedente visual');
      }
    });
  }

  // Funcion para insertar la agudeza visual
  guardarRegistrosAgudezaVisual(): Promise<void> {
    //console.log('entro a agudeza visua');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
          const agudezaVisuDatos = this.formularioForm.get('agudezaForm')?.value;
          //console.log(agudezaVisuDatos);
  
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

            //console.log(response);
            //console.log('status agudeza visu: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar la agudeza visual')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en agudeza visual')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto en agudeza visual');
      }
    });
  }

  // Funcion para insertar la retinoscopia
  guardarRegistrosRetinoscopia(): Promise<void> {
    //console.log('entro a retinoscopia');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
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

            //console.log(response);
            //console.log('status retinos: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar la retinosco')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en retinosco')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto la retinosco');
      }
    });
  }

  // Funcion para insertar el alineamiento motor
  guardarRegistrosAlineamiento(): Promise<void> {
    //console.log('entro a alineamiento');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
          const alineamientoDatos = this.formularioForm.get('alineamientoForm')?.value;
  
          this.superadminservice.guardarRegistroAlineamientoMotor(

            this.idHistoriaClinica,
            alineamientoDatos.hirschberg,
            alineamientoDatos.bruckner,
            alineamientoDatos.angulo_kapa,
            alineamientoDatos.covet_test_vl,
            alineamientoDatos.covet_test_vp,
            alineamientoDatos.esta_acomo_flex_od,
            alineamientoDatos.esta_acomo_flex_os,
            alineamientoDatos.esta_acomo_aa_od,
            alineamientoDatos.esta_acomo_aa_os,
            
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            //console.log(response);
            //console.log('status alineam: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar el alineam')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en alineam')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto el alineami');
      }
    });
  }

  // Funcion para insertar las versiones
  guardarRegistrosVersiones(): Promise<void> {
    //console.log('entro a version');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
          const versionDatos = this.formularioForm.get('versionesForm')?.value;
  
          this.superadminservice.guardarRegistroVersiones(

            this.idHistoriaClinica,
            versionDatos.observacion_versiones,
            versionDatos.rsd_oii,
            versionDatos.rld_rmi,
            versionDatos.rid_osi,
            versionDatos.oid_rsi,
            versionDatos.rmd_rli,
            versionDatos.osd_rii,
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            //console.log(response);
            //console.log('status version: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar en versiones')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en versiones')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto en versiones');
      }
    });
  }

  // Funcion para insertar las ducciones
  guardarRegistrosDucciones(): Promise<void> {
    //console.log('entro a ducciones');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
          const duccionDatos = this.formularioForm.get('duccionForm')?.value;
  
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

            //console.log(response);
            //console.log('status duccion: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar en duccion')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en duccion')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto en duccion');
      }
    });
  }

  // Funcion para insertar las motalidades oculares
  guardarRegistrosMotalidades(): Promise<void> {
    //console.log('entro a motalidad');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
          const motalidadDatos = this.formularioForm.get('motalidadForm')?.value;
  
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

            //console.log(response);
            //console.log('status motalidad: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar en motalidad')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en motalidad')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto en motalidad');
      }
    });
  }

  // Funcion para insertar las exploracionres
  guardarRegistrosExploracion(): Promise<void> {
    //console.log('entro a exploracion');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
          const exploracionDatos = this.formularioForm.get('exploracionForm')?.value;
  
          this.superadminservice.guardarRegistroExploracionExternos(

            this.idHistoriaClinica,
            exploracionDatos.explo_exter_od,
            exploracionDatos.explo_exter_os,
            
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            //console.log(response);
            //console.log('status explo: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar en explo')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en explo')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto en explo');
      }
    });
  }

  // Funcion para insertar las oftalmoscopias
  guardarRegistrosOftalmoscopias(): Promise<void> {
    //console.log('entro a oftalmoscopia');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
          const oftalmosDatos = this.formularioForm.get('oftalmoscipiaForma')?.value;
  
          this.superadminservice.guardarRegistroOftalmoscopia(

            this.idHistoriaClinica,
            oftalmosDatos.medi_refrin_od,
            oftalmosDatos.refle_fovea_od,
            oftalmosDatos.papila_od,
            oftalmosDatos.excav_fisio_od,
            
            oftalmosDatos.vasos_od,
            oftalmosDatos.rela_arte_od,
            
            oftalmosDatos.reti_perif_od,
            oftalmosDatos.medi_refrin_os,
            oftalmosDatos.refle_fovea_os,
            oftalmosDatos.papila_os,
            oftalmosDatos.excav_fisio_os,
            
            oftalmosDatos.vasos_os,
            oftalmosDatos.rela_arte_os,
            
            oftalmosDatos.reti_perif_os,
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            //console.log(response);
            //console.log('status oftalmo: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar en oftalmo')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en oftalmo')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto en oftalmo');
      }
    });
  }

  // Funcion para insertar los diagnosticos x historia clinica
  guardarRegistrosDiagnostico(): Promise<void> {
    //console.log('entro a diagnostico');
    return new Promise((resolve, reject) => {
      if (this.datoInsertado) {
        if(!this.formularioForm.invalid){
          //console.log('es verdadero');
          const diagnosticoDatos = this.formularioForm.get('diagnostico')?.value;
          const historiaDatos = this.formularioForm.get('historiaForm')?.value;
  
          this.superadminservice.guardarRegistroDiagxHistoriaClinica(

            this.idHistoriaClinica,
            diagnosticoDatos.diagnostico,
            this.idHijo,
            historiaDatos.motivoConsulta,
            diagnosticoDatos.tratamiento_diagnostico,
            diagnosticoDatos.pronostico_diagnostico,
            diagnosticoDatos.control_diagnostico,
            
          ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => { 

            //console.log(response);
            //console.log('status diagn: '+response.status)
            // varificamos si se inserto o hubo error
            if (response.status != 200 && response.status != 201) {
              // hubo error
              //console.log('error al insertar en diagn')
              this.datoInsertado = false;
            } else {
              // salio bien   
              //console.log('insercion correcta en diagn')
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
        //console.log(this.datoInsertado);
        //console.log('no se inserto en diagn');
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
      //console.log('El formulario principal es válido'); 
    } 
  } 
  
  private verificarEstadoFormGroup(formGroup: FormGroup, formGroupName: string) { 
    // Itera sobre cada control del FormGroup anidado 
    for (const controlName in formGroup.controls) { 
      if (formGroup.controls.hasOwnProperty(controlName)) { 
        const control = formGroup.get(controlName) as AbstractControl; 
        if (control && control.invalid) { 
          // Imprimir el nombre del control y su estado 
          //console.log(`${formGroupName}.${controlName} es inválido:`, control.errors); 
        } else { 
          //console.log(`${formGroupName}.${controlName} es válido`); 
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
          this.mostrarAlerta('', 'No se encontro Historia Clinica del paciente', 'info');
          this.router.navigate(['/paciente']);
        }
        resolve();
      })
    });  
  }

  // Funcion para obtener datos de antecedente visual
  cargarRegistroAnteceVisual () {
    this.superadminservice.obtenerRegistroAnteVisual(this.idHistoriaClinica, this.fechaDiagnosticoSelec)
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
        this.formularioForm.get('anteVisualForm')?.reset();
        this.cajasForm.antevisua   = true;
      }
      
    })
  }

  // Funcion para obtener datos de antecedente visual
  cargarRegistroAgudezaVisual () {
    this.superadminservice.obtenerRegistroAgudeza(this.idHistoriaClinica, this.fechaDiagnosticoSelec)
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
        this.formularioForm.get('agudezaForm')?.reset();
        this.cajasForm.agudeza = true;
      }
    })
  }

  // Funcion para obtener datos de la retinoscopia
  cargarRegistroRetinoscopia () {
    this.superadminservice.obtenerRegistroRetinoscopia(this.idHistoriaClinica, this.fechaDiagnosticoSelec)
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
        this.formularioForm.get('retinoscopiaForm')?.reset();
        this.cajasForm.retino = true;
      }
    })
    if(!this.vistaCargara){
      this.vistaCargara = true;
    }
  }

  // Funcion para obtener datos del alineamiento motor
  cargarRegistroAlineamiento () {
    this.superadminservice.obtenerRegistroAlineamiento(this.idHistoriaClinica, this.fechaDiagnosticoSelec)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('alineamientoForm')?.patchValue({
          hirschberg: data.test_hirschberg,
          bruckner: data.test_bruckner,
          angulo_kapa: data.angulo_kapa,
          covet_test_vl: data.covet_test_vl,
          covet_test_vp: data.covet_test_vp,
          esta_acomo_flex_od: data.esta_acomo_flex_od,
          esta_acomo_flex_os: data.esta_acomo_flex_os,
          esta_acomo_aa_od: data.esta_acomo_aa_od,
          esta_acomo_aa_os: data.esta_acomo_aa_os,
        });
      } else {
        this.formularioForm.get('alineamientoForm')?.reset();
        this.cajasForm.alinea = true;
      }
    })
  }

  // Funcion para obtener datos de las versiones
  cargarRegistroVersiones () {
    this.superadminservice.obtenerRegistroVersiones(this.idHistoriaClinica, this.fechaDiagnosticoSelec)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('versionesForm')?.patchValue({
          observacion_versiones:  data.observacion,
          oid_rsi: data.oid_rsi,
          osd_rii: data.osd_rii,
          rid_osi: data.rid_osi,
          rld_rmi: data.rld_rmi,
          rmd_rli: data.rmd_rli,
          rsd_oii: data.rsd_oii,
        });
      } else {
        this.formularioForm.get('versionesForm')?.reset();
        this.cajasForm.version = true;
      }
    })
  }

  // Funcion para obtener datos de las ducciones
  cargarRegistroDucciones () {
    this.superadminservice.obtenerRegistroDucciones(this.idHistoriaClinica, this.fechaDiagnosticoSelec)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('duccionForm')?.patchValue({
          ducc_normal_od:     data.ducc_normal_od,
          ducc_parecia_od:    data.ducc_parecia_od,
          ducc_paralisis_od:  data.ducc_paralisis_od,
          ducc_normal_os:     data.ducc_normal_os,
          ducc_parecia_os:    data.ducc_parecia_os,
          ducc_paralisis_os:  data.ducc_paralisis_os,
        });
        this.cajasForm.duccion = false;
      } else {
        this.formularioForm.get('duccionForm')?.reset();
        this.cajasForm.duccion = true;
      }
    })
  }

  // Funcion para obtener datos de la motalidad ocular
  cargarRegistroMotalidad () {
    this.superadminservice.obtenerRegistroMotalidad(this.idHistoriaClinica, this.fechaDiagnosticoSelec)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('motalidadForm')?.patchValue({
          mo_seguimiento_od:  data.mo_seguimiento_od,
          mo_sacadicos_od:    data.mo_sacadicos_od,
          mo_seguimiento_os:  data.mo_seguimiento_os,
          mo_sacadicos_os:    data.mo_sacadicos_os,
          mo_seguimiento_ao:  data.mo_seguimiento_ao,
          mo_sacadicos_ao:    data.mo_sacadicos_ao,
        });
      } else {
        this.formularioForm.get('motalidadForm')?.reset();
        this.cajasForm.motali = true;
      }
      
    })
  }

  // Funcion para obtener datos de la exploracion de externos
  cargarRegistroExploracion () {
    this.superadminservice.obtenerRegistroExploracion(this.idHistoriaClinica, this.fechaDiagnosticoSelec)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('exploracionForm')?.patchValue({
          explo_exter_od:  data.explo_exter_od,
          explo_exter_os:  data.explo_exter_os,
        });
      } else {
        this.formularioForm.get('exploracionForm')?.reset();
        this.cajasForm.explo = true;
      }
      
    })
  }

  // Funcion para obtener datos de la oftalmoscopia
  cargarRegistroOftalmoscopia () {
    this.superadminservice.obtenerRegistroOftalmoscopia(this.idHistoriaClinica, this.fechaDiagnosticoSelec)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(!data.mensaje){
        this.formularioForm.get('oftalmoscipiaForma')?.patchValue({
          medi_refrin_od:   data.medi_refrin_od,
          refle_fovea_od:   data.refle_fovea_od,
          papila_od:        data.papila_od,
          excav_fisio_od:   data.excav_fisio_od,
          
          vasos_od:         data.vasos_od,
          rela_arte_od:     data.rela_arte_od,
          
          reti_perif_od:    data.reti_perif_od,
          medi_refrin_os:   data.medi_refrin_os,
          refle_fovea_os:   data.refle_fovea_os,
          papila_os:        data.papila_os,
          excav_fisio_os:   data.excav_fisio_os,
          
          vasos_os:         data.vasos_os,
          rela_arte_os:     data.rela_arte_os,
          
          reti_perif_os:    data.reti_perif_os,
        });
        this.cajasForm.oftalmo = false;
        this.cambiarNombreBoton();
      } else {
        this.formularioForm.get('oftalmoscipiaForma')?.reset();
        this.cajasForm.oftalmo = true;
      }
      
    })
  }

  // Funcion para obtener datos de la historia clinica
  cargarRegistrosDiagnosticos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.superadminservice.obtenerRegistrosDiagnosticos(this.idHistoriaClinica)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (data) => {
            if (!data.mensaje) {
              this.diagnosticoHechos = data;
              const objetoMasReciente = this.diagnosticoHechos.reduce((a, b) => new Date(a.fecha) > new Date(b.fecha) ? a : b);
              this.fechaDiagnosticoSelec = objetoMasReciente.fecha;
              
              this.formularioForm.get('diagnostico')?.patchValue({
                diagnostico: objetoMasReciente.id_diagnostico,
                tratamiento_diagnostico: objetoMasReciente.tratamiento,
                pronostico_diagnostico: objetoMasReciente.pronostico,
              });
  
              const fechaFormato = objetoMasReciente.control.split(" ")[0];
  
              this.formularioForm.get('diagnostico')?.patchValue({
                control_diagnostico: fechaFormato,
              });
  
              this.formularioForm.get('historiaForm')?.patchValue({
                motivoConsulta: objetoMasReciente.motivo_consulta,
              });
  
              setTimeout(() => {
                if (this.selectDiag) {
                  this.selectDiag.nativeElement.value = objetoMasReciente.id.toString();
                }
              }, 1000);
  
              // Resolver la promesa una vez que se han realizado todas las actualizaciones
              resolve();
            } else {
              this.mostrarAlerta('', 'No se encontró registro de Diagnósticos del paciente', 'info');
              // Rechazar la promesa si no hay datos
              reject('No se encontraron datos');
            }
          },
          error: (error) => {
            // Rechazar la promesa en caso de error
            reject(error);
          }
        });
    });
  }  

  // Funcion para llenar los cambios al cambiar de consulta
  cambioDatoSelectFecha(event: Event): void{

    // cambiso el valor para quitar la caja de texto
    this.ocultarMotivoConsulta = false;
    this.cajasForm.diag = false;

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
      });

      const fechaFormato = registroSelect.control.split(" ")[0];

      this.fechaDiagnosticoSelec = registroSelect.fecha;

      this.formularioForm.get('diagnostico')?.patchValue({
        control_diagnostico:  fechaFormato,
      });

      this.formularioForm.get('historiaForm')?.patchValue({
        motivoConsulta: registroSelect.motivo_consulta,
      });

      this.mostrarAlerta('', 'Se estan cargando los datos', 'info');
      
      // llamamos a la funcion para traer los datos de la oftalmoscopia
      this.cargarRegistroOftalmoscopia();

      // llamamos a la funcion para traer los datos de la exploracion de externo
      this.cargarRegistroExploracion();

      // llamamos a la funcion para traer los datos de la motalidad ocular
      this.cargarRegistroMotalidad();

      // llamamos a la funcion para traer los datos de las ducciones
      this.cargarRegistroDucciones();

      // llamamos a la funcion para traer los datos de las versiones
      this.cargarRegistroVersiones();

      // llamamos a la funcion para traer los datos del alineamiento motor
      this.cargarRegistroAlineamiento();

      // llamamos a la funcion para traer los dato de anteceden visual
      this.cargarRegistroAnteceVisual();

      // llamamos a la funcion para traer los datos de agudeza visual
      this.cargarRegistroAgudezaVisual();

      // llamamos a la funcion para traer los datos de retinoscopia
      this.cargarRegistroRetinoscopia();  
    }
  }

  // funcion para limpiar las cajas de texto
  limpiarCajasDiagnostico() {
    this.formularioForm.get('diagnostico')?.reset();
    if (this.selectDiag) {
      this.selectDiag.nativeElement.value = ''; // Reinicia al valor predeterminado
    }
    this.ocultarMotivoConsulta = true;
    this.cajasForm.diag = true;
  }

  // funcion para agregar un diagnostico nuevo
  agregarDiagnosticoNuevo() {
    if (this.txaMotivo && this.txaMotivo.nativeElement) {  
      
      if(!this.formularioForm.get('diagnostico')?.invalid &&  this.txaMotivo.nativeElement.value != ''){
        //console.log('es verdadero');
        const diagnosticoDatos = this.formularioForm.get('diagnostico')?.value;
        const motivoConsulta = this.txaMotivo.nativeElement.value;
        //console.log(motivoConsulta);
        this.superadminservice.guardarRegistroDiagxHistoriaClinica(

          this.idHistoriaClinica,
          diagnosticoDatos.diagnostico,
          this.idHijo,
          motivoConsulta,
          diagnosticoDatos.tratamiento_diagnostico,
          diagnosticoDatos.pronostico_diagnostico,
          diagnosticoDatos.control_diagnostico,

        ).pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => { 
          //console.log(response);
          //console.log('status diagn: '+response.status)
          // varificamos si se inserto o hubo error
          if (response.status != 200 && response.status != 201) {
            // hubo error
            //console.log('error al insertar en diagnostico, verifiquue los datos y vuelva a intentarlo')
            
          } else {
            // salio bien   
            //console.log('El diagnostico se agrego correcta')
            this.mostrarAlerta('', 'Diagnóstico insertado con exito', 'success');
            this.cargarRegistrosDiagnosticos();
          }
        }, error => {
          console.error('Error al guardar el registro', error);
          this.mostrarAlerta('', 'Error al guardar el registro', 'error');
          this.datoInsertado = false;
        })
      } else {
        this.mostrarAlerta('', 'Faltan Datos por Ingresar', 'info');
      }
    } else {
      //console.log('rellene el motivo de la consulta')
      this.ocultarMotivoConsulta = true;
    }
  }

  // funcion para las alertas del sistema
  mostrarAlerta(titulo: string ,mensaje: any, icono: any) {
    Swal.fire({
        title: titulo,
        icon: icono,
        text: mensaje,
        confirmButtonText: 'Aceptar',
        timer: 5500, // Duración en milisegundos (3 segundos)
        background: '#fff', // Color de fondo
        color: '#333', // Color del texto
        heightAuto: false,
        width: '450px',
        position: 'top',
        customClass: {
            popup: 'custom-popup'  // Aplica una clase personalizada para más ajustes (opcional)
        }
    });
  }

  // funcion para generar la funcion y nombre del boron
  cambiarNombreBoton(): void{
    switch(this.currentStep){

      case 3:
        if(this.cajasForm.antevisua){
          this.nombreBoton = 'Guardar Ante. Visual';
        } else {
          this.nombreBoton = 'Limpiar Ante. Visual';
        }
      break;

      case 4:
        if(this.cajasForm.agudeza){
          this.nombreBoton = 'Guardar Agudeza Visual';
        } else {
          this.nombreBoton = 'Limpiar Agudeza Visual';
        }
      break;

      case 5:
        if(this.cajasForm.retino){
          this.nombreBoton = 'Guardar Retinoscopia';
        } else {
          this.nombreBoton = 'Limpiar Retinoscopia';
        } 
      break;

      case 6:
        if(this.cajasForm.alinea){
          this.nombreBoton = 'Guardar Alineamiento';
        } else {
          this.nombreBoton = 'Limpiar Alineamiento';
        } 
      break;

      case 7:
        if(this.cajasForm.version){
          this.nombreBoton = 'Guardar Versión';
        } else {
          this.nombreBoton = 'Limpiar Versión';
        } 
        
      break;

      case 9:
        if(this.cajasForm.oftalmo){
          this.nombreBoton = 'Guardar Oftalmoscopia';
        } else {
          this.nombreBoton = 'Limpiar Oftalmoscopia';
        } 
      break;

    };
  }

  guardarSwitchAnteceVisual(){
    if(!this.formularioForm.get('anteVisualForm')?.invalid){
      console.log('es verdadero');
      const anteceVisualDatos = this.formularioForm.get('anteVisualForm')?.value;
      this.superadminservice.guardarRegistroAntecedenteVisual(
        this.idHistoriaClinica,
        Boolean(anteceVisualDatos.correcion_optica === 'true'),
        anteceVisualDatos.edad_lente_primera_vez,
        anteceVisualDatos.cuantos_cambio_rx,
        anteceVisualDatos.motivo_cambio_rx,
        anteceVisualDatos.material_tratamiento_optico,
        anteceVisualDatos.indicaciones_uso,
        anteceVisualDatos.fecha_ultimo_examen,
      ).pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => { 
        if (response.status != 200 && response.status != 201) {
          // hubo error
          this.mostrarAlerta('', 'No se pudo Guardar el Registro', 'error');
        } else {
          // salio bien   
          this.mostrarAlerta('', 'Se Guardo Correctamente', 'success');
          this.cajasForm.antevisua = false;
        }
      }, error => {
        console.error('Error al guardar el registro', error);
        this.mostrarAlerta('', 'Error al guardar el registro, intentelo de nuevo', 'info');
      });
    } else {
      this.mostrarAlerta('', 'Faltan Datos por Llenar', 'info');
    }
  }

  guardarSwitchAgudezaVisual(){
    if(!this.formularioForm.get('agudezaForm')?.invalid){
      //console.log('es verdadero');
      const agudezaVisuDatos = this.formularioForm.get('agudezaForm')?.value;

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
        // varificamos si se inserto o hubo error
        if (response.status != 200 && response.status != 201) {
          // hubo error
          this.mostrarAlerta('', 'No se pudo Guardar el Registro', 'error');
        } else {   
          this.mostrarAlerta('', 'Se Guardo Correctamente', 'success');
          this.cajasForm.agudeza = false;
        }
      }, error => {
        this.mostrarAlerta('', 'Error al Guardar el Registro', 'error');
      })
    } else {
      this.mostrarAlerta('', 'Faltan Datos por Llenar', 'info');
    }
  }

  guardarSwitchRetinoscopia(){
    if(!this.formularioForm.get('retinoscopiaForm')?.invalid){
      //console.log('es verdadero');
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
        // varificamos si se inserto o hubo error
        if (response.status != 200 && response.status != 201) {
          // hubo error
          this.mostrarAlerta('', 'No se pudo Guardar el Registro', 'error');
        } else {
          this.mostrarAlerta('', 'Se Guardo Correctamente', 'success');
          this.cajasForm.retino = false;
        }
      }, error => {
        console.error('Error al guardar el registro', error);
        this.mostrarAlerta('', 'Error al Guardar el Registro', 'error');
      });
    } else {
      this.mostrarAlerta('', 'Faltan Datos por Llenar', 'info');
    }
  }

  guardarSwitchAlineamiento(){
    if(!this.formularioForm.get('alineamientoForm')?.invalid){
      const alineamientoDatos = this.formularioForm.get('alineamientoForm')?.value;
      this.superadminservice.guardarRegistroAlineamientoMotor(
        this.idHistoriaClinica,
        alineamientoDatos.hirschberg,
        alineamientoDatos.bruckner,
        alineamientoDatos.angulo_kapa,
        alineamientoDatos.covet_test_vl,
        alineamientoDatos.covet_test_vp,
        alineamientoDatos.esta_acomo_flex_od,
        alineamientoDatos.esta_acomo_flex_os,
        alineamientoDatos.esta_acomo_aa_od,
        alineamientoDatos.esta_acomo_aa_os,
      ).pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => { 
        // varificamos si se inserto o hubo error
        if (response.status != 200 && response.status != 201) {
          this.mostrarAlerta('', 'No se pudo Guardar el Registro', 'error');
        } else {
          this.mostrarAlerta('', 'Se Guardo Correctamente', 'success');
          this.cajasForm.alinea = false;
        }
      }, error => {
        console.error('Error al guardar el registro', error);
        this.mostrarAlerta('', 'Error al Guardar el Registro', 'error');
      });
    } else {
      this.mostrarAlerta('', 'Faltan Datos por Llenar', 'info');
    }
  }

  guardarSwitchVersiones(){
    if(!this.formularioForm.get('versionesForm')?.invalid){
      const versionDatos = this.formularioForm.get('versionesForm')?.value;
      this.superadminservice.guardarRegistroVersiones(
        this.idHistoriaClinica,
        versionDatos.observacion_versiones,
        versionDatos.rsd_oii,
        versionDatos.rld_rmi,
        versionDatos.rid_osi,
        versionDatos.oid_rsi,
        versionDatos.rmd_rli,
        versionDatos.osd_rii,
      ).pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => { 
        // varificamos si se inserto o hubo error
        if (response.status != 200 && response.status != 201) {
          this.mostrarAlerta('', 'No se pudo Guardar el Registro', 'error');
        } else {
          this.mostrarAlerta('', 'Se Guardo Correctamente', 'success');
          this.cajasForm.version = false;
        }
      }, error => {
        console.error('Error al guardar el registro', error);
        this.mostrarAlerta('', 'Error al Guardar el Registro', 'error');
      });
    } else {
      this.mostrarAlerta('', 'Faltan Datos por Llenar', 'info');
    }
  }

  guardarSwitchDuccion(event: Event){
    const boton = event.target as HTMLButtonElement;
    if(!this.cajasForm.duccion){
      this.formularioForm.get('duccionForm')?.reset();
      this.cajasForm.duccion = true;
      boton.textContent = 'Guardar Ducciones';
    } else {
      if(!this.formularioForm.get('duccionForm')?.invalid){
        //console.log('es verdadero');
        const duccionDatos = this.formularioForm.get('duccionForm')?.value;

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
          // varificamos si se inserto o hubo error
          if (response.status != 200 && response.status != 201) {
            this.mostrarAlerta('', 'No se pudo Guardar el Registro', 'error');
          } else {
            this.mostrarAlerta('', 'Se Guardo Correctamente', 'success');
            this.cajasForm.duccion = false;
            boton.textContent = 'Limpiar Ducciones';
          }
        }, error => {
          console.error('Error al guardar el registro', error);
          this.mostrarAlerta('', 'Error al Guardar el Registro', 'error');
        });
      } else {
        this.mostrarAlerta('', 'Faltan Datos por Llenar', 'info');
      }
    }
  }

  guardarSwitchMotalidad(event:Event){
    const boton = event.target as HTMLButtonElement;
    if(!this.cajasForm.motali){
      this.formularioForm.get('motalidadForm')?.reset();
      this.cajasForm.motali = true;
      boton.textContent = 'Guardar Motalidad';
    } else {
      if(!this.formularioForm.get('motalidadForm')?.invalid){
        //console.log('es verdadero');
        const motalidadDatos = this.formularioForm.get('motalidadForm')?.value;
  
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
          // varificamos si se inserto o hubo error
          if (response.status != 200 && response.status != 201) {
            this.mostrarAlerta('', 'No se pudo Guardar el Registro', 'error');
          } else {
            this.mostrarAlerta('', 'Se Guardo Correctamente', 'success');
            this.cajasForm.motali = false;
            boton.textContent = 'Limpiar Motalidad';
          }
        }, error => {
          console.error('Error al guardar el registro', error);
          this.mostrarAlerta('', 'Error al Guardar el Registro', 'error');
        });
      } else {
        this.mostrarAlerta('', 'Faltan Datos por Llenar', 'info');
      }
    }    
  }

  guardarSwitchExploracion(event:Event){
    const boton = event.target as HTMLButtonElement;
    if(!this.cajasForm.explo){
      this.formularioForm.get('exploracionForm')?.reset();
      this.cajasForm.explo = true;
      boton.textContent = 'Guardar Exploración';
    } else {
      if(!this.formularioForm.get('exploracionForm')?.invalid){
        //console.log('es verdadero');
        const exploracionDatos = this.formularioForm.get('exploracionForm')?.value;
        this.superadminservice.guardarRegistroExploracionExternos(
          this.idHistoriaClinica,
          exploracionDatos.explo_exter_od,
          exploracionDatos.explo_exter_os,
        ).pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => { 
          /// varificamos si se inserto o hubo error
          if (response.status != 200 && response.status != 201) {
            this.mostrarAlerta('', 'No se pudo Guardar el Registro', 'error');
          } else {
            this.mostrarAlerta('', 'Se Guardo Correctamente', 'success');
            this.cajasForm.explo = false;
            boton.textContent = 'Limpiar Exploración';
          }
        }, error => {
          console.error('Error al guardar el registro', error);
          this.mostrarAlerta('', 'Error al Guardar el Registro', 'error');
        });
      } else {
        this.mostrarAlerta('', 'Faltan Datos por Llenar', 'info');
      }
    }
  }

  guardarSwitchOftalmoscopia(){
    if(!this.formularioForm.get('oftalmoscipiaForma')?.invalid){
      const oftalmosDatos = this.formularioForm.get('oftalmoscipiaForma')?.value;
      this.superadminservice.guardarRegistroOftalmoscopia(
        this.idHistoriaClinica,
        oftalmosDatos.medi_refrin_od,
        oftalmosDatos.refle_fovea_od,
        oftalmosDatos.papila_od,
        oftalmosDatos.excav_fisio_od,
        oftalmosDatos.vasos_od,
        oftalmosDatos.rela_arte_od,
        oftalmosDatos.reti_perif_od,
        oftalmosDatos.medi_refrin_os,
        oftalmosDatos.refle_fovea_os,
        oftalmosDatos.papila_os,
        oftalmosDatos.excav_fisio_os,
        oftalmosDatos.vasos_os,
        oftalmosDatos.rela_arte_os,
        oftalmosDatos.reti_perif_os,
      ).pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => { 
        // varificamos si se inserto o hubo error
        if (response.status != 200 && response.status != 201) {
          this.mostrarAlerta('', 'No se pudo Guardar el Registro', 'error');
        } else {
          this.mostrarAlerta('', 'Se Guardo Correctamente', 'success');
          this.cajasForm.oftalmo = false;
        }
        }, error => {
          console.error('Error al guardar el registro', error);
          this.mostrarAlerta('', 'Error al Guardar el Registro', 'error');
      });
    } else {
      this.mostrarAlerta('', 'Faltan Datos por Llenar', 'info');
    }
  }

  //funcion para guardar la informacion del formulario actual
  guardarFormularioActual(): void {
    switch(this.currentStep){

      case 3:
        if(this.cajasForm.antevisua){
          this.guardarSwitchAnteceVisual();
        } else {
          this.formularioForm.get('anteVisualForm')?.reset();
          this.cajasForm.antevisua = true;
          this.nombreBoton = 'Guardar Antece. Visual';
        }
      break;

      case 4:
        if(this.cajasForm.agudeza){
          this.guardarSwitchAgudezaVisual();
        } else {
          this.formularioForm.get('agudezaForm')?.reset();
          this.cajasForm.agudeza = true;
          this.nombreBoton = 'Guardar Agudeza Visual';
        }
      break;

      case 5:
        if(this.cajasForm.retino){
          this.guardarSwitchRetinoscopia();
        } else {
          this.formularioForm.get('retinoscopiaForm')?.reset();
          setTimeout(() => {
            this.nombreBoton = 'Guardar Retinoscopia';
          }, 300);
          this.cajasForm.retino = true;
        }
      break;

      case 6:
        if(this.cajasForm.alinea){
          this.guardarSwitchAlineamiento();
        } else {
          this.formularioForm.get('alineamientoForm')?.reset();
          this.cajasForm.alinea = true;
          this.nombreBoton = 'Guardar Alineamiento';
        }
      break;

      case 7:
        if(this.cajasForm.version){
          this.guardarSwitchVersiones();
        } else {
          this.formularioForm.get('versionesForm')?.reset();
        this.cajasForm.version = true;
        this.nombreBoton = 'Guardar Versión';
        }
      break;

      case 9:
        if(this.cajasForm.oftalmo){
          this.guardarSwitchOftalmoscopia();
        } else {
          this.formularioForm.get('oftalmoscipiaForma')?.reset();
          this.cajasForm.oftalmo = true;
          this.nombreBoton = 'Guardar Oftalmoscopia';
        }
      break;

    };
    

  }
  
}
