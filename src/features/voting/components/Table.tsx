import { type TableDataType } from "../types/TableData";
import { rankJSX } from "./RankingSvg";

export const Table = ({ tableData }: { tableData: TableDataType[] }) => {
  return (
    <div className="no-scrollbar -mb-4 -mr-7 md:mr-0 bg-bg-[#2B2A2A] overflow-x-scroll ">
      <table
        className="min-w-full max-w-full border-separate divide-gray-200 whitespace-nowrap"
        style={{ borderSpacing: "0 15px" }}
      >
        <thead>
          <tr>
            <th className="rounded-l-xl border border-r-0 border-[#4D4546] bg-[#2B2A2A] pl-6 pr-4  py-[11px] text-sm lg:text-base text-start font-medium">
              Project Name
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-4 py-[11px]  lg:text-base text-start text-sm font-medium">
              #Low
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-4 py-[11px] lg:text-base text-sm text-start font-medium">
              #Medium
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-4 py-[11px] lg:text-base text-sm text-start font-medium">
              #High
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-4 py-[11px]  lg:text-base text-sm text-start font-medium">
              #Highest
            </th>
            <th className="border-y border-[#4D4546] bg-[#2B2A2A] px-4 py-[11px]  lg:text-base  text-sm text-start font-medium">
              Total rewards get
            </th>
            <th className="rounded-r-xl border border-l-0 border-[#4D4546]  bg-[#2B2A2A] pl-4 pr-6 py-[11px] text-sm lg:text-base text-end font-medium">
              Total points
            </th>
          </tr>
        </thead>
        <tbody className="text-base">
          {tableData.map((item, index) => (
            <tr key={index}>
              <td className="flex items-center gap-4 rounded-l-xl border border-r-0 border-[#4D4546] px-4 py-[11px] text-sm lg:text-base">
                {rankJSX(index)}
                <span
                  className="max-w-[150px] truncate"
                  title={item.projectName}
                >
                  {item.projectName}
                </span>
              </td>
              <td className="border-y border-[#4D4546] px-4 py-[11px] text-sm lg:text-base">
                {item.lowImpact}
              </td>
              <td className="border-y border-[#4D4546] px-4 py-[11px] text-sm lg:text-base">
                {item.mediumImpact}
              </td>
              <td className="border-y border-[#4D4546] px-4 py-[11px] text-sm lg:text-base">
                {item.highImpact}
              </td>
              <td className="border-y border-[#4D4546] px-4 py-[11px] text-sm lg:text-base">
                {item.highestImpact}
              </td>
              <td className="border-y border-[#4D4546] px-4 py-[11px] text-sm lg:text-base">
                {item.totalRewards}
              </td>
              <td className="rounded-r-xl border border-l-0 border-[#4D4546] px-4 py-[11px] text-sm lg:text-base text-end">
                {item.totalPoints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
