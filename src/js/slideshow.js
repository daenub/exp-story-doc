import {$, $$, map} from "./utils"

export function initSlideshows() {
  $$("[data-slideshow]").forEach(el => new Slideshow(el))
}

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
    this.slides = $$("[data-slide]", this.el).map(el => ({el, ...parseCoordinates(el.dataset.slide)}))
    this.canvas = $("[data-canvas]", this.el)
    this.image = $("[data-image]", this.el)
    this.button = $("[data-control]", this.el)

    console.log(this.canvas.getBoundingClientRect())

    this.currentSlide = 0

    this.init()
  }

  init () {
    this.button.addEventListener("click", e => {
      e.preventDefault()
      this.nextSlide()
    })

    if (this.slides.length) {
      this.revealSlide()
    }
  }

  revealSlide(index = null) {
    console.info("revealSlide")
    if (index !== null) {
      this.currentSlide = index
    }
    this.applyTransform(this.slides[this.currentSlide])
  }

  nextSlide() {
    console.info("nextSlide")
    this.revealSlide(this.currentSlide + 1)
  }

  mapCoordsToCurrentSize({x, y}) {
    const canvasRect = this.canvas.getBoundingClientRect()

    // TODO: fix the original coords
    x = x + (788 - 394)
    y = y + (799 - 396)

    return {
      x: map(x, 0, this.viewBox.x, 0, canvasRect.width),
      y: map(y, 0, this.viewBox.y, 0, canvasRect.height),
    }
  }

  getCenterPosition({x, y}) {

  }

  applyTransform(coords) {
    const scaledCoords = this.mapCoordsToCurrentSize(coords)
    console.log(`translate(${scaledCoords.x}px, ${scaledCoords.y}px)`)
    this.image.style.transform = `translate(${-1 * scaledCoords.x}px, ${-1 * scaledCoords.y}px)`
  }
}