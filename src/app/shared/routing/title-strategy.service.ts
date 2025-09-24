// title-strategy.service.ts
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BasicTitleStrategy extends TitleStrategy {
  private static readonly WEBSITE_NAME = 'Bees II';

  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${title} - ${BasicTitleStrategy.WEBSITE_NAME}`);
    } else {
      this.title.setTitle(BasicTitleStrategy.WEBSITE_NAME);
    }
  }
}
