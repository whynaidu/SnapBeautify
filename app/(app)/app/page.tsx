import { Editor } from '@/components/editor/Editor'
import { Toaster } from 'sonner'

export default function EditorPage() {
  return (
    <>
      <Editor />
      <Toaster
        position="top-center"
        theme="dark"
        gap={8}
        offset={16}
        visibleToasts={3}
        duration={2500}
        toastOptions={{
          className: 'bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg text-zinc-900 dark:text-white rounded-xl',
          descriptionClassName: 'text-zinc-500 dark:text-zinc-400',
          style: {
            padding: '12px 16px',
          },
          classNames: {
            toast: 'group',
            success: 'border-green-500/30 dark:border-green-500/30 bg-green-50/95 dark:bg-green-950/80',
            error: 'border-red-500/30 dark:border-red-500/30 bg-red-50/95 dark:bg-red-950/80',
            warning: 'border-amber-500/30 dark:border-amber-500/30 bg-amber-50/95 dark:bg-amber-950/80',
            info: 'border-blue-500/30 dark:border-blue-500/30 bg-blue-50/95 dark:bg-blue-950/80',
            title: 'font-medium text-sm',
            description: 'text-xs mt-0.5',
            icon: 'w-4 h-4',
            closeButton: 'bg-white/80 dark:bg-zinc-800/80 border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors rounded-full',
            actionButton: 'bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:opacity-90 transition-opacity',
            cancelButton: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors',
          },
        }}
      />
    </>
  )
}
