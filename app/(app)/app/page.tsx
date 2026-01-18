'use client'

import { Editor } from '@/components/editor/Editor'
import { FontLoader } from '@/components/FontLoader'
import { Toaster } from 'sonner'
import { useTheme } from 'next-themes'

export default function EditorPage() {
  const { resolvedTheme } = useTheme()

  return (
    <>
      {/* Lazy load editor fonts only when editor is accessed (bundle optimization) */}
      <FontLoader />
      <Editor />
      <Toaster
        position="top-center"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        gap={8}
        offset={16}
        visibleToasts={3}
        duration={2500}
        toastOptions={{
          className: 'bg-white dark:bg-zinc-900 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700 shadow-lg text-zinc-900 dark:text-white rounded-xl',
          descriptionClassName: 'text-zinc-500 dark:text-zinc-400',
          style: {
            padding: '12px 16px',
          },
          classNames: {
            toast: 'group',
            success: 'border-green-500/50 bg-green-50 dark:bg-green-950/80',
            error: 'border-red-500/50 bg-red-50 dark:bg-red-950/80',
            warning: 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/80',
            info: 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/80',
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
