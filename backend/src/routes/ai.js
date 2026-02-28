import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * AI回复逻辑（基于关键词的简单规则引擎，可替换为GPT API）
 */
function generateAIResponse(userInput) {
  const input = userInput.toLowerCase();

  // 危机关键词检测
  if (input.includes('自杀') || input.includes('结束生命') || input.includes('不想活') || input.includes('去死')) {
    return {
      content: '我注意到你现在可能正处于非常困难的时刻。请记住，你不是一个人，有人愿意帮助你。\n\n🚨 **紧急求助：**\n• 全国心理援助热线：400-161-9995（24小时）\n• 北京心理危机干预热线：010-82951332（24小时）\n• 生命热线：400-821-1215（24小时）\n\n你的生命很重要，请不要放弃。如果方便，可以告诉我现在发生了什么吗？',
      isCrisis: true,
    };
  }

  // 关于抑郁症基础知识
  if (input.includes('什么是抑郁症') || input.includes('抑郁症是')) {
    return {
      content: '抑郁症是一种常见的心理疾病，主要表现为：\n\n• 持续的悲伤或空虚感\n• 对原本喜欢的事失去兴趣\n• 睡眠和食欲改变\n• 疲劳、精力不足\n• 注意力难以集中\n• 自我价值感降低\n\n抑郁症不是"想太多"或"性格软弱"，而是大脑化学物质失衡导致的真实疾病。好消息是，抑郁症是可以治疗的！\n\n你想了解更多关于治疗方面的信息吗？',
      isCrisis: false,
    };
  }

  // 关于就医
  if (input.includes('看医生') || input.includes('就医') || input.includes('去医院') || input.includes('挂号')) {
    return {
      content: '如果你有以下情况，建议考虑寻求专业帮助：\n\n✓ 症状持续超过2周\n✓ 影响到日常生活和工作\n✓ 有伤害自己的念头\n✓ 家人朋友注意到你的变化\n\n**就医途径：**\n1. 精神专科医院（如安定医院、北京六院）\n2. 综合医院心理科/精神科\n3. 心理咨询机构\n\n寻求专业帮助是勇敢的选择，不是软弱的表现。需要我提供就医指南吗？',
      isCrisis: false,
    };
  }

  // 关于家属支持
  if (input.includes('家人') || input.includes('家属') || input.includes('如何帮助') || input.includes('怎么帮')) {
    return {
      content: '作为家属，你的陪伴很重要。这里有一些建议：\n\n**应该做的：**\n• 倾听，不评判\n• 鼓励就医，必要时陪同\n• 帮助保持日常规律\n• 给予实际帮助（如做饭、处理家务）\n• 保持耐心\n\n**不要做的：**\n• 不要说"想开点就好了"\n• 不要忽视他们的痛苦\n• 不要强迫他们"振作起来"\n\n记住：你不需要"修复"他们，只需要陪伴。同时也要照顾好自己。',
      isCrisis: false,
    };
  }

  // 关于药物
  if (input.includes('药') || input.includes('副作用') || input.includes('抗抑郁')) {
    return {
      content: '关于抗抑郁药物，这些信息可能对你有帮助：\n\n**常见疑问：**\n• 药物需要2-4周才能起效\n• 初期可能有轻微副作用（如恶心、困倦）\n• 不要突然停药，要在医生指导下逐渐减量\n• 不会"上瘾"，但需要规律服用\n\n**重要提醒：**\n药物治疗需要在专业医生指导下进行。如果正在服药遇到问题，建议及时联系你的医生。',
      isCrisis: false,
    };
  }

  // 关于情绪应对
  if (input.includes('情绪') || input.includes('低落') || input.includes('难过') || input.includes('焦虑') || input.includes('害怕')) {
    return {
      content: '感到情绪低落是完全正常的。这里有一些可以尝试的方法：\n\n**当下缓解：**\n• 深呼吸5次，专注于呼吸\n• 5-4-3-2-1接地技巧（找5样能看到的、4样能听到的、3样能触摸的、2样能闻到的、1样能尝到的）\n• 给信任的朋友打电话\n\n**日常照顾：**\n• 保持规律作息\n• 适度运动（散步也可以）\n• 记录每天的小确幸\n\n情绪有起伏是正常的，现在的你已经很努力了。',
      isCrisis: false,
    };
  }

  // 关于睡眠
  if (input.includes('睡眠') || input.includes('失眠') || input.includes('睡不着')) {
    return {
      content: '睡眠问题在抑郁症中很常见，这里有一些改善睡眠的建议：\n\n**睡眠卫生：**\n• 保持固定的作息时间，即使周末也不例外\n• 睡前1小时避免使用手机或电脑\n• 保持卧室黑暗和安静\n• 避免睡前喝咖啡、茶或含酒精的饮料\n\n**放松技巧：**\n• 渐进式肌肉放松\n• 正念冥想\n• 睡前轻柔伸展\n\n如果失眠严重影响生活，建议与医生讨论。',
      isCrisis: false,
    };
  }

  // 关于冥想/放松
  if (input.includes('冥想') || input.includes('放松') || input.includes('呼吸')) {
    return {
      content: '冥想和呼吸练习对情绪管理很有帮助！\n\n**简单的4-7-8呼吸法：**\n1. 吸气4秒\n2. 屏息7秒\n3. 缓慢呼气8秒\n重复4次\n\n**身体扫描冥想：**\n• 找一个舒适的姿势坐或躺下\n• 从头顶开始，慢慢注意身体各个部位的感觉\n• 不评判，只是观察\n• 大约需要10-15分钟\n\n你可以每天练习，逐渐会发现心情变得更平静。',
      isCrisis: false,
    };
  }

  // 默认回复
  const defaults = [
    { content: '谢谢你愿意和我分享。能告诉我更多一些吗？\n\n我在这里倾听，不会评判你。', isCrisis: false },
    { content: '我理解你的感受。这一定不容易。\n\n你现在最需要什么样的支持呢？是信息、建议，还是只是想聊聊天？', isCrisis: false },
    { content: '听起来你正在经历一些困难。我在这里陪着你。\n\n想聊聊具体发生了什么吗？', isCrisis: false },
    { content: '你的感受是真实且重要的。\n\n有什么我可以帮到你的吗？你也可以直接问我关于抑郁症、情绪管理或就医方面的问题。', isCrisis: false },
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
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
router.post('/chat', authenticate, (req, res) => {
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

  // 生成AI回复
  const aiResponse = generateAIResponse(message.trim());
  const aiTimestamp = new Date(Date.now() + 100).toISOString();

  // 保存AI回复
  db.prepare('INSERT INTO ai_chat_history (id, user_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)').run(
    aiMsgId, req.userId, 'assistant', aiResponse.content, aiTimestamp
  );

  res.json({
    success: true,
    data: {
      userMessage: {
        id: userMsgId,
        role: 'user',
        content: message.trim(),
        timestamp: now,
      },
      aiMessage: {
        id: aiMsgId,
        role: 'assistant',
        content: aiResponse.content,
        isCrisis: aiResponse.isCrisis,
        timestamp: aiTimestamp,
      },
    },
  });
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
