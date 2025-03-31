import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainNav from '@/components/main-nav';
import Ais from '@/pages/Ais';
import Home from '@/pages/Home';

import { AisNavProvider } from '@/context/AisNavContext';
import { MapFrame } from '@/components/map';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen overflow-x-hidden bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col w-[1440px] h-screen max-w-[1440px] min-h-screen mx-auto bg-white">
                <Home />
              </div>
            }
          />
          <Route
            path="/ais"
            element={
              <AisNavProvider>
                <div className="flex flex-col w-[1440px] h-screen max-w-[1440px] min-h-screen mx-auto bg-white">
                  <Ais />
                </div>
              </AisNavProvider>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="flex flex-col w-[1440px] h-screen max-w-[1440px] min-h-screen mx-auto bg-white">
                <MainNav />
                <div className="p-3">Contact</div>
              </div>
            }
          />
          <Route
            path="/ngii"
            element={
              <div className="w-screen h-screen">
                <MapFrame />
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
