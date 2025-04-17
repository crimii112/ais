import { useCallback, useEffect, useMemo, useState } from "react";
import usePostRequest from "@/hooks/usePostRequest";

import { SearchFrame } from "../search-frame";
import { SearchDate } from "../search-date";
import { SearchStation } from "../search-station";
import { SearchPollutant } from "../search-pollutant";
import { SearchCond } from "../search-cond";
import { ContentTableFrame } from "../content-table-frame";

const IntensiveAuto = ({ type }) => {
    const config = INTENSIVE_AUTO_SETTINGS[type];
    const postMutation = usePostRequest();

    const [dateList, setDateList] = useState([]);
    const [stationList, setStationList] = useState([]);
    const [searchCond, setSearchCond] = useState([
        config.initCond,     // condList
        { id: "unit1", checked: false },    // markList
        { id: "unit2", checked: false }
    ]);
    const [pollutant, setPollutant] = useState([
        { pm: 1, lon: 3, carbon: 1, metal: 1, gas: 1, other: 6  },      // digitList
        { id: 'High', checked: true, signvalue: '#' },      // signList    
        { id: 'Low', checked: true, signvalue: '##' },
        { id: 'dumy', checked: false },
    ]);

    useEffect(() => {
        console.log(dateList);
    }, [dateList]);


    const [isLoading, setIsLoading] = useState(false);
    const [contentData, setContentData] = useState();

    const apiData = useMemo(() => ({
        page: 'intensive/autotimecorrelation',
        date: dateList,
        site: stationList,
        cond: searchCond[0],
        mark: searchCond.slice(1),
        digitlist: pollutant[0],
        polllist: pollutant.slice(1),
    }), [dateList, stationList, searchCond, pollutant]);

    const handleClickSearchBtn = useCallback(async () => {
        if (!dateList.length) return alert('기간을 설정하여 주십시오.');
        if (!stationList.length) return alert('측정소를 설정하여 주십시오.');
        if (postMutation.isLoading) return;
        
        setIsLoading(true);
        setContentData(undefined);

        try{
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

            setContentData(apiRes);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
        
    }, [apiData, postMutation]);

    return <>
        <SearchFrame handleClickSearchBtn={handleClickSearchBtn}>
            <SearchDate setDateList={setDateList} type="intensive" />
            <SearchStation
                title="대기환경연구소"
                siteType="intensive"
                onTms={false}
                setStationList={setStationList}
            />
            <SearchPollutant
                title="물질 및 소수점 자릿수"
                digitList={digitList}
                signList={signList}
                initialPollutant={pollutant}
                setPollutant={setPollutant}
            />
            <SearchCond
                condList={config.condList}
                markList={markList}
                initialSearchCond={searchCond}
                setSearchCond={setSearchCond}
            />
        </SearchFrame>

        <ContentTableFrame
            datas={contentData}
            isLoading={isLoading}
            fileName="자동-(단일)성분상관성검토"
        />
    </>;
};

export { IntensiveAuto };

const digitList = [
    {
        id: 'pm',
        text: 'PM',
        value: 1,
    },
    {
        id: 'lon',
        text: 'lon',
        value: 3,
    },
    {
        id: 'carbon',
        text: 'Carbon',
        value: 1,
    },
    {
        id: 'metal',
        text: 'Metal',
        value: 1,
    },
    {
        id: 'gas',
        text: 'Gas',
        value: 1,
    },
];
const signList = [
    { id: 'High', text: '~75% 미만', checked: true, signvalue: '#' },
    { id: 'Low', text: '~50% 미만', checked: true, signvalue: '##' },
];
const condList = [
    {
      type: 'selectBox',
      title: '데이터구분',
      id: 'sect',
      content: [
        { value: 'time', text: '시간별' },
        { value: 'day', text: '일별' },
        { value: 'month', text: '월별' },
        { value: 'year', text: '연별' },
        { value: 'all', text: '전체기간별' },
        { value: 'timezone', text: '시간대별' },
        { value: 'week', text: '요일별' },
        { value: 'season', text: '계절별' },
        { value: 'ys', text: '년도-계절별' },
        { value: 'lys', text: '전년도-계절별' },
        { value: 'a4', text: '년도-시간대별' },
        { value: 'a5', text: '전체-월별' },
        { value: 'a7', text: '전체-일별' },
        { value: 'accmonth', text: '년도-월별누적' },
        { value: 'accseason', text: '계절관리제누적' },
        { value: 'a1', text: '계절관리제연차누적' },
        { value: 'a2', text: '년도-일별누적' },
        { value: 'a3', text: '전체-일별누적' },
        { value: 'a6', text: '계절관리제일별누적' },
      ],
    },
    {
      type: 'selectBox',
      title: '검색항목',
      id: 'poll',
      content: [{ value: 'calc', text: '성분계산' }, 
                { value: 'raw', text: 'RawData' }],
    },
    {
      type: 'selectBox',
      title: '황사구분',
      id: 'dust',
      content: [
        { value: 'include', text: '황사기간포함' },
        { value: 'except', text: '황사기간제외' },
        { value: 'only', text: '황사기간만' },
      ],
    },
];

const markList = [
    {
        title: '성분 자료 Not Null',
        id: 'unit1',
        checked: false,
    },
    {
        title: '단위표출',
        id: 'unit2',
        checked: false,
    }
]

const INTENSIVE_AUTO_SETTINGS = {
    timeCorrelation: {
        page: 'intensive/autotimecorrelation',
        chartType: 'scatter',
        initCond: {
            sect: 'time',
            poll: 'calc',
            dust: 'include',
            stats: '',
            eqType: 'SMPS_APS_O',
        },
        condList: condList,
    }
};