import { Canvas2DUtility } from "./canvas2d";
import { Position, Shot, Viper } from "./characters";
import { UserInputController } from "./main";


export class ViperRenderer {
    private _shotCounter: number = 0;
    constructor(
        private readonly _viper: Viper,
        private readonly _canvasUtil: Canvas2DUtility,
        private readonly _controller: UserInputController
    ) {}

    update() {
        /** Update the viper's position */
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
        const canvasWidth = this._canvasUtil.canvasWidth
        const canvasHeight = this._canvasUtil.canvasHeight
        this._viper.x = Math.min(canvasWidth, Math.max(0, this._viper.x))
        this._viper.y = Math.min(canvasHeight, Math.max(0, this._viper.y))

        /** Update shots' positions */
        if (this._controller.zKey) {
            if (this._viper.shotInterval < this._shotCounter) {
                this._viper.fire()
                this._shotCounter = 0
            }
        }

        /** Render the viper */
        const offsetX = this._viper.width / 2
        const offsetY = this._viper.height / 2
        this._canvasUtil.drawImage(this._viper.objectImage, this._viper.x - offsetX, this._viper.y - offsetY);

        this._shotCounter ++;
    }
}

export class ShotRenderer {
    constructor(
        private readonly _viper: Viper,
        private readonly _canvasUtil: Canvas2DUtility,
    ) {}

    update() {
        for (const shot of this._viper.activeShots) {
            shot.proceed()
        }

        this._viper.activeShots.forEach(shot => {
            const offsetX = shot.width / 2
            const offsetY = shot.height / 2

            const nextX = shot.x - offsetX
            const nextY = shot.y - offsetY
            if (
                !this._canvasUtil.hasInCanvasRange(nextX, nextY)
            ) {
                shot.inactivate()
            }
            else {
                this._canvasUtil.rotatinoDraw(shot, shot.angle)
            }
        })
    }
}

export class StartEventRenderer {
    private _initPosition: Position;
    constructor(
        private readonly _viper: Viper,
        private readonly _canvasUtil: Canvas2DUtility,
        private readonly _scene: Scene,
        private readonly _endPosition: Position,
    ) {
        this._initPosition = new Position(_viper.x, _viper.y);
    }
    update() {
        const currentTime = Date.now();
        const deltaT = currentTime - this._scene.startTime;
        this._viper.y = this._initPosition.y - 20 * (deltaT / 100);

        this._canvasUtil.setGlobalAlpha(deltaT % 10 < 5 ? 0.5 : 1)

        if (this._viper.y <= this._endPosition.y) {
            this._scene.type = "playing";
            this._viper.y = this._endPosition.y;
            this._canvasUtil.setGlobalAlpha(1)
        }
        const offsetX = this._viper.width / 2
        const offsetY = this._viper.height / 2
        this._canvasUtil.drawImage(this._viper.objectImage, this._viper.x - offsetX, this._viper.y - offsetY);
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

