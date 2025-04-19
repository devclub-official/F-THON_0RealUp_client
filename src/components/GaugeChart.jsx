// components/GaugeChart.jsx
import React, { useState, useEffect } from "react";
import Gauge from "react-svg-gauge";

// const gauges = [
//   { value: 23, color: "#7561f2", label: "그리디" },
//   { value: 60, color: "#a857f9", label: "구현" },
//   { value: 50, color: "#a655f7", label: "DP" },
//   { value: 25, color: "#cc4fc9", label: "DFS" },
//   { value: 75, color: "#ca4ec7", label: "이분 탐색" },
//   { value: 64, color: "#e7499f", label: "그래프" },
// ];

const GaugeChart = () => {
  const [gauges, setGauges] = useState([{ value: 23, color: "#7561f2", label: "그리디" },
    { value: 60, color: "#a857f9", label: "수학" },
    { value: 50, color: "#ca4ec7", label: "DP" },
    { value: 25, color: "#d94198", label: "DFS" },
    { value: 75, color: "#e3459b", label: "기하학" },
    { value: 64, color: "#e7499f", label: "그래프" }]); // gauges 상태 초기화
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    const fetchGauges = async () => {
      setLoading(true); // 로딩 시작
      try {
        const response = await fetch("/api/gauges"); // 백엔드 API 호출
        const data = await response.json(); // JSON 데이터 파싱
        setGauges(data); // gauges 상태 업데이트
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchGauges();
  }, []); // 컴포넌트가 마운트될 때 한 번 실행

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 상태 표시
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      // style={{
      //   display: "flex",
      //   flexWrap: "wrap",
      //   justifyContent: "center",
      //   gap: "2rem",
      // }}
    >
      {gauges.map((g, idx) => (
        <div
          key={idx}
          style={{
            width: "160px",
            textAlign: "center",
          }}
        >
          <Gauge
            value={g.value}
            min={0}
            max={100}
            width={140}
            height={110}
            color={g.color}
            label={g.label}
            valueLabelStyle={{
              fontSize: "14px",
              fontWeight: "bold",
              fill: "#333",
            }}
            needleColor="#444"
            topLabelStyle={{
              fontSize: "13px",
              fill: "#555",
            }}
            minMaxLabelStyle ={{
              display: "none",

            }}

            
          />
        </div>
      ))}
    </div>
  );
};

export default GaugeChart;
