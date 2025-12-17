import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;

    if (!file) {
      return NextResponse.json(
        { error: '请选择要上传的照片' },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    // 上传文件到Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('album')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 获取公共URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('album')
      .getPublicUrl(filePath);

    // 保存照片信息到数据库
    const { data, error: dbError } = await supabase
  .from('photos')
  .insert([{
    url: publicUrl,
    caption: caption || '',
    date: new Date().toISOString()
  }])
  .select();

    if (dbError) throw dbError;

    return NextResponse.json({
      message: '照片上传成功',
      data: {
        id: data![0].id,
        url: publicUrl,
        caption
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('上传照片失败:', error.message);
    return NextResponse.json(
      { error: '上传照片失败: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
  .from('photos')
  .select('*')
  .order('date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('获取照片失败:', error.message);
    return NextResponse.json(
      { error: '获取照片失败: ' + error.message },
      { status: 500 }
    );
  }
}