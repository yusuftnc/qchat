import { useState } from 'react';
import { Box, IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Grid } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

export const MainApp = () => {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  return (
    <Grid container sx={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, border: '1px solid red'}}>
      <Grid size={3} sx={{ borderRight: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Yeni Sohbet Butonu */}
          <Box sx={{ mb: 2 }}>
            <Typography>🔴 Sidebar gelecek</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={9}>
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider' 
          }}>
            {/* Avatar ve Menü */}
            <IconButton onClick={handleAvatarClick}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {getInitials(user?.name, user?.username)}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <MenuItem disabled>
                <ListItemText primary={user?.username || user?.name || 'Kullanıcı'} />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Çıkış" />
              </MenuItem>
            </Menu>
          </Box>

          {/* Chat İçerik Alanı */}
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Typography>🔴 Chat alanı gelecek</Typography>
          </Box>

                     {/* Alt Input Alanı */}
           <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
             <Typography>🔴 Input alanı gelecek</Typography>
           </Box>

         </Box>
       </Grid>
     </Grid>
   );
}; 