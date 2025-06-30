import type { Post } from "@/types"

const mockMessages = [
  "مرحباً بالجميع! كيف حالكم اليوم؟ 😊",
  "أبحث عن وظيفة في مجال التكنولوجيا، هل من مساعدة؟ 💼",
  "شكراً لكم على الدعم المستمر ❤️ أقدر كل واحد فيكم",
  "ما رأيكم في هذا المنتج الجديد؟ جربته وكان رائع! 🌟",
  "أحتاج نصيحة في موضوع مهم، من يساعدني؟ 🤔",
  "تم الانتهاء من المشروع بنجاح! الحمد لله 🎉",
  "هل يمكن أن تساعدوني في هذا الأمر؟ محتاج رأيكم",
  "معلومة مفيدة: تذكروا دائماً أن النجاح يحتاج صبر ومثابرة 💪",
  "أشارككم هذه الصورة الجميلة من رحلتي الأخيرة 📸",
  "نقاش مثير للاهتمام حول مستقبل التكنولوجيا 🚀",
  "عندي خبر سعيد أريد أشاركه معكم! 😄",
  "من جرب هذا المطعم الجديد؟ سمعت عنه كلام حلو 🍕",
  "نصائح مهمة للنجاح في العمل من تجربتي الشخصية",
  "أحتاج توصيات لكتب جيدة في مجال التطوير الذاتي 📚",
  "شكراً لكل من ساعدني في المشروع، أنتم رائعون! 🙏",
  "فكرة جديدة للمشروع القادم، ما رأيكم؟ 💡",
  "تجربة رائعة في المؤتمر الأخير، تعلمت أشياء كثيرة 🎯",
  "أبحث عن شريك في مشروع جديد، من مهتم؟ 🤝",
  "نصيحة اليوم: لا تستسلم أبداً، النجاح قريب 🌈",
  "أشارككم إنجازي الجديد، الحمد لله على كل شيء ✨",
]

const mockUsers = [
  { id: "100001234567890", name: "أحمد محمد علي", phone: "01012345678" },
  { id: "100009876543210", name: "فاطمة علي حسن", phone: "01198765432" },
  { id: "100005555555555", name: "محمد أحمد سالم", phone: "01055555555" },
  { id: "100001111111111", name: "سارة محمود إبراهيم", phone: "01011111111" },
  { id: "100002222222222", name: "عمر حسن محمد", phone: "01022222222" },
  { id: "100003333333333", name: "نور الدين أحمد", phone: "01033333333" },
  { id: "100004444444444", name: "ليلى يوسف علي", phone: "01044444444" },
  { id: "100006666666666", name: "كريم صلاح الدين", phone: "01066666666" },
  { id: "100007777777777", name: "مريم عبد الله", phone: "01077777777" },
  { id: "100008888888888", name: "يوسف إبراهيم", phone: "01088888888" },
  { id: "100009999999999", name: "هدى محمد", phone: "01099999999" },
  { id: "100000000000001", name: "خالد عبد الرحمن", phone: "01000000001" },
  { id: "100000000000002", name: "آية حسام", phone: "01000000002" },
  { id: "100000000000003", name: "محمود فتحي", phone: "01000000003" },
  { id: "100000000000004", name: "رانيا سمير", phone: "01000000004" },
]

const mockComments = [
  "تعليق رائع! شكراً لك على المشاركة 👍",
  "أتفق معك تماماً في هذا الرأي",
  "معلومة مفيدة جداً، شكراً 🙏",
  "هل يمكن توضيح هذه النقطة أكثر؟",
  "تجربة مشابهة حصلت معي أيضاً",
  "ممتاز! استفدت كثيراً من هذا المنشور",
  "أريد أن أجرب هذا أيضاً 😊",
  "نصيحة ذهبية، شكراً لك ✨",
  "هذا بالضبط ما كنت أبحث عنه!",
  "مشاركة قيمة، بارك الله فيك",
]

export const generateMockPosts = (
  source: { id: string; type: "group" | "page" },
  sourceName: string,
  isOlder: boolean,
) => {
  const posts = []
  const postCount = Math.floor(Math.random() * 12) + 8 // 8-19 posts for more variety

  for (let i = 0; i < postCount; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    const message = mockMessages[Math.floor(Math.random() * mockMessages.length)]

    // Generate more realistic timestamps
    const baseTime = isOlder
      ? Date.now() - (7 + Math.floor(Math.random() * 14)) * 24 * 60 * 60 * 1000 // 7-21 days ago if older
      : Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000 // 0-7 days ago

    const randomOffset = Math.floor(Math.random() * 24 * 60 * 60 * 1000) // Random hours
    const createdTime = new Date(baseTime - randomOffset - i * 2 * 60 * 60 * 1000) // Each post 2 hours apart

    const post: Post = {
      id: `${source.id}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      message: message,
      created_time: createdTime.toISOString(),
      from: {
        id: user.id,
        name: user.name,
        picture: {
          data: {
            url: `/placeholder.svg?height=50&width=50&text=${encodeURIComponent(user.name.charAt(0))}`,
          },
        },
      },
      source: source.id,
      source_type: source.type,
      source_name: sourceName,
      comments: {
        data: [],
      },
    }

    // Add comments to some posts (60% chance)
    if (Math.random() > 0.4) {
      const commentCount = Math.floor(Math.random() * 5) + 1 // 1-5 comments
      for (let j = 0; j < commentCount; j++) {
        const commentUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        const commentText = mockComments[Math.floor(Math.random() * mockComments.length)]

        post.comments!.data.push({
          id: `comment_${Date.now()}_${i}_${j}`,
          message: commentText,
          created_time: new Date(createdTime.getTime() + (j + 1) * 60000).toISOString(), // Comments after post
          from: {
            id: commentUser.id,
            name: commentUser.name,
          },
        })
      }
    }

    // Add images to some posts (40% chance)
    if (Math.random() > 0.6) {
      const imageTopics = ["منظر طبيعي", "طعام", "تكنولوجيا", "سفر", "عمل", "أصدقاء"]
      const topic = imageTopics[Math.floor(Math.random() * imageTopics.length)]
      post.full_picture = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(topic)}`
    }

    // Add attachments to some posts (30% chance)
    if (Math.random() > 0.7) {
      post.attachments = {
        data: [
          {
            type: Math.random() > 0.5 ? "photo" : "video_inline",
            media: {
              image: {
                src: `/placeholder.svg?height=300&width=500&text=${encodeURIComponent("مرفق")}`,
              },
            },
          },
        ],
      }
    }

    // Add permalink_url
    post.permalink_url = `https://www.facebook.com/${source.type === "group" ? "groups" : ""}/${source.id}/posts/${post.id.split("_")[1]}`

    posts.push(post)
  }

  // Sort by creation time (newest first)
  posts.sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())

  return {
    data: posts,
    paging: isOlder
      ? Math.random() > 0.5
        ? { next: `mock_pagination_${Date.now()}` }
        : null
      : { next: `mock_pagination_${Date.now()}` },
  }
}

export { mockUsers }
