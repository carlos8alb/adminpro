import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../../../models/usuarios.model';
import { Hospital } from '../../../../models/hospitales.model';
import { Medico } from '../../../../models/medicos.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  hospitales: Hospital[] = [];
  medicos: Medico[] = [];
  cargando: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    activatedRoute.params.subscribe(params => {
      let termino = params['termino'];
      this.buscar(termino);
    });
  }

  ngOnInit() {
  }

  buscar(termino: string) {

    if (termino.trim().length <= 0) {
      this.cargando = false;
      return;
    }

    this.cargando = true;
    let url = URL_SERVICIOS + '/busqueda/todo/' + termino;
    this.http.get(url).subscribe((resp: any) => {
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospitales;
      this.cargando = false;
    });
  }

}
