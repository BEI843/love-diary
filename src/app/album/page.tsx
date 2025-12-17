'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Photo {
  id: string;
  date: string;
  url: string;
  created_at: string;
}

interface AlbumDay {
  date: string;
  photos: Photo[];
}

export default function AlbumPage() {
  const [albumDays, setAlbumDays] = useState<AlbumDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const albumRef = useRef<HTMLDivElement>(null);

  // 获取相册数据
  useEffect(() => {
    fetchAlbumData();
  }, []);

  // 从Supabase获取相册数据
  const fetchAlbumData = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('album_photos')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching album data:', error);
    } else if (data) {
      // 按日期分组照片
      const grouped: Record<string, Photo[]> = {};
      data.forEach(photo => {
        if (!grouped[photo.date]) {
          grouped[photo.date] = [];
        }
        grouped[photo.date].push(photo);
      });

      // 转换为数组格式
      const albumDaysArray: AlbumDay[] = Object.entries(grouped).map(([date, photos]) => ({
        date,
        photos
      }));

      setAlbumDays(albumDaysArray);
      if (albumDaysArray.length > 0) {
        setSelectedDate(albumDaysArray[0].date);
      }
    }

    setIsLoading(false);
  };

  // 处理右键点击进入编辑模式
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (albumRef.current && albumRef.current.contains(e.target as Node)) {
        e.preventDefault();
        setIsEditing(true);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // 获取当前选中日期的照片
  const currentPhotos = selectedDate
    ? albumDays.find(day => day.date === selectedDate)?.photos || []
    : [];

  // 处理照片粘贴
  useEffect(() => {
    if (!isEditing) return;

    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault();
      if (!selectedDate) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = await items[i].getAsBlob();
          await uploadPhoto(blob, selectedDate);
        }
      }

      setIsEditing(false);
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isEditing, selectedDate]);

  // 上传照片到Supabase Storage
  const uploadPhoto = async (blob: Blob, date: string) => {
    const fileName = `${date}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;

    // 上传图片
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('album_photos')
      .upload(fileName, blob, { contentType: 'image/png' });

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return;
    }

    // 获取图片URL
    const { data: urlData } = supabase
      .storage
      .from('album_photos')
      .getPublicUrl(fileName);

    // 保存图片信息到数据库
    const { error: dbError } = await supabase
      .from('album_photos')
      .insert([{
        date,
        url: urlData.publicUrl,
      }]);

    if (dbError) {
      console.error('Error saving photo to database:', dbError);
      return;
    }

    // 重新获取相册数据
    fetchAlbumData();
  };

  // 格式化日期显示
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 随机位置放置日期标签
  const getDateLabelPosition = () => {
    const positions = [
      'top-2 left-2', // 左上角
      'top-2 right-2', // 右上角
      'bottom-2 left-2', // 左下角
      'bottom-2 right-2', // 右下角
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  };

  // 翻页功能
  const nextPage = () => {
    if (currentPage < currentPhotos.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 处理日期选择
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCurrentPage(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-blue-400 animate-spin">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/home" className="text-blue-500 hover:text-blue-700 transition-colors">
          ← 返回主页
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600">恋爱相册</h1>
        <div className="w-12"></div> {/* 占位元素，保持标题居中 */}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 日期侧边栏 */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">相册日期</h2>

          {albumDays.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              暂无照片
              <p className="text-sm mt-2">右键点击相册区域可以添加照片</p>
            </div>
          ) : (
            <div className="space-y-3">
              {albumDays.map(day => (
                <button
                  key={day.date}
                  onClick={() => handleDateSelect(day.date)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${selectedDate === day.date ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
                >
                  <div className="font-medium">{formatDateDisplay(day.date)}</div>
                  <div className="text-sm text-gray-500">{day.photos.length} 张照片</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 相册浏览区域 */}
        <div className="lg:col-span-3" ref={albumRef}>
          {selectedDate ? (
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden h-[70vh] flex flex-col">
              {/* 相册标题 */}
              <div className="p-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-center">
                <h2 className="text-xl font-bold">{formatDateDisplay(selectedDate)}</h2>
                <p className="text-sm opacity-90">{currentPhotos.length} 张照片 · 第 {currentPage + 1}/{currentPhotos.length} 页</p>
              </div>

              {/* 相册内容区域 */}
              <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gray-100">
                {currentPhotos.length === 0 ? (
                  <div className="text-center text-gray-400 p-8">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-lg mb-2">该日期暂无照片</p>
                    <p className="text-sm">右键点击此区域可以粘贴添加照片</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    {/* 照片和翻页效果 */}
                    <div className="relative w-full max-w-md aspect-[3/4] mx-auto bg-white shadow-2xl transform transition-all duration-500 ease-in-out">
                      {/* 照片 */}
                      <div className="absolute inset-0 overflow-hidden">
                        <Image
                          src={currentPhotos[currentPage].url}
                          alt={`${selectedDate}的照片`}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="transition-opacity duration-300"
                        />

                        {/* 日期标签 */}
                        <div className={`absolute ${getDateLabelPosition()} bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold transform -rotate-6 shadow-lg`}>
                          {formatDateDisplay(selectedDate).split(' ')[1]}
                        </div>
                      </div>

                      {/* 翻页控制按钮 */}
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-500 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        ←
                      </button>
                      <button
                        onClick={nextPage}
                        disabled={currentPage === currentPhotos.length - 1}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-500 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${currentPage === currentPhotos.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        →
                      </button>
                    </div>

                    {/* 翻页动画效果 */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                      {/* 翻页阴影效果 */}
                    </div>
                  </div>
                )}
              </div>

              {/* 编辑提示 */}
              {isEditing && (
                <div className="p-4 bg-pink-50 text-pink-600 text-center">
                  <p className="font-medium">编辑模式</p>
                  <p className="text-sm">请粘贴图片 (Ctrl+V 或 Cmd+V)</p>
                </div>
              )}

              {/* 相册提示 */}
              {!isEditing && currentPhotos.length > 0 && (
                <div className="p-3 bg-gray-50 text-gray-500 text-center text-sm">
                  左键点击照片浏览 · 右键点击进入编辑模式
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 h-[70vh] flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-6">📔</div>
              <h2 className="text-2xl font-bold text-blue-500 mb-4">选择一个日期开始浏览</h2>
              <p className="text-gray-400 max-w-md">从左侧选择一个日期查看照片，或右键点击相册区域添加新照片</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}