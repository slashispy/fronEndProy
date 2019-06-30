import { Usuario } from './usuario';

export class Caja {
    id: number;
    fechaApertura: string;
    fechaCierre: string;
    estadoCaja: string;
    montoApertura: number;
    montoCierre: number;
    uso: string;
    usuario: Usuario;
}
