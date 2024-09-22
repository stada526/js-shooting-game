import { Canvas2DUtility } from "./canvas2d"
import { Position, Viper } from "./characters"
import { Scene } from "./renderers"
import { ViperRenderer } from "./renderers"

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480
const VIPER_INIT_POS = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT
}


window.addEventListener("load", () => {
  const canvas = document.getElementById("main-canvas")
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Couldn't find HTMLCanvasElement with id main-canvas`)
  }
  const util = new Canvas2DUtility(canvas)
  util.imageLoader("image/viper.png", (loadedImage) => {
    initialize(canvas)
    const scene = new Scene("coming", Date.now())
    const viper = new Viper(VIPER_INIT_POS.x, VIPER_INIT_POS.y, loadedImage, 3)
    const endPosition = new Position(VIPER_INIT_POS.x, VIPER_INIT_POS.y - 100)
    const controller = new UserInputController()
    const viperRenderer = new ViperRenderer(viper, util.context, scene, endPosition, controller)
    render(util, viperRenderer, controller)
  })
})


function initialize(canvas: HTMLCanvasElement) {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
}

function generateRandomInt(range: number) {
  const random = Math.random()
  return Math.floor(random*range)
}

function render(util: Canvas2DUtility, viperRenderer: ViperRenderer, controller: UserInputController) {
  const canvas = util.canvas

  util.drawRect(0, 0, canvas.width, canvas.height, "#eeeeee")

  viperRenderer.update()

  requestAnimationFrame(() => render(util, viperRenderer, controller))
}

export class UserInputController {
  up: boolean = false
  down: boolean = false
  right: boolean = false
  left: boolean = false
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
    })
  }
}