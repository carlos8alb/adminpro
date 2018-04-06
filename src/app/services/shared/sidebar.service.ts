import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class SidebarService {

  menu: any = [];

  constructor(
    public _usuarioService: UsuarioService
  ) {}

  cargarMenu() {
    this.menu = this._usuarioService.menu;
    if (typeof this.menu === 'string') {
      this.menu = JSON.parse(this.menu);
    }
  }

}
