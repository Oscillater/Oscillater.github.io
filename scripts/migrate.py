#!/usr/bin/env python3
"""
Obsidian → Docusaurus 迁移脚本
用法：在 MIGRATE_LIST 中配置好条目，运行 python scripts/migrate.py
"""

import re
import shutil
import sys
import io
from pathlib import Path

# 修复 Windows 终端 GBK 编码问题
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ============================================================
#  在这里配置要迁移的文件
# ============================================================
#MIGRATE_LIST = []

# Obsidian Vault 根目录（用于查找图片）
#VAULT_ROOT = 


# ============================================================
#  主流程
# ============================================================
def main():
    for i, entry in enumerate(MIGRATE_LIST, 1):
        print(f"[{i}/{len(MIGRATE_LIST)}] 迁移: {entry['input']}")
        process_entry(entry)
    print("完成！")


def process_entry(entry: dict):
    src = Path(entry["input"])
    dst = Path(entry["output"])
    doc_id = entry["id"]

    if not src.exists():
        print(f"  错误: 源文件不存在 {src}")
        return

    # 读取源文件
    content = src.read_text(encoding="utf-8")

    # 1. 收集并复制图片
    content = handle_images(content, src, doc_id, dst)

    # 2. 格式转换（按顺序）
    content = convert_callouts(content)
    content = convert_highlights(content)
    content = convert_wiki_links(content)
    content = convert_excalidraw_embeds(content)
    content = remove_block_ids(content)
    content = remove_inline_tags(content)

    # 3. MDX 兼容性修复（在 frontmatter 之前）
    content = fix_for_mdx(content)

    # 3. 添加 frontmatter
    content = add_frontmatter(content, entry)

    # 4. 写出
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.with_suffix(".md").write_text(content, encoding="utf-8")
    print(f"  → {dst}.md")


def normalize_img_filename(name: str) -> str:
    """'Pasted image xxx.png' → 'Pastedimagexxx.png'，与现有仓库风格一致"""
    return name.replace(" ", "")


def find_image(filename: str, src_file: Path) -> Path | None:
    """在 Vault 根目录和源文件所在目录中查找图片"""
    for search_dir in [src_file.parent, VAULT_ROOT]:
        candidate = search_dir / filename
        if candidate.exists():
            return candidate
    return None


def handle_images(content: str, src_file: Path, doc_id: str, dst: Path) -> str:
    """处理 ![[image]] 引用：复制图片 + 替换路径"""
    # 匹配 ![[filename]] 和 ![[filename|...]]（包括 inlR|N, N 等尺寸修饰）
    pattern = r"!\[\[([^\]|]+?)(?:\|[^\]]*?)?\]\]"
    img_dir = dst.parent.parent.parent / "static" / "img" / doc_id
    img_dir.mkdir(parents=True, exist_ok=True)

    def replacer(match):
        raw_name = match.group(1).strip()
        # 跳过 excalidraw
        if raw_name.endswith(".excalidraw"):
            return match.group(0)
        # 只处理图片
        if not re.search(r"\.(png|jpe?g|gif|webp|svg)$", raw_name, re.IGNORECASE):
            return match.group(0)
        # 查找并复制
        img_path = find_image(raw_name, src_file)
        if img_path is None:
            print(f"  ⚠ 图片未找到: {raw_name}")
            return match.group(0)
        new_name = normalize_img_filename(raw_name)
        shutil.copy2(img_path, img_dir / new_name)
        return f"![](/img/{doc_id}/{new_name})"

    new_content = re.sub(pattern, replacer, content)
    copied = len(re.findall(pattern, content))
    if copied:
        print(f"  [IMG] {copied} 张图片 -> static/img/{doc_id}/")
    return new_content


CALLOUT_MAP = {
    "note": "note",
    "Note": "note",
    "tip": "tip",
    "Tips": "tip",
    "warning": "warning",
    "warn": "warning",
    "Warning": "warning",
    "example": "info",
    "quote": "info",
    "attention": "warning",
    "info": "info",
}

CALLOUT_RE = re.compile(r"^(\s*)(>{1,2})\[!(\w+)\]\s*$")


def _is_quote_line(line: str, level: int) -> bool:
    """判断行是否是 level 级的引用行"""
    stripped = line.lstrip()
    return stripped.startswith(">" * level) and (
        len(stripped) == level or not stripped[level].startswith(">")
    )


