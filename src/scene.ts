import { Canvas2DUtility } from "./canvas2d";
import { Viper } from "./characters";
import {
  EnemyRenderer,
  Renderer,
  ShotRenderer,
  ViperRenderer,
} from "./renderers";

enum SceneName {
  INTRO = "INTRO",
  INVADE = "INVADE",
}

export class SceneManager {
  private _scenes = new Map<SceneName, Scene>();
  private _activeSceneName: SceneName | null = null;
  private _startTime: number = 0;
  private _frame: number = -1;

  add(scene: Scene) {
    this._scenes.set(scene.SCENE_NAME, scene);
  }

  use(sceneName: SceneName): void {
    if (!this._scenes.has(sceneName)) {
      throw new Error(`There is no scene named ${sceneName}.`);
    }
    this._activeSceneName = sceneName;
    this._frame = -1;
    this._startTime = Date.now();
  }
  update(): void {
    if (!this._activeSceneName) {
      return;
    }
    if (!this._scenes.has(this._activeSceneName)) {
      return;
    }
    this._frame++;
    const scene = this._scenes.get(this._activeSceneName)!;
    scene.update(Date.now() - this._startTime);
  }
}

interface Scene {
  readonly SCENE_NAME: SceneName;
  update: (time: number) => void;
}

export class IntroScene implements Scene {
  static readonly SCENE_NAME = SceneName.INTRO;
  readonly SCENE_NAME = IntroScene.SCENE_NAME;
  constructor(
    private readonly _viper: Viper,
    private readonly _canvasUtil: Canvas2DUtility,
    private readonly _scene: SceneManager
  ) {}

  update(time: number) {
    this._viper.y = this._canvasUtil.canvasHeight - 10 * (time / 100);

    this._canvasUtil.setGlobalAlpha(time % 10 < 5 ? 0.5 : 1);

    const endPosition = this._canvasUtil.canvasHeight - 50;

    if (this._viper.y <= endPosition) {
      this._scene.use(InvadeScene.SCENE_NAME);
      this._viper.y = endPosition;
      this._canvasUtil.setGlobalAlpha(1);
    }
    const offsetX = this._viper.width / 2;
    const offsetY = this._viper.height / 2;
    this._canvasUtil.drawImage(
      this._viper.objectImage,
      this._viper.x - offsetX,
      this._viper.y - offsetY
    );
  }
}

export class InvadeScene implements Scene {
  static readonly SCENE_NAME = SceneName.INVADE;
  readonly SCENE_NAME = InvadeScene.SCENE_NAME;

  constructor(private _renderers: Renderer[]) {}

  update(_: number) {
    this._renderers.forEach((renderer) => renderer.update());
  }
}
