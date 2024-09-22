export class Position {
    constructor(public readonly x: number, public readonly y: number) {
    }
}

export class Viper {
    private _position: Position
    public readonly width: number
    public readonly height: number
    public readonly speed: number
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
}

