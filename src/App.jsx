import React, { useState } from 'react';
import ThreePanelLayout from './components/ThreePanelLayout';
import OnboardingForm from './components/OnboardingForm'; // 온보딩 폼 import

function App() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [userData, setUserData] = useState(null); // 선택된 온보딩 데이터 저장

  const handleOnboardingComplete = (formData) => {
    setUserData(formData);          // 선택된 데이터 저장 (원하면 서버에 전송 가능)
    setOnboardingDone(true);        // 온보딩 완료 플래그 ON
  };

  return (
    <div>
      {!onboardingDone ? (
        <OnboardingForm onComplete={handleOnboardingComplete} />
      ) : (
        <ThreePanelLayout userData={userData} />
      )}
    </div>
  );
}

export default App;
