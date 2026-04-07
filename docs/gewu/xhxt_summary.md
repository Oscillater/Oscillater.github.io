---
title: 信号与系统知识点总结
id: xhxt_summary
---
## 信号的描述与分类
###### 能量与平均功率
连续时间信号 $x(t)$ 的能量 
$E_{\infty} \triangleq \lim_{T \to \infty} \int_{-T}^{T} |x(t)|^2 dt=\int ^{+\infty}_{-\infty} \mid x(t)\mid^2\, dt  $
连续时间信号 $x(t)$ 的平均功率
$ P_{\infty} \triangleq \lim_{T \to \infty} \frac{1}{2T} \int_{-T}^{T} |x(t)|^2 dt $ 离散时间信号 $x[n]$ 的能量
$E_{\infty} \triangleq \lim_{N \to \infty} \sum_{n=-N}^{N} |x[n]|^2=\sum^{+\infty}_{n=-\infty}\mid x[n]\mid^2$  

离散时间信号 $x[n]$ 的平均功率
$P_{\infty} \triangleq \lim_{N \to \infty} \frac{1}{2N+1} \sum_{n=-N}^{N} |x[n]|^2$ 
###### 变换
$x(t)\to x(\alpha t+\beta)$ ，首先进行延时，再进行尺度变换。如果反过来，那么 $\beta$ 的值会发生改变（先做时移）。*$t\to-t$ 并非直接对称，而是关于 $y$ 轴对称* 。
#### 欧拉公式
欧拉公式：
$$
\begin{aligned}
e^{j\omega t} &= \cos \omega t + j \sin \omega t \\
e^{-j\omega t} &= \cos \omega t - j \sin \omega t \\
\cos \omega t &= \frac{e^{j\omega t} + e^{-j\omega t}}{2} \\
\sin \omega t &= \frac{e^{j\omega t} - e^{-j\omega t}}{2j}
\end{aligned}
$$
#### 周期
周期复指数信号具有有限平均功率
复指数的模永远为 $1$ 
- 信号 $e^{ jw_{0}t }$ 与 $e^{ jw_{0}n }$ 的比较

| $e^{j\omega_0 t}$                                                                                        | $e^{j\omega_0 n}$                                                                                                                |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| $\omega_0$ 不同，信号不同                                                                                       | 频率相差 $2\pi$ 的整倍数，信号相同                                                                                                            |
| 对任何 $\omega_0$ 值都是周期的                                                                                    | 仅当 $\omega_0 = 2\pi m/N$ 时才是周期的，这里 $N$（大于 $0$ ）和 $m$ 均为整数                                                                        |
| 基波频率为 $\omega_0$                                                                                         | 基波频率 $\omega_0/m$                                                                                                                |
| 基波周期：$\begin{cases} \omega_0 = 0 \text{ 时无定义} \\ \omega_0 \neq 0 \text{ 时 } 2\pi/\omega_0 \end{cases}$  | 基波周期：$\begin{cases} \omega_0 = 0 \text{ 时无定义} \\ \omega_0 \neq 0 \text{ 时 } m\left(\frac{2\pi}{\omega_0}\right)=N \end{cases}$  |

- 在 $\phi_{k}[n]=e^{ jk(2\pi/N)n } \ \ k=0,\pm{1},\dots$ 时 ，仅有 $N$ 个互不相同的周期复指数信号，从 $\phi_{0}[n]=1$ 到 $\phi_{N-1}[n]=e^{ j2\pi(N-1)n/N }$ 
#### 单位脉冲与单位阶跃
- 单位脉冲（离散）在 $n=0$ 时等于 $1$
-  $\delta[n]=u[n]-u[n-1]$ 
-  $u[n]=\sum_{k=0}^{\infty}\delta[n-k]$ 
-  $\delta(t)=\frac{du(t)}{dt}$ 
-  $u(t)=\int _{0}^\infty\delta(t-\sigma) \, d\sigma$ 
###### 系统性质
- 记忆/无记忆：系统输出仅取决于 *该时刻* 的输入称为无记忆系统，与过去将来的有关的都叫记忆系统
- 可逆/不可逆：不同的输入导致不同的输出，即为可逆系统，可以构造逆系统
- 因果/非因果：输出只取决于现在和过去的输入（需要检测全部时间的输入-输出关系/分清输入信号和其他函数，例如 $y(t)=x(t)g(t)$ 中 $g(t)$ 是随时间变化的函数，不管是什么，都不会影响系统的因果性，因为输出仅受当前的输入 $x(t)$ 的影响）
- 稳定/不稳定：输入有界，输出也有界，就是稳定的
- 时不变：（无时移的输入得到输出，做时移）与 （时移的输入得到输出）的对比。
- 线性： $(ax_{1}(t)+bx_{2}(t))作为系统的输入\to 得到对应的输出 ay_{1}(t)+by_{2}(t)$ （ $a$ ， $b$ 为*复常数*）思路也就是用前者做输入，看看输出是否相等。
	- 增量线性：响应对输入的变化是线性的。
 ###### 不太重要的
