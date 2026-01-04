import React from 'react'
import './PdfViewport.css'

interface PdfViewportProps {
  children: React.ReactNode
  onZoomDelta?: (factor: number) => void
  onScrollRatioChange?: (ratio: number) => void
  scrollRef?: React.RefObject<HTMLDivElement | null>
}

export const PdfViewport: React.FC<PdfViewportProps> = ({
  children,
  onZoomDelta,
  onScrollRatioChange,
  scrollRef,
}) => {
  const rafRef = React.useRef<number | null>(null)
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!onScrollRatioChange)
      return
    const target = event.currentTarget
    const maxScroll = target.scrollHeight - target.clientHeight
    const ratio = maxScroll > 0 ? target.scrollTop / maxScroll : 0

    if (rafRef.current !== null) {
      return
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null
      onScrollRatioChange(ratio)
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
