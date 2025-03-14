import { useAisNav } from "@/context/AisNavContext";
import { AisNav } from "@/components/ais/ais-nav";
import { useEffect } from "react";

function Ais() {
  const { tabList } = useAisNav();

  useEffect(() => { console.log(tabList)},[tabList])

  return (
    <div>
      <AisNav />
      AIS
    </div>
  );
}

export default Ais;
