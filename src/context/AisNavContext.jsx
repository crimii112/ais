import { createContext, useContext, useMemo, useState } from 'react';

const AisNavContext = createContext();

const AisNavProvider = ({children}) => {
  const [tabList, setTabList] = useState([]);
  
  const contextValue = useMemo(() => ({tabList, setTabList}), [tabList, setTabList]);

  return <AisNavContext.Provider value={contextValue}>{children}</AisNavContext.Provider>;
}

function useAisNav() {
  const context = useContext(AisNavContext);
  if (!context) {
    throw new Error('Cannot find AisNavProvider');
  }

  return context;
}

export { AisNavProvider, useAisNav };