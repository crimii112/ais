import { useEffect } from 'react';

import { useAisNav } from '@/context/AisNavContext';
import { AisNav } from '@/components/ais/ais-nav';
import { AisContent } from '@/components/ais/ais-content';

function Ais() {
  const { tabList } = useAisNav();

  useEffect(() => {
    console.log(tabList);
  }, [tabList]);

  return (
    <div>
      <AisNav />
      <AisContent />
    </div>
  );
}

export default Ais;
