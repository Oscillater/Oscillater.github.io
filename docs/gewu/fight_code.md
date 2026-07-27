---
title: 机考全攻略
description: C++ 机考语法速查与算法选择指南 coauthor by opus 4.6
id: fight_code
---
# 需要注意的

- 考虑下标范围
- 注意变量名：思考变量名是否命名重复
- 注意循环从0开始还是从1开始
- bfs/dij不要忘记查看是否visited过



# 机考 C++ 语法汇总

> 一份文件搞定机试语法速查。考前过一遍，考中当字典翻。

---

## 1. 基本语法速查

### 1.1 数据类型与范围

| 类型 | 字节 | 最大值 | 大约 |
|------|------|--------|------|
| `int` | 4 | 2^31 - 1 | 2×10^9 |
| `unsigned int` | 4 | 2^32 - 1 | 4×10^9 |
| `long long` | 8 | 2^63 - 1 | 9×10^18 |
| `unsigned long long` | 8 | 2^64 - 1 | 1.8×10^19 |
| `double` | 8 | ~1.7×10^308 | 精度约 15-16 位有效数字 |
| `__int128` | 16 | 2^127 - 1 | 1.7×10^38（GCC 扩展，不能 cin/cout）|

**判断用什么类型**：看题面数据范围，出现 `a*b` 时估算乘积上界，超 2×10^9 就 `long long`。

```cpp
int a = 100000, b = 100000;
long long c = a * b;            // ❌ 先算 int*int 溢出
long long c = (long long)a * b; // ✅ 显式转换
```

### 1.2 数组声明

```cpp
int a[100];             // 一维
int a[100][100];        // 二维
char grid[N][N];        // 字符矩阵
int dx[4] = {0, 0, -1, 1};  // 方向数组，注意用 {}
int dy[4] = {-1, 1, 0, 0};
```

**全局变量**：声明在 main 外面，自动初始化为 0，且可以开大数组（栈上 ~1MB，全局 ~256MB）。

```cpp
const int N = 1005;  // 全局常量别忘 const
int dist[N];
bool vis[N];
```

### 1.3 结构体（struct）

把几个变量打包成一个类型，图论的边、链表的节点都要用。

```cpp
// 定义
struct Edge {
    int u, v, w;
};

// 使用
Edge e;
e.u = 1; e.v = 2; e.w = 5;

// 也可以直接初始化
Edge e = {1, 2, 5};

// 数组
Edge edges[1000];
edges[0] = {1, 2, 5};

// 函数返回 struct 时也能用 {}，按成员声明顺序填值
Edge makeEdge() {
    return {1, 2, 5};  // 等价于 Edge e; e.u=1; e.v=2; e.w=5; return e;
}
```

**带构造函数的写法**（链表节点常用）：
```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
    //      ↑ 参数      ↑ 把 val 设为 v，next 设为空
};

// 使用
ListNode* node = new ListNode(5);  // val=5, next=nullptr
```

`: val(v), next(nullptr)` 叫初始化列表，就是"把成员变量设成这些值"的简写。怕记不住就用下面这种等价写法：

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) {
        val = v;
        next = nullptr;
    }
};
```

两种写法效果完全一样，第二种更直观。

### 1.4 指针与引用

**指针 `*`**：存的是另一个变量的**地址**。
```cpp
int a = 10;
int* p = &a;   // p 存的是 a 的地址
cout << *p;    // 10，*p 是"顺着地址去取值"（解引用）
*p = 20;       // 通过指针修改 a 的值，现在 a == 20
```

**引用 `&`**：就是给变量**起别名**，操作引用 = 操作原变量。
```cpp
int a = 10;
int& r = a;    // r 就是 a 的别名
r = 20;        // a 也变成 20
```

**注意：`&` 有两个意思，别搞混**：
```cpp
int& r = a;    // 声明时的 & → 引用（别名），r 就是 a
int* p = &a;   // 表达式里的 & → 取地址，p 存的是 a 的地址
```
声明里的 `&` 是别名，表达式里的 `&` 是取地址。同一个符号，两件事。

**函数参数里的 `&`**：让函数能修改外面的变量。
```cpp
void swap(int& a, int& b) {  // 引用传参，能改原值
    int t = a; a = b; b = t;
}
// 不加 & 的话函数里改的是副本，外面不变
```

**什么时候用指针，什么时候用引用**：

| 场景 | 用什么 | 原因 |
|------|--------|------|
| 函数想修改外面的变量 | `&` 引用 | 简单直接 |
| 链表/树的节点 | `*` 指针 | 需要 nullptr 表示"没有"，引用做不到 |
| `const string&` 做参数 | `&` 引用 | 避免拷贝，加 const 防止修改 |

**栈上对象 vs new（堆上对象）**：

```cpp
// 栈上：直接声明，函数结束自动销毁
ListNode node(5);           // node 是一个对象
node.val;                   // 用 . 访问

// 堆上：用 new，返回指针，不会自动销毁
ListNode* p = new ListNode(5);  // p 是指针
p->val;                         // 用 -> 访问（等价于 (*p).val）
```

**什么时候用 new**：
- **链表/树**：节点数量不确定，需要动态创建 → `new`
- **普通变量/数组**：大小确定 → 直接声明，不用 new

**`.` vs `->`**：
```cpp
ListNode node(5);
node.val;       // 对象用 .

ListNode* p = &node;
p->val;         // 指针用 ->
```

一句话：**有星号（指针）用箭头 `->`，没星号（对象）用点 `.`**。

### 1.5 输入输出

```cpp
// 基本
cin >> n >> m;
cout << result << endl;

// 加速（机试建议加）
ios::sync_with_stdio(false);
cin.tie(nullptr);

// 保留 n 位小数
cout << fixed << setprecision(n) << result;  // 需要 #include <iomanip>

// C 风格（有时更方便）
scanf("%d %d", &n, &m);
printf("%.2f\n", result);   // 保留 2 位小数
```

### 1.4 常用头文件

```cpp
#include <iostream>       // cin cout
#include <algorithm>      // sort min max reverse unique lower_bound
#include <vector>
#include <queue>          // queue + priority_queue
#include <stack>
#include <string>
#include <cstring>        // memset memcpy
#include <unordered_map>
#include <unordered_set>
#include <sstream>        // istringstream
#include <iomanip>        // setprecision
#include <cmath>          // sqrt abs pow
#include <climits>        // INT_MAX INT_MIN
#include <functional>     // greater<>
```

偷懒写法（部分 OJ 支持）：`#include <bits/stdc++.h>` 包含一切。头哥支持。

### 1.5 运算符注意

```cpp
// ❌ 常见手癖错误
if (a = 0)    // 赋值，永远 false
// ✅
if (a == 0)   // 比较

// 整除
7 / 2 = 3     // int 除法向零取整
-7 / 2 = -3   // 注意负数

// 取模
7 % 3 = 1
-7 % 3 = -1   // C++ 余数跟被除数同号

// 转义字符：在字符串/字符中，\ 是转义开头
'\n'   // 换行
'\t'   // tab
'\\'   // 一个真正的反斜杠 \
// 所以按 \ 切割字符串要写 '\\'：
getline(ss, token, '\\');  // 按 \ 切割
```

---

## 2. STL 总览

STL（Standard Template Library）= 容器 + 算法 + 迭代器。机试核心就是**容器**。

### 2.1 机试常用容器速查

| 容器 | 头文件 | 一句话 | 什么时候用 |
|------|--------|--------|-----------|
| `vector` | `<vector>` | 动态数组 | 大小不确定的数组、邻接表 |
| `queue` | `<queue>` | 先进先出队列 | BFS |
| `stack` | `<stack>` | 后进先出栈 | 括号匹配、单调栈 |
| `priority_queue` | `<queue>` | 堆 | Dijkstra、取最大/最小 |
| `unordered_map` | `<unordered_map>` | 哈希表 | 计数、映射、O(1) 查找 |
| `unordered_set` | `<unordered_set>` | 哈希集合 | 去重、O(1) 判存在 |
| `string` | `<string>` | 字符串 | 字符串处理 |
| `pair` | `<utility>` | 二元组 | 坐标、`{距离, 节点}` |
| `set` | `<set>` | 有序集合 | 需要自动排序 + 去重 |
| `map` | `<map>` | 有序映射 | 需要按 key 排序 |

### 2.2 迭代器极简

```cpp
v.begin()  // 指向第一个元素
v.end()    // 指向最后一个元素的下一位（不是最后一个）
```

大部分时候只在 `sort(v.begin(), v.end())` 和 `v.erase(v.begin() + i)` 里用到，不需要深入。

---

## 3. 各容器详细用法

### 3.1 vector

```cpp
#include <vector>
```

**声明**：
```cpp
vector<int> v;              // 空
vector<int> v(10);          // 10 个 0
vector<int> v(10, -1);      // 10 个 -1
vector<int> v = {1, 2, 3};  // 初始值
vector<vector<int>> g(n, vector<int>(m, 0));  // n×m 二维
```

**操作**：

| 方法 | 含义 | 复杂度 |
|------|------|--------|
| `v.push_back(x)` | 末尾加元素 | O(1) |
| `v.pop_back()` | 删末尾 | O(1) |
| `v[i]` | 访问第 i 个 | O(1) |
| `v.size()` | 元素个数 | O(1) |
| `v.empty()` | 是否为空 | O(1) |
| `v.clear()` | 清空 | O(n) |
| `v.erase(v.begin()+i)` | 删第 i 个 | O(n) |
| `v.insert(v.begin()+i, x)` | 在第 i 个前插入 | O(n) |

**常见用法**：
```cpp
// 去重
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());

// 遍历
for (int i = 0; i < (int)v.size(); i++) ...  // 下标，加 (int) 因为 size() 返回无符号数，空 vector 时 size()-1 会下溢成巨大值
for (int x : v) ...                           // range-for
```

---

### 3.2 string

```cpp
#include <string>
```

**操作**：

| 方法 | 含义 |
|------|------|
| `s.size()` / `s.length()` | 长度 |
| `s[i]` | 第 i 个字符 |
| `s + t` | 拼接 |
| `s.substr(start, len)` | 从 start 截取 len 个字符 |
| `s.find("xxx")` | 找子串，返回位置，找不到返回 `string::npos` |
| `s.erase(pos, len)` | 从 pos 删 len 个字符 |
| `s.insert(pos, "xxx")` | 在 pos 处插入 |
| `s.push_back(c)` | 末尾加一个字符 |
| `s.pop_back()` | 删末尾字符 |
| `s.append(str)` | 末尾追加一个字符串（等价于 `s += str`）|
| `s.append(n, c)` | 末尾追加 **n 个字符 c**（重复 n 遍）|
| `s.empty()` | 是否为空 |
| `s.clear()` | 清空 |

```cpp
string s = "ab";
s.append("cd");     // "abcd"
s.append(3, 'x');   // "abcdxxx"   ← 重复 n 遍，手写循环的替代
```

`s.append(n, c)` 在「把压缩状态还原成字符串」时很好用，比如栈里存 `{字符, 次数}`，
最后拼结果：`for (auto& p : st) res.append(p.second, p.first);`

**常用技巧**：
```cpp
// 判断子串存在
if (s.find("abc") != string::npos) ...

// 大小写转换（单个字符）
char c = toupper('a');  // 'A'
char c = tolower('A');  // 'a'

// 字符判断函数（都在 <cctype> 里，但 iostream 一般已包含）
isalpha(c)   // 是否是字母（a-z A-Z）
isdigit(c)   // 是否是数字（0-9）
isalnum(c)   // 是否是字母或数字
isupper(c)   // 是否是大写字母
islower(c)   // 是否是小写字母
isspace(c)   // 是否是空白（空格、\t、\n...）

// 数字 ↔ 字符串
int n = stoi("123");           // string → int
long long n = stoll("123");   // string → long long
string s = to_string(123);    // int → string

// 字符串比较：直接用 ==, <, > （字典序）
if (s1 == s2) ...
```

**坑**：`s.size()` 返回 `size_t`（无符号），`s.size() - 1` 在空串时下溢为超大数。安全写法：`(int)s.size() - 1`。

---

### 3.3 queue

```cpp
#include <queue>
```

| 方法 | 含义 |
|------|------|
| `q.push(x)` | 入队 |
| `q.pop()` | 出队（不返回值） |
| `q.front()` | 队头元素 |
| `q.back()` | 队尾元素 |
| `q.size()` | 大小 |
| `q.empty()` | 是否为空 |

**BFS 模板**：
```cpp
queue<pair<int,int>> q;
q.push({startX, startY});
vis[startX][startY] = true;

while (!q.empty()) {
    auto [x, y] = q.front();  // C++17 结构化绑定，头哥不支持，见下方替代
    q.pop();
    for (int d = 0; d < 4; d++) {
        int nx = x + dx[d];
        int ny = y + dy[d];
        if (nx >= 0 && nx < n && ny >= 0 && ny < m && !vis[nx][ny]) {
            vis[nx][ny] = true;
            q.push({nx, ny});
        }
    }
}
```

**头哥替代写法**（不用结构化绑定）：
```cpp
pair<int,int> cur = q.front();
q.pop();
int x = cur.first, y = cur.second;
```

---

### 3.4 stack

```cpp
#include <stack>
```

| 方法 | 含义 |
|------|------|
| `st.push(x)` | 入栈 |
| `st.pop()` | 出栈（不返回值） |
| `st.top()` | 栈顶元素 |
| `st.size()` | 大小 |
| `st.empty()` | 是否为空 |

**示例：括号匹配**：
```cpp
// 单种括号：栈里只有 '('，pop 出来一定是 '('，不用判断栈顶
stack<char> st;
for (char c : s) {
    if (c == '(') {
        st.push(c);
    } else if (c == ')') {
        if (st.empty()) { cout << "NO"; return 0; }
        st.pop();
    }
}
cout << (st.empty() ? "YES" : "NO");

// 多种括号 ()[]{}：必须判断栈顶是否和当前右括号匹配
stack<char> st;
for (char c : s) {
    if (c == '(' || c == '[' || c == '{') {
        st.push(c);
    } else {
        if (st.empty()) { cout << "NO"; return 0; }
        char top = st.top();
        if ((c == ')' && top == '(') ||
            (c == ']' && top == '[') ||
            (c == '}' && top == '{')) {
            st.pop();
        } else {
            cout << "NO"; return 0;  // 栈顶不匹配
        }
    }
}
cout << (st.empty() ? "YES" : "NO");
```

---

### 3.5 priority_queue

```cpp
#include <queue>
```

**声明**：
```cpp
priority_queue<int> pq;                                  // 大顶堆（默认）
priority_queue<int, vector<int>, greater<int>> pq;       // 小顶堆
```

