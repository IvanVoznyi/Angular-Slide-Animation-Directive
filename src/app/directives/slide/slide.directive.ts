import {
  animate,
  AnimationBuilder,
  AnimationMetadata,
  AnimationPlayer,
  style,
} from '@angular/animations';
import {
  Directive,
  Input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[slide]',
})
export class SlideDirective {
  element: HTMLElement | undefined;
  isShowTop = false;

  @Input()
  set slide(isShow: boolean) {
    if (isShow) {
      const embeddedViewRef = this.viewContainerRef.createEmbeddedView(
        this.templateRef
      );
      embeddedViewRef.detectChanges();
      const nativeElement = embeddedViewRef.rootNodes[0];
      this.element = nativeElement;

      const { bottom } = nativeElement.getBoundingClientRect();

      if (bottom > window.innerHeight) {
        this.isShowTop = true;
        this.renderer.addClass(nativeElement, 'showTop');
      }

      this.playAnimation(nativeElement, isShow, 'enter');
    } else {
      if (this.element) {
        this.playAnimation(this.element, isShow, 'leave');
      }
    }
  }

  playAnimation(
    element: HTMLElement,
    isShow: boolean,
    animationType: 'enter' | 'leave'
  ) {
    const player = this.makeAnimation(element, isShow);
    player.play();
    player.onDone(() => {
      if (animationType === 'leave') {
        this.viewContainerRef.clear();
        this.element = undefined;
        this.isShowTop = false;
      }
      player.destroy();
    });
  }

  makeAnimation(element: HTMLElement, isShow: boolean): AnimationPlayer {
    let animationMetaData: AnimationMetadata[] | undefined;
    let transitionEnter = '-10%';
    let transitionLeave = '-10%';

    if (this.isShowTop) {
      transitionEnter = '10%';
      transitionLeave = '10%';
    }

    if (isShow) {
      animationMetaData = [
        style({
          transform: `translateY(${transitionEnter})`,
          opacity: 0,
        }),
        animate(500),
      ];
    } else {
      animationMetaData = [
        animate(
          500,
          style({
            opacity: 0,
            transform: `translateY(${transitionLeave})`,
          })
        ),
      ];
    }
    return this.animationBuilder.build(animationMetaData).create(element);
  }

  constructor(
    private templateRef: TemplateRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
    private animationBuilder: AnimationBuilder,
    private renderer: Renderer2
  ) {}
}
