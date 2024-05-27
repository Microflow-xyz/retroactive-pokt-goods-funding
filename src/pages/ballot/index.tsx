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
} from "~/features/ballot/types";

export default function Ballot() {
  const localData: ballotImpacts = useLocalStorage("ballot-draft")[0];
  const [droppedItems, setDroppedItems] = useState<ballotImpacts>({
    lowImpactProjects: [],
    mediumImpactProjects: [],
    highImpactProjects: [],
    highestImpactProjects: [],
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

  return (
    <Layout isFullWidth>
      <DndProvider backend={HTML5Backend}>
        <Rules rulesCheck={rulesCheck} />
        <BallotAllocation
          setDroppedItems={setDroppedItems}
          droppedItems={droppedItems}
        />
      </DndProvider>
    </Layout>
  );
}
