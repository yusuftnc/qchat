import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography } from '@mui/material';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { theme } from './utils/theme';
import { msalConfig } from './utils/authConfig';
import { LoginButton } from './components/LoginButton';

// Microsoft Authentication instance
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              QnA Application
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Microsoft hesabınızla giriş yapın ve AI modellerine sorular sorun
            </Typography>
            <LoginButton 
              onLoginSuccess={() => {
                console.log('Giriş başarılı!');
              }}
            />
          </Box>
        </Container>
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App
