import { CanvasObject } from "./canvas2d"

export class Position {
    constructor(readonly x: number, readonly y: number) {
    }
}

class Vector {
    static readonly angleOffset = 270
    constructor(readonly x: number, readonly y: number) {}
    static fromAngle(angle: number): Vector {
        const radian = (angle + this.angleOffset) * (Math.PI / 180)
        const x = Math.cos(radian)
        const y = Math.sin(radian)
        return new Vector(x, y)
    }
}

export class Viper implements CanvasObject {
    private _position: Position
    readonly width: number
    readonly height: number
    readonly speed: number

    readonly objectImage: HTMLImageElement
    readonly doubleShotImage: HTMLImageElement
    readonly singleShotImage: HTMLImageElement

    shotInterval: number = 10
    private _shotArray: Shot[] = []
    private _singleShotArray: Shot[] = []

    constructor(x: number, y: number, speed: number, image: HTMLImageElement, singleShotImage: HTMLImageElement, doubleShotImage: HTMLImageElement) {
        this._position = new Position(x, y)
        this.width = image.width
        this.height = image.height
        this.speed = speed

        this.objectImage = image
        this.doubleShotImage = doubleShotImage
        this.singleShotImage = singleShotImage
    }

    moveBy(deltaX: number, deltaY: number): void {
        this._position = new Position(this._position.x + deltaX, this._position.y + deltaY)
    }

    set x(x: number) {
        this._position = new Position(x, this._position.y)
    }

    set y(y: number) {
        this._position = new Position(this._position.x, y)
    }

    get x(): number {
        return this._position.x
    }

    get y(): number {
        return this._position.y
    }

    fire(): void {
        for (const shot of this._shotArray) {
            if (!shot.isActive) {
                shot.set(this.x, this.y)
                break
            }
        }

        for (let i=0; i<this._singleShotArray.length; i += 2) {
            const shot1 = this._singleShotArray[i]
            const shot2 = this._singleShotArray[i+1]
            if (!shot1.isActive) {
                shot1.set(this.x, this.y)
                shot2.set(this.x, this.y)
                break
            }
        }
    }

    setDoubleShots(numShots: number): void {
        this._shotArray = Array.from({length: numShots}).map(() => new Shot(this.doubleShotImage, 3)) 
    }

    setSingleShots(numShots: number): void {
        this._singleShotArray = Array.from({length: numShots}).reduce<Shot[]>(
            (acc) => [
                ...acc,
                new Shot(this.singleShotImage, 3, -10),
                new Shot(this.singleShotImage, 3, 10)
            ], []
        )
    }

    get activeShots(): Shot[] {
        const doubleShots =  this._shotArray.filter(x => x.isActive)
        const singleShots = this._singleShotArray.filter(x => x.isActive)
        return doubleShots.concat(singleShots)
    }
}

export class Shot implements CanvasObject {
    private _position = new Position(0, 0)
    private _vector = new Vector(0, -1)
    readonly width: number
    readonly height: number
    readonly speed: number
    readonly angle: number
    readonly objectImage: HTMLImageElement;
    private _isActive: boolean = false
    constructor(
        image: HTMLImageElement,
        speed: number,
        angle: number = 0
    ) {
        this.width = image.width
        this.height = image.height
        this.speed = speed
        this._vector = Vector.fromAngle(angle)
        this.objectImage = image
        this.angle = angle
    }
    set(x: number, y: number): void {
        this._position = new Position(x, y)
        this._isActive = true
    }
    get x(): number {
        return this._position.x
    }
    get y(): number {
        return this._position.y
    }
    get isActive(): boolean {
        return this._isActive
    }
    proceed(): void {
        const deltaX = this._vector.x * this.speed
        const deltaY = this._vector.y * this.speed
        this._position = new Position(this.x + deltaX, this.y + deltaY)
    }

    inactivate(): void {
        this._isActive = false
    }
}

export class Enemy implements CanvasObject {
    private _position: Position
    readonly width: number
    readonly height: number
    readonly speed: number
    life = 10

    readonly objectImage: HTMLImageElement

    constructor(x: number, y: number, speed: number, objectImage: HTMLImageElement) {
        this._position = new Position(x, y)
        this.width = objectImage.width
        this.height = objectImage.height
        this.speed = speed

        this.objectImage = objectImage
    }
    
    get x(): number {
        return this._position.x
    }
    
    get y(): number {
        return this._position.y
    }
    
    proceed(): void {
        this._position = new Position(this.x, this.y + this.speed)        
    }
    
    destroy(): void {
        this.life = 0
    }
}