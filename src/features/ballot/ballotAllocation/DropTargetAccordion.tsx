import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { dynamicLabel, gen } from "./helpers";
import { type ballotImpacts, type droppedItems } from "../types";
import ProjectItem from "./ProjectItem";

const DropTargetAccordion = ({
  label,
  shelveName,
  droppedItems,
  setDroppedItems,
  className,
}: {
  label: string;
  className?: string;
  droppedItems: droppedItems;
  setDroppedItems?: React.Dispatch<React.SetStateAction<droppedItems>>;
  shelveName:
    | "lowImpactProjects"
    | "mediumImpactProjects"
    | "highImpactProjects"
    | "highestImpactProjects"
    | "noImpactProjects";
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
      drop: (item) => {
        if (setDroppedItems)
          setDroppedItems((prevDroppedItems) => {
            // Find the index of the item in the source DropTargetAccordion
            const sourceShelveName = Object.keys(prevDroppedItems).find(
              (shelve) =>
                prevDroppedItems[shelve]?.some((i) => i?.id === item?.id),
            );

            // Remove the item from the source DropTargetAccordion
            if (sourceShelveName) {
              const updatedSourceItems = prevDroppedItems[
                sourceShelveName
              ].filter((i) => i?.id !== item?.id);
              return {
                ...prevDroppedItems,
                [sourceShelveName]: updatedSourceItems,
                [shelveName]: prevDroppedItems[shelveName].includes(item)
                  ? prevDroppedItems[shelveName]
                  : [...(prevDroppedItems[shelveName] || []), item],
              };
            }

            // If the item is not found in any DropTargetAccordion, add it to the target DropTargetAccordion
            return {
              ...prevDroppedItems,
              [shelveName]: prevDroppedItems[shelveName].includes(item)
                ? prevDroppedItems[shelveName]
                : [...(prevDroppedItems[shelveName] || []), item],
            };
          });
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
    console.log(
      "droppedItems[shelveName].length",
      shelveName,
      Number(count),
      droppedItems[shelveName].length,
    );
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
      highest: droppedItems?.highestImpactProjects?.length,
      high: droppedItems?.highImpactProjects?.length,
      mid: droppedItems?.mediumImpactProjects?.length,
      low: droppedItems?.lowImpactProjects?.length,
    },
    {
      highest: suggestCount.highestImpactProjects,
      high: suggestCount.highImpactProjects,
      mid: suggestCount.mediumImpactProjects,
      low: suggestCount.lowImpactProjects,
    },
  )[shelveName];
  return (
    <div
      className={`${className} m-1 p-5 pb-3  ${
        isOver ? " bg-inverseSurface-light" : ""
      }`}
      ref={setDroppedItems ? drop : undefined}
    >
      <div className=" flex cursor-pointer items-center gap-2">
        {label}
        {setDroppedItems && (
          <span
            className={`rounded-lg px-2 py-[2px] text-xs font-medium ${dynamicLabelObj?.type === "error" ? " bg-[#FEDAD9] text-[#8E1F0B]" : " bg-inverseSurface-light text-onPrimary-light"}`}
          >
            {dynamicLabelObj?.text}
          </span>
        )}
      </div>
      <div className="flex w-full">
        <ul className="mt-3 flex w-full flex-wrap gap-2">
          {droppedItems[shelveName] &&
            droppedItems[shelveName]?.map((item, index: number) => (
              <li
                className={`flex items-center justify-between gap-1`}
                key={index}
              >
                <ProjectItem
                  isDraggable={setDroppedItems ? true : false}
                  onDelete={
                    setDroppedItems
                      ? () => {
                          setDroppedItems({
                            ...droppedItems,
                            [shelveName]: [
                              ...droppedItems[shelveName].filter(
                                (project) => item !== project,
                              ),
                            ],
                          });
                        }
                      : undefined
                  }
                  key={item.id}
                  project={item}
                />
              </li>
            ))}
          {setDroppedItems && renderEmptyBoxes(suggestCount[shelveName])}
        </ul>
      </div>
    </div>
  );
};

export default DropTargetAccordion;
