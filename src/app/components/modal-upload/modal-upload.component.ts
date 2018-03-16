import { Component, OnInit } from '@angular/core';
import { SubirArchivoService, UsuarioService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;
  upload = null;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService,
    public _usuarioService: UsuarioService
  ) {

   }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalUploadService.ocultarModal();
    (<HTMLInputElement>document.getElementById('upload')).value = '';
  }


  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      this.imagenSubir = null;
      swal('Solo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      return;
    }
    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
      this.imagenTemp = reader.result;
    };
  }

  subirImagen() {
    this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
      .then((resp: any) => {
        let id = localStorage.getItem('id');
        let tipo = this._modalUploadService.tipo;
        if (tipo === 'usuarios') {
          if (id === resp.usuarioActualizado._id) {
            this._usuarioService.usuario.img = resp.usuarioActualizado.img;
            let usuario = resp.usuarioActualizado;
            let token = localStorage.getItem('token');
            this._usuarioService.guardarStorage(usuario._id, token, usuario, this._usuarioService.menu);
          }
        }
        this._modalUploadService.notificacion.emit(resp);
        this.cerrarModal();
      })
      .catch((err) => {
        console.log('Error en la carga: ', err);
      });
  }

}
