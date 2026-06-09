


// backend/src/services/aiProvider.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ النموذج الصحيح المتاح في مفتاحك limit=20 reqwest (quate)
const MODEL_NAME = "gemini-2.5-flash";


//1500 req.per.day.but we nead vpn 
//const MODEL_NAME = "gemini-2.0-flash";
//const MODEL_NAME =genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
async function generateReply(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("✅ generateReply نجح، طول الرد:", text.length);
    return text;
  } catch (error) {
    console.error("❌ generateReply error:", error.message);
    return JSON.stringify({
      suggestions: [],
      summary: "عذراً، المساعد الذكي غير متاح حالياً.",
    });
  }
}

async function* streamReply(messages, systemPrompt) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const contents = [];

    if (systemPrompt?.trim()) {
      contents.push({
        role: "user",
        parts: [{ text: `[تعليمات]: ${systemPrompt}` }],
      });
      contents.push({
        role: "model",
        parts: [{ text: "مفهوم، سأتبع هذه التعليمات وأساعدك." }],
      });
    }

    for (const msg of messages) {
      const role = msg.role === "assistant" ? "model" : "user";
      const text = (msg.content || "").trim();
      if (!text) continue;

      const last = contents[contents.length - 1];
      if (last && last.role === role) {
        last.parts[0].text += "\n" + text;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
    }

    if (!contents.length || contents[contents.length - 1].role !== "user") {
      yield "يرجى إرسال رسالة للبدء.";
      return;
    }

    console.log(`✅ streamReply: ${MODEL_NAME}، رسائل: ${contents.length}`);

    const result = await model.generateContentStream({ contents });

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }

    console.log("✅ streamReply انتهى بنجاح");
  } catch (error) {
    console.error("❌ streamReply error:", error.message);
    yield `عذراً، حدث خطأ: ${error.message}`;
  }
}

module.exports = { generateReply, streamReply };

// backend/src/services/aiProvider.js
/*const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🚩 الحل: اجعل هذا "نصاً" فقط
const MODEL_NAME = "gemini-pro"; 

async function generateReply(prompt) {
  try {
    // استدعاء الموديل باستخدام الاسم النصي
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ generateReply error:", error.message);
    return JSON.stringify({ suggestions: [], summary: "عذراً، المساعد الذكي غير متاح حالياً." });
  }
}

async function* streamReply(messages, systemPrompt) {
 
   try {
    // محاولة استخدام الموديل الأكثر استقراراً أولاً
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (e) {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    if (systemPrompt?.trim()) {
      contents.push({ role: "user", parts: [{ text: `[تعليمات]: ${systemPrompt}` }] });
      contents.push({ role: "model", parts: [{ text: "مفهوم، سأتبع هذه التعليمات وأساعدك." }] });
    }

    for (const msg of messages) {
      const role = msg.role === "assistant" ? "model" : "user";
      const text = (msg.content || "").trim();
      if (!text) continue;

      const last = contents[contents.length - 1];
      if (last && last.role === role) {
        last.parts[0].text += "\n" + text;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
    }

    if (!contents.length || contents[contents.length - 1].role !== "user") {
      yield "يرجى إرسال رسالة للبدء.";
      return;
    }

  const result = await model.generateContentStream({ contents });
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    yield "عذراً، حدث خطأ تقني في الاتصال. جاري المحاولة مرة أخرى...";
  }
}

module.exports = { generateReply, streamReply };*/
