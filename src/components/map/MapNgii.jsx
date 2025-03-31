import React, { useEffect, useState } from 'react';
import { Map as OlMap, View } from 'ol';
import { Attribution, Control, defaults as defaultControls } from 'ol/control';
import {
  MouseWheelZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';
import { Tile as TileLayer } from 'ol/layer';
import { WMTS, XYZ } from 'ol/source';
import { get as getProjection } from 'ol/proj';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { getTopLeft } from 'ol/extent';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { createXYZ } from 'ol/tilegrid';
import { toSize } from 'ol/size';
import LegendControl from './legend/legendControl';
import MapContext from './MapContext';

const MapNgii = ({ children }) => {
  // const apivalue = process.env.REACT_APP_NGIIAPI;
  // const urlvalue = process.env.REACT_APP_NGIIURL;
  const [mapObj, setMapObj] = useState({});
  const [btnBActive, setBtnBActive] = useState('active'); //Base
  const [btnWActive, setBtnWActive] = useState(''); // White
  const [btnSActive, setBtnSActive] = useState(''); // Satellite
  const [btnNctive, setBtnNActive] = useState(''); //null
  const [mapChoose, setMapChoose] = useState(false);

  // let mapLayer;
  proj4.defs(
    'EPSG:5179',
    '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'
  );
  proj4.defs(
    'EPSG:5181',
    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs'
  );
  register(proj4);
  const epsg = getProjection('EPSG:5179');
  epsg.setExtent(
    // [705680.0000, 1349270.0000,1388291.0000, 2581448.0000]
    [-200000.0, -28024123.62, 31824123.62, 4000000.0]
  );
  // 측정소 데이터에 맞춘 extent      // [-200000.0, -28024123.62, 31824123.62, 4000000.0] [-1034984.7079867115, 10463232.784945762, -444347.83948781993, -3469545.332767309]
  const [mapLayer, setMapLayer] = useState([
    new TileLayer({
      source: new WMTS({
        url: '/ais/proxy/ngii/hybrid',
        matrixSet: 'EPSG:5179',
        format: 'image/png',
        projection: epsg,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(epsg.getExtent()),
          resolutions: [
            2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16,
            4.08, 2.04, 1.02, 0.51, 0.255,
          ],
          matrixIds: [
            'L05',
            'L06',
            'L07',
            'L08',
            'L09',
            'L10',
            'L11',
            'L12',
            'L13',
            'L14',
            'L15',
            'L16',
            'L17',
            'L18',
          ],
        }),
        style: 'korean',
        layer: 'korean_map',
        wrapX: true,
        // attributions: [ `<img style="width:96px; height:16px;"src="${urlvalue}/img/process/ms/map/common/img_btoLogo3.png" alt="로고">` ],
        crossOrigin: 'anonymous',
      }),
      id: 'base',
    }),
    new TileLayer({
      // 백지도
      source: new WMTS({
        url: '/ais/proxy/ngii/hybrid',
        matrixSet: 'EPSG:5179',
        format: 'image/png',
        projection: epsg,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(epsg.getExtent()),
          resolutions: [
            2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16,
            4.08, 2.04, 1.02, 0.51, 0.255,
          ],
          matrixIds: [
            'L05',
            'L06',
            'L07',
            'L08',
            'L09',
            'L10',
            'L11',
            'L12',
            'L13',
            'L14',
            'L15',
            'L16',
            'L17',
            'L18',
          ],
        }),
        style: 'korean',
        layer: 'white_map',
        wrapX: true,
        // attributions: [ `<img style="width:96px; height:16px;"src="${urlvalue}/img/process/ms/map/common/img_btoLogo3.png" alt="로고">` ],
        crossOrigin: 'anonymous',
      }),
      id: 'white',
      visible: false,
    }),
    // new TileLayer({     // 영상지도
    //     source: new WMTS({
    //         url: '/ais/proxy/ngii/hybrid',
    //         matrixSet: 'EPSG:5179',
    //         format: 'image/png',
    //         projection: epsg,
    //         tileGrid:
    //         new WMTSTileGrid({
    //             origin: getTopLeft(epsg.getExtent()),
    //             resolutions : [2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16, 4.08, 2.04, 1.02, 0.51, 0.255],
    //             matrixIds : ["L05","L06","L07","L08","L09","L10","L11","L12","L13","L14","L15","L16","L17","L18"],
    //         }),
    //         style: 'korean',
    //         layer: 'satellite_map',
    //         wrapX: true,
    //         attributions: [ `<img style="width:96px; height:16px;"src="${urlvalue}/img/process/ms/map/common/img_btoLogo3.png" alt="로고">` ],
    //         crossOrigin: 'anonymous',
    //     }),
    //     id: 'satellite',
    //     visible: false,
    // }),
    // new TileLayer({
    //         // 위성지도
    //     source: new WMTS({
    //         url: `${urlvalue}/openapi/Gettile.do?apikey=${apivalue}`,
    //         matrixSet: 'EPSG:5179',
    //         format: 'image/png',
    //         projection: epsg,
    //         tileGrid: new WMTSTileGrid({
    //             origin: getTopLeft(epsg.getExtent()),
    //             resolutions : [2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16, 4.08, 2.04, 1.02, 0.51, 0.255],
    //             matrixIds : ["L05","L06","L07","L08","L09","L10","L11","L12","L13","L14","L15","L16","L17","L18"],
    //         }),
    //         style: 'hybrid',
    //         layer: 'satellite_map',
    //         wrapX: true,
    //         attributions: [ `<img style="width:96px; height:16px;"src="${urlvalue}/img/process/ms/map/common/img_btoLogo3.png" alt="로고">` ],
    //         crossOrigin: 'anonymous',
    //     })
    //     , id: 'hybrid'
    //     , visible: false
    //     , zIndex: 2
    // }),

    // new TileLayer({     // 영상지도 ( 외부망 )
    //     source: new WMTS({
    //         url: `http://210.117.198.120:8081/o2map/services?apikey=${apivalue}`, //`${urlvalue}/openapi/proxy/proxyTile.jsp?apikey=${apivalue}`,
    //         matrixSet: 'NGIS_AIR',
    //         format: 'image/jpg',
    //         projection: epsg,
    //         tileGrid: new WMTSTileGrid({
    //             origin: getTopLeft(epsg.getExtent()),
    //             resolutions : [2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16, 4.08, 2.04, 1.02, 0.51, 0.255],
    //             // matrixIds : ["5","6","7","8","9","10","11","12","13","14","15","16","17","18"],
    //         }),
    //         style: '_null',
    //         layer: 'AIRPHOTO',
    //         wrapX: true,
    //         attributions: [ `<img style="width:96px; height:16px;"src="${urlvalue}/img/process/ms/map/common/img_btoLogo3.png" alt="로고">` ],
    //         crossOrigin: 'anonymous',
    //         tileLoadFunction: (imgTile, src) => {
    //             imgTile.getImage().src=`https://map.ngii.go.kr/openapi/proxy/proxyTile.jsp?apikey=${apivalue}&URL=${encodeURIComponent(src)}`;
    //         }
    //     })
    //     , id: 'airphoto'
    //     , visible: false
    //     , zIndex: 2
    // }),

    new TileLayer({
      // 하이브리드 글씨 올리는거
      source: new WMTS({
        url: '/ais/proxy/ngii/hybrid',
        matrixSet: 'EPSG:5179',
        format: 'image/png',
        projection: epsg,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(epsg.getExtent()),
          resolutions: [
            2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16,
            4.08, 2.04, 1.02, 0.51, 0.255,
          ],
          matrixIds: [
            'L05',
            'L06',
            'L07',
            'L08',
            'L09',
            'L10',
            'L11',
            'L12',
            'L13',
            'L14',
            'L15',
            'L16',
            'L17',
            'L18',
          ],
        }),
        style: 'korean',
        layer: 'hybrid_map',
        wrapX: true,
        // attributions: [ `<img style="width:96px; height:16px;"src="${urlvalue}/img/process/ms/map/common/img_btoLogo3.png" alt="로고">` ],
        crossOrigin: 'anonymous',
      }),
      id: 'hybrid_map',
      visible: false,
      zIndex: 2,
    }),
  ]);

  useEffect(() => {
    // const epsg5181 = getProjection('EPSG:5181');
    //-973824.8708711523 -438071.0853127198 1339807.5133510637 1610089.6675916829  (115 29 142 47)
    // epsg5181.setExtent([-1000000.0, -600000.0, 2000000.00, 5000000.0]);  attributionOptions: { collapsible: true, collapsed: true },
    // epsg5181.setExtent([-47213.32584, -152247.61410, 1229135.38284, 1084126.63995 ]);
    const attrb = new Attribution({
      collapsed: true,
      collapsible: true,
      attributions: ['HELLO WORLD'],
    });
    // .extend([new LegendControl(), attrb])
    const map = new OlMap({
      controls: defaultControls({ zoom: true, rotate: false }),
      interactions: defaultInteractions({ mouseWheelZoom: true }).extend([
        new MouseWheelZoom({ constrainResolution: true }),
      ]),
      layers: mapLayer,
      view: new View({
        projection: 'EPSG:5179',
        center: [960551.04896058, 1819735.5150606], //[960551.04896058, 1819735.5150606],   //[127.5, 36.1], 1919735.5150606  [1960551, 419735]
        // zoom: 6,
        maxZoom: 18,
        minZoom: 5,
        zoom: 14,
        // extent:epsg.getExtent(),
        maxResolution: 2088.96,
        minResolution: 0.255,
        constrainResolution: true,
      }),
      // view: new View({
      //     projection: 'EPSG:5181',
      //     center: [1212520.6168, -1077414.22613],     //[162777.19181309568, 425719.33113878826],         //[205403.24911248745, 319575.2385021037],      //[960551.04896058, 1819735.5150606],   //[127.5, 36.1], 1919735.5150606   168195.6757882787 452112.2051802714(국립환경과학원 5181좌표)
      //     // zoom: 6,
      //     maxZoom:18,
      //     minZoom:1,
      //     extent:epsg5181.getExtent(),
      //     maxResolution: 2088.96,
      //     minResolution: 0.255,
      //     constrainResolution: true
      // }),
      logo: false,
      target: 'ngii',
    });

    const divMapControlContainer = document.createElement('div');
    divMapControlContainer.className = 'gis-control-container';
    const divMapControl = document.createElement('div');
    divMapControl.className = 'gis-control';
    const divMapControlSub = document.createElement('div');
    divMapControlSub.id = 'gis-list';
    divMapControlSub.className = 'gis-list';
    divMapControlSub.onmouseleave = DivMapControlSubMouseLeave;

    const buttonMapChoose = document.createElement('button');
    buttonMapChoose.className = 'map-choose';
    buttonMapChoose.innerText = '배경지도\n선택';
    buttonMapChoose.onclick = BtnChooseMapOnClick;
    const buttonMap1 = document.createElement('button');
    buttonMap1.className = 'gis-type';
    buttonMap1.id = 'base';
    buttonMap1.innerText = '일반지도';
    buttonMap1.onclick = OnClickButtonMap;
    const buttonMap2 = document.createElement('button');
    buttonMap2.className = 'gis-type';
    buttonMap2.id = 'white';
    buttonMap2.innerText = '백지도';
    buttonMap2.onclick = OnClickButtonMap;
    const buttonMap3 = document.createElement('button');
    buttonMap3.className = 'gis-type';
    buttonMap3.id = 'satellite';
    buttonMap3.innerText = '위성지도';
    buttonMap3.onclick = OnClickButtonMap;
    const buttonMap4 = document.createElement('button');
    buttonMap4.className = 'gis-type';
    buttonMap4.id = 'null';
    buttonMap4.innerText = '배경없음';
    buttonMap4.onclick = OnClickButtonMap;
    divMapControlSub.append(buttonMap1);
    divMapControlSub.append(buttonMap2);
    divMapControlSub.append(buttonMap3);
    divMapControlSub.append(buttonMap4);
    divMapControl.append(buttonMapChoose);
    divMapControlContainer.append(divMapControlSub);
    divMapControlContainer.append(divMapControl);
    const controlObj = new Control({ element: divMapControlContainer });
    map.addControl(controlObj);

    // const divLegendControl = document.createElement('div');
    // divLegendControl.className='gis-legend-container';
    // divLegendControl.id='ctrlLgndBase';
    // map.addControl(new Control({ element: divLegendControl }));

    setMapObj(map);
    return () => map.setTarget(undefined);
  }, [proj4]);

  const OnClickButtonMap = e => {
    const id = e.target.id;

    mapLayer.forEach(layer => {
      layer.setVisible(false);
    });

    if (id === 'base') {
      mapLayer[0].setVisible(true);
      setBtnBActive('active');
      setBtnWActive('');
      setBtnSActive('');
      setBtnNActive('');
    } else if (id === 'white') {
      mapLayer[1].setVisible(true);
      setBtnBActive('');
      setBtnWActive('active');
      setBtnSActive('');
      setBtnNActive('');
    } else if (id === 'satellite') {
      mapLayer[2].setVisible(true);
      setBtnBActive('');
      setBtnWActive('');
      setBtnSActive('active');
      setBtnNActive('');
    }
    // else if(id === 'hybrid') {
    //     mapLayer[1].setVisible(true);
    //     mapLayer[2].setVisible(true);
    //     setBtnBActive('');
    //     setBtnWActive('');
    //     setBtnSActive('active');
    //     setBtnNActive('');
    // }
    else if (id === 'null') {
      setBtnNActive('active');
      mapLayer[0].setVisible(false);
      mapLayer[1].setVisible(false);
      mapLayer[2].setVisible(false);
    }
  };
  const BtnChooseMapOnClick = () => {
    if (!document.getElementById('gis-list').className.includes('active')) {
      document.getElementById('gis-list').classList.add('active');
    }
  };
  const DivMapControlSubMouseLeave = () => {
    document.getElementById('gis-list').classList.remove('active');
  };

  return <MapContext.Provider value={mapObj}>{children}</MapContext.Provider>;
};

export default MapNgii;
