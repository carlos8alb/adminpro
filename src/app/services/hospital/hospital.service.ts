import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../../../../models/hospitales.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class HospitalService {

  hospital: Hospital;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {}

  cargarHospitales(desde: number = 0, hasta: number = 0) {
    let url = URL_SERVICIOS + '/hospital?desde=' + desde + '&hasta=' + hasta;
    return this.http.get(url);
  }

  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url);
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
        .map((resp) => {
          swal('Hospital borrado', 'El hospital ha sido eliminado correctamente', 'success');
          return true;
        });
  }

  crearHospital( hospital: Hospital )  {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, hospital)
      .map((resp: any) => {
        swal('Hospital creado', 'El hospital ha sido creado correctamente', 'success');
        return resp.hospital;
      });
  }

  buscarHospitales(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
        .map((resp: any) => resp.hospitales);
  }

  actualizarHospital(hospital: Hospital)  {
    const url = URL_SERVICIOS + '/hospital/' + hospital._id + '?token=' + this._usuarioService.token;
    return this.http.put(url, hospital)
      .map((resp: any) => {
        swal('Hospital actualizazdo', hospital.nombre, 'success');
        return true;
      });
  }

}