| 方法 | 含义 |
|------|------|
| `pq.push(x)` | 入堆 |
| `pq.pop()` | 弹出堆顶（不返回值） |
| `pq.top()` | 堆顶元素 |
| `pq.size()` | 大小 |
| `pq.empty()` | 是否为空 |

**反直觉记忆**：`greater` = 小顶堆，`less`（默认）= 大顶堆。

**Dijkstra 常见用法**：
```cpp
// {距离, 节点号}，小顶堆，距离小的先出
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
pq.push({0, start});
```

**自定义 struct 排序**：
```cpp
struct Node {
    int dist, id;
};

struct Cmp {
    bool operator()(const Node& a, const Node& b) const {
        return a.dist > b.dist;  // 返回 true = a 沉底 = 小顶堆
    }
};
priority_queue<Node, vector<Node>, Cmp> pq;
```

**坑**：
- pq 比较器语义和 sort **相反**：返回 true = 排后面（沉底）
- `greater` = 小顶堆（背下来）
- 模板参数必须 3 个全写：`<元素, 容器, 比较器>`

---

### 3.6 unordered_map

```cpp
#include <unordered_map>
```

| 方法 | 含义 |
|------|------|
| `m[key]` | 访问/创建（不存在则自动创建，默认值 0/""/...）|
| `m[key] = val` | 赋值 |
| `m.count(key)` | 是否存在（0 或 1）|
| `m.find(key)` | 返回迭代器，不存在返回 `m.end()` |
| `m.erase(key)` | 删除 |
| `m.size()` | 大小 |
| `m.empty()` | 是否为空 |
| `m.clear()` | 清空 |

**遍历**：
```cpp
for (auto& p : m) {
    cout << p.first << " " << p.second << endl;
}
```

**典型用法——计数**：
```cpp
unordered_map<int, int> cnt;
for (int x : nums) cnt[x]++;
```

**坑**：`m[key]` 会自动创建条目！只想查询不想创建用 `m.count(key)` 或 `m.find(key)`。

**技巧：字符种类有限时，用数组代替 map（更快更简单）**：
```cpp
int cnt[26] = {};       // 只有小写字母，下标 c - 'a'
int cnt[128] = {};      // 所有 ASCII 字符，下标直接用 (int)c
cnt[s[i] - 'a']++;      // 小写字母计数
char m[(int)128] = {};   // 字符映射表，m['W'] = 'Q'
```

| 场景 | 数组大小 | 下标 |
|------|---------|------|
| 只有小写字母 | `[26]` | `c - 'a'` |
| 只有大写字母 | `[26]` | `c - 'A'` |
| 只有数字 | `[10]` | `c - '0'` |
| 所有可见字符 | `[128]` | `(int)c` |

---

### 3.7 unordered_set

```cpp
#include <unordered_set>
```

| 方法 | 含义 |
|------|------|
| `s.insert(x)` | 插入 |
| `s.count(x)` | 是否存在（0 或 1）|
| `s.erase(x)` | 删除 |
| `s.size()` | 大小 |
| `s.empty()` | 是否为空 |
| `s.clear()` | 清空 |

**典型用法——去重/判重**：
```cpp
unordered_set<int> visited;
if (visited.count(x) == 0) {
    visited.insert(x);
    // 第一次遇到 x
}
```

**注意**：`unordered_set` / `unordered_map` 的 key 必须是可哈希的类型（int、string、pair 不行）。要用 `pair` 做 key，改用 `set` / `map`，或自定义哈希。

---

### 3.8 pair

```cpp
#include <utility>  // 通常 iostream 已经包含了
```

**声明与使用**：
```cpp
pair<int, int> p = {3, 5};       // C++11
pair<int, int> p = make_pair(3, 5);
p.first;   // 3
p.second;  // 5
```

**配合容器**：
```cpp
queue<pair<int,int>> q;
q.push({i, j});              // C++11 直接用 {}
q.push(make_pair(i, j));     // 或 make_pair

priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
pq.push({dist, node});
```

**pair 默认比较**：先比 first，first 相同再比 second。利用这个特性，`{距离, 节点}` 放进小顶堆会自动按距离排。

---

### 3.9 链表（手写）

机试中链表一般不用 STL 的 `list`，而是**手写 struct + 指针**。

**节点定义**：
```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};
```

**常用操作**：

```cpp
// 创建节点
ListNode* node = new ListNode(5);

// 头插法（在链表头部插入）
ListNode* head = nullptr;
for (int i = 0; i < n; i++) {
    int x; cin >> x;
    ListNode* node = new ListNode(x);
    node->next = head;
    head = node;
}

// 尾插法（在链表尾部插入）
ListNode* head = nullptr;
ListNode* tail = nullptr;
for (int i = 0; i < n; i++) {
    int x; cin >> x;
    ListNode* node = new ListNode(x);
    if (!head) {
        head = tail = node;
    } else {
        tail->next = node;
        tail = node;
    }
}

// 遍历
ListNode* cur = head;
while (cur) {
    cout << cur->val << " ";
    cur = cur->next;
}

// 删除某个节点（删 cur 的下一个）
ListNode* toDelete = cur->next;
cur->next = toDelete->next;
delete toDelete;

// 在 cur 后面插入新节点
ListNode* node = new ListNode(x);
node->next = cur->next;
cur->next = node;
```

**常见技巧**：

```cpp
// 哑节点（dummy head）—— 简化头部操作
ListNode dummy(0);
dummy.next = head;
ListNode* prev = &dummy;
// 操作完后 head = dummy.next;

// 快慢指针 —— 找中点
ListNode* slow = head;
ListNode* fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
}
// slow 现在指向中点

// 反转链表
ListNode* prev = nullptr;
ListNode* cur = head;
while (cur) {
    ListNode* nxt = cur->next;
    cur->next = prev;
    prev = cur;
    cur = nxt;
}
head = prev;
```

**坑**：
- 操作指针前先判 `nullptr`，否则段错误
- 删除/插入时画图理清指针顺序，先接新的再断旧的
- 机试一般不用 `delete` 释放内存（程序结束自动回收），但别野指针访问

---

## 4. 排序与自定义比较

### 4.1 sort 基本用法

```cpp
#include <algorithm>

sort(arr, arr + n);                     // 原生数组，升序
sort(v.begin(), v.end());               // vector，升序
sort(v.begin(), v.end(), greater<int>()); // 降序
```

**`stable_sort`**：值相同的元素保持原来的先后顺序。

```cpp
// sort：相同值的元素顺序不确定
// stable_sort：相同值的元素保持输入时的先后顺序

// 典型场景：按忽略大小写排序，但同一字母的大小写保持原序
stable_sort(v.begin(), v.end(), [](char a, char b) {
    return tolower(a) < tolower(b);
});
// 输入 B a b A → 输出 a A B b（a组内 a 先于 A，因为原始顺序如此）
```

什么时候用：题目要求"排序后相同元素保持原来顺序"时。其他时候用普通 `sort` 就行。

### 4.2 自定义比较——三种写法

**写法 A：独立函数**（推荐，清晰可复用）
```cpp
bool cmp(const Edge& a, const Edge& b) {
    return a.w < b.w;   // 返回 true = a 排前面 = 升序
}
sort(edges, edges + m, cmp);
```

**写法 B：Lambda**（一次性用）
```cpp
sort(v.begin(), v.end(), [](const int& a, const int& b) {
    return a > b;   // 降序
});
```

**Lambda 语法**：`[捕获](参数) { 函数体 }`——就是一个没名字的函数。

| 捕获列表 | 意思 |
|---------|------|
| `[]` | 什么都不捕获，lambda 里只能用自己的参数 |
| `[&]` | 捕获外面所有变量的引用（能读能改外部变量）|
| `[=]` | 捕获外面所有变量的拷贝（能读不能改）|

"外面" = lambda 写在哪个作用域，那里能看到的变量就是"外面的"。

```cpp
int target = 5;
// [&] 让 lambda 能看到 target
sort(v.begin(), v.end(), [&](int a, int b) {
    return abs(a - target) < abs(b - target);  // 按离 target 的距离排序
});
// 不加 [&] 就看不到 target，编译报错
```

考试时：lambda 里要用外部变量就写 `[&]`，不需要就写 `[]`。

**写法 C：重载 operator\<**（类型天然有序时）
```cpp
struct Edge {
    int u, v, w;
    bool operator<(const Edge& o) const {
        return w < o.w;
    }
};
sort(edges, edges + m);  // 不传 cmp，自动用 operator<
```

### 4.3 多关键字排序

```cpp
bool cmp(const Student& a, const Student& b) {
    if (a.score != b.score) return a.score > b.score;  // 分数降序
    return a.age < b.age;                               // 同分按年龄升序
}
```

### 4.4 priority_queue 比较器

| | sort / set / map | priority_queue |
|--|-----------------|----------------|
| 返回 true 表示 | a 排前面 | a 沉底（远离堆顶）|
| 升序 / 小顶堆 | `a < b` (less) | `a > b` (greater) |
| 降序 / 大顶堆 | `a > b` (greater) | `a < b` (less) |

**通用写法（struct with operator()）**：
```cpp
struct Cmp {
    bool operator()(const T& a, const T& b) const {
        return a.field > b.field;  // pq 小顶堆
    }
};
priority_queue<T, vector<T>, Cmp> pq;
```

### 4.5 五大坑

**坑 1：必须严格 `<`，不能 `<=`**
```cpp
return a.w <= b.w;  // ❌ 未定义行为，sort 可能崩溃
return a.w < b.w;   // ✅
```

**坑 2：参数必须 `const T&`**
```cpp
bool cmp(T a, T b) { ... }            // ❌ 拷贝，大对象巨慢
bool cmp(const T& a, const T& b) { ... }  // ✅
```

**坑 3：operator< 必须是 const 成员函数**
```cpp
bool operator<(const T& o) { ... }        // ❌ 缺 const
bool operator<(const T& o) const { ... }  // ✅
```

**坑 4：greater = 小顶堆（背下来）**

**坑 5：lambda 用在 priority_queue 需要 decltype**
```cpp
auto cmp = [](int a, int b) { return a > b; };
priority_queue<int, vector<int>, decltype(cmp)> pq(cmp);
// 不如直接用 struct Cmp，更简单
```

---

## 5. 输入输出处理

### 5.1 cin vs getline

| | `cin >> x` | `getline(cin, s)` |
|--|-----------|-------------------|
| 读取方式 | 跳过空白，读到下一个空白停 | 读整行（含空格），遇换行停 |
| 换行符 | 留在缓冲区 | 吃掉 |
| 适合 | 单个数字/单词 | 有空格的整行 |

### 5.2 混用的坑 + 修复

```cpp
int n;
cin >> n;
// 此时 '\n' 还在缓冲区！
cin.ignore();       // ← 必须加，吃掉残留的 '\n'
string s;
getline(cin, s);    // 现在正常了
```

**规则**：`cin >>` 后面紧跟 `getline`，中间**必须** `cin.ignore()`。

### 5.3 常见输入模式

**模式 A：全是数字/单词**
```cpp
cin >> id >> name >> age;
```

**模式 B：整行有空格**
```cpp
string line;
getline(cin, line);
```

**模式 C：先读数字再读行（最常踩坑）**
```cpp
int n;
cin >> n;
cin.ignore();
for (int i = 0; i < n; i++) {
    string line;
    getline(cin, line);
}
```

**模式 D：读到 EOF**
```cpp
string line;
while (getline(cin, line)) {
    // 处理 line
}
// 或
int n;
while (cin >> n) {
    // 处理 n
}
```

### 5.4 字符串切割

**先按「输入长什么样」选方法**：

| 输入长什么样 | 用什么 |
|-------------|--------|
| `1 2 3` 空格分隔，个数已知 | `cin >> a >> b >> c` |
| `1 2 3` 空格分隔，个数不定 | `getline` + `istringstream` + `while (iss >> x)` |
| `a\b\c` 自定义分隔符 | `istringstream` + `getline(iss, tok, '\\')` |
| `1,2,,3` CSV（可能有空字段）| 同上，分隔符换 `,` |
| `255.12.2.3` 数字和符号交替 | `cin >> a >> dot >> b >> ...` |
| `[key] value` 固定标记切两半 | `find` + `substr` |
| 整行含空格 | `getline(cin, line)` |

---

#### ① `cin >>` 直接读（空格分隔，最常用）

```cpp
string id, name;
int age;
cin >> id >> name >> age;        // 输入 "01 张三 21"

// 个数不定，读到文件尾
int x;
while (cin >> x) { ... }
```

`>>` 自动跳过空格和换行，所以一行几个、分几行写都无所谓。

---

#### ② `cin >>` 交替读（数字和符号交替的固定格式）

```cpp
// "255.12.2.3"
int a, b, c, d;
char dot;
cin >> a >> dot >> b >> dot >> c >> dot >> d;
// a=255, b=12, c=2, d=3

// "1+i2"（复数）
int re, im;
char plus, ch_i;
cin >> re >> plus >> ch_i >> im;
// re=1, im=2

// "2026-07-27"
int y, m, d;
char dash;
cin >> y >> dash >> m >> dash >> d;
```

**原理**：`>> int` 读连续数字，遇到非数字就停；`>> char` 读掉那个符号。交替进行。

| 类型 | 行为 |
|------|------|
| `>> int` | 跳过空白，读连续数字，遇非数字停 |
| `>> char` | 跳过空白，读一个字符（`.` `+` `-` 都能读）|
| `>> string` | 跳过空白，读到下一个空白停 |

---

#### ③ `istringstream` 按空格切（个数不定时用）

```cpp
#include <sstream>

string line;
getline(cin, line);              // 先把整行读进来
istringstream iss(line);         // 把字符串包装成一个"流"

string word;
while (iss >> word) {            // 之后就跟 cin >> 一样用
    cout << word << endl;        // "aa bb cc" → aa, bb, cc
}
```

读数字同理：

```cpp
istringstream iss(line);
int x;
vector<int> nums;
while (iss >> x) nums.push_back(x);    // 一行里有几个数都能读进来
```

**为什么要它**：`cin >>` 不知道一行在哪结束。想「按行处理，每行内部再切」就得先 `getline` 拿到整行，再用 `istringstream` 在这一行里面切。

---

#### ④ `istringstream` + `getline` 按任意字符切

`getline` 的第三个参数可以指定分隔符（默认是 `\n`）：

```cpp
// 按反斜杠切路径 "a\b\c"
istringstream iss(path);
string token;
while (getline(iss, token, '\\')) {     // '\\' 才是一个反斜杠
    if (token.empty()) continue;         // 开头/连续分隔符会切出空串
    cout << token << endl;               // a, b, c
}

// 按逗号切 CSV
istringstream iss(line);
string field;
while (getline(iss, field, ',')) {
    cout << "[" << field << "]" << endl;
}
// "1,2,,3" → [1] [2] [] [3]     ← 注意空字段也会切出来
```

**跟 ③ 的区别**：

