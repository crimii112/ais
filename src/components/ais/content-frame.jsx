import copy from 'copy-to-clipboard';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/common';
import { Table } from '@/components/ui/table';

const ContentFrame = ({ datas, fileName }) => {
  // 클립보드 복사(react-copy-to-clipboard 라이브러리 사용)
  const handleClickCopyToClipboard = () => {
    if (datas === undefined) {
      alert('조회된 데이터가 없습니다.');
      return;
    }
    if (datas.headList[0] === 'NO DATA') {
      alert('조회된 데이터가 없습니다.');
      return;
    }

    let text = '';

    const headNameList = datas.headNameList
      .join('\t')
      .replaceAll('&lt;/br&gt;', '');
    text += headNameList + '\n';

    datas.rstList.forEach(arr => {
      datas.headList.map(headName => (text += arr[headName] + '\t'));
      text += '\n';
    });

    copy(text);

    alert('데이터가 복사되었습니다.');
  };

  // 엑셀로 저장(xlsx 라이브러리 사용)
  const handleClickExportToExcel = () => {
    if (datas === undefined) {
      alert('조회된 데이터가 없습니다.');
      return;
    }
    if (datas.headList[0] === 'NO DATA') {
      alert('조회된 데이터가 없습니다.');
      return;
    }

    const headNameList = [...datas.headNameList].map(name =>
      name.replace('&lt;/br&gt;', '')
    );
    const rstList = [
      ...datas.rstList.map(arr => [
        ...datas.headList.map(headName => arr[headName]),
      ]),
    ];
    const sheet = [headNameList, ...rstList];
    const ws = XLSX.utils.aoa_to_sheet(sheet);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, fileName + '.xlsx');
  };

  return (
    <FrameWrapper>
      <ButtonWrapper>
        <Button
          className="w-fit bg-blue-900 text-white"
          onClick={handleClickCopyToClipboard}
        >
          클립보드 복사
        </Button>
        <Button
          className="w-fit bg-blue-900 text-white"
          onClick={handleClickExportToExcel}
        >
          데이터 저장
        </Button>
      </ButtonWrapper>
      {datas && <Table datas={datas} />}
    </FrameWrapper>
  );
};

export { ContentFrame };

const FrameWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={`${cn(
        'flex flex-col w-full p-6 border-2 border-gray-300',
        className
      )}`}
      {...props}
    >
      {children}
    </div>
  );
};
FrameWrapper.displayName = 'FrameWrapper';

const ButtonWrapper = ({ className, children, ...props }) => {
  return (
    <div
      className={`${cn('flex flex-row gap-1.5 mb-1.5', className)}`}
      {...props}
    >
      {children}
    </div>
  );
};
ButtonWrapper.displayName = 'ButtonWrapper';
