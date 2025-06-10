import { useContext, useEffect } from "react";
import styled from "styled-components";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Chart from 'ol-ext/style/Chart';

import MapContext from "@/components/map/MapContext";
import { Feature } from "ol";
import { Point } from "ol/geom"
import { Stroke, Style } from "ol/style";

const GisPie = ({ SetMap }) => {
    const map = useContext(MapContext);

    const sourceChart = new VectorSource({ wrapX: false });
    const layerChart = new VectorLayer({ source: sourceChart, style: null, id: 'chart', zIndex: 10 });

    useEffect(() => {
        if(!map.ol_uid) { return; }

        map.addLayer(layerChart);

        map.getView().setZoom(2);
        map.getView().setCenter([1005321.0, 1771271.0]);
        
        if(SetMap) {
            SetMap(map);
        }

        chartFeature();
        
        layerChart.setStyle(chartStyle);

    }, [map, map.ol_uid]);

    const chartFeature = () => {
        const feature = new Feature({
            geometry: new Point([1036655.3999999999, 1806517.6062700134]),
            data: [3, 2, 6, 9],
            sum: 20
        });

        sourceChart.addFeature(feature);
    }

    const chartStyle = (feature) => {
        const style = new Style({
            image: new Chart({
                type: 'pie',
                colors: 'pastel',
                radius: 30,
                data: feature.get('data'),
                rotateWithView: true,
                stroke: new Stroke({
                    color: 'white',
                    width: 2
                })
            }),
            zIndex: 10
        })

        return style;
    }

    return (
        <Container id="ngii">
            {/* <PopupContainer ref={refPopup}>
                <PopupWrap>{txtPopup}</PopupWrap>
            </PopupContainer> */}
        </Container>
    )
}

export { GisPie };

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
    .ol-zoom-in.ol-has-tooltip:hover[role="tooltip"],
    .ol-zoom-in.ol-has-tooltip:focus[role="tooltip"] {
      top: 3px;
    }
    .ol-zoom-out.ol-has-tooltip:hover [role="tooltip"],
    .ol-zoom-out.ol-has-tooltip:focus [role="tooltip"] {
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
      content: "";
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
`;

const PopupContainer = styled.div`
  position: relative;
  top: 28px;
  left: -50px;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

  &:after,
  &:before {
    position: absolute;
    width: 0;
    height: 0;
    bottom: 100%;
    border: solid transparent;
    content: " ";
    pointer-event: none;
  }
  &:after {
    left: 48px;
    margin-left: -10px;
    border-bottom-color: #ffffff;
    border-width: 10px;
  }
  &:before {
    left: 48px;
    margin-left: -11px;
    border-bottom-color: #cccccc;
    border-width: 11px;
  }
`;

const PopupWrap = styled.div`
  width: 100%;
  font-family: 'Pretendard GOV Variable', 'Pretendard GOV', sans-serif;
  font-size: 15px;
  line-height: 18px;
  color: #000000;
  white-space: pre-line;
`;