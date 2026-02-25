import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill'; // You must install: npm install react-quill
import 'react-quill/dist/quill.snow.css'; // Quill's CSS

interface QuillEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    readOnly?: boolean;
}

const MODULES = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
};

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, placeholder, readOnly = false }) => {
    const quillRef = useRef(null);

    // Use useMemo to ensure ReactQuill only updates when value/onChange change
    return useMemo(() => (
        <div className="bg-white dark:bg-gray-700 rounded-md">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={MODULES}
                placeholder={placeholder}
                readOnly={readOnly}
                className="min-h-[300px]"
            />
        </div>
    ), [value, onChange, placeholder, readOnly]);
};

export default QuillEditor;
