import { useEffect, useState } from 'react';

import { SearchCondFrame } from './search-cond-frame';
import { FlexRowWrapper, GridWrapper } from '@/components/ui/common';

const SearchPollutant = ({
  pollutantList,
  signList,
  initialPollutant,
  setPollutant,
}) => {
  const [pollutantJson, setPollutantJson] = useState(initialPollutant);

  useEffect(() => {
    setPollutant(pollutantJson);
  }, [pollutantJson]);

  const handleChangeChecked = e => {
    const pollId = e.target.id;
    const pollChecked = e.target.checked;

    const findIdx = pollutantJson.findIndex(poll => {
      return poll['id'] === pollId;
    });
    pollutantJson[findIdx]['checked'] = pollChecked;

    setPollutantJson(pollutantJson);
  };

  const handleChangeInputValue = e => {
    const pollValueCategory = e.target.id.substring(0, 5);
    const pollId = e.target.id.substring(5);
    const pollValue = e.target.value;

    const findIdx = pollutantJson.findIndex(poll => {
      return poll['id'] === pollId;
    });

    if (pollValueCategory === 'sign1') {
      if (e.target.type === 'number')
        pollutantJson[findIdx]['signvalue'] = Number(pollValue);
      else if (e.target.type === 'text')
        pollutantJson[findIdx]['signvalue'] = pollValue;
    } else if (pollValueCategory === 'sign2')
      pollutantJson[findIdx]['signvalue2'] = Number(pollValue);

    setPollutantJson(pollutantJson);
  };

  return (
    <SearchCondFrame title="물질 및 소수점 자릿수">
      <GridWrapper className="grid-cols-4 gap-1">
        {pollutantList &&
          pollutantList.map(poll => (
            <FlexRowWrapper className="justify-between gap-0.5" key={poll.id}>
              <FlexRowWrapper className="justify-between gap-0.5">
                <label>
                  <input
                    type="checkbox"
                    id={poll.id}
                    defaultChecked={poll.checked}
                    onChange={handleChangeChecked}
                    className="mx-2 border-1 border-gray-300 rounded-sm"
                  />
                  {poll.text}
                </label>
              </FlexRowWrapper>
              <FlexRowWrapper className="justify-between gap-0.5">
                <input
                  type="number"
                  id={'sign1' + poll.id}
                  defaultValue={poll.signvalue}
                  onChange={handleChangeInputValue}
                  className="w-10 p-1.5 border-1 border-gray-300 rounded-sm bg-white"
                />
                <input
                  type="number"
                  id={'sign2' + poll.id}
                  defaultValue={poll.signvalue2}
                  onChange={handleChangeInputValue}
                  className="w-10 p-1.5 border-1 border-gray-300 rounded-sm bg-white"
                />
              </FlexRowWrapper>
            </FlexRowWrapper>
          ))}
      </GridWrapper>
      <GridWrapper className="items-stretch gap-1">
        {signList &&
          signList.map(sign => (
            <FlexRowWrapper className="justify-between gap-0.5" key={sign.id}>
              <div>
                <label>
                  <input
                    type="checkbox"
                    defaultChecked={sign.checked}
                    className="mx-2 border-1 border-gray-300 rounded-sm"
                  />
                  {sign.text}
                </label>
              </div>
              <div>
                <input
                  type="text"
                  id={'sign1' + sign.id}
                  defaultValue={sign.signvalue}
                  onChange={handleChangeInputValue}
                  className="w-auto p-1.5 border-1 border-gray-300 rounded-sm text-sm bg-white"
                />
              </div>
            </FlexRowWrapper>
          ))}
      </GridWrapper>
    </SearchCondFrame>
  );
};

export { SearchPollutant };
