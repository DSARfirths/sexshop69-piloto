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


