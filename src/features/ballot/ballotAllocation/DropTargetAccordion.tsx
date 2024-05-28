import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type ballotImpacts } from "../types";
import { type Attestation } from "~/utils/fetchAttestations";

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
      drop: (item: Attestation) => {
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

  //TODO: Move this to the right file
  useEffect(() => {
    const ratio = {
      HIGHEST: 0.1,
      HIGH: 0.2,
      MID: 0.3,
      LOW: 0.4,
    };

    function gen(input) {
      let i = 1;
      let suggest;
      while (true) {
        suggest = suggestor(i);
        i++;
        // highest check
        if (input.highest > suggest.highestImpactProjects) continue;
        if (
          input.high >
          suggest.highImpactProjects +
            (suggest.highestImpactProjects - input.highest)
        )
          continue;
        if (
          input.mid >
          suggest.mediumImpactProjects +
            (suggest.highImpactProjects - input.high) +
            (suggest.highestImpactProjects - input.highest)
        )
          continue;
        break;
      }
      const missing = {
        highest: suggest.highestImpactProjects - input.highest,
        high: suggest.highImpactProjects - input.high,
        mid: suggest.mediumImpactProjects - input.mid,
        low: suggest.lowImpactProjects - input.low,
      };
      if (missing.high < 0) {
        missing.highest += missing.high;
        missing.high = 0;
      }
      if (missing.mid < 0) {
        missing.high += missing.mid;
        if (missing.high < 0) {
          missing.highest += missing.high;
          missing.high = 0;
        }
        missing.mid = 0;
      }
      if (missing.low < 0) {
        if (missing.low * -1 > missing.mid + missing.high + missing.highest)
          return {
            highest: 0,
            high: 0,
            mid: 0,
            low: 0,
          };
        missing.mid += missing.low;
        if (missing.mid < 0) {
          missing.high += missing.mid;
          if (missing.high < 0) {
            missing.highest += missing.high;
            missing.high = 0;
          }
          missing.mid = 0;
        }
        missing.low = 0;
      }
      return missing;
    }
    function suggestor(base) {
      return {
        highestImpactProjects: Math.floor(
          Math.fround((base * ratio.HIGHEST) / ratio.LOW),
        ),
        highImpactProjects: Math.floor(
          Math.fround((base * ratio.HIGH) / ratio.LOW),
        ),
        mediumImpactProjects: Math.floor(
          Math.fround((base * ratio.MID) / ratio.LOW),
        ),
        lowImpactProjects: base,
      };
    }

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
  
    for (let i = 0; i < count; i++) {
      boxes.push(
        <li
          className={`rounded-lg border border-onSurface-dark bg-onError-dark px-8 py-4 text-sm font-medium`}
          key={i}
        />
      );
    }
  
    return boxes;
  };
  return (
    <div className="p-5" ref={drop}>
      <div className=" flex cursor-pointer items-center justify-between">
        {label} ({droppedItems[shelveName]?.length})
      </div>
      <div className="flex">
        <ul className="mt-3 flex flex-wrap gap-2">
          {droppedItems[shelveName]?.map((item: string, index: number) => (
            <li
              className={`rounded-lg border border-onPrimary-light px-3 py-2 text-sm font-medium`}
              key={index}
            >
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
