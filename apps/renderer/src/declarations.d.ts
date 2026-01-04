declare module '*?url' {
  const content: string
  export default content
}

declare module 'pdfjs-dist/legacy/build/pdf' {
  export * from 'pdfjs-dist'
}
