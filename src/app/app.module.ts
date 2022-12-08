import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SelectComponent } from './select/select.component';
import { SlideDirective } from './directives/slide/slide.directive';

@NgModule({
  declarations: [
    AppComponent,
    SelectComponent,
    SlideDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
