export function splitIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const safeColumnCount = Math.max(1, Math.floor(columnCount))

  if (!Array.isArray(items) || items.length === 0) {
    return Array.from({ length: safeColumnCount }, () => [])
  }

  const size = Math.ceil(items.length / safeColumnCount)

  return Array.from({ length: safeColumnCount }, (_, index) =>
    items.slice(index * size, (index + 1) * size)
  )
}

export function createFocusTrap(
  container: HTMLElement | null,
  extraElements: HTMLElement[] = []
) {
  return function handleFocusTrap(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !container) {
      return
    }

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ]

    const focusableWithinContainer = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
    )

    const extras = extraElements.filter((element): element is HTMLElement => Boolean(element))
    const focusableElements = [...extras, ...focusableWithinContainer]

    if (!focusableElements.length) {
      return
    }

    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === first) {
        last.focus()
        event.preventDefault()
      }
      return
    }

    if (document.activeElement === last) {
      first.focus()
      event.preventDefault()
    }
  }
}



export function setRootNavOverlay(key: "desktop" | "mobile", value: boolean) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const datasetKey = key === "desktop" ? "navDesktopMegaOpen" : "navMobileMegaOpen"

  if (value) {
    root.dataset[datasetKey] = "true"
  } else {
    delete root.dataset[datasetKey]
  }

  const shouldLock = root.dataset.navDesktopMegaOpen === "true" || root.dataset.navMobileMegaOpen === "true"

  if (shouldLock) {
    root.classList.add("nav-overlay-open")
    root.style.setProperty("overflow", "hidden")
  } else {
    root.classList.remove("nav-overlay-open")
    root.style.removeProperty("overflow")
  }
}


