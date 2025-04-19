import React, { useState, useEffect } from 'react';
import HeatMap from '@uiw/react-heat-map';

const AchievementCal = ({ selectedYear }) => {
  const [value, setValue] = useState([
    { date: '2025/01/11', count:2 },
    ...[...Array(17)].map((_, idx) => ({ date: `2025/01/${idx + 10}`, count: idx })),
    ...[...Array(17)].map((_, idx) => ({ date: `2025/02/${idx + 10}`, count: idx })),
    { date: '2025/04/12', count:2 },
    { date: '2025/05/01', count:5 },
    { date: '2025/05/02', count:5 },
    { date: '2025/05/03', count:1 },
    { date: '2025/05/04', count:11 },
    { date: '2025/05/08', count:32 },
  ]); // value 상태 초기화
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 로딩 시작
      try {
        const response = await fetch(`http://10.10.98.13:8080/members/1/solved-counts?year=${selectedYear}`); // 백엔드 API 호출


        const data = await response.json(); // JSON 데이터 파싱
        setValue(data); // value 상태 업데이트
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchData();
  }, [selectedYear]); // selectedYear가 변경될 때마다 데이터 요청

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 상태 표시
  }

  return (
    <div className="relative h-full">
      <div className="h-[400px] overflow-auto">
        <HeatMap
          value={value} // 백엔드에서 가져온 데이터 전달
          width={600}
          style={{ '--rhm-rect': '#b9b9b9' }}
          startDate={new Date('2025/01/01')}
          legendRender={(props) => <rect {...props} y={props.y + 10} rx={5} />}
          rectProps={{
            rx: 5
          }}
        />
      </div>
    </div>
  );
};

export default AchievementCal;


// import React, { useState } from 'react';
// import HeatMap from '@uiw/react-heat-map';

// const value = [
//   { date: '2025/01/11', count:2 },
//   ...[...Array(17)].map((_, idx) => ({ date: `2025/01/${idx + 10}`, count: idx })),
//   ...[...Array(17)].map((_, idx) => ({ date: `2025/02/${idx + 10}`, count: idx })),
//   { date: '2025/04/12', count:2 },
//   { date: '2025/05/01', count:5 },
//   { date: '2025/05/02', count:5 },
//   { date: '2025/05/03', count:1 },
//   { date: '2025/05/04', count:11 },
//   { date: '2025/05/08', count:32 },
// ];

// const AchievementCal = ({ selectedYear }) => {
//   const filteredValue = value.filter((item) =>
//     item.date.startsWith(selectedYear)
//   );

//   return (
//     <div>

//       <HeatMap
//         value={value}
//         width={600}
//         style={{ '--rhm-rect': '#b9b9b9' }}
//         startDate={new Date('2025/01/01')}
//         legendRender={(props) => <rect {...props} y={props.y + 10} rx={5} />}
//         rectProps={{
//           rx: 5
//         }}
//       />
//     </div>
//   )
// };
// export default AchievementCal