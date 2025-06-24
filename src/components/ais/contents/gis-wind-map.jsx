import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { WindLayer } from 'ol-wind';

import MapContext from '@/components/map/MapContext';

const GisWindMap = ({ SetMap, mapId }) => {
  const map = useContext(MapContext);
  const [startWindAnimation, setStartWindAnimation] = useState(true);
  const [onWindAnimation, setOnWindAnimation] = useState(true);

  useEffect(() => {
    if (!map.ol_uid) {
      return;
    }

    map.getView().setZoom(1);
    map.getView().setCenter([1005321.0, 1771271.0]);

    if (SetMap) {
      SetMap(map);
    }
  }, [map, map.ol_uid]);

  const handleClickWindLayerBtn = async () => {
    const prevLayers = map.getLayers().getArray();

    prevLayers.forEach(layer => {
      if (layer instanceof WindLayer) {
        console.log('WindLayer found, removing it');
        map.removeLayer(layer);
      }
    });

    map.getView().setZoom(1);
    map.getView().setCenter([1005321.0, 1771271.0]);

    await axios
      .get('http://localhost:5000/api/wind')
      .then(res => res.data)
      .then(data => {
        console.log(data);

        const windLayer = new WindLayer(data, {
          forceRender: true,
          zIndex: 1000,
          projection: 'EPSG:5179',
          windOptions: {
            velocityScale: 0.0005, // 바람 속도에 따라 움직이는 속도 배율 (기본: 0.005)
            paths: 5000, // 동시에 렌더링할 입자 수 (기본: 5000)
            particleAge: 60, // 입자의 수명 (기본: 60)
            lineWidth: 3, // 입자 선의 두께 (기본: 1)
            speedFactor: 0.5, // 입자 속도 배율 (velocityScale과 별개) (기본: 1)
            particleAge: 90, // 입자의 수명 (기본: 60)
            colorScale: [
              // 속도에 따른 색상 배열
              'rgb(36,104, 180)',
              'rgb(60,157, 194)',
              'rgb(128,205,193)',
              'rgb(151,218,168)',
              'rgb(198,231,181)',
              'rgb(238,247,217)',
              'rgb(255,238,159)',
              'rgb(252,217,125)',
              'rgb(255,182,100)',
              'rgb(252,150,75)',
              'rgb(250,112,52)',
              'rgb(245,64,32)',
              'rgb(237,45,28)',
              'rgb(220,24,32)',
              'rgb(180,0,35)',
            ],
          },
        });

        map.addLayer(windLayer);

        console.log(windLayer.getData());
      });
  };

  const handleClickWindLayerStartStopBtn = () => {
    setStartWindAnimation(prev => !prev);
  };

  useEffect(() => {
    if (!map.ol_uid) return;

    const windLayer = map
      .getLayers()
      .getArray()
      .find(layer => layer instanceof WindLayer);

    if (!windLayer) return;

    if (startWindAnimation) {
      windLayer.renderer_.wind.start();
    } else {
      windLayer.renderer_.wind.stop();
    }
  }, [startWindAnimation]);

  const handleClickWindLayerOnOffBtn = () => {
    setOnWindAnimation(prev => !prev);
  };

  useEffect(() => {
    if (!map.ol_uid) return;

    const windLayer = map
      .getLayers()
      .getArray()
      .find(layer => layer instanceof WindLayer);

    if (!windLayer) return;

    windLayer.setVisible(onWindAnimation);
  }, [onWindAnimation]);

  return (
    <Container id={mapId}>
      <div className="draw-chart-btn-wrapper">
        <button className="draw-chart-btn" onClick={handleClickWindLayerBtn}>
          바람 지도 그리기
        </button>
        <button
          className="draw-chart-btn"
          onClick={handleClickWindLayerStartStopBtn}
        >
          start/stop
        </button>
        <button
          className="draw-chart-btn"
          onClick={handleClickWindLayerOnOffBtn}
        >
          on/off
        </button>
      </div>
    </Container>
  );
};

