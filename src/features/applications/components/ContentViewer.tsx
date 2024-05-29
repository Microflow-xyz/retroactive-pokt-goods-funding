import React from "react";
import TextEditor from "./TextEditor";


interface ContentViewerProps {
  htmlContent: string;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ htmlContent }) => {
  return (
    <div className="content-viewer" dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

export default ContentViewer;