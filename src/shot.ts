import { CanvasObject } from "./canvas2d";
import { Position, Vector } from "./characters";

export class Shot implements CanvasObject {
  private _position = new Position(0, 0);
  private _vector = new Vector(0, -1);
  readonly width: number;
  readonly height: number;
  readonly speed: number;
  readonly angle: number;
  readonly objectImage: HTMLImageElement;
  private _isActive: boolean = false;
  constructor(image: HTMLImageElement, speed: number, angle: number = 0) {
    this.width = image.width;
    this.height = image.height;
    this.speed = speed;
    this._vector = Vector.fromAngle(angle);
    this.objectImage = image;
    this.angle = angle;
  }
  set(x: number, y: number): void {
    this._position = new Position(x, y);
    this._isActive = true;
  }
  get x(): number {
    return this._position.x;
  }
  get y(): number {
    return this._position.y;
  }
  get isActive(): boolean {
    return this._isActive;
  }
  proceed(): void {
    const deltaX = this._vector.x * this.speed;
    const deltaY = this._vector.y * this.speed;
    this._position = new Position(this.x + deltaX, this.y + deltaY);
  }

  inactivate(): void {
    this._isActive = false;
  }
}
