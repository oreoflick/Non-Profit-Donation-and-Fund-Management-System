import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar,
  Box 
} from '@mui/material';

function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Welcome to Admin Dashboard
            </Typography>
            <Typography variant="body1">
              This is a basic admin dashboard. More administrative features will be added soon.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default AdminDashboard;