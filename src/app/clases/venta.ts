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
export class Venta {
    id: number;
    fecha: string;
    nroFactura: string;
    timbrado: string;
    proveedor: Proveedor;
    importe: number;
    descuento: number;
    tipoCompra: TipoVenta;
    detalleCompras: Item[];
    estado: string;
}
export class Id {
    id: number;
}
export class Item {
    producto: ProductoStock;
    cantidad: number;
    precioVenta: number;
    descuento: number;
    importe: number;
}
export class TipoVenta {
    id: number;
    codigo: string;
    descripcion: string;
    uso: string;
}
export class ProductoStock {
    cantidadBaja: number;
    cantidadEntrada: number;
    controlarStock: string;
    descProducto: string;
    existencias: number;
    idProducto: number;
    importeEntrada: number;
    importeGastado: number;
    precioPromedio: number;
    precioVenta: number;
}
