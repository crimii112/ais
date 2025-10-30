import React, { useState, useEffect } from 'react';

import { IntensiveDataFrame } from './intensive-data-frame';
import { ContentChartFrame } from '@/components/ais/content-chart-frame';

/**
 * (선택)성분시계열 페이지
 *
 * - x축은 측정일자로 고정 / Y축 4개 옵션 선택 후 그래프 그리기
 * - 라인 차트 사용
 * - 그래프 클릭 시 해당하는 행 테이블에서 하이라이트 표시 기능
 *
 * @param {string} type - 타입(auto, manual)
 * @returns {React.ReactNode}
 */

const IntensiveTimeSeries = ({ type }) => {
  const config = TIMESERIES_CONFIG[type];

  const [isLoading, setIsLoading] = useState(false);
  const [contentData, setContentData] = useState();

  const [highlightedRow, setHighlightedRow] = useState(null);

  const initSettings = () => {
    setHighlightedRow(null);
  };

  const handleDataLoaded = data => {
    if (!data?.headList || !data?.headNameList || !data?.rstList2) return;

    setContentData(data);
  };

  return (
    <IntensiveDataFrame
      type={config.type}
      onDataLoaded={handleDataLoaded}
      onLoadingChange={setIsLoading}
      initSettings={initSettings}
      highlightedRow={highlightedRow}
    >
      <ContentChartFrame
        datas={contentData}
        isLoading={isLoading}
        type={config.chartType}
        title={config.title}
        setHighlightedRow={setHighlightedRow}
      />
    </IntensiveDataFrame>
  );
};

export { IntensiveTimeSeries };

const TIMESERIES_CONFIG = {
  auto: {
    type: 'autoTimeSeries',
    title: '자동-(선택)성분시계열',
    chartType: 'line',
  },
  // manual: {
  //   type: 'manualTimeSeries',
  //   title: '수동-(선택)성분시계열',
  //   chartType: 'line',
  // },
};
