import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import io from 'socket.io-client'
@Component({
  selector: 'app-inline-ngx-table',
  templateUrl: './inline-ngx-table.component.html',
  styleUrls: ['./inline-ngx-table.component.scss']
})
export class InlineNgxTableComponent implements OnInit {
  title = 'app';
 columnDefs: any
 rowSelection = 'single'
 defaultColDef = {
   resizable: true
 }
  // columnDefs = [
  //     {headerName: 'Make', field: 'make' },
  //     {headerName: 'Model', field: 'model' },
  //     {headerName: 'Price', field: 'price'}
  // ];

  rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];
  socket: any
  gridColumnApi: any
  gridApi: any
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.socket = io('localhost:3000');
    this.socket.on('dbInsert', (msg) =>{ //this only gets called after client posts an update to a new row.
      var res = this.gridApi.updateRowData({ add: [msg] });
      this.gridApi.ensureIndexVisible(res.add[0].rowIndex)
    })
    this.socket.on('receiveTable', (msg) => {
      this.rowData = msg;
      
      let displayedColumns = Object.getOwnPropertyNames(msg[0])
      this.columnDefs = []
      displayedColumns.forEach(element => {
        this.columnDefs.push({
          headerName: element,
          field: element,
          editable: element == 'id' || element == 'createdAt' || element == 'updatedAt' ? false : true
        })
      });

    })
    this.socket.emit('getTable', this.route.snapshot.params.tableID)
  }
  autoSizeAll() {
    var allColumnIds = [];

    this.columnDefs.forEach((column) =>{
      allColumnIds.push(column.field)
    })
    this.gridColumnApi.autoSizeColumns(allColumnIds, true);
  }
  onAddRow() {
    var newItem = {};
    var res = this.gridApi.updateRowData({ add: [newItem] });
  }
  onBtRemove() {
    var selectedData = this.gridApi.getSelectedRows();
    var res = this.gridApi.updateRowData({ remove: selectedData });
    if(selectedData[0].id != undefined){
      selectedData[0].table = this.route.snapshot.params.tableID
      this.socket.emit('deleteRow', selectedData[0]);
    }
  }
  onCellChange(params){
    let msg = {
      table: this.route.snapshot.params.tableID,
      field: params.column.colId,
      value: params.newValue,
      id: params.data.id != undefined ? params.data.id : ''
    }
    if(msg.id === ''){
      var res = this.gridApi.updateRowData({ remove: [params.data] });
    }
    this.socket.emit('updateField', msg)
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

}