| | `iss >> word` | `getline(iss, tok, ch)` |
|--|--------------|------------------------|
| 分隔符 | 只能是空白 | 任意指定字符 |
| 连续分隔符 | 自动跳过 | **会切出空串**，要自己判 |
| 场景 | 空格分隔 | 路径、CSV、自定义格式 |

---

#### ⑤ `find` + `substr`（固定标记，切两半）

```cpp
// "[spell] func" → 取出 "spell" 和 "func"
string s = "[spell] func";
int p = s.find(']');                 // 找 ']' 的位置，返回 6
string a = s.substr(1, p - 1);       // 从下标1开始取5个 → "spell"
string b = s.substr(p + 2);          // 从下标8取到末尾 → "func"
```

`substr` 两种用法：

```cpp
s.substr(start, len)     // 从 start 开始取 len 个
s.substr(start)          // 从 start 一直取到末尾
```

**找不到要判**：

```cpp
int p = s.find(',');
if (p == (int)string::npos) {        // npos 表示没找到
    // 没有逗号
}
```

**循环切多段**：

```cpp
string s = "a,b,c";
int start = 0;
while (true) {
    int p = s.find(',', start);      // 从 start 开始往后找
    if (p == (int)string::npos) {
        cout << s.substr(start) << endl;      // 最后一段
        break;
    }
    cout << s.substr(start, p - start) << endl;
    start = p + 1;                   // 跳过这个逗号
}
```

这段能用 ④ 的 `getline` 两行搞定，所以**优先用 ④**，`find+substr` 留给「按固定标记切两半」这种场景。

---

#### ⑥ 字符串 ↔ 数字

```cpp
int n       = stoi("123");
long long m = stoll("12345678901");
string s    = to_string(456);

// 手动转（不怕格式问题）
int num = 0;
for (int i = 0; i < (int)s.size(); i++) {
    num = num * 10 + (s[i] - '0');
}
```

---

#### ⑦ 三个坑

```cpp
// 坑1：cin >> 之后接 getline，会读到残留的换行符
int n;
cin >> n;
cin.ignore();                    // ← 必须加
string line;
getline(cin, line);

// 坑2：getline 按字符切时，空字段也会被切出来
// "a,,b" 按 ',' 切 → "a", "", "b"，要不要跳过空串看题目

// 坑3：反斜杠要写两个
getline(iss, token, '\\');       // ✅ 这才是按 \ 切
getline(iss, token, '\');        // ❌ 编译错误
```

---

## 6. 常用工具函数

### 6.1 memcpy / memset

```cpp
#include <cstring>

memset(arr, 0, sizeof(arr));       // 全部清零
memset(arr, -1, sizeof(arr));      // 全部设为 -1
memset(dist, 0x3f, sizeof(dist));  // 设为很大的数（约 10^9），常用于距离初始化
memcpy(dst, src, sizeof(src));     // 数组复制
```

**注意**：memset 只能可靠地设 0、-1、0x3f。不能设其他值（如 memset(arr, 1, ...) 不会让每个 int 变成 1）。

**原理**：memset 是按**字节**填的。一个字节 = 8 bit = 2 位十六进制（`0x--`）。一个 `int` = 4 字节 = 8 位十六进制。所以 `memset(arr, 0x3f, ...)` 把每个字节填 `0x3f`，一个 int 变成 `0x3f3f3f3f` = 1061109567 ≈ 10^9。同理 `memset(arr, 1, ...)` 每字节填 `0x01`，一个 int 变成 `0x01010101` = 16843009，不是 1。

### 6.2 algorithm 常用函数

```cpp
#include <algorithm>

sort(v.begin(), v.end());
reverse(v.begin(), v.end());

// 去重（必须先排序）
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());

// 二分查找（必须已排序）
lower_bound(v.begin(), v.end(), x);  // 第一个 >= x 的位置
upper_bound(v.begin(), v.end(), x);  // 第一个 > x 的位置

// 其他
max(a, b);  min(a, b);  swap(a, b);  abs(x);
fill(arr, arr + n, val);  // 用任意值填充（比 memset 安全）
```

**手写排序**（题目要求实现排序算法时用）：

```cpp
// 冒泡排序 O(n^2)：每轮把最大的冒到末尾
for (int i = 0; i < n; i++)
    for (int j = 0; j < n - 1 - i; j++)
        if (a[j] > a[j + 1]) swap(a[j], a[j + 1]);

// 选择排序 O(n^2)：每轮找最小的放到前面
for (int i = 0; i < n; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++)
        if (a[j] < a[minIdx]) minIdx = j;
    swap(a[i], a[minIdx]);
}

// 插入排序 O(n^2)：每个元素往前插到正确位置
for (int i = 1; i < n; i++) {
    int key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
    a[j + 1] = key;
}

// 快速排序 O(n log n)：选基准，分两半，递归
void quickSort(int a[], int l, int r) {
    if (l >= r) return;
    int pivot = a[l], i = l, j = r;
    while (i < j) {
        while (i < j && a[j] >= pivot) j--;
        a[i] = a[j];
        while (i < j && a[i] <= pivot) i++;
        a[j] = a[i];
    }
    a[i] = pivot;
    quickSort(a, l, i - 1);
    quickSort(a, i + 1, r);
}
// 调用：quickSort(a, 0, n - 1);

// 归并排序 O(n log n)：分两半，各自排好，合并
int tmp[N];
void mergeSort(int a[], int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(a, l, mid);
    mergeSort(a, mid + 1, r);
    int i = l, j = mid + 1, k = l;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else tmp[k++] = a[j++];
    }
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (int i = l; i <= r; i++) a[i] = tmp[i];
}
// 调用：mergeSort(a, 0, n - 1);
```

考试没要求手写时直接用 `sort()`，不要自找麻烦。

### 6.2.5 矩阵子矩阵处理套路

**二维前缀和**（O(1) 查询任意子矩阵的和）：
```cpp
// 建前缀和（下标从 1 开始）
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        pre[i][j] = mat[i][j] + pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1];

// 查询子矩阵 [r1..r2][c1..c2] 的和（容斥原理）
int sum = pre[r2][c2] - pre[r1-1][c2] - pre[r2][c1-1] + pre[r1-1][c1-1];
```

**压缩行 + 一维处理**（把二维问题变成一维）：
```
思路：
1. 枚举上边界 r1 和下边界 r2
2. 把 r1~r2 行"压扁"成一维数组 col_sum[c] = 第 c 列的列和
3. 对 col_sum 跑一维算法（Kadane / 双指针 / 暴力）

for (int r1 = 0; r1 < n; r1++) {
    memset(col_sum, 0, sizeof(col_sum));
    for (int r2 = r1; r2 < n; r2++) {
        for (int c = 0; c < m; c++) col_sum[c] += mat[r2][c];  // 逐行累加
        // 现在 col_sum 是一维数组，跑一维算法
    }
}
```

**第 3 步用什么一维算法，取决于题目**：

| 题目 | 第 3 步 | 复杂度 |
|------|---------|--------|
| 最大子矩阵和 | Kadane（最大子数组和） | O(n²m) |
| 和 >= K 的最小面积（全非负） | 双指针找最短区间 | O(n²m) |
| 和 >= K 的最小面积（有负数） | 暴力枚举或前缀和 | O(n²m²) |

**双指针找"和 >= K 的最短区间"**（元素全非负时）：
```cpp
int left = 0, sum = 0;
for (int right = 0; right < m; right++) {
    sum += col_sum[right];       // 不够就扩右
    while (sum >= k) {           // 够了就缩左，找更短的
        ans = min(ans, right - left + 1);
        sum -= col_sum[left++];
    }
}
// 注意：有负数时不能用，因为缩左可能让 sum 变大
```

**矩阵旋转与转置**：

```cpp
// 顺时针旋转 90 度：新[i][j] = 旧[n-1-j][i]
void rotate90(int src[N][N], int dst[N][N], int n) {
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            dst[i][j] = src[n-1-j][i];
}

// 逆时针旋转 90 度：新[i][j] = 旧[j][n-1-i]
void rotate90ccw(int src[N][N], int dst[N][N], int n) {
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            dst[i][j] = src[j][n-1-i];
}

// 转置（就地）：只遍历上三角，swap 对角线两侧
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)   // 注意 j 从 i+1 开始
        swap(mat[i][j], mat[j][i]);
```

**旋转 180/270 度**：调用 rotate90 两次/三次即可。

验证顺时针 90 度公式：
```
原矩阵：      旋转后：
1 2 3         7 4 1
4 5 6    →    8 5 2
7 8 9         9 6 3

新[0][0] = 旧[n-1-0][0] = 旧[2][0] = 7 ✓
新[0][1] = 旧[n-1-1][0] = 旧[1][0] = 4 ✓
```

**只旋转局部子矩阵**（以 (x,y) 为左上角，边长 size）：

公式不变，只是每个下标加上偏移量 x 和 y：

```cpp
// 顺时针 90 度旋转子矩阵
for (int i = 0; i < size; i++)
    for (int j = 0; j < size; j++)
        tmp[i][j] = a[x + size-1-j][y + i];

// 逆时针 90 度旋转子矩阵
for (int i = 0; i < size; i++)
    for (int j = 0; j < size; j++)
        tmp[i][j] = a[x + j][y + size-1-i];

// 写回原矩阵
for (int i = 0; i < size; i++)
    for (int j = 0; j < size; j++)
        a[x + i][y + j] = tmp[i][j];
```

**记忆**：整体旋转的公式里，把 `[i][j]` 换成 `[x+i][y+j]`，`[n-1-j][i]` 换成 `[x+size-1-j][y+i]` 就行。

### 6.3 数学相关

```cpp
#include <cmath>

sqrt(9.0);       // 3.0，开平方
pow(2.0, 10.0);  // 1024.0，x 的 y 次方
ceil(2.3);       // 3.0，向上取整
floor(2.9);      // 2.0，向下取整
// 注意：返回值都是 double，需要时强转 (int)ceil(x)

// 最大公约数
__gcd(a, b);  // GCC 内置，头哥可用
// 头哥没有 std::gcd（C++17），也没有 lcm
// 最小公倍数 = a / __gcd(a, b) * b（先除后乘防溢出）
```

**排列数和组合数**：

```
排列 P(n,k) = 从 n 个里选 k 个，有顺序
            = n × (n-1) × ... × (n-k+1)    （连乘 k 个）
            P(5,3) = 5×4×3 = 60

组合 C(n,k) = 从 n 个里选 k 个，没有顺序
            = P(n,k) / k!
            = n×(n-1)×...×(n-k+1) / (k×(k-1)×...×1)
            C(5,3) = 60/6 = 10

区别：排列管顺序（ABC≠ACB），组合不管（ABC=ACB）
```

**代码（一边乘一边除，防溢出）**：
```cpp
long long C(int n, int k) {
    if (k == 0 || k == n) return 1;
    long long result = 1;
    for (int i = 0; i < k; i++) {
        result = result * (n - i) / (i + 1);
    }
    return result;
}

long long P(int n, int k) {
    long long result = 1;
    for (int i = 0; i < k; i++) {
        result *= (n - i);
    }
    return result;
}
```

### 6.4 大数处理（string 版模板）

当数值超过 `long long` 范围（> 9×10^18）且需要真实值比较时使用。

**大数加法**：
```cpp
string bigAdd(const string& a, const string& b) {
    string result;
    int i = a.size() - 1, j = b.size() - 1, carry = 0;
    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += a[i--] - '0';
        if (j >= 0) sum += b[j--] - '0';
        result.push_back('0' + sum % 10);
        carry = sum / 10;
    }
    reverse(result.begin(), result.end());
    return result;
}
```

**大数 × 小整数**：
```cpp
string bigMulSmall(const string& a, int b) {
    string result;
    int carry = 0;
    for (int i = a.size() - 1; i >= 0; i--) {
        int prod = (a[i] - '0') * b + carry;
        result.push_back('0' + prod % 10);
        carry = prod / 10;
    }
    while (carry) {
        result.push_back('0' + carry % 10);
        carry /= 10;
    }
    while (result.size() > 1 && result.back() == '0') result.pop_back();
    reverse(result.begin(), result.end());
    return result;
}
```

**大数减法**（保证 a >= b）：
```cpp
string subAbs(const string& a, const string& b) {
    string r;
    int i = a.size()-1, j = b.size()-1, borrow = 0;
    while (i >= 0) {
        int d = (a[i--]-'0') - borrow;
        if (j >= 0) d -= (b[j--]-'0');
        if (d < 0) { d += 10; borrow = 1; } else borrow = 0;
        r.push_back('0'+d);
    }
    while (r.size() > 1 && r.back() == '0') r.pop_back();
    reverse(r.begin(), r.end());
    return r;
}
```

**大数 × 大数**（竖式乘法）：
```cpp
string mulAbs(const string& a, const string& b) {
    int n = a.size(), m = b.size();
    vector<int> res(n+m, 0);
    for (int i = n-1; i >= 0; i--)
        for (int j = m-1; j >= 0; j--) {
            int sum = (a[i]-'0')*(b[j]-'0') + res[i+j+1];
            res[i+j+1] = sum % 10;
            res[i+j] += sum / 10;  // 注意 += 不是 =
        }
    string r;
    for (int x : res) if (!(r.empty() && x == 0)) r.push_back('0'+x);
    return r.empty() ? "0" : r;
}
```

**带符号大数运算**（加减乘都支持负数）：
```cpp
struct Big { bool neg; string val; };

Big parse(const string& s) {
    if (s[0] == '-') return {true, s.substr(1)};
    return {false, s};
}
string str(Big x) {
    if (x.val == "0") return "0";
    return x.neg ? "-"+x.val : x.val;
}
bool geq(const string& a, const string& b) {  // |a| >= |b| ?
    if (a.size() != b.size()) return a.size() > b.size();
    return a >= b;
}
Big add(Big a, Big b) {
    if (a.neg == b.neg) return {a.neg, bigAdd(a.val, b.val)};  // 同号：加绝对值
    if (geq(a.val, b.val)) return {a.neg, subAbs(a.val, b.val)};  // 异号：大减小
    return {b.neg, subAbs(b.val, a.val)};
}
Big sub(Big a, Big b) { b.neg = !b.neg; return add(a, b); }  // a-b = a+(-b)
Big mul(Big a, Big b) {
    string p = mulAbs(a.val, b.val);
    if (p == "0") return {false, "0"};
    return {a.neg != b.neg, p};  // 异号为负
}
```

**大数比较**：
```cpp
// 直接用作 sort 的 cmp（前提：无前导零）
bool bigCmp(const string& a, const string& b) {
    if (a.size() != b.size()) return a.size() < b.size();  // 短的小
    return a < b;  // 长度相同，字典序 = 数值序
}
// 用法：sort(v.begin(), v.end(), bigCmp);  升序
```

**快速幂（取模）**：
```cpp
long long qpow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}
```

