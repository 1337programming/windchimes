import {Component, Inject, provide} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {LoadingIndicator} from './loading-indicator.component';
import {Windchimes} from './windchimes.component';
import {WindchimesRemote} from './windchimes-remote.component';
import {WindchimesInteractive} from './windchimes-interactive.component';
import {Control} from './control.component';
import {MarkovChimes} from './markovchimes.component';
import {Remote} from './remote.service';
import {Random} from './random.service';
import {Samples} from './samples.service';
import {Audio} from './audio.service';

@Component({
  selector: 'wind-chimes-app',
  template: `
    <div (window:resize)="onWindowResize()">
      <router-outlet [hidden]="isLoading()"></router-outlet>
      <loading-indicator *ngIf="isLoading()" [progress]="getLoadProgress()"></loading-indicator>
    </div>
  `,
  styles: [''],
  directives: [ROUTER_DIRECTIVES, LoadingIndicator],
  providers: [
    Remote,
    Random,
    Samples,
    Audio,
    provide('audioContext', {useValue: new (window['AudioContext'] || window['webkitAudioContext'])}),
    provide('size', {useValue: {width: 1280, height: 780}}),
    provide('notes', {useValue: ['C4', 'G4', 'C5', 'D5', 'E5']})
  ]
})
@RouteConfig([
  {path: '/', name: 'InteractiveChimes', component: WindchimesInteractive, useAsDefault: true},
  {path: '/remote', name: 'RemoteChimes', component: WindchimesRemote},
  {path: '/play', name: 'LocalChimes', component: Windchimes},
  {path: '/markov', name: 'MarkovChimes', component: MarkovChimes},
  {path: '/ctrl', name: 'Control', component: Control}
])
export class AppComponent {
  bufferLoaded = false;
  constructor(@Inject('size') private size, private samples:Samples) {
    this.onWindowResize();
    setTimeout(() => this.bufferLoaded = true, 4200); // 5 secs minus approx reaction time
  }
  onWindowResize() {
    this.size.width = window.innerWidth;
    this.size.height = window.innerHeight;
  }
  getLoadProgress() {
    const bfrCount = this.bufferLoaded ? 1 : 0;
    return 100 * (this.samples.loadedSampleCount + bfrCount) / (this.samples.totalSampleCount + 1);
  }
  isLoading() {
    return this.getLoadProgress() < 100;
  }
}
