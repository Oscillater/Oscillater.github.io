import fs from 'fs';
import path from 'path';

/**
 * 字数统计选项
 */
export interface WordCounterOptions {
  includeFrontMatter?: boolean;  // 是否包含 front matter
  includeCodeBlocks?: boolean;   // 是否包含代码块
  includeImagesAlt?: boolean;    // 是否包含图片 alt 文本
  chineseWordCount?: boolean;    // 是否使用中文字数统计
}

/**
 * 文章字数统计结果
 */
export interface ArticleWordCount {
  title: string;
  path: string;
  words: number;
  chars: number;
  readingTime: number; // 预估阅读时间（分钟）
}

/**
 * 分类统计结果
 */
export interface CategoryCount {
  count: number;
  words: number;
  chars: number;
  articles: ArticleWordCount[];
}

/**
 * 网站字数统计结果
 */
export interface WordCountResult {
  totalWords: number;
  totalChars: number;
  byCategory: {
    blog: CategoryCount;
    techNotes: CategoryCount;
    docs: {
      gewu: CategoryCount;
      zhizhi: CategoryCount;
    };
  };
  lastUpdated: string;
}

/**
 * 网站字数统计器
 */
class WordCounter {
  private options: Required<WordCounterOptions>;

  constructor(options: WordCounterOptions = {}) {
    this.options = {
      includeFrontMatter: false,
      includeCodeBlocks: true,
      includeImagesAlt: true,
      chineseWordCount: true,
      ...options
    };
  }

