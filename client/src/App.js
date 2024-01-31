import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

// Function to initialize data for each region
const initializeData = (id, region) => ({
  id,
  region,
  value: Array.from({ length: 7 }, () => Math.floor(Math.random() * 21)),
});

// Initial data array
const initialData = [
  initializeData("d1", "Asset 1"),
  initializeData("d2", "Asset 2"),
  initializeData("d3", "Asset 3"),
  initializeData("d4", "Asset 4"),
];

// Main App component
const App = () => {
  // State for checkbox and selected data
  const [isChecked, setIsChecked] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  // Reference to the chart container element
  const chartContainerRef = useRef(null);

  // Effect to handle changes in checkbox state and selected data
  useEffect(() => {
    if (isChecked) {
      // Log sum and average to the console
      console.log(selectedData);

      // Function to create and update the chart
      const chart = () => {
        const width = 950;
        const height = 500;
        const marginTop = 100;
        const marginRight = 0;
        const marginBottom = 30;
        const marginLeft = 40;

        const tickValues = Array.from({ length: 7 }, (_, i) => i + 1);

        // X and Y scales
        const x = d3
          .scaleBand()
          .domain(tickValues)
          .range([marginLeft - 50, width - marginRight + 120])
          .padding(1);

        const y = d3
          .scaleLinear()
          .domain([0, 20])
          .range([height - marginBottom, marginTop]);

        // SVG container for the chart
        const svg = d3
          .select(chartContainerRef.current)
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto;");

        // Remove any existing elements within the SVG
        svg.selectAll("*").remove();

        // X-axis
        svg
          .append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(
            d3.axisBottom(x).tickValues(tickValues).tickFormat(d3.format("d"))
          )
          .call((g) => g.select(".domain").remove());

        // Y-axis
        svg
          .append("g")
          .attr("transform", `translate(${marginLeft},0)`)
          .call(
            d3
              .axisRight(y)
              .tickSize(width - marginLeft - marginRight)
              .ticks(11)
          )
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .selectAll(".tick:not(:first-of-type) line")
              .attr("stroke-opacity", 0.5)
              .attr("stroke-dasharray", "2,2")
          )
          .call((g) => g.selectAll(".tick text").attr("x", 4).attr("dy", -4));

        // Line chart
        svg
          .append("path")
          .datum(selectedData)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr(
            "d",
            d3
              .line()
              .x((d, i) => x(i + 1))
              .y((d) => y(d))
          );
      };

      // Call the chart function
      chart();
    }
  }, [isChecked, selectedData]);

  // Function to handle checkbox change
  const handleCheckboxChange = (data) => {
    const selectedValue = initialData.find((d) => d.id === data.id).value;
    setSelectedData(selectedValue);
    setIsChecked(true);
  };

  // Render the component
  return (
    <div id="app">
      <div id="chart">
        {/* SVG container for the chart */}
        <svg ref={chartContainerRef}></svg>
      </div>
      <div id="data">
        {/* List of regions with checkboxes */}
        <ul>
          {initialData.map((data) => (
            <li key={data.id}>
              <span>{data.region}</span>
              <input
                type="checkbox"
                checked={isChecked && selectedData === data.value}
                onChange={() => handleCheckboxChange(data)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
