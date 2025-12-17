'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 移除重复的LockScreen定义，保留优化后的版本
function LockScreen() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  // 添加短语样式状态
  const [phraseStyles, setPhraseStyles] = useState([]);

  // 浪漫短语数组
  const romanticPhrases = [
    '我爱你',
    '永远在一起',
    '甜蜜时光',
    '心有灵犀',
    '不离不弃',
    '相濡以沫',
    '命中注定',
    '爱的约定',
    '浪漫满屋',
    '情深似海',
    '天长地久',
    '心心相印',
    '一见钟情',
    '真爱永恒',
    '此生不渝'
  ];

  // 密码验证处理
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (password === 'ZCX99SJY') {
        router.push('/home');
      } else {
        setError('密码不正确');
        setTimeout(() => setError(''), 2000);
      }
    }
  };

  // 生成短语样式 - 仅客户端执行
  useEffect(() => {
    const styles = romanticPhrases.map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${5 + Math.random() * 15}s`,
      animationDelay: `${Math.random() * 5}s`,
      transform: `rotate(${Math.random() * 40 - 20}deg)`,
      zIndex: 1
    }));
    setPhraseStyles(styles);
  }, []);

  // 生成飘落爱心背景
  useEffect(() => {
    const container = document.getElementById('falling-hearts-container');
    if (!container) return;

    const createHeart = () => {
      const heart = document.createElement('div');
      heart.className = 'text-pink-400 absolute';
      heart.innerHTML = '❤️';
      heart.style.top = '-10%';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${10 + Math.random() * 20}px`;
      heart.style.opacity = Math.random() + 0.3;
      heart.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
      heart.style.animation = `fall ${3 + Math.random() * 5}s linear`;
      container.appendChild(heart);

      setTimeout(() => heart.remove(), 5000);
    };

    const interval = setInterval(createHeart, 300);
    return () => clearInterval(interval);
  }, []);

  // 浮动爱心生成逻辑
  useEffect(() => {
    const container = document.getElementById('floating-hearts-container');
    if (!container) return;
  
    const createFloatingHeart = () => {
      const heart = document.createElement('div');
      heart.className = 'text-pink-200 absolute opacity-80 animate-float';
      heart.innerHTML = '💖';
      heart.style.top = `${Math.random() * 100}%`;
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${20 + Math.random() * 16}px`;
      heart.style.animationDuration = `${3 + Math.random() * 4}s`;
      heart.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(heart);
  
      setTimeout(() => heart.remove(), 12000);
    };
  
    const interval = setInterval(createFloatingHeart, 700);
    return () => clearInterval(interval);
  }, []);

  // 粒子背景效果
  useEffect(() => {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 1;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const opacity = Math.random() * 0.5 + 0.1;
      const animationDuration = Math.random() * 8 + 4;
    
      particle.className = 'absolute bg-white/70 rounded-full animate-float';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.top = `${top}%`;
      particle.style.opacity = opacity;
      particle.style.animationDuration = `${animationDuration}s`;
    
      particlesContainer.appendChild(particle);
    
      setTimeout(() => particle.remove(), animationDuration * 1000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  // 创建星光背景效果
  useEffect(() => {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;

    const createStar = () => {
      const star = document.createElement('div');
      const size = Math.random() * 2 + 1;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const opacity = Math.random() * 0.8 + 0.2;
      const twinkleDuration = Math.random() * 3 + 2;
      const twinkleDelay = Math.random() * 2;

      star.className = 'absolute bg-white rounded-full';
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${left}%`;
      star.style.top = `${top}%`;
      star.style.opacity = opacity;
      star.style.animation = `twinkle ${twinkleDuration}s infinite alternate ${twinkleDelay}s`;

      starsContainer.appendChild(star);

      // 随机移除星星以创建闪烁效果
      if (Math.random() > 0.7) {
        setTimeout(() => star.remove(), (twinkleDuration + twinkleDelay) * 1000);
      }
    };

    // 初始创建一批星星
    for (let i = 0; i < 80; i++) {
      createStar();
    }

    // 定时创建新星星
    const interval = setInterval(createStar, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lock-screen-container min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-600/40 via-purple-700/30 to-blue-600/40 overflow-hidden">
      {/* 飘落爱心背景 */}
      <div id="falling-hearts-container" className="fixed inset-0 pointer-events-none"></div>
    
      {/* 浮动爱心装饰 */}
      <div className="fixed inset-0 pointer-events-none" id="floating-hearts-container"></div>
    
      {/* 粒子背景 */}
      <div className="fixed inset-0 pointer-events-none" id="particles-container"></div>
    
      {/* 浪漫光晕背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,105,180,0.5),transparent_70%)]"></div>
    
      {/* 星光背景 */}
      <div id="stars-container" className="fixed inset-0 pointer-events-none"></div>
    
      {/* 中央爱心容器 */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-50 w-full max-w-3xl px-4">
        <h1 className="text-7xl md:text-10xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-50 via-white to-purple-50 text-glow mb-4 animate-float animate-pulse" style={{animationDuration: '3s', textShadow: '0 0 30px rgba(255,255,255,1), 0 0 50px rgba(255,105,180,0.9), 0 0 70px rgba(255,105,180,0.8), 0 0 90px rgba(255,105,180,0.6)', WebkitTextStroke: '2px rgba(255,255,255,0.9)'}}>恋爱日记</h1>
        <p className="text-4xl md:text-6xl font-bold text-white text-glow mb-8 animate-float animate-pulse" style={{animationDuration: '3s', animationDelay: '0.5s', textShadow: '0 0 25px rgba(255,255,255,1), 0 0 45px rgba(255,105,180,0.9), 0 0 65px rgba(255,105,180,0.7)', WebkitTextStroke: '1.5px rgba(255,255,255,0.8)'}}>记录我们的爱情故事</p>
      </div>

      {/* 密码输入框容器 */}
      <div className="absolute bottom-64 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
        <div className="relative mt-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-white/20 backdrop-blur-md border border-white/40 rounded-full py-2 px-6 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
            placeholder="请输入浪漫密码"
            autoFocus
          />
        </div>
        {error && (
          <p className="text-pink-300 text-xs mt-2 animate-pulse text-center">
            {error}
          </p>
        )}
      </div>

      {/* 中央爱心装饰 */}
      <div className="clip-path-heart animate-heartbeat relative w-72 h-72 md:w-[420px] md:h-[420px] bg-white/35 backdrop-blur-2xl border-2 border-white/80 shadow-[0_0_70px_rgba(255,105,180,0.8),0_0_40px_rgba(255,255,255,0.7)] z-10 transition-all duration-700 hover:scale-105"></div>
    </div>
  );
}

export default LockScreen;