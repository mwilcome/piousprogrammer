import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly destroyRef = inject(DestroyRef);
  private readonly projectList = viewChild<ElementRef<HTMLElement>>('projectList');

  protected readonly canScrollUp = signal(false);
  protected readonly canScrollDown = signal(false);

  constructor() {
    afterNextRender(() => {
      const el = this.projectList()?.nativeElement;
      if (!el) return;

      this.updateProjectScroll();
      const observer = new ResizeObserver(() => this.updateProjectScroll());
      observer.observe(el);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  onProjectListScroll(): void {
    this.updateProjectScroll();
  }

  private updateProjectScroll(): void {
    const el = this.projectList()?.nativeElement;
    if (!el) {
      this.canScrollUp.set(false);
      this.canScrollDown.set(false);
      return;
    }

    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
    this.canScrollUp.set(el.scrollTop > 4);
    this.canScrollDown.set(remaining > 4);
  }
}
