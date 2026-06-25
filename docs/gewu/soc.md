---
title: SoC
description: MST3319 25-26 春季，design by ai
id: soc
---
# SoC
按 ESL → Processor → Bus → Arithmetic → Memory 五块走。

:::tip 易错速查 + 中英术语对照
- **I 型 12 位立即数运算前会符号扩展到 32 位**——`andi x?, x?, 0x800` 实际是 `& 0xFFFFF800`，不是 `& 0x00000800`！！！
- **R 型移位 `sll/srl/sra` 的移位量只取 rs2 的低 5 位**（mod 32）
- **`lb/lh` 符号扩展，`lbu/lhu` 零扩展**；存储无符号/有符号之分
- **`x0` 硬连线为 0**，任何写入被忽略
- **`slt` 有符号比较，`sltu` 无符号比较**
- **AXI: `VALID` 永远不得等 `READY`**——否则死锁；但 READY 可以等 VALID
- **AXI `BVALID` 必须等到 AW 握手 + WLAST 都完成**才能拉高
- **AHB 非三态实现**：靠 MUX 选择，不是高阻 Z
- **APB 一次 transfer 只传 1 个数据**——不支持突发不支持流水线；传 N 个数据需 ≥2N 拍（vs AHB 流水线 ~N+1 拍）
- **AHB BUSY ≠ IDLE**：BUSY 是突发中"暂停 1 拍突发继续"，IDLE 是"突发结束"；不定长 INCR 终止必须先 BUSY 再 IDLE/NONSEQ
- **AHB BUSY ≠ HREADY=0**：BUSY 是 master 主动暂停（"我没数据"），HREADY=0 是 slave 主动等待（"我没处理完"）
- **WRAP 突发回环边界 = 拍数 × 每拍字节**，起始地址按边界向下取整
- **浮点指数有 bias**：相加后要 - bias（不然 bias 加了两次）
- **多核 Amdahl 含并行效率 η**：$\text{Speedup} = 1/((1-f) + f/(n\eta))$
- **CSA = 3:2 压缩器**：1 FA 延迟与 k 无关；**3A 在 radix-8 Booth 里要预计算**（不是简单移位）
- **Booth radix-$2^r$ 永远从 radix-2 一次性打包 $r$ 位**——radix-4 跳不到 radix-8（$4^m=8$ 无整数解），跳得到的是 radix-16
- **空间局部性不能仅凭 block index 序列判断**，必须知 block size 和地址映射
- **Inclusive Cache 驱逐 L2 时必须反向失效 L1**（Back Invalidation）
- 中英术语：significand=尾数 / mantissa=有效位 / denormal=次正规数 / characteristic=指数偏码
:::

## Intro
- **Moore's Law**：晶体管数量大约每 2 年翻一番
- 晶体管微缩趋势：更小，更快，更低功耗，更低成本
- AI 算力翻倍约 6 个月，远超摩尔定律
- 芯片演进：MPU/MCU → 多核+GPU → SoC: MPU+GPU+NPU → Chiplet SoC
### MPU vs. MCU vs. SoC

| 特性 | MPU | MCU | SoC |
|------|-----|-----|-----|
| 处理器核心 | 单核 | 通常单核 | 单核或多核 |
| 存储与I/O | 外接 | 内置基本块 | 更大存储、更多外设 |
| 功能模块 | 通用 | 基本控制 | GPU/DSP/NPU等 |
| OS | 可运行轻量化的 OS | 可运行 OS | 可运行 OS |
| 应用 | 通用计算 | 嵌入式 | 智能手机等高端应用 |

### SoC 特征
- 至少含一个处理器（MCU/MPU/DSP 等）
- 可编程性
- 使用第三方 IP 核
- **优势**：体积小，功耗低，性能高，可靠性高，可扩展性强
- **局限**：设计开发成本高，模块不可独立升级，复杂度高，散热难，可测性差

### Chiplet-Based SoC
- 将芯片划分为离散功能模块（discrete elements），通过标准接口（UCIe, BoW, AIB, OpenHBI, OIF XSR 等）互联
- 优势：
	- 可复用 IP（同一 Chiplet 用于不同产品）
	- 异质集成（不同工艺节点/材料/制程）
	- 可测试性（组装前独立测试，提高良率）

## ESL 设计流程
### 抽象层次
| 层次 | 含义 |
|------|------|
| Functional/behavioral level | 最高抽象 |
| RTL（寄存器传输级） | 中间抽象 |
| Gate level | 逻辑门 |
| Circuit level | 晶体管 |
| Physical level | 版图 |

- **ESL（Electronic System Level）**：涵盖一组抽象层次，足以表达 SoC 设计，满足软硬件协同设计需求
### 经典设计流程 vs. ESL 设计流程
- 经典流程：spec → HW design → HW verify → SW design → SW verify → integrate（错误后期才发现）
- ESL 流程：spec → **High-Level Model**（SW/HW partition）→ system-level design（SystemC/SystemVerilog）→ 性能仿真 → HW(Verilog) 与 SW(C/C++) 并行 → integration & verify
- ESL 的优势：早期发现优秀设计方案；软硬件并行开发；设计周期大幅缩短

### 设计方法学
- **Top Down Design**：自功能 spec 出发，逐步精化（successive refinement），软硬件并行
- **Platform Based Design（基于平台）**：针对特定领域，从构建处理平台开始
	- 使用预验证的 Firm Block 和 Hard Block
	- 缩短上市时间（Time-to-Market）
	- 通过设计复用提高生产力
	- 让设计者专注于差异化部分

### TLM（事务级建模）
- **TLM = `<{Objects}, {Compositions}>`**：通过函数调用描述系统，**计算与通信分离**
- 三种时序级别：Un-timed / Approximate-timed / Cycle-timed
- 优势：对象独立性 + 抽象独立性

### 抽象模型（六类）
| 模型 | 通信时序 | 计算时序 | 通信方式 | PE 接口 |
|------|---------|---------|---------|--------|
| A: Specification | 无 | 无 | Variable | 无 PE |
| B: Component-Assembly | 无 | 近似 | Variable channel | 抽象 |
| C: Bus-Arbitration | 近似 | 近似 | Abstract bus channel | 抽象 |
| D: Bus-Functional | 周期精确 | 近似 | Protocol bus channel | 抽象 |
| E: Cycle-Accurate Computation | 近似 | 周期精确 | Abstract bus channel | 引脚精确 |
| F: Implementation | 周期精确 | 周期精确 | Bus/Wire | 引脚精确 |

### 硬件设计流程
- 前端：HW spec → 模块设计与 IP 复用 → 顶层集成 → 布局前仿真 → 逻辑综合
- 物理设计：Floorplan → 功耗分析 → 布局与优化 → STA（静态时序分析） → 形式验证 → DFT → 时钟树综合
- 后端：布线 → 寄生参数提取 → 布局后仿真 → ECO → 物理验证

### 硬件/软件接口
- **Memory map**（统一地址空间）
- **Device driver**（连接 OS 内核与硬件）
- **Initialization, Reset, Bootloader**
- **中断服务程序, 中断向量**
- **I/O multiplexing**

## SoC 处理器
### 处理器抽象层次（从高到低）
- 应用程序 → 算法 → 编程语言 → 汇编语言 → 机器码 →
- **ISA（Instruction Set Architecture，软硬件接口）** →
- 微架构 → 逻辑门寄存器 → IC 晶体管 → 电子学物理

- **ISA**：构建微架构的手册/规范，定义数据类型、寄存器、内存管理、关键特性、指令、I/O 模型
- **微架构（Microarchitecture）**：ISA 的具体实现
### 冯·诺伊曼 vs. 哈佛
- **冯·诺伊曼（Von Neumann/普林斯顿）**：指令和数据共享同一存储；不能同时取指和取数，工作带宽受限
- **哈佛（Harvard）**：指令和数据使用独立存储；可同时取指与访存
- **几乎所有 RISC 设计采用哈佛架构**

### CISC vs. RISC

| CISC | RISC |
|------|------|
| 指令复杂数量多 | 指令简单数量少 |
| 多机器周期 | 单机器周期 |
| 变长指令 | 定长指令 |
| 流水线少 | 流水线充分 |
| 大量使用主存 | 大量使用寄存器 |
| 多种寻址模式 | 寻址模式少 |
| 侧重硬件 | 侧重软件 |
| Load/Store 之外可访存 | 仅 Load/Store 访存 |

