import { Producto } from './producto';

export class Ajuste {
    id: number;
    fecha: string;
    estado: string;
    importe: number;
    descuento: number;
    tipoAjuste: TipoAjuste;
    detallesAjuste: DetalleAjuste;
}

export class TipoAjuste {
    id: number;
    codigo: string;
    descripcion: string;
    uso: string;
}

export class DetalleAjuste {
    id: number;
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    importe: number;
}