def _strip_quote_prefix(line: str, level: int) -> str:
    """去掉行首的 > 前缀，返回内容部分"""
    stripped = line.lstrip()
    # 去掉 level 个 >
    content = stripped[level:]
    # 去掉紧跟的一个空格（如果有）
    if content.startswith(" "):
        content = content[1:]
    return content


def convert_callouts(content: str) -> str:
    """将 Obsidian callout (>[/!type]) 转为 Docusaurus :::type"""
    lines = content.split("\n")
    result = []
    i = 0
    while i < len(lines):
        m = CALLOUT_RE.match(lines[i])
        if m:
            indent = m.group(1)
            level = len(m.group(2))
            ctype = CALLOUT_MAP.get(m.group(3), "note")
            block_lines = []
            i += 1
            while i < len(lines):
                line = lines[i]
                if _is_quote_line(line, level):
                    block_lines.append(_strip_quote_prefix(line, level))
                    i += 1
                elif line.strip() == "":
                    # 空行：如果后面紧跟的还是引用行（但不是新 callout），则是 callout 内空行
                    next_is_continuation = (
                        i + 1 < len(lines)
                        and _is_quote_line(lines[i + 1], level)
                        and not CALLOUT_RE.match(lines[i + 1])
                    )
                    if next_is_continuation:
                        block_lines.append("")
                        i += 1
                    else:
                        break
                else:
                    break
            prefix = indent if level > 1 else ""
            result.append(prefix + ":::" + ctype)
            result.extend(block_lines)
            result.append(prefix + ":::")
        else:
            result.append(lines[i])
            i += 1
    return "\n".join(result)


def convert_highlights(content: str) -> str:
    """==高亮== → <mark>高亮</mark>"""
    return re.sub(r"==(.+?)==", r"<mark>\1</mark>", content)


def convert_excalidraw_embeds(content: str) -> str:
    """![[Drawing xxx.excalidraw]] / [[Drawing xxx.excalidraw]] → HTML 注释"""
    return re.sub(
        r"!?\[\[(Drawing [^\]]+\.excalidraw)\]\]",
        r"<!-- Excalidraw: \1 -->",
        content,
    )


def remove_block_ids(content: str) -> str:
    """删除行尾的 ^blockid（如 ' ^977c93'）"""
    return re.sub(r"\s+\^[a-f0-9]+\s*$", "", content, flags=re.MULTILINE)


def remove_inline_tags(content: str) -> str:
    """删除独立成行的 Obsidian 标签（如 '#文论'，注意不是 markdown 标题 '# 标题'）"""
    return re.sub(r"^\s*#[^\s#].+$", "", content, flags=re.MULTILINE)


def fix_for_mdx(content: str) -> str:
    """修复 MDX 不兼容的语法"""

    # 1. <br> → <br />（MDX 要求自闭合标签）
    content = re.sub(r"<br\s*>", "<br />", content)

    # 2. 修复连续的 $$ 块（Obsidian 中每个公式独立用 $$ 包裹，MDX 解析不稳定）
    #    2a. 将单行 $$公式$$（公式不跨行）转为 $公式$ + 后跟空格
    #        用函数确保替换后公式间不粘连
    def replace_single_line_math(m):
        return "$" + m.group(1) + "$ "
    content = re.sub(r"\$\$([^\n$]+?)\$\$", replace_single_line_math, content)

    #    2b. 将 $$\n单行\n$$（中间可能有空行）转为 $单行$
    prev = None
    while prev != content:
        prev = content
        content = re.sub(r"\$\$\n\s*\n?([^\n$]+)\n\s*\n?\$\$", r"$\1$", content)

    #    2c. 清理剩余的连续空 $$ 行（两个相邻的 $$ 之间只有空白）
    content = re.sub(r"\$\$\s*\n\s*\$\$", "", content)

    # 3. 转义中文书名号中的 < >（如 《<阿凡达>》→ 《阿凡达》，或 <共产党人> → 《共产党人》）
    content = re.sub(r"《\s*<([^>]+)>\s*》", r"《\1》", content)
    # 匹配 <中文字符...> （不含其他标签属性）→ 《...》
    content = re.sub(r"<([\u4e00-\u9fff][^<>]*?[\u4e00-\u9fff\u3000-\u303f])>", r"《\1》", content)

    # 4. 转义数学公式外的 < > 为 HTML 实体
    #    策略：逐行处理，跳过代码块和数学块
    lines = content.split("\n")
    result = []
    in_code_block = False
    in_math_block = False
    for line in lines:
        # 跟踪代码块
        if re.match(r"^\s*```", line) and not in_math_block:
            in_code_block = not in_code_block
            result.append(line)
            continue
        # 跟踪数学块 $$...$$
        if line.strip() == "$$":
            in_math_block = not in_math_block
            result.append(line)
            continue
        if in_code_block or in_math_block:
            result.append(line)
            continue
        # 在普通文本行中，转义非 HTML 标签的 < 和独立 >
        line = _escape_lt_gt_in_text(line)
        result.append(line)
    return "\n".join(result)


