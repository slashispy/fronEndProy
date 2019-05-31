import { Producto } from './producto';
import { Proveedor } from './proveedor';

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
    fecha: string;
    nroFactura: string;
    proveedor: Proveedor;
    importe: number;
    descuento: number;
    tipoCompra: TipoCompra;
    detalleCompras: Item[];
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
