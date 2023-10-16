"use client";

import { useRef, useState } from "react";
import styles from "./tableHS.module.css";
import "react-virtualized/styles.css";
import { AutoSizer, Column, Table } from "react-virtualized";

export default function TableGenerator(props: any) {
  const inputRef = useRef<any>();

  const [activeRow, setActiveRow] = useState(0);
  const [activeColumn, setActiveColumn] = useState(0);
  const [activeInput, setActiveInput] = useState(false);

  // type: text status delCheck checkBox radio combo button popup
  // align: left center right
  // width minWidth SaveName Format Edit(Boolean) EditLen
  // FontColor BackColor MaxValue  MinValue
  const { data } = props;
  if (!data) {
    return <></>;
  }

  const colWidth = 100;

  const columns = [
    { Header: "code", Type: "text", MinWidth: "150px", Editable: true },
    { Header: "language", Type: "text", MinWidth: "100px" },
    { Header: "category", Type: "text" },
    { Header: "content", Type: "text" },
    { Header: "createdBy", Type: "text", MinWidth: "150px" },
    { Header: "createdAt", Type: "text", MinWidth: "150px" },
    { Header: "updatedBy", Type: "text", MinWidth: "150px" },
    { Header: "updatedAt", Type: "text", MinWidth: "150px" },
  ];

  if (data.constructor === Object && Object.keys(data).length === 0) {
    return <></>;
  }

  return (
    <div className={styles.tableContainer}>
      <AutoSizer disableHeight>
        {({ width }) => (
          <Table
            width={width}
            height={400}
            headerHeight={20}
            rowHeight={30}
            rowCount={data.length}
            rowGetter={({ index }) => data[index]}
            rowRenderer={({ key, index, style }) => {
              const rowData = data[index];

              const rowStyle = {
                overflow: "hidden",
                flex: `0 1 ${colWidth}px`,
              };

              return (
                <div
                  key={key}
                  className={"ReactVirtualized__Table__row"}
                  aria-rowindex={1}
                  aria-label="row"
                  tabIndex={0}
                  role="row"
                  style={style}
                >
                  {columns.map((column) => {
                    return (
                      <div
                        key={column.Header}
                        className={"ReactVirtualized__Table__rowColumn"}
                        style={rowStyle}
                      >
                        <input
                          onClick={(e) => console.dir(e)}
                          onChange={(e) => console.log(e.target.value)}
                          value={rowData[column.Header]}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            }}
          >
            {columns.map((column, key) => {
              return (
                <Column
                  key={key}
                  label={column.Header}
                  dataKey={column.Header}
                  width={colWidth}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    </div>
  );
}

/*<div style="height: 30px; left: 0px; position: absolute; top: 0px; width: 1093px; 
overflow: hidden; padding-right: 17px;" aria-rowindex="1" aria-label="row" tabindex="0" 
class="ReactVirtualized__Table__row" role="row">
<div aria-colindex="1" class="ReactVirtualized__Table__rowColumn" role="gridcell" title="1CES240" style="overflow: hidden; flex: 0 1 100px;">1CES240</div>
*/
