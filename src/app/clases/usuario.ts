import { Perfil } from './perfil';

export class Usuario {
    id: number;
    apellido: string;
    clave: string;
    email: string;
    nombre: string;
    usuario: string;
    estado: string;
    perfiles: Perfil[];
}
