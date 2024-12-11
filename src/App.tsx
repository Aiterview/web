import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import AuthPage from './components/auth/AuthPage';
import PracticePage from './components/PracticePage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/auth' element={<AuthPage/>}/>
        <Route path='/practice' element={<PracticePage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
