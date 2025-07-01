
import type { AdvancedAnalytics } from "./advanced-analytics-service"

export class HTMLExportService {
  static generateHTMLReport(analytics: AdvancedAnalytics, title: string = "تقرير التحليلات المتقدمة"): string {
    const reactionEmojis = {
      "LIKE": "👍",
      "LOVE": "❤️", 
      "WOW": "😮",
      "HAHA": "😂",
      "SAD": "😢",
      "ANGRY": "😡",
      "CARE": "🤗",
      "THANKFUL": "🙏",
      "PRIDE": "🌈"
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 40px;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            background: #f8f9fa;
        }
        
        .section h2 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 1.8em;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
        }
        
        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #3498db;
            margin-bottom: 10px;
        }
        
        .metric-label {
            color: #7f8c8d;
            font-size: 1.1em;
        }
        
        .reactions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .reaction-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .reaction-emoji {
            font-size: 2em;
            margin-bottom: 10px;
        }
        
        .reaction-count {
            font-size: 1.5em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .reaction-label {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .user-item {
            background: white;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .user-rank {
            background: #3498db;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-weight: bold;
        }
        
        .user-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .user-stats {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .trend-item {
            background: white;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid #e74c3c;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .trend-topic {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .trend-stats {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .footer {
            background: #34495e;
            color: white;
            text-align: center;
            padding: 20px;
            margin-top: 40px;
        }
        
        .progress-bar {
            background: #ecf0f1;
            height: 10px;
            border-radius: 5px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .progress-fill {
            background: linear-gradient(90deg, #3498db, #2ecc71);
            height: 100%;
            transition: width 0.3s ease;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 ${title}</h1>
            <div class="subtitle">تم إنشاؤه في ${new Date().toLocaleDateString('ar-EG', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
        </div>
        
        <div class="content">
            <!-- الإحصائيات الأساسية -->
            <div class="section">
                <h2>📈 الإحصائيات الأساسية</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value">${analytics.basic.totalPosts.toLocaleString()}</div>
                        <div class="metric-label">إجمالي المنشورات</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${analytics.basic.totalComments.toLocaleString()}</div>
                        <div class="metric-label">إجمالي التعليقات</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${analytics.basic.totalUsers.toLocaleString()}</div>
                        <div class="metric-label">إجمالي المستخدمين</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${analytics.basic.totalReactions.toLocaleString()}</div>
                        <div class="metric-label">إجمالي التفاعلات</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${analytics.basic.engagementRate}%</div>
                        <div class="metric-label">معدل التفاعل</div>
                    </div>
                </div>
            </div>
            
            <!-- توزيع التفاعلات -->
            <div class="section">
                <h2>😊 توزيع التفاعلات - جميع الإيموجي</h2>
                <div class="reactions-grid">
                    ${Object.entries(analytics.engagementAnalysis.reactionTypes)
                      .filter(([type, count]) => count > 0)
                      .sort(([,a], [,b]) => b - a)
                      .map(([type, count]) => {
                        const emoji = reactionEmojis[type as keyof typeof reactionEmojis] || '👍'
                        const arabicName = {
                          "LIKE": "إعجاب",
                          "LOVE": "حب", 
                          "WOW": "واو",
                          "HAHA": "ضحك",
                          "SAD": "حزن",
                          "ANGRY": "غضب",
                          "CARE": "اهتمام",
                          "THANKFUL": "شكر",
                          "PRIDE": "فخر"
                        }[type] || type
                        
                        return `
                        <div class="reaction-item">
                            <div class="reaction-emoji">${emoji}</div>
                            <div class="reaction-count">${count.toLocaleString()}</div>
                            <div class="reaction-label">${arabicName}</div>
                        </div>
                        `
                      }).join('')}
                </div>
            </div>
            
            <!-- أكثر المستخدمين نشاطاً -->
            <div class="section">
                <h2>👥 أكثر المستخدمين نشاطاً</h2>
                ${analytics.userAnalysis.topUsers.slice(0, 10).map((user, index) => `
                    <div class="user-item">
                        <div>
                            <span class="user-rank">#${index + 1}</span>
                            <div class="user-name">${user.name}</div>
                            <div class="user-stats">${user.posts} منشور • ${user.comments} تعليق • تأثير: ${user.influence.toFixed(1)}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-weight: bold; color: #3498db;">${user.totalActivity}</div>
                            <div style="font-size: 0.8em; color: #7f8c8d;">نشاط</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- المواضيع الرائجة -->
            <div class="section">
                <h2>🔥 المواضيع الرائجة</h2>
                ${analytics.trendAnalysis.trendingTopics.map((topic, index) => `
                    <div class="trend-item">
                        <div class="trend-topic">#${index + 1} ${topic.topic}</div>
                        <div class="trend-stats">${topic.mentions} ذكر • نمو: ${topic.growth.toFixed(1)}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(topic.growth, 100)}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- المحتوى الفيروسي -->
            <div class="section">
                <h2>🚀 المحتوى الأكثر تفاعلاً</h2>
                ${analytics.engagementAnalysis.viralContent.slice(0, 5).map((content, index) => `
                    <div class="user-item">
                        <div>
                            <span class="user-rank">#${index + 1}</span>
                            <div class="user-name" style="margin-top: 10px;">${content.content}</div>
                            <div class="user-stats">نقاط فيروسية: ${content.viralScore}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 0.9em; color: #7f8c8d;">
                                👍 ${content.reactions} • 💬 ${content.comments} • 🔄 ${content.shares}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- تحليل المشاعر -->
            <div class="section">
                <h2>🎭 تحليل المشاعر</h2>
                <div class="reactions-grid">
                    ${Object.entries(analytics.contentAnalysis.sentimentAnalysis).map(([sentiment, count]) => {
                      const sentimentEmojis = {
                        "positive": "😊",
                        "negative": "😞", 
                        "neutral": "😐",
                        "mixed": "🤔"
                      }
                      const sentimentNames = {
                        "positive": "إيجابي",
                        "negative": "سلبي",
                        "neutral": "محايد", 
                        "mixed": "مختلط"
                      }
                      
                      return `
                      <div class="reaction-item">
                          <div class="reaction-emoji">${sentimentEmojis[sentiment as keyof typeof sentimentEmojis]}</div>
                          <div class="reaction-count">${count.toLocaleString()}</div>
                          <div class="reaction-label">${sentimentNames[sentiment as keyof typeof sentimentNames]}</div>
                      </div>
                      `
                    }).join('')}
                </div>
            </div>
            
            <!-- توقعات النمو -->
            <div class="section">
                <h2>🔮 توقعات النمو</h2>
                <div class="metrics-grid">
                    ${Object.entries(analytics.predictiveAnalysis.growthPrediction).map(([period, value]) => `
                        <div class="metric-card">
                            <div class="metric-value">${value.toLocaleString()}</div>
                            <div class="metric-label">${period}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>تم إنشاء هذا التقرير بواسطة نظام التحليلات المتقدمة</p>
            <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
                📅 ${new Date().toLocaleDateString('ar-EG')} • 🕐 ${new Date().toLocaleTimeString('ar-EG')}
            </p>
        </div>
    </div>
</body>
</html>
    `

    return htmlContent
  }

  static downloadHTMLReport(analytics: AdvancedAnalytics, filename: string = 'تقرير-التحليلات-المتقدمة'): void {
    const htmlContent = this.generateHTMLReport(analytics)
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
