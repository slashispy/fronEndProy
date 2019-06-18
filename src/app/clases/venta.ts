import { Producto } from './producto';
import { Cliente } from './cliente';

export class Venta {
    id: number;
    fecha: string;
    nroFactura: string;
    cliente: Cliente;
    mediosPago: VentaDetalleMedioPago[];
    importe: number;
    descuento: number;
    tipoVenta: TipoVenta;
    estado: string;
    timbrado: string;
    ruc: string;
    detalleVenta: DetalleVenta[];
}

export class VentaDetalleMedioPago {
    id: number;
    monto: number;
    medioPago: MedioPago;
    vuelto: number;
}

export class MedioPago {
    id: number;
    codigo: string;
    descripcion: string;
}

export class TipoVenta {
    id: number;
    codigo: string;
    descripcion: string;
    uso: string;
}

export class DetalleVenta {
    id: number;
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    importe: number;
}
