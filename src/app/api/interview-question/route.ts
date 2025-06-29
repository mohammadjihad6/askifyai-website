// src/app/api/interview-question/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. جلب متغيرات البيئة السرية الخاصة بهذه الأداة
  // NEW: نستخدم نفس اسم المتغير العام للمصادقة (Auth Header)
  const WEBHOOK_URL = process.env.N8N_INTERVIEW_QUESTION_WEBHOOK_URL;
  const AUTH_HEADER_NAME = process.env.N8N_CV_ANALYZE_AUTH_HEADER_NAME; // <-- تم التعديل هنا
  const AUTH_HEADER_VALUE = process.env.N8N_CV_ANALYZE_AUTH_HEADER_VALUE; // <-- تم التعديل هنا

  // 2. التحقق من وجود المتغيرات
  if (!WEBHOOK_URL || !AUTH_HEADER_NAME || !AUTH_HEADER_VALUE) {
    console.error("API Route Error: Missing n8n webhook environment variables for Interview Question Generator. Check N8N_INTERVIEW_QUESTION_WEBHOOK_URL and general AUTH_HEADER values."); // رسالة خطأ أوضح
    return NextResponse.json(
      { message: "Server configuration error: Missing API keys." },
      { status: 500 }
    );
  }

  // 3. استلام البيانات المرسلة من الواجهة الأمامية
  const payload = await request.json(); // نستخدم request.json() لأن هذه الصفحة ترسل JSON.

  try {
    // 4. إجراء الطلب الآمن من جانب الخادم إلى n8n Webhook
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [AUTH_HEADER_NAME]: AUTH_HEADER_VALUE,
      },
      body: JSON.stringify(payload),
    });

    // 5. قراءة الاستجابة من n8n
    const responseText = await res.text();
    let responseJson;
    try {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            responseJson = JSON.parse(jsonMatch[1]);
        } else {
            responseJson = JSON.parse(responseText);
        }
    } catch (parseError) {
        console.error("API Route Error: Failed to parse n8n response as JSON for Interview Question:", parseError);
        return NextResponse.json(
          { message: "Invalid response format from n8n backend for Interview Question." },
          { status: 500 }
        );
    }

    // 6. إرجاع الاستجابة إلى الواجهة الأمامية
    return NextResponse.json(responseJson, { status: res.status });

  } catch (error: any) {
    console.error("API Route Error: Failed to communicate with n8n webhook for Interview Question:", error);
    return NextResponse.json(
      { message: "Internal server error during n8n communication for Interview Question." },
      { status: 500 }
    );
  }
}