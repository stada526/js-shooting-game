export enum ObjectImageKey {
  Viper,
  ViperSingleShot,
  ViperDoubleShot,
  SmallEnemy,
  EnemyShot,
}

class ObjectImageProvider {
  private _objectImages: Record<ObjectImageKey, HTMLImageElement | null> = {
    [ObjectImageKey.Viper]: null,
    [ObjectImageKey.ViperSingleShot]: null,
    [ObjectImageKey.ViperDoubleShot]: null,
    [ObjectImageKey.SmallEnemy]: null,
    [ObjectImageKey.EnemyShot]: null,
  };

  constructor() {}

  async load(): Promise<void> {
    const resources: [ObjectImageKey, string][] = [
      [ObjectImageKey.Viper, "image/viper.png"],
      [ObjectImageKey.ViperSingleShot, "image/viper_single_shot.png"],
      [ObjectImageKey.ViperDoubleShot, "image/viper_shot.png"],
      [ObjectImageKey.SmallEnemy, "image/enemy_small.png"],
      [ObjectImageKey.EnemyShot, "image/enemy_shot.png"],
    ];
    const promises = resources.map(([key, path]) => {
      return this._load(key, path);
    });
    await Promise.all(promises);
  }

  private async _load(imageKey: ObjectImageKey, imagePath: string) {
    const image = await this._loadImage(imagePath);
    this._objectImages[imageKey] = image;
  }

  private async _loadImage(path: string): Promise<HTMLImageElement> {
    const target = new Image();
    target.src = path;
    return new Promise((resolve) => {
      target.addEventListener("load", () => {
        return resolve(target);
      });
    });
  }

  get(imageKey: ObjectImageKey): HTMLImageElement {
    const image = this._objectImages[imageKey];
    if (image === null) {
      throw new Error(`Image not loaded: ${imageKey}`);
    }
    return image;
  }
}

export const objectImageProvider = new ObjectImageProvider();
