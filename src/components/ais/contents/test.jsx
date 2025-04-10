import { useState } from 'react';
import usePostRequest from '@/hooks/usePostRequest';

import { ContentChartFrame } from '../content-chart-frame';
import { FlexRowWrapper, Button, Select, Option } from '@/components/ui/common';
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ContentTableFrame } from '../content-table-frame';

const Test = () => {
  const postMutation = usePostRequest();

  const [contentData, setContentData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [optionSettings, setOptionSettings] = useState();
  const [options, setOptions] = useState({});
  const [chartData, setChartData] = useState();

  const handleClickSearchBtn = async () => {
    const apiData = {
      page: 'intensive/psize',
      date: ['DATARF;2015/01/01 01;2015/01/05 24'],
      site: [823001, 111001],
      cond: {
        sect: 'time',
        poll: 'calc',
        dust: 'include',
        stats: '',
        eqType: 'SMPS_APS_O',
      },
      mark: [
        { id: 'unit1', checked: false },
        { id: 'unit2', checked: false },
      ],
      digitlist: { pm: 1, lon: 3, carbon: 1, metal: 1, gas: 1, other: 6 },
      polllist: [
        { id: 'High', checked: true, signvalue: '#' },
        { id: 'Low', checked: true, signvalue: '##' },
        { id: 'dumy', checked: false },
      ],
    };

    try {
      let apiRes = await postMutation.mutateAsync({
        url: 'ais/srch/datas.do',
        data: apiData,
      });

      if (JSON.stringify(apiRes) === '{}') {
        apiRes = {
          headList: ['NO DATA'],
          headNameList: ['NO DATA'],
          rstList: ['NO DATA'],
        };
      }

      console.log(apiData);
      console.log(apiRes);

      const groupdate = [
        ...new Set(apiRes.rstList.map(item => item.groupdate)),
      ];
      const type = [...new Set(apiRes.rstList.map(item => item.type))];
      const groupNm = apiRes.rstList2.map(item => item.groupNm);

      setOptions({
        groupdate: groupdate[0],
        type: type[0],
        groupNm: groupNm[0],
      });
      setOptionSettings({ groupdate: groupdate, type: type, groupNm: groupNm });
      setContentData(apiRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickDrawChart = () => {
    console.log(options);

    const rawData = contentData.rstList.filter(data => {
      if (
        data.groupdate === options.groupdate &&
        data.groupNm === options.groupNm &&
        data.type === options.type
      ) {
        return data;
      }
    });

    const { groupdate, groupNm, type, ...dataPoints } = rawData[0];

    const processedData = Object.entries(dataPoints)
      .filter(([key, _]) => !isNaN(key))
      .map(([key, value]) => ({
        groupdate,
        groupNm,
        type,
        x: Number(key) / 10,
        y: parseFloat(value),
      }));

    console.log(processedData);
    setChartData(processedData);
  };

  return (
    <>
      <Button onClick={handleClickSearchBtn}>검색</Button>
      <ContentTableFrame
        datas={contentData}
        isLoading={isLoading}
        fileName="test"
      />

      {optionSettings && (
        <FlexRowWrapper className="w-full justify-start">
          <Select
            className="w-fit"
            onChange={e =>
              setOptions(prev => ({ ...prev, groupdate: e.target.value }))
            }
          >
            {optionSettings.groupdate.map(date => (
              <Option key={date} value={date}>
                {date}
              </Option>
            ))}
          </Select>
          <Select
            className="w-fit"
            onChange={e =>
              setOptions(prev => ({ ...prev, groupNm: e.target.value }))
            }
          >
            {optionSettings.groupNm.map(name => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
          <Select
            className="w-fit"
            onChange={e =>
              setOptions(prev => ({ ...prev, type: e.target.value }))
            }
          >
            {optionSettings.type.map(type => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
          <Button className="w-fit" onClick={handleClickDrawChart}>
            그래프 그리기
          </Button>
        </FlexRowWrapper>
      )}
      {chartData && (
        <ResponsiveContainer width="100%" height={700}>
          <ScatterChart>
            <XAxis type="number" dataKey="x" name="성분" scale="log" />
            <YAxis type="number" dataKey="y" name="" />
            <Scatter data={chartData} />
          </ScatterChart>
        </ResponsiveContainer>
      )}

      {/* <ContentChartFrame
        datas={contentData}
        isLoading={isLoading}
        type="line"
        title="text"
      /> */}
    </>
  );
};
export { Test };