### 6.5 大数运算汇总

大数运算 = 模拟手算。记住方向：**加法乘法从右往左（进位往左传），除法取模从左往右（余数往右传）**。

**大数字符串 mod 小整数**（最常用——费马降幂、判整除）：
```cpp
// 就是你从左到右读数字的过程，每读一位顺手取一次模
//   读 "1234"：  1  →  12  →  123  →  1234
//   每一步都是：老的往左挪一位(×10)，新的填个位(+d)
//
// 为什么可以每步取模：余数只关心「除不尽剩多少」，
//   中间的商全都扔掉不影响最终余数
// 为什么必须每步取模：字符串可能 10 万位，不取模什么类型都装不下
//
long long bigMod(const string& s, long long m) {
    long long result = 0;
    for (char c : s) {
        result = (result * 10 + (c - '0')) % m;
        //        └挪一位┘  └填个位┘
    }
    return result;
}

// 验算 "1234" % 7（答案 2，因为 1234 = 7×176 + 2）：
//   '1'：(0×10+1) % 7 = 1
//   '2'：(1×10+2) % 7 = 12 % 7 = 5
//   '3'：(5×10+3) % 7 = 53 % 7 = 4
//   '4'：(4×10+4) % 7 = 44 % 7 = 2  ✓
//
// 注意：取模是【从左往右】，跟大数加法【从右往左】相反
//       因为取模没有进位，不需要 reverse
```

**大数字符串 ÷ 小整数**（用于进制转换、大数快速幂）：
```cpp
// 从左到右，余数带到下一位
string divSmall(const string& s, int n, int& remainder) {
    string result;
    int carry = 0;
    for (char c : s) {
        int cur = carry * 10 + (c - '0');
        result.push_back('0' + cur / n);
        carry = cur % n;
    }
    remainder = carry;
    // 去前导零
    int start = 0;
    while (start + 1 < (int)result.size() && result[start] == '0') start++;
    return result.substr(start);
}
```

**大数快速幂**（指数是字符串，mod p 不是质数时用）：
```cpp
bool isZero(const string& s) { return s == "0"; }
bool isOdd(const string& s) { return (s.back() - '0') % 2 == 1; }

string divBy2(const string& s) {
    string result;
    int carry = 0;
    for (char c : s) {
        int cur = carry * 10 + (c - '0');
        result.push_back('0' + cur / 2);
        carry = cur % 2;
    }
    int start = 0;
    while (start + 1 < (int)result.size() && result[start] == '0') start++;
    return result.substr(start);
}

long long qpowBig(long long base, string exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (!isZero(exp)) {
        if (isOdd(exp)) result = result * base % mod;
        base = base * base % mod;
        exp = divBy2(exp);
    }
    return result;
}
```

**十进制大数快速幂**（推荐，最好写，不需要费马也不需要 divBy2）：
```cpp
// 要算 base^exp，但 exp 是 10 万位的字符串，塞不进 qpow 的参数
//
// 核心：result 里装的不是指数，是【base 的「已读部分」次方】
//       读 "123" 的过程：  base^1  →  base^12  →  base^123
//                          读完1     读完12      读完123
//
// 读一位新数字 d 时，指数从 n 变成 n*10+d，对应到 result：
//       base^n  →  base^(n*10)     就是 result 做 10 次方
//               →  base^(n*10+d)   再乘上 base^d
//
long long qpowDecimal(long long base, const string& exp, long long mod) {
    long long result = 1;              // base^0 = 1，还没读任何数字
    base %= mod;
    for (char c : exp) {
        int d = c - '0';
        result = qpow(result, 10, mod);                 // result: base^n → base^(n*10)
        result = result * qpow(base, d, mod) % mod;     // result: → base^(n*10+d)
    }
    return result;
}

// 验算 2^12（exp="12"，答案 4096）：
//   读 '1'：result = 1^10 × 2^1 = 2      → 此刻 result = 2^1  ✓
//   读 '2'：result = 2^10 × 2^2 = 4096   → 此刻 result = 2^12 ✓
//
// 跟 bigMod 是同一个骨架：
//   bigMod       result = result × 10 + d       算的是「n 是多少」
//   qpowDecimal  result = result ^10 × base^d   算的是「base^n 是多少」
//   「挪一位」在值上是 ×10，在幂上是 ^10
//   「加新位」在值上是 +d， 在幂上是 ×base^d
```

**费马降幂**（指数是字符串，mod p 是质数时用——更快）：
```cpp
// 当 p 是质数时：a^n mod p = a^(n mod (p-1)) mod p
// 用 bigMod 把大数指数变成 long long，再用普通 qpow
long long exp = bigMod(n, MOD - 1);
long long ans = qpow(2, exp, MOD);
```

**什么时候用哪个**：

| 情况 | 方法 |
|------|------|
| 指数是 long long | 普通 qpow |
| 指数是大数字符串 | 十进制大数快速幂（最通用，推荐） |
| 指数是大数 + mod 是质数 | 费马降幂（最快，但要记公式） |
| 指数是大数（二进制版，不推荐） | qpowBig（需要 divBy2，慢且复杂） |
| 需要大数除法的商 | divSmall |
| 只需要大数除法的余数 | bigMod |

### 6.6 递归下降解析（字符串解析万能法）

遇到"解析复杂字符串"的题（算术表达式、嵌套括号、方程式...），用递归下降。

**核心思路**：看着输入样例，反复问"这个东西由什么组成"，写出文法，每条规则一个函数。

**怎么定义文法**（三步循环）：
1. 这一层由什么组成？→ 写下来
2. 组成部分还能拆吗？→ 能就继续问
3. 拆不动了（数字/单个字符）？→ 结束

**优先级规则**：优先级低的在外面，优先级高的在里面。外面的函数最后算，里面的先算。

**三个经典文法**：

算术表达式（`1+2*3`、`(1+(2*3))`）：
```
expr   = term   (('+' | '-') term)*      ← 优先级最低，最后算
term   = factor (('*' | '/') factor)*    ← 优先级中，先于加减
factor = '(' expr ')' | 数字              ← 优先级最高，遇括号递归回 expr
```

字符串解码（`3[a2[bc]]`）：
```
decode = item*
item   = 数字 '[' decode ']' | 字母       ← [] 里面又是 decode，递归
```

嵌套数组求和（`[1,[2,3],[4,[5,6]]]`）：
```
array   = '[' element (',' element)* ']'
element = 数字 | array                    ← 元素可能又是数组，递归
```

**代码模板**（算术表达式为例）：
```cpp
string s;
int pos;

// ⚠️ 必须先前向声明！因为 parseFactor 要调用 parseExpr，
// 但 parseExpr 定义在后面，不声明会报 'parseExpr' was not declared
int parseExpr();
int parseTerm();
int parseFactor();

int parseNumber() {
    int num = 0;
    while (pos < (int)s.size() && s[pos] >= '0' && s[pos] <= '9')
        num = num * 10 + (s[pos++] - '0');
    return num;
}

int parseFactor() {
    if (s[pos] == '(') {
        pos++;                    // 跳过 '('
        int val = parseExpr();    // 递归回最外层
        pos++;                    // 跳过 ')'
        return val;
    }
    return parseNumber();
}

int parseTerm() {
    int val = parseFactor();
    while (pos < (int)s.size() && (s[pos] == '*' || s[pos] == '/')) {
        char op = s[pos++];
        int right = parseFactor();
        if (op == '*') val *= right;
        else val /= right;
    }
    return val;
}

int parseExpr() {
    int val = parseTerm();
    while (pos < (int)s.size() && (s[pos] == '+' || s[pos] == '-')) {
        char op = s[pos++];
        int right = parseTerm();
        if (op == '+') val += right;
        else val -= right;
    }
    return val;
}
```

**记忆**：三层函数互相调用——expr 调 term，term 调 factor，factor 遇到 `(` 调回 expr。每层只处理自己那个优先级的运算符。

**互相调用的函数必须前向声明**（递归下降的必踩坑）：

```cpp
// ❌ 报错：'parseExpr' was not declared in this scope
int parseFactor() {
    ... parseExpr() ...   // parseExpr 还没定义
}
int parseExpr() { ... parseFactor() ... }

// ✅ 开头先声明一遍，下面定义顺序随便
int parseExpr();
int parseTerm();
int parseFactor();
```

原因：C++ 编译器从上往下扫，调用时函数必须"已经出现过"。前向声明 = 提前告诉编译器签名，函数体后面再补。

**例外**：写在 `class` 里的成员函数不受顺序限制（编译器会先扫完整个类）。所以 LeetCode 那种 `class Solution` 里互相调用不用声明，但机试写全局函数就必须声明。

### 6.6.1 递归下降四大必踩坑

写完对着这四条检查，全中过。

**坑 1：`pos` 传值 → 位置推进全丢（最致命，结果全错但不报错）**

```cpp
// ❌ 参数 pos 遮蔽了全局 pos，函数内推进的是副本
int pos = 0;
int parseExpr(int pos) {
    int val = parseTerm(pos);   // parseTerm 内部把 pos 推进了，但返回后调用方的 pos 没变
    ...
}

// ✅ 用全局 pos，函数不带参数
int pos;
int parseExpr() {
    int val = parseTerm();
    ...
}
// 或者传引用：int parseExpr(int& pos)
```

**坑 2：while 条件只判 `pos < l`，没检查"当前字符是不是我这层管的"**

```cpp
// ❌ 遇到不归自己管的字符也进循环，会把别人的字符吃掉
while (pos < l) {
    char op = s[pos]; pos++;
    int right = parseTerm();
    if (op == '+') ...        // op 是 '>' 时什么都不做，但 pos 已经被推进了
}

// ✅ 每层只在"当前字符是自己的运算符"时继续
while (pos < l && (s[pos] == '+' || s[pos] == '-')) {
    char op = s[pos]; pos++;
    ...
}
```

这个条件还**顺带解决了括号**——遇到 `)` 时所有中间层都会退出，把 `)` 留给 factor 层去跳过。

**坑 3：中间层也去处理括号**

```cpp
// ❌ term 层不该碰括号
int parseTerm() {
    if (s[pos] == '(') { pos++; int r = parseTerm(); pos++; return r; }  // 错，还跳过了优先级更低的层
    ...
}

// ✅ 括号只在 factor（最底层）处理，且递归回 expr（最外层）
int parseFactor() {
    if (s[pos] == '(') {
        pos++;                  // 跳过 '('
        int r = parseExpr();    // 递归回最外层，重走完整优先级
        pos++;                  // 跳过 ')'
        return r;
    }
    return parseNumber();
}
```

**为什么中间层不用管括号**：factor 会把括号处理干净，返回一个纯数字给上层。term 只管"调 factor 拿操作数，看有没有 `*` `/`"。

**坑 4：循环开头多了个 `pos++`**

```cpp
// ❌ parseTerm() 返回时 pos 已经指向运算符了，不需要先跳
while (...) {
    pos++;                // 多余，跳掉了运算符本身
    char op = s[pos];
```

**多字符运算符**（如 `<<` `>>`）要跳两格：
```cpp
char op = s[pos];
pos += 2;                 // 跳过 "<<" 或 ">>"
```

---

**检查清单**（写完 30 秒过一遍）：
1. `pos` 是全局的吗？函数签名里没有 `int pos` 吧？
2. 每个 while 条件都有 `&& (s[pos] == 我这层的运算符)` 吗？
3. 括号只在最底层出现，且调的是最外层函数吗？
4. 循环里第一句是 `char op = s[pos]` 而不是 `pos++` 吗？
5. 所有函数都前向声明了吗？

---

## 7. 平台兼容性

### 7.1 头哥 educoder（C++14）

头哥的 `__cplusplus == 201402`，C++17 特性全部不能用。

**不能用的特性 + 替代方案**：

| C++17 特性 | 替代 |
|-----------|------|
| `auto [k, v] = pair;`（结构化绑定）| `auto p = pair; p.first; p.second;` |
| `std::gcd(a, b)` | `__gcd(a, b)` |
| `std::lcm(a, b)` | `a / __gcd(a, b) * b` |
| `string_view` | 直接用 `const string&` |
| `std::boyer_moore_searcher` | `s.find(pattern)` |
| `if constexpr` | 普通 `if`（机试不需要）|
| `std::optional` | 用 `-1` 或特殊值表示无效 |
| `inline 变量` | 用 `const` 或 `static` |

**头哥可以用的（C++11/14）**：
- `auto`、range-for（`for (int x : v)`）
- lambda
- `unordered_map`、`unordered_set`
- `to_string()`、`stoi()`、`stoll()`
- `{}`初始化（`pair<int,int> p = {1, 2}`、`v.push_back({1, 2})`）
- `#include <bits/stdc++.h>`

### 7.2 DEV C++ / CodeBlocks

**设置 C++ 标准**：

- **DEV C++**：工具 → 编译选项 → 勾选"编译时加入以下命令" → 加 `-std=c++14`（或 `-std=c++17`）
- **CodeBlocks**：Settings → Compiler → Compiler Flags → 勾选对应 C++ 标准

**常见编译错误**：

| 错误 | 原因 | 修复 |
|------|------|------|
| `'stoi' was not declared` | 没开 C++11 | 加 `-std=c++11` 以上 |
| `'to_string' was not declared` | 同上 | 同上 |
| `'auto' changes meaning in C++11` | 没开 C++11 | 同上 |
| `'bits/stdc++.h' not found` | MSVC 不支持 | 换 MinGW 编译器，或手动写头文件 |
| `'unordered_map' is not a member of 'std'` | 没开 C++11 | 加 `-std=c++11` |

**调试技巧**：

```cpp
// 用 cerr 输出调试信息（不影响 stdout 判题）
cerr << "x=" << x << " y=" << y << endl;

// 头哥提交时不需要删 cerr，它不影响评判
// 但大量 cerr 会拖慢运行速度，最终提交前注释掉为好
```

**DEV C++ 的坑**：
- 默认编译器版本可能很旧，务必检查是否开了 C++11/14
- 编译错误信息有时不准确，看第一个错误就好，后面的可能是连锁反应
- 调试时可以用 `system("pause");` 让控制台不立即关闭（提交到 OJ 时删掉）

---

## 附：STL 容器对比

### 取元素方式对比（最容易混的）

| 容器 | 取顶/头 | 删除 | 注意 |
|------|---------|------|------|
| `queue` | `q.front()` | `q.pop()` | front 取，pop 删，两步 |
| `stack` | `st.top()` | `st.pop()` | top 取，pop 删，两步 |
| `priority_queue` | `pq.top()` | `pq.pop()` | top 取，pop 删，两步 |
| `vector` | `v[i]` / `v.back()` | `v.pop_back()` / `v.erase(...)` | 随机访问 |

**共同点**：`pop()` 都**不返回值**，必须先取再删。

### 插入方式对比

