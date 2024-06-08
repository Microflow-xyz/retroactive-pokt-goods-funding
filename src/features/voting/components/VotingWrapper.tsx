import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";
import { Table } from "~/features/voting/components/Table";
import { useBallots } from "~/features/ballot/hooks/useFetchAllBallots";
import { useFetchAllProjects } from "~/features/projects/hooks/useProjects";
import {
  type ImpactData,
  type TableDataType,
} from "~/features/voting/types/TableData";
import { config } from "~/config";

let participantsCount = 0;
const totalVoters = config?.voters?.length;
const endTime = config?.votingEndsAt;
const startTime = config?.reviewEndsAt;
const WpoktMultiplier = 750000;
const OPMultiplier = 60000;
const ARBMultplier = 70000;

export function VotingWrapper() {
  const [remainingTime, setRemainingTime] = useState("");
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableDataType[]>([]);
  const ballots = useBallots({
    refetchInterval: 10 * 60 * 1000,
  });

  const projects = useFetchAllProjects({
    refetchInterval: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!ballots.isLoading && !projects.isLoading) {
      const ProjectsIds = projects.data;
      const impactData = ballots.data as ImpactData[];
      participantsCount = impactData.length;
      const table: TableDataType[] =
        ProjectsIds?.map((application) => {
          let lowImpact = 0,
            mediumImpact = 0,
            highImpact = 0,
            highestImpact = 0;

          impactData?.forEach((impact) => {
            if (impact?.lowImpactProjects) {
              lowImpact += impact.lowImpactProjects.filter(
                (project) => project.id === application.id,
              ).length;
            }
            if (impact.mediumImpactProjects) {
              mediumImpact += impact.mediumImpactProjects.filter(
                (project) => project.id === application.id,
              ).length;
            }
            if (impact.highImpactProjects) {
              highImpact += impact.highImpactProjects.filter(
                (project) => project.id === application.id,
              ).length;
            }
            if (impact.highestImpactProjects) {
              highestImpact += impact.highestImpactProjects.filter(
                (project) => project.id === application.id,
              ).length;
            }
          });

          return {
            projectName: application.name,
            lowImpact,
            mediumImpact,
            highImpact,
            highestImpact,
          };
        }) ?? [];
      let totalPointsCombined = 0;
      for (const row of table) {
        row.totalPoints =
          row.lowImpact +
          row.mediumImpact * 3 +
          row.highImpact * 5 +
          row.highestImpact * 10;
        totalPointsCombined += row.totalPoints;
      }
      for (const row of table) {
        if (row.totalPoints) {
          row.totalRewards = `${((row.totalPoints / totalPointsCombined) * WpoktMultiplier).toFixed(0)} WPOKT - ${((row.totalPoints / totalPointsCombined) * OPMultiplier).toFixed(0)} OP - ${((row.totalPoints / totalPointsCombined) * ARBMultplier).toFixed(0)} ARB`;
        } else {
          row.totalRewards = "0 WPOKT - 0 OP - 0 ARB";
        }
      }
      table.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));
      setTableData(table);
    }
  }, [ballots.data, ballots.isLoading, projects.data, projects.isLoading]);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (new Date().getTime() > endTime.getTime()) {
        setHasEnded(true);
        clearInterval(intervalId);
        return setRemainingTime("Ended");
      } else {
        setHasEnded(false);
      }
      if (new Date().getTime() < startTime.getTime()) {
        setHasStarted(false);
      } else {
        setHasStarted(true);
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

  const participantsCountCalculator = () => {
    if (participantsCount / Number(totalVoters) >= 1) {
     return `100%`
    } else {
     return `${(participantsCount / Number(totalVoters)) * 100}%`
    }
 }

  return (
    <div className="mt-20 flex flex-col gap-5 px-5 font-kumbhSans text-[#E6E1E1] md:px-20 2xl:px-0">
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex w-full flex-col gap-3 rounded-xl border border-[#7E7576] bg-[#1C1B1B] p-5">
          <div className="text-base font-bold leading-5 lg:text-lg">
            Voters Participated
          </div>
          <div className="flex items-center justify-between gap-10">
            <div className="h-1 w-full bg-[#2B2A2A]">
              <div
                className="h-1 bg-[#B5C4FF] transition-all"
                style={{
                  width: participantsCountCalculator(),
                }}
              />
            </div>
            <div className="flex w-[90px] min-w-[90px] flex-wrap items-center justify-end gap-1 lg:w-auto lg:min-w-fit lg:flex-nowrap">
              <p className="text-base font-bold leading-5 lg:text-lg">
                {((participantsCount / Number(totalVoters)) * 100).toFixed(2)}%
              </p>
              <p className="text-sm leading-4">
                ({participantsCount}/{Number(totalVoters)})
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 rounded-xl border border-[#7E7576] bg-[#1C1B1B] p-5">
          {!hasStarted ? (
            <div className="text-base font-bold leading-5 lg:text-lg">
              Voting process has not started yet
            </div>
          ) : (
            <>
              <div className="text-base font-bold leading-5 lg:text-lg">
                Remained time
              </div>
              <div className="flex items-center justify-between gap-10">
                <div className="h-1 w-full bg-[#2B2A2A]">
                  <div
                    className="h-1 bg-[#B5C4FF] transition-all"
                    style={{
                      width: `${remainderProgressCalculator() * 100}%`,
                    }}
                  />
                </div>
                <div className="flex w-[90px] min-w-[90px] flex-wrap justify-end gap-1 text-end lg:w-auto lg:min-w-fit lg:flex-nowrap lg:items-center ">
                  <p className="text-base font-bold leading-5 lg:text-lg">
                    {remainingTime}
                  </p>
                  {!hasEnded ? (
                    <p className="text-sm leading-4">Remained</p>
                  ) : null}
                </div>
              </div>{" "}
            </>
          )}
        </div>
      </div>
      <p className="-mb-4 text-sm text-[#D0C4C5]">
        These are the latest statistics based on current voting results. The
        chart will be updated 10 minutes.
      </p>
      {tableData.length ? (
        <Table tableData={tableData} />
      ) : (
        <div className="mt-8 flex w-full flex-col gap-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="h-14 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-surfaceContainerLow-dark"></div>
          ))}
        </div>
      )}
      <p className="text-sm text-[#D0C4C5]">
        These are the latest statistics based on current voting results. The
        chart will be updated 10 minutes.
      </p>
    </div>
  );
}
