#!/usr/bin/env node

/**
 * 网站字数统计命令行工具
 *
 * 使用方法:
 * npm run count:words                    # 基本统计
 * npm run count:words -- --report         # 生成详细报告
 * npm run count:words -- --update         # 更新 totalWords.json
 * npm run count:words -- --no-code        # 不包含代码块
 * npm run count:words -- --help           # 显示帮助
 */

import { Command } from 'commander';
import {
  countWebsiteWords,
  generateWordCountReport,
  updateWordCount,
  WordCounterOptions
} from '../src/utils/wordCounter.js';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('word-count')
  .description('网站字数统计工具')
  .version('1.0.0');

program
  .option('-r, --report', '生成详细 Markdown 报告')
  .option('-u, --update', '更新 totalWords.json 文件')
  .option('--no-code', '不包含代码块字数')
  .option('--no-images', '不包含图片 alt 文本')
  .option('--no-chinese', '使用英文统计方式')
  .option('--include-frontmatter', '包含 front matter 字数')
  .option('-o, --output <file>', '输出报告到文件')
  .option('--json', '输出 JSON 格式结果')
  .option('--silent', '静默模式，只输出必要信息');

program.parse(process.argv);
const options = program.opts();

async function main() {
  try {
    // 构建统计选项
    const countOptions: WordCounterOptions = {
      includeFrontMatter: options.includeFrontmatter,
      includeCodeBlocks: !options.noCode,
      includeImagesAlt: !options.noImages,
      chineseWordCount: !options.noChinese,
    };

    if (!options.silent) {
      console.log('🔍 正在统计网站字数...\n');
    }

    let result: any;

    if (options.report) {
      // 生成详细报告
      const report = await generateWordCountReport(countOptions);

      if (options.output) {
        fs.writeFileSync(options.output, report, 'utf-8');
        if (!options.silent) {
          console.log(`📄 详细报告已生成到: ${options.output}`);
        }
      } else {
        console.log(report);
      }

      result = 'report_generated';
    } else if (options.update) {
      // 更新 totalWords.json
      const stats = await updateWordCount(countOptions);

      if (!options.silent) {
        console.log('✅ totalWords.json 已更新');
        console.log(`📊 总字数: ${stats.totalWords.toLocaleString()} 字`);
        console.log(`📝 博客: ${stats.byCategory.blog.count} 篇, ${stats.byCategory.blog.words.toLocaleString()} 字`);
        console.log(`🔬 格物: ${stats.byCategory.docs.gewu.count} 篇, ${stats.byCategory.docs.gewu.words.toLocaleString()} 字`);
        console.log(`📚 致知: ${stats.byCategory.docs.zhizhi.count} 篇, ${stats.byCategory.docs.zhizhi.words.toLocaleString()} 字`);
      }

      result = stats;
    } else {
      // 基本统计
      const stats = await countWebsiteWords(countOptions);

      if (options.json) {
        console.log(JSON.stringify(stats, null, 2));
      } else {
        console.log('📊 网站字数统计结果');
        console.log('=' .repeat(40));
        console.log(`📈 总字数: ${stats.totalWords.toLocaleString()} 字`);
        console.log(`🔤 总字符数: ${stats.totalChars.toLocaleString()} 字符`);
        console.log(`📝 博客文章: ${stats.byCategory.blog.count} 篇, ${stats.byCategory.blog.words.toLocaleString()} 字`);
        console.log(`🔬 格物文档: ${stats.byCategory.docs.gewu.count} 篇, ${stats.byCategory.docs.gewu.words.toLocaleString()} 字`);
        console.log(`📚 致知文档: ${stats.byCategory.docs.zhizhi.count} 篇, ${stats.byCategory.docs.zhizhi.words.toLocaleString()} 字`);
        console.log(`⏰ 统计时间: ${new Date(stats.lastUpdated).toLocaleString('zh-CN')}`);

        // 显示排行
        console.log('\n🏆 最长文章 TOP 5:');
        const allArticles = [
          ...stats.byCategory.blog.articles,
          ...stats.byCategory.docs.gewu.articles,
          ...stats.byCategory.docs.zhizhi.articles
        ].sort((a, b) => b.words - a.words);

        allArticles.slice(0, 5).forEach((article, index) => {
          console.log(`   ${index + 1}. ${article.title} - ${article.words} 字`);
        });
      }

      result = stats;
    }

    // 如果在 CI/CD 环境中，输出环境变量
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::set-output name=total_words::${result.totalWords || 0}`);
      console.log(`::set-output name=total_chars::${result.totalChars || 0}`);
      console.log(`::set-output name=blog_count::${result.byCategory?.blog?.count || 0}`);
      console.log(`::set-output name=docs_count::${(result.byCategory?.docs?.gewu?.count || 0) + (result.byCategory?.docs?.zhizhi?.count || 0)}`);
    }

  } catch (error) {
    console.error('❌ 统计过程中出现错误:');
    console.error(error);
    process.exit(1);
  }
}

// 显示帮助信息
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  program.help();
}

main();