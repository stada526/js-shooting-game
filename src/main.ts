import { Canvas2DUtility } from "./canvas2d"
import { Enemy, Position, Viper } from "./characters"
import { EnemyRenderer, Scene, ShotRenderer, StartEventRenderer } from "./renderers"
import { ViperRenderer } from "./renderers"

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480
const VIPER_INIT_POS = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT
}


window.addEventListener("load", async() => {
  const canvas = document.getElementById("main-canvas")
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Couldn't find HTMLCanvasElement with id main-canvas`)
  }
  initialize(canvas)
  const util = new Canvas2DUtility(canvas)

  const viperImage = await util.imageLoader("image/viper.png")
  const enemyImage = await util.imageLoader("image/enemy_small.png")
  const doubleShotImage = await util.imageLoader("image/viper_shot.png")
  const singleShotImage = await util.imageLoader("image/viper_single_shot.png")

  const scene = new Scene("coming", Date.now())
  const viper = new Viper(VIPER_INIT_POS.x, VIPER_INIT_POS.y, 3, viperImage, singleShotImage, doubleShotImage)
  const enemies = [
    new Enemy(100, 50, 2, enemyImage),
    new Enemy(400, 50, 2, enemyImage),
  ]
  viper.setDoubleShots(10)
  viper.setSingleShots(10)
  const endPosition = new Position(VIPER_INIT_POS.x, VIPER_INIT_POS.y - 100)
  const controller = new UserInputController()
  const viperRenderer = new ViperRenderer(viper, util, controller)
  const enemyRenderer = new EnemyRenderer(enemies, util)
  const shotRenderer = new ShotRenderer(viper, util)
  const startEventRenderer = new StartEventRenderer(viper, util, scene, endPosition)
  render(util, scene, startEventRenderer, viperRenderer, shotRenderer, enemyRenderer)

})


function initialize(canvas: HTMLCanvasElement) {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
}

function generateRandomInt(range: number) {
  const random = Math.random()
  return Math.floor(random*range)
}

function render(
  util: Canvas2DUtility,
  scene: Scene,
  startEventRenderer: StartEventRenderer,
  viperRenderer: ViperRenderer,
  shotRenderer: ShotRenderer,
  enemyRenderer: EnemyRenderer
) {
  util.drawRect(0, 0, util.canvasWidth, util.canvasHeight, "#eeeeee")

  if (scene.type === "coming") {
    startEventRenderer.update()
  } else {
    viperRenderer.update()
    shotRenderer.update()
    enemyRenderer.update()
  }

  requestAnimationFrame(() => render(util, scene, startEventRenderer, viperRenderer, shotRenderer, enemyRenderer))
}

export class UserInputController {
  up: boolean = false
  down: boolean = false
  right: boolean = false
  left: boolean = false
  zKey: boolean = false
  constructor() {
    addEventListener('keydown', (event) => {
      if (event.key === "ArrowRight") {
        this.right = true
      }
      if (event.key === "ArrowLeft"){
        this.left = true
      }
      if (event.key === "ArrowUp"){
        this.up = true
      }
      if (event.key === "ArrowDown") {
        this.down = true
      }
      if (event.key === "z") {
        this.zKey = true
      }
    })
    addEventListener('keyup', (event) => {
      if (event.key === "ArrowRight") {
        this.right = false
      }
      if (event.key === "ArrowLeft"){
        this.left = false
      }
      if (event.key === "ArrowUp"){
        this.up = false
      }
      if (event.key === "ArrowDown") {
        this.down = false
      }
      if (event.key === "z") {
        this.zKey = false
      }
    })
  }
}