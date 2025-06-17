import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Stroke } from 'ol/style';
import Chart from 'ol-ext/style/Chart';
import Select from 'ol/interaction/Select';
import { unByKey } from 'ol/Observable';
import { easeOut } from 'ol/easing';

const Test = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [vector, setVector] = useState(null);
  const [selectedData, setSelectedData] = useState('No selection');
  const [chartType, setChartType] = useState('pie');
  const [colorScheme, setColorScheme] = useState('classic');
  
  const animationRef = useRef(false);
  const listenerKeyRef = useRef(null);
  const styleCacheRef = useRef({});

  // 스타일 생성 함수
  const getFeatureStyle = (feature, sel) => {
    const key = `${chartType}-${colorScheme}-${sel ? 'sel' : 'nsel'}-${feature.get('data').join('-')}`;
    let style = styleCacheRef.current[key];
    
    if (!style) {
      let radius = 15;
      if (chartType !== 'bar') {
        radius = 8 * Math.sqrt(feature.get('size') / Math.PI);
      }

      const c = colorScheme;
      styleCacheRef.current[key] = style = [
        new Style({
          image: new Chart({
            type: chartType,
            radius: (sel ? 1.2 : 1) * radius,
            displacement: [
              0,
              chartType === 'bar' ? (sel ? 1.2 : 1) * radius : 0
            ],
            data: feature.get('data') || [10, 30, 20],
            colors: /,/.test(c) ? c.split(',') : c,
            rotateWithView: true,
            animation: animationRef.current,
            stroke: new Stroke({
              color: colorScheme !== 'neon' ? '#fff' : '#000',
              width: 2
            }),
          })
        })
      ];
    }
    style[0].getImage().setAnimation(animationRef.current);
    return style;
  };

  // 애니메이션 함수
  const doAnimate = () => {
    if (listenerKeyRef.current) return;

    const start = new Date().getTime();
    const duration = 1000;
    animationRef.current = 0;

    listenerKeyRef.current = vector.on(['precompose', 'prerender'], (event) => {
      const frameState = event.frameState;
      const elapsed = frameState.time - start;

      if (elapsed > duration) {
        unByKey(listenerKeyRef.current);
        listenerKeyRef.current = null;
        animationRef.current = false;
      } else {
        animationRef.current = easeOut(elapsed / duration);
        frameState.animate = true;
      }
      vector.changed();
    });

    vector.changed();
  };

  // 초기화
  useEffect(() => {
    if (!mapRef.current) return;

    // 맵 초기화
    const newMap = new Map({
      target: mapRef.current,
      view: new View({
        zoom: 6,
        center: [166326, 5992663]
      })
    });

    // 랜덤 피처 생성
    const ext = newMap.getView().calculateExtent(newMap.getSize());
    const features = [];
    for (let i = 0; i < 30; ++i) {
      let nb = 0;
      const data = [];
      for (let k = 0; k < 4; k++) {
        const n = Math.round(8 * Math.random());
        data.push(n);
        nb += n;
      }
      features[i] = new Feature({
        geometry: new Point([
          ext[0] + (ext[2] - ext[0]) * Math.random(),
          ext[1] + (ext[3] - ext[1]) * Math.random()
        ]),
        data: data,
        size: nb
      });
    }

    // 벡터 레이어 생성
    const newVector = new VectorLayer({
      name: 'Vector',
      source: new VectorSource({ features: features }),
      style: (f) => getFeatureStyle(f)
    });

    newMap.addLayer(newVector);
    setVector(newVector);

    // 선택 인터랙션 추가
    const select = new Select({
      style: (f) => getFeatureStyle(f, true)
    });
    newMap.addInteraction(select);

    select.getFeatures().on(['add', 'remove'], (e) => {
      if (e.type === 'add') {
        setSelectedData(`Selection data: ${e.element.get('data').toString()}`);
      } else {
        setSelectedData('No selection');
      }
    });

    setMap(newMap);

    return () => {
      if (newMap) {
        newMap.setTarget(undefined);
      }
    };
  }, []);

  return (
    <Container>
      <h1>ol-ext: style chart</h1>
      <p className="info">
        The <i>ol.style.Chart</i> is an image style to draw statistical graphics (bar or pie charts) on a map.
      </p>

      <MapContainer ref={mapRef} />
      
      <OptionsContainer>
        <h2>Options:</h2>
        <div>
          Chart type: 
          <select 
            value={chartType} 
            onChange={(e) => {
              setChartType(e.target.value);
              doAnimate();
            }}
          >
            <option value="pie">pie</option>
            <option value="pie3D">pie3D</option>
            <option value="donut">donut</option>
            <option value="bar">bar</option>
          </select>
        </div>
        
        <div>
          Colors scheme: 
          <select 
            value={colorScheme}
            onChange={(e) => {
              setColorScheme(e.target.value);
              vector?.changed();
            }}
          >
            <option value="classic">Classic</option>
            <option value="dark">Dark</option>
            <option value="pale">Pale</option>
            <option value="pastel">Pastel</option>
            <option value="neon">Neon</option>
            <option value="red,green,blue,magenta">Custom</option>
          </select>
        </div>
        
        <button onClick={doAnimate}>Animate!</button>
      </OptionsContainer>
      
      <div className="info">{selectedData}</div>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const MapContainer = styled.div`
  width: 600px;
  height: 400px;
  margin: 20px 0;
`;

const OptionsContainer = styled.div`
  margin: 20px 0;
  
  select {
    margin: 0 10px;
  }
  
  button {
    margin-top: 10px;
    padding: 5px 10px;
  }
`;

export default Test;