  /**
   * 统计单个文件的字数
   */
  async countFileWords(filePath: string): Promise<ArticleWordCount> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter, content: body } = this.parseFrontMatter(content);

    let textToCount = '';

    if (this.options.includeFrontMatter) {
      // 包含 front matter 中的文本
      Object.values(frontMatter).forEach(value => {
        if (typeof value === 'string') {
          textToCount += value + ' ';
        }
      });
    }

    textToCount += this.extractTextContent(body);

    const stats = this.calculateTextStats(textToCount);
    const title = frontMatter.title  || path.basename(filePath, '.md')|| frontMatter.date;

    return {
      title,
      path: path.relative(process.cwd(), filePath),
      words: stats.words,
      chars: stats.chars,
      readingTime: this.calculateReadingTime(stats.words)
    };
  }

  /**
   * 解析 Front Matter（简化版，不依赖 gray-matter）
   */
  private parseFrontMatter(content: string): { data: Record<string, any>; content: string } {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (match) {
      const frontMatterText = match[1];
      const bodyContent = match[2];
      const frontMatterData: Record<string, any> = {};

      // 简单解析 YAML 格式
      frontMatterText.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...rest] = trimmedLine.split(':');
          if (key && rest.length > 0) {
            const value = rest.join(':').trim().replace(/^["']|["']$/g, '');
            frontMatterData[key.trim()] = value;
          }
        }
      });

      return { data: frontMatterData, content: bodyContent };
    }

    return { data: {}, content };
  }

  /**
   * 从 Markdown 内容中提取纯文本
   */
  private extractTextContent(markdown: string): string {
    let text = markdown;

    // 移除代码块（如果配置不包含）
    if (!this.options.includeCodeBlocks) {
      text = text.replace(/```[\s\S]*?```/g, '');
      text = text.replace(/`[^`\n]*`/g, '');
    }

    // 移除图片语法，但保留 alt 文本（如果配置包含）
    if (this.options.includeImagesAlt) {
      text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
    } else {
      text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
    }

    // 移除链接语法，保留链接文本
    text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

    // 移除 Markdown 标题符号
    text = text.replace(/^#{1,6}\s+/gm, '');

    // 移除强调符号
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    text = text.replace(/\*([^*]+)\*/g, '$1');
    text = text.replace(/__([^_]+)__/g, '$1');
    text = text.replace(/_([^_]+)_/g, '$1');

    // 移除 HTML 标签
    text = text.replace(/<[^>]*>/g, '');

    // 移除多余的空白字符
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  /**
   * 计算文本统计信息
   */
  private calculateTextStats(text: string): { words: number; chars: number } {
    if (this.options.chineseWordCount) {
      // 中文字数统计：中文字符 + 英文单词
      const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
      const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
      const words = chineseChars + englishWords;
      const chars = text.replace(/\s/g, '').length;

      return { words, chars };
    } else {
      // 英文风格字数统计：按空格分割
      const words = text.trim() ? text.split(/\s+/).length : 0;
      const chars = text.replace(/\s/g, '').length;

      return { words, chars };
    }
  }

  /**
   * 计算预估阅读时间（基于中文阅读速度 300 字/分钟）
   */
  private calculateReadingTime(words: number): number {
    return Math.ceil(words / 300);
  }

  /**
   * 统计目录中的所有文件
   */
  private async countDirectoryFiles(dirPath: string): Promise<CategoryCount> {
    if (!fs.existsSync(dirPath)) {
      return { count: 0, words: 0, chars: 0, articles: [] };
    }

    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(dirPath, file));

    const articles = await Promise.all(
      files.map(file => this.countFileWords(file))
    );

    const words = articles.reduce((sum, article) => sum + article.words, 0);
    const chars = articles.reduce((sum, article) => sum + article.chars, 0);

    return {
      count: articles.length,
      words,
      chars,
      articles
    };
  }

  /**
   * 统计整个网站的字数
   */
  async countWebsiteWords(): Promise<WordCountResult> {
    const blogDir = path.join(process.cwd(), 'blog');
    const techNotesDir = path.join(process.cwd(), 'tech-notes');
    const docsDir = path.join(process.cwd(), 'docs');
    const gewuDir = path.join(docsDir, 'gewu');
    const zhizhiDir = path.join(docsDir, 'zhizhi');

    const [blog, techNotes, gewu, zhizhi] = await Promise.all([
      this.countDirectoryFiles(blogDir),
      this.countDirectoryFiles(techNotesDir),
      this.countDirectoryFiles(gewuDir),
      this.countDirectoryFiles(zhizhiDir)
    ]);

    // 将技术笔记合并到博客统计中
    const combinedBlog: CategoryCount = {
      count: blog.count + techNotes.count,
      words: blog.words + techNotes.words,
      chars: blog.chars + techNotes.chars,
      articles: [...blog.articles, ...techNotes.articles]
    };

    const totalWords = combinedBlog.words + gewu.words + zhizhi.words;
    const totalChars = combinedBlog.chars + gewu.chars + zhizhi.chars;

    return {
      totalWords,
      totalChars,
      byCategory: {
        blog: combinedBlog,
        techNotes,
        docs: {
          gewu,
          zhizhi
        }
      },
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * 生成统计报告
 */
export function generateReport(stats: WordCountResult): string {
  return `# 网站字数统计报告

## 总览
- **总字数**: ${stats.totalWords.toLocaleString()} 字
- **总字符数**: ${stats.totalChars.toLocaleString()} 字符
- **统计时间**: ${new Date(stats.lastUpdated).toLocaleString('zh-CN')}

## 分类统计

### 📝 博客文章 (${stats.byCategory.blog.count} 篇)
- **总字数**: ${stats.byCategory.blog.words.toLocaleString()} 字
- **平均字数**: ${Math.round(stats.byCategory.blog.words / stats.byCategory.blog.count)} 字
- **总字符数**: ${stats.byCategory.blog.chars.toLocaleString()} 字符
*包含博客文章和技术笔记*

### 🔧 技术笔记 (${stats.byCategory.techNotes.count} 篇)
- **总字数**: ${stats.byCategory.techNotes.words.toLocaleString()} 字
- **平均字数**: ${Math.round(stats.byCategory.techNotes.words / stats.byCategory.techNotes.count)} 字
- **总字符数**: ${stats.byCategory.techNotes.chars.toLocaleString()} 字符

### 🔬 格物文档 (${stats.byCategory.docs.gewu.count} 篇)
- **总字数**: ${stats.byCategory.docs.gewu.words.toLocaleString()} 字
- **平均字数**: ${Math.round(stats.byCategory.docs.gewu.words / stats.byCategory.docs.gewu.count)} 字
- **总字符数**: ${stats.byCategory.docs.gewu.chars.toLocaleString()} 字符

### 📚 致知文档 (${stats.byCategory.docs.zhizhi.count} 篇)
- **总字数**: ${stats.byCategory.docs.zhizhi.words.toLocaleString()} 字
- **平均字数**: ${Math.round(stats.byCategory.docs.zhizhi.words / stats.byCategory.docs.zhizhi.count)} 字
- **总字符数**: ${stats.byCategory.docs.zhizhi.chars.toLocaleString()} 字符

## 📊 字数排行

### 最长文章 TOP 10
${[...stats.byCategory.blog.articles, ...stats.byCategory.docs.gewu.articles, ...stats.byCategory.docs.zhizhi.articles]
  .sort((a, b) => b.words - a.words)
  .slice(0, 10)
  .map((article, index) => `${index + 1}. **${article.title}** - ${article.words} 字 (预计阅读 ${article.readingTime} 分钟)`)
  .join('\n')}

### 博客文章排行 TOP 5
${stats.byCategory.blog.articles
  .sort((a, b) => b.words - a.words)
  .slice(0, 5)
  .map((article, index) => `${index + 1}. **${article.title}** - ${article.words} 字`)
  .join('\n')}

### 技术笔记排行 TOP 3
${stats.byCategory.techNotes.articles
  .sort((a, b) => b.words - a.words)
  .slice(0, 3)
  .map((article, index) => `${index + 1}. **${article.title}** - ${article.words} 字`)
  .join('\n')}

### 格物文档排行 TOP 3
${stats.byCategory.docs.gewu.articles
  .sort((a, b) => b.words - a.words)
  .slice(0, 3)
  .map((article, index) => `${index + 1}. **${article.title}** - ${article.words} 字`)
  .join('\n')}

### 致知文档排行 TOP 3
${stats.byCategory.docs.zhizhi.articles
  .sort((a, b) => b.words - a.words)
  .slice(0, 3)
  .map((article, index) => `${index + 1}. **${article.title}** - ${article.words} 字`)
  .join('\n')}
`;
}

/**
 * 更新 totalWords.json 文件
 */
export function updateTotalWordsJson(stats: WordCountResult): void {
  const totalWordsData = {
    totalWords: stats.totalWords,
    totalChars: stats.totalChars,
    lastUpdated: stats.lastUpdated,
    blog: {
      count: stats.byCategory.blog.count,
      words: stats.byCategory.blog.words
    },
    techNotes: {
      count: stats.byCategory.techNotes.count,
      words: stats.byCategory.techNotes.words
    },
    docs: {
      gewu: {
        count: stats.byCategory.docs.gewu.count,
        words: stats.byCategory.docs.gewu.words
      },
      zhizhi: {
        count: stats.byCategory.docs.zhizhi.count,
        words: stats.byCategory.docs.zhizhi.words
      }
    }
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'totalWords.json'),
    JSON.stringify(totalWordsData, null, 2),
    'utf-8'
  );
}

// 导出单例实例
export const wordCounter = new WordCounter();

// 便捷函数
export async function countWebsiteWords(options?: WordCounterOptions): Promise<WordCountResult> {
  const counter = new WordCounter(options);
  return counter.countWebsiteWords();
}

export async function generateWordCountReport(options?: WordCounterOptions): Promise<string> {
  const stats = await countWebsiteWords(options);
  return generateReport(stats);
}

export async function updateWordCount(options?: WordCounterOptions): Promise<WordCountResult> {
  const stats = await countWebsiteWords(options);
  updateTotalWordsJson(stats);
  return stats;
}