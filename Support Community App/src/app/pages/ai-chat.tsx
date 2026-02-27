import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, Bot, User, Lightbulb, Heart, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 欢迎消息
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '0',
        role: 'assistant',
        content: '你好呀，我是心语小助手 💙\n\n我可以帮你解答关于抑郁症的疑问，提供情绪支持建议，或者陪你聊聊天。\n\n请随时告诉我你想了解什么，或者你现在的感受。',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);
  
  // 快捷问题
  const quickQuestions = [
    '什么是抑郁症？',
    '如何判断是否需要看医生？',
    '家人得了抑郁症，我该怎么办？',
    '抗抑郁药物有副作用吗？',
    '如何应对突然的情绪低落？',
  ];
  
  // AI回复逻辑（模拟）
  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // 危机关键词检测
    if (input.includes('自杀') || input.includes('结束生命') || input.includes('不想活')) {
      return '我注意到你现在可能正处于非常困难的时刻。请记住，你不是一个人，有人愿意帮助你。\n\n🚨 **紧急求助：**\n• 全国心理援助热线：400-161-9995（24小时）\n• 北京心理危机干预热线：010-82951332（24小时）\n\n你的生命很重要，请不要放弃。如果方便，可以告诉我现在发生了什么吗？';
    }
    
    // 关于抑郁症的基础知识
    if (input.includes('什么是抑郁症') || input.includes('抑郁症是')) {
      return '抑郁症是一种常见的心理疾病，主要表现为：\n\n• 持续的悲伤或空虚感\n• 对原本喜欢的事失去兴趣\n• 睡眠和食欲改变\n• 疲劳、精力不足\n• 注意力难以集中\n• 自我价值感降低\n\n抑郁症不是"想太多"或"性格软弱"，而是大脑化学物质失衡导致的真实疾病。好消息是，抑郁症是可以治疗的！\n\n你想了解更多关于治疗方面的信息吗？';
    }
    
    // 关于就医
    if (input.includes('看医生') || input.includes('就医') || input.includes('去医院')) {
      return '如果你有以下情况，建议考虑寻求专业帮助：\n\n✓ 症状持续超过2周\n✓ 影响到日常生活和工作\n✓ 有伤害自己的念头\n✓ 家人朋友注意到你的变化\n\n**就医途径：**\n1. 精神专科医院（如安定医院、北京六院）\n2. 综合医院心理科/精神科\n3. 心理咨询机构\n\n寻求专业帮助是勇敢的选择，不是软弱的表现。需要我提供就医指南吗？';
    }
    
    // 关于家属支持
    if (input.includes('家人') || input.includes('家属') || input.includes('如何帮助')) {
      return '作为家属，你的陪伴很重要。这里有一些建议：\n\n**应该做的：**\n• 倾听，不评判\n• 鼓励就医，必要时陪同\n• 帮助保持日常规律\n• 给予实际帮助（如做饭、处理家务）\n• 保持耐心\n\n**不要做的：**\n• 不要说"想开点就好了"\n• 不要忽视他们的痛苦\n• 不要强迫他们"振作起来"\n\n记住：你不需要"修复"他们，只需要陪伴。同时也要照顾好自己。\n\n需要更详细的家属指南吗？';
    }
    
    // 关于药物
    if (input.includes('药') || input.includes('副作用')) {
      return '关于抗抑郁药物，这些信息可能对你有帮助：\n\n**常见疑问：**\n• 药物需要2-4周才能起效\n• 初期可能有轻微副作用（如恶心、困倦）\n• 不要突然停药，要在医生指导下逐渐减量\n• 不会"上瘾"，但需要规律服用\n\n**重要提醒：**\n药物治疗需要在专业医生指导下进行。每个人的情况不同，医生会根据你的具体情况调整方案。\n\n如果正在服药遇到问题，建议及时联系你的医生。需要我提供更多信息吗？';
    }
    
    // 关于情绪应对
    if (input.includes('情绪') || input.includes('低落') || input.includes('难过') || input.includes('焦虑')) {
      return '感到情绪低落是完全正常的。这里有一些可以尝试的方法：\n\n**当下缓解：**\n• 深呼吸5次，专注于呼吸\n• 5-4-3-2-1接地技巧（找5样能看到的、4样能听到的、3样能触摸的、2样能闻到的、1样能尝到的）\n• 给信任的朋友打电话\n\n**日常照顾：**\n• 保持规律作息\n• 适度运动（散步也可以）\n• 记录每天的小确幸\n• 给自己一些温柔\n\n情绪有起伏是正常的，你不需要时刻"完美"。现在的你已经很努力了。\n\n想聊聊现在的感受吗？';
    }
    
    // 默认回复
    const defaultResponses = [
      '谢谢你愿意和我分享。能告诉我更多一些吗？',
      '我理解你的感受。这一定不容易。你现在最需要什么样的支持呢？',
      '听起来你现在正经历着一些困难。我在这里陪着你。想聊聊具体发生了什么吗？',
      '你的感受是真实且重要的。有什么我可以帮到你的吗？',
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // 模拟AI思考时间
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input.trim()),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3>AI小助手</h3>
              <p className="text-xs text-muted-foreground">随时为你解答</p>
            </div>
          </div>
          <div className="w-9"></div>
        </div>
      </div>
      
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* 快捷问题（仅在开始时显示） */}
        {messages.length <= 1 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <Lightbulb className="w-4 h-4" />
              <span>你可以问我：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-4 py-2 bg-card border border-border/50 rounded-xl text-sm hover:bg-secondary transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 消息列表 */}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* 头像 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'assistant' 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-accent text-foreground'
              }`}>
                {message.role === 'assistant' ? (
                  <Bot className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              
              {/* 消息气泡 */}
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`rounded-2xl p-4 ${
                  message.role === 'assistant'
                    ? 'bg-card border border-border/50'
                    : 'bg-primary text-primary-foreground'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">
                    {message.content}
                  </p>
                  <span className={`text-xs mt-2 block ${
                    message.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/70'
                  }`}>
                    {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* 正在输入 */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* 危机提示横幅 */}
      <div className="px-6 py-2">
        <div className="bg-destructive/10 rounded-xl p-3 border border-destructive/20 flex items-center gap-3">
          <Phone className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-xs text-muted-foreground flex-1">
            如遇紧急情况，请拨打 <a href="tel:400-161-9995" className="text-destructive font-medium">400-161-9995</a>
          </p>
        </div>
      </div>
      
      {/* 输入区域 */}
      <div className="sticky bottom-0 bg-background border-t border-border/50 px-6 py-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="说说你的想法..."
            className="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI助手仅供参考，不能替代专业医疗建议
        </p>
      </div>
    </div>
  );
}