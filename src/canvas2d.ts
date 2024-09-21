export class Canvas2DUtility {
    private canvasElement: HTMLCanvasElement
    private context2D: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        this.canvasElement = canvas
        const context = canvas.getContext('2d')
        if (!context) {
            throw Error("Couldn't get 2D context.")
        }
        this.context2D = context
    }
    
    get canvas(): HTMLCanvasElement {
        return this.canvasElement
    }
    get context(): CanvasRenderingContext2D {
        return this.context2D
    }

    drawRect(x: number, y: number, width: number, height: number, color?: string) {
        if (color) {
            this.context2D.fillStyle = color
        }
        this.context2D.fillRect(x,y,width,height)
    }
    
    imageLoader(path: string, callback: (target: HTMLImageElement) => void) {
        const target = new Image()
        target.src = path
        target.addEventListener("load", () => {
            callback(target)
        })
    }
}