任何信号可以分解为偶信号和奇信号之和。
$$
\begin{align}
\mathcal{E}\mathbf{v}\{x(t)\} = \frac{1}{2}[x(t) + x(-t)]

\\

\mathcal{O}\mathbf{d}\{x(t)\} = \frac{1}{2}[x(t) - x(-t)]
\end{align}
$$

## 微分方程与差分方程
完全解 = 齐次解（自由响应） + 特解 = 零输入相应 + 零状态相应

#### 齐次解与特解
- 系数求解的边界条件 $r^{(k)}(0^+)$ （确定初始条件：冲击函数系数平衡法，只平衡微分方程两边的冲激函数项与其各级导数项）
- 齐次解：令方程右边的激励为 $0$ ，写特征根方程然后求解。 

| 特征根状态                       | 解的状态                                                          |
| --------------------------- | ------------------------------------------------------------- |
| 互不相等的实根                     | $\sum^n_{i=1}C_{i}e^{ \lambda_{i}t }$                         |
| $k$ 重根                      | $(c_{k}t^{k-1}+c_{k-1}t^{k-2}+\dots+c_{1})e^{ \lambda_{1}t }$ |
| 共轭复根 $\sigma_{1}\pm jw_{1}$ | $e^{ \sigma_{1}t }(c_{1}\cos w_{1}t+c_{2}\sin w_{1}t)$        |
- 特解（考虑方程右边激励的作用），首先设定特解，之后代入方程

| 激励                                                       | 特解                                                                                                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 常数                                                       | 常数                                                                                                                                      |
| $t^p$                                                    | $B_{1}t^p+B_{2}t^{p-1}+\dots+B_{p}t+B_{p+1}$                                                                                            |
| $e^{ \lambda t }$                                        | $Be^{ \lambda t }$ （ $\lambda$ 是 $k$ 重特征根，则为 $(B_{0}t^k+B_{1}t^{k-1}+\dots+B_{k})e^{ \lambda t }$ ）                                     |
| $\sin wt / \cos wt$                                      | $B_{1}\cos wt+B_{2}\sin wt$                                                                                                             |
| $t^pe^{ \lambda t }\cos wt / t^pe^{ \lambda t } \sin wt$ | $(B_{1}t^p+B_{2}t^{p-1}+\dots+B_{p}t+B_{p+1})e^{ \lambda t }\cos wt+(D_{1}t^p+D_{2}t^{p-1}+\dots+D_{p}t+D_{p+1})e^{ \lambda t }\sin wt$ |
###### 差分方程的齐次解与特解
- 齐次解

| 特征根状态                                        | 解的状态                                                                                         |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| $N$ 个互异的实根 $\alpha_{1}\sim\alpha_{N}$        | $c_{1}\alpha_{1}^n+\dots+c_{N}\alpha_{N}^n$                                                  |
| $k$ 个相同的实根 $\alpha_{1}\sim\alpha_{k}$        | $\alpha_{1}^n(c_{1}+c_{2}n+\dots c_{k}n^{k-1})+\dots+c_{N}\alpha_{N}^n$                      |
| 共轭复根 $\rho e^{ \pm j\phi }=\alpha\pm j\beta$ | $c_{1}(\alpha+j\beta)^n+c_{2}(\alpha-j\beta)^n=c_{1}\rho^n\cos n\phi+c_{2}\rho^n\sin n\phi$  |

- 特解

