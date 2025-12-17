'use client';

import { useState, useEffect } from 'react';
import { getDiaryEntries } from '@/lib/diaryService';
import Link from 'next/link';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 日记类型定义
interface DiaryEntry {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function DiaryPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2025-08-27'));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2025-08-27'));
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);

  // 初始化日历日期
  useEffect(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    setDaysInMonth(days);
  }, [currentDate]);

  // 获取选中日期的日记
  useEffect(() => {
    const fetchDiaryEntry = async () => {
      setIsLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      const result = await getDiaryEntries();
const entry = result.success ? result.data.find(item => item.created_at.startsWith(dateStr)) : null;

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching diary entry:', error);
      } else if (data) {
  setDiaryEntry(data);
} else {
  // 如果没有找到日记，创建一个空的
  setDiaryEntry({ id: '', content: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
}

      setIsLoading(false);
    };

    fetchDiaryEntry();
  }, [selectedDate]);

  // 切换月份
  const handlePrevMonth = () => {
    setCurrentDate(subDays(startOfMonth(currentDate), 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addDays(endOfMonth(currentDate), 1));
  };

  // 格式化日期显示
  const formatDateDisplay = (date: Date) => {
    return format(date, 'yyyy年MM月dd日', { locale: zhCN });
  };

  // 格式化月份标题
  const formatMonthTitle = (date: Date) => {
    return format(date, 'yyyy年MM月', { locale: zhCN });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/home" className="text-pink-500 hover:text-pink-700 transition-colors">
          ← 返回主页
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-pink-600">恋爱日记</h1>
        <div className="w-12"></div> {/* 占位元素，保持标题居中 */}
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 日历侧边栏 */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePrevMonth}
              className="text-pink-500 hover:text-pink-700 transition-colors"
            >
              ← 上月
            </button>
            <h2 className="text-xl font-semibold text-pink-600">{formatMonthTitle(currentDate)}</h2>
            <button
              onClick={handleNextMonth}
              className="text-pink-500 hover:text-pink-700 transition-colors"
            >
              下月 →
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm text-gray-500">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="py-2 font-medium">{day}</div>
            ))}
          </div>

          {/* 日历日期网格 */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map(day => {
              const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
              const isPast = day <= new Date();
              const isFuture = day > new Date();
              const hasEntry = diaryEntry?.created_at.startsWith(format(day, 'yyyy-MM-dd')) && diaryEntry?.content.trim() !== '';

              return (
                <button
                  key={format(day, 'yyyy-MM-dd')}
                  onClick={() => setSelectedDate(day)}
                  disabled={isFuture}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center transition-all
                    ${isSelected ? 'bg-pink-500 text-white font-bold' : ''}
                    ${!isSelected && isPast ? 'hover:bg-pink-100 cursor-pointer' : ''}
                    ${isFuture ? 'text-gray-300 cursor-not-allowed' : ''}
                    ${hasEntry && !isSelected ? 'ring-2 ring-pink-300' : ''}
                  `}
                >
                  <span>{format(day, 'd')}</span>
                  {hasEntry && !isSelected && (
                    <span className="absolute w-1 h-1 bg-pink-500 rounded-full mt-4"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 日记内容区域 */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-pink-600">{formatDateDisplay(selectedDate)}</h2>
            <Link
              href={`/diary/edit?date=${format(selectedDate, 'yyyy-MM-dd')}`}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              编辑日记
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-pink-400 animate-spin">加载中...</div>
            </div>
          ) : diaryEntry?.content ? (
            <div className="min-h-[400px] prose max-w-none text-gray-700 leading-relaxed">
              {diaryEntry.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg mb-6">今天还没有写日记哦~</p>
              <Link
                href={`/diary/edit?date=${format(selectedDate, 'yyyy-MM-dd')}`}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
              >
                开始记录美好瞬间
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}