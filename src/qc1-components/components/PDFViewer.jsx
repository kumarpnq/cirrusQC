import * as React from "react";
// import "./index.css";
import { useState } from "react";
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  Annotation,
  Inject,
} from "@syncfusion/ej2-react-pdfviewer";

function PDFViewer({ url }) {
  const [searchText, setSearchText] = useState("");

  // Reference to the PdfViewerComponent
  const pdfViewerRef = React.useRef(null);

  const handleSearch = () => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.textSearchModule.searchText(searchText);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter search term"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={handleSearch}>Search & Highlight</button>
      <div className="control-section">
        {/* Render the PDF Viewer */}
        <PdfViewerComponent
          ref={pdfViewerRef}
          id="container"
          documentPath={url}
          enableTextSearch={true}
          style={{ height: "640px" }}
        >
          <Inject
            services={[
              Toolbar,
              Annotation,
              Magnification,
              Navigation,
              LinkAnnotation,
              BookmarkView,
              ThumbnailView,
              Print,
              TextSelection,
              TextSearch,
            ]}
          />
        </PdfViewerComponent>
      </div>
    </div>
  );
}
export default PDFViewer;
