export function debounce(fn, delay = 200) {
  let t = null
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}

export function sleep(time = 200) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
