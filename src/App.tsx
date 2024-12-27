import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { PracticeProvider } from './context/PracticeContext';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PracticeProvider>
          <AppRoutes />
        </PracticeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;