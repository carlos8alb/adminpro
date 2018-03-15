import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

import { SettingsService,
         SidebarService,
         SharedService,
         LoginGuardGuard,
         SubirArchivoService,
         UsuarioService,
         HospitalService,
         MedicoService
} from './service.index';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadService,
    UsuarioService,
    HospitalService,
    MedicoService
  ]
})
export class ServiceModule { }
