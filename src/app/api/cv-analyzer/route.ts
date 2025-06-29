// src/app/api/cv-analyzer/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. جلب متغيرات البيئة السرية (لا تُكشف للمتصفح)
  const WEBHOOK_URL = process.env.N8N_CV_ANALYZE_WEBHOOK_URL;
  const AUTH_HEADER_NAME = process.env.N8N_CV_ANALYZE_AUTH_HEADER_NAME;
  const AUTH_HEADER_VALUE = process.env.N8N_CV_ANALYZE_AUTH_HEADER_VALUE;

  // 2. التحقق من أن جميع المتغيرات الأساسية موجودة (خطوة أمان)
  if (!WEBHOOK_URL || !AUTH_HEADER_NAME || !AUTH_HEADER_VALUE) {
    console.error("API Route Error: Missing n8n webhook environment variables for CV Analyzer.");
    return NextResponse.json(
      { message: "Server configuration error: Missing API keys." },
      { status: 500 }
    );
  }

  // 3. استلام البيانات المرسلة من الواجهة الأمامية (FormData)
  // request.formData() يعالج FormData المرسلة
  const formData = await request.formData();

  try {
    // 4. إجراء الطلب الآمن من جانب الخادم (Server-side) إلى n8n Webhook
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData, // نمرر الـ FormData المستلمة كما هي
      headers: {
        [AUTH_HEADER_NAME]: AUTH_HEADER_VALUE, // هنا نضيف الـ Header السري
        // لا تضع Content-Type هنا: المتصفح الأصلي لـ fetch يضيفه بشكل صحيح مع FormData
      },
    });

    // 5. قراءة الاستجابة من n8n (من المهم قراءتها كنص أولاً لمعالجة الـ Markdown JSON)
    const responseText = await res.text();
    let responseJson;
    try {
        // محاولة استخراج JSON من داخل كتل Markdown (```json\n...\n```)
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            responseJson = JSON.parse(jsonMatch[1]);
        } else {
            // Fallback: إذا لم يكن ملفوفًا، حاول تحليل JSON مباشرة
            responseJson = JSON.parse(responseText);
        }
    } catch (parseError) {
        console.error("API Route Error: Failed to parse n8n response as JSON:", parseError);
        return NextResponse.json(
          { message: "Invalid response format from n8n backend." },
          { status: 500 }
        );
    }

    // 6. إرجاع الاستجابة المستلمة من n8n إلى الواجهة الأمامية
    // نستخدم NextResponse.json لإرجاع JSON مع الحالة الأصلية للاستجابة
    return NextResponse.json(responseJson, { status: res.status });

  } catch (error: any) {
    // 7. معالجة أي أخطاء تحدث أثناء الاتصال بـ n8n
    console.error("API Route Error: Failed to communicate with n8n webhook:", error);
    return NextResponse.json(
      { message: "Internal server error during n8n communication." },
      { status: 500 }
    );
  }
}