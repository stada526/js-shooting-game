import { Canvas2DUtility } from "./canvas2d"
import { Position, Shot, Viper } from "./characters"
import { Scene, ShotRenderer, StartEventRenderer } from "./renderers"
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
  const shotImage = await util.imageLoader("image/viper_shot.png")
  const scene = new Scene("coming", Date.now())
  const viper = new Viper(VIPER_INIT_POS.x, VIPER_INIT_POS.y, viperImage, 3)
  const shots =  Array.from({length: 10}).map(() => new Shot(shotImage, 3))
  viper.shotArray = shots
  const endPosition = new Position(VIPER_INIT_POS.x, VIPER_INIT_POS.y - 100)
  const controller = new UserInputController()
  const viperRenderer = new ViperRenderer(viper, util, controller)
  const shotRenderer = new ShotRenderer(viper, util)
  const startEventRenderer = new StartEventRenderer(viper, util, scene, endPosition)
  render(util, scene, startEventRenderer, viperRenderer, shotRenderer)

})


function initialize(canvas: HTMLCanvasElement) {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
}

function generateRandomInt(range: number) {
  const random = Math.random()
  return Math.floor(random*range)
}

function render(util: Canvas2DUtility, scene: Scene, startEventRenderer: StartEventRenderer, viperRenderer: ViperRenderer, shotRenderer: ShotRenderer) {
  util.drawRect(0, 0, util.canvasWidth, util.canvasHeight, "#eeeeee")

  if (scene.type === "coming") {
    startEventRenderer.update()
  } else {
    viperRenderer.update()
    shotRenderer.update()
  }

  requestAnimationFrame(() => render(util, scene, startEventRenderer, viperRenderer, shotRenderer))
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