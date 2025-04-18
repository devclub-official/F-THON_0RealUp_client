import React from "react";
import ChartRace from "chart-race-react";

const BarChart = () => {
  const data = [
    { id: "1", title: "React", value: 100 },
    { id: "2", title: "Vue", value: 80 },
    { id: "3", title: "Angular", value: 60 },
    { id: "4", title: "Svelte", value: 40 },
  ];

  return (
    <div style={{ width: "600px", height: "400px", margin: "0 auto" }}>
      <h2 className="text-center text-lg font-bold mb-4">Chart Race Example</h2>
      <ChartRace
        data={data}
        backgroundColor="#f4f4f4"
        width={600}
        height={400}
        barHeight={30}
        barPadding={5}
        duration={2000}
        fontSize={14}
        fontColor="#333"
        padding={12}
        itemHeight={40}
        gap={8}
        titleStyle={{ fontSize: 14 }}
        valueStyle={{ fontSize: 12 }}
      />
    </div>
  );
};

export default BarChart;