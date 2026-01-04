import { Editor } from '@/components/editor/Editor';
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <>
      <Editor />
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          className: 'bg-zinc-800 border-zinc-700 text-white',
        }}
      />
    </>
  );
}
