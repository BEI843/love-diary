'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DiaryEntry {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function DiaryEditPage() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 获取URL中的日期参数
  useEffect(() => {
    const dateStr = searchParams.get('date');
    if (dateStr) {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        fetchDiaryEntry(dateStr);
      } else {
        router.push('/diary');
      }
    } else {
      router.push('/diary');
    }
  }, [searchParams, router]);

  // 获取日记内容
  const fetchDiaryEntry = async (dateStr: string) => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('created_at', dateStr)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching diary entry:', error);
    } else if (data) {
      setContent(data.content);
    } else {
      setContent('');
    }

    setIsLoading(false);
  };

  // 保存日记
  const saveDiaryEntry = async () => {
    if (!date || !content.trim()) return;

    setIsSaving(true);
    const dateStr = format(date, 'yyyy-MM-dd');

    // 检查日记是否已存在
    const { data: existingEntry } = await supabase
      .from('diary_entries')
      .select('id')
      .eq('created_at', dateStr)
      .single();

    let result;
    if (existingEntry) {
      // 更新现有日记
      result = await supabase
        .from('diary_entries')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingEntry.id);
    } else {
      // 创建新日记
      result = await supabase
        .from('diary_entries')
        .insert([{
          created_at: dateStr,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
    }

    const { error } = result;
    if (error) {
      console.error('Error saving diary entry:', error);
      alert('保存失败，请重试');
    } else {
      router.push('/diary');
    }

    setIsSaving(false);
  };

  // 格式化日期显示
  const formatDateDisplay = (date: Date) => {
    return format(date, 'yyyy年MM月dd日', { locale: zhCN });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="text-pink-400 animate-spin">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push('/diary')}
          className="text-pink-500 hover:text-pink-700 transition-colors"
        >
          ← 返回日记
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-pink-600">编辑日记</h1>
        <div className="w-12"></div> {/* 占位元素，保持标题居中 */}
      </div>

      {date && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-pink-600">{formatDateDisplay(date)}</h2>
          </div>

          {/* 日记编辑器 */}
          <div className="mb-8">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] p-6 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all resize-none font-medium text-gray-700"
              placeholder="今天发生了什么美好的事情呢？记录下你们的恋爱瞬间吧..."
            ></textarea>
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-center">
            <button
              onClick={saveDiaryEntry}
              disabled={isSaving || !content.trim()}
              className={`px-8 py-3 rounded-full font-bold transition-all ${isSaving || !content.trim() ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl'}`}
            >
              {isSaving ? '保存中...' : '保存日记'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}