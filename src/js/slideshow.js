import {$, $$, map} from "./utils"

export function initSlideshows() {
  $$("[data-slideshow]").forEach(el => new Slideshow(el))
}

const DEBUG = false

const parseCoordinates = coordString => {
  const cords = coordString.split("x")

  return {
    x: parseInt(cords[0]),
    y: parseInt(cords[1]),
  }
}

class Slideshow {
  constructor(el) {
    this.el = el
    this.viewBox = parseCoordinates(el.dataset.slideshow)
    this.slides = $$("[data-slide]", this.el).map(el => ({
      el,
      ...parseCoordinates(el.dataset.slide),
    }))
    this.canvas = $("[data-canvas]", this.el)
    this.image = $("[data-image]", this.el)
    this.button = $("[data-control]", this.el)

    this.currentSlide = 0

    this.init()
  }

  init() {
    this.button.addEventListener("click", e => {
      e.preventDefault()
      this.nextSlide()
    })

    if (this.slides.length) {
      this.revealSlide()
    }

    // Debug indicators
    if (DEBUG) {
      let div

      for (let i = 0; i < 4; i++) {
        div = document.createElement("div")
        div.classList.add("debug")
        div.classList.add("debug--" + (i + 1))
        this.canvas.appendChild(div)
      }
    }
  }

  revealSlide(index = null) {
    if (index !== null) {
      this.currentSlide = index
    }
    this.applyTransform(this.slides[this.currentSlide])
  }

  nextSlide() {
    this.revealSlide(this.currentSlide + 1)
  }

  mapCoordsToCurrentSize({x, y}) {
    const canvasRect = this.canvas.getBoundingClientRect()

    return {
      x: map(x, 0, this.viewBox.x, 0, canvasRect.width),
      y: map(y, 0, this.viewBox.y, 0, canvasRect.height),
    }
  }

  getCenterPosition({x, y}) {
    const canvasRect = this.canvas.getBoundingClientRect()

    return {
      x: canvasRect.width / 2 - x,
      y: canvasRect.height / 2 - y,
    }
  }

  applyTransform(coords) {
    const scaledCoords = this.mapCoordsToCurrentSize(coords)
    const centeredCords = this.getCenterPosition(scaledCoords)

    this.image.style.transform = `translate(${centeredCords.x}px, ${centeredCords.y}px) scale(2.5)`
    this.image.style.transformOrigin = `${scaledCoords.x}px ${scaledCoords.y}px`
  }
}