| 输入代入右边得到的函数               | 特解                                                                           |
| ------------------------- | ---------------------------------------------------------------------------- |
| $n^k$                     | $d_{1}n^k+d_{2}n^{k-1}+\dots+d_{k}n+d_{k+1}$ ，$m$ 重特征根为 $1$ 时，需要在外面乘以 $n^m$  |
| $\sin nw$ 或 $\cos nw$     | $d_{1}\sin nw+d_{2}\cos nw$                                                  |
| $a^n$ ， $a$ 不是特征方程的根      | $da^n$                                                                       |
| $a^n$ ， $a$ 是特征方程的 $k$ 重根 | $(d_{1}n^k+d_{2}n^{k-1}+\dots+d_{k}n+d_{k+1})a^n$                            |
#### 零输入响应与零状态响应
-  $r_{zp}(t)$ 零输入响应只由系统起始储能 $r^{(k)}(0^-)$ 引起，计算时不考虑激励（因此不用考虑特解的问题），用 $r^{(k)}(0^-)$ 计算相关参数。
-  $r_{zs}(t)$ 零状态响应要考虑激励，相关参数（除了特解之外的所有值）由 $r_{zs}^{(k)}(0^+)$ 计算（需要重新计算 $0^+$ 时刻的值）
	- 零状态响应也就是输入对输出带来的变化，对于一个系统的输入 $r(t)$ ，$r(0^+)=r(0^-)+r_{zs}(0^+)$ 
- 可以由一个线性时不变系统的频率响应 $H(jw)$ 来求其零状态响应和零输入相应。根据分母上的值可以得到通解，而后求得零输入响应；通过将频率响应乘以输入的傅里叶变换，因式分解后做傅里叶逆变换，可以得到零状态响应。
- 零状态响应是输入与冲激响应的卷积。
###### 差分方程
- 零输入响应： $y(-1)$ ，$y(-2)$ ，$y(-N)$ 为起始状态
- 零状态响应：上述全为 $0$ 
## 线性时不变系统
#### 离散
- 筛选性质
$x[n]=\sum^{+\infty}_{k=-\infty}x[k]\delta[n-k]$
- $h_{k}[n]$ 为线性（若时不变 $h_{k}[n]=h_{0}[n-k],h[n]=h_{0}[n]$ ）系统对移位单位脉冲 $\delta[n-k]$ 的响应，则 $y[n]=\sum^{+\infty}_{k=-\infty}x[k]h_{k}[n]$ 也就是
$y[n]=\sum^{+\infty}_{k=-\infty} x[k] h[n-k]=x[n]*h[n]$
- 无限项求和公式
$\sum^\infty_{k=0}\alpha^k=\frac{1}{1-\alpha}\ \ 0<\mid\alpha\mid<1$
#### 连续
- 筛选性质
$x(t)=\int^{+\infty}_{-\infty}x(\tau)\delta(t-\tau)  \, d\tau $
- 卷积积分（单位冲激响应 $h(t)$ ）
$y(t)=\int ^{+\infty}_{-\infty}x(\tau)h(t-\tau) \, d\tau =x(t)*h(t)$

#### 线性时不变系统的性质（或者说是卷积的性质）
- 交换律，分配律，结合律
- 无记忆系统 $h[n]=K \delta[n]$ / $h(t)=K\delta(t)$ 
- 可逆性：一个系统和它逆系统的卷积和是单位冲激函数
	- $y[n]=\sum^n_{k=-\infty}x[k]$ 与 $y[n]=x[n]-x[n-1]$ 互为逆系统，方法是找到单位脉冲响应，然后可以验证它们的卷积和。
- 因果性的条件
	-  $h[n]=0, \ \ n<0\to y[n]=\sum^\infty_{k=0}h[k]x[n-k]$ 
	-  $h(t)=0, \ \ t<0\to y(t)=\int _{0}^\infty h(\tau)x(t-\tau) \, d\tau$  
- 稳定性的条件（注意都与 $h$ 有关）
	- 绝对可和： $\sum^{+\infty}_{k=-\infty}\mid h[k]\mid<\infty$ 
	- 绝对可积： $\int ^{+\infty}_{-\infty }\mid h(\tau) \, d\tau\mid<\infty$  
- 单位阶跃响应 $s[n]$ ：
	- 离散：
		-  $s[n]=\sum^n_{k=-\infty}h[k]$
		-  $h[n]=s[n]-s[n-1]$
	- 连续：
		-  $s(t)=\int _{-\infty}^th(\tau) \, d\tau$
		-  $h(t)=\frac{ds(t)}{dt}$ 
