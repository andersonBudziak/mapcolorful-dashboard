
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Reports from './pages/Reports';
import PropertyDetail from './pages/PropertyDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Reports />} />
        <Route path="/property/:car" element={<PropertyDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