- **三大通用 ISA**：x86/AMD64（CISC，PC/服务器）；ARM（RISC，嵌入式）；RISC-V（开源 RISC）
- **流水线（Pipeline）**：指令交叠执行，每个时钟周期启动一条新指令

### RISC-V
- 2010 起源于 UC Berkeley，2011 开源，2015 成立基金会
- **开源、简洁、灵活、可扩展**
- 基础：RV32I / RV32E / RV64I / RV64E / RV128I
- 扩展：M（乘除法）/ A（原子）/ F（单精度浮点）/ D（双精度浮点）

### RV32I 寄存器
- **32 个通用寄存器**：x0 ~ x31，每个 32 位（**1 word = 32 bit**）
- 5 位编码（rs1、rs2、rd）
- **x0/zero 硬连线为 0**（不能写入）
- **PC**：保存当前指令地址（不在 32 个 GPR 中，单独存在）
### 指令格式（RV32I 六类）

| 位域 | [31:25] | [24:20] | [19:15] | [14:12] | [11:7] | [6:0] |
|------|---------|---------|---------|---------|--------|-------|
| **R** | funct7 | rs2 | rs1 | funct3 | rd | opcode |
| **I** | imm[11:0] | --- | rs1 | funct3 | rd | opcode |
| **S** | imm[11:5] | rs2 | rs1 | funct3 | imm[4:0] | opcode |
| **B** | imm[12]\|imm[10:5] | rs2 | rs1 | funct3 | imm[4:1]\|imm[11] | opcode |
| **U** | imm[31:12] | --- | --- | --- | rd | opcode |
| **J** | imm[20]\|imm[10:1]\|imm[11]\|imm[19:12] | --- | --- | --- | rd | opcode |

- **B 立即数**：最低位恒为 0（2 字节对齐）
- **J 立即数**：最低位恒为 0
- **U 立即数**：低 12 位恒为 0（高 20 位）
- 所有立即数除 U 外都**符号扩展**

### RV32I 指令分类
- **R 型**（寄存器-寄存器）
	- 算术：`add/sub rd, rs1, rs2`
	- 逻辑：`and/or/xor rd, rs1, rs2`
	- 比较：`slt/sltu rd, rs1, rs2`（有符号/无符号，rs1&lt;rs2则置1）
	- 移位：`sll/srl/sra rd, rs1, rs2`（逻辑左/逻辑右/算术右；rs2 取低 5 位）
- **I 型算术**：`addi/andi/ori/xori/slti/sltiu rd, rs1, imm`，`slli/srli/srai rd, rs1, imm`
	- No-op：`addi x0, x0, 0`
- **I 型加载**：`lw rd, imm(rs1)`：从地址 `rs1+imm` 加载字到 rd
	- `lb/lbu/lh/lhu`：加载字节/无符号字节/半字/无符号半字（**lb/lh 符号扩展，lbu/lhu 零扩展**）
- **S 型存储**：`sw rs2, imm(rs1)`：将 rs2 存储到地址 `rs1+imm`
	- `sb/sh`：存储字节/半字
- **B 型分支**：`beq/bne/blt/bge/bltu/bgeu rs1, rs2, imm/label`
	- imm = PC_t - PC_c（**目标 PC 减当前 PC**）
- **J 型跳转**：`jal rd, imm/label`：跳转并将 PC+4 保存到 rd（默认 rd=x1 即 ra）
- **I 型跳转**：`jalr rd, imm(rs1)`：目标 = `(rs1 + sext(imm)) & 0xFFFFFFFE`
- **U 型立即数**：
	- `lui rd, imm`：rd = imm &lt;&lt; 12（**高 20 位**，低 12 位清零）
	- `auipc rd, imm`：rd = (imm &lt;&lt; 12) + PC（**PC 相对地址**）
- 加载 32 位常量：`li x5, 0xdeadbeef` ≈ `lui x5, 0xdeadb` + `addi x5, x5, 0xeef`（注意符号扩展）

### Endian（字节序）
- **Little Endian**（RISC-V 默认）：低位字节存低地址
- **Big Endian**：高位字节存低地址（网络字节序、IBM z/Architecture）
- 例：`0x12345678` 存到地址 `0x10`：
	- 小端：`addr[0x10]=0x78, [0x11]=0x56, [0x12]=0x34, [0x13]=0x12`
	- 大端：`addr[0x10]=0x12, [0x11]=0x34, [0x12]=0x56, [0x13]=0x78`

### 内存对齐
- RV32I **不强制**整数字对齐，但建议**字按 4 字节、半字按 2 字节**对齐
- 不对齐：性能下降百倍；缺乏原子性

### RV32I 易错知识点
- **I 型 12 位立即数运算前会符号扩展到 32 位**
	- 影响 `addi/andi/ori/xori/slti/sltiu`
	- 立即数最高位（第 11 位）是 1 时，扩展后高位全为 1
	- 如 `andi x2, x1, 0x800` 实际是 `x1 & 0xFFFFF800`，而非 `x1 & 0x00000800`
- **加载指令的符号/零扩展**：
	- `lb/lh`：**符号扩展**到 32 位
	- `lbu/lhu`：**零扩展**到 32 位
- **R 型移位 `sll/srl/sra` 的移位量只取 rs2 低 5 位**（mod 32）
- **`x0` 硬连线为 0**，任何写入被忽略（可作丢弃目标）
- **`slt` 是有符号比较，`sltu` 是无符号比较**
- `lw` 从地址 `rs1+imm` 读 **4 字节**，小端组装：低地址 → word 低字节

### 溢出检测（有符号加法）
有符号加法 `add rd, rs1, rs2` 的溢出条件：**rs1 和 rs2 同号，但和 rd 与它们异号**。两种等价实现思路：

- **思路 A（符号位 XOR）**：构造 `(rd⊕rs1) AND (rd⊕rs2)`，取最高位
	- 同号相加溢出时，rd 的符号位与两个操作数符号位都不同
	- 末尾用 `srli rd, rd, 31` 把符号位移到最低位作为结果

```asm
add x3,x1,x2
xor x4,x1,x3
xor x5,x2,x3
and x5,x4,x5
srli x5,x5,31
```



- **思路 B（SLT 比较）**：判断 `(rs2&lt;0) XOR (rd&lt;rs1)`
  - 直觉：加正数结果应变大（rd≥rs1）；加负数结果应变小（rd&lt;rs1）；预期与实际不一致即溢出
  - 用 `slti` + `slt` + `bne` 跳转分支即可

### CPU 性能度量
- **响应时间（Response Time）**：完成单任务时间
- **吞吐率（Throughput）**：单位时间完成的工作量
- **CPU 时间 = IC × CPI × CT** （**铁律 Iron Law**）
	- IC：指令数，由程序、ISA、编译器决定
	- CPI：每条指令周期数，由 CPU 硬件决定
	- CT = 1/F：时钟周期时间

$$MIPS = \frac{IC}{Execution\ Time \times 10^6} = \frac{Clock\ Rate}{CPI \times 10^6}$$

### Amdahl's 定律
$$T_{improved} = \frac{T_{affected}}{improvement\ factor} + T_{unaffected}$$
- **核心思想**：加速最耗时的部分
- 改进的部分加速因子越大，整体加速比受限于不能改进的部分
- **多优化叠加**：若多种优化作用于不同/部分重叠的部分，按"未加速部分 + 各加速部分/对应因子"分别累加得到新执行时间
- **多核并行 + 并行效率**：$Speedup = \frac{1}{(1-f) + f/(n \cdot \eta)}$
	- $f$：可并行比例；$n$：核数；$\eta$：并行效率（同步/通信开销造成 $\eta\lt 1$）

### Benchmark
- **SPEC（Standard Performance Evaluation Corporation, 1988）**：CPU 性能评测标准

$$SPECRatio_i = \frac{SPEC_{baseline}\ Time}{SPEC_{CPU}\ Time}, \quad GM = \sqrt[n]{\prod_i SPECRatio_i}$$

## 通信架构（总线）
### 通信设计考量
- 带宽（Bandwidth）：byte/s
- 延迟（Latency）：请求→响应延迟
- Master/Slave：谁能发起事务
- 并发性（Concurrency）：并行通道数
- 多时钟域（Multiple Clock Domains）
- ***片上通信架构消耗高达 50% 总功耗！！！***

