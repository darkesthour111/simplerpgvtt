import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerViewComponent } from './player-view/player-view.component';
import { MainViewComponent } from './main-view/main-view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DmViewComponent } from './dm-view/dm-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { FabButtonsComponent } from './fab-buttons/fab-buttons.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TokenDialogComponent } from './token-dialog/token-dialog.component'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { SoundDialogComponent } from './sound-dialog/sound-dialog.component';
import { MapDialogComponent } from './map-dialog/map-dialog.component';
import { MatTableModule } from '@angular/material/table'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { InlineNgxTableComponent } from './inline-ngx-table/inline-ngx-table.component'

import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  declarations: [
    AppComponent,
    PlayerViewComponent,
    MainViewComponent,
    DmViewComponent,
    FabButtonsComponent,
    TokenDialogComponent,
    SoundDialogComponent,
    MapDialogComponent,
    InlineNgxTableComponent,
    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    RouterModule,
    DragDropModule,
    MatDialogModule,
    MatTooltipModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    AgGridModule.withComponents([])
    

  ],

  entryComponents: [
    TokenDialogComponent,
    SoundDialogComponent,
    MapDialogComponent
  ],
providers: [
  {
    provide: MatDialogRef,
    useValue: {}
  },
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