#### 奇异函数
- $\int_{-\infty}^{\infty} f(t)\delta'(t-t_0)dt = -f'(t_0)$
- $\int_{-\infty}^{\infty} \delta'(t)dt = 0$
- $\delta'(-t) = -\delta'(t)$
- $f(t)\delta'(t) = f(0)\delta'(t) - f'(0)\delta(t)$
- $$\text{sgn}(t) = \begin{cases} 1 & t > 0 \\ -1 & t < 0 \end{cases}$$
- $f(t)*\delta(t)=f(t)$
- $f(t)*\delta(t-t_{0})=f(t-t_{0})$
- $\delta(t-t_{1})*\delta(t-t_{2})=\delta(t-t_{1}-t_{2})$
- $f(t)*\delta^{(k)}(t-t_{0})=f^{(k)}(t-t_{0})$
- $f(t)*u(t)=\int ^t_{-\infty}f(\tau) \, d\tau$
- $\delta(at)=\frac{1}{\mid a\mid}\delta(t)$
- $\frac{1}{1 + j\omega(\omega - 10^5)} + \frac{1}{1 + j\omega(\omega + 10^5)} \approx \frac{1}{1 + j\omega} \left[ \delta(\omega - 10^5) + \delta(\omega + 10^5) \right]$ 
## 周期信号傅里叶级数
#### 连续时间
- 综合公式
$x(t)=\sum^{+\infty}_{k=-\infty}a_{k}e^{ jk(2\pi/T)t }$
- 分析公式
$a_{k}=\frac{1}{T}\int _{T}x(t)e^{ -jk(2\pi/T)t } \, dt $
直流分量为 $x(t)$ 周期内的平均值。（$a_{0}=\frac{1}{T}\int _{T}x(t) \, dt$ ）
$x(t)$ 是实信号，则 $a^*_{k}=a_{-k}$ 
- 存在傅里叶变换的条件：狄里赫利条件
	- 任何周期内 $x(t)$ 绝对可积
	- 最大值最小值数目有限
	- 有限个不连续点，且不连续点上函数有限
- 性质
（ $w_{0}=\frac{2\pi}{T}$ ）

| 性质     | 周期信号                                                                                 | 傅里叶级数系数                                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 线性     | $Ax(t)+By(t)$                                                                        | $Aa_{k}+Bb_{k}$                                                                                                                             |
| 时移     | $x(t-t_{0})$                                                                         | $a_{k}e^{ -jkw_{0}t_{0} }$                                                                                                                  |
| 频移     | $e^{ jMw_{0}t }x(t)$                                                                 | $a_{k-M}$                                                                                                                                   |
| 共轭     | $x^*(t)$                                                                             | $a_{-k}^*$                                                                                                                                  |
| 时间反转   | $x(-t)$                                                                              | $a_{-k}$                                                                                                                                    |
| 时域尺度变换 | $\alpha>0\ x(\alpha t)$                                                              | $a_{k}$ （傅里叶系数没改变，但由于基波频率变化了，傅里叶级数表示出现了变化，乘了 $\alpha$ ）                                                                                     |
| 周期卷积   | $\int _{T}x(\tau )y(t-\tau) \, d\tau$                                                | $Ta_{k}b_{k}$                                                                                                                               |
| 相乘     | $x(t)y(t)$                                                                           | $\sum_{l=-\infty}^{+\infty}a_{l}b_{k-l}$                                                                                                    |
| 共轭对称   | 实信号                                                                                  | $a_{k}=a_{-k}^*$<br />$Re\mid a_{k}\mid=Re\mid a_{-k}\mid$<br />$Im\mid a_{k}\mid=-Im\mid a_{-k}\mid$ <br />$\mid a_{k}\mid=\mid a_{-k}\mid$ <br /> |
| 微分     | $\frac{dx(t)}{dt}$                                                                   | $jkw_{0}a_{k}$                                                                                                                              |
| 积分     | $\int ^t_{-\infty}x(t) \,dt$                                                         | $\frac{1}{jkw_{0}}a_{k}$                                                                                                                    |
|        | 实偶信号                                                                                 | $a_{k}$ 也实偶                                                                                                                                 |
|        | 实奇信号                                                                                 | $a_{k}$ 纯虚奇，$a_{0}=0$                                                                                                                       |
| 奇偶分解   | $x_{e}(t)=\mathcal{E}\mathbf{v}\{x(t)\}$<br />$x_{o}(t)=\mathcal{O}\mathbf{d}\{x(t)\}$ | $Re\mid a_{k}\mid$<br />$jIm\mid a_{k}\mid$                                                                                                   |
帕斯瓦尔定理