### 通信拓扑演进
- 1990 Custom → 1995 Shared Bus → 2000 Hierarchical Bus → 2005 Bus Matrix → 2010 NoC（片上网络）

### 总线术语
- **Master（主设备）**：发起读写传输
- **Slave（从设备）**：仅响应
- **Arbiter（仲裁器）**：当多 master 竞争总线时选择
- **Decoder（译码器）**：确定传输的目标 slave
- **Bridge（桥接器）**：连接两条总线（一侧 slave，另一侧 master）

### 握手（Handshaking）
- 双方都准备就绪时数据传输
- **四周期握手**：
	1. 发送方拉高 enq（查询）
	2. 接收方准备好拉高 ack
	3. 接收方拉低 ack（数据已接收）
	4. 发送方拉低 enq

### 仲裁策略
- **集中式仲裁**：仲裁器作为独立模块，所有 master 的 request/grant 都接到它
	- **菊花链（Daisy Chain）**（PP：Arbiter 出 grant 信号，**依次经过 Master 1, 2, ..., N**；所有 master 的 request/busy 公共线连回 Arbiter
		- 优点：**简单、可扩展**
		- 缺点：**优先级与位置相关**（越近 Arbiter 优先级越高）、传播延迟长、可靠性差
	- **轮询 / 旋转优先级（Polling / Rotating Priority）**：Arbiter 内含 **Counter**，按计数轮流授权；通过 `grant_address` 广播当前授权的 master 编号
		- 优点：**不偏袒任何特定设备**、结构简单
		- 缺点：**添加新 master 困难**（要改 counter 位宽）
		- 等同英文教材的 "**Round-Robin**" 仲裁
	- **固定优先级 / 独立请求（Fixed Priority / Independent Request）**：每个 master 有独立的 grant/request 线（grant_1/request_1, ..., grant_N/request_N），按预设优先级响应
		- 优点：**响应速度快**
		- 缺点：**硬件开销高**（N 个 master 需 2N 条线）
- **分布式仲裁**：每 master 分配 4 位 ID
	- 5 条线：4 条 ID（ARB0-3，**open-collector 开漏形成 wired-OR**）+ 1 条 Start-Arbitration
	- 流程：所有 master 拉高 Start-Arb，输出 ID 到 wired-OR 总线 → 读回 ORed 值，与自身 ID 比较 → 若 bus_value > my_ID 则退出 → 最后只剩 ID 最大者
	- 优点：信号线少；缺点：硬件重复多，扩展性差
- **集中式 vs. 分布式**：
	- 集中式：新组件加入更改最小，结构清晰
	- 分布式：信号线少，但硬件重复多，扩展性差

### 总线时钟
- **同步总线**：含时钟，逻辑简单，速度快；跨频率需转换器
- **异步总线**：无时钟，需握手协议；性能低，但不受时钟偏斜影响

### 总线传输模式

| # | 模式 | 描述 | 典型场景 |
|--|------|------|------|
| 1 | **单次非流水线**（Single Non-Pipelined）| 一次仲裁完一次数据，串行 | 最简单设计 |
| 2 | **流水线**（Pipelined）| 地址阶段与数据阶段**重叠**（需 addr/data 分离）| AHB 基本模式 |
| 3 | **非流水线突发**（Non-Pipelined Burst）| 单次仲裁，多个数据连续传 | 节省仲裁时间 |
| 4 | **流水线突发**（Pipelined Burst）| 突发 + 地址数据流水线 | 降低延迟，AHB 高级 |
| 5 | **分割传输**（Split）| slave 慢时**释放总线**给他人，准备好再请求 | 慢 slave 不阻塞总线 |
| 6 | **乱序传输**（Out-of-Order）| 多事务并行处理，按 **ID 重排** | AXI 核心特性 |
| 7 | **广播传输**（Broadcast）| 数据广播到总线所有组件 | cache 一致性 snooping |

> 乱序传输：
> - "**Masters can initiate data transfers without waiting for earlier data transfers to complete**"——这就是 **outstanding transactions** 的来源
> - 需要 ID 字段标记每个事务；master 接口要能 reorder 收到的数据；slave 接口要有乱序缓冲区

### 总线拓扑
- **Shared Bus**：所有组件共享一条总线，**同一时刻只能一个事务**
- **Hierarchical Shared Bus**：分层，**不同总线并行事务**（用 Bridge 连接）
- **Full Crossbar/Matrix**：**所有 master 与 slave 之间点对点**，吞吐量极高，布线成本极高
- **Partial Crossbar**：部分互联，性能/成本折衷
- **Ring Bus**：**只跟相邻节点连接**，低成本，延迟可能长，支持并发事务

#### 4 种主流拓扑对比

| 拓扑 | 并行事务 | 布线成本 | 可扩展性 | 延迟特性 | 典型场景 |
| :- | :-: | :-: | :-: | :-: | :- |
| **Shared Bus** | 1（仅一个）| **最低** | 差 | 均匀但仲裁等待长 | 简单嵌入式系统、低速外设 |
| **Hierarchical** | 几个（每层 1 个）| 中 | 中等 | 跨层有 bridge 延迟 | 中等复杂度 SoC（AHB+APB 经典组合）|
| **Full Crossbar** | $\min(M, S)$ | **最高**（$O(MS)$）| 差（成本爆炸）| **最低**（点对点）| 高性能 CPU、GPU |
| **Ring Bus** | 多个并发 | 低 | **最好**（线性扩展）| 跨节点累加 | 大规模多核（Intel Ring on Xeon）|

**核心权衡**：
- Shared Bus：成本低 → 性能低
- Crossbar：性能高 → 成本极高
- Hierarchical：成本/性能折中（按设备速度分层）
- Ring：可扩展性最好 → 但单事务延迟可变（取决于跨多少节点）

### AMBA（ARM）总线
| 总线 | 全称 | 用途 |
|------|------|------|
| **APB** | Advanced Peripheral Bus | 低功耗外设（UART, Timer, GPIO） |
| **AHB** | Advanced High-performance Bus | 高性能（CPU, RAM, DMA） |
| **AXI** | Advanced eXtensible Interface | 接口规范，五通道，独立读写 |
| **ASB** | Advanced System Bus | 高性能（早期版本） |
| **ACE** | AXI Coherency Extensions | 多核一致性 |
| **CHI** | Coherent Hub Interface | 一致性 hub，分层架构 |

#### APB 协议
- **低成本，最低功耗**，不支持流水线、**不支持突发**
- **同步协议**，每次传输至少**两个时钟周期**（SETUP 1 拍 + ACCESS ≥1 拍）
- **每次 transfer 只传 1 个数据**（1 个字，最多 32 位）——这是跟 AHB/AXI 的根本差别
- 由 APB Bridge 发起
- **APB 信号**：

| 信号 | 描述 |
|------|------|
| PCLK | 总线时钟（上升沿触发） |
| PRESETn | 复位（低有效） |
| PADDR | 地址总线（最大 32 位） |
| PSEL_x | 每个 slave 的选择线 |
| PENABLE | 指示第二个周期 |
| PWRITE | 方向（高=写） |
| PWDATA | 写数据 |
| PREADY | slave 驱动，延长传输 |
| PRDATA | 读数据 |
| PSLVERR | 错误指示 |
| PSTRB | 写字节使能（可选） |

- **三状态机**：
	- IDLE（PSEL=0）→ SETUP（PSEL=1, PENABLE=0）→ ACCESS（PSEL=1, PENABLE=1）
	- **SETUP 只停 1 拍**（无条件转 ACCESS）
	- **ACCESS 自循环**：PREADY=0 等待；PREADY=1 完成
	- 完成后：**有后续 → SETUP**（省 1 拍）；**无后续 → IDLE**
- **ACCESS 自循环 ≠ 传多个数据！**
	- 自循环期间 **PADDR / PWDATA 必须保持不变**（协议硬性规定），还是同一个数据在等
	- 自循环 N 拍只是"slave 慢，等 N 拍才接收 1 个数据"——**不是塞了 N 个数据进去**
	- 想传多个数据 **只能发起多次独立 transfer**（这就是 APB 没有突发的本质）
	- 自循环越多 → APB 越慢（不是越快）：每个 transfer ACCESS 自循环 k 拍，每数据耗时变成 (1+k) 拍，比基础 2 拍还多
