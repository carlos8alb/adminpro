import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  anteriores: boolean = true;
  siguientes: boolean = true;
  pages: number;
  currentPage: number;
  perPage: number = 5;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
      .subscribe(resp => {
        this.cargarUsuarios();
      });
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;

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

      this.cargando = false;
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
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService
      .buscarUsuarios(termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
        this.anteriores = false;
        this.siguientes = false;
      });
  }

  borrarUsuario(usuario: Usuario) {

    if (usuario._id === this._usuarioService.usuario._id) {
      swal(
        'No puede borrar el usuario',
        'No se puede borrar a si mismo',
        'error'
      );
      return;
    }

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true
    }).then(borrar => {

      if (borrar) {
        this._usuarioService.borrarUsuario(usuario._id)
            .subscribe(borrado => {
              this.cambiarDesde(0);
            });
      }

    });

  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario).subscribe();
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

}
