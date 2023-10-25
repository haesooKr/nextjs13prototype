"use client";

/*
스크롤하면서 css가 초기화됨.
스크롤 시, 이전 페이지 데이터 조회가 불가능함.
*/

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { AutoSizer, Column, Table } from "react-virtualized";
import styles from "./tableTest.module.css";
import "react-virtualized/styles.css";

const STATUS = {
  ORIGINAL: "O",
  UPDATE: "U",
  DELETE: "D",
  INSERT: "I",
};

const columns = [
  { Header: "code", Type: "text", MinWidth: 50 },
  { Header: "language", Type: "text", MinWidth: 50 },
  { Header: "category", Type: "text", MinWidth: 50 },
  { Header: "content", Type: "text", MinWidth: 50 },
  { Header: "createdBy", Type: "text", MinWidth: 100 },
  { Header: "createdAt", Type: "text", MinWidth: 250 },
  { Header: "updatedBy", Type: "text", MinWidth: 100 },
  { Header: "updatedAt", Type: "text", MinWidth: 250 },
];

export default function TableGenerator(props: any) {
  const inputRef = useRef<any>();

  const [currentValue, setCurrentValue] = useState("");
  const [cursor, setCursor] = useState<{ row: number; column: number }>({
    row: 0,
    column: 0,
  });
  const [multiCursor, setMultiCursor] = useState<
    Array<{ [key: string]: string }>
  >([]);
  const [data, setData] = useState<Array<{ [key: string]: string }>>([]);
  const [columnData, setColumnData] = useState<
    Array<{ [key: string]: string | number }>
  >([]);

  useEffect(() => {
    if (Object.keys(props.data).length > 0) {
      setData(JSON.parse(JSON.stringify(props.data)));
      setColumnData(columns);
    }
  }, [props]);

  useEffect(() => {
    const windowResize = () => {
      if (inputRef.current) {
        blurInputRef();
      }
    };

    window.addEventListener(`resize`, windowResize);

    window.addEventListener("keydown", function (e) {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "PageUp" ||
        e.key === "PageDown"
      ) {
        e.preventDefault(); // 기본 스크롤 이벤트를 막습니다.
      }
    });

    return () => {
      window.removeEventListener(`resize`, windowResize);

      window.addEventListener("keydown", function (e) {
        if (
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "PageUp" ||
          e.key === "PageDown"
        ) {
          e.preventDefault(); // 기본 스크롤 이벤트를 막습니다.
        }
      });
    };
  }, [inputRef]);

  function automove(target: HTMLElement) {
    console.log(cursor.row, cursor.column);
    console.log(target);

    inputRef.current.blur();

    const rect = target.getBoundingClientRect();

    const inputElement = inputRef.current;

    // Set the position and size of the input element based on the clicked <tr>
    inputElement.style.width = `${rect.width}px`;
    inputElement.style.height = `${rect.height}px`;
    inputElement.style.top = `${rect.top - 50}px`;
    inputElement.style.left = `${rect.left}px`;

    setCurrentValue(`${target.innerText}`);

    inputElement.style.display = "block";

    if (target.parentElement) {
      target.parentElement.focus();
    }
  }

  const blurInputRef = () => {
    inputRef.current.style.removeProperty("width");
    inputRef.current.style.removeProperty("height");
    inputRef.current.style.removeProperty("top");
    inputRef.current.style.removeProperty("left");
    inputRef.current.style.removeProperty("display");
    inputRef.current.blur();
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  };
  const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { row, column } = cursor;
    const columnHeader = columns[column].Header;

    if (row > -1 && column) {
      if (data) {
        if (data[row][columnHeader] !== currentValue) {
          const newData = [...data];
          newData[row][columnHeader] = currentValue;

          setData(newData);

          const updatedElement = document.querySelector(
            `[data-row="${row}"][data-column="${column}"]`
          ) as HTMLElement;

          if (updatedElement.parentElement) {
            updatedElement.parentElement.dataset.status = "U";
          }
          updatedElement.dataset.status = "U";
        }
      }
    }
  };
  const handleClickSave = () => {};
  const handleClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const tr = e.currentTarget as HTMLDivElement;

    if (tr.dataset.column && tr.dataset.row) {
      setCursor({
        column: Number(tr.dataset.column),
        row: Number(tr.dataset.row),
      });
    }

    automove(tr);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    console.log("KEY DOWN");
    const inputKeyDown = inputRef.current === document.activeElement;

    if (inputKeyDown && e.key === "Enter") {
      blurInputRef();
    }

    if (e.key === "ArrowDown") {
      if (cursor.row < data.length - 1) {
        const targetRow = cursor.row + 1;

        const updatedElement = document.querySelector(
          `[data-row="${targetRow}"][data-column="${cursor.column}"]`
        ) as HTMLElement;

        automove(updatedElement);

        setCursor((prevCursor: any) => ({
          column: prevCursor.column,
          row: prevCursor.row + 1,
        }));
      }
    } else if (!inputKeyDown && e.key === "ArrowLeft") {
      if (cursor.column > 0) {
        const targetColumn = cursor.column - 1;

        const updatedElement = document.querySelector(
          `[data-row="${cursor.row}"][data-column="${targetColumn}"]`
        ) as HTMLElement;

        automove(updatedElement);

        setCursor((prevCursor: any) => ({
          column: prevCursor.column - 1,
          row: prevCursor.row,
        }));
      }
    } else if (!inputKeyDown && e.key === "ArrowRight") {
      if (cursor.column < columns.length - 1) {
        const targetColumn = cursor.column + 1;

        const updatedElement = document.querySelector(
          `[data-row="${cursor.row}"][data-column="${targetColumn}"]`
        ) as HTMLElement;

        automove(updatedElement);

        setCursor((prevCursor: any) => ({
          column: prevCursor.column + 1,
          row: prevCursor.row,
        }));
      }
    } else if (e.key === "ArrowUp") {
      if (cursor.row > 0) {
        const targetRow = cursor.row - 1;

        const updatedElement = document.querySelector(
          `[data-row="${targetRow}"][data-column="${cursor.column}"]`
        ) as HTMLElement;

        automove(updatedElement);

        setCursor((prevCursor: any) => ({
          column: prevCursor.column,
          row: prevCursor.row - 1,
        }));
      }
    } else {
      inputRef.current.focus();
    }
  };

  if (data.length == 0) {
    return <div>데이터 없음</div>;
  } else {
    return (
      <>
        <div className={styles.TableAutoSizerContainer}>
          <div>
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
                          data-status={STATUS.ORIGINAL}
                          onDragStart={(e) => e.preventDefault()}
                          tabIndex={0}
                          role="row"
                          style={style}
                          onKeyDown={(e) => handleKeyDown(e)}
                        >
                          {columnData.map((column, i) => {
                            const rowStyle = {
                              overflow: "hidden",
                              flex: `1 1 0`,
                              minWidth: `${column.MinWidth}px`,
                            };

                            return (
                              <div
                                key={column.Header}
                                className={"ReactVirtualized__Table__rowColumn"}
                                style={rowStyle}
                                data-status={STATUS.ORIGINAL}
                                data-row={index}
                                data-column={i}
                                data-header={column.Header}
                                onClick={(e) => handleClickCell(e)}
                                onDragStart={(e) => e.preventDefault()}
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
                      return (
                        <Column
                          key={key}
                          label={column.Header}
                          dataKey={column.Header}
                          data-test={1}
                          width={0}
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
                value={currentValue}
                onChange={handleOnChange}
                onBlur={handleBlurChange}
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>
          </div>
        </div>
        <button onClick={handleClickSave}>저장</button>
      </>
    );
  }
}