$\frac{1}{T}\int _{T}\mid x(t)\mid^2 \, dt=\sum_{k=-\infty}^{+\infty}\mid a_{k}\mid^2 $
#### 离散时间
$N$ 是周期。
- 综合公式（ $N$ 项的有限级数）
$x[n]=\sum_{k= <N>}a_{k}e^{ jkw_{0}n }$
- 分析公式
$a_{k}=\frac{1}{N}\sum_{n= <N>}x[n] e^{ -jkw_{0}n }$
- 性质
（大多数与连续时间的相同）

| 性质     | 周期信号                                                                                                                                        | 傅里叶级数系数                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 时域尺度变换 | <br />$x_{(m)}[n] = \begin{cases} x[n/m], & \text{若 } n \text{ 是 } m \text{ 的倍数} \\0, & \text{若 } n \text{ 不是 } m \text{ 的倍数}\end{cases}$<br /> | $\frac{1}{m}a_{k}$                   |
| 一阶差分   | $x[n]-x[n-1]$                                                                                                                               | $(1-e^{ -jk(2\pi/N) })a_{k}$         |
| 求和     | $\sum_{k=-\infty}^nx[k]$ 当 $a_{0}$ 为有限值且是周期的                                                                                                | $\frac{1}{1-e^{ -jk(2\pi)/N }}a_{k}$ |
###### 重要信号
- 离散时间周期方波序列
![](/img/xhxt_summary/Pastedimage20250409184653.png)
$a_{k}=\frac{1}{N} \frac{\sin\left[ \frac{2\pi k\left( N_{1}+\frac{1}{2} \right)}{N} \right]}{\sin\left( \frac{\pi k}{N} \right)} \ \ \ k\neq0,\pm N,\pm2N$
$a_{k}=\frac{{2N_{1}+1}}{N} \ \ k=0,\pm N,\pm{2}N$
- 连续时间周期方波序列
![](/img/xhxt_summary/Pastedimage20250412165138.png)
$a_{k}=\frac{\sin(kw_{0}T_{1})}{k\pi}$
（$w_{0}T=2\pi$）
如果方波的高为 $a$ ，需要再乘 $a$ 
#### 与系统的关系
- 对连续时间系统且 $Re\{s\}=0$， $h(t)$ 为单位冲激响应，对应的频率响应为
$H(jw)=\int ^{+\infty}_{-\infty}h(t)e^{ -jwt } \, dt $
- 对离散时间系统且 $\mid z\mid=1$， $h[n]$ 为单位冲激响应，对应的频率响应为
$H(e^{ jw })=\sum^{+\infty}_{n=-\infty} h[n]e^{ -jwn }$

- 若系统的输出要可以用频响表示（有意义），需要 $H(jw)$ / $H(e^{ jw })$ 有定义且有限。
- 经过系统之后，新的傅里叶级数是原有的傅里叶级数乘以*对应的*频率响应。
## 连续时间傅里叶变换
#### 非周期信号
- 傅里叶变换对
$x(t)=\frac{1}{2\pi}\int ^{+\infty}_{-\infty}X(jw)e^{ jwt } \, dw $
$X(jw)=\int ^{+\infty}_{-\infty}x(t)e^{ -jwt } \, dt $
周期信号的傅里叶系数 $a_{k}$ 可以利用该周期内信号（周期外所有值都是 $0$ ）的傅里叶变换的等间隔样本来表示。
$a_{k}=\frac{1}{T}X(jw)\mid_{w=kw_{0}}$
- 一个信号存在傅里叶变换的充分条件（狄里赫利条件）
	- $x(t)$ 绝对可积， $\int ^{+\infty}_{-\infty}\mid x(t)\mid \, dt<\infty$ 
	- 有限区间内，只有有限个最大值和最小值
	- 有限区间内有有限个不连续点
