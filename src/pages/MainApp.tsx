import { useState } from 'react';
import { 
  Box, IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, 
  Typography, Grid, Button, TextField, Paper, FormControl, Select, 
  InputLabel, Chip, Divider
} from '@mui/material';
import { 
  Logout, Add, Send, SmartToy, Psychology, Code, 
  Science, MenuBook, Person 
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

// Chat message tipi
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

// Chat conversation tipi
interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  createdAt: Date;
}

export const MainApp = () => {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Chat state
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  // Models listesi
  const models = [
    { id: 'gpt-4', name: 'GPT-4', icon: <SmartToy />, color: 'primary' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', icon: <Psychology />, color: 'secondary' },
    { id: 'claude-3', name: 'Claude-3', icon: <MenuBook />, color: 'success' },
    { id: 'gemini-pro', name: 'Gemini Pro', icon: <Science />, color: 'warning' },
  ];

  // Avatar menü kontrolü
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  // Yeni conversation başlat
  const createNewConversation = () => {
    const newConversation: ChatConversation = {
      id: Date.now().toString(),
      title: 'Yeni Sohbet',
      messages: [],
      model: selectedModel,
      createdAt: new Date()
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  // Mesaj gönder
  const sendMessage = async () => {
    if (!currentMessage.trim() || !activeConversationId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    // User mesajını ekle
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, userMessage] }
        : conv
    ));

    setCurrentMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Bu ${selectedModel} modelinden gelen bir yanıt. Gerçek API entegrasyonu yapılacak.`,
        timestamp: new Date(),
        model: selectedModel
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, aiMessage] }
          : conv
      ));
    }, 1000);
  };

  // Handle Enter key
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Kullanıcı adından initials oluştur
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  return (
    <Grid container sx={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0 }}>
      
      {/* Sol Sidebar - Chat Geçmişi */}
      <Grid size={3} sx={{ borderRight: 1, borderColor: 'divider', backgroundColor: 'grey.50' }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* New Chat Button */}
          <Box sx={{ p: 2 }}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<Add />}
              onClick={createNewConversation}
              sx={{ justifyContent: 'flex-start' }}
            >
              Yeni Sohbet
            </Button>
          </Box>

          <Divider />

          {/* Chat History */}
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 1,
            minHeight: 0,  // Flex child için gerekli
            maxHeight: 'calc(100vh - 120px)', // Button + divider alanı hariç
            // Custom Scrollbar Styling
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#1976d2',  // Primary blue
              borderRadius: '10px',
              '&:hover': {
                background: '#1565c0',  // Darker blue on hover
              },
            },
          }}>
            {conversations.map((conv) => (
              <Paper
                key={conv.id}
                elevation={activeConversationId === conv.id ? 2 : 0}
                sx={{
                  p: 2,
                  mb: 1,
                  cursor: 'pointer',
                  backgroundColor: activeConversationId === conv.id ? 'primary.light' : 'transparent',
                  '&:hover': { backgroundColor: 'grey.100' }
                }}
                onClick={() => setActiveConversationId(conv.id)}
              >
                <Typography variant="body2" noWrap>
                  {conv.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {conv.messages.length} mesaj
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Grid>

      {/* Orta Alan - Chat Interface */}
      <Grid size={6}>
        <Box sx={{ 
          height: '100vh',
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'grey.300'
        }}>
          
          {/* Model Selection Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>AI Model</InputLabel>
              <Select
                value={selectedModel}
                label="AI Model"
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {models.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {model.icon}
                      {model.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {activeConversation && (
              <Chip 
                label={`${activeConversation.messages.length} mesaj`}
                size="small"
                color="primary"
              />
            )}
          </Box>

          {/* Chat Messages Area */}
          <Box sx={{ 
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            // Custom Scrollbar Styling
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#1976d2',  // Primary blue
              borderRadius: '10px',
              '&:hover': {
                background: '#1565c0',  // Darker blue on hover
              },
            },
          }}>
            {!activeConversation ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <SmartToy sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  QnChat'e Hoş Geldin!
                </Typography>
                <Typography color="text.secondary">
                  Yeni bir sohbet başlatmak için "Yeni Sohbet" butonuna tıklayın
                </Typography>
              </Box>
            ) : (
              activeConversation.messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message.role === 'user' ? 'primary.main' : 'grey.100',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body1">
                      {message.content}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7,
                        display: 'block',
                        mt: 1
                      }}
                    >
                      {message.timestamp.toLocaleTimeString()}
                      {message.model && ` • ${message.model}`}
                    </Typography>
                  </Paper>
                </Box>
              ))
            )}
          </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                multiline
                maxRows={4}
                fullWidth
                placeholder="Mesajınızı yazın..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!activeConversationId}
                variant="outlined"
                size="small"
              />
              <IconButton 
                color="primary" 
                onClick={sendMessage}
                disabled={!currentMessage.trim() || !activeConversationId}
                sx={{ 
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  '&:disabled': { backgroundColor: 'grey.300' }
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Sağ Panel - User Profile */}
      <Grid size={3} sx={{ borderLeft: 1, borderColor: 'divider', backgroundColor: 'grey.50' }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* User Header */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                width: 60, 
                height: 60,
                mb: 2,
                cursor: 'pointer'
              }}
              onClick={handleAvatarClick}
            >
              {getInitials(user?.name, user?.username)}
            </Avatar>
            
            <Typography variant="h6" gutterBottom>
              {user?.name || 'Kullanıcı'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.username}
            </Typography>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Çıkış" />
              </MenuItem>
            </Menu>
          </Box>

          {/* Stats/Info */}
          <Box sx={{ p: 2, flexGrow: 1, textAlign: 'right' }}>
            <Typography variant="subtitle2" gutterBottom>
              İstatistikler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                📊 Toplam Sohbet: {conversations.length}
              </Typography>
              <Typography variant="body2">
                💬 Aktif Model: {models.find(m => m.id === selectedModel)?.name}
              </Typography>
              <Typography variant="body2">
                ⭐ QnChat v1.0
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}; 