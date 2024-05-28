import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { dynamicLabel, gen } from "./helpers";
import { type ballotImpacts } from "../types";
import { type Attestation } from "~/utils/fetchAttestations";
import { X } from "lucide-react";

const DropTargetAccordion = ({
  label,
  shelveName,
  droppedItems,
  setDroppedItems,
}: {
  label: string;
  droppedItems: ballotImpacts;
  setDroppedItems: React.Dispatch<React.SetStateAction<ballotImpacts>>;
  shelveName:
    | "lowImpactProjects"
    | "mediumImpactProjects"
    | "highImpactProjects"
    | "highestImpactProjects";
}) => {
  const [suggestCount, setSuggestCount] = useState({
    highestImpactProjects: 0,
    highImpactProjects: 0,
    mediumImpactProjects: 0,
    lowImpactProjects: 0,
  });
  const [{ isOver }, drop] = useDrop(() => {
    return {
      accept: "ITEM",
      drop: (item: { name: string }) => {
        setDroppedItems((prevDroppedItems) => ({
          ...prevDroppedItems,
          [shelveName]: [...(prevDroppedItems[shelveName] || []), item.name],
        }));
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    };
  });

  useEffect(() => {
    const result = gen({
      highest: droppedItems.highestImpactProjects.length,
      high: droppedItems.highImpactProjects.length,
      mid: droppedItems.mediumImpactProjects.length,
      low: droppedItems.lowImpactProjects.length,
    });
    if (result)
      setSuggestCount({
        highestImpactProjects: result?.highest,
        highImpactProjects: result?.high,
        mediumImpactProjects: result?.mid,
        lowImpactProjects: result?.low,
      });
  }, [droppedItems]);
  const renderEmptyBoxes = (count: number) => {
    const boxes: JSX.Element[] = [];
    if (count === 0 && droppedItems[shelveName].length === 0) {
      boxes.push(
        <li
          className={`rounded-lg border border-dashed border-primaryFixedDim-dark px-[0.75rem]  py-[0.375rem] text-sm font-medium text-primaryFixedDim-dark`}
        >
          Drag & drop here
        </li>,
      );
    } else
      for (let i = 0; i < count; i++) {
        boxes.push(
          <li
            className={`rounded-lg border border-onError-dark bg-[#2C0004] px-8 py-4 text-sm font-medium`}
            key={i}
          />,
        );
      }

    return boxes;
  };

  const dynamicLabelObj = dynamicLabel(
    {
      highest: droppedItems.highestImpactProjects.length,
      high: droppedItems.highImpactProjects.length,
      mid: droppedItems.mediumImpactProjects.length,
      low: droppedItems.lowImpactProjects.length,
    },
    {
      highest: suggestCount.highestImpactProjects,
      high: suggestCount.highImpactProjects,
      mid: suggestCount.mediumImpactProjects,
      low: suggestCount.lowImpactProjects,
    },
  )[shelveName];
  return (
    <div className="p-5 pb-3" ref={drop}>
      <div className=" flex cursor-pointer items-center gap-2">
        {label}
        <span
          className={`rounded-lg px-2 py-[2px] text-xs font-medium ${dynamicLabelObj.type === "error" ? " bg-[#FEDAD9] text-[#8E1F0B]" : " bg-inverseSurface-light text-onPrimary-light"}`}
        >
          {dynamicLabelObj.text}
        </span>
      </div>
      <div className="flex">
        <ul className="mt-3 flex flex-wrap gap-2">
          {droppedItems[shelveName]?.map((item: string, index: number) => (
            <li
              className={`flex items-center justify-between gap-1 rounded-lg border border-onPrimary-light px-3 py-2 text-sm font-medium`}
              key={index}
            >
              <button
                onClick={() => {
                  setDroppedItems({
                    ...droppedItems,
                    [shelveName]: [
                      ...droppedItems[shelveName].filter(
                        (project) => item !== project,
                      ),
                    ],
                  });
                }}
              >
                <X color="#ffffff" className="h-4 w-4" />
              </button>

              {item}
            </li>
          ))}
          {renderEmptyBoxes(suggestCount[shelveName])}
        </ul>
      </div>
    </div>
  );
};

export default DropTargetAccordion;