| 容器 | 插入 | 说明 |
|------|------|------|
| `vector` | `v.push_back(x)` | 只能尾部加 |
| `queue` | `q.push(x)` | 队尾入 |
| `stack` | `st.push(x)` | 栈顶入 |
| `priority_queue` | `pq.push(x)` | 自动调整位置 |
| `unordered_map` | `m[key] = val` | 直接赋值 |
| `unordered_set` | `s.insert(x)` | insert |
| `string` | `s.push_back(c)` / `s += "xx"` | 两种都行 |

### 判空 & 大小（所有容器一样）

```cpp
x.empty()   // 是否为空
x.size()    // 元素个数
x.clear()   // 清空（queue/stack/pq 没有 clear，要循环 pop）
```

**注意**：`queue`、`stack`、`priority_queue` 没有 `clear()`。要清空只能：
```cpp
while (!q.empty()) q.pop();
// 或者直接重新声明一个
q = queue<int>();
```

### 能不能用下标 `[]` 访问？

| 容器 | `[]` 访问 | 说明 |
|------|-----------|------|
| `vector` | ✅ | `v[i]` |
| `string` | ✅ | `s[i]` |
| `unordered_map` | ✅ | `m[key]`（但会自动创建！） |
| `queue` | ❌ | 只能 `front()` / `back()` |
| `stack` | ❌ | 只能 `top()` |
| `priority_queue` | ❌ | 只能 `top()` |
| `unordered_set` | ❌ | 只能 `count()` / `find()` |

### 有序 vs 无序

| | 有序（自动排序） | 无序（哈希，O(1)） |
|--|----------------|-------------------|
| 集合 | `set` | `unordered_set` |
| 映射 | `map` | `unordered_map` |
| 什么时候用有序 | 需要按顺序遍历、需要 `lower_bound` | |
| 什么时候用无序 | 只需要查找/计数，不关心顺序（更快） | |

### 一句话记忆

- **queue**：排队，先进先出，`front` 取
- **stack**：叠盘子，后进先出，`top` 取
- **priority_queue**：VIP 队列，最大/最小的先出，`top` 取
- **vector**：数组 plus，随便访问，尾部增删
- **unordered_map**：查字典，`[]` 取值但小心自动创建
- **unordered_set**：签到表，只管在不在

---

## 附：高频手滑错误清单

写完代码后花 1 分钟，对着这个表逐条检查：

| 错误 | ❌ 错的写法 | ✅ 对的写法 |
|------|-----------|-----------|
| getline 参数顺序 | `cin(getline, s)` | `getline(cin, s)` |
| 从错误的流读 | `while(cin >> word)` | `while(iss >> word)` |
| 求最小值初始化 | `int minVal = 0;` | `int minVal = INT_MAX;` |
| 求最大值初始化 | `int maxVal = INT_MAX;` | `int maxVal = INT_MIN;`（或 0，看数据）|
| `cin >>` 后接 getline | 直接 getline（读到空行） | 中间加 `cin.ignore()` |
| size() 跟 int 比较 | `if (s.size() > n)` | `if ((int)s.size() > n)` |
| 变量名混用 | 用 b 时写了 `a[i]` | 检查每个下标对应哪个数组 |
| 循环体漏操作 | 忘了 `i--` / `push_back` / `return` | 逐行确认 |
| 累加写成覆盖 | `res[i] = x;` | `res[i] += x;` |
| 赋值 vs 比较 | `if (a = 0)` | `if (a == 0)` |
| 变量名相同 | 函数名和数组名都叫 `dp` | 起不同的名字 |
| 多组数据没清空 | 上一组的数据残留 | 每组开头 memset / clear |

**检查顺序**（30 秒够了）：
1. 变量名——每个下标对应的数组对吗？
2. 初始化——求 min 用 INT_MAX 了吗？多组数据清空了吗？
3. 循环体——`i--`、`push_back`、`return` 都写了吗？
4. 边界——下标会越界吗？`size()` 强转了吗？

---

## 附：速查索引

| 我要... | 看哪里 |
|---------|--------|
| 声明数组/变量 | 1.2 |
| 定义 struct | 1.3 |
| 读入有空格的行 | 5.1-5.3 |
| 用 vector | 3.1 |
| 用哈希表计数 | 3.6 |
| BFS 用 queue | 3.3 |
| Dijkstra 用堆 | 3.5 |
| 链表操作 | 3.9 |
| 自定义排序 | 4.1-4.3 |
| pq 小顶堆怎么写 | 3.5, 4.4 |
| 容器语法对比 | 附：STL 容器对比 |
| 头哥不能用什么 | 7.1 |
| DEV C++ 编译报错 | 7.2 |
| 数据类型选什么 | 1.1 |
| memset 初始化 | 6.1 |
| 大数模板 | 6.4 |
| 区间 DP 模板 | 板子 3.11 |
| 矩阵旋转/转置 | 6.2.5 |
| 递归下降解析表达式 | 6.6（坑见 6.6.1）|
---


---

# 算法选择指南：拿到题怎么想

> 核心问题不是"我会什么算法"，而是"这道题的结构是什么"。
> 结构决定算法，不是反过来。

---

## 1. 拿到题先问 4 个问题

拿到任何一道题，按顺序问自己：

```
Q1: 输入是不是「一个数组 / 一个字符串」？
    （没有节点边、没有网格，就是一列数或一串字符）
    ├── 是 → 去第 2 节（序列题）        ← 机试第一题最常见
    └── 不是 ↓

Q2: 有没有「图」的结构？
    （节点+边、网格、关系、连通、路径、状态转移...）
    ├── 有 → 去第 3 节（图论）
    └── 没有 ↓

Q3: 是不是求「最优值」？（最大/最小/最长/最短/最少/方案数）
    ├── 是，且能拆成子问题 → 去第 4 节（DP）
    ├── 是，且每步选当前最好就行 → 去第 5 节（贪心）
    └── 不是 ↓

Q4: 是不是「搜索所有方案」或「构造一个满足条件的东西」？
    ├── 是 → 去第 6 节（搜索/回溯）
    └── 不是 → 去第 7 节（数学/模拟/数据结构）
```

**判断优先级**：
**有图结构就按图论走**（"最短路径"既是图论又是求最优，图论特征更明显）；
**输入是单个数组/字符串就先看第 2 节**（那里的方法比通用 DP 更直接）。

---

## 2. 序列题：一个数组 / 一个字符串

> 机试第一题最常出这类。核心只有一刀。

### 2.1 第一刀：连续 还是 不连续

先把概念钉死：

| 英文 | 中文 | 连续吗 | 原串 `abcde` 的例子 |
|------|------|--------|-------------------|
| substring / subarray | 子串 / 子数组 | **连续** | `bcd` ✓ ，`bce` ✗ |
| subsequence | 子序列 | **可以跳** | `bce` ✓ ，`ace` ✓（顺序不能乱）|

```
问「连续的一段」（子串 / 子数组 / 区间 / 窗口）
    → 前缀和 / 双指针 / 单调栈 / Kadane        见 2.2

问「可以跳着选」（子序列 / 选或不选）
    → 基本都是 DP                              见 2.3
```

**最容易混的一对**：

| | 连续吗 | 不匹配时怎么转移 |
|---|--------|----------------|
| 最长公共**子串** | 连续 | `dp[i][j] = 0`（断了就归零）|
| 最长公共**子序列**（LCS）| 可跳 | `dp[i][j] = max(dp[i-1][j], dp[i][j-1])` |

**只差一行，意思完全不同。**

### 2.2 连续区间类

| 方法 | 一句话原理 | 什么时候用 |
|------|-----------|-----------|
| **前缀和** | 先把「从头累加到 i」全算好存起来，任意区间和 = 两个前缀和**相减** | 反复查询「区间和」<br/>和为 K 的子数组、二维子矩阵和 |
| **差分数组** | 只在区间**头尾**打标记，所有操作做完后做一次前缀和还原 | 反复「区间加值」，最后统一查询<br/>区间修改、会议室重叠 |
| **双指针 / 滑动窗口** | 右指针不断扩大窗口，一旦满足条件就收缩左指针，**一趟扫完** | 找最长/最短满足条件的连续段<br/>和≥K的最短子数组、无重复最长子串 |
| **Kadane** | 从左往右累加，**累加和一旦变负就丢掉重开** | 最大子数组和<br/>最大连续子序列和（+ 记首尾）|
| **单调栈** | 栈里维持单调，新元素把破坏单调性的栈顶弹出，**弹出那一刻就是它的答案** | 「下一个更大/更小的元素在哪」<br/>接雨水、柱状图最大矩形、每日温度 |
| **单调队列** | 队列维持单调，队头就是最值；**过期的从队头删，比新元素小的从队尾删** | 滑动窗口内的最值<br/>窗口最大值 |
| **KMP** | 匹配失败时**不回退文本指针**，靠 next 数组决定模式串跳到哪 | 在长文本里找子串<br/>字符串匹配、统计出现次数 |

**双指针 vs 单调栈怎么分**：

```
问「一段区间」满不满足条件      → 双指针（窗口扩右缩左）
问「某个元素」左右第一个更大的  → 单调栈（栈里存下标，弹出时结算）
```

### 2.3 不连续 / 选或不选类（全是 DP）

| 方法 | 全称 | 一句话原理 |
|------|------|-----------|
| **LIS** | **最长递增子序列**<br/>Longest Increasing Subsequence | 对每个位置，看它**前面所有比它小的数**，接在最长的那个后面 |
| **LIS 计数** | — | 同上，额外记「有几条能达到这个长度」：更优就重置，等优就累加 |
| **LCS** | **最长公共子序列**<br/>Longest Common Subsequence | 两串逐字符比：相同就 +1；不同就从「去掉 a 末尾」和「去掉 b 末尾」里**取大的** |
| **最长公共子串** | Longest Common Substring | 同 LCS，但不同时**直接归零**（因为必须连续，断了就重新开始） |
| **编辑距离** | Edit Distance | 相同就跳过；不同就在「改 / 删 / 加」三种操作里**选最省的** |
| **背包** | Knapsack | 对每个物品，比较「不选」和「选了 + 剩余容量的最优解」 |

| 方法 | 状态定义 | 答案在哪 |
|------|---------|---------|
| LIS | `dp[i]` = 以 i **结尾**的最长长度 | 全表扫 max（最长的可能结尾在任何位置）|
| LCS | `dp[i][j]` = a 前 i 个、b 前 j 个的 LCS 长度 | `dp[n][m]` |
| 最长公共子串 | `dp[i][j]` = 以 a[i]、b[j] **结尾**的公共长度 | 全表扫 max |
| 编辑距离 | `dp[i][j]` = a 前 i 个改成 b 前 j 个的最少步数 | `dp[n][m]` |
| 背包 | `dp[j]` = 容量 j 时的最优值 | `dp[W]` |

> **凡是状态定义里有「以 i 结尾」的，答案都要全表扫一遍**，不能只看最后一格。

**「求最优解的方案数」通用套路**：在原 DP 旁边**并行**加一个计数数组，
转移时「**更优就重置，等优就累加**」。不只 LIS——最短路条数、最大子段和的取法数，都是这个。

### 2.4 通用工具

| 方法 | 一句话原理 | 什么时候用 |
|------|-----------|-----------|
| **二分查找** | 每次砍掉一半，看中间值决定往左还是往右 | 有序数组找位置 / `lower_bound` `upper_bound` |
| **二分答案** | **对答案本身二分**，写个 `check(x)` 判断 x 可不可行 | 「最大值最小化」「最小值最大化」|
| **排序 + 贪心** | 先按某个维度排好序，再从头到尾每次选当前最优 | 区间调度、按某维排完依次处理 |
| **哈希表计数** | 用 `map` 或数组记每个值出现几次，O(1) 查 | 出现次数、去重、两数之和 |

**二分答案的判据**：答案有单调性（x 可行 ⟹ x+1 也可行），且**验证一个答案比直接求答案容易**。

### 2.5 一页速查

| 题面怎么说 | 用什么 |
|-----------|--------|
| 「区间和」被反复查询 | 前缀和 |
| 「区间加值」被反复执行 | 差分数组 |
| 「最长/最短的**连续**子数组，满足 X」 | 双指针（元素非负时）|
| 「最大**连续**子数组和」 | Kadane |
| 「下一个比它大的元素」「能接多少水」 | 单调栈 |
| 「滑动窗口的最大值」 | 单调队列 |
| 「在文本里找模式串出现几次」 | KMP |
| 「最长**递增**子序列」（可跳）| LIS |
| 「两个串的最长公共**子序列**」 | LCS |
| 「两个串的最长公共**子串**」 | LCS 变体，不匹配归零 |
| 「把 A 改成 B 最少几步」 | 编辑距离 |
| 「选一些数，和不超过 W，价值最大」 | 01 背包 |
| 「最大值最小化 / 最小值最大化」 | 二分答案 |

---

## 3. 图论：看到"节点+边"就进这里

> 完整版见 `图论总纲.md`（含 SPFA、Bellman-Ford、0-1 BFS、Prim 等）

### 3.1 先判断是不是图论题

看到这些词就是：节点/边/路径/连通/网络/城市和道路、**网格**（格子是节点、上下左右是边）、依赖关系/先修课、状态转移（每步有限选择）。

| 题面信号 | 图的类型 |
|---------|----------|
| "A 和 B 相连"、"双向路" | 无向图 |
| "A 指向 B"、"单向路"、"先修课" | 有向图 |
| "网格"、"矩阵"、"地图" | 网格图（隐式图，不用建图）|
| "边有权重/距离/花费" | 带权图 |

### 3.2 问的是什么类型的问题

```
├── 最短距离 / 最少步数 / 最小代价     → 最短路（见 2.3）
├── 连通所有点的最小代价               → 最小生成树（Kruskal）
├── 是否连通 / 几个连通块 / 有没有环   → 并查集
├── 排出合法顺序（有依赖）             → 拓扑排序
├── 最早/最晚完成时间                  → 关键路径（拓扑 + DP）
├── 数岛屿 / 填充区域 / 遍历           → DFS / BFS（flood fill）
└── 删掉哪个点会断开                   → 割点（Tarjan，或枚举删点跑 DFS）
```

### 3.3 最短路：两步定算法

**第 1 问：单源还是全源？**

```
"从 X 到其他所有点" / "从 X 到 Y"   → 单源  → 往下走
"任意两点之间" / "所有点对"          → 全源  → Floyd（n≤500）
```

> 这一步最容易漏。看到"某点到其他点"就该立刻排除 Floyd。

**第 2 问：边权长什么样？**

| 边权 | 算法 | 复杂度 | 容器 |
|------|------|--------|------|
| **全相等**（都是 1）| BFS | O(V+E) | `queue` |
| 只有 0 和 1 | 0-1 BFS | O(V+E) | `deque`（不熟就用 Dijkstra）|
| **任意非负** | **Dijkstra** | O(E log V) | `priority_queue` |
| **有负权** | **SPFA** | O(VE) | `queue` + `inQueue` 标记 |
| 限制"最多经过 k 条边" | Bellman-Ford | O(kE) | 无，松弛 k 轮 |

