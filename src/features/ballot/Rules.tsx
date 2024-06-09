import React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";

const ErrorIcon = () => {
  return (
    <span className="rounded-full bg-[#FFB3B2] p-1">
      <X color="#990021" className="h-4 w-4" />
    </span>
  );
};

const CheckIcon = () => {
  return (
    <span className="rounded-full bg-[#F2FCF6] p-1">
      <Check className="h-4 w-4" color="#079640" />
    </span>
  );
};

const Rules = ({ rulesCheck }: { rulesCheck: string[] }) => {
  const hasNoProject = rulesCheck?.includes("AT_LEAST_ONE");
  return (
    <div className="mt-5 flex flex-col rounded-xl bg-onBackground-dark p-5 text-sm font-normal">
      <div className="mb-8 flex  items-center gap-2">
        <h3 className=" text-lg font-bold text-onPrimary-light">
          Your voting check
        </h3>
        <Link
          target="_blank"
          href="https://youtu.be/UidBGNrEFhs"
          className="flex items-center rounded-lg border border-outline-dark px-2 py-1 text-sm font-medium text-outline-dark"
        >
          <span className=" mr-2 flex items-center rounded-full border border-outline-dark px-[0.375rem] text-xs font-bold text-outline-dark">
            i
          </span>
          How it works?
        </Link>
        <Link
          target="_blank"
          href="https://docs.pokt.network/community/retro-pokt-goods-funding/voting-rubric"
          className="flex items-center rounded-lg border border-outline-dark px-2 py-1 text-sm font-medium text-outline-dark"
        >
          <span className=" mr-2 flex items-center rounded-full border border-outline-dark px-[0.375rem] text-xs font-bold text-outline-dark">
            i
          </span>
          Rubric
        </Link>
      </div>

      <p
        className={`mb-3 flex items-center gap-2 ${hasNoProject ? "text-[#FFB3B2]" : "text-[#CCF2DB]"}`}
      >
        {hasNoProject ? <ErrorIcon /> : <CheckIcon />}
        Add at least one project
      </p>
      <p
        className={`mb-2 flex items-center gap-2 ${hasNoProject || rulesCheck?.length > 0 ? "text-[#FFB3B2]" : "text-[#CCF2DB]"}`}
      >
        {hasNoProject || rulesCheck?.length > 0 ? <ErrorIcon /> : <CheckIcon />}
        Your ballot should comply with the following distribution:
      </p>

      <ul className=" flex flex-col gap-2 pl-12">
        <li
          className={`flex items-center gap-1 ${hasNoProject || rulesCheck?.includes("HIGHEST_EXTRA_IMPACT") ? "text-[#FFB3B2]" : "text-[#CCF2DB]"}`}
        >
          {hasNoProject || rulesCheck?.includes("HIGHEST_EXTRA_IMPACT") ? (
            <X color="#FFDAD9" className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" color="#CCF2DB" />
          )}
          <b>Highest Impact</b>: 10% of the projects can be here.
        </li>
        <li
          className={`flex items-center gap-1 ${hasNoProject || rulesCheck?.includes("HIGH_IMPACT") ? "text-[#FFB3B2]" : "text-[#CCF2DB]"}`}
        >
          {hasNoProject || rulesCheck?.includes("HIGH_IMPACT") ? (
            <X color="#FFDAD9" className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" color="#CCF2DB" />
          )}
          <b>High Impact</b>: 20% of your projects + unused capacity of higher
          tier(s) can be used here.
        </li>
        <li
          className={`flex items-center gap-1 ${hasNoProject || rulesCheck?.includes("MEDIUM_EXTRA_IMPACT") ? "text-[#FFB3B2]" : "text-[#CCF2DB]"}`}
        >
          {hasNoProject || rulesCheck?.includes("MEDIUM_EXTRA_IMPACT") ? (
            <X color="#FFDAD9" className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" color="#CCF2DB" />
          )}
          <b>Medium Impact</b>: 30% of your projects + unused capacity of higher
          tier(s) can be used here
        </li>
        <li
          className={`flex items-center gap-1 ${hasNoProject || rulesCheck?.includes("LOW_EXTRA_IMPACT") ? "text-[#FFB3B2]" : "text-[#CCF2DB]"}`}
        >
          {hasNoProject || rulesCheck?.includes("LOW_EXTRA_IMPACT") ? (
            <X color="#FFDAD9" className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" color="#CCF2DB" />
          )}
          <b>Low Impact</b>: 40% of your projects + unused capacity of higher
          tier(s) can be used here
        </li>
      </ul>
    </div>
  );
};

export default Rules;
