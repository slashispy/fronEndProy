import { OnInit } from '@angular/core';
export class Datatables implements OnInit {
    dtOptions: DataTables.Settings = {};
    ngOnInit() {
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          language: {
            emptyTable: 'Ningún dato disponible en esta tabla',
            info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
            infoFiltered: '(filtrado de un total de _MAX_ registros)',
            infoPostFix: '',
            thousands: '.',
            lengthMenu: '',
            loadingRecords: 'Cargando...',
            processing: 'Procesando...',
            search: 'Buscar:',
            searchPlaceholder: '',
            zeroRecords: 'No se encontraron resultados',
            paginate: {
              first: 'Primero',
              last: 'Último',
              next: 'Siguiente',
              previous: 'Anterior'
            },
            aria: {
              sortAscending: ': Activar para ordenar la columna de manera ascendente',
              sortDescending: ': Activar para ordenar la columna de manera descendente'
            },
            url: ''
          }
        };
    }
}
