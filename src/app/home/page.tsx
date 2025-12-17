'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// 浪漫短语数据
const romanticPhrases = [
  '永远在一起', '甜蜜时光', '心有灵犀', '不离不弃',
  '相濡以沫', '命中注定', '爱的约定', '浪漫满屋'
];

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [phrases, setPhrases] = useState([]);
  const [heartScale, setHeartScale] = useState(1);

  // 生成飘落爱心效果
  useEffect(() => {
    const createHeart = () => {
      const heart = {
        id: Math.random(),
        top: -10,
        left: Math.random() * 100,
        size: Math.random() * 8 + 8,
        opacity: Math.random() * 0.4 + 0.3,
        color: ['text-pink-400', 'text-pink-300', 'text-red-300', 'text-purple-300'][Math.floor(Math.random() * 4)],
        animationDuration: Math.random() * 6 + 4,
        rotation: Math.random() * 40 - 20
      };
      setHearts(prev => [...prev.slice(-25), heart]);
    };

    const interval = setInterval(createHeart, 400);
    return () => clearInterval(interval);
  }, []);

  // 更新爱心位置
  useEffect(() => {
    const timer = setInterval(() => {
      setHearts(prev => prev.map(heart => ({
        ...heart,
        top: heart.top + (heart.animationDuration * 0.5) / 20,
        rotation: heart.rotation + (Math.random() * 2 - 1)
      })));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // 浪漫短语浮动效果
  useEffect(() => {
    const styles = romanticPhrases.map(() => ({
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      animationDuration: `${8 + Math.random() * 12}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2,
      transform: `rotate(${Math.random() * 30 - 15}deg)`,
      fontSize: `${Math.random() * 12 + 10}px`
    }));
    setPhrases(styles);
  }, []);

  // 动态爱心缩放动画
  useEffect(() => {
    const scaleInterval = setInterval(() => {
      setHeartScale(prev => prev === 1 ? 1.03 : 1);
    }, 2000);
    return () => clearInterval(scaleInterval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 overflow-hidden relative">
      {/* 背景网格 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,192,203,0.1)_1px,transparent_1px)] bg-[length:30px_30px]"></div>

      {/* 飘落爱心 */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className={`absolute ${heart.color} transition-all ease-in-out`}
          style={{
            top: `${heart.top}%`,
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            transform: `rotate(${heart.rotation}deg)`,
            pointerEvents: 'none',
            transition: `top ${heart.animationDuration}s ease-in-out`
          }}
        >
          ❤️
        </div>
      ))}

      {/* 浪漫短语 */}
      {phrases.map((phrase, index) => (
        <div
          key={index}
          className="absolute text-pink-200 font-light transition-all"
          style={phrase}
        >
          {romanticPhrases[index]}
        </div>
      ))}

      {/* 新的动态大爱心容器 */}
      <div 
        className="relative w-[85vw] h-[85vw] max-w-md max-h-md transition-all duration-700 transform"
        style={{ transform: `scale(${heartScale})` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 爱心形状背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-red-500 to-pink-600 rounded-full shadow-[0_0_40px_rgba(255,105,180,0.6),0_0_80px_rgba(255,105,180,0.3)] transition-all duration-700"></div>
        <div className="absolute inset-6 bg-white/90 backdrop-blur-md rounded-full flex flex-col items-center justify-center p-8 shadow-inner">
          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-pink-600 to-red-500 mb-10 tracking-wide animate-pulse letter-spacing-1">我们恋爱吧</h1>

          {/* 按钮容器 */}
          <div className="flex flex-col gap-6 w-full max-w-xs">
            {/* 恋爱日记按钮 */}
            <Link
              href="/diary"
              className="group relative h-16 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg hover:shadow-pink-300/30 transition-all duration-500 hover:from-pink-400 hover:to-pink-600 hover:scale-105"
            >
              恋爱日记
              <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></span>
              <span className="absolute -inset-1 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-70 transition duration-500"></span>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/10 text-4xl">📖</span>
            </Link>

            {/* 恋爱相册按钮 */}
            <Link
              href="/album"
              className="group relative h-16 bg-gradient-to-r from-blue-300 to-mint-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg hover:shadow-blue-300/30 transition-all duration-500 hover:from-blue-400 hover:to-mint-500 hover:scale-105"
            >
              恋爱相册
              <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></span>
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-mint-400 rounded-full blur opacity-0 group-hover:opacity-70 transition duration-500"></span>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/10 text-4xl">🖼️</span>
            </Link>
          </div>

          {/* 日期显示 */}
          <div className="text-pink-200 text-sm font-light tracking-wide mt-8">
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* 装饰爱心 */}
      <div className="absolute top-10 left-10 text-pink-300 text-2xl animate-bounce" style={{ animationDuration: '3s' }}>❤️</div>
      <div className="absolute bottom-10 right-10 text-blue-300 text-3xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>💙</div>
      <div className="absolute top-20 right-16 text-mint-300 text-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>💚</div>
      <div className="absolute bottom-20 left-10 text-purple-300 text-2xl animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>💜</div>
    </div>
  );
}