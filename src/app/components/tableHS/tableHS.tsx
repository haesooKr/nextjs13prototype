"use client";

import "react-virtualized/styles.css";
import { AutoSizer, Column, Table } from "react-virtualized";
import styles from "./tableHS.module.css";
import { useRef, useState } from "react";

export default function TableGenerator(props: any) {
  const inputRef = useRef<any>();

  const [selectedRow, setSelectedRow] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [updatedRows, setUpdatedRows] = useState({});
  const [originalData, setOriginalData] = useState([]);
  const [currentInputValue, setCurrentInputValue] = useState("");

  const handleTableScroll = () => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputRef.current.style.width = null;
      inputRef.current.style.height = null;
      inputRef.current.style.top = null;
      inputRef.current.style.left = null;
      inputRef.current.value = null;
      inputElement.blur();
    }
  };

  const { data } = props;
  if (!data) {
    return <></>;
  }

  if (data.constructor === Object && Object.keys(data).length === 0) {
    return <></>;
  }

  function handleOnChange(e: any) {
    setCurrentInputValue(e.target.value);
  }
  function handleBlurChange() {
    if (selectedRow && selectedColumn) {
      data[selectedRow][selectedColumn] = currentInputValue;
      setUpdatedRows((prevUpdatedRows: any) => ({
        ...prevUpdatedRows,
        [selectedRow]: {
          ...prevUpdatedRows[selectedRow],
          [selectedColumn]: currentInputValue,
        },
      }));
    }
  }

  const colWidth = 0;

  const columns = [
    { Header: "code", Type: "text", MinWidth: 50 },
    { Header: "language", Type: "text", MinWidth: 50 },
    { Header: "category", Type: "text", MinWidth: 50 },
    { Header: "content", Type: "text", MinWidth: 500 },
    { Header: "createdBy", Type: "text", MinWidth: 100 },
    { Header: "createdAt", Type: "text", MinWidth: 100 },
    { Header: "updatedBy", Type: "text", MinWidth: 100 },
    { Header: "updatedAt", Type: "text", MinWidth: 100 },
  ];

  return (
    <div>
      <div style={{ flex: "1 1 auto" }}>
        <AutoSizer disableHeight>
          {({ width }) => (
            <Table
              className={styles.container}
              width={width}
              height={400}
              headerHeight={20}
              rowHeight={30}
              onScroll={handleTableScroll}
              rowCount={data.length}
              rowGetter={({ index }) => data[index]}
              rowRenderer={({ key, index, style }) => {
                const rowData = data[index];

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
                      const rowStyle = {
                        overflow: "hidden",
                        flex: `1 1 ${colWidth}`,
                        minWidth: `${column.MinWidth}px`,
                      };

                      return (
                        <div
                          key={column.Header}
                          className={"ReactVirtualized__Table__rowColumn"}
                          style={rowStyle}
                          data-row={index}
                          data-column={column.Header}
                          onClick={(e) => {
                            const tr = e.currentTarget as HTMLDivElement;
                            const rect = tr.getBoundingClientRect();

                            if (tr.dataset.column && tr.dataset.row) {
                              setSelectedColumn(tr.dataset.column);
                              setSelectedRow(tr.dataset.row);
                            }

                            // Set the position and size of the input element based on the clicked <tr>
                            inputRef.current.style.width = `${rect.width}px`;
                            inputRef.current.style.height = `${rect.height}px`;
                            inputRef.current.style.top = `${rect.top - 50}px`;
                            inputRef.current.style.left = `${rect.left}px`;

                            setCurrentInputValue(`${tr.innerText}`);

                            // Make the input element visible
                            inputRef.current.style.display = "block";
                          }}
                        >
                          {rowData[column.Header]}
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            >
              {columns.map((column, key) => {
                const rowStyle = {
                  overflow: "hidden",
                  flex: `1 1`,
                  color: "red",
                };
                return (
                  <Column
                    key={key}
                    label={column.Header}
                    dataKey={column.Header}
                    data-test={1}
                    width={colWidth}
                    minWidth={Number(column.MinWidth)}
                    flexGrow={1}
                  />
                );
              })}
            </Table>
          )}
        </AutoSizer>
      </div>
      <div className={styles.inputBox}>
        <input
          className={styles.input}
          ref={inputRef}
          value={currentInputValue}
          onChange={handleOnChange}
          onBlur={handleBlurChange}
        />
      </div>
    </div>
  );
}
