import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    // Fetch data from local JSON file
    fetch("sampleData.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    if (checkedRows.includes(id)) {
      setCheckedRows(checkedRows.filter((rowId) => rowId !== id));
    } else {
      setCheckedRows([...checkedRows, id]);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Render data table rows
  const renderRows = () => {
    return paginatedData.map((row) => (
      <tr key={row.id}>
        <td>
          <input
            type="checkbox"
            checked={checkedRows.includes(row.id)}
            onChange={() => handleCheckboxChange(row.id)}
          />
        </td>
        <td>{row.id}</td>
        <td>{row.name}</td>
        <td>{row.value1}</td>
      </tr>
    ));
  };

  // Prepare data for the chart
  const chartData = checkedRows.map((id) => data.find((row) => row.id === id));

  // Render chart
  const renderChart = () => {
    const xValues = chartData.map((item) => item.name);
    const yValues = chartData.map((item) => item.value1);

    return (
      <Plot
        data={[
          {
            x: xValues,
            y: yValues,
            type: "bar",
          },
        ]}
        layout={{ width: 400, height: 300, title: "Numeric Values Chart" }}
      />
    );
  };

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      (item.name &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.value1 && item.value1.toString().includes(searchTerm.toLowerCase()))
  );

  // Paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div
      style={{
        backgroundColor: "snow",
        lineHeight: "2",
      }}
      className="divElement"
    >
      <div className="divElement">DATA BAR & CHART</div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {Array.from(
          { length: Math.ceil(filteredData.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              style={{
                fontWeight: currentPage === index + 1 ? "bold" : "normal",
                marginRight: "15px",
              }}
            >
              {index + 1}
            </button>
          )
        )}
      </nav>
      {renderChart()}
    </div>
  );
};

export default App;
