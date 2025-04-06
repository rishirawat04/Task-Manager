import React, { useState } from 'react';
import { 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Checkbox, 
  TextField, 
  Paper, 
  Chip,
  Tooltip,
  CircularProgress,
  Box
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Check as CheckIcon, 
  Close as CloseIcon,
  DragIndicator as DragIndicatorIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const TodoItem = ({ todo, onToggle, onDelete, onUpdate, darkMode = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (editText.trim() && editText !== todo.text) {
      setIsLoading(true);
      try {
        await onUpdate(todo._id, editText);
      } finally {
        setIsLoading(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(todo._id, todo.completed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(todo._id);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  // Calculate a random date for demo purposes
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 7));
  const formattedDate = randomDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 1, 
        position: 'relative',
        borderLeft: todo.completed ? '4px solid #4caf50' : '4px solid transparent',
        bgcolor: darkMode ? '#1e1e1e' : '#fff',
        '&:hover': {
          bgcolor: darkMode ? '#2d2d2d' : '#f8f8f8',
          borderLeft: todo.completed ? '4px solid #4caf50' : '4px solid #2196f3'
        }
      }}
    >
      {isLoading && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
            borderRadius: 1
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
      
      <ListItem 
        sx={{ 
          py: 1.5, 
          px: 2,
          opacity: isLoading ? 0.5 : 1
        }}
      >
        <ListItemIcon sx={{ minWidth: 32, color: darkMode ? '#aaa' : '#888', opacity: 0.5 }}>
          <DragIndicatorIcon fontSize="small" />
        </ListItemIcon>
        
        <ListItemIcon sx={{ minWidth: 40 }}>
          <Checkbox 
            edge="start"
            checked={todo.completed}
            onClick={handleToggle}
            disabled={isLoading}
            sx={{
              color: darkMode ? '#999' : '#757575',
              '&.Mui-checked': {
                color: '#4caf50',
              }
            }}
          />
        </ListItemIcon>
        
        {todo.completed && (
          <Chip 
            label="Done" 
            size="small" 
            color="success" 
            sx={{ mr: 2, height: 24 }} 
          />
        )}
        
        {isEditing ? (
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              disabled={isLoading}
              size="small"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? '#444' : '#e0e0e0'
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? '#666' : '#bdbdbd'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3'
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#fff' : 'inherit'
                }
              }}
            />
            <Tooltip title="Save">
              <IconButton 
                onClick={handleUpdate}
                disabled={isLoading}
                color="success"
                size="small"
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton 
                onClick={handleCancel}
                disabled={isLoading}
                color="error"
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <>
            <ListItemText 
              primary={todo.text} 
              primaryTypographyProps={{ 
                style: { 
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? (darkMode ? '#aaa' : '#888') : (darkMode ? '#fff' : 'inherit'),
                  fontWeight: 500
                } 
              }}
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, color: darkMode ? '#777' : '#999', fontSize: '0.75rem' }}>
                  <ScheduleIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                  {formattedDate}
                </Box>
              }
            />
            <Box>
              <Tooltip title="Edit">
                <IconButton 
                  onClick={() => setIsEditing(true)} 
                  disabled={isLoading}
                  size="small"
                  color="primary"
                  sx={{ mx: 0.5 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton 
                  onClick={handleDelete} 
                  disabled={isLoading}
                  size="small"
                  color="error"
                  sx={{ mx: 0.5 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </>
        )}
      </ListItem>
    </Paper>
  );
};

export default TodoItem; 