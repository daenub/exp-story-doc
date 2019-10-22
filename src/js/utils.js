export const $ = (selector, base = document) =>
  base.querySelector(selector)

export const $$ = (selector, base = document) =>
  Array.prototype.slice.call(base.querySelectorAll(selector))

export const ready = fn => {
  if (document.readyState !== "loading") {
    fn()
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      fn()
    })
  }
}

export const map = (value, start1, stop1, start2, stop2) =>
  ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2