import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from '../../../../models/hospitales.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  perPage: number = 10;
  pages: number;
  currentPage: number;
  anteriores: boolean = true;
  siguientes: boolean = true;
  hospitales: Hospital[] = [];
  desde: number = 0;
  cargando: boolean = true;
  totalRegistros: number = 0;
  results: boolean = false;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
    .subscribe(resp => {
      this.cargarHospitales();
    });
  }

  cargarHospitales() {
    this.cargando = true;
    // La variable 'desde' controla la paginación
    this._hospitalService.cargarHospitales(this.desde, this.perPage).subscribe((resp: any) => {
      this.hospitales = resp.hospitales;
      this.cargando = false;
      this.results = false;

      this.totalRegistros = resp.total;
      let countPages = this.totalRegistros / this.perPage;
      this.pages =
        countPages === Math.trunc(countPages)
          ? countPages
          : Math.trunc(countPages) + 1;
      this.currentPage = this.desde === 0 ? 1 : this.desde / this.perPage + 1;
      this.anteriores = true;
      this.siguientes = true;
      if (this.currentPage === 1) {
        this.anteriores = false;
      }
      if (this.currentPage === this.pages) {
        this.siguientes = false;
      }

    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    if ( (valor === 0) )  {
      this.desde = valor;
    }
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarHospitales();
  }

  obtenerHospital(id: string) {
    this._hospitalService.obtenerHospital(id).subscribe((resp: any) => {
      return console.log(resp);
    });
  }

  borrarHospital(hospital: Hospital) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el ' + hospital.nombre,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true
    }).then(borrar => {

      if (borrar) {
        this._hospitalService.borrarHospital(hospital._id)
            .subscribe(borrado => {
              this.cambiarDesde(0);
            });
      }

    });
  }

  crearHospital() {

    swal({
      title: 'Crear hospital',
      icon: 'info',
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Ingrese el nombre del hospital',
          type: 'text',
        }
      },
      buttons: ['Cancelar', 'Guardar']
    })
    .then((nombre) => {
      if (nombre !== null) {
        if (nombre !== '') {
          let hospital = new Hospital(
            nombre,
            'null',
            localStorage.getItem('item')
          );
          this._hospitalService.crearHospital(hospital).subscribe((resp) => this.cargarHospitales());
        } else {
          swal('Error', 'Debe ingresar un nombre.', 'error');
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });

  }

  buscarHospital(termino: string) {

    if (termino.trim().length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService
      .buscarHospitales(termino)
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
        this.anteriores = false;
        this.siguientes = false;
        if (hospitales.length > 0) {
          this.results = false;
        } else {
          this.results = true;
        }
      });


  }

  actualizarHospital(hospital: Hospital)  {
    this._hospitalService.actualizarHospital(hospital).subscribe();
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

}
