import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../../../models/medicos.model';

@Injectable()
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos(desde: number = 0) {
    let url = URL_SERVICIOS + '/medico?desde=' + desde;
    return this.http.get(url)
      .map((resp: any) => {
        this.totalMedicos = resp.total;
        return resp.medicos;
      });
  }

  buscarMedicos(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
        .map((resp: any) => resp.medicos);
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
        .map((resp) => {
          swal('Medico borrado', 'El medico ha sido eliminado correctamente', 'success');
          return true;
        });
  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if (medico._id) {
      // Actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, medico).map((resp: any) => {
        swal('Médico actualizado', medico.nombre, 'success');
        return resp.medico;
      });
    } else {
      // Creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, medico).map((resp: any) => {
        swal('Médico creado', medico.nombre, 'success');
        return resp.medico;
      });

    }

  }

  cargarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url).map((resp: any) => resp.medico);
  }

}
