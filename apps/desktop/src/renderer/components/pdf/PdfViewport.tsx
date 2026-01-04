import React from 'react'
import './PdfViewport.css'

interface PdfViewportProps {
  children: React.ReactNode
  onZoomDelta?: (factor: number) => void
  onScrollPositionChange?: (position: { ratio: number, top: number }) => void
  scrollRef?: React.RefObject<HTMLDivElement | null>
}

export const PdfViewport: React.FC<PdfViewportProps> = ({
  children,
  onZoomDelta,
  onScrollPositionChange,
  scrollRef,
}) => {
  const rafRef = React.useRef<number | null>(null)
  const viewportRef = React.useRef<HTMLDivElement | null>(null)

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node
      if (!scrollRef)
        return
      if (typeof scrollRef === 'function') {
        scrollRef(node)
      } else {
        scrollRef.current = node
      }
    },
    [scrollRef],
  )

  React.useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!onScrollPositionChange)
      return
    const target = event.currentTarget
    const maxScroll = target.scrollHeight - target.clientHeight
    const ratio = maxScroll > 0 ? target.scrollTop / maxScroll : 0
    const top = target.scrollTop

    if (rafRef.current !== null) {
      return
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null
      onScrollPositionChange({ ratio, top })
    })
  }

  React.useEffect(() => {
    const node = viewportRef.current
    if (!node || !onZoomDelta)
      return

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey)
        return

      event.preventDefault()
      const zoomFactor = Math.exp(-event.deltaY / 200)
      onZoomDelta(zoomFactor)
    }

    node.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      node.removeEventListener('wheel', handleWheel)
    }
  }, [onZoomDelta])

  return (
    <div className="pdf-viewport" onScroll={handleScroll} ref={setRefs}>
      {children}
    </div>
  )
}