- 给一个系统输入一个 $e^{ jwt }$ ，输出为 $H(w)e^{ jwt }$ ，其中 $H()$ 中的 $w$ 和 $e$ 头上的 $w$ 是同一个。
#### 周期信号
*成谐波关系的频率上的一串冲激函数* ， $w_{0}=\frac{2\pi}{T}$ ，其中 $T$ 是周期。
$X(jw)=\sum^{+\infty}_{k=-\infty} 2\pi a_{k}\delta(w-kw_{0})$
#### 性质
- 线性： 
$a x(t) + b y(t) \xleftrightarrow{\mathcal{F}} a X(j\omega) + b Y(j\omega)$
- 时移：
$x(t-t_{0})\xleftrightarrow{\mathcal{F}}e^{ -jwt_{0} }X(jw) $
- 共轭
若
$x(t)\xleftrightarrow{\mathcal{F}}X(jw)$
则
$x^*(t)\xleftrightarrow{\mathcal{F}}X^*(-jw)$
若 $x(t)$ 是实函数，
$X(-jw)=X^*(jw)$
傅里叶变换的实部是频率的偶函数，虚部是频率的奇函数。
$x(t)$ 是实偶函数，$X(jw)$ 也是实偶函数。
$x(t)$ 为实奇函数，则 $X(jw)$ 为纯虚奇函数。
$x(t) \xrightarrow{\mathcal{F}} X(j\omega)$

$\mathcal{E}v\{x(t)\} \xrightarrow{\mathcal{F}} \Re\{X(j\omega)\}$

$\mathcal{O}d\{x(t)\} \xrightarrow{\mathcal{F}} j \Im\{X(j\omega)\}$
- 微分与积分
$\frac{dx(t)}{dt}\xleftrightarrow{\mathcal{F}} jwX(jw)$
$\int ^t _{-\infty}x(\tau)d\tau\xleftrightarrow{\mathcal{F}}  \frac{1}{jw}X(jw)+\pi X(0)\delta(w) $
已知 $f'(t)\xleftrightarrow{\mathcal{F}}G(w)$ ，则 $\int ^t_{-\infty}f'(t) \, dt=f(t)-f(-\infty)\xleftrightarrow{\mathcal{F}} \frac{G(w)}{jw}+\pi G(0)\delta(w)$ ，于是有： $F(w)=\frac{G(w)}{jw}+\pi G(0)\delta(w)+2\pi f(-\infty)\delta(w)$ 
- 时间与频率
$x(at)\xleftrightarrow{\mathcal{F}} \frac{1}{\mid a\mid}X\left( \frac{jw}{a} \right)$
$x(-t)\xleftrightarrow{\mathcal{F}}X(-jw)$
- 对偶： $f(t)\xleftrightarrow{\mathcal{F}}F(w)$ ，则 $F(t)\xleftrightarrow{\mathcal{F}}2\pi f(-w)$ 
	- $-jtx(t)\xleftrightarrow{\mathcal{F}} \frac{dX(jw)}{dw}$ 
	- $e^{ jw_{0}t }x(t)\xleftrightarrow{\mathcal{F}}X(j(w-w_{0}))$ 
	- $-\frac{1}{jt}x(t)+\pi x(0)\delta(t)\xleftrightarrow{\mathcal{F}}\int ^w_{-\infty}x(\eta) \,d \eta$ 
- 帕斯瓦尔定理
$\int ^{+\infty}_{-\infty}\mid x(t)\mid^2 \, dt=\frac{1}{2\pi} \int ^{+\infty}_{-\infty}\mid X(jw)\mid^2 \, dw  $
- 卷积性质
$y(t)=h(t)*x(t)\xleftrightarrow{\mathcal{F}} Y(jw)=H(jw)X(jw)$

- 相乘性质
$r(t)=s(t)p(t)\xleftrightarrow{\mathcal{F}}R(jw)=\frac{1}{2\pi}\int ^{+\infty }_{-\infty}S(j\theta)P(j(w-\theta)) \, d\theta $
#### 用傅里叶变换解微分方程
对微分方程： $\sum_{k=0}^{N} a_k \frac{d^k y(t)}{dt^k} = \sum_{k=0}^{M} b_k \frac{d^k x(t)}{dt^k}$ 
可以这样解出其单位冲激响应。
$H(j\omega) = \frac{Y(j\omega)}{X(j\omega)} = \frac{\sum_{k=0}^{M} b_k (j\omega)^k}{\sum_{k=0}^{N} a_k (j\omega)^k}$ 

