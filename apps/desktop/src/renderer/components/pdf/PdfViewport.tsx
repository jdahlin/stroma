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

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!onZoomDelta)
      return
    if (!event.ctrlKey && !event.metaKey)
      return

    event.preventDefault()
    const zoomFactor = Math.exp(-event.deltaY / 200)
    onZoomDelta(zoomFactor)
  }

  return (
    <div className="pdf-viewport" onWheel={handleWheel} onScroll={handleScroll} ref={scrollRef}>
      {children}
    </div>
  )
}
