export class Compra {
    id: number;
    codigo: string;
    descripcion: string;
    cantidad: number;
    estado: string;
    controlarStock: string;
    precioUnitario: number;
    cantidadMinima: number;
}
export class CompraItem {
    OrderItemID: number;
    OrderID: number;
    ItemID: number;
    Quantity: number;
    ItemName: string;
    Price: number;
    Total: number;
    controls: any;
}
export class Id {
    id: number;
}
export class Item {
    producto: Id;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    importe: number;
}
