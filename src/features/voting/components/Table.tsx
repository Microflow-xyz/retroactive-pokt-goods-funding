import { type TableDataType } from "../types/TableData";
import { rankJSX } from "./RankingSvg";

export const Table = ({ tableData }: { tableData: TableDataType[] }) => {
  return (
    <div className="no-scrollbar -mb-4 -mr-5 overflow-x-scroll md:-mr-20 2xl:mr-0">
      <table
        className="min-w-full max-w-full border-separate divide-gray-200 whitespace-nowrap"
        style={{ borderSpacing: "0 15px" }}
      >
        <thead>
          <tr>
            <th className="rounded-l-xl border border-r-0 border-[#4D4546] bg-[#2B2A2A] px-6 py-[11px] text-start font-medium">
              Project Name
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-6 py-[11px] text-start font-medium">
              #Low
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-6 py-[11px] text-start font-medium">
              #Medium
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-6 py-[11px] text-start font-medium">
              #High
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-6 py-[11px] text-start font-medium">
              #Highest
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-6 py-[11px] text-start font-medium">
              Total rewards get
            </th>
            <th className="rounded-r-xl border border-l-0 border-[#4D4546] bg-[#2B2A2A] px-6 py-[11px] text-end font-medium">
              Total points
            </th>
          </tr>
        </thead>
        <tbody className="text-base">
          {tableData.map((item, index) => (
            <tr key={index}>
              <td className="flex items-center gap-4 rounded-l-xl border border-r-0 border-[#4D4546] px-6 py-[11px]">
                {rankJSX(index)}
                <span
                  className="max-w-[150px] truncate"
                  title={item.projectName}
                >
                  {item.projectName}
                </span>
              </td>
              <td className="border-y border-[#4D4546] px-6 py-[11px]">
                {item.lowImpact}
              </td>
              <td className="border-y border-[#4D4546] px-6 py-[11px]">
                {item.mediumImpact}
              </td>
              <td className="border-y border-[#4D4546] px-6 py-[11px]">
                {item.highImpact}
              </td>
              <td className="border-y border-[#4D4546] px-6 py-[11px]">
                {item.highestImpact}
              </td>
              <td className="border-y border-[#4D4546] px-6 py-[11px]">
                {item.totalRewards}
              </td>
              <td className="rounded-r-xl border border-l-0 border-[#4D4546] px-6 py-[11px] text-end">
                {item.totalPoints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
