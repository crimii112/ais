// import React from 'react';
// import { FixedSizeList as List } from 'react-window';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

// const Table = ({ datas }) => {
//   const rowHeight = 40; // 각 row 높이
//   const rowCount = datas.rstList.length;

//   const Row = ({ index, style }) => {
//     const data = datas.rstList[index];

//     if (data === 'NO DATA') {
//       return (
//         <div
//           style={style}
//           className="flex items-center justify-center h-10 text-gray-500 border-b border-gray-300"
//         >
//           NO DATA
//         </div>
//       );
//     }

//     return (
//       <div
//         style={style}
//         key={data.groupdate + data.sido + index}
//         className="flex bg-white hover:bg-blue-50 transition duration-100 border-b border-gray-200"
//       >
//         {datas.headList.map((head, idx) => (
//           <div
//             key={idx}
//             className="flex-1 min-w-fit p-2 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-100 text-center"
//           >
//             {data[head] === '' || data[head] === undefined ? '-' : data[head]}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="w-full max-h-[820px] border border-gray-300">
//       {/* Header */}
//       <div className="flex bg-gray-200 sticky top-0 z-10 text-center font-semibold border-b border-gray-300">
//         {datas.headNameList.map((name, idx) =>
//           name === 'NO DATA' ? (
//             <div
//               key={name}
//               className="flex items-center justify-center h-10 text-gray-500 border-b border-gray-300"
//             >
//               {name}
//             </div>
//           ) : (
//             <div
//               key={name}
//               className="flex-1 min-w-fit p-2 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-300"
//             >
//               {name.replaceAll('&lt;/br&gt;', '')}
//             </div>
//           )
//         )}
//       </div>

//       {/* Body (virtualized rows) */}
//       <List height={780} itemCount={rowCount} itemSize={rowHeight} width="100%">
//         {Row}
//       </List>
//     </div>
//   );
// };
// Table.displayName = 'Table';

const Table = ({ datas }) => {
  const parentRef = useRef();

  // 📌 1. 컬럼 정의
  const columnHelper = createColumnHelper();

  const columns = datas.headList.map((key, idx) =>
    columnHelper.accessor(row => row[key], {
      id: key,
      header: () => datas.headNameList[idx]?.replaceAll('&lt;/br&gt;', ''),
      cell: info => info.getValue() ?? '-',
    })
  );

  // 📌 2. 테이블 세팅
  const table = useReactTable({
    data: datas.rstList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 📌 3. 가상화 세팅
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
      <table className="min-w-full table-auto text-center border-collapse">
        <thead className="sticky bg-gray-200 z-10">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="p-2 whitespace-nowrap overflow-hidden tracking-wider border-1 border-gray-300 border-t-0"
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
        <tbody style={{ height: `${totalSize}px`, position: 'relative' }}>
          {virtualRows.map(virtualRow => {
            const row = table.getRowModel().rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'table',
                  width: '100%',
                  tableLayout: 'fixed',
                }}
                className="hover:bg-blue-50 border-b border-gray-100"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="p-2 min-w-fit whitespace-nowrap border-r border-gray-200 text-ellipsis overflow-hidden"
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
