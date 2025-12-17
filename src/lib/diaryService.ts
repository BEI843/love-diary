// 移除Supabase客户端导入，使用API路由

export interface DiaryEntry {
  id?: string;
  created_at: string;
  content: string;
  mood?: string;
}

/**
 * 保存日记条目到数据库
 * @param entry 日记条目对象
 * @returns 保存结果和数据
 */
export async function saveDiaryEntry(entry: DiaryEntry) {
  try {
    // 客户端表单验证
    if (!entry.date || !entry.content.trim()) {
      return { success: false, error: '日期和内容不能为空' };
    }

    // 调用API保存日记
    const response = await fetch('/api/diary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '保存日记失败');
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error('保存日记时出错:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 获取所有日记条目
 * @returns 日记条目数组
 */
export async function getDiaryEntries() {
  try {
    const response = await fetch('/api/diary');
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '获取日记失败');
    }

    return { success: true, data: result as DiaryEntry[] };
  } catch (error: any) {
    console.error('获取日记时出错:', error.message);
    return { success: false, error: error.message };
  }
}