export { GisWindMap };

const Container = styled.div`
  width: 100%;
  height: 100%;

  // 국토정보지리원 로고
  .ol-attribution {
    width: 96px;
    height: 16px;
    top: 96%;
    right: 2%;

    ul {
      margin: 0;
      padding: 0;
    }
    li {
      list-style-type: none;
    }
    button {
      display: none;
    }
  }
  .ol-control {
    position: absolute;
    line-height: normal;
  }

  // 줌 컨트롤러
  .ol-zoom {
    position: absolute;
    width: 50px;
    top: 90px;
    right: 20px;
    padding: 0;
    margin: 0;
    background: rgba(255, 255, 255, 0);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1px;

    .ol-zoom-in,
    .ol-zoom-out {
      width: 100%;
      height: 24px;
      padding: 0;
      background: #ffffff;
      border: none;
      font-weight: bold;
      color: #333;
      cursor: pointer;
    }
    .ol-zoom-in {
      border-radius: 2px 2px 0 0;
    }
    .ol-zoom-out {
      border-radius: 0 0 2px 2px;
    }
    .ol-zoom-in.ol-has-tooltip:hover[role='tooltip'],
    .ol-zoom-in.ol-has-tooltip:focus[role='tooltip'] {
      top: 3px;
    }
    .ol-zoom-out.ol-has-tooltip:hover [role='tooltip'],
    .ol-zoom-out.ol-has-tooltip:focus [role='tooltip'] {
      top: 232px;
    }
  }

  // 배경지도
  .gis-control-container {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    font-family: 'Pretendard GOV Variable', 'Pretendard GOV', sans-serif;

    .gis-control {
      button {
        box-sizing: border-box;
        width: 50px;
        height: 50px;
        padding: 3px;
        background: #ffffff;
        border-radius: 3px 5px;
        border: none;
        font-size: 11px;
        line-height: 14px;
        color: #333;
        cursor: pointer;
      }
    }
    .gis-list {
      position: absolute;
      right: 100%;
      top: auto;
      width: 76px;
      height: 0;
      margin-top: 12px;
      padding-right: 10px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s;

      button {
        position: static;
        width: 100%;
        margin: 0;
        padding: 0;
        padding-bottom: 1px;
        background: #333;
        border-radius: 0;
        border: none;
        outline: none;
        font-size: 11px;
        line-height: 33px;
        text-align: center;
        color: #999;
        cursor: pointer;
        overflow: hidden;
      }
      button:hover {
        background: #222;
        color: #ff96a3;
      }
    }
    .gis-list:after {
      position: absolute;
      width: 0;
      height: 0;
      top: 15px;
      right: 0px;
      border: 5px solid transparent;
      border-left-color: #333;
      display: block;
      content: '';
    }
    .gis-list.active {
      height: calc(36px * 3 - 1px);
    }
  }

  // 범례
  .ol-legend.ol-legend-right {
    width: fit-content;
    padding: 0 10px 0 0;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.8);
    font-family: 'Pretendard GOV Variable', 'Pretendard GOV', sans-serif;

    button {
      outline: none;
      margin: 1px;
      padding: 0;
      color: var(--ol-subtle-foreground-color);
      font-weight: bold;
      text-decoration: none;
      font-size: inherit;
      text-align: center;
      height: 1.375em;
      width: 1.375em;
      line-height: 0.4em;
      background-color: var(--ol-background-color);
      border: none;
      border-radius: 2px;
    }
  }
  .ol-legend.ol-legend-right.active {
    display: block;
  }

  // 2025-01-07 추가
  .hidden {
    display: none;
  }

  // 차트 그리기 버튼
  .draw-chart-btn-wrapper {
    position: absolute;
    top: 40px;
    left: 40px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .draw-chart-btn {
    background: #ffffff;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    cursor: pointer;
  }
`;