- **写传输**：Setup 设置 PADDR/PWDATA/PWRITE/PSEL → Access PENABLE=1，PREADY=1 完成
- **PSTRB**（写字节使能）：避免 read-modify-write，仅写入指定字节
	- PSTRB[n] 对应 PWDATA[8n+7:8n]
	- **只在写时有效，读时不得使用**
- **传 N 个数据的耗时**：APB 需要 **≥ 2N 拍**（每个 transfer 独立 SETUP→ACCESS）；对比 AHB 用突发只要 ~N+1 拍（流水线）
- **设计哲学**：故意做简单换低功耗，给慢速外设（UART, Timer, GPIO, Keypad）用——这些外设根本不需要带宽，只需"CPU 偶尔配置寄存器"

#### AHB 协议
- **高性能接口**：
	- 流水线操作（Pipelined）
	- 突发传输（Burst）
	- 单时钟沿
	- **非三态实现**（用 MUX 选择代替高阻态 Z，更安全更快）
	- 可配置数据/地址宽度
- **AHB 信号**：

| 信号 | 描述 |
|------|------|
| HCLK / HRESETn | 时钟 / 复位 |
| HWRITE | 方向 |
| HADDR | 地址（10-64 位） |
| HBURST[2:0] | 突发类型 |
| HMASTLOCK | 锁定序列 |
| HPROT | 保护控制 |
| HTRANS[1:0] | 传输类型 |
| HWDATA / HRDATA | 写/读数据 |
| HREADYOUT (slave) | 完成指示 |
| HREADY (mux) | 总线就绪 |
| HRESP | OKAY/ERROR |
| HSELx | slave 选择 |

- **HTRANS 四种类型**：

| HTRANS | 编码 | 控制方 | 含义 | 当前突发 |
|--------|------|------|------|------|
| IDLE | 00 | master | 总线空闲 | **结束/不存在** |
| BUSY | 01 | master | 突发中暂停一拍 | **继续** |
| NONSEQ | 10 | master | 新事务首拍 | **新开始** |
| SEQ | 11 | master | 突发后续拍 | **继续** |

- **BUSY 的作用**：master 在突发中间临时"按下暂停键"——突发不结束、不浪费仲裁，只占一拍空
  - 用途：master 内部 FIFO 暂时没数据 / 等待中断 / 临时被高优先级任务占用
  - **协议约束**：BUSY 不能作为突发首拍；slave 看到 BUSY 时不处理数据（PWDATA 无效）
- **BUSY vs IDLE 区别（极易混淆！）**：
	- BUSY：暂停 1 拍，**突发继续**——下一拍 master 可以接 SEQ 继续
	- IDLE：当前突发**直接结束**——再想传数据要重新仲裁 + 重发 NONSEQ
	- 突发中间错发 IDLE = 浪费整个已发起的突发
- **BUSY vs HREADY=0 区别（也极易混淆！）**：
	- BUSY = **master** 主动发的"我没准备好下一个数据"
	- HREADY=0 = **slave** 拒绝接收的"我没处理完当前数据"
	- 两者都让总线"等一拍"，但**控制方相反**

- **HBURST 类型**：

| HBURST[2:0] | 类型 | 描述 |
|-------------|------|------|
| 000 | SINGLE | 单次 |
| 001 | INCR | 不定长递增 |
| 010 | WRAP4 | 4拍回环 |
| 011 | INCR4 | 4拍递增 |
| 100 | WRAP8 | 8拍回环 |
| 101 | INCR8 | 8拍递增 |
| 110 | WRAP16 | 16拍回环 |
| 111 | INCR16 | 16拍递增 |

> 起始 HADDR=0x38，HSIZE=Word，4 拍突发
> - **WRAP4**：`0x38 → 0x3C → 0x30 → 0x34`（在 16 字节边界 0x30 回环）
> - **INCR4**：`0x38 → 0x3C → 0x40 → 0x44`（一路递增）

- **HRESP（响应）**：**只有 2 态**——`LOW = OKAY`, `HIGH = ERROR`（对比 AXI 的 BRESP 4 态）

- **递增 vs. 回环**：
	- INCR：地址连续递增
	- WRAP：在 **拍数 × HSIZE 字节** 边界上回环（如 4×4=16 字节边界）
- **突发终止**：
	- 定长（INCR4/WRAP*）：数到最后一拍 SEQ 自然结束
	- 不定长（INCR）：master 用 IDLE 或 NONSEQ 通知结束
	- SINGLE：下一拍 IDLE 或 NONSEQ
- **基本传输**：地址阶段（1 cycle）+ 数据阶段（可多周期；slave 拉低 HREADY 延长）
	- **地址阶段与前一个数据阶段重叠**

#### AXI 协议
- **接口规范**（非互连），支持多主多从
- **五个通道**：

| 通道 | 方向 | 用途 |
|------|------|------|
| **AW** (Write Address) | M→S | 写地址/控制 |
| **W** (Write Data) | M→S | 写数据 |
| **B** (Write Response) | S→M | 写响应 |
| **AR** (Read Address) | M→S | 读地址/控制 |
| **R** (Read Data) | S→M | 读数据+响应 |

- **每通道握手**：VALID（源端）/ READY（目的端）
	- VALID 高保持直到 READY 高
	- 时钟上升沿完成传输
- **握手依赖关系（重要）**：
	- **VALID 不得依赖 READY**（防止死锁）
	- READY 可以等待 VALID
	- BVALID 必须等待：`AWVALID && AWREADY` **且** `WVALID && WREADY && WLAST` 都已发生
	- 即：写响应需在 AW 和 W 通道握手都完成后才能发出
- **常见违反协议的设计**：
	- Master 等 AWREADY 才拉高 AWVALID（违反"VALID 不依赖 READY"）
	- Slave 仅凭 W 握手就拉高 BVALID（必须等 AW 握手 + WLAST 都完成）
	- Slave 等 BREADY 才拉高 BVALID（违反"VALID 不依赖 READY"，与 Master 等 BVALID 才给 BREADY 互锁）

##### AXI 突发地址计算
- **AWLEN / ARLEN** = 突发拍数 - 1（即 `AWLEN=0x08` 表示 9 拍）
- **AWSIZE / ARSIZE** = 每拍字节数的 $\log_2$（即 `AWSIZE=0x2` 表示每拍 $2^2=4$ 字节）
- **INCR**：每拍地址 += $2^{AWSIZE}$，地址连续递增
- **WRAP**：地址在 `拍数 × 字节数` 边界处回环
	- 回环下界 = $\lfloor \text{StartAddr} / B \rfloor \cdot B$，其中 $B = 拍数 \times 2^{AxSIZE}$
	- 即：起始地址按边界向下取整作为回环起点
- **WLAST**：在突发最后一拍（第 `AWLEN+1` 拍）拉高

##### AXI 乱序与 ID
- 支持交错乱序事务、读写并发、快 slave 先返回
- 整个突发只需 **一个地址**
- 多 master 用相同 ARID 访问 S0 → interconnect 内 **Crossbar 进行 ID 转换**（如把 ARID 前缀加上 master ID）避免冲突；返回时再剥离 ID 路由回原 master

## 算术电路
### 加法 vs. 乘法的加速分工
- **加法**：缩短**进位传播链**（lookahead / skip / select）
- **乘法**：缩短**部分积累加**关键路径（high-radix / tree）
- 减法 = 取反 + 加法；除法 = 倒数 + 乘法

### CPA 与 CSA 两条赛道
- 加法器有**两类完全不同的任务**，分属两条赛道——**不能互相替代，只能流水接力**：

| 赛道 | **CPA**（Carry-**Propagate** Adder）| **CSA**（Carry-**Save** Adder）|
| :- | :- | :- |
| 任务 | **两数相加 → 一个数** | **多数相加**的中间压缩 |
| 输入 → 输出 | 2 个 $n$ 位 → **1 个 $n+1$ 位** | 3 个 $n$ 位 → **2 个 $n+1$ 位**（sum + carry）|
| 进位处理 | **真正传播解决** | **暂存不解决**（甩给左邻列）|
| 实例 | RCA / CLA / Carry-Skip / Carry-Select | $k$ 个 FA 一字排开（"3:2 压缩器"）|
| 延迟 | $O(n) \sim O(\log n)$ | **$O(1)$**（与位宽无关）|
| 典型用途 | 算最终结果（末端用）| 压缩点阵 / 多数累加（中间用）|

- **流水关系**：乘法器 / 多数累加器里 **CSA 在前压缩 → CPA 在末端收尾**：

