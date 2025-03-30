import React, { useState } from 'react';
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    if (editText.trim() && editText !== todo.text) {
      onUpdate(todo._id, editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div className="group flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id, todo.completed)}
        className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
      />
      
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleUpdate}
            className="p-1 text-green-600 hover:text-green-700"
          >
            <CheckIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 ${
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}
          >
            {todo.text}
          </span>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(todo._id)}
              className="p-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem; 