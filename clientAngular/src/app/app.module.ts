import { ElementRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule }	from '@angular/platform-browser/animations';

import { ChartsModule }	from 'ng2-charts';
import { AgmCoreModule }	from '@agm/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './layouts/default/default.component';
import { RoadstartLayoutComponent } from './layouts/roadstart/roadstart.component';

// For a realtime.service.ts get the amount of users connected
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

// A2 Components
import { SidebarComponent } from './a2-components/sidebar/sidebar.component';
import { LogoComponent } from './a2-components/logo/logo.component';
import { MainMenuComponent } from './a2-components/main-menu/main-menu.component';
import { CardComponent } from './a2-components/card/card.component';
import { NavbarComponent } from './a2-components/navbar/navbar.component';
import { BadgeComponent } from './a2-components/badge/badge.component';
import { NiHTimelineComponent } from './a2-components/ni-h-timeline/ni-h-timeline.component';
import { FooterComponent } from './a2-components/footer/footer.component';

// A2 Pages
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
import { PageUsersManageComponent } from './pages/users-manage/users-manage.component';
import { PageShopsManageComponent } from './pages/shops-manage/shops-manage.component';
import { PageShopsMapComponent } from './pages/shops-map/shops-map.component';

//Roadstart pages
import { PageSignInSocialComponent } from './pages/roadstart-pages/sign-in-social/sign-in-social.component';
import { PageSignUpComponent } from './pages/roadstart-pages/sign-up/sign-up.component';
import { ManageBranchesService } from './services/manage-branches.service';
import { AlertComponent } from './a2-components/alert/alert.component';
import { ListComponent } from './a2-components/list/list.component';
import { DesignchartDirective } from './directives/designchart.directive';
import {AngularFireModule} from '@angular/fire'
import { FirebaseService } from './services/firebase.service';
@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    SidebarComponent,
    LogoComponent,
    MainMenuComponent,
    PageDashboardComponent,
    CardComponent,
    NavbarComponent,
    BadgeComponent,
    NiHTimelineComponent,
    FooterComponent,
    PageUsersManageComponent,
    PageShopsManageComponent,
    PageShopsMapComponent,
    RoadstartLayoutComponent,
    PageSignInSocialComponent,
    PageSignUpComponent,
    AlertComponent,
    ListComponent,
    DesignchartDirective,
    ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChartsModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBSxKND1KrrmSMyqdOdcPyglfSU11-YDKY'
    }),
    LeafletModule,
    SocketIoModule.forRoot(config),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDRbkyIQMpVvVGRqbei5nSimRi-03x84_I",
      authDomain: "couponzysystem.firebaseapp.com",
      projectId: "couponzysystem",
      storageBucket: "couponzysystem.appspot.com",
      messagingSenderId: "704246937854",
      appId: "1:704246937854:web:5dd6ffad1b013c2456cdaf",
      measurementId: "G-78BG04KRCB"
    })
    
  ],
  providers: [ManageBranchesService,FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
