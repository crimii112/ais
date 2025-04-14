import { useEffect, useRef, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

// 텍스트 길이 측정 함수
const measureTextWidth = (text, font = '14px Pretendard GOV') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  return ctx.measureText(text).width;
};

// 열 너비 자동 계산 함수
const calculateColumnWidths = (
  data,
  headList,
  headNameList,
  sampleSize = 10000
) => {
  const font = '14px Pretendard GOV';
  const result = {};

  headList.forEach((key, idx) => {
    const headerText = headNameList[idx]?.replaceAll('&lt;/br&gt;', '') ?? key;
    let maxWidth = measureTextWidth(headerText, font);

    for (let i = 0; i < Math.min(sampleSize, data.length); i++) {
      const value = String(data[i][key] ?? '-');
      const width = measureTextWidth(value, font);
      if (width > maxWidth) maxWidth = width;
    }

    result[key] = Math.ceil(maxWidth + 32);
  });

  return result;
};

// Table 컴포넌트
const Table = ({ datas }) => {
  const parentRef = useRef();
  const [columns, setColumns] = useState([]);

  // 컬럼 정의
  const columnHelper = createColumnHelper();
  useEffect(() => {
    if (!datas?.headList?.length || !datas?.rstList?.length) return;

    const columnWidths = calculateColumnWidths(
      datas.rstList,
      datas.headList,
      datas.headNameList
    );

    const newColumns = datas.headList.map((key, idx) =>
      columnHelper.accessor(row => row[key], {
        id: key,
        size: columnWidths[key],
        header: () => datas.headNameList[idx]?.replaceAll('&lt;/br&gt;', ''),
        cell: info =>
          info.getValue() === '' || info.getValue() === undefined
            ? '-'
            : info.getValue(),
      })
    );

    setColumns(newColumns);
  }, [datas]);

  // 테이블 세팅
  const table = useReactTable({
    data: datas.rstList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 가상화 세팅
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div
      className="w-full max-h-[820px] overflow-auto border-1 border-gray-300 border-t-2 border-t-gray-900"
      ref={parentRef}
    >
      <table className="w-full table-fixed text-center border-collapse">
        <thead className="sticky top-0 bg-gray-200 z-10">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`p-2 whitespace-nowrap border-1 border-gray-300 border-t-0`}
                  style={{
                    width: `${header.getSize()}px`,
                    minWidth: `${header.getSize()}px`,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            display: 'block',
            height: `${totalSize}px`,
            position: 'relative',
          }}
        >
          {virtualRows.map(virtualRow => {
            const row = table.getRowModel().rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'flex',
                  width: '100%',
                }}
                className="hover:bg-blue-50 border-b border-gray-100"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="p-2 whitespace-nowrap border-1 border-gray-200"
                    style={{
                      width: `${cell.column.getSize()}px`,
                      textAlign: 'center',
                      flex: `0 0 ${cell.column.getSize()}px`,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export { Table };
