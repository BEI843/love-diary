'use client';

import { useState } from 'react';
import { uploadPhoto } from '@/lib/albumService';

interface PhotoUploadProps {
  onUploadComplete?: () => void;
}

export default function PhotoUpload({ onUploadComplete }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('请选择一张照片');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadPhoto(selectedFile, caption);
      if (result.success) {
        setSuccess('照片上传成功！');
        setSelectedFile(null);
        setCaption('');
        // 重置文件输入
        (document.getElementById('photo-upload') as HTMLInputElement).value = '';
        // 通知父组件上传完成
        onUploadComplete?.();
      } else {
        setError(result.error || '照片上传失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">添加照片</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            选择照片
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              已选择: {selectedFile.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            照片描述
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="输入照片描述（可选）"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md transition-colors disabled:bg-pink-300"
        >
          {isLoading ? '上传中...' : '上传照片'}
        </button>
      </form>
    </div>
  );
}