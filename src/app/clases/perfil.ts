import { Permiso } from './permiso';

export class Perfil {
    id: number;
    codigo: string;
    descripcion: string;
    estado: string;
    permisos: Permiso[];
  }
