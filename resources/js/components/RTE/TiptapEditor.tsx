// resources/js/components/RTE/TiptapEditor.tsx

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
// Note: You may need to add styling for the 'tiptap' class in your main CSS.

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    // This is a minimal menu bar using simple text buttons
    return (
        <div className="flex flex-wrap p-2 border-b border-gray-200 dark:border-gray-700 space-x-2 bg-gray-50 dark:bg-gray-800 rounded-t-md">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-indigo-200 p-1 rounded' : 'p-1 rounded'}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-indigo-200 p-1 rounded' : 'p-1 rounded'}
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-indigo-200 p-1 rounded' : 'p-1 rounded'}
            >
                Bullet List
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'bg-indigo-200 p-1 rounded' : 'p-1 rounded'}
            >
                H2
            </button>
            {/* Add more buttons as needed (Blockquote, Image, Link, etc.) */}
        </div>
    );
};

interface TiptapEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    readOnly?: boolean;
}

export default function TiptapEditor({ value, onChange, placeholder, readOnly = false }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [

            // FIX: Configure StarterKit to NOT load the default Link extension
            StarterKit.configure({
                // Exclude the extensions we want to configure ourselves
                // Note: The History and other extensions should still be loaded if needed.
                // For Link, we exclude the default version.
                link: false,
            }),

            // Explicitly configure our Link extension
            Link.configure({
                openOnClick: true,
                autolink: true,
                // Add any custom options here
            }),

            // Image extension (does not conflict with StarterKit)
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            // Send the raw HTML content up to the parent form
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                // Style the content area itself
                class: 'prose dark:prose-invert max-w-none p-4 min-h-[300px] border border-t-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-md focus:outline-none',
            },
        },
        editable: !readOnly,
    }, [value]); // Re-render if initial value changes

    // Ensure the editor only updates its internal state when value is different
    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value, false);
        }
    }, [value, editor]);


    return (
        <div className="TiptapEditorWrapper">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