**不确定就用 Dijkstra**——非负权万能，多个 log 而已。

**为什么 Dijkstra 不能有负权**：它假设「取出的最小距离点已定型」。负权会打破这个——

```
1 --5--> 2      Dijkstra 先定型 2（dist=5）
1 --2--> 3      但 1→3→2 = 2+(-4) = -2 更小
3 --(-4)--> 2   2 已标记 vis，改不了了 → 答案错
```

**给所有边加常数变正数？不行。** 一条 k 条边的路径被加了 k×C，边数多的被罚得狠，最短路径本身会变。

### 3.4 加状态维度（高频变体）

**信号**：同一个位置，「到达时的状态不同」会导致「后续走法/代价不同」。

```
dist[x]  →  dist[x][state]
```

| 题目条件 | 加什么 | 第二维大小 |
|---------|--------|-----------|
| 可以消除 k 个障碍 / 有 k 张券 | `used` | k+1 |
| 代价随状态循环变化 | `state` | 状态数 |
| 拿到钥匙才能开门 | `hasKey` | 2 |
| 最多转 k 次弯 | `turns` | k+1 |

**改造只有 5 处，框架一个字不动**：

```
① dist[N]  →  dist[N][K]
② vis[N]   →  vis[N][K]
③ 队列节点加一个字段
④ 转移时算出 newState，用 dist[v][newState] 比较和更新
⑤ 答案 = min(dist[终点][0..K])
```

**没有回溯**——`dist[u][0]` 和 `dist[u][1]` 是两个独立格子，互不污染，不需要撤销。
约束靠「转移只能 `used → used+1`，不能倒回去」保证。

### 3.5 每个算法一句话

| 算法 | 干什么 | 核心 |
|------|--------|------|
| **并查集** | 判连通、检测环、数连通块 | `find` 找根（路径压缩），`unite` 合并 |
| **BFS** | 边权全相等的最短路 | `queue`，**判重 → 赋值 → 入队** |
| **Dijkstra** | 非负权最短路 | 小顶堆，出队 `vis` 判重，取出即定型 |
| **SPFA** | 有负权的最短路 | 普通队列，`inQueue` 标记，**可重复入队** |
| **Floyd** | 所有点对最短路 | 三层循环，**k 必须最外层** |
| **Kruskal** | 最小生成树 | 边排序 + 并查集，凑够 n-1 条 |
| **拓扑排序** | 有向无环图排顺序 | 入度为 0 入队，排出的点数 < n 就是有环 |
| **DFS** | 遍历、回溯、flood fill | 递归，走过就标记 |

### 3.6 判环的三种情况

| 图的类型 | 方法 |
|---------|------|
| 无向图 | 并查集：加边前两端已在同一集合 → 有环 |
| 有向图 | 拓扑排序：排出的点数 < n → 有环 |
| 带权图判负环 | SPFA：某点入队 ≥ n 次 → 有负环 |

### 3.7 一页总表

| 我要干什么 | 用什么 | 关键点 |
|-----------|--------|--------|
| 单源最短路，边权全 1 | BFS | 判重→赋值→入队 |
| 单源最短路，边权非负 | Dijkstra | `vis` 判重，`greater` 是小顶堆 |
| 单源最短路，有负权 | SPFA | `inQueue`，可重复入队 |
| 限制"最多 k 条边" | Bellman-Ford | 松弛 k 轮 |
| 全源最短路 | Floyd | k 最外层 |
| 判负环 | SPFA / Floyd | 入队≥n次 / `dist[i][i]<0` |
| 最小生成树 | Kruskal | 排边+并查集，凑 n-1 条 |
| 判连通 / 数连通块 | 并查集 | `init` 别忘 |
| 依赖顺序 | 拓扑排序 | 入度 0 入队 |
| 最早完成时间 | 拓扑 + DP | `e[v]=max(e[v], e[u]+w)` |
| 网格数岛屿 | DFS/BFS | flood fill，走过就改掉 |
| 带特殊能力的最短路 | 上面任一 + 状态维度 | `dist` 多一维 |

---

## 4. DP：看到"最优"且有"重叠子问题"

### 4.1 怎么判断是 DP 题

满足以下**全部**条件：

1. **求最优值**（最大/最小/最长/方案数）— 这决定了你需要"在很多种方案里挑最好的"。如果只是模拟或输出所有方案，不是 DP 的活。

2. **最优子结构** — 大问题的最优解可以由小问题的最优解拼出来。比如 01 背包：前 5 个物品容量 10 的最优解，一定是从"前 4 个物品"的某个最优解推出来的（第 5 个选或不选）。如果大问题的最优解跟小问题没关系，DP 不适用。

3. **子问题重叠** — 这是 DP 比暴力快的原因。比如斐波那契 `f(5) = f(4) + f(3)`，`f(4) = f(3) + f(2)`，这里 `f(3)` 被算了两次。DP 用表存起来，算过的不重算。如果子问题都不重叠（每个只算一次），那就是普通分治，不需要 DP。

**三个条件缺一个就不是 DP**：条件 1 告诉你目标是什么，条件 2 告诉你能拆，条件 3 告诉你拆了之后 DP 比暴力快。

### 4.2 DP 四步走

1. **定义状态**：`dp[i]` 或 `dp[i][j]` 代表什么？
2. **写转移方程**：`dp[i]` 怎么从之前的状态算出来？
3. **确定边界**：`dp[0]`、`dp[0][0]` 是什么？
4. **确定遍历顺序**：从小到大？从大到小？

### 4.3 常见 DP 类型速查

| 题面信号 | DP 类型 | 状态定义 | 转移方程 |
|---------|---------|---------|---------|
| "背包"、"容量限制下最大价值" | 01背包 | `dp[i][j]` = 前 i 个物品、容量 j 的最大价值 | `dp[i][j] = max(dp[i-1][j], dp[i-1][j-w]+v)` |
| 同上但"物品可以用无限次" | 完全背包 | 同上 | `dp[i][j] = max(dp[i-1][j], dp[i][j-w]+v)`（注意是 `dp[i]` 不是 `dp[i-1]`）|
| 同上但"物品有数量限制" | 多重背包 | 同上 | 多一层循环枚举用几个 |
| "最长递增子序列" | LIS | `dp[i]` = 以 i 结尾的最长递增子序列长度 | `dp[i] = max(dp[j]+1)` 其中 `j<i` 且 `a[j]<a[i]` |
| "最长公共子序列" | LCS | `dp[i][j]` = a 前 i 个、b 前 j 个的 LCS 长度 | 相等 `+1`，不等取 `max` |
| "最大子数组和" | Kadane | `dp[i]` = 以 i 结尾的最大子数组和 | `dp[i] = max(dp[i-1]+a[i], a[i])` |
| "三角形/网格走路求最大" | 网格DP | `dp[i][j]` = 到 (i,j) 的最大值 | `dp[i][j] = a[i][j] + max(来的方向)` |
| "爬楼梯"、"走台阶" | 线性DP | `dp[i]` = 到第 i 阶的方案数 | `dp[i] = dp[i-1] + dp[i-2]` |
| "只能操作相邻"、"删掉后左右变邻居" | 区间DP | `dp[i][j]` = 处理完区间 [i,j] 的最优值 | 枚举 k：`dp[i][k-1] + dp[k+1][j] + 代价`，**短区间先算**（板子见 3.11）|

**背包问题的本质：从一堆东西里选一部分，满足某个限制，求最优。**

看到"选/不选"的二元决策 + 某种上限/目标 → 背包。

不同的皮，同一个背包：

| 题面 | "物品" | "容量" | "求什么" |
|------|--------|--------|---------|
| 经典背包 | 物品 | 背包重量 | 最大价值 |
| 零钱兑换 | 硬币面值 | 目标金额 | 最少硬币数 |
| 分两组差最小 | 数组元素 | sum/2 | 最接近的和 |
| 能不能凑出某个和 | 数组元素 | 目标和 | 能/不能（bool） |

### 4.4 分治 vs DP vs 贪心

三个都是"把大问题拆成小问题"，区别在**拆完之后怎么选**：

| | 分治 | DP | 贪心 |
|--|------|------|------|
| 子问题重叠吗 | 不重叠 | 重叠 | 不拆子问题 |
| 怎么做决策 | 每个子问题独立解，合并结果 | 记录所有子问题的最优解，综合选 | 每步直接选当前最好的，不回头 |
| 典型例子 | 归并排序：左半排好、右半排好、合并 | 01背包：选不选第 i 个，两种都算，取 max | 活动选择：直接选结束最早的 |

**核心区别**：
- **分治**：子问题互不干扰，各算各的，最后合起来
- **DP**：子问题互相纠缠（重叠），得把每个都记下来才能做最优选择
- **贪心**：根本不需要看所有子问题，当前最好的选了就是对的

#### 贪心和 DP 到底差在哪？

都是"每一步选最好的"，但贪心**只看当前这一步**，DP **要看所有步的组合**。

**贪心能做——活动选择**：有 3 个活动 `[1,3] [2,5] [4,6]`，选结束最早的 `[1,3]`，再选 `[4,6]`，答案 2。每步选"结束最早的"碰巧就是全局最优，不需要回头。

**贪心做不了——01背包**：背包容量 5，物品 A（重 3，值 4）、B（重 3，值 4）、C（重 5，值 6）。贪心按性价比选 A（1.33），剩余容量装不下 C，总价值 4。但最优解是只选 C，价值 6。**当前最优选择把后面的路堵死了**。

所以：
- **贪心**：选了 A 不回头 → 翻车
- **DP**：选 A 和不选 A 两条路都算一遍，比较最终结果 → 一定对

**判断方法**：先想贪心（简单）。能举出"贪心选了当前最好，但最终结果反而差"的反例 → 改 DP。举不出来 → 贪心。

---

## 5. 贪心：每步选当前最好的

### 5.1 怎么判断能用贪心

核心：**当前选了最好的，后面不会因此更惨 → 贪心。当前选了最好的，后面可能因此更惨 → DP。**

判断方法：
1. 找到"决策点"——哪里需要做选择？
2. 想一个贪心策略——每次选什么最好？
3. 验证——这样选会不会让后面更差？举不出反例 → 贪心

**贪心的信号**：

| 信号 | 为什么贪心对 |
|------|-----------|
| "最少切换/操作次数" + 资源可复用 | 每次选最远的，不影响后续选择 |
| "最多不重叠的区间" | 选结束早的，给后面留最多空间 |
| 每次选择相互独立（选了 A 不妨碍后面选 B） | 天然贪心 |

**不能贪心的信号**：

| 信号 | 为什么不行 |
|------|-----------|
| 容量有限 + 选了就占容量（不可复用）| 选了 A 可能放不下 B → DP |
| 选择之间有依赖 | 选了 A 导致后面只能选 C → DP/搜索 |

**关键区分：资源可复用 vs 不可复用**
- 代理服务器：选了一个代理，之后还能再选它 → 贪心
- 01背包：选了一个物品，容量被占了不能再用 → DP

### 5.2 常见贪心模式

| 题面信号 | 贪心策略 |
|---------|---------|
| "最多能参加几个活动/会议"（区间不重叠） | 按结束时间排序，能参加就参加 |
| "分数背包"（物品可以拆开） | 按性价比排序，从高到低装 |
| "最小代价连接"（边权） | Kruskal（贪心选最短边） |
| "最短路径"（非负权） | Dijkstra（贪心选最近点） |
| "用最少的 X 覆盖所有 Y" | 按某个维度排序，贪心匹配 |

---

## 6. 搜索/回溯：枚举所有可能

### 6.1 BFS vs DFS 怎么选

```
要"最短/最少步数"？
├── 是 → BFS（层序遍历，第一次到达就是最短）
└── 不是 ↓

要"所有方案"或"存在性"？
├── 是 → DFS（递归穷举，方便回溯）
└── 不确定 → 默认 DFS（更好写，内存省）
```

| | BFS | DFS |
|--|-----|-----|
| 适合 | 最短路径/最少步数 | 所有方案/路径搜索/排列组合 |
| 数据结构 | 队列 | 递归（隐式栈）或显式栈 |
| 特点 | 一定找到最短，但内存大 | 不保证最短，但内存小 |
| 典型 | 迷宫最短路、BFS 构造 | N皇后、全排列、岛屿数量 |

### 6.2 DFS 回溯模板思路

写之前先回答 5 个问题（来自你的 feedback）：
1. **输入参数**是什么？（当前状态、路径、层级...）
2. **返回值**是什么？（void？bool？int？）
3. **base case**是什么？（到底了返回什么？）
4. **递归怎么展开**？（有哪些选择？）
5. **回溯需要撤销什么**？（visited 标记、路径...）

**回溯：两个独立的维度，分开判断**

铁律只有一条：**函数返回时，共享状态必须和进入时一模一样**（兄弟分支还要用）。

在此之上有两个独立的选择：

| 维度 | 问什么 | 决定于 |
|------|--------|--------|
| **① 谁标记**（callee / caller）| 标记恢复写在函数里还是调用处 | **参数形状** |
| **② 能否提前 return** | 找到一个解要不要停 | **题目性质** |

---

**维度 ①：callee 标记 还是 caller 标记**

判断标准：**dfs 的参数能不能说明"我这一步选了什么"**。

```cpp
dfs(int cur)              // 参数=我在哪个点 → 函数自己知道标记谁 → callee
dfs(vector<int>& nums)    // 参数=整个集合，看不出这步选了啥 → caller
```

```cpp
// callee 标记：函数进门标记自己，出门恢复自己
void dfs(int cur) {
    vis[cur] = true;
    ...
    vis[cur] = false;
}
dfs(i);                        // 调用方什么都不用管

// caller 标记：调用方在前后 push/pop
path.push_back(val);
dfs(path);
path.pop_back();
```

**为什么数字链必须 caller**：一对 `(i,j)` 能产生 `sum` 和 `diff` 两个候选，
但 `dfs(nums, depth)` 的参数里没有"我选了哪个"，函数进门不知道该标记什么。

---

**维度 ②：能不能提前 return**

| 题目求什么 | 找到一个解之后 | 提前 return |
|-----------|--------------|------------|
| 最值 / 计数 | 还得比别的路径 | ❌ 不行，会漏解 |
| 存在性（返回 bool）| 收工 | ✅ 可以（先恢复状态再 return）|

---

**两个维度任意组合**

| | 不能提前 return | 能提前 return |
|---|---|---|
| **callee** | 超级问号 `dfs(place)` 求最大金币 | 迷宫可达 `bool dfs(x,y)` |
| **caller** | 全排列输出所有方案 `dfs(path)` | 数字链 `bool dfs(nums)` |

