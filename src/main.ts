import { Canvas2DUtility } from "./canvas2d"

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480
const VIPER_INIT_POS = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT
}

type Point2 = {
  x: number,
  y: number
}


type SceneType = "coming" | "playing"

class Scene {
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

window.addEventListener("load", () => {
  const canvas = document.getElementById("main-canvas")
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Couldn't find HTMLCanvasElement with id main-canvas`)
  }
  const util = new Canvas2DUtility(canvas)
  util.imageLoader("image/viper.png", (loadedImage) => {
    initialize(canvas)
    const startTime = Date.now()
    const viperPos: Point2 = {
      x: VIPER_INIT_POS.x,
      y: VIPER_INIT_POS.y
    }
    const scene = new Scene("coming", Date.now())
    setupEvents(viperPos, scene)
    render(util, loadedImage, startTime, viperPos, scene)
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

function setupEvents(viperPos: Point2, scene: Scene) {
  addEventListener('keydown', (event) => {
    switch (event.key) {
      case "ArrowRight": {
        if (!scene.acceptingUserInput()) {
          return
        }
        viperPos.x += 10
        return
      }
      case "ArrowLeft": {
        if (!scene.acceptingUserInput()) {
          return
        }
        viperPos.x -= 10
        return
      }
      case "ArrowUp": {
        if (!scene.acceptingUserInput()) {
          return
        }
        viperPos.y -= 10
        return
      }
      case "ArrowDown": {
        if (!scene.acceptingUserInput()) {
          return
        }
        viperPos.y += 10
        return
      }
    }
  })
}

function render(util: Canvas2DUtility, image: HTMLImageElement, startTime: number, viperPos: Point2, scene: Scene) {
  const canvas = util.canvas
  const ctx = util.context
  
  ctx.globalAlpha = 1

  util.drawRect(0, 0, canvas.width, canvas.height, "#eeeeee")
  
  if (scene.type === "coming") {
    const currentTime = Date.now()
    const deltaT = currentTime - startTime
    viperPos.y = VIPER_INIT_POS.y - 20 * (deltaT / 100)
    if (viperPos.y <= CANVAS_HEIGHT - 100) {
      scene.type = "playing"
      viperPos.y = CANVAS_HEIGHT - 100
    }
    if (deltaT%10 < 5) {
      ctx.globalAlpha = 0.5
    }
  }

  ctx.drawImage(image, viperPos.x, viperPos.y)
  
  requestAnimationFrame(() => render(util, image, startTime, viperPos, scene))
}