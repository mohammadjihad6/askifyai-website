// src/app/api/cover-letter/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. جلب متغيرات البيئة السرية
  const WEBHOOK_URL = process.env.N8N_COVER_LETTER_WEBHOOK_URL;
  const AUTH_HEADER_NAME = process.env.N8N_CV_ANALYZE_AUTH_HEADER_NAME; // نفس الـ Header العام
  const AUTH_HEADER_VALUE = process.env.N8N_CV_ANALYZE_AUTH_HEADER_VALUE; // نفس الـ Header العام

  // 2. التحقق من وجود المتغيرات
  if (!WEBHOOK_URL || !AUTH_HEADER_NAME || !AUTH_HEADER_VALUE) {
    // يجب أن تكون هذه الأخطاء مرئية فقط في سجلات الخادم
    console.error("API Route Error: Missing n8n webhook environment variables for Cover Letter Generator.");
    return NextResponse.json(
      { message: "Server configuration error: Missing API keys." },
      { status: 500 }
    );
  }

  // 3. استلام البيانات المرسلة من الواجهة الأمامية (الآن هي FormData)
  let requestFormData;
  try {
    requestFormData = await request.formData();
  } catch (formDataError: any) {
    console.error("API Route Error: Failed to parse incoming FormData:", formDataError);
    return NextResponse.json(
      { message: "Invalid request format. Expected FormData." },
      { status: 400 }
    );
  }

  try {
    // 4. إجراء الطلب الآمن من جانب الخادم إلى n8n Webhook
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: requestFormData, // نمرر FormData المستلمة مباشرة
      headers: {
        [AUTH_HEADER_NAME]: AUTH_HEADER_VALUE, // هنا نضيف الـ Header السري
      },
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
        console.error("API Route Error: Failed to parse n8n response as JSON for Cover Letter Generator. Response was:", responseText, "Error:", parseError);
        return NextResponse.json(
          { message: "Invalid response format from n8n backend for Cover Letter Generator. Check n8n workflow output." },
          { status: 500 }
        );
    }

    // 6. إرجاع الاستجابة إلى الواجهة الأمامية
    return NextResponse.json(responseJson, { status: res.status });

  } catch (error: any) {
    console.error("API Route Error: Failed to communicate with n8n webhook for Cover Letter Generator:", error);
    return NextResponse.json(
      { message: "Internal server error during n8n communication." },
      { status: 500 }
    );
  }
}