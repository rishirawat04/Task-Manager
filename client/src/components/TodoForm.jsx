import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

const TodoForm = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2 p-2 bg-white rounded-lg shadow-sm">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Todo</span>
        </button>
      </div>
    </form>
  );
};

export default TodoForm; 