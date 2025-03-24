import { FadeLoader } from 'react-spinners';
import { FlexRowWrapper } from './common';

const Loading = () => {
  return (
    <FlexRowWrapper className="w-full py-12">
      <FadeLoader />
      <span className="text-lg font-semibold">Loading...</span>
    </FlexRowWrapper>
  );
};

export { Loading };
