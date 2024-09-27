export class Position {
    constructor(public readonly x: number, public readonly y: number) {
    }
}

export class Viper {
    private _position: Position
    readonly width: number
    readonly height: number
    readonly speed: number
    shotInterval: number = 10
    private _shotArray: Shot[] = []
    constructor(x: number, y: number, public readonly image: HTMLImageElement, speed: number) {
        this._position = new Position(x, y)
        this.width = image.width
        this.height = image.height
        this.speed = speed
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
    }

    set shotArray(shotArray: Shot[]) {
        this._shotArray = shotArray
    }

    get activeShots(): Shot[] {
        return this._shotArray.filter(x => x.isActive)
    }
}

export class Shot {
    private _position: Position = new Position(0, 0)
    readonly width: number
    readonly height: number
    readonly speed: number
    isActive: boolean = false
    constructor(public readonly image: HTMLImageElement, speed: number) {
        this.width = image.width
        this.height = image.height
        this.speed = speed
    }
    set(x: number, y: number): void {
        this._position = new Position(x, y)
        this.isActive = true
    }
    get x(): number {
        return this._position.x
    }
    get y(): number {
        return this._position.y
    }
    proceed(): void {
        this._position = new Position(this.x, this.y - this.speed)
    }
}

