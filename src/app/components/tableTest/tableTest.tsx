"use client";

import {
  ChangeEventHandler,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
  const [cursor, setCursor] = useState<{ row: number; column: string }>({
    row: 0,
    column: "",
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

    return () => {
      window.removeEventListener(`resize`, windowResize);
    };
  }, [inputRef]);

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
    console.log(`row: ${row}, column: ${column}`);

    if (row > -1 && column) {
      if (data) {
        if (data[row][column] !== currentValue) {
          const newData = [...data];
          newData[row][column] = currentValue;

          setData(newData);

          const updatedElement = document.querySelector(
            `[data-row="${row}"][data-column="${column}"]`
          ) as HTMLElement;

          if (updatedElement.parentElement) {
            updatedElement.parentElement.dataset.status = "U";
          }
          updatedElement.dataset.status = "U";
          updatedElement.style.backgroundColor = "rgba(255, 0, 132, 0.2)";

          console.log(data[row][column]);
          console.log(props.data[row][column]);
        }
      }
    }
  };
  const handleClickSave = () => {};
  const handleClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    inputRef.current.blur();
    const tr = e.currentTarget as HTMLDivElement;
    const rect = tr.getBoundingClientRect();

    if (tr.dataset.column && tr.dataset.row) {
      setCursor({
        row: Number(tr.dataset.row),
        column: tr.dataset.column,
      });
    }

    const inputElement = inputRef.current;

    // Set the position and size of the input element based on the clicked <tr>
    inputElement.style.width = `${rect.width}px`;
    inputElement.style.height = `${rect.height}px`;
    inputElement.style.top = `${rect.top - 50}px`;
    inputElement.style.left = `${rect.left}px`;

    setCurrentValue(`${tr.innerText}`);

    // Make the input element visible
    inputElement.style.display = "block";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      blurInputRef();
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
                          tabIndex={0}
                          role="row"
                          style={style}
                        >
                          {columnData.map((column) => {
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
                                data-column={column.Header}
                                onClick={(e) => handleClickCell(e)}
                                onMouseDown={(e) => e.preventDefault()}
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