# 已知的合法 HTML 标签（小写，不含尖括号）
_KNOWN_TAGS = frozenset({
    "br", "br /", "mark", "/mark", "details", "/details", "summary", "/summary",
    "code", "/code", "pre", "/pre", "span", "/span", "div", "/div",
    "p", "/p", "em", "/em", "strong", "/strong", "b", "/b", "i", "/i",
    "a", "/a", "img", "table", "/table", "tr", "/tr", "td", "/td",
    "th", "/th", "thead", "/thead", "tbody", "/tbody", "ul", "/ul",
    "ol", "/ol", "li", "/li", "h1", "/h1", "h2", "/h2", "h3", "/h3",
    "h4", "/h4", "h5", "/h5", "h6", "/h6", "hr", "hr /", "input",
    "sup", "/sup", "sub", "/sub", "del", "/del",
})


def _escape_lt_gt_in_text(line: str) -> str:
    """转义一行中非 HTML 标签的 < 和不在标签内的独立 >，跳过 $...$ 数学"""
    result = []
    i = 0
    in_inline_math = False
    while i < len(line):
        # 跟踪行内数学 $...$
        if line[i] == '$' and not in_inline_math:
            # 检查是否是 $$（块级，不应该在普通行中出现但以防万一）
            if i + 1 < len(line) and line[i + 1] == '$':
                result.append('$$')
                i += 2
                continue
            in_inline_math = True
            result.append('$')
            i += 1
            continue
        if line[i] == '$' and in_inline_math:
            in_inline_math = False
            result.append('$')
            i += 1
            continue
        if in_inline_math:
            result.append(line[i])
            i += 1
            continue
        if line[i] == '<':
            # 尝试匹配 <tag...> 或 <tag ...>
            m = re.match(r"<(/?\w[^>]*)>", line[i:])
            if m:
                tag_name = m.group(1).strip().lower()
                if tag_name in _KNOWN_TAGS:
                    result.append(m.group(0))
                    i += m.end()
                    continue
            # 不是合法标签，转义
            result.append("&lt;")
            i += 1
        elif line[i] == '>':
            result.append("&gt;")
            i += 1
        else:
            result.append(line[i])
            i += 1
    return "".join(result)


WIKI_LINK_RE = re.compile(r"\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]")


def convert_wiki_links(content: str) -> str:
    """[[file]] / [[file|text]] → 纯文本或链接（排除已处理的图片和 excalidraw）"""
    def replacer(m):
        target = m.group(1).strip()
        display = m.group(2)
        # 跳过图片和 excalidraw（已在前面处理）
        if re.search(r"\.(png|jpe?g|gif|webp|svg|excalidraw)$", target, re.IGNORECASE):
            return m.group(0)
        # 跳过 block reference 链接 [[file#^id]]
        if "#^" in target:
            text = display if display else target.split("#")[0]
            return text
        # 跳过 heading anchor 链接 [[file#heading]]
        if "#" in target:
            text = display if display else target.split("#")[0]
            return text
        text = display if display else target
        return f"[{text}]({target}.md)"

    return WIKI_LINK_RE.sub(replacer, content)


def add_frontmatter(content: str, entry: dict) -> str:
    """添加 Docusaurus frontmatter，并将所有标题降一级（因为 frontmatter title 已是 h1）"""
    title = entry["title"]
    doc_id = entry["id"]
    desc = entry.get("description", "")
    lines = ["---", f"title: {title}"]
    if desc:
        lines.append(f"description: {desc}")
    lines.extend([f"id: {doc_id}", "---", ""])
    # 所有 # 标题加一级：# → ##，## → ###，以此类推
    def bump_heading(m):
        hashes = m.group(1)
        rest = m.group(2)
        return "#" + hashes + rest
    content = re.sub(r"^(#{1,6})(\s+.+)$", bump_heading, content, flags=re.MULTILINE)
    return "\n".join(lines) + content


if __name__ == "__main__":
    main()
