const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// 解析 JSON 请求体
app.use(express.json());

// 托管静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 文章数据文件路径
const dataDir = path.join(__dirname, 'data');
const articlesFile = path.join(dataDir, 'articles.json');
const imagesDir = path.join(__dirname, 'public', 'images');

// 确保必要目录存在
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(articlesFile)) fs.writeFileSync(articlesFile, '[]', 'utf8');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// 配置 multer：存储到 public/images，保持原始文件名
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    // 避免文件名冲突：时间戳 + 原始名
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ============= 图片上传接口 =============
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '未选择图片' });
  }
  // 返回可访问的 URL 路径
  const imageUrl = '/images/' + req.file.filename;
  res.json({ url: imageUrl });
});

// ============= 文章 API（保持不变，略作容错增强） =============
function readArticles() {
  try {
    const raw = fs.readFileSync(articlesFile, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    writeArticles([]);
    return [];
  }
}

function writeArticles(articles) {
  fs.writeFileSync(articlesFile, JSON.stringify(articles, null, 2), 'utf8');
}

app.get('/api/articles', (req, res) => {
  res.json(readArticles());
});

app.get('/api/articles/:id', (req, res) => {
  const articles = readArticles();
  const article = articles.find(a => a.id === req.params.id);
  if (article) res.json(article);
  else res.status(404).json({ error: '文章不存在' });
});

app.post('/api/articles', (req, res) => {
  const { title, content, summary, author, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: '标题和内容不能为空' });
  }
  const articles = readArticles();
  const newArticle = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    title,
    content,
    summary: summary || content.replace(/<[^>]*>/g, '').substring(0, 150),
    author: author || '匿名',
    tags: tags || [],
    date: new Date().toISOString().split('T')[0]
  };
  articles.push(newArticle);
  writeArticles(articles);
  res.status(201).json(newArticle);
});

app.delete('/api/articles/:id', (req, res) => {
  let articles = readArticles();
  const index = articles.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '文章不存在' });
  articles.splice(index, 1);
  writeArticles(articles);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🌊 海洋守护者服务已启动：http://localhost:${PORT}`);
});