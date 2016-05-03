import {Component, Inject, Input, OnInit, OnDestroy} from 'angular2/core';
import {animate, style, group} from 'angular2/animate';
import {Samples} from './samples.service';
import {Audio} from './audio.service';

@Component({
  selector: 'chime',
  template: `
    <div class="ring {{chime.note}}"
         [class.expanding]="started"
         [style.left.px]="chime.x - 300"
         [style.top.px]="chime.y - 300">
    </div>
    <div class="flash"
         [class.flashing]="started"
         [style.left.px]="chime.x - 300"
         [style.top.px]="chime.y - 300">
    </div>
  `,
  styles: [require('./chime.component.css').toString()],
  animations: [
    animation('expand', [
      transition('void => ANY', [
        style({opacity: 1, transform: 'scale3d(.01,.01,.01) translateZ(0)'}),
        group([
          animate('5s',
            style({opacity: 0})),
          animate('5s cubic-bezier(0,.79,.13,.71)',
            style({transform: 'scale3d(1,1,1) translateZ(0)'}))
        ])
      ])
    ]),
    animation('flash', [
      transition('void => ANY', [
        style({opacity: 1, transform: 'scale3d(.1,.1,.1) translateZ(0)'}),
        animate('0.05s ease-in',
          style({opacity: 1, transform: 'scale3d(1,1,1) translateZ(0)'})
        ),
        animate('1s ease-out',
          style({opacity: 0, transform: 'scale3d(0,0,0) translateZ(0)'})
        )
      ])
    ])
  ]
})
export class Chime implements OnInit, OnDestroy {
  @Input() chime:{x: number, y: number, note: string, state: string, muted: boolean};
  stopAudio:Function;
  started:boolean;

  constructor(private samples:Samples,
              private audio:Audio) {
  }

  ngOnInit() {
    if (this.chime.state === 'chiming') {
      if (this.chime.muted) {
        setTimeout(() => this.started = true, 0);
      } else {
        this.samples.getSample(this.chime.note).then(sample => {
          this.stopAudio = this.audio.play(sample, (this.chime.x / 1280) * 2 - 1);
          this.started = true;
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.stopAudio) {
      this.stopAudio();
    }
  }

}
