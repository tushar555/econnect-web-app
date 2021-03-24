import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const isConsoleEnable = environment.production;

environment.production = false;
if (environment.production) {
  enableProdMode();

} else {
  console.dir('developer mode');
}

if (!isConsoleEnable) {
  console.dir('console  is enable');
} else {
  if (window) {
    console.dir('console  is disabled');
    window.console.log = function () { };
    window.console.dir = function () { };
    window.console.debug = function () { };
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
