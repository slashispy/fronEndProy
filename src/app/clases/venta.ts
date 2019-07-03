import { Producto } from './producto';
import { Cliente } from './cliente';
import { Caja } from './caja';

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
    caja: Caja;
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

export class UltimaFactura {
    id: number;
    usuario: string;
    nroFactura: string;
}
