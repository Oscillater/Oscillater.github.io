---
title: 机考全攻略
description: C++ 机考语法速查与算法选择指南 coauthor by opus 4.6
id: fight_code
---

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
| `s.empty()` | 是否为空 |
| `s.clear()` | 清空 |

**常用技巧**：
```cpp
// 判断子串存在
if (s.find("abc") != string::npos) ...

// 大小写转换（单个字符）
char c = toupper('a');  // 'A'
char c = tolower('A');  // 'a'

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

**写法 C：重载 operator&lt;**（类型天然有序时）
```cpp
struct Edge {
    int u, v, w;
    bool operator<(const Edge& o) const {
        return w < o.w;
    }
};
sort(edges, edges + m);  // 不传 cmp，自动用 operator&lt;
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

**坑 3：operator&lt; 必须是 const 成员函数**
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

| 方法 | 适合 | 示例 |
|------|------|------|
| `cin >> a >> b` | 空格分隔，类型已知 | `01 张三 21` |
| `find` + `substr` | 固定分隔符 | `[spell] func` |
| `istringstream` | 灵活切割 | 任意格式 |
| `sscanf` | C 风格格式解析 | `sscanf(s, "%d+i%d", &a, &b)` |

```cpp
// istringstream 切空格
#include <sstream>
string line = "aa bb cc";
istringstream iss(line);
string word;
while (iss >> word) {
    cout << word << endl;  // aa, bb, cc
}
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
---


---

# 算法选择指南：拿到题怎么想

> 核心问题不是"我会什么算法"，而是"这道题的结构是什么"。
> 结构决定算法，不是反过来。

---

## 1. 拿到题先问 4 个问题

拿到任何一道题，按顺序问自己：

```
Q1: 题目里有没有"图"的结构？
    （节点+边、网格、关系、连通、路径...）
    ├── 有 → 去第 2 节（图论）
    └── 没有 ↓

Q2: 是不是求"最优值"？（最大/最小/最长/最短/最少...）
    ├── 有，且能拆成子问题 → 去第 3 节（DP）
    ├── 有，且每步选当前最好就行 → 去第 4 节（贪心）
    └── 没有 ↓

Q3: 是不是"搜索所有方案"或"构造一个满足条件的东西"？
    ├── 是 → 去第 5 节（搜索/回溯）
    └── 没有 ↓

Q4: 是不是纯粹的数据操作/模拟/数学计算？
    └── 是 → 去第 6 节（数学/模拟/数据结构）
```

**关键**：很多题可以归到多个类别。比如"最短路径"既是图论又是求最优——这时候图论特征更明显，优先按图论处理。

---

## 2. 图论：看到"节点+边"就进这里

### 2.1 先判断图的类型

| 题面信号 | 图的类型 |
|---------|----------|
| "A 和 B 相连"、"无向边"、"双向路" | 无向图 |
| "A 指向 B"、"单向路"、"先修课" | 有向图 |
| "网格"、"矩阵"、"地图"、上下左右 | 网格图（隐式图） |
| "边有权重/距离/花费" | 带权图 |

### 2.2 图论算法选择

```
是图论题 →
├── 问的是"是否连通"/"有几个连通分量"/"有没有环"？
│   └── 并查集
│
├── 问的是"最短路径/最小距离"？
│   ├── 边有权重 → Dijkstra（堆优化）
│   └── 边无权重（或权重都是 1）→ BFS
│
├── 问的是"连接所有点的最小代价"？
│   └── 最小生成树 → Kruskal（排序+并查集）
│
├── 问的是"排序/先后顺序/依赖关系"？
│   ├── 只要顺序 → 拓扑排序
│   └── 还要最早/最晚完成时间 → 关键路径（拓扑+DP）
│
├── 问的是"有几个岛屿"/"填充区域"？
│   └── 网格 DFS/BFS（flood fill）
│
└── 问的是"遍历所有节点"/"路径存在性"？
    └── DFS
