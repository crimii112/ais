const Table = ({ datas }) => {
  return (
    <div className="w-full max-h-[820px] overflow-auto border-1 border-gray-300 border-t-2 border-t-gray-900">
      <table className="table-auto min-w-full text-center border-collapse">
        <thead className="bg-gray-200 border-1 border-gray-300 border-t-0 border-collapse">
          <tr>
            {datas.headNameList.map(name =>
              name === 'NO DATA' ? (
                <th key={name} className="p-2">
                  {name}
                </th>
              ) : (
                <th
                  key={name}
                  className="sticky p-2 whitespace-nowrap overflow-hidden tracking-wider border-1 border-gray-300 border-t-0"
                >
                  <span>{name.replaceAll('&lt;/br&gt;', '')}</span>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white border-collapse ">
          {datas.rstList.map((data, idx) =>
            data === 'NO DATA' ? (
              <tr key={data}>
                <td className="p-2">{data}</td>
              </tr>
            ) : (
              <tr
                key={data.groupdate + data.sido + idx}
                className="bg-white hover:bg-blue-50 transition duration-100"
              >
                {datas.headList.map((head, idx) => (
                  <td
                    key={idx}
                    className="p-2 whitespace-nowrap overflow-hidden tracking-wider border-1 border-gray-300 border-t-0"
                  >
                    {data[head] === '' ? '-' : data[head]}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
Table.displayName = 'Table';

export { Table };
