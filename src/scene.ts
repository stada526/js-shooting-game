import { Canvas2DUtility } from "./canvas2d"
import { Viper } from "./characters"
import { EnemyRenderer, ShotRenderer, ViperRenderer } from "./renderers"

export class SceneManager {
    private _scenes = new Map<string, Scene>()
    private _activeSceneName: string | null = null
    private _startTime: number = 0
    private _frame: number = -1

    add(sceneName: string, scene: Scene) {
        this._scenes.set(sceneName, scene)
    }

    use(sceneName: string): void {
        if (!this._scenes.has(sceneName)) {
            throw new Error(`There is no scene named ${sceneName}.`)
        }
        this._activeSceneName = sceneName
        this._frame = -1
        this._startTime = Date.now()
    }
    update(): void {
        if (!this._activeSceneName) {
            return
        }
        if (!this._scenes.has(this._activeSceneName)) {
            return
        }
        this._frame++
        const scene = this._scenes.get(this._activeSceneName)!
        scene.update(Date.now() - this._startTime)
    }
}

interface Scene {
    update: (time: number) => void
};

export class IntroScene implements Scene {
    constructor(
        private readonly _viper: Viper,
        private readonly _canvasUtil: Canvas2DUtility,
        private readonly _scene: SceneManager,
    ) {}

    update(time: number) {
        this._viper.y = this._canvasUtil.canvasHeight - 20 * (time / 100);

        this._canvasUtil.setGlobalAlpha(time % 10 < 5 ? 0.5 : 1)

        if (this._viper.y <= this._canvasUtil.canvasHeight) {
            this._scene.use("invade")
            this._viper.y = this._canvasUtil.canvasHeight;
            this._canvasUtil.setGlobalAlpha(1)
        }
        const offsetX = this._viper.width / 2
        const offsetY = this._viper.height / 2
        this._canvasUtil.drawImage(this._viper.objectImage, this._viper.x - offsetX, this._viper.y - offsetY);
    }
}

export class InvadeScene implements Scene {
    constructor(private _viperRenderer: ViperRenderer, private _shotRenderer: ShotRenderer, private _enemyRenderer: EnemyRenderer) {}
    update(time: number) {
        this._viperRenderer.update()
        this._shotRenderer.update()
        this._enemyRenderer.update()
    }
}