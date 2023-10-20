"use client";

import "react-virtualized/styles.css";
import { AutoSizer, Column, Table } from "react-virtualized";
import styles from "./tableHS.module.css";
import { useEffect, useRef, useState } from "react";
import responseHandler from "@/lib/response";
import { useRouter } from "next/navigation";

export default function TableGenerator(props: any) {
  const router = useRouter();

  const inputRef = useRef<any>();

  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [updatedRows, setUpdatedRows] = useState<{
    [key: number]: { [key: string]: string };
  }>({});
  const [data, setData] = useState<Array<{ [key: string]: string }>>([]);
  const [originalData, setOriginalData] = useState<
    Array<{ [key: string]: string }>
  >([]);

  const [currentInputValue, setCurrentInputValue] = useState("");

  const handleTableScroll = () => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.style.width = null;
      inputElement.style.height = null;
      inputElement.style.top = null;
      inputElement.style.left = null;
      inputElement.value = null;
      inputElement.blur();
    }
  };

  useEffect(() => {
    if (props.data.length > 0) {
      setData(JSON.parse(JSON.stringify(props.data)));
      setOriginalData(JSON.parse(JSON.stringify(props.data)));
    }
  }, [props]);

  useEffect(() => {
    for (let row in updatedRows) {
      const modifiedRow: HTMLElement | null = document.querySelector(
        `div[aria-rowindex='${row}']`
      );
      if (modifiedRow) {
        modifiedRow.style.backgroundColor = "red";
      }
    }
  }, [updatedRows]);

  function handleOnChange(e: any) {
    setCurrentInputValue(e.target.value);
  }

  function resetUpdatedRows() {
    for (let row in updatedRows) {
      const modifiedRow: HTMLElement | null = document.querySelector(
        `div[aria-rowindex='${row}']`
      );
      if (modifiedRow) {
        modifiedRow.style.removeProperty("backgroundColor");
      }
      setUpdatedRows({});
    }
  }

  function handleBlurChange() {
    if (selectedRow > -1 && selectedColumn) {
      if (data) {
        if (originalData[selectedRow][selectedColumn] !== currentInputValue) {
          const newData = [...data];
          newData[selectedRow][selectedColumn] = currentInputValue;

          setData(newData);
          setUpdatedRows((prevUpdatedRows: any) => ({
            ...prevUpdatedRows,
            [selectedRow]: {
              ...prevUpdatedRows[selectedRow],
              [selectedColumn]: currentInputValue,
            },
          }));
        } else {
          const newData = [...data];
          newData[selectedRow][selectedColumn] = currentInputValue;

          setData(newData);

          if (updatedRows[selectedRow][selectedColumn]) {
            const newUpdatedRows = JSON.parse(JSON.stringify(updatedRows));

            console.log("DELETE: ", newUpdatedRows);
            delete newUpdatedRows[selectedRow][selectedColumn];

            for (const key in newUpdatedRows) {
              if (
                newUpdatedRows[key] &&
                Object.keys(newUpdatedRows[key]).length === 0
              ) {
                delete newUpdatedRows[key];
              }
            }
          }
          // TODO: 만약 값이 original과 같다면 data와 updatedRows에 해당하는 값 리셋
        }
        console.log(updatedRows);
        console.log(data);
      }
    }
  }

  const handleClickSave = async () => {
    const originalRows: { [key: string]: {} } = {};

    for (let row in updatedRows) {
      const rowNum = Number(row);
      originalRows[rowNum] = originalData[rowNum];
    }

    const res = await fetch("/api/message/updateMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updatedRows: updatedRows,
        originalRows: originalRows,
      }),
    });

    const response = await res.json();
    responseHandler(response, router, resetUpdatedRows);
    console.log(data);
  };

  const colWidth = 0;

  const columns = [
    { Header: "code", Type: "text", MinWidth: 50 },
    { Header: "language", Type: "text", MinWidth: 50 },
    { Header: "category", Type: "text", MinWidth: 50 },
    { Header: "content", Type: "text", MinWidth: 300 },
    { Header: "createdBy", Type: "text", MinWidth: 100 },
    { Header: "createdAt", Type: "text", MinWidth: 100 },
    { Header: "updatedBy", Type: "text", MinWidth: 100 },
    { Header: "updatedAt", Type: "text", MinWidth: 100 },
  ];

  return data.length > 0 ? (
    <>
      <div className={styles.TableAutoSizerContainer}>
        <div>
          {" "}
          {/* div 두개를 사이에다 넣은 이유는, AutoSizer에서 input이 정확한 위치를 찾기위해서
                  이런 형식만 작동하기때문에 여러 작업을 거치다가 발견함 (정확한 이유는 아직 찾지못함
              */}
          <div>
            <AutoSizer disableHeight style={{ position: undefined }}>
              {({ width }) => (
                <Table
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
                        aria-rowindex={index}
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
                                  setSelectedRow(Number(tr.dataset.row));
                                }

                                // Set the position and size of the input element based on the clicked <tr>
                                inputRef.current.style.width = `${rect.width}px`;
                                inputRef.current.style.height = `${rect.height}px`;
                                inputRef.current.style.top = `${
                                  rect.top - 50
                                }px`;
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
      </div>
      <button onClick={handleClickSave}>저장</button>
    </>
  ) : (
    <></>
  );
}
