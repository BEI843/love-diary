import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://utqqsjxqawxjgwqigcna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cXFzanhxYXd4amd3cWlnY25hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzUzODksImV4cCI6MjA4MDI1MTM4OX0.y4J4lyWZYn6GDWSNfM9kuwcz6z0zUbTLXwpXWkwMyVY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// 在supabase.ts文件末尾添加
async function testSupabaseConnection() {
  try {
    // 使用实际存在的表名替代'test'
    const { data, error } = await supabase.from('diary_entries').select('*').order('created_at', { ascending: false }).limit(1);
    if (error) throw error;
  if (data && data.length > 0) {
    console.log('✅ Supabase连接成功!');
    console.log('📊 测试数据:', data[0]);
  } else {
    console.log('✅ Supabase连接成功!');
    console.log('📊 测试数据: 表中暂无数据');
  }
  } catch (error) {
    console.error('❌ Supabase连接失败:', error.message);
    console.error('🔍 可能原因: 表diary_entries不存在或权限不足');
  }
}

// 仅在客户端环境执行连接测试
if (typeof window !== 'undefined') {
  testSupabaseConnection();
}