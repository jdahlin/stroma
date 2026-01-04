import type { Brand } from '@repo/shared'

export type PdfSourceId = Brand<string, 'PdfSourceId'>
export type PdfAnchorId = Brand<string, 'PdfAnchorId'>

export type PdfAnchorType = 'text' | 'point' | 'figure'

export interface PdfRect {
  x: number
  y: number
  width: number
  height: number
}

export interface PdfSource {
  id: PdfSourceId
  name: string
  path: string
  pageCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface PdfAnchorBase {
  id: PdfAnchorId
  sourceId: PdfSourceId
  pageIndex: number
  type: PdfAnchorType
  createdAt: Date
  updatedAt: Date
}

export interface PdfTextAnchor extends PdfAnchorBase {
  type: 'text'
  text: string
  rects: PdfRect[]
}

export interface PdfPointAnchor extends PdfAnchorBase {
  type: 'point'
  point: { x: number, y: number }
}

export interface PdfFigureAnchor extends PdfAnchorBase {
  type: 'figure'
  rect: PdfRect
}

export type PdfAnchor = PdfTextAnchor | PdfPointAnchor | PdfFigureAnchor
