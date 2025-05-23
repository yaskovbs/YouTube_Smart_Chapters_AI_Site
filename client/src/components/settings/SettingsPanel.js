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
 * @param {Object} props.apiKeysStatus - Status of API keys (openai, assemblyai)
 * @param {Function} props.onApiKeyUpdate - Function to call when API key is updated
 * @param {Function} props.onClose - Function to call when closing the panel
 */
const SettingsPanel = ({ apiKeysStatus, onApiKeyUpdate, onClose }) => {
  const [tab, setTab] = useState(0);
  const [openaiKey, setOpenaiKey] = useState('');
  const [assemblyaiKey, setAssemblyaiKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showAssemblyaiKey, setShowAssemblyaiKey] = useState(false);
  const [openaiKeyError, setOpenaiKeyError] = useState('');
  const [assemblyaiKeyError, setAssemblyaiKeyError] = useState('');
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
      setOpenaiKeyError('מפתח API נדרש');
      return;
    }

    try {
      setSaving(true);
      setOpenaiKeyError('');
      
      // Basic validation of the key format
      if (openaiKey.length < 20) {
        setOpenaiKeyError('מפתח API צריך להיות לפחות 20 תווים');
        setSaving(false);
        return;
      }

      // Check if it starts with sk- for OpenAI keys
      if (!openaiKey.startsWith('sk-')) {
        setOpenaiKeyError('מפתח OpenAI צריך להתחיל ב-sk-');
        setSaving(false);
        return;
      }
      
      const response = await aiService.saveApiKey('openai', openaiKey);
      
      if (response.success) {
        setSuccessMessage('מפתח OpenAI נשמר בהצלחה');
        onApiKeyUpdate('openai', true);
        setOpenaiKey(''); // Clear the field for security
      } else {
        setOpenaiKeyError(response.message || 'שגיאה בשמירת מפתח ה-API');
      }
    } catch (error) {
      setOpenaiKeyError(error.message || 'שגיאה בשמירת מפתח ה-API');
    } finally {
      setSaving(false);
    }
  };

  // Save AssemblyAI API key
  const handleSaveAssemblyaiKey = async () => {
    if (!assemblyaiKey.trim()) {
      setAssemblyaiKeyError('מפתח API נדרש');
      return;
    }

    try {
      setSaving(true);
      setAssemblyaiKeyError('');
      
      // Basic validation of the key format
      if (assemblyaiKey.length < 20) {
        setAssemblyaiKeyError('מפתח API צריך להיות לפחות 20 תווים');
        setSaving(false);
        return;
      }
      
      const response = await aiService.saveApiKey('assemblyai', assemblyaiKey);
      
      if (response.success) {
        setSuccessMessage('מפתח AssemblyAI נשמר בהצלחה');
        onApiKeyUpdate('assemblyai', true);
        setAssemblyaiKey(''); // Clear the field for security
      } else {
        setAssemblyaiKeyError(response.message || 'שגיאה בשמירת מפתח ה-API');
      }
    } catch (error) {
      setAssemblyaiKeyError(error.message || 'שגיאה בשמירת מפתח ה-API');
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
        הגדרות
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
            <Tab label="מפתח OpenAI" />
            <Tab label="מפתח AssemblyAI" />
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
              <Typography variant="h6">מפתח OpenAI API</Typography>
              {apiKeysStatus.openai && (
                <CheckCircleIcon 
                  color="success"
                  fontSize="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              הזן את מפתח ה-API של OpenAI כדי להשתמש ב-ChatGPT לניתוח תוכן ויצירת פרקים.
              ניתן לקבל מפתח API מ-<a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">האתר של OpenAI</a>.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>הוראות:</strong><br />
                1. היכנס לאתר OpenAI Platform<br />
                2. צור חשבון או התחבר<br />
                3. עבור ל-API Keys<br />
                4. צור מפתח חדש<br />
                5. העתק והדבק כאן
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              variant="outlined"
              label="מפתח OpenAI API"
              placeholder="sk-..."
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
              label="הצג מפתח API"
            />
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSaveOpenaiKey}
                disabled={saving || !openaiKey.trim()}
              >
                שמור מפתח OpenAI
              </Button>
            </Box>
          </Box>
        )}
        
        {/* AssemblyAI API Key Tab */}
        {tab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <KeyIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">מפתח AssemblyAI API</Typography>
              {apiKeysStatus.assemblyai && (
                <CheckCircleIcon 
                  color="success"
                  fontSize="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              הזן את מפתח ה-API של AssemblyAI לתמלול וניתוח תוכן עם פרקים אוטומטיים.
              ניתן לקבל מפתח API מ-<a href="https://www.assemblyai.com/" target="_blank" rel="noopener noreferrer">האתר של AssemblyAI</a>.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>הוראות:</strong><br />
                1. היכנס לאתר AssemblyAI<br />
                2. צור חשבון או התחבר<br />
                3. עבור ל-Dashboard<br />
                4. העתק את מפתח ה-API<br />
                5. הדבק כאן
              </Typography>
            </Alert>

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>יתרונות AssemblyAI:</strong><br />
                • תמלול מדויק יותר<br />
                • פרקים אוטומטיים מובנים<br />
                • תמיכה בעברית ושפות נוספות<br />
                • מהירות עיבוד מהירה יותר
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              variant="outlined"
              label="מפתח AssemblyAI API"
              value={assemblyaiKey}
              onChange={(e) => setAssemblyaiKey(e.target.value)}
              error={!!assemblyaiKeyError}
              helperText={assemblyaiKeyError}
              type={showAssemblyaiKey ? 'text' : 'password'}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={showAssemblyaiKey}
                  onChange={() => setShowAssemblyaiKey(!showAssemblyaiKey)}
                />
              }
              label="הצג מפתח API"
            />
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSaveAssemblyaiKey}
                disabled={saving || !assemblyaiKey.trim()}
              >
                שמור מפתח AssemblyAI
              </Button>
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Alert severity="info">
          <Typography variant="body2">
            <strong>המלצה:</strong> השתמש ב-AssemblyAI לתמלול (תוצאות טובות יותר) וב-OpenAI לניתוח ויצירת מטא-נתונים.
            שני המפתחות יאפשרו לך לקבל את התוצאות הטובות ביותר.
          </Typography>
        </Alert>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            צריך עזרה? רוצה ללמוד עוד על התוסף?
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => window.open('https://youtubesmartchaptersai.pages.dev', '_blank')}
            sx={{ mb: 1 }}
          >
            🌐 בקר באתר שלנו
          </Button>
          <Typography variant="caption" display="block" color="text.secondary">
            מדריכים, צילומי מסך ומידע נוסף על התוסף
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsPanel;
