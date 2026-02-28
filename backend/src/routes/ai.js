import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const CRISIS_KEYWORDS = ['自杀', '结束生命', '不想活', '去死', '轻生', '了结'];

const SYSTEM_PROMPT = `你是"心语小助手"，一个专为抑郁症患者及其家属设计的心理健康支持助手。你的职责包括：
1. 提供关于抑郁症的科普知识和答疑
2. 倾听用户的情绪，给予温暖的情感支持
3. 提供实用的情绪管理和自我照顾建议
4. 引导有需要的用户寻求专业帮助

对话原则：
- 语气温和、有同理心，不说教，不评判
- 回复简洁有条理，适当使用换行增加可读性
- 不提供具体诊断或处方，始终建议就医
- 如果检测到危机信号（自杀、自伤倾向），立即提供危机热线并鼓励求助
- 用中文回复，语气自然、贴近年轻人

危机热线（如需使用）：
- 全国心理援助热线：400-161-9995（24小时）
- 北京心理危机干预热线：010-82951332
- 生命热线：400-821-1215`;

/**
 * 调用硅基流动 AI API
 */
async function callSiliconFlowAI(messages) {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  const baseUrl = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';
  const model = process.env.AI_MODEL || 'Qwen/Qwen2.5-72B-Instruct';

  if (!apiKey) throw new Error('SILICONFLOW_API_KEY 未配置');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`SiliconFlow API 错误: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '抱歉，我暂时无法回复，请稍后再试。';
}

/**
 * 检测危机关键词
 */
function detectCrisis(text) {
  return CRISIS_KEYWORDS.some(kw => text.includes(kw));
}

/**
 * GET /api/ai/history
 * 获取AI聊天历史
 */
router.get('/history', authenticate, (req, res) => {
  const { limit = 50 } = req.query;

  const messages = db.prepare(`
    SELECT * FROM ai_chat_history WHERE user_id = ?
    ORDER BY created_at DESC LIMIT ?
  `).all(req.userId, parseInt(limit));

  res.json({
    success: true,
    data: messages.reverse().map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.created_at,
    })),
  });
});

/**
 * POST /api/ai/chat
 * 发送消息给AI助手
 */
router.post('/chat', authenticate, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: '消息不能为空' });
  }

  const now = new Date().toISOString();
  const userMsgId = `ai_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const aiMsgId = `ai_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

  // 保存用户消息
  db.prepare('INSERT INTO ai_chat_history (id, user_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)').run(
    userMsgId, req.userId, 'user', message.trim(), now
  );

  // 获取最近20条历史消息作为上下文（不含刚存的这条，稍后添加）
  const historyRows = db.prepare(`
    SELECT role, content FROM ai_chat_history
    WHERE user_id = ? AND id != ?
    ORDER BY created_at DESC LIMIT 20
  `).all(req.userId, userMsgId);

  // 构建上下文消息列表（从旧到新，最后加用户当前消息）
  const contextMessages = historyRows.reverse().map(r => ({ role: r.role, content: r.content }));
  contextMessages.push({ role: 'user', content: message.trim() });

  try {
    // 检测危机关键词
    const isCrisis = detectCrisis(message.trim());

    let aiContent;
    if (isCrisis) {
      // 危机情况：直接给出固定的热线回复，并附带 AI 温情回应
      const crisisPrefix = '⚠️ 我注意到你提到了一些让我很担心的话语。你现在的感受很重要，请记住你不是一个人。\n\n🚨 **紧急求助热线：**\n• 全国心理援助热线：**400-161-9995**（24小时）\n• 北京心理危机干预：**010-82951332**\n• 生命热线：**400-821-1215**\n\n';
      // 同时调用 AI 给予温暖回应
      try {
        const aiReply = await callSiliconFlowAI(contextMessages);
        aiContent = crisisPrefix + aiReply;
      } catch {
        aiContent = crisisPrefix + '请拨打上方热线，会有专业的人帮助你。你愿意告诉我现在发生了什么吗？';
      }
    } else {
      aiContent = await callSiliconFlowAI(contextMessages);
    }

    const aiTimestamp = new Date(Date.now() + 100).toISOString();

    // 保存AI回复
    db.prepare('INSERT INTO ai_chat_history (id, user_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)').run(
      aiMsgId, req.userId, 'assistant', aiContent, aiTimestamp
    );

    res.json({
      success: true,
      data: {
        userMessage: { id: userMsgId, role: 'user', content: message.trim(), timestamp: now },
        aiMessage: { id: aiMsgId, role: 'assistant', content: aiContent, isCrisis, timestamp: aiTimestamp },
      },
    });
  } catch (err) {
    console.error('AI 调用失败:', err.message);
    // AI 调用失败时返回友好提示，不保存错误回复
    db.prepare('DELETE FROM ai_chat_history WHERE id = ?').run(userMsgId);
    res.status(503).json({ success: false, message: 'AI 服务暂时不可用，请稍后再试' });
  }
});

/**
 * DELETE /api/ai/history
 * 清除AI聊天历史
 */
router.delete('/history', authenticate, (req, res) => {
  db.prepare('DELETE FROM ai_chat_history WHERE user_id = ?').run(req.userId);
  res.json({ success: true, message: '聊天历史已清除' });
});

export default router;
