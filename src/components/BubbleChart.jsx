import React from 'react';
import BubbleChart from "react-tooltip-bubble-chart";

function BubbleChartView() {
  const bubbleData = [
    {
      fillColor: "rgb(52, 202, 173, 0.3)",
      id: 5,
      name: "Setting\nme",
      size: 50,
      dYdX1: { dy: -2, dx: -3 },
      dYdX2: { dy: 8, dx: -20 },
    },
    {
      fillColor: "rgb(52, 202, 173, 0.3)",
      id: 6,
      name: "Getting\nStart",
      size: 120,
      dYdX1: { dy: -2, dx: -4 },
    },
    {
      fillColor: "rgb(52, 202, 173, 0.3)",
      id: 7,
      name: "Setting\nme",
      size: 50,
      dYdX1: { dy: -2, dx: -3 },
      dYdX2: { dy: 8, dx: -20 },
    },
  ];

  return (
    <div>
      <BubbleChart
        bubblesData={bubbleData}
        width={700}
        height={470}
        textFillColor="#717C84"
        backgroundColor="white"
        minValue={1}
        maxValue={150}
        move={true}
      />
    </div>
  );
}

export default BubbleChartView;