```

### 2.3 每个算法一句话

| 算法 | 干什么的 | 核心思路 |
|------|---------|---------|
| **并查集** | 判连通、检测环 | 每个节点指向父节点，find 找根，unite 合并 |
| **BFS** | 无权图最短路 | 队列，一层一层扩展，第一次到达就是最短 |
| **DFS** | 遍历、回溯、flood fill | 递归/栈，一条路走到底再回头 |
| **Dijkstra** | 带权图最短路（非负权）| 小顶堆，每次取最近的点，更新邻居 |
| **Kruskal** | 最小生成树 | 边排序，从小到大加，用并查集判是否成环 |
| **拓扑排序** | 有向无环图排序 | 每次取入度为 0 的点，删掉它，更新邻居入度 |
| **关键路径** | 项目最短工期 | 拓扑排序 + DP 求最长路径 |

---

## 3. DP：看到"最优"且有"重叠子问题"

### 3.1 怎么判断是 DP 题

满足以下**全部**条件：

1. **求最优值**（最大/最小/最长/方案数）— 这决定了你需要"在很多种方案里挑最好的"。如果只是模拟或输出所有方案，不是 DP 的活。

2. **最优子结构** — 大问题的最优解可以由小问题的最优解拼出来。比如 01 背包：前 5 个物品容量 10 的最优解，一定是从"前 4 个物品"的某个最优解推出来的（第 5 个选或不选）。如果大问题的最优解跟小问题没关系，DP 不适用。

3. **子问题重叠** — 这是 DP 比暴力快的原因。比如斐波那契 `f(5) = f(4) + f(3)`，`f(4) = f(3) + f(2)`，这里 `f(3)` 被算了两次。DP 用表存起来，算过的不重算。如果子问题都不重叠（每个只算一次），那就是普通分治，不需要 DP。

**三个条件缺一个就不是 DP**：条件 1 告诉你目标是什么，条件 2 告诉你能拆，条件 3 告诉你拆了之后 DP 比暴力快。

### 3.2 DP 四步走

1. **定义状态**：`dp[i]` 或 `dp[i][j]` 代表什么？
2. **写转移方程**：`dp[i]` 怎么从之前的状态算出来？
3. **确定边界**：`dp[0]`、`dp[0][0]` 是什么？
4. **确定遍历顺序**：从小到大？从大到小？

### 3.3 常见 DP 类型速查

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

### 3.4 分治 vs DP vs 贪心

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

## 4. 贪心：每步选当前最好的

### 4.1 怎么判断能用贪心

核心：**局部最优选择能导致全局最优**。

判断方法：
1. 想一个贪心策略
2. 试着举反例
3. 举不出来 → 大概率能用

### 4.2 常见贪心模式

| 题面信号 | 贪心策略 |
|---------|---------|
| "最多能参加几个活动/会议"（区间不重叠） | 按结束时间排序，能参加就参加 |
| "分数背包"（物品可以拆开） | 按性价比排序，从高到低装 |
| "最小代价连接"（边权） | Kruskal（贪心选最短边） |
| "最短路径"（非负权） | Dijkstra（贪心选最近点） |
| "用最少的 X 覆盖所有 Y" | 按某个维度排序，贪心匹配 |

---

## 5. 搜索/回溯：枚举所有可能

### 5.1 BFS vs DFS 怎么选

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

### 5.2 DFS 回溯模板思路

写之前先回答 5 个问题（来自你的 feedback）：
1. **输入参数**是什么？（当前状态、路径、层级...）
2. **返回值**是什么？（void？bool？int？）
3. **base case**是什么？（到底了返回什么？）
4. **递归怎么展开**？（有哪些选择？）
5. **回溯需要撤销什么**？（visited 标记、路径...）

### 5.3 剪枝

搜索太慢时加剪枝：
- **可行性剪枝**：当前路径已经不可能满足条件，直接 return
- **最优性剪枝**：当前路径已经不可能比已知最优解好，直接 return
- **对称性剪枝**：等价的搜索分支只搜一次
- **排序后剪枝**：排序后更容易判断"后面的都不行"

---

## 6. 其他：数学/模拟/数据结构

### 6.1 数学题信号

| 题面信号 | 算法 |
|---------|------|
| "最大公约数"、"互质" | GCD（辗转相除） |
| "最小公倍数" | `a / gcd(a,b) * b` |
| "是否是质数"、"质数个数" | 试除法 / 埃筛 |
| "A^B 的结果（很大）"、"mod" | 快速幂 |
| "N 进制转换" | 除基取余法 |
| "超大数字（100位+）" | 大数模板（string） |

### 6.2 数据结构题信号

| 题面信号 | 用什么 |
|---------|--------|
| "括号匹配"、"表达式求值" | 栈 |
| "合并代价最小"、"哈夫曼" | 优先队列（小顶堆） |
| "快速查找/计数" | 哈希表（unordered_map） |
| "去重/判存在" | 哈希集合（unordered_set） |
| "构建二叉树"、"遍历" | 递归建树 |
| "查找/插入有序" | BST |

### 6.3 模拟题信号

| 题面信号 | 做法 |
|---------|------|
| "按规则一步步操作" | 照着题意写 |
| "日期计算" | 月份天数数组 + 闰年判断 |
| "枚举所有 3 位数 / 排列" | 暴力循环 |
| "字符串按规则变换" | 逐字符处理 |

---

## 7. 易混淆对比

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

---

## 8. 终极决策流程图

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

## 9. 考场实战建议

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