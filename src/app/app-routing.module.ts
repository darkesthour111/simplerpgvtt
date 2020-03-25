import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerViewComponent } from './player-view/player-view.component';
import { MainViewComponent } from './main-view/main-view.component';
import { DmViewComponent } from './dm-view/dm-view.component';
import { InlineNgxTableComponent } from './inline-ngx-table/inline-ngx-table.component';


const routes: Routes = [
// { path: '**', component: PlayerViewComponent}
{ path: '', component: MainViewComponent},
      { path: 'player/:campaignID', component: PlayerViewComponent},
      { path: 'dm/:campaignID', component: DmViewComponent},
      // { path: 'db', component: DbViewComponent}
      { path: 'db/:tableID', component: InlineNgxTableComponent}
// { path: 'homepage/:campaignID', loadChildren: () => import('./dmscreen/dmscreen.module').then(m => m.DmscreenModule) },
      // { path: 'dm/:campaignID', loadChildren: './dm/dm.module#DmModule'},
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