---

**模板 A：callee + 不能 return**（求最值最常见）

回溯代码统一放函数末尾，用 `if-else` 代替中途 `return`，保证只有一个出口：

```cpp
void dfs(int cur, int depth) {
    vis[cur] = true;
    sum += gain(cur);

    if (depth == n) {
        ans = max(ans, sum);        // base case 只更新答案，不 return
    } else {
        for (int i = 0; i < n; i++)
            if (!vis[i]) dfs(i, depth + 1);
    }

    sum -= gain(cur);               // 回溯统一写在末尾
    vis[cur] = false;
}
```

**模板 B：caller + 能 return**

```cpp
bool dfs(vector<int>& path, int depth, int maxDepth) {
    if (剪枝条件) return false;
    if (depth == maxDepth) return 是否达成;

    for (每个候选 val) {
        path.push_back(val);
        bool found = dfs(path, depth + 1, maxDepth);
        path.pop_back();            // 先恢复
        if (found) return true;     // 再返回
    }
    return false;
}
```

`pop_back()` 必须写在 `if (found)` **之前**。写成 `if (dfs(...)) return true; pop();`
成功时状态是脏的，只有"之后不再用这个状态"才碰巧安全。

---

**三个高频错误**

```cpp
// ❌ 回溯写在 for 里，恢复的是子节点的状态（该由 dfs(i) 自己恢复）
for (int i = 0; i < n; i++)
    if (!vis[i]) { dfs(i, depth+1); vis[i] = false; }

// ❌ base case 直接 return，状态没恢复
if (depth == n) { ans = max(ans, sum); return; }

// ❌ 求最值时提前 return，漏掉后面的路径
if (dfs(...)) return;
```

### 6.3 剪枝

搜索太慢时加剪枝：
- **可行性剪枝**：当前路径已经不可能满足条件，直接 return
- **最优性剪枝**：当前路径已经不可能比已知最优解好，直接 return
- **对称性剪枝**：等价的搜索分支只搜一次
- **排序后剪枝**：排序后更容易判断"后面的都不行"

---

## 7. 其他：数学/模拟/数据结构

### 7.1 数学题信号

| 题面信号 | 算法 |
|---------|------|
| "最大公约数"、"互质" | GCD（辗转相除） |
| "最小公倍数" | `a / gcd(a,b) * b` |
| "是否是质数"、"质数个数" | 试除法 / 埃筛 |
| "A^B 的结果（很大）"、"mod" | 快速幂 |
| "N 进制转换" | 除基取余法 |
| "超大数字（100位+）" | 大数模板（string） |

### 7.2 数据结构题信号

| 题面信号 | 用什么 |
|---------|--------|
| "括号匹配"、"表达式求值" | 栈 |
| "合并代价最小"、"哈夫曼" | 优先队列（小顶堆） |
| "快速查找/计数" | 哈希表（unordered_map） |
| "去重/判存在" | 哈希集合（unordered_set） |
| "构建二叉树"、"遍历" | 递归建树 |
| "查找/插入有序" | BST |

### 7.3 模拟题信号

| 题面信号 | 做法 |
|---------|------|
| "按规则一步步操作" | 照着题意写 |
| "日期计算" | 月份天数数组 + 闰年判断 |
| "枚举所有 3 位数 / 排列" | 暴力循环 |
| "字符串按规则变换" | 逐字符处理 |

---

## 8. 易混淆对比

### 并查集 vs DFS 判连通

| | 并查集 | DFS |
|--|-------|-----|
| 适合 | 动态加边、多次查询连通性 | 一次性遍历连通分量 |
| 数据结构 | 数组 | 邻接表 + visited |
| 优势 | 合并 O(α(n))，近乎 O(1) | 简单直观 |
| 典型 | "合并两个集合" → 并查集 | "这个岛有多大" → DFS |

### 贪心 vs DP

已在 3.4 对比。核心：**能举出贪心反例 → DP**。

### BFS vs Dijkstra

| | BFS | Dijkstra |
|--|-----|---------|
| 边权 | 无权或全是 1 | 有权（非负）|
| 数据结构 | 普通队列 | 优先队列 |
| 时间复杂度 | O(V+E) | O((V+E)logV) |
| 什么时候用 | "最少步数"、每步代价相同 | "最短距离"、每步代价不同 |

### 什么时候把额外信息加进节点（多维状态）

普通最短路：节点 = `(x, y)`。但如果有某个信息**影响后续走法**，就必须把它加进节点定义。

**判断方法**：同一个位置，到达时状态不同，后续代价是否不同？
- 不同 → 把状态加进节点，它们是不同的节点
- 相同 → 不需要加

**常见场景**：

| 题目条件 | 需要加进节点的信息 | 节点定义 |
|---------|-------------------|---------|
| 代价随步数/状态变化 | 当前状态 | `(x, y, state)` |
| 有钥匙才能开门 | 有没有钥匙 | `(x, y, hasKey)` |
| 奇偶步代价不同 | 走了奇数还是偶数步 | `(x, y, parity)` |
| 最多转 k 次弯 | 已经转了几次 | `(x, y, turns)` |

加了之后，dist 数组从 `dist[x][y]` 变成 `dist[x][y][state]`，其他跟普通 Dijkstra 一样。

---

## 9. 终极决策流程图

```
拿到题 →
│
├── 有节点+边（或网格）？
│   ├── 判连通/检测环 → 并查集
│   ├── 最短路（无权）→ BFS
│   ├── 最短路（有权）→ Dijkstra
│   ├── 最小代价连所有点 → Kruskal
│   ├── 排序/依赖 → 拓扑排序
│   ├── 网格遍历/岛屿 → DFS/BFS
│   └── 最早完成时间 → 关键路径
│
├── 求最优值？
│   ├── 贪心能做？（举不出反例）→ 贪心
│   └── 不能/有容量限制 → DP
│       ├── 背包类 → 01/完全/多重背包
│       ├── 序列类 → LIS / LCS / Kadane
│       └── 网格类 → 网格 DP
│
├── 求所有方案/构造/判存在？
│   ├── 最短/最少 → BFS
│   └── 其他 → DFS 回溯（+ 剪枝）
│
├── 数学计算？
│   ├── GCD/LCM/质数/快速幂/进制 → 对应模板
│   └── 超大数 → 大数模板
│
├── 括号/表达式？ → 栈
├── 合并代价/调度？ → 优先队列
├── 查找/计数？ → 哈希表
├── 字符串匹配？ → KMP
│
└── 以上都不是？ → 模拟（照题意写）
```

---

## 10. 考场实战建议

1. **读题 2 分钟**：划出关键词（最短、最大、连通、所有方案...），对照上面的信号表
2. **想算法 1 分钟**：走一遍决策流程图
3. **想不出来？** 问自己：
   - 这个问题能拆成更小的相同问题吗？→ DP / 递归
   - 能不能一步步构造答案？→ BFS / 贪心
   - 暴力能过吗？（n ≤ 20 → 2^20 = 100万，可以暴力）
4. **还是想不出来？** → 先写暴力，拿部分分，再优化

---

# 板子代码速查

> 8 大必背板子，考前默写一遍。

### 3.1 并查集

```cpp
int unit[N];

void init(int n) {
    for (int i = 0; i <= n; i++) unit[i] = i;
}

int find(int x) {
    return unit[x] == x ? x : unit[x] = find(unit[x]);
}

void unite(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx != ry) unit[rx] = ry;
}
```

### 3.2 Dijkstra（堆优化）

```cpp
int dist[N];
bool vis[N];

void dijkstra(int s, int n) {
    memset(dist, 0x3f, sizeof(dist));
    memset(vis, false, sizeof(vis));
    dist[s] = 0;

    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    pq.push({0, s});

    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        if (vis[u]) continue;
        vis[u] = true;//注意这里要判断是否访问，不然会一直循环
        for (auto& e : adj[u]) {
            int v = e.first, w = e.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}
```

### 3.2.4 SPFA（有负权时用）

Dijkstra 不能处理负权，负权就用这个。是 Bellman-Ford 的队列优化版：
**只有距离被更新过的点，才可能让它的邻居变短**，所以只把这些点放队列里。

```cpp
int dist[N];
bool inQueue[N];        // 这个点在不在队列里（不是"访问过"）
int cnt[N];             // 每个点入队几次，用来判负环

bool spfa(int s, int n) {
    memset(dist, 0x3f, sizeof dist);
    memset(inQueue, false, sizeof inQueue);
    memset(cnt, 0, sizeof cnt);

    queue<int> q;                    // 普通队列，不是优先队列
    dist[s] = 0;
    q.push(s);
    inQueue[s] = true;

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        inQueue[u] = false;          // 出队了，标记清掉（还能再进来）

        for (int i = 0; i < (int)adj[u].size(); i++) {
            int v = adj[u][i].first;
            int w = adj[u][i].second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (!inQueue[v]) {   // 不在队里才入队，在队里就不用重复放
                    q.push(v);
                    inQueue[v] = true;
                    cnt[v]++;
                    if (cnt[v] >= n) return false;   // 入队 n 次 → 有负环
                }
            }
        }
    }
    return true;                     // 没有负环
}
```

**跟 Dijkstra 的三处区别**：

| | Dijkstra | SPFA |
|---|---------|------|
| 容器 | `priority_queue` | 普通 `queue` |
| 标记 | `vis`：出队即定型，**不再入队** | `inQueue`：**可以反复入队** |
| 负权 | ✗ | ✓ |

**关键**：SPFA 里一个点可以多次入队——它的距离会被反复刷新。Dijkstra 出队就定型了。

**判负环**：某点入队 ≥ n 次（正常最多 n-1 次）。

**限制"最多经过 k 条边"** 用朴素 Bellman-Ford（把松弛轮数改成 k）：

```cpp
for (int i = 1; i <= k; i++) {              // 松弛 k 轮 = 最多走 k 条边
    memcpy(backup, dist, sizeof dist);      // 用上一轮的值，防止串联
    for (每条边 (u,v,w))
        dist[v] = min(dist[v], backup[u] + w);
}
```

### 3.2.5 Floyd（所有点对最短路）

```cpp
long long dist[N][N];   // 初始化为邻接矩阵，不通的填 0x3f3f3f3f，dist[i][i]=0

for (int k = 1; k <= n; k++)              // 中转点，必须在最外层！
    for (int i = 1; i <= n; i++)          // 起点
        for (int j = 1; j <= n; j++)      // 终点
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
```

O(n³)，n ≤ 500 左右能过。**k 必须是最外层循环**，写错位置结果就是错的。

**关键性质（很多题的钥匙）**：最外层的 `k` 不是"第几轮"，而是**"允许拿哪些点当中转站"**。

```
跑完 k=1..t 之后：dist[i][j] = 只允许经过 {1,...,t} 中转的最短路
```

所以 Floyd 是「**逐步放开中转点**」的过程，可以中途取用。

**什么时候用 Floyd 而不是 Dijkstra**：

| 需求 | 用什么 |
|------|--------|
| 单个起点到所有点 | Dijkstra O((V+E)logV) |
| 所有点对之间 + n 小（≤500） | Floyd O(n³)，好写 |
| 所有点对 + n 大 | 跑 n 次 Dijkstra |
| 有负权边 | Floyd 可以（无负环即可），Dijkstra 不行 |

**典型应用：逐个删点求最短路和（CF 295B）**

题意：按给定顺序逐个关闭节点，每次关闭前求所有开放节点间的最短路之和。

```cpp
// 关键：倒过来做，把「删点」变成「加点」
// 新开放一个节点 = Floyd 最外层多跑一个 k
for (int t = n; t >= 1; t--) {
    int k = d[t];                         // 新开放的节点
    for (int i = 1; i <= n; i++)          // Floyd 的一层松弛
        for (int j = 1; j <= n; j++)
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);

    long long sum = 0;                    // 统计已开放节点间的距离和
    for (int a = t; a <= n; a++)
        for (int b = t; b <= n; b++)
            sum += dist[d[a]][d[b]];
    ans[t] = sum;
}
// 正序输出 ans[1..n]
```

**可迁移套路**：**「按顺序删除，每次删前查询」→ 倒过来变成「按逆序添加，每次添加后查询」**。
因为删除难增量维护，添加容易。同类：逐个删边问连通性 → 倒过来加边用并查集。

**Floyd 输出最短路径本身（不只是长度）**

多开一个 `nxt` 矩阵：`nxt[i][j]` = 从 i 走到 j 的最短路上，**i 的下一步该去哪**。

```cpp
const int INF = 0x3f3f3f3f;
int dist[N][N];
int nxt[N][N];      // nxt[i][j] = i→j 最短路上，i 的下一个节点

// ---- 初始化 ----
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= n; j++)
        nxt[i][j] = (dist[i][j] < INF) ? j : -1;   // 有直达边就直接走 j
// 注意 dist[i][i]=0 < INF，所以 nxt[i][i] = i

// ---- Floyd（只多了一行）----
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            if (dist[i][k] + dist[k][j] < dist[i][j]) {
                dist[i][j] = dist[i][k] + dist[k][j];
                nxt[i][j] = nxt[i][k];             // ← 路线改成"先朝 k 的方向走"
            }

// ---- 输出 i 到 j 的完整路径 ----
void printPath(int i, int j) {
    if (nxt[i][j] == -1) { cout << "unreachable" << endl; return; }
    cout << i;
    while (i != j) {
        i = nxt[i][j];
        cout << " -> " << i;
    }
    cout << endl;
}
```

**为什么是 `nxt[i][j] = nxt[i][k]`**：新路线是 `i → ... → k → ... → j`，
那么从 i 迈出的第一步，跟「i 走到 k 的最短路的第一步」是同一步，也就是 `nxt[i][k]`。

**跟踪例子**（`1→2:1, 2→3:1, 3→4:1, 1→3:5`）：
```
初始： nxt[1][2]=2  nxt[1][3]=3  nxt[1][4]=-1  nxt[2][3]=3  nxt[3][4]=4

k=2：dist[1][3] 从 5 降到 2  →  nxt[1][3] = nxt[1][2] = 2
k=3：dist[1][4] 从 ∞ 降到 3  →  nxt[1][4] = nxt[1][3] = 2

查 1→4：1 → nxt[1][4]=2 → nxt[2][4]=3 → nxt[3][4]=4  →  输出 "1 -> 2 -> 3 -> 4"
```

**Dijkstra 记路径同理**：松弛成功时记 `pre[v] = u`，最后从终点沿 `pre` 往回走再 reverse。

### 3.3 Kruskal

```cpp
bool cmp(const Edge& a, const Edge& b) {
    return a.w < b.w;
}

int kruskal(int n, int m) {
    sort(edges, edges + m, cmp);
    init(n);
    int total = 0, cnt = 0;
    for (int i = 0; i < m; i++) {
        int ru = find(edges[i].u), rv = find(edges[i].v);
        if (ru != rv) {
            unite(ru, rv);
            total += edges[i].w;
            cnt++;
            if (cnt == n - 1) break;//注意计数这里
        }
    }
    return total;
}
```

