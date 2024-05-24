import { useState } from "react";
import { Layout } from "~/layouts/DefaultLayout";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Ballot from "~/features/ballot";

export default function BallotPage() {
  function DraggableItem() {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ITEM",
      item: { id: "unique-id" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
        Drag me!
      </div>
    );
  }

  function DropTargetAccordion() {
    const [isOpen, setIsOpen] = useState(false);
    const [droppedItems, setDroppedItems] = useState([]);

    const [{ isOver }, drop] = useDrop(() => ({
      accept: "ITEM",
      drop: (item) => {
        setDroppedItems((prevItems) => [...prevItems, item]);
        setIsOpen(true); // Open the accordion when an item is dropped
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div ref={drop} style={{ backgroundColor: isOver ? "lightgray" : "red" }}>
        <div
          onClick={toggleAccordion}
          style={{
            backgroundColor: isOpen ? "lightgray" : "red",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Drop items here! (Accordion)
          <span style={{ float: "right" }}>{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && (
          <div style={{ padding: "10px" }}>
            <h3>Dropped Items:</h3>
            <ul>
              {droppedItems.map((item, index) => (
                <li key={index}>{JSON.stringify(item)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return (
    <Layout isFullWidth>
      <DndProvider backend={HTML5Backend}>
        <Ballot />
      </DndProvider>
    </Layout>
  );
}
