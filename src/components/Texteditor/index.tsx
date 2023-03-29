import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Props extends Partial<ReactQuill> {
  value?: string;
  onChange?: (value: string) => void;
}

export const TextEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
    <>
      <ReactQuill theme='snow' value={value || ''} onChange={onChange} className='height-300' />
    </>
  );
};
