export class Canvas2DUtility {
    private _canvasElement: HTMLCanvasElement
    private _ctx: CanvasRenderingContext2D
    readonly canvasWidth: number
    readonly canvasHeight: number

    constructor(canvas: HTMLCanvasElement) {
        this._canvasElement = canvas
        const context = canvas.getContext('2d')
        if (!context) {
            throw Error("Couldn't get 2D context.")
        }
        this._ctx = context
        this.canvasWidth = canvas.width
        this.canvasHeight = canvas.height
    }

    drawRect(x: number, y: number, width: number, height: number, color?: string) {
        if (color) {
            this._ctx.fillStyle = color
        }
        this._ctx.fillRect(x,y,width,height)
    }

    drawImage(image: HTMLImageElement, x: number, y: number) {
        this._ctx.drawImage(image, x, y)
    }

    async imageLoader(path: string): Promise<HTMLImageElement> {
        const target = new Image()
        target.src = path
        return new Promise(resolve => {
            target.addEventListener("load", () => {
                return resolve(target)
            })
        })
    }

    rotatinoDraw(obj: CanvasObject, angle: number): void {
        this._ctx.save()

        this._ctx.translate(obj.x, obj.y)
        const radian = angle * (Math.PI / 180)
        this._ctx.rotate(radian)

        const offsetX = obj.width / 2
        const offsetY = obj.height / 2

        this._ctx.drawImage(obj.objectImage, -offsetX, -offsetY)

        this._ctx.restore()
    }

    setGlobalAlpha(alpha: number) {
        this._ctx.globalAlpha = alpha
    }

    hasInCanvasRange(x: number, y: number): boolean {
        return 0 <= y && y <= this.canvasHeight &&
                0 <= x && x <= this.canvasWidth
    }
}

export interface CanvasObject {
    width: number
    height: number
    x: number
    y: number
    objectImage: HTMLImageElement
}
