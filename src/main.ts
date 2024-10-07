import { Canvas2DUtility } from "./canvas2d";
import { Enemy, Viper } from "./characters";
import { EnemyRenderer, ShotRenderer } from "./renderers";
import { ViperRenderer } from "./renderers";
import { IntroScene, InvadeScene, SceneManager } from "./scene";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const VIPER_INIT_POS = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT + 200,
};

window.addEventListener("load", async () => {
  const canvas = document.getElementById("main-canvas");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Couldn't find HTMLCanvasElement with id main-canvas`);
  }
  initialize(canvas);
  const canvasUtil = new Canvas2DUtility(canvas);

  const viperImage = await canvasUtil.imageLoader("image/viper.png");
  const enemyImage = await canvasUtil.imageLoader("image/enemy_small.png");
  const doubleShotImage = await canvasUtil.imageLoader("image/viper_shot.png");
  const singleShotImage = await canvasUtil.imageLoader(
    "image/viper_single_shot.png"
  );
  const enemyShotImage = await canvasUtil.imageLoader("image/enemy_shot.png");

  const viper = new Viper(
    VIPER_INIT_POS.x,
    VIPER_INIT_POS.y,
    3,
    viperImage,
    singleShotImage,
    doubleShotImage
  );
  const enemies = [
    new Enemy(100, 50, 2, enemyImage, enemyShotImage),
    new Enemy(400, 50, 2, enemyImage, enemyShotImage),
  ];
  enemies.forEach((x) => x.setShots(10));

  viper.setDoubleShots(10);
  viper.setSingleShots(10);

  const controller = new UserInputController();

  const viperRenderer = new ViperRenderer(viper, canvasUtil, controller);
  const enemyRenderers = enemies.map((x) => new EnemyRenderer(x, canvasUtil));
  const shotRenderer = new ShotRenderer([viper, ...enemies], canvasUtil);

  const sceneManager = new SceneManager();

  const introScene = new IntroScene(viper, canvasUtil, sceneManager);
  const invadeScene = new InvadeScene([
    viperRenderer,
    shotRenderer,
    ...enemyRenderers,
  ]);

  sceneManager.add(introScene);
  sceneManager.add(invadeScene);

  sceneManager.use(IntroScene.SCENE_NAME);
  render(canvasUtil, sceneManager);
});

function initialize(canvas: HTMLCanvasElement) {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
}

function generateRandomInt(range: number) {
  const random = Math.random();
  return Math.floor(random * range);
}

function render(util: Canvas2DUtility, scene: SceneManager) {
  util.drawRect(0, 0, util.canvasWidth, util.canvasHeight, "#eeeeee");

  scene.update();

  requestAnimationFrame(() => render(util, scene));
}

export class UserInputController {
  up: boolean = false;
  down: boolean = false;
  right: boolean = false;
  left: boolean = false;
  zKey: boolean = false;
  constructor() {
    addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        this.right = true;
      }
      if (event.key === "ArrowLeft") {
        this.left = true;
      }
      if (event.key === "ArrowUp") {
        this.up = true;
      }
      if (event.key === "ArrowDown") {
        this.down = true;
      }
      if (event.key === "z") {
        this.zKey = true;
      }
    });
    addEventListener("keyup", (event) => {
      if (event.key === "ArrowRight") {
        this.right = false;
      }
      if (event.key === "ArrowLeft") {
        this.left = false;
      }
      if (event.key === "ArrowUp") {
        this.up = false;
      }
      if (event.key === "ArrowDown") {
        this.down = false;
      }
      if (event.key === "z") {
        this.zKey = false;
      }
    });
  }
}
