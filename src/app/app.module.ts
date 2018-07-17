import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { VstsComp} from './vsts-component/vsts.component';
import { HeadermenuComponentComponent } from './headermenu-component/headermenu-component.component';



@NgModule({
  declarations: [
    AppComponent,
    VstsComp,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
