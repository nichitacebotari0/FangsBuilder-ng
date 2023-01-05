import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map-planner',
  templateUrl: './map-planner.component.html',
  styleUrls: ['./map-planner.component.less']
})
export class MapPlannerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    if (!this.canvas)
      return;
    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;

    this.ctx = this.canvas?.nativeElement.getContext("2d") ?? undefined;
    if (!this.ctx)
      return;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('eraserBrush', { static: true })
  eraserBrush: ElementRef<HTMLElement> | undefined;
  private ctx: CanvasRenderingContext2D | undefined;
  width: number = 384;
  height: number = 384;
  pointerX: number = 0;
  pointerY: number = 0;
  scaleX: number = 1;
  scaleY: number = 1;
  isDrawing: boolean = false;
  isEraserToggled: boolean = false;

  pointerMove(event: PointerEvent) {
    const isPointerDown = event.pressure > 0;
    const rect = this.canvas?.nativeElement.getBoundingClientRect();
    this.scaleX = this.width / (rect?.width ?? this.width);
    this.scaleY = this.height / (rect?.height ?? this.height);
    this.pointerX = (event.x - (rect?.left ?? 0));
    this.pointerY = (event.y - (rect?.top ?? 0));

    if (this.isEraserToggled) {
      this.eraserBrush!.nativeElement.style.width = this.eraserBrush!.nativeElement.style.height = 32 / this.scaleX + 'px';
      this.eraserBrush!.nativeElement.style.left = this.pointerX + 'px';
      this.eraserBrush!.nativeElement.style.top = this.pointerY + 'px';
    }

    const normalisedX = this.pointerX * this.scaleX;
    const normalisedY = this.pointerY * this.scaleY;
    if (!isPointerDown) {
      this.ctx?.moveTo(normalisedX, normalisedY);
      return;
    }

    if (this.isEraserToggled) {
      this.ctx?.clearRect(normalisedX, normalisedY, 32, 32);
      return;
    }

    this.ctx?.lineTo(normalisedX, normalisedY);
    this.ctx?.stroke();
  }

  toggleEraser(event: Event) {
    event.preventDefault();
    this.ctx?.closePath();
    this.ctx?.beginPath();
    this.isEraserToggled = !this.isEraserToggled;
  }

  @HostListener('window:keyup', ['$event'])
  keyPressed(event: KeyboardEvent) {
    if (event.key == 'e') {
      this.toggleEraser(event);
    }
  }
}
