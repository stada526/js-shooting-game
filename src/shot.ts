import { CanvasObject } from "./canvas2d";
import { Position, Vector } from "./characters";
import { ObjectImageKey, objectImageProvider } from "./object-image-provider";

type ShotType = "ViperSingleShot" | "ViperDoubleShot" | "SmallEnemyShot";

export class Shot implements CanvasObject {
  private _position = new Position(0, 0);
  private _vector = new Vector(0, -1);
  readonly width: number;
  readonly height: number;
  readonly speed: number;
  readonly angle: number;
  readonly objectImage: HTMLImageElement;
  private _isActive: boolean = false;
  constructor(type: ShotType, speed: number, angle: number = 0) {
    this.speed = speed;
    this._vector = Vector.fromAngle(angle);
    if (type === "ViperSingleShot") {
      this.objectImage = objectImageProvider.get(
        ObjectImageKey.ViperSingleShot
      );
    } else if (type === "ViperDoubleShot") {
      this.objectImage = objectImageProvider.get(
        ObjectImageKey.ViperDoubleShot
      );
    } else if (type === "SmallEnemyShot") {
      this.objectImage = objectImageProvider.get(ObjectImageKey.EnemyShot);
    } else {
      throw new Error(`Unknown shot type: ${type}`);
    }
    this.width = this.objectImage.width;
    this.height = this.objectImage.height;
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
