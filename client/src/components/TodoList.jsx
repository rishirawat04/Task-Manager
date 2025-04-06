import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  List, 
  Tabs, 
  Tab, 
  Chip, 
  Grid,
  IconButton,
  InputAdornment,
  useMediaQuery,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Add as AddIcon, 
  Assignment as AssignmentIcon, 
  FilterList as FilterListIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import TodoItem from './TodoItem';
import { todoApi } from '../services/api';
import { toast } from 'react-toastify';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filterValue, setFilterValue] = useState(0); // 0: all, 1: active, 2: completed
  const isMobile = useMediaQuery('(max-width:600px)');

  // Create a theme based on dark mode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await todoApi.getAllTodos();
      setTodos(response.data);
      toast.success('Tasks loaded successfully');
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setIsLoading(true);
    try {
      const response = await todoApi.createTodo(newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo('');
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await todoApi.updateTodo(id, { completed: !completed });
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('Failed to update task');
    }
  };

  const updateTodo = async (id, text) => {
    try {
      await todoApi.updateTodo(id, { text });
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, text } : todo
        )
      );
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete task');
    }
  };

  // Filter todos based on filterValue
  const getFilteredTodos = () => {
    switch (filterValue) {
      case 1: // Active
        return todos.filter(todo => !todo.completed);
      case 2: // Completed
        return todos.filter(todo => todo.completed);
      default: // All
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  // Count completed and remaining tasks
  const completedTasks = todos.filter(todo => todo.completed).length;
  const remainingTasks = todos.length - completedTasks;

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default', 
        py: 3,
        transition: 'background-color 0.3s ease'
      }}>
        <Container maxWidth="md">
          {/* Header with App Title and Theme Toggle */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4 
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <AssignmentIcon sx={{ mr: 1 }} />
              Task Manager
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    color="primary"
                  />
                }
                label={
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                  </Box>
                }
              />
              
              <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                <IconButton
                  onClick={() => setIsGridView(false)}
                  color={!isGridView ? 'primary' : 'default'}
                  size="small"
                >
                  <ViewListIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => setIsGridView(true)}
                  color={isGridView ? 'primary' : 'default'}
                  size="small"
                >
                  <ViewModuleIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
          
          {/* Input Section with Shadow */}
          <Paper 
            elevation={3} 
            sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: 2, 
              bgcolor: 'background.paper',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <form onSubmit={addTodo}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ mb: 2, fontWeight: 500 }}
              >
                Add New Task
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                <TextField
                  fullWidth
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  variant="outlined"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssignmentIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  startIcon={<AddIcon />}
                  sx={{ 
                    px: 3, 
                    height: isMobile ? 'auto' : 56,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Add Task
                </Button>
              </Box>
            </form>
          </Paper>

          {/* Filter Tabs */}
          <Paper 
            sx={{ 
              mb: 3, 
              borderRadius: 2, 
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
                <FilterListIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Filter:
                </Typography>
              </Box>
              
              <Tabs 
                value={filterValue} 
                onChange={(_, newValue) => setFilterValue(newValue)}
                indicatorColor="primary"
                textColor="primary"
                sx={{ mx: 'auto' }}
              >
                <Tab label="All" />
                <Tab label="Active" />
                <Tab label="Completed" />
              </Tabs>
              
              <Box sx={{ display: 'flex', gap: 1, px: 2, py: isMobile ? 1 : 0 }}>
                <Chip 
                  size="small" 
                  label={`Total: ${todos.length}`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  size="small" 
                  label={`Pending: ${remainingTasks}`} 
                  color="warning" 
                  variant="outlined" 
                />
                <Chip 
                  size="small" 
                  label={`Completed: ${completedTasks}`} 
                  color="success" 
                  variant="outlined" 
                />
              </Box>
            </Box>
          </Paper>

          {/* Todo Items Section */}
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              bgcolor: 'background.paper',
              mb: 4
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                px: 3, 
                py: 2,
                borderBottom: 1, 
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                My Tasks
                {isLoading && <CircularProgress size={16} sx={{ ml: 1 }} />}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', typography: 'caption' }}>
                <CalendarTodayIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                {currentDate}
              </Box>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 1 }}>
              {isLoading && todos.length === 0 ? (
                <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress size={40} />
                </Box>
              ) : filteredTodos.length === 0 ? (
                <Box 
                  sx={{ 
                    py: 8, 
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 48, opacity: 0.2, mb: 2 }} />
                  <Typography variant="h6">
                    No tasks {filterValue !== 0 ? `in "${filterValue === 1 ? 'Active' : 'Completed'}" category` : 'yet'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {filterValue === 0 ? 'Add your first task above.' : 'Change filter to see more tasks.'}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 2 }}>
                  {isGridView ? (
                    <Grid container spacing={2}>
                      {filteredTodos.map((todo) => (
                        <Grid item xs={12} md={6} key={todo._id}>
                          <TodoItem
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onUpdate={updateTodo}
                            darkMode={darkMode}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <List disablePadding>
                      {filteredTodos.map((todo) => (
                        <TodoItem
                          key={todo._id}
                          todo={todo}
                          onToggle={toggleTodo}
                          onDelete={deleteTodo}
                          onUpdate={updateTodo}
                          darkMode={darkMode}
                        />
                      ))}
                    </List>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
          
          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
            <Typography variant="caption">
              Task Manager &copy; {new Date().getFullYear()} - Built with Material-UI
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TodoList; 