import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  Alert,
  FormControlLabel,
  Switch,
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/Key';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { aiService } from '../../services/apiService';

/**
 * Settings panel for API key configuration
 * @param {Object} props - Component props
 * @param {Object} props.apiKeysStatus - Status of API keys (openai, google)
 * @param {Function} props.onApiKeyUpdate - Function to call when API key is updated
 * @param {Function} props.onClose - Function to call when closing the panel
 */
const SettingsPanel = ({ apiKeysStatus, onApiKeyUpdate, onClose }) => {
  const [tab, setTab] = useState(0);
  const [openaiKey, setOpenaiKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [openaiKeyError, setOpenaiKeyError] = useState('');
  const [googleKeyError, setGoogleKeyError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    // Clear any previous success messages when changing tabs
    setSuccessMessage('');
  };

  // Save OpenAI API key
  const handleSaveOpenaiKey = async () => {
    if (!openaiKey.trim()) {
      setOpenaiKeyError('API key is required');
      return;
    }

    try {
      setSaving(true);
      setOpenaiKeyError('');
      
      // This would need validation of the key format in a real app
      if (openaiKey.length < 20) {
        setOpenaiKeyError('API key should be at least 20 characters');
        setSaving(false);
        return;
      }
      
      const response = await aiService.saveApiKey('openai', openaiKey);
      
      if (response.success) {
        setSuccessMessage('OpenAI API key saved successfully');
        onApiKeyUpdate('openai', true);
      } else {
        setOpenaiKeyError(response.message || 'Failed to save API key');
      }
    } catch (error) {
      setOpenaiKeyError(error.message || 'Error saving API key');
    } finally {
      setSaving(false);
    }
  };

  // Save Google API key
  const handleSaveGoogleKey = async () => {
    if (!googleKey.trim()) {
      setGoogleKeyError('API key is required');
      return;
    }

    try {
      setSaving(true);
      setGoogleKeyError('');
      
      // This would need validation of the key format in a real app
      if (googleKey.length < 20) {
        setGoogleKeyError('API key should be at least 20 characters');
        setSaving(false);
        return;
      }
      
      const response = await aiService.saveApiKey('google', googleKey);
      
      if (response.success) {
        setSuccessMessage('Google AI API key saved successfully');
        onApiKeyUpdate('google', true);
      } else {
        setGoogleKeyError(response.message || 'Failed to save API key');
      }
    } catch (error) {
      setGoogleKeyError(error.message || 'Error saving API key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Settings
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="OpenAI API Key" />
            <Tab label="Google API Key" />
          </Tabs>
        </Paper>
        
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            onClose={() => setSuccessMessage('')}
          >
            {successMessage}
          </Alert>
        )}
        
        {/* OpenAI API Key Tab */}
        {tab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <KeyIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">OpenAI API Key</Typography>
              {apiKeysStatus.openai && (
                <CheckCircleIcon 
                  color="success"
                  fontSize="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter your OpenAI API key to use ChatGPT for content analysis and chapter generation.
              You can get an API key from <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">OpenAI's website</a>.
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              label="OpenAI API Key"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              error={!!openaiKeyError}
              helperText={openaiKeyError}
              type={showOpenaiKey ? 'text' : 'password'}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={showOpenaiKey}
                  onChange={() => setShowOpenaiKey(!showOpenaiKey)}
                />
              }
              label="Show API Key"
            />
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSaveOpenaiKey}
                disabled={saving || !openaiKey.trim()}
              >
                Save OpenAI API Key
              </Button>
            </Box>
          </Box>
        )}
        
        {/* Google API Key Tab */}
        {tab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <KeyIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Google AI API Key</Typography>
              {apiKeysStatus.google && (
                <CheckCircleIcon 
                  color="success"
                  fontSize="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter your Google AI Studio API key for transcription and content analysis.
              You can get an API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              label="Google AI API Key"
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              error={!!googleKeyError}
              helperText={googleKeyError}
              type={showGoogleKey ? 'text' : 'password'}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={showGoogleKey}
                  onChange={() => setShowGoogleKey(!showGoogleKey)}
                />
              }
              label="Show API Key"
            />
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSaveGoogleKey}
                disabled={saving || !googleKey.trim()}
              >
                Save Google API Key
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsPanel;