## 傅里叶变换对
| 信号                                                                                                                 | 傅里叶变换                                                                                    | 傅里叶级数系数（若为周期的）                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| $\sum_{k=-\infty}^{+\infty} a_k e^{jk\omega_0 t}$                                                                  | $2\pi \sum_{k=-\infty}^{+\infty} a_k \delta(\omega - k\omega_0)$                         | $a_k$                                                                                                               |
| $e^{jk\omega_0 t}$                                                                                                 | $2\pi \delta(\omega - k\omega_0)$                                                        | $a_1 = 1$，其余 $k$ ， $a_{k}=0$                                                                                        |
| $\cos \omega_0 t$                                                                                                  | $\pi [\delta(\omega - \omega_0) + \delta(\omega + \omega_0)]$                            | $a_1 = a_{-1} = \frac{1}{2}$，其余 $k$ ， $a_{k}=0$                                                                     |
| $\sin \omega_0 t$                                                                                                  | $\frac{\pi}{j} [\delta(\omega - \omega_0) - \delta(\omega + \omega_0)]$                  | $a_1 = -a_{-1} = \frac{1}{2j}$，其余 $k$ ， $a_{k}=0$                                                                   |
| $x(t) = 1$                                                                                                         | $2\pi \delta(\omega)$                                                                    | $a_0 = 1$，$k \neq 0$ 时 $a_k = 0$                                                                                    |
| 周期方波 $x(t) = \begin{cases} 1, & \|t\| < T_1 \\0, & T_1 < \|t\| \leq \frac{T}{2}\end{cases}$ 和<br />$x(t + T) = x(t)$ | $\sum_{k=-\infty}^{+\infty} \frac{2 \sin k \omega_0 T_1}{k} \delta(\omega - k \omega_0)$ | $\frac{\omega_0 T_1}{\pi} \text{sinc}\left( \frac{k \omega_0 T_1}{\pi} \right) = \frac{\sin k \omega_0 T_1}{k \pi}$ |
| $\sum_{n=-\infty}^{+\infty} \delta(t - nT)$                                                                        | $\frac{2\pi}{T} \sum_{k=-\infty}^{+\infty} \delta\left(\omega - \frac{2\pi k}{T}\right)$ | $a_k = \frac{1}{T}$，对全部 $k$                                                                                         |
| $x(t) = \begin{cases} 1, & \mid t\mid < T_1 \\ 0, & \mid t\mid > T_1 \end{cases}$                                  | $\frac{{2\sin wT_{1}}}{w}$                                                               |                                                                                                                     |
| $\frac{\sin W t}{\pi t}$                                                                                           | $X(j\omega) = \begin{cases} 1, & \|\omega\| < W \\ 0, & \|\omega\| > W \end{cases}$      |                                                                                                                     |
| $\delta(t)$                                                                                                        | $1$                                                                                      |                                                                                                                     |
| $u(t)$                                                                                                             | $\frac{1}{j\omega} + \pi \delta(\omega)$                                                 |                                                                                                                     |
| $\delta(t - t_0)$                                                                                                  | $e^{-j\omega t_0}$                                                                       |                                                                                                                     |
| $e^{-at} u(t), \Re\{a\} > 0$                                                                                       | $\frac{1}{a + j\omega}$                                                                  |                                                                                                                     |
| $t e^{-at} u(t), \Re\{a\} > 0$                                                                                     | $\frac{1}{(a + j\omega)^2}$                                                              |                                                                                                                     |
| $\frac{t^{n-1}}{(n-1)!} e^{-at} u(t), \Re\{a\} > 0$                                                                | $\frac{1}{(a + j\omega)^n}$                                                              |                                                                                                                     |
| $e^{ -\mid t\mid }$                                                                                                | $\frac{2}{1+w^2}$                                                                        |                                                                                                                     |
- 另一些 tricks ：方波的卷积
	- 以 $0$ 为中心
	- 两个相同宽度矩形卷积得到一个三角形。底：矩形宽度的两倍。高：$h_{1}h_{2}$ 乘以矩形宽度![](/img/xhxt_summary/Pastedimage20250414092927.png)
	- 两个不同宽度矩形卷积得到一个梯形。上底：两个矩形宽度之差。下底：两个矩形宽度之和。![](/img/xhxt_summary/Pastedimage20250414092955.png)


:::tip
- 验证一些系统性质可以尝试输入单位冲激或单位阶跃信号作为 TEST
- trick：求 $f(0)$ 时，如果已知 $F(w)$ ，可以用傅里叶变换的逆变换，令 $t=0$
- 如果涉及到对 $e^{ jwt }$ 其中 $w$ 是变量，考虑用傅里叶级数。
- 时移和频移要分清（好吧也挺傻的
:::