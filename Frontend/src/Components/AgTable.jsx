import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "../Styles/Team.css";

ModuleRegistry.registerModules([AllCommunityModule]);


const AgTable = ({ columnDefs, data, rowHeight }) => {
  const gridRef = useRef();

  console.log(columnDefs, "columnDefs");
  console.log(data, "data");
  console.log(rowHeight, "rowHeight");

  

  return (
    <div className="ag-theme-alpine" >
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 mb-4"
        onClick={() => gridRef.current?.api.exportDataAsCsv()}
      >
        Export to Excel
      </button>

      <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={5}
        domLayout="autoHeight"
        rowHeight={rowHeight}
        animateRows={true}
        headerHeight={50}
        defaultColDef={{
          sortable: true,
          editable: false,
          resizable: true,
          flex: 1,
        }}
      />
    </div>
  );
};

export default AgTable;
