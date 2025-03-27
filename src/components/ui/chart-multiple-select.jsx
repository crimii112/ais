import React, { useEffect, useRef, useState } from 'react';

export default function CustomMultiSelect({
  options,
  setOutsideSelectedOptions,
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef(null);
  const scrollRef = useRef();

  const addOption = option => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    }
    setIsOpen(false); // 드롭다운 닫기
  };

  const removeOption = option => {
    setSelectedOptions(selectedOptions.filter(o => o !== option));
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 휠 스크롤 핸들러
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = e => {
      // 세로 스크롤 막고 가로로 이동
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    // 👇 이벤트 직접 등록 (passive: false)
    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: 'smooth', // 부드럽게 스크롤
      });
    }

    setOutsideSelectedOptions(selectedOptions);
  }, [selectedOptions]);

  return (
    <div ref={wrapperRef} className="w-140 whitespace-normal relative">
      {/* 셀렉트 박스 */}
      <div
        ref={scrollRef}
        className="h-[50px] border border-gray-300 rounded p-2 cursor-pointer overflow-x-auto scrollbar-hide"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 h-full min-w-fit w-max">
          {selectedOptions.length === 0 && (
            <span className="text-gray-400 text-sm">Select</span>
          )}

          {selectedOptions.map(option => (
            <div
              key={option.value}
              className="border-2 border-blue-900 px-2 py-0.5 rounded flex items-center gap-0.5"
              onClick={e => {
                e.stopPropagation();
                removeOption(option);
              }}
            >
              <span className="truncate overflow-hidden whitespace-nowrap">
                {option.text}
              </span>
              &nbsp; &times;
            </div>
          ))}
        </div>
      </div>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto z-10">
          {options
            .filter(option => !selectedOptions.includes(option))
            .map(option => (
              <div
                key={option.value}
                onClick={() => addOption(option)}
                className="p-2 cursor-pointer hover:bg-blue-100"
              >
                {option.text}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
