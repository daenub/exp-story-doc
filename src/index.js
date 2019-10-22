// Test import of a JavaScript function, an SVG, and Sass
import './styles/index.scss'

import {ready} from "./js/utils"
import {initSlideshows} from "./js/slideshow"

ready(() => {
  initSlideshows()
})