```
n 个数 ──→ [CSA 树 (并行压缩)] ──→ 2 个数 ──→ [CPA (最终加)] ──→ 1 个答案
            快、每层 1 FA 延迟                慢但只付 1 次
```

- **CSA 不是 CPA 的替代品**：CSA 输出的"sum + carry 两个向量"**还没解决进位**——必须再用 CPA 算 $S + C'$ 才能拿到最终单一答案。
- **CPA 是"任何能输出最终和的加法器"的统称**——RCA / CLA / Carry-Skip / Carry-Select 是 CPA 的四种不同实现，**都属同一赛道**。

### CPA（Carry-Propagate Adder）—— 两数相加的四种实现
所有 CPA 的目标：算 $A + B$（$n$ 位）→ 输出 $S$（$n+1$ 位含 cout）。**所有 CPA 的根本瓶颈都是进位链**——不同实现就是不同的"绕过进位串行依赖"的方法。

#### RCA（Ripple-Carry Adder，行波进位加法器）—— 朴素
- **结构**：$n$ 个 FA 串成一根线，每个 FA 的 $c_{out}$ 直接喂下一位的 $c_{in}$

```
位:    0      1      2          n-1
A,B → FA0 → FA1 → FA2 → ... → FA_{n-1} → cout
       │     │     │              │
      s₀    s₁    s₂            s_{n-1}
       └──── 每个 FA 必须等左边 FA 的 carry ────┘
```

- **延迟分析**：进位逐位"纹波"从 LSB 串到 MSB → $T_{\text{RCA}} = n \cdot T_{FA}$ → $\boxed{O(n)}$ 线性
- **面积**：最小（$n$ 个 FA、零额外逻辑）
- **特点**：硬件最简单、布线规则、功耗低；缺点是位宽大时延迟不可接受
- **典型应用**：FPGA（专用 carry chain 硬件加速 RCA）、低速教学/嵌入式电路

#### CLA（Carry-Lookahead Adder，超前进位加法器）—— 并行解 carry
- **核心思想**：不等纹波——**用并行逻辑提前算出每位 carry**，再让所有 FA 一起算 sum
- **两个原子定义**（每一位独立可算，仅依赖 $a_i, b_i$）：

$$
\boxed{g_i = a_i \cdot b_i} \quad (\text{generate，本位"生成"carry}),\qquad
\boxed{p_i = a_i + b_i} \quad (\text{propagate，本位"传播"carry})
$$

- **直觉**：$g_i=1$ 不管前面给什么 carry 都会输出 1；$p_i=1$ 把前面来的 carry 原样传过去
- **进位递推公式**：

$$
c_{i+1} = g_i + p_i \cdot c_i
$$

- **关键操作**：把递推**完全展开**，每位 carry 直接用 $\{g_*, p_*, c_0\}$ 表达——**不依赖前一位的输出**：

$$
\begin{aligned}
c_1 &= g_0 + p_0 \cdot c_0 \\
c_2 &= g_1 + p_1 g_0 + p_1 p_0 \cdot c_0 \\
c_3 &= g_2 + p_2 g_1 + p_2 p_1 g_0 + p_2 p_1 p_0 \cdot c_0 \\
c_4 &= g_3 + p_3 g_2 + p_3 p_2 g_1 + p_3 p_2 p_1 g_0 + p_3 p_2 p_1 p_0 \cdot c_0 \\
&\vdots
\end{aligned}
$$

- **关键路径**：① lookahead 逻辑并行解所有 $c_i$ → ② 所有 FA 并行算 sum → $\boxed{O(1)}$ 单级 CLA、**与位宽无关**
- **代价**：lookahead 硬件按位宽 $O(n^2)$ 爆炸——32 位以上必须**分级 CLA**
- **分级 CLA**：先 4 位一组算 group $G, P$，再 group 之间再来一层 lookahead，递归套娃 → 实际延迟 $O(\log n)$、面积 $O(n \log n)$
- **典型应用**：高性能 CPU 主 ALU、ASIC 浮点单元

#### Carry-Skip Adder（跳过进位加法器）—— 块全 propagate 就跳
- **核心思想**：把 $n$ 位分成几个**块**（block）。如果一整个块**所有位 propagate=1**，则进位**整体跳过**该块
- **块级 propagate 信号**：$P_{\text{block}} = p_{i+k-1} \cdot p_{i+k-2} \cdots p_i$（块内所有位都 propagate=1 才有效）
- **直觉**：块内全 propagate → 进位从右进什么样、从左出就什么样——**完全不需要在块内传播**
- **结构**（每块内部仍是 RCA，外加一个 skip MUX）：

```
                       cin_block
                          │
              ┌───────────┼──────┐
              │           │      │
              ▼           │      │
块 j：[FA FA ... FA]      │      │
              │           │      │
        块内 carry        │      │
              │           │      │
              ▼           ▼      │
              0 ─────→ MUX ◀── 1 ─┘
                        │      ↑
                        │   P_block (skip 信号)
                        ▼
                    cout_block
```

- **MUX 选择**：
	- $P_{\text{block}} = 0$ → MUX 选块内 RCA 算出来的真 carry（不跳过）
	- $P_{\text{block}} = 1$ → MUX 选 $c_{in,\text{block}}$ 直送（**跳过整个块**）
- **最坏路径**：第 1 块**生成** carry（必须算完块内 RCA）→ 中间所有块**全跳过**（每块 1 个 MUX 延迟）→ 最后块**吸收 carry 并传播**（块内 RCA）
- **渐近**：块数与块大小都取 $\sqrt{n}$ 时最优 → $\boxed{O(\sqrt{n})}$
- **面积**：略大于 RCA（每块多一个 AND 树检测 $P_{\text{block}}$ + 一个 MUX）
- **典型应用**：中等位宽、面积敏感的折中设计

#### Carry-Select Adder（选择进位加法器）—— 用面积换速度
- **核心思想**：高位块**同时算两份**——一份假设 $c_{in}=0$、一份假设 $c_{in}=1$。等低位真正的 $c_{in}$ 算出来，**用 MUX 选其中一份**
- **直觉**：高位块本来要**等**低位算完才能开工（串行）。**先把两种可能性都算出来**，等 cin 到了**只花一个 MUX 延迟选答案**——把"等"换成"算"
- **结构**：

```
                                     cin = 0（假设值）
                                       │
                                       ▼
低位块  ───→ RCA_low ────────────→ sum_low
              │                  真 carry
              │                     │
              │                     ▼ MUX 控制端
高位块  ───→ RCA_high (cin=0) ─┐
              │                ├──→ MUX ──→ sum_high
高位块  ───→ RCA_high (cin=1) ─┘
              ↑
       这两个 RCA 与低位 RCA 同时启动、并行计算
```

- **关键路径**：高位双 RCA 和低位 RCA **并行算** → 由较长一侧决定 + 一次 MUX 延迟

$$
T_{\text{Select}} = \max(T_{\text{RCA low}}, T_{\text{RCA high}}) + T_{\text{MUX}}
$$

- **渐近**：块数取 $\sqrt{n}$ 时最优 → $\boxed{O(\sqrt{n})}$
- **面积**：约 RCA 的 2 倍（高位块算两份；可级联多块时按 $\sqrt{n}$ 块设计）
- **变体**：**Carry-Increment Adder**——只算一份 cin=0，cin=1 时用专门的"+1 电路"修正，进一步省面积
- **典型应用**：ASIC 折中设计，常出现在大位宽 ALU 的高位段

#### 四种 CPA 速查表

| CPA | 渐近延迟 | 面积代价 | 思路 |
| :-: | :-: | :-: | :- |
| **RCA** | $O(n)$ | 最小 | 串行纹波 |
| **CLA** | $O(\log n)$（多级）| **大**（lookahead 硬件 $O(n \log n)$）| **并行**解所有 carry |
| **Carry-Skip** | $O(\sqrt{n})$ | 中（每块 1 MUX）| 块全 propagate 就跳过 |
| **Carry-Select** | $O(\sqrt{n})$ | 中（高位块算两份）| 高位猜两种 cin 都先算 |

- **记忆口诀**："**朴素**穿、**前瞻**算、**跳过**省、**选择**猜"
- **选型经验**：
	- 教学 / 简单嵌入式 → RCA
	- 高性能 CPU → 分级 CLA
	- FPGA → RCA（专用 carry chain 已硬件加速）
	- ASIC 折中 → Carry-Skip / Carry-Select

