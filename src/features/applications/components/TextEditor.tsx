import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TextEditorProps {
  apiKey: string;
  initialValue: string;
  onChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ apiKey, initialValue }) => {
  const handleEditorChange = (content: string, _editor: any) => {
    console.log('Content was updated:', content);
  };

  return (
    <Editor
      apiKey={apiKey}
      initialValue={initialValue}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
        content_style: "body { background-color: #231f20; color: #ffffff; }"
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TextEditor;