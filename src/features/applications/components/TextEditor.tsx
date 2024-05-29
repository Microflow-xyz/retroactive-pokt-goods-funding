'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Placeholder from '@tiptap/extension-placeholder'
import { FC, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { useFormContext } from 'react-hook-form';

const MenuBar: FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-1 text-white">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('bold') ? 'bg-white text-black' : 'bg-gray-600 text-white'
        }`}
      >
        <i className={`fas fa-bold ${editor.isActive('bold') ? 'text-black' : 'text-white'}`}></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('italic') ? 'bg-white text-black' : 'bg-gray-600 text-white'
        }`}
      >
        <i className={`fas fa-italic ${editor.isActive('italic') ? 'text-black' : 'text-white'}`}></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('heading', { level: 1 }) ? 'bg-white text-black' : 'bg-gray-600 text-white'
        }`}
      >
        <i className={`fas fa-heading ${editor.isActive('heading', { level: 1 }) ? 'text-black' : 'text-white'}`}></i>
        <span className="align-sub text-sm mx-[2px]">1</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive('heading', { level: 2 }) ? 'bg-white text-black' : 'bg-gray-600 text-white'
        }`}
      >
        <i className={`fas fa-heading ${editor.isActive('heading', { level: 2 }) ? 'text-black' : 'text-white'}`}></i>
        <span className="align-sub text-sm mx-[2px]">2</span>
      </button>
    </div>
  );
};

const TextEditor: FC<{ name: string }> = ({ name }) => {
  const { setValue, watch } = useFormContext();
  const editorContentRef = useRef(watch(name));

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Heading,
      BulletList,
      OrderedList,
    ],
    content: editorContentRef.current,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      editorContentRef.current = content;
      setValue(name, content);
    },
  });
  Placeholder.configure({
    placeholder: 'My Custom Placeholder',
  })

  useEffect(() => {
    setValue(name, editorContentRef.current);
  }, [setValue]);

  return (
    <div className="px-2">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="border p-2 min-h-[200px] text-white rounded-md bg-gray-800"
      />
    </div>
  );
};

export default TextEditor;