### 乘法基础
- 无符号：$P = A \times B = \sum_i \sum_j a_i b_j \cdot 2^{i+j}$
- 有符号补码（二进制补码）：
$$P = a_{n-1} b_{n-1} \cdot 2^{2n-2} - 2^{n-1}\sum_i a_i b_{n-1} \cdot 2^i - 2^{n-1}\sum_j a_{n-1} b_j \cdot 2^j + \sum_i \sum_j a_i b_j \cdot 2^{i+j}$$
- **n 位 × n 位 = 2n 位结果**
- 每个 $a_i b_j$ 是 1 个 **AND 门**输出，称为 **部分积位**（partial product bit）
- 部分积向量：$pp_j = b_j \cdot A \cdot 2^j$（手算竖式中的一行）

### 多操作数加法
- **RCA Tree**：用 RCA 构成树形累加，每级位宽递增 k → k+1 → k+2 → k+3
	- 延迟：$O(k + \log_2 n)$（最低位流水到根节点 $\log_2 n$ + 根节点纹波 $k$）
	- 直觉：上层算高位时下层早开始算低位 → "+k" 只付一次

### CSA（Carry-Save Adder，进位保存加法器）
- **核心思想**：剪断进位链 → 所有 FA 并行 → 延迟 $O(1)$
- **3:2 压缩器**：3 个 k 位数进，2 个数出（sum k 位 + carry k+1 位，左移 1 位）
	- $S + C' = A + B + C$
- 内部：k 个 FA 一字排开，**互不相连**
- 用法：CSA 串成树压缩 n 行点阵 → 最后用 1 次 CPA 解决进位
- **CSA 树延迟**：每层 1 FA × $\log_{3/2} n$ + 末端 CPA $O(k)$
- 提醒：CSA 输出的"sum + carry 两组数"还没解决进位 → **不能当 CPA 用**（如算 3A 必须用 CPA，不能用 CSA）。详细对比见上面"加法器全景"对照表。

### 阵列乘法器
- 基于单侧 CSA 树（one-side CSA tree）
- 部分积按行依次累加
- 最后用 RCA 得最终结果
- 结构**规则**（regular），布局友好
- **关键路径**沿阵列**对角线**传播
- **MAC（Multiply-Accumulate）**：$M = A \cdot B + C$，基于单侧 CSA 树

### Wallace Tree / Dadda Tree
- 把部分积点阵压缩到 2 行，最后一次 CPA
- **● = 1 个比特待加数**；FA 把同列 3 点变 1 点（carry 跑左邻列），HA 把同列 2 点变 1 点
- **Wallace**（贪婪）：能压就压，组成不规则但快
- **Dadda**（懒惰）：只压到下一档目标就停
- 4×4 Wallace：5 FA + 3 HA + 4-bit Adder；关键路径 2 FA + 4-bit Adder
- 4×4 Dadda：3 FA + 3 HA + 6-bit Adder；关键路径 1 HA + 1 FA + 6-bit Adder
- CSA 树**不规则**，给布局带来困难

### Booth 编码

#### 核心动机：连续 1 串恒等式
- $\underbrace{2^k + 2^{k-1} + \ldots + 2^j}_{(k-j+1) \text{ 个连续 1}} = 2^{k+1} - 2^j$
- 一段连续 1 = 上面位的 1 减下面位的 1 → **$n$ 次加法变 1 加 1 减**
- 例：$01110_2 = 2^4 - 2^1 = 14$（本来 3 次加法）

#### Radix-2 Booth
- 公式：$d_j = -b_j + b_{j-1}$（$b_{-1} \triangleq 0$），$d_j \in \{-1, 0, +1\}$
- $B = \sum_j d_j \cdot 2^j$
- **代数验证**：把 $-b_j$ 项和 $b_{j-1}$ 项分开；第二项换元 $k=j-1$ 后等于 $2 \sum_{k=0}^{n-2} b_k 2^k$；合并后正好等于补码定义 $B = -b_{n-1} \cdot 2^{n-1} + \sum_{k=0}^{n-2} b_k 2^k$ ✓

| $b_j$ | $b_{j-1}$ | $d_j$ | 含义 |
|-------|-----------|-------|------|
| 0 | 0 | 0 | 串外 |
| 0 | 1 | +1 | 1 串末尾 |
| 1 | 0 | -1 | 1 串开始 |
| 1 | 1 | 0 | 1 串延续 |

#### Radix-4 Booth（Modified Booth, MacSorley 61）
- **一次处理 2 位**，循环减半（n/2 行部分积）
- 公式：$D_j = -2 b_{j+1} + b_j + b_{j-1}$（$j$ 取 0, 2, 4, ...）
- $D_j \in \{-2, -1, 0, +1, +2\}$ → 操作 $\{-2A, -A, 0, +A, +2A\}$
- **均为 A 的简单移位 + 选择性取反**，无 3A 麻烦

| $b_{j+1}$ | $b_j$ | $b_{j-1}$ | $D_j$ | 含义 |
|-----------|-------|-----------|-------|------|
| 0 | 0 | 0 | 0 | 串外 |
| 0 | 0 | 1 | +1 | 串末尾 |
| 0 | 1 | 0 | +1 | 孤立 1 |
| 0 | 1 | 1 | +2 | 串末尾 |
| 1 | 0 | 0 | -2 | 串开始 |
| 1 | 0 | 1 | -1 | 一串结束 + 新串开始 |
| 1 | 1 | 0 | -1 | 串开始 |
| 1 | 1 | 1 | 0 | 串延续 |

##### 从 radix-2 推 radix-4（"打包"）
- 按 $j$ 偶/奇分组，利用 $2^{2k+1} = 2 \cdot 4^k$：
$$B = \sum_k (d_{2k} + 2 d_{2k+1}) \cdot 4^k = \sum_k D_k \cdot 4^k$$
	即 $D_k = d_{2k} + 2 d_{2k+1}$（相邻 2 位 radix-2 按权 $1, 2$ 合并）
- 代入 $d_j = -b_j + b_{j-1}$，合并同类项：
	- $b_{2k+1}$ 系数：$-2$
	- $b_{2k}$ 系数：$-1 + 2 = +1$
	- $b_{2k-1}$ 系数：$+1$
- 令 $j = 2k$ → $D_j = -2 b_{j+1} + b_j + b_{j-1}$ ✓

#### Radix-8 Booth
- 一次处理 3 位，4 行（8 位 × 8 位）部分积
- 公式：$D_j = -4 b_{j+2} + 2 b_{j+1} + b_j + b_{j-1}$（$j$ 取 0, 3, 6, ...）
- $D_j \in \{-4, -3, -2, -1, 0, +1, +2, +3, +4\}$
- ***3A 不是简单移位，必须预计算 $3A = 2A + A$（增加一个 CPA 延迟）！！！***——这是 radix-8 实际产品较少的原因

| 位组 $b_{j+2}b_{j+1}b_jb_{j-1}$ | $D_j$ | 位组 $b_{j+2}b_{j+1}b_jb_{j-1}$ | $D_j$ |
|---|---|---|---|
| 0 0 0 0 | 0 | 1 0 0 0 | -4 |
| 0 0 0 1 | +1 | 1 0 0 1 | -3 |
| 0 0 1 0 | +1 | 1 0 1 0 | -3 |
| 0 0 1 1 | +2 | 1 0 1 1 | -2 |
| 0 1 0 0 | +2 | 1 1 0 0 | -2 |
| 0 1 0 1 | +3 | 1 1 0 1 | -1 |
| 0 1 1 0 | +3 | 1 1 1 0 | -1 |
| 0 1 1 1 | +4 | 1 1 1 1 | 0 |

#### 一般化：radix-$2^r$
- 从 radix-2 一次性打包 $r$ 位：
$$D_j = -2^{r-1} b_{j+r-1} + \ldots + 2 b_{j+1} + b_j + b_{j-1}$$
- 扫描窗口 $r+1$ 位，步进 $r$ 位
- 取值范围 $\{-2^{r-1}, \ldots, +2^{r-1}\}$
- 部分积行数 $\lceil n/r \rceil$

