import { useRef, useState } from "react";
import styles from "./tableHS.module.css";

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

  function htmlGenerator(data: any) {
    if (data.constructor === Object && Object.keys(data).length === 0) {
      return <></>;
    }

    return data.map((row: any, rowIndex: any) => (
      <tr key={rowIndex}>
        {columns.map((column, columnIndex) => (
          <td
            key={columnIndex}
            style={column.MinWidth ? { minWidth: column.MinWidth } : {}}
            onClick={(e) => handleRowClick(e, rowIndex, column.Header)}
            data-row={rowIndex + 1}
            data-column={numberToExcelColumn(columnIndex)}
            className={rowIndex > 100 ? styles.hidden : undefined}
          >
            {row[column.Header]}
          </td>
        ))}
      </tr>
    ));
  }

  const handleKeyPress = (event: any) => {
    data[activeRow][activeColumn] = event.target.value;
  };

  const handleRowClick = (e: any, row: any, column: any) => {
    setActiveInput(true);
    const tr = e.currentTarget;
    // const rect = tr.getBoundingClientRect();

    // Set the position and size of the input element based on the clicked <tr>

    if (inputRef.current != null) {
      inputRef.current.focus();
      // inputRef.current.style.width = `${rect.width}px`;
      // inputRef.current.style.height = `${rect.height}px`;
      // inputRef.current.style.top = `${rect.top - 50}px`;
      // // [TODO] 일단 위의 navigation bar때문에 50이 더해지는데 이 문제에 대해서 해결필요.
      // inputRef.current.style.left = `${rect.left}px`;

      // // Make the input element visible
      // inputRef.current.style.display = "block";
      // inputRef.current.style.zIndex = 999;

      // setActiveRow(row);
      // setActiveColumn(column);
    }

    console.log(data[row][column]);
  };

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

  return (
    <div className={styles.tableHS}>
      <div className={styles.focusedCursor}>
        <input ref={inputRef} onKeyDown={handleKeyPress}></input>
      </div>
      <table>
        <tbody>
          <tr>
            {columns.map((column, index) => (
              <td key={index} style={{ minWidth: column.MinWidth }}>
                {column.Header}
              </td>
            ))}
          </tr>
          {htmlGenerator(data)}
        </tbody>
      </table>
    </div>
  );
}

function numberToExcelColumn(n: number) {
  let result = "";
  while (n >= 0) {
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
}
