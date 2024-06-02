import React, { useState, useEffect } from "react";
import { useLocalStorage } from "react-use";
import { Layout } from "~/layouts/DefaultLayout";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BallotAllocation from "~/features/ballot/ballotAllocation";
import Rules from "~/features/ballot/Rules";
import {
  BallotImpactsSchema,
  type ballotImpacts,
  type projectSchema,
} from "~/features/ballot/types";

//FIXME: Ballot Page props should be removed
export default function Ballot({ isModal = false }: { isModal?: boolean }) {
  const localData: ballotImpacts = useLocalStorage("ballot-draft")[0];
  const [droppedItems, setDroppedItems] = useState<ballotImpacts>({
    lowImpactProjects: [] as projectSchema[],
    mediumImpactProjects: [] as projectSchema[],
    highImpactProjects: [] as projectSchema[],
    highestImpactProjects: [] as projectSchema[],
  });

  const [rulesCheck, setRulesCheck] = useState<string[]>([]);

  useEffect(() => {
    setDroppedItems({
      lowImpactProjects: localData?.lowImpactProjects || [],
      mediumImpactProjects: localData?.mediumImpactProjects || [],
      highImpactProjects: localData?.highImpactProjects || [],
      highestImpactProjects: localData?.highestImpactProjects || [],
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("ballot-draft", JSON.stringify(droppedItems));
    setRulesCheck(
      BallotImpactsSchema?.safeParse(droppedItems)?.error?.errors?.map(
        (error) => error?.path[0],
      ),
    );
  }, [droppedItems]);

  // FIXME: This should be removed
  if (isModal)
    return (
      <DndProvider backend={HTML5Backend}>
        <BallotAllocation
          setDroppedItems={setDroppedItems}
          droppedItems={droppedItems}
          isModal
        />
      </DndProvider>
    );
  else
    return (
      <Layout isFullWidth>
        <DndProvider backend={HTML5Backend}>
          <Rules rulesCheck={rulesCheck} />
          <BallotAllocation
            setDroppedItems={setDroppedItems}
            droppedItems={droppedItems}
            //FIXME: This might need modification
            isModal={isModal}
          />
        </DndProvider>
      </Layout>
    );

  //FIXME: Original response
  // return (
  //   <Layout isFullWidth>
  //     <DndProvider backend={HTML5Backend}>
  //     <Rules rulesCheck={rulesCheck} />
  //     <BallotAllocation
  //       setDroppedItems={setDroppedItems}
  //       droppedItems={droppedItems}
  //     />
  //   </DndProvider>
  // </Layout>
  // );
}
