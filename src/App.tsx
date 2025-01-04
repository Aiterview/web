import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import { PracticeProvider } from './context/PracticeContext';

const App = () => {
  return (
    <BrowserRouter>
      
        <PracticeProvider>
          <AppRoutes />
        </PracticeProvider>
      
    </BrowserRouter>
  );
};

export default App;