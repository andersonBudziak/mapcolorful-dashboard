
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import Reports from '@/pages/Reports';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Reports />} />
        <Route path="/report/:car" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
