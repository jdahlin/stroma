// Components
export { Editor } from './Editor'
export { EditorContent } from './EditorContent'
export { EditorToolbar } from './EditorToolbar'

// Extensions
export {
  configureExtensions,
  type ConfigureExtensionsOptions,
  PdfReference,
  type PdfReferenceOptions,
  Section,
  type SectionOptions,
  SlashCommand,
  type SlashCommandItem,
  slashCommandItems,
  type SlashCommandOptions,
  type SlashCommandSuggestionProps,
  slashCommandSuggestion,
} from './extensions'

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