#### 位权基础：为什么打包 r 位 radix-2 = radix-$2^r$
- **位权** = 某位代表的数量级。$1011_2 = 1 \cdot 8 + 0 \cdot 4 + 1 \cdot 2 + 1 = 11$
- **打包** = 把若干位按各自位权加起来当成一个新数字
- 演示 $B = 1011_2 = 11$ 按 2 位一组打包：
	- 低组 $(d_1, d_0) = (1, 1)$，值 $= D_0 = 2 \cdot 1 + 1 = 3 \in \{0..3\}$ ← 正是 radix-4 一位的取值
	- 高组 $(d_3, d_2) = (1, 0)$，值 $= (2 \cdot 1 + 0) \cdot 4 = D_1 \cdot 4^1$，$D_1 = 2$
	- 合并：$D_0 \cdot 4^0 + D_1 \cdot 4^1 = 3 + 8 = 11$ → $11_{10} = 1011_2 = 23_4$ ✓
- **核心规律：新进制 = 出发进制 ^ 打包位数**（组合数 = $2^r$ 种 → 进制必然是 $2^r$）

| 打包 r 位 radix-2 | 组合数 | 新进制 |
| :-: | :-: | :-: |
| 2 | $2^2 = 4$ | radix-4 |
| 3 | $2^3 = 8$ | radix-8 |
| 4 | $2^4 = 16$ | radix-16 |

#### ***常见误区：radix-4 不能"再打包"到 radix-8！！！***
- $4^m = 8$ 要求 $m = 1.5$，**无整数解** → radix-4 跳不到 radix-8
- 从 radix-4 打包 2 位得到的是 **radix-16**（$4^2 = 16$），**不是 radix-8**
- 要 radix-8 必须**回到 radix-2，一次性打包 3 位**
- 错误尝试副作用：硬把 radix-4 公式对所有 $j$（含奇 $j$）求和会得到 $2B$ 而非 $B$；中间位 $b_{2k+1}$ 系数 $-2 + 2 = 0$ 被消掉
- **经验法则**：radix-$2^r$ **永远**从 radix-2 出发，一次性打包 $r$ 位

### Baugh-Wooley 算法
- 将有符号乘法中的**负部分积项转化为正项**便于硬件
- 关键变换：
$$-2^{n-1} \sum_i a_i b_{n-1} \cdot 2^i = 2^{n-1} \cdot b_{n-1} \cdot (1, \overline{a_{n-2}}, \ldots, \overline{a_0} + 1)_2$$
- **改进版**：在适当位置加常数 1，部分积全部正值
- 用法：n 位有符号阵列乘法器

### 4:2 压缩器
- 4 个同权重比特 + 1 cin → 1 sum + 1 carry + 1 cout
- 由 2 级 FA 级联（或更快的 MUX 实现）
- 优势：每级 **×1/2**，形成漂亮二叉树，层数 $\log_2 n$ 比 Wallace 的 $\log_{3/2} n$ 少 41%
- **cout 不依赖 cin**：横向接力不形成长进位链
- 适合规则布局

#### 内部结构（2 个 FA 级联）

满足：$a + b + c + d + c_{in} = \text{sum} + 2(\text{carry} + c_{out})$

**FA 分工**：
- **FA1**：吃 $a, b, c$（**不含 cin**！）→ 输出 sum1（给 FA2）+ **cout**
- **FA2**：吃 sum1, $d$, **cin** → 输出 **sum + carry**

公式：

$$
c_{out} = ab + bc + ac \quad \text{（FA1 的 carry，独立于 cin）}
$$

#### 3 个输出的去向（最容易混淆！）

| 输出 | 位权 | 去向 | 方向 |
| :-: | :-: | :- | :- |
| **sum** | $2^k$ | **本列**下一层 | 垂直 |
| **carry** | $2^{k+1}$ | **左邻列**下一层 | 垂直 + 错位 1 位 |
| **cout** | $2^{k+1}$ | **左邻列同一层**（作为别人的 cin！）| **水平** |

**关键**：carry 和 cout 都去左邻列、位权相同，但**层级不同**——carry 进入下一层（往下），cout 留本层（往左横向走）。

#### 为什么 cout 不依赖 cin 至关重要

水平方向：列 $j$ 的 cout → 列 $j+1$ 的 cin。

**如果 cout 依赖 cin**（像普通加法器）：同层 N 个 4:2 横向接力 = N 个 FA 延迟（纹波链）—— $O(n)$，慢到不可用。

**4:2 设计让 cout 只依赖 $a, b, c$**：所有列的 cout **并行计算**，横向不纹波。

**4:2 总延迟**：
- FA1（算 cout，不等 cin）：1 FA 延迟
- FA2（等 cin）：1 FA 延迟
- 总 **2 FA 延迟**（独立于位宽）
- MUX 优化后约 **1.5 FA**（提前算 FA2 两种情况，cin 到了用 MUX 选——同 Carry-Select 思路）

### 浮点表示
- $x = \pm M \times b^E$，IEEE 754：$x = (-1)^S \times 2^{E_v} \times 1.M$
- $E = E_v + \text{bias}$，$\text{bias} = 2^{e-1} - 1$
- **隐藏的前导 1**（规格化数）

| 格式 | 字宽 | 指数 e | 尾数 m | bias |
|------|-----|--------|--------|------|
| Half | 16 | 5 | 10 | 15 |
| Single | 32 | 8 | 23 | 127 |
| Double | 64 | 11 | 52 | 1023 |
| Long Double | 128 | 15 | 112 | 16383 |

#### 位排布：S → E → M（高位 → 低位）

**统一规则**：最高位是 S（1 位）→ 接下来 e 位是 E → 剩下 m 位是 M（最低位）

| 格式 | S 位 | E 位范围 | M 位范围 |
| :- | :-: | :-: | :-: |
| Half (16) | bit 15 | bit 14-10 | bit 9-0 |
| **Single (32)** | **bit 31** | **bit 30-23** | **bit 22-0** |
| Double (64) | bit 63 | bit 62-52 | bit 51-0 |
| Long Double (128) | bit 127 | bit 126-112 | bit 111-0 |

> **十六进制解码套路**（如 `0xC2980000` 单精度）：
> 1. 写成 32 位二进制：`1100 0010 1001 1000 0000 0000 0000 0000`
> 2. **第 1 位** = S = `1`（负数）
> 3. **接下来 8 位** = E = `10000101` = 133 → $E_v = 133 - 127 = 6$
> 4. **剩下 23 位** = M = `00110000...` → 尾数 = $1.M = 1.0011 = 1.1875$
> 5. 值 = $(-1)^1 \times 1.1875 \times 2^6 = -76$

### IEEE 特殊值

|  | $M = 0$ | $M \neq 0$ |
|--|---------|------------|
| $E = 0$ | $\pm 0$ | **Denormal** |
| $E = 2^e - 1$ | $\pm\infty$ | **NaN** |

- **Denormal（次正规数）**：隐藏位为 0；缩小最小可表示数与 0 的间隔（但不能消除下溢）
- **NaN**：负数开方、0/0 等；NaN 在所有运算中"安全"传播
- **$\pm\infty$**：$X+\infty=\infty$，$X/\infty=0$

### 浮点加法步骤
1. **对齐**（Alignment）：小指数数尾数右移直到指数相等
2. **尾数加/减**
3. **规格化**：右移（增指数）或左移（减指数）
4. **舍入**
5. **再规格化**
- 同号 → 可能右移 1 位；异号 → 可能左移多位
- 尾数加法结果范围 $[0, 4)$：$[0,1)$ 任意左移；$[1,2)$ 不动；$[2,4)$ 右移 1 位

#### 为什么同号最多右移 1 位 / 异号可能左移多位

**核心前提**：规格化尾数 $1.M$ 永远在 $[1, 2)$ 范围（隐藏前导 1 + 小数 &lt; 1）。

**同号** = 底层做加法（$|x|+|y|$，数变大）：
- 两个 $1.M_x + 1.M_y \in [1+1, 2+2) = [2, 4)$
- 超出 $[1, 2)$ 上限**最多 1 倍**（不可能 > 4）→ **右移 1 位**就回 $[1, 2)$，指数 +1
- 例：$1.5 + 1.5 = 3.0 \in [2,4)$ → 右移 1 位 = 1.5，指数 +1 → $1.5 \times 2^1 = 3.0$ ✓

