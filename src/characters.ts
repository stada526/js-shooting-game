import { CanvasObject } from "./canvas2d";
import { ObjectImageKey, objectImageProvider } from "./object-image-provider";
import { Shot } from "./shot";

export class Position {
  constructor(readonly x: number, readonly y: number) {}
}

export class Vector {
  static readonly angleOffset = 270;
  constructor(readonly x: number, readonly y: number) {}
  static fromAngle(angle: number): Vector {
    const radian = (angle + this.angleOffset) * (Math.PI / 180);
    const x = Math.cos(radian);
    const y = Math.sin(radian);
    return new Vector(x, y);
  }
}

export interface Shooter {
  activeShots: Shot[];
  shotInterval: number;
  fire(): void;
}

export class Viper implements CanvasObject, Shooter {
  private _position: Position;
  readonly width: number;
  readonly height: number;
  readonly speed: number;

  readonly objectImage: HTMLImageElement;

  shotInterval: number = 10;
  private _shotArray: Shot[] = [];
  private _singleShotArray: Shot[] = [];

  constructor(x: number, y: number, speed: number) {
    this._position = new Position(x, y);
    this.speed = speed;

    this.objectImage = objectImageProvider.get(ObjectImageKey.Viper);
    this.width = this.objectImage.width;
    this.height = this.objectImage.height;
  }

  moveBy(deltaX: number, deltaY: number): void {
    this._position = new Position(
      this._position.x + deltaX,
      this._position.y + deltaY
    );
  }

  set x(x: number) {
    this._position = new Position(x, this._position.y);
  }

  set y(y: number) {
    this._position = new Position(this._position.x, y);
  }

  get x(): number {
    return this._position.x;
  }

  get y(): number {
    return this._position.y;
  }

  fire(): void {
    for (const shot of this._shotArray) {
      if (!shot.isActive) {
        shot.set(this.x, this.y);
        break;
      }
    }

    for (let i = 0; i < this._singleShotArray.length; i += 2) {
      const shot1 = this._singleShotArray[i];
      const shot2 = this._singleShotArray[i + 1];
      if (!shot1.isActive) {
        shot1.set(this.x, this.y);
        shot2.set(this.x, this.y);
        break;
      }
    }
  }

  setDoubleShots(numShots: number): void {
    this._shotArray = Array.from({ length: numShots }).map(
      () => new Shot("ViperDoubleShot", 3)
    );
  }

  setSingleShots(numShots: number): void {
    this._singleShotArray = Array.from({ length: numShots }).reduce<Shot[]>(
      (acc) => [
        ...acc,
        new Shot("ViperSingleShot", 3, -10),
        new Shot("ViperSingleShot", 3, 10),
      ],
      []
    );
  }

  get activeShots(): Shot[] {
    const doubleShots = this._shotArray.filter((x) => x.isActive);
    const singleShots = this._singleShotArray.filter((x) => x.isActive);
    return doubleShots.concat(singleShots);
  }
}

export class Enemy implements CanvasObject, Shooter {
  private _position: Position;
  readonly width: number;
  readonly height: number;
  readonly speed: number;
  life = 10;

  shotInterval = 80;

  private _shotArray: Shot[] = [];

  readonly objectImage: HTMLImageElement;

  constructor(x: number, y: number, speed: number) {
    this._position = new Position(x, y);
    this.speed = speed;

    this.objectImage = objectImageProvider.get(ObjectImageKey.SmallEnemy);
    this.width = this.objectImage.width;
    this.height = this.objectImage.height;
  }

  get x(): number {
    return this._position.x;
  }

  get y(): number {
    return this._position.y;
  }

  proceed(): void {
    this._position = new Position(this.x, this.y + this.speed);
  }

  destroy(): void {
    this.life = 0;
  }

  get activeShots(): Shot[] {
    return this._shotArray.filter((x) => x.isActive);
  }

  fire(): void {
    for (const shot of this._shotArray) {
      if (!shot.isActive) {
        shot.set(this.x, this.y);
        break;
      }
    }
  }

  setShots(numShots: number): void {
    this._shotArray = Array.from({ length: numShots }).map(
      () => new Shot("SmallEnemyShot", 5, 180)
    );
  }
}
