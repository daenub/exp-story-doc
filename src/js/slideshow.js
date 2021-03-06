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

    this.prevButton = $("[data-prev]", this.el)
    this.nextButton = $("[data-next]", this.el)

    console.log(this.el, this.prevButton, this.nextButton)

    this.currentSlide = 0

    this.init()
  }

  init() {
    this.setStatus("INIT")

    this.nextButton.addEventListener("click", e => {
      e.preventDefault()
      this.revealSlide(this.currentSlide + 1)
    })

    this.prevButton.addEventListener("click", e => {
      e.preventDefault()
      this.revealSlide(this.currentSlide - 1)
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
    this.slides[this.currentSlide].el.dataset.active = false

    if (index !== null) {
      if (this.slides.length <= index) {
        this.setStatus("ended")
        return
      } else {
        this.currentSlide = index
      }
    }

    if (this.currentSlide === 0) {
      this.setStatus("started")
    }

    this.applyTransform(this.slides[this.currentSlide])
    this.slides[this.currentSlide].el.dataset.active = true
    this.updateControls()
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

    this.image.style.transform = `translate(${centeredCords.x}px, ${centeredCords.y}px) scale(3)`
    this.image.style.transformOrigin = `${scaledCoords.x}px ${scaledCoords.y}px`
  }

  setStatus(status) {
    this.el.dataset.status = status
    this.status = status
  }

  updateControls() {
    this.prevButton.hidden = this.currentSlide === 0
    this.nextButton.hidden = this.currentSlide === this.slides.length - 1
  }
}
