import { Producto } from './producto';
import { Proveedor } from './proveedor';
import { Caja } from './caja';

export class Prod {
    id: number;
    codigo: string;
    descripcion: string;
    cantidad: number;
    estado: string;
    controlarStock: string;
    precioUnitario: number;
    cantidadMinima: number;
}
export class Compra {
    id: number;
    fecha: string;
    nroFactura: string;
    timbrado: string;
    proveedor: Proveedor;
    importe: number;
    descuento: number;
    tipoCompra: TipoCompra;
    caja: Caja;
    detalleCompras: Item[];
    estado: string;
}
export class Id {
    id: number;
}
export class Item {
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    importe: number;
}
export class TipoCompra {
    id: number;
    codigo: string;
    descripcion: string;
    uso: string;
}
