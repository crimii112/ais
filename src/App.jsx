import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainNav from '@/components/main-nav';
import Ais from '@/pages/Ais';
import Home from '@/pages/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col max-w-[1440px] mx-auto min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ais" element={<Ais />} />
          <Route
            path="/contact"
            element={
              <>
                <MainNav />
                <div className="p-3">Contact</div>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
