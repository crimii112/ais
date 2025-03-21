import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainNav from '@/components/main-nav';
import Ais from '@/pages/Ais';
import Home from '@/pages/Home';

import { AisNavProvider } from '@/context/AisNavContext';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen overflow-x-hidden bg-gray-100">
        <div className="flex flex-col max-w-[1440px] min-h-screen mx-auto bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/ais"
              element={
                <AisNavProvider>
                  <Ais />
                </AisNavProvider>
              }
            />
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
      </div>
    </BrowserRouter>
  );
}

export default App;
