import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/service.index';
import { Medico } from '../../../../models/medicos.model';

import * as swal from 'sweetalert';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  cargando: boolean = true;
  perPage: number = 5;
  pages: number;
  currentPage: number;
  anteriores: boolean = true;
  siguientes: boolean = true;
  desde: number = 0;
  totalRegistros: number = 0;
  results: boolean = false;

  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    // La variable 'desde' controla la paginación
    this._medicoService.cargarMedicos(this.desde).subscribe((medicos: any) => {
        this.medicos = medicos;
        this.cargando = false;
        this.results = false;

        this.totalRegistros = this._medicoService.totalMedicos;
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
    this.cargarMedicos();
  }

  buscarMedico(termino: string) {

    if (termino.trim().length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;
    this._medicoService
      .buscarMedicos(termino)
      .subscribe((medicos: Medico[]) => {
        this.medicos = medicos;
        this.cargando = false;
        this.anteriores = false;
        this.siguientes = false;
        if (medicos.length > 0) {
          this.results = false;
        } else {
          this.results = true;
        }
    });

  }

  borrarMedico(medico: Medico) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el médico ' + medico.nombre,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true
    }).then(borrar => {

      if (borrar) {
        this._medicoService.borrarMedico(medico._id)
            .subscribe(borrado => {
              this.cambiarDesde(0);
            });
      }

    });
  }

}
