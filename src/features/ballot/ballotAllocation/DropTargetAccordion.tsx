import React, { useState } from "react";
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

  return (
    <div className="p-5" ref={drop}>
      <div className=" flex cursor-pointer items-center justify-between">
        {label} ({droppedItems[shelveName]?.length})
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {droppedItems[shelveName]?.map((item: string, index: number) => (
          <li
            className={`rounded-lg border border-onPrimary-light px-3 py-2 text-sm font-medium`}
            key={index}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropTargetAccordion;
