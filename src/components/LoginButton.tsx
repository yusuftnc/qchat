import { Button } from '@mui/material';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/authConfig';

interface LoginButtonProps {
  onLoginSuccess?: () => void;
}

export const LoginButton = ({ onLoginSuccess }: LoginButtonProps) => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      console.log('Login başarılı:', response);
      
      // API için token'ı ayarla
      if (response.accessToken) {
        // Burada API servisine token ekleyeceğiz
        console.log('Token alındı:', response.accessToken);
      }
      
      // Başarılı giriş callback'i
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Login hatası:', error);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={handleLogin}
      sx={{
        minWidth: 200,
        py: 1.5,
      }}
    >
      Microsoft ile Giriş Yap
    </Button>
  );
}; 