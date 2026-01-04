// Components
export { Editor } from './Editor'
export { EditorContent } from './EditorContent'
export { EditorToolbar } from './EditorToolbar'

// Extensions
export { configureExtensions, type ConfigureExtensionsOptions } from './extensions'

// Hooks
export {
  type ToolbarState,
  useCanRedo,
  useCanUndo,
  useDocumentContent,
  useEditor,
  type UseEditorOptions,
  useEditorState,
  useIsEmpty,
  useToolbarState,
} from './hooks'

// Types
export type {
  DocumentContent,
  EditorProps,
  PdfReferenceAttributes,
  SectionAttributes,
} from './types'
