import {Component, Inject, Input, OnDestroy} from 'angular2/core';
import {Observable, Subscription} from 'rxjs';
import {ForAnyOrder} from './forAnyOrder.directive';
import {AudioUnlock} from './audio-unlock.component';
import {Chime} from './chime.component';
import {InnerChime} from './inner-chime.component';
import {ThankYou} from './thank-you.component';
import {Random} from './random.service';

@Component({
  selector: 'windchimes-remote',
  template: `
    <div [style.display]="areChimesVisible() ? 'block': 'none'"
         *forAnyOrder="#chime of chimes">
      <chime [chime]="chime" [remote]=true>
      </chime>
      <inner-chime [chime]="chime" [remote]=true>
      </inner-chime>
    </div>
    <audio-unlock *ngIf="!unlocked" (unlock)="onUnlocked()">
    </audio-unlock>
    <thank-you *ngIf="unlocked && isDone()">
    </thank-you>
  `,
  styles: [require('./windchimes.component.css').toString()],
  directives: [Chime, AudioUnlock, InnerChime, ThankYou, ForAnyOrder]
})
export class WindchimesRemote implements OnDestroy {
  chimes:{x: number, y: number, note:string, state: string}[];
  unlocked:boolean;
  sub:Subscription;

  constructor(random:Random, @Inject('size') size) {
    this.sub = random.remote()
      .map((chime) => ({
        x: size.width / 2,
        y: size.height / 2,
        note: chime.note,
        state: chime.state
      }))
      .windowTime(5000, 100)
      .flatMap(window => window.toArray())
      .subscribe(c => this.chimes = c);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onUnlocked() {
    this.unlocked = true;
  }

  isDone() {
    return this.chimes && this.chimes.length && this.chimes[this.chimes.length - 1].state === 'done';
  }

  areChimesVisible() {
    return this.unlocked && !this.isDone();
  }

}
