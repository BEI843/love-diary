import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { created_at, content, mood } = await request.json();

    if (!created_at || !content || isNaN(new Date(created_at).getTime())) {
      return NextResponse.json(
        { error: '日期和内容不能为空' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('diary_entries')
      .insert([{ content, mood, created_at: new Date(created_at).toISOString() }])
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: '日记保存成功',
      data,
    }, { status: 201 });
  } catch (error: any) {
    console.error('保存日记失败:', error.message);
    return NextResponse.json(
      { error: '保存日记失败: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('获取日记失败:', error.message);
    return NextResponse.json(
      { error: '获取日记失败: ' + error.message },
      { status: 500 }
    );
  }
}