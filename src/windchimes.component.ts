import {Component, Inject} from 'angular2/core';
import {Observable, Subscription} from 'rxjs';
import {ForAnyOrder} from './forAnyOrder.directive';
import {Chime} from './chime.component';
import {InnerChime} from './inner-chime.component';
import {Random} from './random.service';

@Component({
  selector: 'windchimes',
  template: `
    <div *forAnyOrder="#chime of chimes | async">
      <chime [chime]="chime">
      </chime>
      <inner-chime [chime]="chime">
      </inner-chime>
    </div>
  `,
  styles: [require('./windchimes.component.css').toString()],
  directives: [Chime, InnerChime, ForAnyOrder]
})
export class Windchimes {
  chimes:Observable<{x: number, y: number}[]>;

  constructor(random:Random,
              @Inject('notes') notes) {
    const noteSampler = random.sampler(notes);
    this.chimes = random.perlinNoise(5000)
      .map(() => ({
        x: random.nextInt(0, 1280),
        y: random.nextInt(0, 680),
        note: noteSampler(),
        state: 'chiming'
      }))
      .windowTime(5000, 100)
      .flatMap(window => window.toArray());
  }

}
