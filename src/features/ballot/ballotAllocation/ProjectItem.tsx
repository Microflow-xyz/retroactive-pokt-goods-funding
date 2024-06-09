import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Link from "next/link";
import { useDrag } from "react-dnd";
import { X, ExternalLinkIcon } from "lucide-react";
import { useProjectMetadata } from "~/features/projects/hooks/useProjects";

const ProjectItem = React.memo(
  ({
    project,
    isDraggable = true,
    onDelete,
  }: {
    project: { id: string; name: string; metadataPtr: string };
    onDelete?: () => void;
    isDraggable?: boolean;
  }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ITEM",
      item: project,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const metadata = useProjectMetadata(project?.metadataPtr);
    const { impactCategory } = metadata.data ?? {};
    return (
      <>
        <div
          data-tooltip-id={project?.id.toString()}
          ref={isDraggable ? drag : null}
          className={`${isDragging ? " opacity-50" : " opacity-100"} ${isDraggable ? "cursor-pointer" : ""} flex  items-center gap-1 rounded-lg border border-onPrimary-light px-3 py-2 text-sm font-medium`}
        >
          {onDelete && (
            <button onClick={() => onDelete()}>
              <X color="#ffffff" className="h-4 w-4" />
            </button>
          )}
          <p className="max-w-24 truncate"> {project.name}</p>

          <Link
            href={`/projects/${project?.id}`}
            as={`/projects/${project?.id}`}
            target="_blank"
          >
            <ExternalLinkIcon className=" h-4 w-4" />
          </Link>
        </div>
        <ReactTooltip
          id={project?.id.toString()}
          place="bottom"
          className="bg-background-dark bg-opacity-100 text-sm font-normal text-onSurfaceVariant-dark shadow-sm"
          content={
            <div className="flex items-center gap-2 ">
              <p className="text-sm font-medium">{project?.name}</p>
              {impactCategory && (
                <span className=" rounded-lg bg-gray-200 px-2 py-1 text-sm font-medium transition dark:border dark:border-outline-dark dark:bg-transparent dark:text-onSurface-dark">
                  {impactCategory}
                </span>
              )}
            </div>
          }
          style={{ backgroundColor: "#231f20" }}
        />
      </>
    );
  },
);

export default ProjectItem;