**异号** = 底层做减法（$|x|-|y|$，数变小）：
- 两个 $1.M_{\text{大}} - 1.M_{\text{小}} \in [0, 1)$
- 结果**前导可能多个 0**——0 越多需要左移越多位
- 极端情况：两数几乎相等 → 差几乎 0 → **左移可达 20+ 位**（看尾数位数）
- 例：差 = `0.0001₂` → 左移 4 位变 1.0，指数 -4
- 例：差 = $2^{-20}$ → 左移 20 位，指数 -20

#### 灾难性抵消（Catastrophic Cancellation）

异号减法的可怕之处：**两个几乎相等的数相减**，原本 23 位精度可能瞬间只剩几位有效信息。

```
x = 1.00000000000000000001 × 2^0
y = 1.00000000000000000000 × 2^0  (异号取反)
x + y = 0.00000000000000000001 × 2^0
                              ↑ 前 20 个 0 全是抵消产生的，无信息
规格化：左移 20 位 → 1.0 × 2^(-20)
```

只剩**最低 1 位**有效——这是浮点数减法的**根本风险**，写数值算法要警惕。

#### 同号 vs 异号 对照表

| | 同号 | 异号 |
| :-: | :-: | :-: |
| 底层操作 | 加法 | 减法 |
| 尾数和范围 | $[2, 4)$ | $[0, 1)$ |
| 修复方向 | 右移 | 左移 |
| 移位幅度 | **最多 1 位**（固定）| **可能很多位**（可变）|
| 硬件 | 1 位右移器（简单）| Priority encoder + Barrel shifter（复杂）|
| 精度风险 | 无 | 灾难性抵消 |

### 浮点乘法步骤
1. **指数相加**
2. **尾数相乘**
3. **规格化**
4. **舍入**
5. **再规格化**
6. **符号处理**（XOR）
- 公式：$x \times y = (-1)^{S_x \oplus S_y} \cdot 2^{E_x + E_y - 2 \cdot bias} \cdot (1.M_x \times 1.M_y)$
- 尾数乘积范围 $[1, 4)$：可能右移 1 位
- **指数注意**：相加后要 - bias（因为两个都加了 bias，多了一倍）

### IEEE 舍入模式（4 种）
- **Round-to-nearest-even**（就近舍入到偶数，默认）
- **Round toward zero**（截断/truncate）
- **Round toward $+\infty$**
- **Round toward $-\infty$**
- ulp = unit in the last place（最低有效位单位）

### 浮点异常
- 除零
- 上溢（Overflow）
- 下溢（Underflow）
- 无效运算（→ NaN）：$\infty - \infty$, $0 \times \infty$, $0/0$, $\infty/\infty$, $\sqrt{\lt 0}$

## 存储层次结构
### Memory Wall（存储墙）
- 处理器年增长 ~52%，存储器年增长仅 ~7%
- 处理器在 1 次 DRAM 访问的时间内可执行 **1000+ 条指令**

### 存储层次（金字塔）

| 层级 | 技术 | 延迟 | 容量 |
|------|------|------|------|
| Registers | 触发器 | 1 周期 | ~1 KB |
| L1 Cache | SRAM | 2-4 周期 | 2-64 KB |
| L2 Cache | SRAM | 10 周期 | ~1 MB |
| L3 Cache | SRAM/eDRAM | 40 周期 | ~10 MB |
| Main Memory | DRAM | 200 周期 | ~10 GB |
| Flash (SSD) | Flash/PCM/MRAM/ReRAM | 10-100 μs | ~100 GB |
| HDD | NAND/Magnetic | 10 ms | ~1 TB |

- 从上到下：速度↓ 成本↓

### 局部性原理（Locality）
- **时间局部性（Temporal）**：刚访问的数据很快会再访问（循环指令、栈变量）
- **空间局部性（Spatial）**：刚访问的数据附近的也会被访问（顺序指令、数组）

### Split I/D Cache
- L1 分离：**I-Cache**（控制单元取指）+ **D-Cache**（数据通路 Load/Store）
- L2、L3 通常是**统一缓存**

### Cache 性能
- **HR**（Hit Ratio）= 命中数 / 总访问 = 1 - MR
- **MR**（Miss Ratio）= 缺失数 / 总访问
- **AMAT**（Average Memory Access Time）= HitTime + MR × MissPenalty

### Cache 包含策略
- **Inclusive（包含）**：L2 含 L1 全部
	- L1 装入 → L2 也装入（同时）
	- L2 驱逐 → 必须**反向失效（Back Invalidation）**L1 中对应条目
- **Exclusive（排他）**：各级互不重复
	- L1 装入 → L2 **不装**
	- L1 驱逐 → 降级到 L2
	- 优势：最大化有效缓存容量
- **NINE（Non-Inclusive Non-Exclusive，非包含非排他）**：不强制
	- L1 装入 → L2 也装入
	- L2 驱逐 → **不**反向失效 L1

### Cache 替换算法
- **LRU**（Least Recently Used）：驱逐最久未访问
	- 实现：维护访问顺序队列，每次命中把对应块移到队尾（最新），驱逐时取队首（最旧）
- **LFU**（Least Frequently Used）：驱逐访问频次最低
- **FIFO**：按进入顺序，先进先出
- **RR**（Random Replacement）：随机驱逐，硬件开销最低

### 多级 Cache 性能计算
- **L1 Miss Penalty** = L2 Hit Time + L2 Miss Rate × Main Memory Penalty
- **每指令的 stall 周期**：
	- I-Cache Stall = (每指令取指次数) × L1 I-MissRate × L1 MissPenalty
	- D-Cache Stall = (load/store 指令占比) × L1 D-MissRate × L1 MissPenalty
- **Effective CPI = Base CPI + I-Stall + D-Stall**
- **inclusive vs exclusive 对 miss rate 的定性影响**：
	- exclusive 减少 L1/L2 重复存储 → 有效容量更大 → miss rate 可能更低
	- 但 L1/L2 间数据交换管理逻辑更复杂，可能带来额外开销

### 局部性分析注意点
- **时间局部性**：同一 block 在短时间内重复访问 → 体现于命中
- **空间局部性**：仅凭 block 编号序列**不能**判断，必须知道 block size 和地址映射

## 期末考试要点速查
### 易混点速记
| 概念 | 区别 |
|------|------|
| MPU vs MCU vs SoC | 复杂度递增；MCU 含基本外设，SoC 集成度最高 |
| 冯·诺伊曼 vs 哈佛 | 指令/数据空间分离与否 |
| CISC vs RISC | 指令复杂度、定长/变长、寻址模式 |
| APB vs AHB vs AXI | APB 简单低功耗 / AHB 流水线突发 / AXI 五通道独立读写 |
| Inclusive vs Exclusive | 外层是否包含内层数据 |
| LUI vs AUIPC | LUI 直接构造 / AUIPC 加 PC 构造 PC 相对地址 |
| jal vs jalr | jal 是 J 型相对跳转 / jalr 是 I 型寄存器+立即数跳转 |
| beq 与 bne 选择 | 看判断条件取反或不取反 |
| INCR vs WRAP | INCR 一直递增 / WRAP 在边界回环 |
| Wallace vs Dadda | Wallace 贪婪压（少 Adder 多 HA/FA）/ Dadda 懒压（多 Adder 少 HA/FA） |
| 3:2 vs 4:2 压缩器 | 3:2=CSA=1 FA，每层 ×2/3；4:2=2 级 FA，每层 ×1/2，二叉树规则 |
| LRU vs LFU vs FIFO | 时间 / 频次 / 顺序 |

### 关键公式速查
- 性能铁律：$\text{CPU Time} = IC \times CPI \times CT$
- 存储平均时延：$\text{AMAT} = \text{HitTime} + MR \cdot \text{MissPenalty}$
- Amdahl 单加速：$\text{Speedup} = 1/((1-f) + f/k)$
- Amdahl + 并行效率：$\text{Speedup} = 1/((1-f) + f/(n\eta))$
- RCA 树延迟：$O(k + \log_2 n)$；CSA 树延迟：$O(\log_{3/2} n + k)$
- IEEE 754：$\text{bias} = 2^{e-1}-1$；规格化最小 $= 2^{1-\text{bias}}$；denormal 最小 $= 2^{1-\text{bias}-m}$
- AXI：拍数 $= \text{AxLEN}+1$；每拍字节 $= 2^{\text{AxSIZE}}$；WRAP 边界 $=$ 拍数 $\times$ 每拍字节
- Booth radix-r 公式：$d_j = -2^{r-1} b_{j+r-1} + \ldots + 2 b_{j+1} + b_j + b_{j-1}$
