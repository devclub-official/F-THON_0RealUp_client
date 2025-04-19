import React, { useState, useRef, useEffect } from 'react';
import AchievementCal from './Achievement';
import BubbleChartView from './BubbleChart';
import GaugeChart from './GaugeChart';
import logo from '../assets/logo.png';
import ReactMarkdown from 'react-markdown';
import { Bell, Menu, Search, User, ArrowLeft, MessageSquare, Code, ThumbsUp, ThumbsDown } from 'lucide-react';

const ThreePanelLayout = () => {
    const [selectedYear, setSelectedYear] = useState('2025');
    const [listItems, setListItems] = useState(
        Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            title: `문제 ${i + 1}`,
            category: ['알고리즘', '데이터 구조', '수학', 'SQL', '그래프 이론'][i % 5],
            difficulty: ['쉬움', '보통', '어려움'][i % 3],
            solved: i % 3 === 0,
            date: new Date(2023, 7, i + 1).toLocaleDateString(),
            //     code: `function solution${i + 1}(input) {\n  // 문제 해결 코드\n  const result = input.map(x => x * 2);\n  return result.reduce((a, b) => a + b, 0);\n}`,
            //     feedback: `이 코드는 효율적으로 작성되었지만, 시간 복잡도를 O(n)에서 더 개선할 수 있습니다. 
            // reduce 함수를 사용하는 대신 for 루프를 사용하면 약간의 성능 향상이 있을 수 있습니다.
            // 또한 edge case 처리가 필요할 수 있습니다 - 빈 배열이 입력될 경우를 고려해보세요.`
        }))
    ); // 리스트 상태 초기화
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [selectedItem, setSelectedItem] = useState(null);
    const [code, setCode] = useState(''); // 코드 상태
    const [feedback, setFeedback] = useState(''); // 피드백 상태
    const [showDetails, setShowDetails] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false); // 알림 표시 상태
    const [notifications, setNotifications] = useState([
        { id: 1, message: '새로운 메일이 도착했습니다.', date: '2025-04-19' },
        { id: 2, message: '새로운 메일이 도착했습니다.', date: '2025-04-19' },
    ]); // 알림 데이터
    const dropdownRef = useRef(null); // 드롭다운 참조

    // 가상 데이터 - 스크롤 가능한 리스트용
    // const listItems = Array.from({ length: 20 }, (_, i) => ({
    //     id: i + 1,
    //     title: `문제 ${i + 1}`,
    //     category: ['알고리즘', '데이터 구조', '수학', 'SQL', '그래프 이론'][i % 5],
    //     difficulty: ['쉬움', '보통', '어려움'][i % 3],
    //     solved: i % 3 === 0,
    //     date: new Date(2023, 7, i + 1).toLocaleDateString(),
    //     //     code: `function solution${i + 1}(input) {\n  // 문제 해결 코드\n  const result = input.map(x => x * 2);\n  return result.reduce((a, b) => a + b, 0);\n}`,
    //     //     feedback: `이 코드는 효율적으로 작성되었지만, 시간 복잡도를 O(n)에서 더 개선할 수 있습니다. 
    //     // reduce 함수를 사용하는 대신 for 루프를 사용하면 약간의 성능 향상이 있을 수 있습니다.
    //     // 또한 edge case 처리가 필요할 수 있습니다 - 빈 배열이 입력될 경우를 고려해보세요.`
    // }));

    // 백엔드에서 listItems 데이터 가져오기
    useEffect(() => {
        const fetchListItems = async () => {
            setLoading(true); // 로딩 시작
            try {
                const response = await fetch('http://10.10.98.13:8080/feedbacks?memberId=1'); // 백엔드 API 호출
                const data = await response.json(); // JSON 데이터 파싱
                setListItems(data); // 리스트 상태 업데이트
            } catch (error) {
                console.error('리스트 데이터를 가져오는 중 오류 발생:', error);
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchListItems();
    }, []); // 컴포넌트가 마운트될 때 한 번 실행


    const toggleNotifications = () => {
        setShowNotifications((prev) => !prev); // 알림 표시 상태 토글
    };

    const handleUserClick = async () => {
        try {
            const response = await fetch('http://10.10.98.13:8080/member/1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'user_clicked' }), // 요청 본문 데이터
            });

            if (!response.ok) {
                throw new Error('서버 응답이 올바르지 않습니다.');
            }

            const result = await response.json();
            console.log('백엔드 응답:', result);
        } catch (error) {
            console.error('POST 요청 중 오류 발생:', error);
        }
    };

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false); // 드롭다운 닫기
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemClick = async (item) => {
        setSelectedItem(item); // 선택된 항목 설정
        try {
            const response = await fetch(`http://10.10.98.13:8080/feedbacks/${item.id}`); // 백엔드 API 호출
            const data = await response.json(); // JSON 데이터 파싱
            setCode(data.code); // 코드 업데이트
            setFeedback(data.feedback); // 피드백 업데이트
            setShowDetails(true); // 상세 정보 보기 상태 변경
        } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const handleBackClick = () => {
        setShowDetails(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* 상단 바 - 모던한 디자인 */}
            <header className="w-full bg-white shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-4">
                        {/* Menu 대신 이미지 추가 */}
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-8 w-8 object-cover"
                        />
                        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                            코드핏
                        </h1>
                    </div>

                </div>

                {/* 검색창 */}
                <div className="relative max-w-md w-full hidden md:block">
                    <input
                        type="text"
                        placeholder="문제 검색..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        className="relative p-1.5 rounded-full hover:bg-gray-100"
                        onClick={toggleNotifications} // 클릭 시 알림 표시 상태 토글
                    >
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="p-1 rounded-full bg-indigo-100" onClick={handleUserClick}>
                        <User className="h-5 w-5 text-indigo-600" />
                    </button>
                    {/* 알림 드롭다운 */}
                    {showNotifications && (
                        <div
                            ref={dropdownRef} // 드롭다운 참조 설정
                            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10"
                            style={{ top: '40px' }} // Bell 아이콘 바로 아래로 위치
                        >
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-800">알림</h3>
                            </div>
                            <ul className="max-h-60 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <li
                                            key={notification.id}
                                            className="p-4 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <p className="text-sm text-gray-700">{notification.message}</p>
                                            <p className="text-xs text-gray-500">{notification.date}</p>
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-4 text-sm text-gray-500">알림이 없습니다.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* 메인 콘텐츠 영역 - 조건부 레이아웃 */}
            {!showDetails ? (
                // 기본 삼단 레이아웃
                <div className="flex flex-1 overflow-hidden p-4 gap-4">
                    {/* 좌측 영역 - 차트와 캘린더 */}
                    <div className="w-3/5 flex flex-col gap-4 overflow-hidden">
                        <div className="bg-white rounded-xl shadow-sm p-6 flex-[2] overflow-hidden">
                            {/* 성취도 캘린더 헤더 */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-purple-600 tracking-wide">
                                    성취도 캘린더
                                </h2>
                                {/* 년도 선택 드롭다운 */}
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                </select>
                            </div>

                            {/* 성취도 캘린더 */}
                            <AchievementCal selectedYear={selectedYear} />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 flex-[3] overflow-auto">
                            <h2 className="text-lg font-bold text-purple-500 tracking-wide mb-4">
                                해결 분야 분석
                            </h2>
                            <div className="overflow-auto">
                                <GaugeChart />
                            </div>
                        </div>
                    </div>

                    {/* 우측 영역 - 리스트 뷰 */}
                    <div className="w-2/5 bg-white rounded-xl shadow-sm p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-purple-600">최근 문제</h2>

                        </div>

                        {/* 스크롤 가능한 리스트 */}
                        <div className="overflow-y-auto h-[calc(100%-3rem)] pr-2">
                            <ul className="space-y-3">
                                {listItems.map(item => (
                                    <li
                                        key={item.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                                <div className="flex items-center mt-1 space-x-2">
                                                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                        {item.category}
                                                    </span>
                                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${item.difficulty === '쉬움' ? 'bg-green-100 text-green-800' :
                                                        item.difficulty === '보통' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {item.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <p className="text-base text-gray-700 font-medium">{item.date}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                // 상세 정보 전체화면 뷰
                <div className="flex flex-1 overflow-hidden p-4">
                    <div className="w-full bg-white rounded-xl shadow-sm p-6 overflow-hidden flex flex-col">
                        <div className="flex items-center mb-4">
                            <button
                                className="mr-2 p-1.5 rounded-full hover:bg-gray-100"
                                onClick={handleBackClick}
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <h2 className="text-lg font-semibold text-gray-800">{selectedItem?.title}</h2>

                            <div className="flex ml-4 space-x-2">
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                    {selectedItem?.category}
                                </span>
                                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${selectedItem?.difficulty === '쉬움' ? 'bg-green-100 text-green-800' :
                                    selectedItem?.difficulty === '보통' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {selectedItem?.difficulty}
                                </span>

                            </div>
                        </div>

                        <div className="flex flex-1 gap-6 overflow-hidden">
                            {/* 코드 섹션 */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="flex items-center mb-2">
                                    <Code className="h-5 w-5 text-gray-600 mr-2" />
                                    <h3 className="font-medium text-gray-800">작성 코드</h3>
                                </div>
                                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono h-full">
                                    <ReactMarkdown>{code || '코드를 불러오는 중...'}</ReactMarkdown>
                                </pre>
                            </div>

                            {/* AI 피드백 섹션 */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="flex items-center mb-2">
                                    <MessageSquare className="h-5 w-5 text-gray-600 mr-2" />
                                    <h3 className="font-medium text-gray-800">AI 피드백</h3>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                                    <p className="text-sm text-gray-700 whitespace-pre-line">
                                        <ReactMarkdown>{feedback || '피드백을 불러오는 중...'}</ReactMarkdown>
                                    </p>
                                </div>

                                {/* 피드백 평가 버튼 */}
                                <div className="flex items-center space-x-2">
                                    <button className="flex items-center text-sm text-gray-600 hover:text-indigo-600 px-3 py-1.5 border border-gray-300 rounded-md">
                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                        유용해요
                                    </button>
                                    <button className="flex items-center text-sm text-gray-600 hover:text-indigo-600 px-3 py-1.5 border border-gray-300 rounded-md">
                                        <ThumbsDown className="h-4 w-4 mr-1" />
                                        개선 필요
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThreePanelLayout;