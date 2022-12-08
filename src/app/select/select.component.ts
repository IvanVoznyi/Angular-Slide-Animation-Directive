import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  filter,
  fromEvent,
  merge,
  skip,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

export interface Item {
  text: number;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, OnDestroy {
  protected showMenu = new EventEmitter<boolean>(false);
  private subscription: Subscription | undefined;
  protected isShowMenu = false;

  @Input()
  items: Array<Item> | undefined;

  @ViewChild('select', { static: true })
  selectRef: ElementRef<HTMLElement> | undefined;

  @Output()
  selectItem = new EventEmitter<Item>();

  @Input()
  selectedItem: Item | undefined;
  
  constructor() {}

  onSelectItem(item: Item) {
    this.selectItem.emit(item);
    this.showToggle();
  }

  showToggle() {
    this.isShowMenu = !this.isShowMenu;
    this.showMenu.emit(this.isShowMenu);
  }

  ngOnInit(): void {
    if (this.selectRef) {
      this.subscription = fromEvent(this.selectRef.nativeElement, 'click')
        .pipe(
          tap(() => {
            this.showToggle();
          }),
          filter(() => this.isShowMenu),
          switchMap(() =>
            merge(
              fromEvent(document, 'click'),
              fromEvent(document, 'scroll')
            ).pipe(skip(1), takeUntil(this.showMenu))
          )
        )
        .subscribe((event) => {
          if (
            !(event.target as HTMLElement).contains(document) ||
            event.type == 'scroll'
          ) {
            this.showToggle();
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
