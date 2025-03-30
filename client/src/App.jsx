import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';
import { todoApi } from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoApi.getAllTodos();
      setTodos(response.data);
    } catch (error) {
      toast.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (text) => {
    try {
      const response = await todoApi.createTodo(text);
      setTodos([response.data, ...todos]);
      toast.success('Todo added successfully!');
    } catch (error) {
      toast.error('Failed to add todo');
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      await todoApi.updateTodo(id, { completed: !completed });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, completed: !completed } : todo
      ));
      toast.success('Todo updated successfully!');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
      toast.success('Todo deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  const handleUpdateTodo = async (id, newText) => {
    try {
      await todoApi.updateTodo(id, { text: newText });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, text: newText } : todo
      ));
      toast.success('Todo updated successfully!');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Todo List
        </h1>

        <TodoForm onSubmit={handleAddTodo} />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading todos...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No todos yet</p>
              <p className="text-sm mt-2">Add your first todo above!</p>
            </div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
