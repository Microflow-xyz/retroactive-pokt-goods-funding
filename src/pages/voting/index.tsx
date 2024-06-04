import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";
import { Layout } from "~/layouts/DefaultLayout";

const totalVoters = 600;
const participantsCount = 477;
const endTime = new Date("2024-06-15T12:56:00");
const startTime = new Date("2024-06-01T12:00:00");

export default function Voting() {
  const [remainingTime, setRemainingTime] = useState("");
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (new Date().getTime() > endTime.getTime()) {
        setHasEnded(true);
        clearInterval(intervalId);
        return setRemainingTime("Ended");
      } else {
        setHasEnded(false);
      }
      const now = new Date();
      const duration = intervalToDuration({ start: now, end: endTime });
      let timeString = "";
      if (duration.days) timeString += `${duration.days}D:`;
      if (duration.hours) timeString += `${duration.hours}H:`;
      if (duration.minutes) timeString += `${duration.minutes}M`;
      else timeString += "00M";
      setRemainingTime(timeString);
    };
    const intervalId = setInterval(updateRemainingTime, 60000);
    updateRemainingTime();

    return () => clearInterval(intervalId);
  }, [endTime, hasEnded]);

  const remainderProgressCalculator = () => {
    if (hasEnded) return 1;
    const timePassed: number = new Date().getTime() - startTime.getTime();
    const fullTime: number = endTime.getTime() - startTime.getTime();
    return timePassed / fullTime;
  };

  const tableData = [
    {
      projectName: "Microflow",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 4500,
    },
    {
      projectName: "Patterns",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 4300,
    },
    {
      projectName: "GitCoin",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 4250,
    },
    {
      projectName: "Optimisim",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 4100,
    },
    {
      projectName: "Arbitrum",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 3900,
    },
    {
      projectName: "Grow",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 3800,
    },
    {
      projectName: "Misseri",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 3550,
    },
    {
      projectName: "Cosmos",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 3200,
    },
    {
      projectName: "POKTnews",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 3000,
    },
    {
      projectName: "Decentralized",
      lowImpact: 20,
      mediumImpact: 8,
      highImpact: 9,
      highestImpact: 12,
      totalRewards: "12 Wpokt - 100 OP - 10 ARB",
      totalPoints: 2500,
    },
  ];

  const rankJSX = (index: number) => {
    const rank = index + 1;
    if (rank <= 3) {
      const rankSVG = [
        <>
          <path
            d="M27.0181 27.0151C21.4805 32.5505 12.517 32.5505 6.97932 27.0151C4.14296 24.1799 2.75547 20.4305 2.83529 16.7116C2.89667 13.1768 4.28417 9.67273 6.97932 6.98483C12.517 1.4495 21.4805 1.4495 27.0181 6.98483C29.707 9.67273 31.1008 13.1829 31.1621 16.7116C31.2419 20.4365 29.8544 24.1799 27.0181 27.0151Z"
            fill="#FFC006"
          />
          <path
            d="M17.002 26.7996C22.4203 26.7996 26.8127 22.4091 26.8127 16.9931C26.8127 11.5771 22.4203 7.18658 17.002 7.18658C11.5838 7.18658 7.19141 11.5771 7.19141 16.9931C7.19141 22.4091 11.5838 26.7996 17.002 26.7996Z"
            fill="#FFE04A"
          />
          <path
            opacity="0.3"
            d="M27.0152 27.0155C21.4776 32.5509 12.5142 32.5509 6.97656 27.0155L27.0152 6.98528C29.7044 9.67317 31.0979 13.1834 31.1593 16.712C31.2392 20.437 29.8517 24.1804 27.0152 27.0155Z"
            fill="#FFF5CC"
          />
          <path
            d="M19.4575 10.801C19.4451 10.7519 19.4267 10.7028 19.4144 10.6537C19.396 10.5985 19.3838 10.5371 19.3591 10.4819C19.3346 10.4267 19.3039 10.3776 19.2733 10.3223C19.2486 10.2794 19.2302 10.2303 19.1996 10.1935C19.0768 10.0094 18.9171 9.84982 18.733 9.72709C18.6901 9.6964 18.647 9.67799 18.6041 9.65345C18.5488 9.62277 18.4997 9.59208 18.4444 9.56753C18.3892 9.54298 18.3278 9.53071 18.2726 9.51229C18.2234 9.50003 18.1805 9.48161 18.1313 9.46934C17.9103 9.42639 17.6893 9.42639 17.4683 9.46934C17.4192 9.48161 17.37 9.50003 17.321 9.51229C17.2657 9.53071 17.2043 9.54298 17.149 9.56753C17.0938 9.59208 17.0385 9.62277 16.9893 9.65345C16.9464 9.67799 16.9035 9.6964 16.8604 9.72709C16.7683 9.78846 16.6825 9.8621 16.6026 9.93574L13.6926 12.8445C13.0296 13.5073 13.0296 14.5751 13.6926 15.2317C14.3556 15.8946 15.4239 15.8946 16.0808 15.2317L16.1053 15.2072V22.8535C16.1053 23.7864 16.8604 24.5412 17.7936 24.5412C18.7269 24.5412 19.482 23.7864 19.482 22.8535V11.1263C19.482 11.0158 19.4696 10.9053 19.4512 10.7949L19.4575 10.801Z"
            fill="#FF9E03"
          />
        </>,
        <>
          <path
            d="M27.0181 27.0151C21.4805 32.5505 12.517 32.5505 6.97932 27.0151C4.14296 24.18 2.75547 20.4305 2.83529 16.7116C2.89667 13.1768 4.28417 9.67274 6.97932 6.98484C12.517 1.44951 21.4805 1.44951 27.0181 6.98484C29.707 9.67274 31.1008 13.183 31.1621 16.7116C31.2419 20.4366 29.8544 24.18 27.0181 27.0151Z"
            fill="#7FBFE2"
          />
          <path
            d="M17.002 26.8059C22.4203 26.8059 26.8127 22.4153 26.8127 16.9993C26.8127 11.5833 22.4203 7.19279 17.002 7.19279C11.5838 7.19279 7.19141 11.5833 7.19141 16.9993C7.19141 22.4153 11.5838 26.8059 17.002 26.8059Z"
            fill="#B9DFF9"
          />
          <path
            opacity="0.3"
            d="M27.0192 27.0156C21.4815 32.5509 12.5181 32.5509 6.98047 27.0156L27.0192 6.98529C29.7082 9.67317 31.1018 13.1834 31.1633 16.712C31.243 20.437 29.8555 24.1804 27.0192 27.0156Z"
            fill="#D4F2FF"
          />
          <path
            d="M19.7633 21.0562H16.6384C16.6936 20.418 16.9883 19.8411 18.1179 18.6445C20.1561 16.4906 20.9482 14.9195 20.9482 13.0478C20.9482 10.501 19.5729 9.03436 17.1725 9.03436C14.7719 9.03436 13.3968 10.4949 13.3968 13.0478V13.4037C13.3968 14.2505 14.0844 14.9318 14.9255 14.9318H15.0052C15.8526 14.9318 16.534 14.2444 16.534 13.4037V12.9128C16.534 12.0966 16.8531 12.0966 17.1111 12.0966C17.4058 12.0966 17.6881 12.0966 17.6881 13.1276C17.6881 14.1585 17.375 15.0668 15.7113 16.828C13.98 18.6445 13.3906 19.97 13.3906 22.0688V22.5781C13.3906 23.425 14.0782 24.1061 14.9193 24.1061H19.7633C20.6104 24.1061 21.292 23.4189 21.292 22.5781C21.292 21.7375 20.6043 21.0501 19.7633 21.0501V21.0562Z"
            fill="#6093BA"
          />
        </>,
        <>
          <path
            d="M27.0181 27.0151C21.4805 32.5505 12.517 32.5505 6.97932 27.0151C4.14296 24.18 2.75547 20.4305 2.83529 16.7116C2.89667 13.1768 4.28417 9.67274 6.97932 6.98484C12.517 1.44951 21.4805 1.44951 27.0181 6.98484C29.707 9.67274 31.1008 13.183 31.1621 16.7116C31.2419 20.4366 29.8544 24.18 27.0181 27.0151Z"
            fill="#D18D52"
          />
          <path
            d="M17.006 26.8056C22.4242 26.8056 26.8165 22.4151 26.8165 16.9991C26.8165 11.5831 22.4242 7.19263 17.006 7.19263C11.5877 7.19263 7.19531 11.5831 7.19531 16.9991C7.19531 22.4151 11.5877 26.8056 17.006 26.8056Z"
            fill="#F5B680"
          />
          <path
            opacity="0.3"
            d="M27.0192 27.0156C21.4815 32.5509 12.5181 32.5509 6.98047 27.0156L27.0192 6.98529C29.7082 9.67317 31.1018 13.1834 31.1633 16.712C31.243 20.437 29.8555 24.1804 27.0192 27.0156Z"
            fill="#FFE1CA"
          />
          <path
            d="M19.3686 16.6125C20.0502 16.0357 20.3817 15.1274 20.3817 13.8633V13.3785C20.3817 10.9054 19.0495 9.48779 16.7226 9.48779C14.3959 9.48779 13.0636 10.8133 13.0636 12.863V13.1085C13.0636 13.9615 13.7574 14.655 14.6108 14.655C15.4642 14.655 16.1579 13.9615 16.1579 13.1085V12.728C16.2008 12.6543 16.3666 12.5009 16.6489 12.5009C16.8332 12.5009 17.1769 12.5009 17.1769 13.3232V14.3113C17.1769 15.0661 17.0174 15.2011 16.9682 15.2072H16.6244C15.7957 15.2072 15.1203 15.8822 15.1203 16.7107C15.1203 17.5392 15.7957 18.2142 16.6244 18.2142H16.9069C16.9806 18.2142 17.2322 18.4966 17.2322 19.4048V20.5094C17.2322 21.5036 16.9559 21.5036 16.6613 21.5036C16.4095 21.5036 16.0903 21.5036 16.0903 20.6996V20.5033C16.0903 19.6503 15.3966 18.9568 14.5432 18.9568C13.6898 18.9568 12.9961 19.6503 12.9961 20.5033V20.6014C12.9961 23.0868 14.3529 24.5106 16.7104 24.5106C19.0679 24.5106 20.4246 23.0929 20.4246 20.6199V19.417C20.4246 18.1406 20.0624 17.1955 19.3502 16.6064L19.3686 16.6125Z"
            fill="#C66E04"
          />
        </>,
      ];

      return (
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {rankSVG[index]}
        </svg>
      );
    }
    return (
      <span className="flex h-[34px] w-[34px] flex-col items-center justify-center rounded-full bg-[#00287C]">
        {index + 1}
      </span>
    );
  };

  return (
    <Layout isFullWidth>
      <div className="mt-20 flex flex-col gap-5 px-5 md:px-20 font-kumbhSans text-[#E6E1E1]">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex w-full flex-col gap-3 rounded-xl border border-[#7E7576] bg-[#1C1B1B] p-5">
            <div className="text-base lg:text-lg leading-5 font-bold">Voters Participated</div>
            <div className="flex items-center gap-10 justify-between">
              <div className="h-1 w-full bg-[#2B2A2A]">
                <div
                  className="h-1 bg-[#B5C4FF] transition-all"
                  style={{
                    width: `${(participantsCount / totalVoters) * 100}%`,
                  }}
                />
              </div>
              <div className="flex items-center gap-1 justify-end w-[90px] min-w-[90px] lg:min-w-fit lg:w-auto flex-wrap lg:flex-nowrap">
                <p className="text-base lg:text-lg leading-5 font-bold">
                  {((participantsCount / totalVoters) * 100).toFixed(2)}%
                </p>
                <p className="text-sm leading-4">
                  ({participantsCount}/{totalVoters})
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-xl border border-[#7E7576] bg-[#1C1B1B] p-5">
            <div className="text-base lg:text-lg leading-5 font-bold">Remained time</div>
            <div className="flex items-center gap-10 justify-between">
              <div className="h-1 w-full bg-[#2B2A2A]">
                <div
                  className="h-1 bg-[#B5C4FF] transition-all"
                  style={{
                    width: `${remainderProgressCalculator() * 100}%`,
                  }}
                />
              </div>
              <div className="flex gap-1 justify-end w-[90px] min-w-[90px] lg:min-w-fit lg:w-auto flex-wrap text-end lg:flex-nowrap lg:items-center ">
                <p className="text-base lg:text-lg leading-5 font-bold">{remainingTime}</p>
                {!hasEnded ? <p className="text-sm leading-4">Remained</p> : null}
              </div>
            </div>
          </div>
        </div>

        <p className="-mb-4 text-sm text-[#D0C4C5]">
          These are the latest statistics based on current voting results. The
          chart will be updated every minute.
        </p>

        <div className="overflow-x-scroll no-scrollbar -mb-4 -mr-5 md:-mr-20 2xl:mr-0">
          <table
            className="min-w-full max-w-full border-separate divide-gray-200 whitespace-nowrap"
            style={{ borderSpacing: "0 15px" }}
          >
            <thead>
              <tr>
                <th className="rounded-l-xl border border-r-0 border-[#4D4546] font-medium bg-[#2B2A2A] px-6 py-[11px] text-start">
                  Project Name
                </th>
                <th className="border-y border-[#4D4546] font-medium bg-[#2B2A2A] px-6 py-[11px] text-start">
                  #Low impact
                </th>
                <th className="border-y border-[#4D4546] font-medium bg-[#2B2A2A] px-6 py-[11px] text-start">
                  #Medium impact
                </th>
                <th className="border-y border-[#4D4546] font-medium bg-[#2B2A2A] px-6 py-[11px] text-start">
                  #High impact
                </th>
                <th className="border-y border-[#4D4546] font-medium bg-[#2B2A2A] px-6 py-[11px] text-start">
                  #Highest impact
                </th>
                <th className="border-y border-[#4D4546] font-medium bg-[#2B2A2A] px-6 py-[11px] text-start">
                  Total rewards get
                </th>
                <th className="rounded-r-xl border border-l-0 border-[#4D4546] font-medium bg-[#2B2A2A] px-6 py-[11px] text-end">
                  Total points
                </th>
              </tr>
            </thead>
            <tbody className="text-base">
              {tableData.map((item, index) => (
                <tr key={index}>
                  <td className="flex items-center gap-4 rounded-l-xl border border-r-0 border-[#4D4546] px-6 py-[11px]">
                    {rankJSX(index)}
                    <span>{item.projectName}</span>
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
          <p className="text-sm text-[#D0C4C5]">
            These are the latest statistics based on current voting results. The
            chart will be updated every minute.
          </p>
      </div>
    </Layout>
  );
}