### 3.4 拓扑排序（Kahn）

```cpp
void topoSort(int n) {
    queue<int> q;
    for (int i = 1; i <= n; i++) {
        if (in[i] == 0) q.push(i);
    }
    while (!q.empty()) {
        int u = q.front();//注意这里是front
        q.pop();
        cout << u << " ";
        for (int v : adj[u]) {
            in[v]--;
            if (in[v] == 0) q.push(v);
        }
    }
}
```

### 3.5 BFS（网格最短路）

```cpp
int dx[4] = {0, 0, -1, 1};
int dy[4] = {-1, 1, 0, 0};
int dist[N][N];

int bfs(int sx, int sy, int ex, int ey, int n, int m) {
    memset(dist, -1, sizeof(dist));
    queue<pair<int,int>> q;
    dist[sx][sy] = 0;
    q.push({sx, sy});

    while (!q.empty()) {
        auto cur = q.front();
        q.pop();
        int x = cur.first, y = cur.second;
        if (x == ex && y == ey) return dist[x][y];
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx >= 0 && nx < n && ny >= 0 && ny < m
                && grid[nx][ny] == '.' && dist[nx][ny] == -1) {
                dist[nx][ny] = dist[x][y] + 1;
                q.push({nx, ny});
            }
        }
    }
    return -1;
}

```

### 3.5.5 序列题常用板子

**前缀和**（反复查询区间和）

```cpp
// 一维：pre[i] = a[1..i] 的和
pre[0] = 0;
for (int i = 1; i <= n; i++) pre[i] = pre[i-1] + a[i];
// 查询 [l, r] 的和
sum = pre[r] - pre[l-1];

// 二维：容斥
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        pre[i][j] = mat[i][j] + pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1];
// 查询子矩阵 [r1..r2][c1..c2]
sum = pre[r2][c2] - pre[r1-1][c2] - pre[r2][c1-1] + pre[r1-1][c1-1];
```

**差分数组**（反复区间加值，最后统一查询）

```cpp
// 给 [l, r] 每个数加上 x
diff[l] += x;
diff[r+1] -= x;

// 全部操作做完后，前缀和还原成最终数组
a[0] = diff[0];
for (int i = 1; i < n; i++) a[i] = a[i-1] + diff[i];
```

**双指针 / 滑动窗口**（找最短的满足条件的连续段，元素非负）

```cpp
int left = 0, sum = 0, ans = INT_MAX;
for (int right = 0; right < n; right++) {
    sum += a[right];               // 不够就扩右
    while (sum >= K) {             // 够了就缩左，找更短的
        ans = min(ans, right - left + 1);
        sum -= a[left];
        left++;
    }
}
// 找最长的：把 while 条件反过来（不满足就缩左），在循环外更新 ans
// 注意：有负数时不能用，缩左可能让 sum 变大
```

**Kadane**（最大连续子数组和 + 记录首尾）

```cpp
int maxSum = INT_MIN, curSum = 0;
int start = 0, end = 0, tempStart = 0;

for (int i = 0; i < n; i++) {
    curSum += a[i];
    if (curSum > maxSum) {         // 用 > 不用 >=，保证取最靠前的
        maxSum = curSum;
        start = tempStart;
        end = i;
    }
    if (curSum < 0) {              // 前面拖后腿，丢掉重开
        curSum = 0;
        tempStart = i + 1;
    }
}
```

**单调栈**（找每个元素右边第一个更大的）

```cpp
stack<int> st;                     // 栈里存下标，不是值
vector<int> nextGreater(n, -1);

for (int i = 0; i < n; i++) {
    // 当前元素比栈顶大 → 栈顶找到答案了，弹出结算
    while (!st.empty() && a[i] > a[st.top()]) {
        nextGreater[st.top()] = i;
        st.pop();
    }
    st.push(i);
}
// 栈里剩下的都没有更大的，保持 -1

// 找右边第一个更小：把 > 改成 <
// 找左边第一个更大：从右往左遍历
```

**二分答案**（最大值最小化 / 最小值最大化）

```cpp
// check(x)：答案取 x 时可不可行
bool check(int x) { ... }

int lo = 下界, hi = 上界, ans = -1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;      // 防溢出写法
    if (check(mid)) {
        ans = mid;
        hi = mid - 1;                  // 求最小的可行值 → 继续往左找
    } else {
        lo = mid + 1;
    }
}
// 求最大的可行值：把 hi=mid-1 和 lo=mid+1 对调
```

**编辑距离**

```cpp
// dp[i][j] = a 前 i 个字符 改成 b 前 j 个字符 的最少操作数
for (int i = 0; i <= n; i++) dp[i][0] = i;      // 全删
for (int j = 0; j <= m; j++) dp[0][j] = j;      // 全加

for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++) {
        if (a[i-1] == b[j-1]) {
            dp[i][j] = dp[i-1][j-1];            // 一样，不用操作
        } else {
            dp[i][j] = min(dp[i-1][j-1],        // 改
                       min(dp[i-1][j],          // 删 a 的第 i 个
                           dp[i][j-1])) + 1;    // 在 a 里加一个
        }
    }
// 答案 dp[n][m]
```

**最长公共子串**（跟 LCS 只差一行）

```cpp
// dp[i][j] = 以 a[i-1] 和 b[j-1] 【结尾】的最长公共子串长度
int ans = 0;
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++) {
        if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
        else                  dp[i][j] = 0;     // ← 断了就归零（LCS 是取 max）
        ans = max(ans, dp[i][j]);               // ← 答案要全表扫（LCS 是 dp[n][m]）
    }
```

**LIS + 计数**

```cpp
vector<int> len(n, 1);
vector<long long> cnt(n, 1);

for (int i = 0; i < n; i++)
    for (int j = 0; j < i; j++)
        if (a[j] < a[i]) {                      // 严格递增
            if (len[j] + 1 > len[i]) {          // 更长 → 重置
                len[i] = len[j] + 1;
                cnt[i] = cnt[j];
            } else if (len[j] + 1 == len[i]) {  // 等长 → 累加
                cnt[i] += cnt[j];
            }
        }

int maxLen = 0;
for (int i = 0; i < n; i++) maxLen = max(maxLen, len[i]);
long long ans = 0;
for (int i = 0; i < n; i++) if (len[i] == maxLen) ans += cnt[i];
// len[i] 是「以 i 结尾」的，全局最长可能结尾在任何位置，所以要全扫一遍
```

### 3.6 01背包

```cpp
int dp[N][W_MAX];

int knapsack(int n, int W) {
    memset(dp, 0, sizeof(dp));
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= W; j++) {
            dp[i][j] = dp[i-1][j];
            if (j >= w[i]) {
                dp[i][j] = max(dp[i][j], dp[i-1][j-w[i]] + v[i]);
            }
        }
    }
    return dp[n][W];
}
```

### 3.7 LCS

```cpp
int dp[N][M];

int lcs(const string& a, const string& b) {
    int n = a.size(), m = b.size();
    memset(dp, 0, sizeof(dp));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i-1] == b[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[n][m];
}


```

### 3.8 KMP

```cpp
int nxt[M];

void buildNext(const string& p) {
    int m = p.size();
    nxt[0] = 0;
    int len = 0, i = 1;
    while (i < m) {
        if (p[i] == p[len]) {
            len++;
            nxt[i] = len;
            i++;
        } else {
            if (len > 0) {
                len = nxt[len - 1];
            } else {
                nxt[i] = 0;
                i++;
            }
        }
    }
}

int kmpSearch(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    buildNext(pattern);
    int count = 0, i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) {
            i++;
            j++;
            if (j == m) {
                count++;
                j = nxt[j - 1];
            }
        } else {
            if (j > 0) {
                j = nxt[j - 1];
            } else {
                i++;
            }
        }
    }
    return count;
}

```

### 3.9 建树

**方式 A：数组建树（输入给编号时用）**

输入格式：`n` 行，每行 `val left right`，-1 表示空。根节点编号 1。

```cpp
struct Node {
    int val;
    int left, right;  // 存子节点编号，-1 表示空
};
Node nodes[1005];

// 读入
int n; cin >> n;
for (int i = 1; i <= n; i++) {
    cin >> nodes[i].val >> nodes[i].left >> nodes[i].right;
}

// DFS 时用编号访问
void dfs(int u) {
    if (u == -1) return;
    // 处理 nodes[u]
    dfs(nodes[u].left);
    dfs(nodes[u].right);
}
dfs(1);  // 从根开始
```

**方式 B：new 建树（输入是前序字符串时用）**

输入格式：一个字符串，如 `124##5##36##7##`，`#` 表示空。

```cpp
struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

int idx = 0;
string s;

Node* build() {
    if (idx >= (int)s.size() || s[idx] == '#') {
        idx++;
        return nullptr;
    }
    Node* node = new Node(s[idx] - '0');
    idx++;
    node->left = build();
    node->right = build();
    return node;
}

// 调用
cin >> s;
Node* root = build();
```

**选哪个**：题目给编号 → 方式 A（简单）。题目给前序/中序字符串 → 方式 B。

**方式 C：完全二叉树（数组直接存，不需要指针）**

完全二叉树 = 除最后一层外都填满，最后一层节点靠左连续排列（中间无空缺）。

按**层序**（从上到下、从左到右）输入，用数组存，下标从 1 开始：

```cpp
int a[1005];
for (int i = 1; i <= n; i++) cin >> a[i];
```

**下标关系**（不需要建树，直接算）：
```
节点 i 的左孩子 = 2*i
节点 i 的右孩子 = 2*i + 1
节点 i 的父节点 = i / 2
```

**每层的下标范围**：
```
第 1 层：下标 1
第 2 层：下标 2 ~ 3
第 3 层：下标 4 ~ 7
第 4 层：下标 8 ~ 15
第 d 层：下标 2^(d-1) ~ 2^d - 1
```

用位运算算 2 的幂：`1 << (d-1)` 就是 2^(d-1)（比 `pow` 快且准确）。

```cpp
int start = 1 << (d - 1);    // 第 d 层起点
int end = (1 << d) - 1;      // 第 d 层终点
for (int i = start; i <= min(end, n); i++) cout << a[i];
```

### 3.10 LCA（最近公共祖先）

两个节点同时往上爬，第一次碰面的地方就是 LCA。

```cpp
int parent[N];  // parent[i] = i 的父节点
int depth[N];   // depth[i] = i 的深度

// 预处理：DFS 算每个节点的深度和父节点
void dfsDepth(int u, int par, int dep) {
    parent[u] = par;
    depth[u] = dep;
    for (int v : adj[u]) {
        if (v != par) dfsDepth(v, u, dep + 1);
    }
}
// 调用：dfsDepth(root, -1, 0);

// 查询 u 和 v 的 LCA
int lca(int u, int v) {
    // 1. 调到同一深度（深的先爬）
    while (depth[u] > depth[v]) u = parent[u];
    while (depth[v] > depth[u]) v = parent[v];
    // 2. 一起往上爬
    while (u != v) {
        u = parent[u];
        v = parent[v];
    }
    return u;
}
```

朴素版 O(n)，够用。信号：看到"两个节点的最近公共祖先"/"最近公共父节点"就用这个。

### 3.11 区间 DP

**一句话**：`dp[i][j]` = 把区间 `[i,j]` 处理完的最优值；枚举「**最后一步操作发生在哪个位置 k**」，
k 把区间劈成左右两半，两半各自处理完，再加上最后这一步的代价。

**信号**：操作会改变元素的相邻关系（撞掉/合并/删除一个后左右变邻居），正着想"先做哪个"很难 → 反过来想"最后做哪个"。

**循环顺序的唯一规则**：`dp[i][j]` 用到 `dp[i][k-1]` 和 `dp[k+1][j]`，这两个都比 `[i,j]` 短 → **短区间先算**。

```cpp
// 三层循环模板（背下来）
for (int len = 1; len <= n; len++)             // 1. 区间长度，从小到大
    for (int i = 0; i + len - 1 < n; i++) {    // 2. 左端点
        int j = i + len - 1;                    //    右端点跟着确定
        for (int k = i; k <= j; k++) {          // 3. 枚举分割点/最后操作的位置
            int left  = (k > i) ? dp[i][k-1] : 0;
            int right = (k < j) ? dp[k+1][j] : 0;
            dp[i][j] = max(dp[i][j], left + right + 代价(i, k, j));
        }
    }
// 答案 = dp[0][n-1]
```

**戳气球 / 超级问号**

> **题意**：一排数，每次撞掉一个，得分 = 左邻居 × 自己 × 右邻居（越界算 1）；
> 撞掉之后左右两边变成邻居。问全部撞完的最大总得分。
>
> **k 的含义**：区间 `[i,j]` 里**最后一个被撞的**是 k。因为它最后撞，撞它时区间里只剩它，
> 所以左右邻居是**区间外**的 `i-1` 和 `j+1`——这两个是固定的，不受区间内怎么撞影响。

```cpp
int getCoin(int i) { return (i < 0 || i >= n) ? 1 : coins[i]; }  // 越界视为 1

for (int len = 1; len <= n; len++)
    for (int i = 0; i + len - 1 < n; i++) {
        int j = i + len - 1;
        for (int k = i; k <= j; k++) {
            int left  = (k > i) ? dp[i][k-1] : 0;
            int right = (k < j) ? dp[k+1][j] : 0;
            int gain  = getCoin(i-1) * coins[k] * getCoin(j+1);
            dp[i][j] = max(dp[i][j], left + right + gain);
        }
    }
cout << dp[0][n-1];
```

**石子合并**

> **题意**：n 堆石子排成一排，每次只能把**相邻两堆**合成一堆，代价是这两堆的重量之和。
> 问全部合成一堆的最小总代价。
>
> **k 的含义**：`[i,j]` 最终要合成一堆，那**最后一次合并**一定是「左边一大堆」和「右边一大堆」合起来，
> k 就是这两大堆的分界线（左半 `[i,k]`，右半 `[k+1,j]`）。
> 最后这一次合并的代价 = 整个区间的重量和 = `prefix[j] - prefix[i-1]`。

```cpp
for (int len = 2; len <= n; len++)
    for (int i = 1; i + len - 1 <= n; i++) {
        int j = i + len - 1;
        dp[i][j] = 0x3f3f3f3f;
        for (int k = i; k < j; k++)
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + prefix[j] - prefix[i-1]);
    }
```

**两者的区别**：戳气球的 k 是"最后撞的球"（k 被排除在左右两半之外）；石子合并的 k 是"分割点"（左半 `[i,k]`、右半 `[k+1,j]`，k 归左半）。看题目是"删掉一个"还是"切成两半"。