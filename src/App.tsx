import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import { PracticeProvider } from './context/PracticeContext';
import { CreditsProvider } from './context/CreditsContext';

const App = () => {
  return (
    <BrowserRouter>
      <CreditsProvider>
        <PracticeProvider>
          <AppRoutes />
        </PracticeProvider>
      </CreditsProvider>
    </BrowserRouter>
  );
};

export default App;