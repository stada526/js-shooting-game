import { Canvas2DUtility } from "./canvas2d";
import { Enemy, Shooter, Viper } from "./characters";
import { UserInputController } from "./main";

export interface Renderer {
  update(): void;
}

export class ViperRenderer implements Renderer {
  private _shotCounter: number = 0;
  constructor(
    private readonly _viper: Viper,
    private readonly _canvasUtil: Canvas2DUtility,
    private readonly _controller: UserInputController
  ) {}

  update() {
    /** Update the viper's position */
    if (this._controller.right) {
      this._viper.moveBy(this._viper.speed, 0);
    }
    if (this._controller.left) {
      this._viper.moveBy(-this._viper.speed, 0);
    }
    if (this._controller.up) {
      this._viper.moveBy(0, -this._viper.speed);
    }
    if (this._controller.down) {
      this._viper.moveBy(0, this._viper.speed);
    }
    const canvasWidth = this._canvasUtil.canvasWidth;
    const canvasHeight = this._canvasUtil.canvasHeight;
    this._viper.x = Math.min(canvasWidth, Math.max(0, this._viper.x));
    this._viper.y = Math.min(canvasHeight, Math.max(0, this._viper.y));

    /** Update shots' positions */
    if (this._controller.zKey) {
      if (this._viper.shotInterval < this._shotCounter) {
        this._viper.fire();
        this._shotCounter = 0;
      }
    }

    /** Render the viper */
    const offsetX = this._viper.width / 2;
    const offsetY = this._viper.height / 2;
    this._canvasUtil.drawImage(
      this._viper.objectImage,
      this._viper.x - offsetX,
      this._viper.y - offsetY
    );

    this._shotCounter++;
  }
}

export class ShotRenderer implements Renderer {
  constructor(
    private readonly _shooters: Shooter[],
    private readonly _canvasUtil: Canvas2DUtility
  ) {}

  update() {
    this._shooters.forEach((shooter) => this._update(shooter));
  }

  private _update(shooter: Shooter) {
    for (const shot of shooter.activeShots) {
      shot.proceed();
    }

    shooter.activeShots.forEach((shot) => {
      const offsetX = shot.width / 2;
      const offsetY = shot.height / 2;

      const nextX = shot.x - offsetX;
      const nextY = shot.y - offsetY;
      if (!this._canvasUtil.hasInCanvasRange(nextX, nextY)) {
        shot.inactivate();
      } else {
        this._canvasUtil.rotatinoDraw(shot, shot.angle);
      }
    });
  }
}

export class EnemyRenderer implements Renderer {
  private _shotCounter: number = 100;

  constructor(
    private readonly _enemy: Enemy,
    private readonly _canvasUtil: Canvas2DUtility
  ) {}

  update() {
    if (this._enemy.life <= 0) {
      return;
    }
    if (this._enemy.shotInterval < this._shotCounter) {
      this._enemy.fire();
      this._shotCounter = 0;
    }
    this._enemy.proceed();
    const offsetX = this._enemy.width / 2;
    const offsetY = this._enemy.height / 2;

    const nextX = this._enemy.x - offsetX;
    const nextY = this._enemy.y - offsetY;
    if (!this._canvasUtil.hasInCanvasRange(nextX, nextY)) {
      this._enemy.destroy();
    } else {
      this._canvasUtil.drawImage(
        this._enemy.objectImage,
        this._enemy.x,
        this._enemy.y
      );
    }
    this._shotCounter++;
  }
}
