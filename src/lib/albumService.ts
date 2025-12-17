// 移除Supabase客户端导入，使用API路由

export interface Photo {
  id?: string;
  url: string;
  caption: string;
  date?: string;
}

/**
 * 上传照片到相册
 * @param file 照片文件
 * @param caption 照片描述
 * @returns 上传结果
 */
export async function uploadPhoto(file: File, caption?: string) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) formData.append('caption', caption);

    const response = await fetch('/api/album', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '照片上传失败');
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error('上传照片时出错:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 获取所有相册照片
 * @returns 照片数组
 */
export async function getPhotos() {
  try {
    const response = await fetch('/api/album');
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '获取照片失败');
    }

    return { success: true, data: result as Photo[] };
  } catch (error: any) {
    console.error('获取照片时出错:', error.message);
    return { success: false, error: error.message };
  }
}