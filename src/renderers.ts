import { Position, Shot, Viper } from "./characters";
import { UserInputController } from "./main";


export class ViperRenderer {
    private _initPosition: Position;
    private _shotCounter: number = 0;
    constructor(
        private readonly _viper: Viper,
        private readonly _ctx: CanvasRenderingContext2D,
        private readonly _scene: Scene,
        private readonly _endPosition: Position,
        private readonly _controller: UserInputController
    ) {
        this._initPosition = new Position(_viper.x, _viper.y);
    }

    update() {
        const canvasWidth = this._ctx.canvas.width
        const canvasHeight = this._ctx.canvas.height

        if (this._scene.type === "coming") {
            const currentTime = Date.now();
            const deltaT = currentTime - this._scene.startTime;
            this._viper.y = this._initPosition.y - 20 * (deltaT / 100);

            this._ctx.globalAlpha = deltaT%10 < 5 ? 0.5 : 1

            if (this._viper.y <= this._endPosition.y) {
                this._scene.type = "playing";
                this._viper.y = this._endPosition.y;
                this._ctx.globalAlpha = 1

            }
        }
        else {
            if (this._controller.right) {
                this._viper.moveBy(this._viper.speed, 0)
            }
            if (this._controller.left){
                this._viper.moveBy(-this._viper.speed, 0)
            }
            if (this._controller.up){
                this._viper.moveBy(0, -this._viper.speed)
            }
            if (this._controller.down) {
                this._viper.moveBy(0, this._viper.speed)
            }
            this._viper.x = Math.min(canvasWidth, Math.max(0, this._viper.x))
            this._viper.y = Math.min(canvasHeight, Math.max(0, this._viper.y))

            if (this._controller.zKey) {
                if (this._viper.shotInterval < this._shotCounter) {
                    this._viper.fire()
                    this._shotCounter = 0
                }
            }
            for (const shot of this._viper.activeShots) {
                shot.proceed()
            }

        }
        const offsetX = this._viper.width / 2
        const offsetY = this._viper.height / 2
        this._ctx.drawImage(this._viper.image, this._viper.x - offsetX, this._viper.y - offsetY);

        this._viper.activeShots.forEach(shot => {
            const offsetX = shot.width / 2
            const offsetY = shot.height / 2
            if (shot.y - offsetY < 0) {
                shot.isActive = false
            }
            else {
                this._ctx.drawImage(shot.image, shot.x - offsetX, shot.y - offsetY)
            }
        })
        
        this._shotCounter ++;
    }
}


type SceneType = "coming" | "playing"

export class Scene {
    type: SceneType
    startTime: number
    constructor(type: SceneType, startTime: number) {
        this.type = type
        this.startTime = startTime
    }
    acceptingUserInput(): boolean {
        return this.type === "playing"
    }
}

