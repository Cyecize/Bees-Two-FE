import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private preloaderSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.preloaderSubject.asObservable();

  show(): void {
    this.preloaderSubject.next(true);
  }

  hide(): void {
    this.preloaderSubject.next(false);
  }
}
