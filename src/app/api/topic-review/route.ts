// src/app/api/topic-review/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. جلب متغيرات البيئة السرية الخاصة بهذه الأداة
  // نستخدم نفس متغيرات المصادقة العامة لأن المستخدم أشار إلى أنها نفس المفتاح
  const WEBHOOK_URL = process.env.N8N_TOPIC_REVIEW_WEBHOOK_URL;
  const AUTH_HEADER_NAME = process.env.N8N_CV_ANALYZE_AUTH_HEADER_NAME; // نفس الـ Header Name العام
  const AUTH_HEADER_VALUE = process.env.N8N_CV_ANALYZE_AUTH_HEADER_VALUE; // نفس الـ Header Value العام

  // 2. التحقق من وجود المتغيرات
  if (!WEBHOOK_URL || !AUTH_HEADER_NAME || !AUTH_HEADER_VALUE) {
    console.error("API Route Error: Missing n8n webhook environment variables for Quick Subject Review.");
    return NextResponse.json(
      { message: "Server configuration error: Missing API keys." },
      { status: 500 }
    );
  }

  // 3. استلام البيانات المرسلة من الواجهة الأمامية (الآن هي JSON Payload)
  // هذه الصفحة ترسل JSON (action, subjectField, etc.)
  const payload = await request.json(); 

  try {
    // 4. إجراء الطلب الآمن من جانب الخادم إلى n8n Webhook
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // هذه الصفحة ترسل JSON
        [AUTH_HEADER_NAME]: AUTH_HEADER_VALUE, // هنا نضيف الـ Header السري
      },
      body: JSON.stringify(payload), // تحويل الـ payload إلى JSON string
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
        console.error("API Route Error: Failed to parse n8n response as JSON for Quick Subject Review:", parseError);
        return NextResponse.json(
          { message: "Invalid response format from n8n backend for Quick Subject Review." },
          { status: 500 }
        );
    }

    // 6. إرجاع الاستجابة إلى الواجهة الأمامية
    return NextResponse.json(responseJson, { status: res.status });

  } catch (error: any) {
    console.error("API Route Error: Failed to communicate with n8n webhook for Quick Subject Review:", error);
    return NextResponse.json(
      { message: "Internal server error during n8n communication for Quick Subject Review." },
      { status: 500 }
    );
  }
}