'use client';

import { useState } from 'react';
import { saveDiaryEntry, DiaryEntry } from '@/lib/diaryService';
import { useRouter } from 'next/navigation';

export default function DiaryEdit() {
  const [formData, setFormData] = useState<DiaryEntry>({
    created_at: new Date().toISOString().split('T')[0],
    content: '',
    mood: 'happy'
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await saveDiaryEntry(formData);
      if (result.success) {
        setSuccess(true);
        // 重置表单或导航回列表
        setTimeout(() => {
          setSuccess(false);
          setFormData(prev => ({ ...prev, content: '' }));
          router.push('/diary');
        }, 2000);
      } else {
        setError(result.error || '保存日记失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">添加日记</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          日记保存成功！
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日期
          </label>
          <input
            type="date"
            name="created_at"
            value={formData.created_at}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            心情
          </label>
          <select
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="happy">开心</option>
            <option value="sad">难过</option>
            <option value="angry">生气</option>
            <option value="worried">担心</option>
            <option value="excited">兴奋</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日记内容
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="今天发生了什么事？"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md transition-colors disabled:bg-pink-300"
        >
          {isLoading ? '保存中...' : '保存日记'}
        </button>
      </form>
    </div>
  );
}