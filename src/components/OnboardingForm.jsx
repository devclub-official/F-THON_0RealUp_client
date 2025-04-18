import React, { useState } from "react";

const levelOptions = ["입문", "중급", "상급"];
const dailyOptions = [1, 2, 3];
const problemTypes = ["수학", "구현", "탐욕", "문자열", "그래프", "dp","기하학"];
const hardTypes = ["DFS", "다익스트라", "세그먼트 트리"];

const OnboardingForm = ({ onComplete }) => {
  const [level, setLevel] = useState("");
  const [dailyCount, setDailyCount] = useState("");
  const [mostSolved, setMostSolved] = useState([]);
  const [hardest, setHardest] = useState([]);


  const [formData, setFormData] = useState({
    level: "",
    dailyGoal: "",
    problemTypes: [],
    hardTypes: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 상태 관리
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지 상태

  const handleCheckbox = (value, list, setter) => {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  const problemMapping = {
    수학: "math",
    구현: "implementation",
    탐욕: "greedy",
    문자열: "string",
    "데이터 구조": "data_structures",
    그래프: "graphs",
    dp: "dp",
    기하학: "geometry",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // 제출 상태 시작
    setSuccessMessage(""); // 성공 메시지 초기화

    const mostSolvedMapping = problemMapping[formData.mostSolved] || null;
    
    const onboardingData = {
      level,
      dailyCount,
      mostSolvedMapping,
      hardest,
    };
    if (onComplete) {
      onComplete(onboardingData);
    }

    try {
      const response = await fetch("http://10.10.98.13:8080/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData), // 폼 데이터를 JSON으로 변환하여 전송
      });

      if (!response.ok) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      const result = await response.json();
      console.log("백엔드 응답:", result);

      // 성공 메시지 설정
      setSuccessMessage("온보딩 설정이 완료되었습니다!");
    } catch (error) {
      console.error("데이터 전송 중 오류 발생:", error);
      setSuccessMessage("온보딩 설정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false); // 제출 상태 종료
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl border border-pink-200 space-y-8"
    >
      <h2 className="text-3xl font-extrabold text-purple-600 text-center mb-4">
        나만의 코딩 루트 시작하기 💜
      </h2>

      {/* 현재 수준 */}
      <div>
        <label className="block text-lg font-semibold text-purple-700 mb-2">
          현재 수준
        </label>
        <div className="flex gap-4">
          {levelOptions.map((option) => (
            <label
              key={option}
              className={`cursor-pointer px-4 py-2 rounded-xl border-2 ${
                level === option
                  ? "bg-pink-100 border-pink-500 text-purple-700 font-bold"
                  : "border-gray-300 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <input
                type="radio"
                name="level"
                value={option}
                checked={level === option}
                onChange={() => setLevel(option)}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* 하루에 풀 문제 수 */}
      <div>
        <label className="block text-lg font-semibold text-purple-700 mb-2">
          하루에 풀 문제 수
        </label>
        <div className="flex gap-4">
          {dailyOptions.map((count) => (
            <label
              key={count}
              className={`cursor-pointer px-4 py-2 rounded-xl border-2 ${
                dailyCount === count.toString()
                  ? "bg-pink-100 border-pink-500 text-purple-700 font-bold"
                  : "border-gray-300 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <input
                type="radio"
                name="dailyCount"
                value={count}
                checked={dailyCount === count.toString()}
                onChange={() => setDailyCount(count.toString())}
                className="hidden"
              />
              {count}문제
            </label>
          ))}
        </div>
      </div>

      {/* 가장 많이 푼 문제 유형 */}
      <div>
        <label className="block text-lg font-semibold text-purple-700 mb-2">
          가장 많이 푼 문제 유형
        </label>
        <div className="flex flex-wrap gap-3">
          {problemTypes.map((type) => (
            <label
              key={type}
              className={`cursor-pointer px-3 py-2 rounded-lg border-2 text-sm ${
                mostSolved.includes(type)
                  ? "bg-purple-100 border-purple-400 text-purple-800 font-semibold"
                  : "border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              <input
                type="checkbox"
                value={type}
                checked={mostSolved.includes(type)}
                onChange={() =>
                  handleCheckbox(type, mostSolved, setMostSolved)
                }
                className="hidden"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* 가장 어렵게 느껴지는 유형 */}
      <div>
        <label className="block text-lg font-semibold text-purple-700 mb-2">
          가장 어렵게 느껴지는 유형
        </label>
        <div className="flex flex-wrap gap-3">
          {hardTypes.map((type) => (
            <label
              key={type}
              className={`cursor-pointer px-3 py-2 rounded-lg border-2 text-sm ${
                hardest.includes(type)
                  ? "bg-purple-100 border-purple-400 text-purple-800 font-semibold"
                  : "border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              <input
                type="checkbox"
                value={type}
                checked={hardest.includes(type)}
                onChange={() => handleCheckbox(type, hardest, setHardest)}
                className="hidden"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="text-center pt-4">
        <button
          type="submit"
          className={`text-white px-6 py-3 rounded-full shadow-md hover:bg-pink-500 transition text-lg font-semibold
          ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-400 "}`}
          disabled={isSubmitting}
          >
            {isSubmitting ? "제출 중..." : "설정 완료"}
          </button>
      </div>
    </form>
  );
};

export default OnboardingForm;
