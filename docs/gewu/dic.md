---
title: DIC
id: dic
---
一份针对 SJTU 微电子专业课程 MST3313 考试的知识总结。
## 单位
| Letter | Unit   | Magnitude    |
| ------ | ------ | ------------ |
| a      | atto   | $10^{-18}$ |
| f      | fempto | $10^{-15}$ |
| p      | pico   | $10^{-12}$ |
| n      | nano   | $10^{-9}$  |
| u      | micro  | $10^{-6}$  |
| m      | milli  | $10^{-3}$  |
| k      | kilo   | $10^{3}$   |
| x      | mega   | $10^{6}$   |
| g      | giga   | $10^{9}$   |
 ## 引论
- VTC （电压传输特性/DC传输特性）
	- $V_{out}$ / $V_{in}$
	- 门阈值电压/开关阈值电压 $V_{M}$ ，是 VTC 曲线和 $V_{out}=V_{in}$ 的交点
	- 高逻辑电平/额定高电压 $V_{OH}$ ，低逻辑电平/额定低电压 $V_{OL}$ 
	- 可接受的高/低电压 $V_{IH}$ / $V_{IL}$ ，是 $VTC$ 增益(gain) $\frac{dV_{out}}{dV_{in}}$ 为 $-1$ 的点，二者之间的区域称之为不确定区，或者叫过渡宽度(Transition Width)
	- 噪声容限： $NM_{L}=V_{IL}-V_{OL}$ ，$NM_{H}=V_{OH}-V_{IH}$ 
	- 再生性：保证一个受干扰的信号经过若干逻辑级后收敛回额定电平中的某一个
		- 图解法：![](/img/dic/Pastedimage20251027091542.png)
		- 理论分析：
			- 有一个增益绝对值大于 $1$ 的过渡区，作为两个合法区的边界，而合法区的增益小于 $1$ 
	- 扇入和扇出
		- 扇出：连接到驱动门输出端的负载门的数目 $N$ ，会影响逻辑输出电平
			- 增大*负载门*的输入电阻/减小*驱动门*的输出电阻可以使这一影响减到最小
			- 扇出大时，会使*驱动门*的动态性能变差（因此器件定义了最大扇出）
		- 扇入：门输入的数目。扇入较大的门比较复杂，会使得静态和动态特性变差
	- 理想数字门（理想反相器模型）
		-  $g=\infty$ 
		-  $V_{M}=\frac{{V_{OH}-V_{OL}}}{2}=NM_{L}=NM_{H}$ 
		-  $R_{in}=\infty$ ，$R_{out}=0$ 
- 性能
	- $t_{p}$ 门对输入端信号变化的响应速度
		- 图：![](/img/dic/Pastedimage20251027093733.png)
		-  $t_{pLH}$ response time of the gate for a *low to high output* transition(50%→50%)
		- $t_{pHL}$ response time of the gate for a *high to low output* transition
		-  Propagation delay time: $t_{pd}=max(t_{pLH},t_{pHL})$ 
		- Contamination delay time:$t_{cd}=min(t_{pLH},t_{pHL})$ 
		- $t_{p}=\frac{t_{pLH}+t_{pHL}}{2}$ 
	- fall & rise
		- 图：![](/img/dic/Pastedimage20251027094040.png)
		- fall time 90% → 10%
		- risetime 10% → 90%
	- 测量 $t_{p}$ 的方式：环振，通过把 $N$ （其中 $N$ 为奇数）个反相器连在一起，检测它发生振荡的周期 $T=2\times t_{p}\times N$ 从而对 $t_{p}$ 进行衡量。（周期公式在 $2Nt_{p}\gg t_{f}+t_{r}$ 的时候承认）
- RC Network
	- charge $V_{out}(t)=V_{dd}(1-e^{ -t/\tau })$ 
		- 到达 50% 点 ： $t=\ln2\tau=0.69\tau$ 
		- 10% → 90% ：$t=\ln9 \tau=2.2\tau$ 
	- discharge $V_{out}(t)=V_{dd}e^{ -t/\tau }$ 
- Power
	- 功耗延迟积：$PDP=P_{av}t_{p}$ 
	- 能量延迟积： $EDP=PDP\times t_{p}$ 
- Chips Layout: 
	- $f$ is the distance between source and drain(minimum width of polysilicon)
	- $\lambda = \frac{f}{2}$ 
- Yield and Cost
	- Die（晶粒）per wafer: $\frac{{\pi \times\left( \frac{{wafer\ diameter}}{2} \right)^2}}{die\ area}-\frac{{\pi \times{wafer\ diameter}}}{\sqrt{ 2\times die\ area }}$ 



## MOS
#### 二极管基础/半导体器件复习
- 二极管正偏 → 促进多子漂移，也即在（对方区域的）过剩少子扩散，在P/N两区过剩载流子随着深入不断减小 → 电流从 P 向 N 流过二极管，称为正偏
- 二极管反偏 → 抑制了（对方区域的）少子扩散，漂移电流为主导（只有自己区域的少子被驱动），P/N 两区本身的少数载流子随着深入不断增加（靠近耗尽区的被驱动走了*一定是先驱动走耗尽区的再说别的*） → 电流从 N 流到 P ，且很小
- 正偏耗尽层宽度缩小，结电容增加（相当于电容极板间距减小），反偏则完全相反
- 注意栅极传递和通过源极/漏极掺杂![](/img/dic/Pastedimage20251106142906.png)
#### MOS管
- PMOS/NMOS指的是源漏级的性质，以及沟道的性质
- 源极和漏极在物理上相同，只能通过相对电压来区分
	- NMOS：低电压为源极，高电压为漏极
	- PMOS：高电压为源极，高电压为漏极
- L是晶体管沟道的长度
- NMOS 不能完全上拉，PMOS 不能完全下拉。
#### 静态特性
- 阈值电压
$V_{T}=V_{T_{0}}+\gamma(\sqrt{ \mid(-2)\phi_{F}+V_{SB}\mid }-\sqrt{ \mid-2 \phi_{F} \mid})$
其中 $V_{T_{0}}$ 是 $V_{SB}=0$ 时的阈值电压，$\gamma$ 称为体效应（衬偏效应）参数，表明 $V_{SB}$ 改变造成的影响。对 NMOS 为正值，对 PMOS 是负值。 
其中 $\phi_{F}=\phi_{T} \ln\left( \frac{N_{A}}{n_{i}} \right)$ ， $\phi_{T}$ 是热电压，等于 $\frac{KT}{q}$ 。
$\gamma_{NMOS} = \frac{t_{ox}}{\epsilon_{ox}} \sqrt{2q\epsilon_{Si}N_A} = \frac{\sqrt{2q\epsilon_{Si}N_A}}{C_{ox}}$ 
$\gamma_{PMOS} = -\frac{t_{ox}}{\epsilon_{ox}} \sqrt{2q\epsilon_{Si}N_D} = -\frac{\sqrt{2q\epsilon_{Si}N_D}}{C_{ox}}$ 
- DC性质

| 区域/性质      | 正常NMOS                                                                                                                                                                | 短沟道NMOS                                                                                                                                                                             | 长沟道NMOS                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Cut-off    | $I_{ds}=0$                                                                                                                                                            | 对 $V_{GT}\leq 0$ ， $I_{D}=0$                                                                                                                                                        |                                                               |
| Linear     | $V_{GS}>V_{T}$<br />$V_{DS}<V_{GS}-V_{T}$<br />$I_{D}=\mu_{n}C_{ox} \frac{W}{L}\left( (V_{GS}-V_{T})V_{DS}-\frac{V_{DS}^2}{2} \right)$ 其中 $\mu_{n}C_{ox}=k_{n}'$ 称为工艺跨导参数 | 对 $V_{GT}\geq 0$ ，$I_D = k' \frac{W}{L} \left[ V_{GT}V_{min} - \frac{V_{min}^2}{2} \right] (1 + \lambda V_{DS})$ （注意这里也有沟道调制效应）其中 $k'$ 一般会给出， $V_{min}=min(V_{GT},V_{DS},V_{DSAT})$ |                                                               |
| Saturation | $V_{GS}>V_{T}$<br />$V_{DS}\geq V_{GS}-V_{T}$ <br />$I_{D}=\mu_{n}C_{ox} \frac{W}{2L}(V_{GS}-V_{T})^2$                                                                    |                                                                                                                                                                                     | 根据沟长调制效应，$I_{D}=I_{D}'(1+\lambda V_{DS})$ ，其中 $I_{D}'$ 为左边的公式 |
- 沟长调制效应： $V_{DS}$ 使得漏结的耗尽区加大，缩短了有效沟道的长度
- <mark>亚阈值</mark>：电流在 $V_{GS}=V_{T}$ 不立即降为零，而是处于亚阈值/弱反型导通状态
	- 亚阈值电流 exponentially increased with
		- 降低 $V_{T}$ 
		- 增加 $V_{DD}$ 
		- 增加 $V_{DS}$ 
		- 增加温度

其中上表中的短沟道NMOS那一列，被认为是用于手工分析的通用MOS模型。下面是上面式子涉及的模型参数（ $0.25\mu m$ ）

| 参数                   | NMOS               | PMOS               |
| -------------------- | ------------------ | ------------------ |
| $V_{T0}$ (V)         | 0.43               | -0.4               |
| $\gamma$ (V$^{0.5}$) | 0.4                | -0.4               |
| $V_{DSAT}$ (V)       | 0.63               | -1                 |
| $K'$ (A/V$^2$)       | $115\times10^{-6}$ | $-30\times10^{-6}$ |
| $\lambda$ (V$^{-1}$) | 0.06               | -0.1               |
通过考虑 MOS 充放电一个电容（一般考虑 $\frac{V_{DD}}{2}$ 到 $V_{DD}$ ，因为这与前面的 $t_{p}$ 的定义有关）时的等效电阻，可以知道晶体管的等效电阻
$R_{eq}=\frac{3}{4} \frac{V_{DD}}{I_{SAT}} \left( 1-\frac{7}{9}\lambda V_{DD} \right)$
假设电源电压远大于晶体管速度饱和电压 $V_{SAT}$ ，则晶体管一直处于速度饱和状态，计算 $I_{SAT}$ 时，直接把 $V_{SAT}$ 代入（linear的公式）计算即可。
有关电阻的一些结论：
- 电阻反比于器件的 $\frac{W}{L}$ 
- 但 $V_{DD}\gg V_{T}+\frac{V_{DSAT}}{2}$ 时，电阻实际上与电源电压无关
- 电源接近 $V_{T}$ 时，电阻急剧增加

#### 动态特性
-  MOS 结构电容（覆盖电容：源和漏在氧化层下延展的横向扩散引起的栅和源漏间的寄生电容，称为覆盖电容）
	- $C_{GSO}=C_{GDO}=C_{ox}x_{d}W$ ， $C_{ox}$ 是单位面积的栅氧电容， $x_{d}$ 是源漏横向扩散的数量， $W$ 是沟道宽度
- 沟道电荷（栅至沟道电容 $C_{GC}$ ，可以划分为 $C_{GCS}$ ， $C_{GCD}$ ，$C_{GCB}$ ，取决于工作区域于端口电压）

| 工作区域 | $C_{GCB}$  | $C_{GCS}$       | $C_{GCD}$    | $C_{GC}=C_{GCB}+C_{GCS}+C_{GCD}$ | $C_{G}=C_{GC}+C_{overlap}$ | 器件情况                                                        |
| ---- | ---------- | --------------- | ------------ | -------------------------------- | -------------------------- | ----------------------------------------------------------- |
| 截止区  | $C_{ox}WL$ | $0$             | $0$          | $C_{ox}WL$                       | $C_{ox}WL+2C_{o}W$         | 截止区域没有任何沟道存在， $C_{GC}$ 出现在栅和体之间                             |
| 电阻区  | $0$        | $C_{ox}WL/2$    | $C_{ox}WL/2$ | $C_{ox}WL$                       | $C_{ox}WL+2C_{o}W$         | 形成反型层，作用是源和漏之间的导体，电容在源和漏之间平均分布； $C_{GCB}=0$ ，体电极与栅极之间被沟道屏蔽。 |
| 饱和区  | $0$        | $(2/3)C_{ox}WL$ | $0$          | $(2/3)C_{ox}WL$                  | $(2/3)C_{ox}WL+2C_{o}W$    | 沟道被夹断，栅与漏之间的电容近似为 $0$ ，栅至体电容也为 $0$ ，所有的电容在栅极与源极之间。          |
- 漏和源反向pn结的耗尽区（反向偏置的源-体和漏-体之间的pn结的耗尽区）的结电容（$C_{SB}$ 和 $C_{DB}$ ），非线性，反偏提高时减小
	- 示意图：![](/img/dic/Pastedimage20251030135106.png)
	- 底板pn结：源区（ 掺杂 $N_{D}$ ）vs 衬底（掺杂 $N_{A}$ ），耗尽区电容 $C_{bottom}=C_{j}WL_{s}=C_{j}\times AREA$ ， $C_{j}$ 为单位面积的结电容，缓变系数为 $M_{j}$ 接近 $0.5$ 
		- 其中 $C_{j}=C_{j_{0}}\left( 1+\frac{V_{sb}}{\phi_{0}} \right)^{-M_{j}}$ ，$C_{j_{0}}$ 是零偏压时底板单位面积的结电容， $\phi_{0}$ 为内建电势，公式为 $\phi_{0}=\frac{kT}{q}\ln\left( \frac{N_{D}N_{A}}{n_{i}^2} \right)$ 
	- 侧壁pn结：源区（掺杂 $N_{D}$ ） vs  $p^+$ 沟道阻挡层注入（掺杂 $N_{A}^+$ ，大于衬底掺杂 $N_{A}$ ），电容值为 $C_{sw}=C_{sw}'x_{j}(W+2\times L_{s})=C_{jbssw}\times PS$ （注意，源区的第四条边不考虑任何侧壁电容，因为代表的是导通的沟道，所以公式中只有 $W+2\times L_{s}$ 这些项）。 $x_{j}$ 结深是工艺参数，常常与 $C'_{jsw}$ 合在一起： $C_{jbssw}=C_{jsw}'x_{j}$ ，缓变系数为 $M_{JSW}$ 接近 $0.33\sim 0.5$ 
		- 其中 $C_{jbssw}=C_{jsw}\left( 1+\frac{V_{sb}}{\phi_{0}} \right)^{-M_{JSW}}$ ， $C_{jsw}$ 是零偏压时的侧壁单位面积的结电容。
	- 0.35 微米以下，沿沟道侧也会有电容，会加一项， $WC_{jbsswg}$ 
		-  $C_{jbsswg}=C_{JSW}\left( 1+\frac{V_{sb}}{\phi_{0}} \right)^{-M_{JSWG}}$ 
	-  $C_{SB}=C_{Sdiff}=C_{bottom}+C_{sw}+C_{jbsswg}W=C_{Ddiff}=C_{DB}$ 
- 器件电容模型
	-  $C_{GS}=C_{GCS}+C_{GSO}$ 
	-  $C_{GD}=C_{GCD}+C_{GDO}$ 
	-  $C_{GB}=C_{GCB}$ 
	-  $C_{SB}=C_{Sdiff}$ 
	-  $C_{DB}=C_{Ddiff}$
	-  示意图![](/img/dic/Pastedimage20251030140742.png)
#### 一些非理想效应
- 沟道长度调制效应（见前）
- 体效应（见前）
- 短沟道效应：沟道长度减小，源极和漏极端口周围的耗尽区会很接近，相比长沟道，短沟道 MOSFET 中栅极对沟道的控制较弱，随着沟道长度缩小，MOSFET的阈值电压降低，同时改变的还有载流子的Mobility，以及沟道电流![](/img/dic/Pastedimage20251030141916.png)
- DIBL：随着源漏极/体端pn结的反向偏置电压增加，耗尽层的深度对沟道的耗尽电荷贡献增大，增加漏极到体的反向偏压会增强短沟道效应，并降低阈值电压。![](/img/dic/Pastedimage20251030143144.png)
- 热载流子效应：器件尺寸持续缩小，但电源和工作电压未进行缩放，电子的热效应上升
- 亚阈值区（见前）
- 闩锁效应：电源 VDD 和地线 GND 之间寄生的 PNP 和 NPN 双极性影响产生的低阻抗通路
- 不同工艺之间的差异：晶体管的参数（有效沟道长度，阈值电压，栅氧厚度）围绕典型值 $T$ 值波动
	- 对于快速的晶体管（ $F$ ），较典型值 $T$ 而言：有效沟道长度 $L_{eff}$ 短，阈值电压 $V_{T}$ 低，栅氧厚度 $t_{ox}$ 薄， $V_{DD}$ 高， $T$ 温度低，慢速则相反。
- 温度升高：迁移率降低， $V_{T}$ 降低

有很多非理想效应会导致亚阈值区的电流泄露
- 亚阈值导电
- 结漏（反向偏置的PN结中存在二极管电流）
- 栅漏（穿过超薄栅介质的隧穿）
- DIBL
- GIDL（栅漏电流击穿）
- 穿通
- 窄沟道效应
- 热载流子注入
## Invertor
#### 理想 CMOS 反相器的特性
-  $V_{OH}=V_{DD}$ ， $V_{OL}=GND$ ，噪声容限很大
- 逻辑电平与器件的尺寸无关（无比逻辑）
- 稳态时 $V_{DD}$ 和 $GND$ 之间有具有有限电阻的通路，*低输出阻抗*
- MOS 管栅视为绝缘体，*高输入阻抗*
- 电源线/地线之间没有直接的通路，不消耗任何静态功率
#### 静态特性
- VTC：通过转换 PMOS 特性，找到交点，之后得到VTC曲线![](/img/dic/Pastedimage20251031135537.png)
- VTC曲线以及其中晶体管的工作模式![](/img/dic/Pastedimage20251031113639.png)
-  开关阈值计算： $V_{M}$ 为 $V_{in}=V_{out}$ 的点，且两管均处于*速度饱和态*（电源电压足够高）。令通过两管的电流相等，且忽略沟长调制效应，因此有：
$V_M = \frac{\left(V_{Tn} + \frac{V_{DSATn}}{2}\right) + r\left(V_{DD} + V_{Tp} + \frac{V_{DSATp}}{2}\right)}{1 + r}$
当 $V_{DD}$ 远大于与晶体管阈值电压/饱和电压时：
$V_M \approx \frac{rV_{DD}}{1 + r}$
其中，$r = \frac{k_p V_{dsatp}}{k_n V_{dsatn}} = \frac{k_p' V_{dsatp} \beta_p}{k_n' V_{dsatn} \beta_n}$ ，后面的等号，是为了方便算两个管的参数比才给出的，因为：$\frac{\beta_p}{\beta_n} = \frac{W_p/L_p}{W_n/L_n} = \frac{k'_n V_{dsatn} \left(V_M - V_{Tn} - \frac{V_{dsatn}}{2}\right)}{k'_p V_{dsatp} \left(V_{DD} - V_M + V_{Tp} + \frac{V_{dsatp}}{2}\right)}$ 。实际上，$r$ 本身就是前面公式最后一项里电压的比值，之所以写成这么复杂的式子，是为了方便导出两个管的参数比。当我们被要求计算参数比的时候，我们应该选取第二个与参数比有关的式子。
- $V_{M}$ 的一些性质
	- 它对于器件比值的变化相对来说不敏感
	- 改变器件的参数的影响是让 $VTC$ 的过渡区平移，当输入信号具有某些特质的时候，可以调整管子的宽长比，以得到比较理想的响应
	- <mark>有关尺寸比</mark>：尺寸比越大， $V_{M}$ 越大， $V_{M}$ 越大，尺寸比设计越大
- 在开关阈值处的增益：$g=\frac{1 + r}{(V_M - V_{Tn} - V_{DSATn}/2)(\lambda_n - \lambda_p)}$ ，它几乎完全取决于工艺参数（注意：*这里没有忽略沟长调制效应*），选择电源电压/晶体管尺寸只能造成很小的影响。
	- 尺寸比越大， $g$ 绝对值越大
- 求解增益的目的是找噪声容限。将VTC进行简化如下：![](/img/dic/Pastedimage20251031183111.png)
	- 这样，就可以将其视作一个线性的函数进行求解。于是有：$V_{IH} = V_M - \frac{V_M}{g}$ ，$V_{IL} = V_M + \frac{V_{DD} - V_M}{g}$，$NM_H = V_{DD} - V_{IH}$，$NM_L = V_{IL}$ 。因此，可以求出噪声容限。
- 电源电压降低一定的程度，可以提高 $g$ ，但是降太低，门的特性又会变差。所以电源电压有这样的要求 $V_{DDmin}>2\dots4 \frac{kT}{q}$ 
#### 动态特性
- 要求反相器的动态特性，也就是反相器在输入信号变化后，输出特性发生怎样的变化，就要知道反相器的延迟时间。而我们可以把反相器等效成如下的电路，并通过计算电容和电阻得到延迟时间。![](/img/dic/Pastedimage20251031192354.png)
- 电容：考虑一对串联反相器动态特性的寄生电容
	- 图：![](/img/dic/Pastedimage20251031214104.png)
	-  由于 $M_{1}$ 和 $M_{2}$ 不是断开就是处于饱和模式，栅漏电容 $C_{gd12}=2C_{GD0}W$ ，密勒效应之后，可以等效为接地的 $2C_{gd12}$ 
	- 对于扩散电容 $C_{db_{1}}$ 和 $C_{db_{2}}$ ，可以知道： $C_{eq}=K_{eq}C_{j_{0}}$ ，而 $\mathcal{C}_{eq} = -\frac{{\phi_0}^m}{(1-m)(V_{high}-V_{low})}[(\phi_0-V_{high})^{1-m}-(\phi_0-V_{low})^{1-m}]C_{j0} = K_{eq}C_{j0}$ 其中 $\phi_{0}$ 是内建结电势， $m$ 是梯度系数。 $V_{high}$ 是输出为高电平时漏结上的电压（反向电压）， $V_{low}$ 是输出为低电平时，且如果状态为从A到B，则应到达的那个状态的对应电压应该是达到幅值的 $50\%$ 时的漏结上的电压（注意另一边接的是体极，电压为 $0$ 或者 $V_{DD}$ ）。
		- 假设输出高电平为 $V_{out}$ 
		- 输出由高到低：NMOS： $V_{high}=-2.5V$ ，$V_{low}=-1.25V$ ；PMOS： $V_{high}=-1.25V$ ， $V_{low}=0$
		- 输出由低到高：NMOS： $V_{low}=0$ ，$V_{high}=-1.25V$；PMOS： $V_{low}=-1.25V$ ， $V_{high}=-2.5V$ 
		- *特别需要注意的是：计算完之后还要乘以面积/周长的！！！*
	- 扇出的栅电容：$C_{fanout}=(C_{GSON} + C_{GDON} + W_nL_nC_{ox}) + (C_{GSOP} + C_{GDOP} + W_pL_pC_{ox})$ 
		- 假设栅电容所有部分都在 $V_{out}$ 和 $GND$ / $V_{DD}$ 之间
		- 近似认为门沟道电容保持不变，并近似为 $W_nL_nC_{ox}$ （NMOS的情况）
	- 连线电容：直接代入即可

有关电容的表格总结：

| 电容        | 公式                                               |
| --------- | ------------------------------------------------ |
| $C_{gd1}$ | $2C_{GDOp} \cdot W_{n1}$                         |
| $C_{gd2}$ | $2C_{GDOp} \cdot W_{p2}$                         |
| $C_{db1}$ | $AD_{n1}K_{eqn}C_j + PD_{n1}K_{eqswn}C_{JSW}$    |
| $C_{db2}$ | $AD_{p2}K_{eqp}C_j + PD_{p2}K_{eqswp}C_{JSW}$    |
| $C_{g3}$  | $(C_{GDOn} + C_{GSO_n})W_{n3} + CoxW_{n3}L_{n3}$ |
| $C_{g4}$  | $(C_{GDOp} + C_{GSO_p})W_{p4} + CoxW_{p4}L_{p4}$ |
| $C_{w}$   |                                                  |
| $C_{L}$   | $\sum$                                           |
- 电阻：$R_{eq}=\frac{3}{4} \frac{V_{DD}}{I_{SAT}} \left( 1-\frac{7}{9}\lambda V_{DD} \right)$ 
- 传播延迟：
	- 需要注意的是传播延迟是到 $50\%$ 那个点的，结合前面的 RC Network 有关的知识，可以知道我们要求的 $t_{pHL}$ 和 $t_{pLH}$ 都可以用 $\ln2C_{L}R_{eq}$ 这个式子来解决掉。（注意 $t_{pHL}$ 和 $t_{pLH}$ 算出来的 $C_{L}$ 是有区别的，具体可以看前面结电容计算的叙述）
	-  $t_{p}=\frac{{t_{pHL}+t_{pLH}}}{2}$ 
	- 然而用上面那个公式还是太复杂了！在面对传播延迟的时候我们不得不进行一波简化。考虑如下的图：![](/img/dic/Pastedimage20251101002836.png)
		-  其中 $C_L = [(W_{n1} + W_{n2})C_{n0} + (W_{p1} + W_{p2})C_{p0} + C_w]$ （这显然是一个近似）
		- 然后一通算，并且把 $\beta_{1}=\frac{W_{p_{1}}}{W_{n_{1}}}$ 代入进去，有：
		- $t_{pHL}=\ln 2 L_{n1} R_{n0} [(1 + \frac{W_{n2}}{W_{n1}})C_{n0} + (\beta_1 + \frac{W_{p2}}{W_{n1}})C_{p0} + \frac{C_w}{W_{n1}}]$  
		-  $t_{pHL}=\ln 2 \frac{L_{n1}}{W_{n1}} R_{n0} \left[ (W_{n1} + W_{n2})C_{n0} + (W_{p1} + W_{p2})C_{p0} + C_w \right]$
		- $t_{pLH}=\ln 2 L_{p1} R_{p0} \left[ \left( \frac{1}{\beta_1} + \frac{W_{n2}}{W_{p1}} \right) C_{n0} + \left( 1 + \frac{W_{p2}}{W_{p1}} \right) C_{p0} + \frac{C_w}{W_{p1}} \right]$ 
		-  $t_{pLH}=\ln 2 \frac{L_{n1}}{W_{n1}} R_{n0} \left[ (W_{n1} + W_{n2})C_{n0} + (W_{p1} + W_{p2})C_{p0} + C_w \right]$ 
	- 这之后我们想知道如何设计器件以达到下面两种情况：
		- $t_{pHL}=t_{pLH}$ 此时，直接令两式相除，此时 $\frac{R_{p_{0}}}{R_{n_{0}}}=\beta$ （注意前面有写过 $\beta$ 定义了），可以通过计算两个电阻的比值直接计算出来 $\beta$ ，我们为了方便，令两个电阻之比为 $r$ 
		-  $t_{p}$ 最小，经过一些复杂的计算，我们可以知道，这时 $\beta=\sqrt{ r }$ 
		- 图示![](/img/dic/Pastedimage20251106181608.png)

#### 反相器链
- 上一节中的电容式子还是太复杂了，所以我们认为 $C_{L}=C_{int}+C_{ext}$ ，$C_{int}$ 代表反相器的自载（也即本征输出电容，与管子的扩散电容和栅漏覆盖电容有关）电容，$C_{ext}$ 是外部负载电容，来自扇出和导线电容，则 $t_{p}$ 可以被简化为： $t_{p}=0.69R_{eq}C_{int}\left( 1+\frac{C_{ext}}{C_{int}} \right)=t_{p_{0}}\left( 1+\frac{C_{ext}}{C_{int}} \right)$ 。因为我们想将把晶体管的尺寸也放入这个式子之中，于是我们定义参考门的电容与电阻为 $C_{iref}$ 与 $R_{ref}$ ，令 $C_{int}=SC_{iref}$ ， $R_{eq}=\frac{R_{ref}}{S}$，则 $t_{p}=t_{p_{0}}\left( 1+\frac{C_{ext}}{SC_{iref}} \right)$ ，但 $S$ 也不能无限大，因为这增加了硅片面积，在这里我们可以发现面积和延时的trade off。
- 实际情况中，反相器门是在反相器链中的。因此建立输入栅电容（在反相器链中，前一个电容的外部负载电容基本可以等效为后一个电容的栅电容）和本征输入电容的关系： $C_{int}=\gamma C_{g}$ ，则上面的公式可以变为：
$t_p = t_{p0}\left(1 + \frac{C_{ext}}{\gamma C_g}\right) = t_{p0}(1 + \frac{f}{\gamma})$ ，其中 $f$ 是等效扇出，也即外部负载电阻和输入电阻之间的比值。
- 假设有一个反相器链，也就可以列出一堆这样的式子，再求最小值。可以得到每一个反相器的最优尺寸（*当总延迟时间最短时*）：$C_{g,j} = \sqrt{C_{g,j-1} \cdot C_{g,j+1}}$ ，也就是所有级的 $f$ 都相等。于是有：$f = \sqrt[N]{\frac{C_L}{C_{g,1}}} = \sqrt[N]{F}$ （ $N=\frac{{\ln F}}{\ln f}$ ），这里的 $F$ 是负载电容和反相器中第一个栅电容之比，最小延时为：$t_p = N t_{p0}(1 + \sqrt[N]{F}/\gamma)$ 
- 对于 $\gamma=1$ ，$f_{opt}=3.6(4)$ 
- 解答类似问题的时候，需要注意下图中这样的也要算进电容里。![](/img/dic/Pastedimage20251102162057.png)
- 需要注意的是，反相器的输入信号不是立即跳变，而是有一定的上升和下降时间。而这正是前一级门的有限驱动能力造成的。考虑这点，可以得到反相器链中反相器 $i$ 传播延时的修正表达式：$t_p^i = t_{step}^i + \eta t_{step}^{i-1}$ ，其中 $t_{step}$ 是阶跃输入延时，也就是当输入信号上升时间为 $0$ 时的输出延时。当题目要求我们用这个公式进行电容大小的计算时，直接求出总时长，之后对每个电容求偏导就可以了。对第一级： $t_{p_{1}}=t_{s_{1}}$ ，结论类似于：![](/img/dic/Pastedimage20251110091423.png)
	-  当 $t_{s}>t_{p}$ 时，$t_{p}$ 随 $t_{s}$ 成线性增长
	-  $t_{s}$ 受前一级的驱动能力限制
  
#### 能量与功耗
- 注意：CMOS管invert在静态（无负载）和动态（有负载）的状态是不同的，后者因为有Load，实际的结果应该是如下图的![](/img/dic/Pastedimage20251107175706.png)
- CMOS 在静态工作时几乎没有功耗
- 动态功耗
	- 由充放电电容引起的功耗： $P_{dyn}=C_{L}V_{DD}^2f_{0\to1}=C_L V_{DD}^2 P_{0 \rightarrow 1} f = C_{EFF} V_{DD}^2 f$ ，其中 $f_{0\to1}$ 为 $0\to1$ 翻转频率，$P_{0\to 1}$ 是翻转因子，$f$ 是时钟速率，$C_{EFF}=P_{0\to1}C_{L}$ 为等效电容
		- 反相器翻转的最大可能的速率： $T=\frac{1}{f}=t_{pLH}+t_{pHL}=2t_{p}$ 
		- 翻转因子计算：对于输入统计学上互相独立的CMOS门 $P_{0\to 1}$ 是输出一个周期为 $0$ 的概率乘以下一个周期中为 $1$ 的概率。
	- 直接通路电流引起的功耗：波形的上升/下降时间并不为零，这导致在波形上升/下降时 $V_{DD}$ 与 $GND$ 之间出现一条直流通路，让两管同时导通。此时每个开关周期消耗的能量 $E_{dp}=t_{sc}V_{DD}I_{peak}$ ，平均功耗为 $P_{dp}=t_{sc}V_{DD}I_{peak}f=C_{sc}V_{DD}^2f$ ， $t_{sc}$ 为两个管同时导通的时间。
		-  $t_{sc} = \frac{V_{DD} - 2V_T}{V_{DD}} t_s \approx \frac{V_{DD} - 2V_T}{V_{DD}} \times \frac{t_{r(f)}}{0.8}$ 注意 $t_{r(f)}$ 是 $t_{rise}$ 或 $t_{fall}$ 
		- 计算 $I_{peak}$ ![](/img/dic/Pastedimage20251107152514.png)
		-  $I_{peak}$ 正比于晶体管的尺寸，也与输入/输出斜率之比相关。从下图可以看出， $C_{L}$ 大的时候输出变慢， $C_{L}$ 小的时候输出变快，这时动态功耗主要来自短路电流。这里我们可以看到功耗和速度的tradeoff![](/img/dic/Pastedimage20251103083136.png)
		- 具体计算：把 $I_{peak}$ 时候的电压代入到饱和时的公式，算得 $I_{peak}$ ，若没有 $t_{sc}$ ，利用类似的方法计算（如下图：![](/img/dic/Pastedimage20251106202004.png)
		- 短路电流功耗可以通过让输入输出信号上升/下降时间相等来最小化
		- 降低电源电压
- 静态功耗
	- 静态功耗 $P_{stat}=I_{stat}V_{DD}$
		- $I_{stat}$：泄漏电流，没有开关活动时，在电源两条轨线之间流动的电流。
		- 泄露电流的来源：晶体管的亚阈值电流，Gate leakage，Drain junction leakage(leakage一定是电源到地的)
		- 堆叠晶体管可以降低leakage

总功耗：
$P_{tot} = P_{dyn} + P_{dp} + P_{stat} = (C_L V_{DD}^2 + V_{DD} I_{peak} t_s) f_{0 \rightarrow 1} + V_{DD} I_{leak}$

- 一个逻辑门的质量评定指标
	- 功耗延迟积：$PDP=P_{av}t_{P}$ 
	- 能量延迟积： $EDP=PDP\times t_{p}$ 
- 确定晶体管尺寸使能耗最小
	- 通过性能约束（电路传播延时小于等于参考电路（ $f=1$ ）的延时）来确定尺寸系数 $f$ 和电源电压之间的关系，进而得到尺寸放大电路和能量的关系：$\frac{E}{E_{ref}} = \left(\frac{V_{DD}}{V_{ref}}\right)^2 \left(\frac{2 + 2f + F}{4 + F}\right)$ （ $\gamma=1$ ）
	- 画图可以找到 $min$ 值
#### 工艺尺寸缩小对反相器衡量指标的影响
- 缩小的技术
	- 全比例缩小：比例和电压缩小 $S$ 
	- 恒压缩小：只改变比例，电压不变
	- 一般化缩小：比例和电压按不同比例缩小
-  $S$ 所有器件缩小的因子/ $U$ 所有电压缩放的比例

| Parameter       | Relation         | Full Scaling | General Scaling | Fixed-Voltage Scaling |
| --------------- | ---------------- | ------------ | --------------- | --------------------- |
| $W, L, t_{ox}$  | -                | 1/S          | 1/S             | 1/S                   |
| $V_{DD}, V_T$   | -                | 1/S          | 1/U             | 1                     |
| $N_{SUB}$       | $V/W_{depl}^2$   | S            | $S^2/U$         | $S^2$                 |
| Area/Device     | $WL$             | 1/$S^2$      | 1/$S^2$         | 1/$S^2$               |
| $C_{\alpha}$    | 1/$t_{ox}$       | S            | S               | S                     |
| $C_{gate}$      | $C_{ox}WL$       | 1/S          | 1/S             | 1/S                   |
| $k_n k_p$       | $C_{ox}W/L$      | S            | S               | S                     |
| $I_{sat}$       | $C_{ox}WV$       | 1/S          | 1/U             | 1                     |
| Current Density | $I_{sat}/Area$   | S            | $S^2/U$         | $S^2$                 |
| $R_{on}$        | $V/I_{sat}$      | 1            | 1               | 1                     |
| Intrinsic Delay | $R_{on}C_{gate}$ | 1/S          | 1/S             | 1/S                   |
| $P$             | $I_{sat}V$       | 1/$S^2$      | 1/$U^2$         | 1                     |
| Power Density   | $P/Area$         | 1            | $S^2/U^2$       | $S^2$                 |

## 导线
- 集成电路的导线模型![](/img/dic/Pastedimage20251103093115.png)
- 导线模型的简化
	- 忽略电感：电阻很大（截面很小的长铝导线），外加信号的上升/下降时间很慢
	- 只含电容：导线短。导线截面大，使用互连材料电阻率很低
	- 忽略导线相互间的电容：相邻导线的间距很大，且导线只在很短的距离上靠近在一起的时候
- 互连线设计的规则/趋势
	- 更好的互连材料（铜或者硅化物，带来更好的导电性）/低介电常数材料（更低的电容）
	- 先进的互联拓扑结构/更多的互连层；互连层较低层为薄密层，较高层为厚宽层。
#### 电容
- 平行板电容模型： $C_{int}=\frac{\epsilon_{di}}{t_{di}}WL$ ![](/img/dic/Pastedimage20251103093548.png)其中 $\epsilon_{di}=\epsilon_{r}\epsilon_{0}$ ，为绝缘层材料介电系数
- 由于我们想要在减小工艺尺寸的同时让导线的电阻最小，因此要保证截面 $W\times H$ 尽可能大，而同时我们也希望 $W$ 较小，来减小面积开销。因此 $\frac{W}{H}$ 就越来越小了。在这种情况下，导线侧面和衬底之间的电容不能被忽略。于是有 $C_{fringe}$ ，则导线的总电容为：$C_{wire} = C_{pp} + C_{fringer} = \frac{w \epsilon_{di}}{t_{di}} + \frac{2 \pi \epsilon_{si}}{\log(2t_{di}/H + 1)}$ ，$w=W-\frac{H}{2}$ 为对平板电容宽度的近似。
- 现代半导体工艺提供了更多的互连层，因此要考虑更多的电容![](/img/dic/Pastedimage20251103113258.png) 上图中可以用 $C_{total}=C_{internal-layer-interwire}+C_{inner-layer-interwire}+C_{ground}$ 来表示，*随着器件缩小，主要的电容是interwire电容*
- 一般来说这些电容难以计算，一般计算题会给出图表。如何看图：![](/img/dic/Pastedimage20251103113657.png)这类计算题还需要注意的是计算边缘电容时要×2
#### 电阻
- 矩形导体的电阻 $R=\frac{\rho L}{A}$ 其中 $A=HW$ ，是截面积。给定的工艺中， $H$ 是一个常数，故公式为 $R = R_{\square} \frac{L}{W}$ ， $R_{\square}=\frac{\rho}{H}$ ，称作材料的薄层电阻
- 布线层之间的转接带来额外电阻（接触电阻），比较好的测量是使信号线保持在同一层上避免过多的接触或通孔。接触孔较大可以降低接触电阻，但电流常常集中在较大接触孔的周边。
- 在较高的频率下，半导体导线会出现趋肤效应。高频电流倾向于主要在导体的表面流动，电流密度随进入导体的深度而*指数*下降。这也影响了导线电阻。
	-  $\delta$ 为电流下降为它的额定值的 $e^{-1}$ 时所处的深度， $\delta=\sqrt{ \frac{\rho}{\pi f\mu} }$ 
	- 近似为电流均匀流过导体的厚度为 $\delta$ 的外壳，如下图所示![](/img/dic/Pastedimage20251103144140.png)每单位长度电阻的表达式 $r(f)=\frac{\sqrt{ \pi f\mu\rho }}{2(H+W)}$ 
	- 电阻增加率： $\text{Resistance increase rate} = \frac{r(f) - r}{r} = \frac{1}{2} \sqrt{\frac{\pi f \mu}{\rho}} \frac{H}{H/W + 1} - 1$ ，减少电阻增加率需要：
		- 降低频率 $f$
		- 减小导体的宽度 $W$
		- 增大电阻率 $\rho$ 
	- 高频时电阻增加 → 导线上传送的信号有额外的衰减，产生失真。趋肤深度等于导体最大尺寸（ $W$ / $H$ ）一半的频率 $f_s = \frac{4\rho}{\pi \mu (\max(W, H))^2}$ ，低于这个频率，整个导线都导通电流，电阻为常数。
	- 趋肤效应是较宽导线才有的问题，常常影响时钟信号这类。
#### 串扰（电容寄生效应）
- 串扰是互连线中电容的寄生效应产生的。由相邻的信号线和电路节点之间不希望的耦合引起的干扰通常叫串扰
- 根据受串扰的线的性质的不同，可以分为两种情况
	- Floating line
		- 图示![](/img/dic/Pastedimage20251103153002.png)
		- 当Aggressor的电压发生变化时，节点Victim的电压也受到串扰发生变化。
		- $\Delta V_{victim} = \frac{C_{adj}}{C_{gnd-v} + C_{adj}} \Delta V_{aggressor}$ 
	- Driving line
		- 图示![](/img/dic/Pastedimage20251103152945.png)
		- 注意Victim此时并非浮空 ，而是被有源驱动。
		-  $\Delta V_{victim} = \frac{C_{adj}}{C_{gnd-v} + C_{adj}} \frac{1}{1 + \kappa} \Delta V_{aggressor}$ ，其中：$\kappa = \frac{\tau_{aggressor}}{\tau_{victim}} = \frac{R_{aggressor}(C_{gnd-a} + C_{adj})}{R_{victim}((C_{gnd-v} + C_{adj})}$ 
	- 二者的对比：如果受扰方浮空，则噪声一直持续；若受扰方被驱动，则受扰方在一段事件后复原。
- 串扰的影响![](/img/dic/Pastedimage20251110093727.png)
- 串扰与性能
	- 图示![](/img/dic/Pastedimage20251104090435.png)
	- 三根导线同时翻转， $Y$ 的翻转方向和另两根相反。但 $X$ 与 $Z$ 两根导线的信号会通过和 $Y$ 之间的耦合电容对 $Y$ 信号造成影响，这部分影响可以用密勒效应解释（我们可以把它等效为一个负载电容）
	- 于是逻辑门 $Y$ 上的总负载电容取决于临近信号的数据变化情况，范围为 $C_{GND}\leq C_{L}\leq C_{GND}+4C_{c}$ 
- 克服电容串扰的方法（控制电路的几何形态，或者采用对耦合能量不敏感的信号传输规范
	- 尽量避免浮空节点；事先知道对串扰问题敏感的节点（如预充电总线），可以增加保持器件
	- 敏感节点与全摆幅信号隔离
	- 满足时序约束的范围内增加上升/下降时间
	- 导线排布方式![](/img/dic/Pastedimage20251104084613.png)
		- 交错排列中继器
		- 电荷补偿
		- 双绞线差分信号传输
	- 降低两条信号线之间的电容（让同一层上的平行导线尽量足够远离，和邻层的导线互相垂直）
	- 在两个信号之间增加屏蔽线（让线间电容转变为接地电容，消除干扰，但增加了电容负载）![](/img/dic/Pastedimage20251104084425.png)
	- 在长导线上使用Regenerators
		- 当电线初始为“0”时，再生器感测到上升沿并加速它。相反，当电线初始为“1”时，再生器会加速下降沿。
#### 导线模型
- 理想导线模型
	- 没有附加参数或寄生效应，对电路的电气行为没有影响
	- 导线一端的电压变化会立即传播到另一端
	- 导线的每一段在任何时刻都有相同的电压，导线是一个等势区域
- 集总模型：把不同的寄生元件集总成单个电路元件
	- 前提：只有一个寄生元件占支配地位，且元件之间相互作用很小/只考虑电路特性的一个方面
- 集总模型（Lump-C Model）
	- 前提：导线的电阻部分很小。且开关频率低/中
	- 分布电容集总为单个电容![](/img/dic/Pastedimage20251104091503.png)
	- 方程：$C_{lumped} \frac{dV_{out}}{dt}+ \frac{{V_{out}-V_{in}}}{R_{driver}}=0$ 
	- 若 $V_{in}$ 是阶跃的输入
		- $V_{out}=(1+e^{ -t/\tau })$ 
		-  $\tau=R_{driver}C_{lumped}$ 
- 集总RC模型
	- 长度超过几毫米的片上有较明显的电阻，这时也需要等效电阻。
	- 图示![](/img/dic/Pastedimage20251104092348.png)
	-  $C_{lumped} \frac{dV_{out}}{dt}+ \frac{{V_{out}-V_{in}}}{R_{driver}+R_{wire}}=0$ 
	-  $\tau=(R_{driver}+R_{wire})C_{lumped}$ 
- 电阻-电容网络与 Elmore 延时公式
	- 大多数电路可以表示成一个RC树![](/img/dic/Pastedimage20251104093221.png)
		- 电路仅有一个输入节点 $s$
		- 所有电容都在某节点和地之间
		- 电路不包含电阻回路
	- 特性：源节点 $s$ 和电路的任何节点 $i$ 之间存在一条唯一的电阻路径 $R_{ii}$ 
	- 共享路径 $R_{ik}$：根节点 $s$ 到节点 $k$ /节点 $i$ 这两条路径共享的电阻
		- $R_{i4}=R_{1}+R_{3}$
	- Elmore 延迟模型的两种描述：从信号源 $s$ 翻转到其中一个叶子节点 $i$ 发生变化之间的延时为
		-  $\tau_{Di}=\sum_{k=1}^NR_{ik}C_{k}$ （遍历RC树的每个电容）
		-  $\tau_{Di}=\sum_{R_{k}\ along\ path\ s\to i}^{No.of\  R\ along\ path\ s\to i}R_{k}(sum\ of\ C_{x}\ driven\ by\ R_{k})$ （遍历分析路径上的每个电阻
- 分布RC模型
	- 集总RC模型对于长互连线是保守而不精确的模型
	- 图解![](/img/dic/Pastedimage20251104135351.png)
	- 每一节点的电压由微分方程确定
	- 计算出来的值很复杂，这里写不下
	- 最好的方法还是用集总模型对其进行近似
	- 用RC Chain对上述过程进行近似：![](/img/dic/Pastedimage20251104140701.png)有 $\tau_{DN} = r\Delta Lc\Delta L + 2r\Delta Lc\Delta L + \cdots + Nr\Delta Lc\Delta L = \frac{N(N + 1)rc}{2}\Delta L^2 = \frac{N(N + 1)rcL^2}{2} \frac{RC}{N^2} \approx \frac{RC}{2}=\frac{RCL^2}{2}$ 
		- 导线的延时是长度的二次函数
		- 注意分布rc线的延时是按集总模型预测的延时的一半（因为分布式是沿电路分布而不是全部集中在末端）
		- 集总模型代表了电阻导向延时的保守估计

分布式/集总/用RC Chain近似分布式的对比：

| Voltage range       | Lumped   | Distributed | Elmore Model       |
| ------------------- | -------- | ----------- | ------------------ |
| 0 → 50% ($t_{p}$)   | $0.69RC$ | $0.38RC$    | $\mathbf{0.345RC}$ |
| 0 → 63% ($\tau$)    | $RC$     | $0.5RC$     | $\mathbf{0.5RC}$   |
| 10% → 90% ($t_{r}$) | $2.2RC$  | $0.9RC$     | $1.1RC$            |
| 0% → 90%            | $2.3RC$  | $1.0RC$     | $\mathbf{1.15RC}$  |
###### 经验规则
- 导线延时在近似/超过驱动门的 $t_{pgate}$ 时才进行考虑
	- 临界值 $L_{crti}=\sqrt{ \frac{t_{pgate}}{0.38rc} }$ ，超过这个长度，RC值才占主要地位
- 导线延时在导线输入信号的上升下降时间小于导线的上升下降时间才考虑
	- $t_{r}<RC$ ，$R$ ，$C$ 为导线的总电阻和总电容
#### 电阻寄生效应
- 导线上的电压降导致欧姆电压降，降低信号电平
	- 解决方法：缩短电源引线端与电路的电源接线端的最大距离
- 解决RC延时的方法
	- 采用更好的互连材料（电阻较低的铜或者低介电常数的介质）
	- 对于存储器中的地址线![](/img/dic/Pastedimage20251104143700.png)
		- 从线的两端驱动
		- 增加一条额外的金属线（旁路
	- 对角线布线
	- 插入中继器（反相器或缓冲器），每段互连线长度缩短至 $\frac{L}{m}$ ，可以找到中继器之间的最优距离/最优数目使得总延时最小
		- 最优数目 $m_{opt} = L \sqrt{\frac{0.38rc}{t_{pbuf}}} = \sqrt{\frac{t_{pwire(unbuffered)}}{t_{pbuf}}}$ ， $t_{pbuf}$ 是中继器的固定延时。对应的最小延时是： $t_{p,opt}=2\sqrt{ t_{pwire(unbuffered)} t_{pbuf}}$ ，此时各导线段的延时等于中继器的延时
		- 但上面的计算没有考虑负载电容
		- 考虑负载电容之后：$t_p = m \left( 0.69 \frac{R_d}{s} \left( s\gamma C_d + \frac{cL}{m} + sC_d \right) + 0.69 \left(\frac{rL}{m} \right) \left( sC_d \right) + 0.38rc \left(\frac{L}{m}\right)^2 \right)$ ，其中 $s$ 是反相器尺寸缩放的倍数，$R_{d}$ ，$C_{d}$ 是反相器的电阻和输入电容，$\gamma$ 是中继器的本征输出电容和输入电容之比，$m$ 是划分的段数
			- 对 $m$ ，$s$ 分别求偏导，可以得到最佳的情况
				- $m_{opt}=L\sqrt{ \frac{0.38rc}{0.69R_{d}C_{d}(\gamma+1)} }=\sqrt{ \frac{t_{pwire(unbuffered)}}{t_{p_{1}}} }$ 
				- $s_{opt}=\sqrt{ \frac{R_{d}c}{rC_{d}} }$ 
				- $t_{p,min}=(1.38+1.02\sqrt{ 1+\gamma })L\sqrt{ R_{d}C_{d}rc }$ 
				- $L_{crit}=\frac{L}{m_{opt-load_{1}}}=\sqrt{ \frac{t_{pbuff_{1}}}{0.38rc} }$
				- $t_{p,crit}=\frac{t_{p,min-load_{1}}}{m_{opt}}=7.9t_{p_{0}}$ 
				- 最佳线长和延时与 $L$ 无关
## 如何看版图
![](/img/dic/Pastedimage20251027150558.png)

![](/img/dic/Pastedimage20251110153613.png)
- connect: metal-diffusion / metal-pol
- via: metal-metal
除了正常地看一些MOS版图，有一些比较复杂的版图可以这样看待：
对于黑色的contact，它的边长是 $2\lambda$ （这是设计规则决定的）
![](/img/dic/Pastedimage20251107174856.png)
对于MOS门，经常用Width/Length来表示。
最小的size是 $4\lambda/2\lambda$ ，一般称作1个unit（我们可以从接触孔尺寸中看出这一点）
这种曲里拐弯的可以这样看
![](/img/dic/Pastedimage20251112095528.png)
![](/img/dic/Pastedimage20251119112502.png)
![](/img/dic/Pastedimage20251119112718.png)
## Hspice

引用子电路首字母

| Letter | Element                           |
|--------|-----------------------------------|
| R      | Resistor                          |
| C      | Capacitor                         |
| L      | Inductor                          |
| K      | Mutual Inductor                   |
| V      | Independent voltage source        |
| I      | Independent current source        |
| M      | MOSFET                            |
| D      | Diode                             |
| Q      | Bipolar transistor                |
| W      | Lossy transmission line           |
| X      | Subcircuit                        |
| E      | Voltage-controlled voltage source |
| G      | Voltage-controlled current source |
| H      | Current-controlled voltage source |
| F      | Current-controlled current source |
## 组合逻辑
#### 互补CMOS
![](/img/dic/Pastedimage20251110141551.png)
- 互补CMOS可以用来实现组合逻辑
	- NMOS串联相当于AND，并联相当于 OR
	- 上拉下拉互为对偶网络
	- 本质上是反相的，若想实现AND/OR/XOR需要加一级反相器
- CMOS特性（静态）
	- 全电压摆幅，高噪声容限
	- 不依赖器件尺寸，无比例要求（无比逻辑）
	- 总有通向 $V_{dd}$ 或 $GND$ 的通路，输出阻抗低
	- 零稳态输入电流，高输入阻抗
	- 稳态无直流通路，无静态功耗
	- 传播延迟取决于 $C_{L}$ 和晶体管电阻
#### 延时
- 计算delay：将MOS管看成含有开关的电阻，用 $\ln2RC$ 计算（也可以用elmore模型）
	- 对于复杂的上拉/下拉网络，常常需要让网络电阻的等效电阻和标准invertor的电阻相等，具体方法是改器件的尺寸（考虑最差情况，*尤其是上拉网络*）（其目的是为了让充电/放电的电阻与minimum-sized invert相等）
	- 为了方便计算：NMOS与PMOS较标准mos管的等效：![](/img/dic/Pastedimage20251119113532.png)（因为pmos载流子能力是nmos的1/2，所以是2倍），一些快速确定管子size的技巧：如果是串联那么size乘2，如果是并联，那么不变
	- 计算的结果与input的类型（low→high/high→low）有关
	- 计算一个复杂电路的delay
		- 首先找到上拉/下拉通路
		- 之后找到其中每个节点的电阻/电容
		- 用Elmore delay进行计算
		- propagation delay是最长的delay
		- contamination delay是最短的delay（可以预设提前放掉了电容上的电）
	- Fan in & Fan out 对 $t_{p}$ 的影响：
		- Fan in: 二次（电阻\*电容）+线性
		- Fan out：线性（each additional fanout gate adds two gate caps to CL）
- Fan in 比较大的时候，有哪些优化方法
	- Transistor reordering：重排序，把晚到达的信号安排在离输出更接近的地方
	- Progressive Size：逐级递增的尺寸，越靠近输出的管子尺寸越小
	- Alternative Logic Structures：用更小fan-in的门进行电路组合
	- Buffer Insertion：在fan out之前插入反相器做为buffer，来隔离fan in和fan out
- 逻辑门的延时
	- Gate delay： $d=p+h=p+g\cdot f$ 
	- $p$ 本征延时：输出对应的gate的size除以3
		- NAND：$p=n$
		- NOR：$p=n$
		- MUX：$p=2n$
		- XOR/XOR(2输入)：$p=4$ 
	- $h$ 努力延时
	- $g$ 逻辑努力 $\frac{C_{g-logicgate}}{C_{g-inv}}$ 简而言之就是某个输入（与输入的个数无关）对应的gate的size除以3
		- NAND：$g=\frac{n+2}{3}$ 
		- NOR：$g=\frac{2n+1}{3}$ 
		- MUX：$2$
		- XOR：$n2^{n-1}$ 
	- $f$ 等效扇出：扇出电容与当前门的输入电容的比值
		- $f=\frac{C_{i+1}}{C_{i}}$ 
		- 例题图示：![](/img/dic/Pastedimage20260107231845.png)
- 多级网络延时
	- 分支努力：$b=\frac{{C_{on-path}+C_{off-path}}}{C_{on-path}}$ （注意定义）
	- $D = \sum_{i=1}^{N} (p_i + g_i \cdot f_i \cdot b_i) = \sum_{i=1}^{N} (p_i + h_i) = \sum_{i=1}^{N} d_i$ 
		- $h_i = g_i f_i b_i$
		- $F = C_{out} / C_{in} = \prod f_i$ 
		- $D = \sum d_i = \sum p_i + \sum h_i$ 
		- 如果给了 $x_{i}$ 之类的，就使用这个公式：$d_i = p_i + \frac{g_{i+1}x_{i+1} + x'_{i+1}}{x_i}$
			-  $x_i$ 第 $i$ 级逻辑门的尺寸系数（Size）。表示该门相对于单位反相器的倍数。
			- $x_{i+1}$ 下一级（第 $i+1$ 级）主路径逻辑门的尺寸系数。
			- $g_{i+1}$ 下一级（第 $i+1$ 级）逻辑门的逻辑努力。
			- $x'_{i+1}$ 分支负载的等效尺寸系数。这是将物理电容值转化为等效的单位反相器尺寸（通常通过除以单位电容 $C_{min-inv}$ 得到）。
	- 优化：$h^N=GBF$  
		- $h = \sqrt[N]{GBF}$
		- 第 $n$ 级
			- $h_N = h = g_N b_N f_N = g_N b_N \frac{c_{N+1}}{c_N}$
			- $c_N = g_N b_N \frac{c_{N+1}}{h}$
		- $G = g_1 g_2 \ldots g_N$ 
		- $B = b_1 b_2 \ldots b_N$ 
		- $H = GFB = \prod g_i f_i b_i$ 
- Asymmetric Gates
	- 某个输入比其他输入在电路中位置更重要的时候，可以用更小的管子进行优化，但是同一支路的总电阻不变（倒数加和为1或者2）
		- 但总的逻辑努力增加了
- Skewed gates: The high-to-low and low-to-high propagation delays are not equal
	- z减小非关键管子的尺寸来优化电路
	- 高偏斜门：有利于上升
	- 低偏斜门：有利于下降
	- 这里计算的逻辑努力需要区分上升/下降，注意与上升/下降效果一样的标准门进行比较
	- 标准的一些门：![](/img/dic/Pastedimage20260107233532.png)
#### Power Analysis
| Power Type | Constant Throughput/Latency                               | Variable Throughput/Latency                                            |                                                              |
| ---------- | --------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
|            | Design Time（芯片设计阶段）                                       | Non-active Modules（芯片运行时，但某些特定的模块不工作）                                  | Run Time（系统根据当前的负载情况动态调整性能）                                  |
| Dynamic    | Active Factor（逻辑优化减少不必要的翻转）<br />Variable $V_{dd}$ （选择多电压域） | Clock Gating（门控时钟，直接切断该模块的时钟信号）                                        | DFS, DVS (Dynamic Freq, Voltage Scaling)（任务轻时，同时降低时钟频率和供电电压） |
| Leakage    | Variable-$V_T$ （采用多阈值电压设计）                                | Sleep Transistors（不工作时，切断电源）<br />Variable $V_T$ （调节衬底电压，改变阈值电压，从而抑制漏电流） | Variable $V_T$ （自适应体偏置，高性能时降低 $V_{T}$ ，空闲时提高 $V_{T}$ ）       |
- Active Factor： $P_{dyn}=C_{L}V_{DD}^2f_{0\to1}=C_{L}V_{DD}\alpha_{0\to1}F$ 
	- $\alpha_{0\to1}=p_{0}p_{1}$ （一个周期中状态为 $0$ 的概率 $p_{0}$ 乘以下一个周期中为状态 $1$ 的概率 $p_{1}$ ）
	- 输入相互独立并均匀分布，任何 $N$ 输入的静态门的翻转概率：$\alpha_{0\to 1}= \frac{N_{0}}{2^N} \frac{N_{1}}{2^N}$ 
		- $N_{0}$：CMOS逻辑门真值表中输出为0的数量；$N_{1}$：CMOS逻辑门真值表中输出为1的数量。
	- Reduce Switching Activity
		- Logic Restructuring：调整门电路连接结构，降低节点的开关活动率
		- Input Ordering：将概率最低的输入信号放在最前面，降低整个电路的功耗
		- Time-multiplexing resource：进行资源时分复用，利用信号之间的相关性（A为0时B为1，如果二者走一条线，就不会翻转）来降低翻转率
	- Glitch Reduction by balancing signal paths
		- 当信号通路不平均时，会由于不同的门延时产生不必要的翻转，从而提升翻转率，可以通过平衡信号通路/插入buffer拉平延迟来降低翻转率
- Varible $V_{T}$ (Multiple Supply Voltages)
	- inside a block
		- 非关键路径移到比较低的电源电压（减慢速度但省功耗）
		- 低电压和高电压交界处，需要插入电平转换器
	- Block-level
		- 高吞吐量/低延迟的模块用较高的电源电压
		- 较慢的功能模块用较低的电源电压
		- 把相同电压的模块放在一起，独立供电，在模块边界处进行电平转换
	- shared N well为了节省面积，把高电压和低电压的PMOS管的衬底都连在偏高的电压上，减小了隔离间距和芯片面积，但产生了体效应，使低电压的管子变慢
	- 高电压驱动低电压的门是安全的，但低电压驱动高电压的门是坏的（会导致后级高电压门出现两管均导通的现象），需要用电平转换器来调整电压![](/img/dic/Pastedimage20260108154708.png)
- Clock Gating：用锁存器生成disable signal，切断空闲时对应模块的时钟信号![](/img/dic/Pastedimage20260108155621.png)
- Dynamic voltage and frequecy scaling
	- 动态调整工作电压和时钟频率以降低功耗
- 多阈值电压
	- 混合使用不同阈值的晶体管，低阈值的晶体管速度快但漏电多，用于关键路径；高阈值的晶体管速度慢但漏电少，用于非关键路径
	- 通过利用体效应改变阈值电压
	- 正向体偏置：降低阈值电压绝对值 ，提升运行速度（降低阈值电压可以增大mos管源漏之间的电流，从而提高对负载充放电的速度）
	- 反向体偏置：提升阈值电压绝对值，抑制漏电
- 也可以利用堆叠效应（由DIBL效应，源漏电压会造成阈值电压的变化，源漏电压越高，阈值电压越小）降低漏电流
	- 将晶体管堆叠在一起之后，源漏电压减小，从而可以降低漏电流![](/img/dic/Pastedimage20260108163140.png)
- Sleep Transistors/Power Gating![](/img/dic/Pastedimage20260108163918.png)
	- 消除不工作模块的静态漏电，在电源/地和电路之间串联巨大的开关管
	- 在断电的模块和之后的模块之间必须加入隔离单元，防止浮空节点造成输出漂移
	- 开关管
		- NMOS 或者 PMOS
		- 其中NMOS管由于是电子导电较PMOS更省面积
		- 用高阈值电压的管子防止自身漏电
		- 双开关管漏电最低
#### 有比逻辑（Ratioed Logic）
- 相比于互补CMOS（需要2N个管子），有比逻辑试图减少晶体管数量（通常是N+1个）。
- 减少了器件数量，面积小，通常速度快（因为负载电容小）。
- 牺牲了鲁棒性（噪声容限降低）并且存在静态功耗（Static Power Dissipation）。
- 负载类型
	- 电阻负载![](/img/dic/Pastedimage20260108165759.png)
		- $V_{OL}=\frac{R_{PN}}{R_{PN}+R_{L}}V_{DD}$ 
		- 大电阻：降低 $V_{OL}$ ，增加噪声容限，但 $t_{pLH}$ 变慢
		- 小电阻：翻转速度快，但 $V_{OL}$ 变高，静态功耗增加
	- 耗尽型负载（$V_{T}<0$ ）：用耗尽型NMOS做负载
	- 伪NMOS负载（Pseudo-NMOS）
		- 栅极接地的PMOS代替电阻，前提是下拉网络比PMOS更强
		- $V_{OL}$ 小于下一级的 $V_{IL}$ ，且小于NMOS管的阈值电压 $V_{tn}$ 
		- 面积小，负载小，但是有静态功耗
		- 计算 $V_{OL} \approx \frac{k_p(-V_{DD} - V_{Tp}) \cdot V_{DSAT}}{k_n(V_{DD} - V_{Tn})} \approx \frac{\mu_p \cdot W_p}{\mu_n \cdot W_n} \cdot |V_{DSAT}| \quad (\text{assuming that } V_{Tn} = |V_{Tp}|)$ 
		- 计算逻辑努力![](/img/dic/Pastedimage20260108175142.png)
			- 净下拉电流 = NMOS下拉电流 - PMOS上拉电流
			- 用净下拉电流与给到同样下拉电流的标准的invertor进行计算，可以得到 $g_{d}$ 
			- 用PMOS上拉电流与给到同样上拉电流的标准的invertor进行计算，可以得到 $g_{u}$ 
			- 计算 $p_{u}$ ，$p_{d}$ 也是一个道理
		- 与CMOS相比，NAND更慢，NOR更快，且对于NOR，逻辑努力与input的个数无关，因此伪NMOS负载特别适合做宽口径的NMOS门
#### 其他组合逻辑
- 差分串联电压开关逻辑（DCVSL）：解决了伪NMOS有静态功耗的问题，且降低 $V_{OL}$ ，减短充电时间![](/img/dic/Pastedimage20260108175544.png)
- 传输管逻辑（Pass-Transistor Logic）相比CMOS可以减小功耗，面积以及延时
	- 基本模块：![](/img/dic/Pastedimage20260108181121.png)
	- 由于PMOS/NMOS的导通限制，NMOS只能传输强0信号，PMOS只能传输强1信号
	- 传输管的输出不能连在下一级的栅极上（也是由于导通必须要 $V_{GS}>V_{T}$ ）![](/img/dic/Pastedimage20260108182226.png)
	- 对于NMOS only的这类电路，NMOS需要的切换能量更小，同时产生的弱1会导致下一级电路出现漏电流
- 互补传输管逻辑（Complemetntary Pass Transistor Logic/Differential Pass Transistor Logic）![](/img/dic/Pastedimage20260108203200.png)
	- 主要思路是用MUX的公式 $F=A\cdot S+B\cdot  \bar{S}$ ，并且把选择信号跟 $A/B$ 扯上关系
	- 这种设计非常模块化，使得设计电路库非常方便
	- 但是仍然会出现信号在传播中下降的现象
		- Level Restoring Transistor：![](/img/dic/Pastedimage20260108203823.png)
			- 带来全摆幅输出
			- $M_{r}$ 一定是一个弱管，不然A从1→0的时候会出现争用的现象
		- 改进：SRPL![](/img/dic/Pastedimage20260108204451.png)
	- transistor的管子用0或低阈值的晶体管
		- 但仍然带来问题，因为 $V_{S}$ 随着充电逐渐增大，导致体效应愈发明显，阈值电压还是会大于 $1$ ，同样无法带来全摆幅。
	- 使用传输门![](/img/dic/Pastedimage20260108204800.png)
		- 传输门的电阻取决于 $V_{in}$ 和 $V_{out}$ ，但传输过程之中，传输门的电阻变化不大，使得传输的信号比较具有一致性
		- 可以做到全摆幅传输
		- 传输门XOR![](/img/dic/Pastedimage20260108210008.png)
		- 计算传输门的延时：直接用传输门的等效电阻取代传输门![](/img/dic/Pastedimage20260108210238.png)
			- $\tau(V_n) = \sum_{k=0}^{n} CR_{eq}k = CR_{eq}\frac{n(n+1)}{2}$ 
			- 对传输门的延时进行优化：![](/img/dic/Pastedimage20260108210613.png)
#### Dynamic Logic Gate
- 与静态电路的区别：依赖于将信号值暂时存储在高阻抗节点的电容上，于CMOS相（$n$ 个扇入需要 $2n$ 个器件）比，$n$ 个扇入只需要 $n+2$ 个晶体管
- 有两个phase，预充电phase和求值phase![](/img/dic/Pastedimage20260108211232.png)
- 优点
	- 晶体管数更少
		- 输入信号少驱动了PMOS，使前一级的输入电容减半，降低负载电容
		- 减小了输出节点的寄生电容
	- （由于负载电容变小）速度更快
	- 全输出摆幅
	- 无比逻辑
	- 没有静态功耗
- 缺点
	- 总体功耗高于静态CMOS
		- vdd和gnd之间没有静态路径
		- 无毛刺
		- 有更高的翻转率
			- $\alpha_{0\to1}=\frac{N_{0}}{2^N}$ 
		- 时钟带来额外负载
	- 需要预充电
	- 一旦动态门的输出被放电，在下一次预充电操作之前无法再次充电
		- 输入如果从高电平到低电平，则输出端无法检测到这样的变化
	- $V_M$、$V_{IH}$ 和 $V_{IL}$ 等于 $V_{Tn}$，导致有低噪声容限 ($NM_L = V_{IL} - V_{OL}$)
- 如果时钟在低电平时，输入拉高，则会发生竞争
	- 在下拉网络底部再加一个晶体管(foot)
- 由于预充电并不是关键路径，可以缩小预充电晶体管的尺寸，使其有效电阻为下拉网络的两倍
- 计算逻辑努力：只考虑下拉网络的，思路一致：根据产生与单位反相器相同的电流的晶体管尺寸进行计算![](/img/dic/Pastedimage20260108214753.png)
- 带来的问题
	- Charge Leakage：即使下拉的这些NMOS都关闭，但也难免有漏电流（主要来自反偏二极管泄漏和亚阈值导通），输出电压遂时间下降，最终稳定在一个中间电压值（形成了由上拉电阻和下拉电阻组成的分压器）
		- 解决方案：使用电压保持器（Keeper）![](/img/dic/Pastedimage20260108215649.png)
		- 注意需要做得比较弱，因为它会跟下拉网络竞争电流
			- 如果这个管子size比较大，那么抗噪声能力会更好，但会带来速度下降，功耗增加，更难被拉低这样的问题
		- 设计方法：
			- 增大管子沟道长度，但这会增加栅极电容，从而增加负载
			- 串联两个最小尺寸的管子，可以更灵活地调整等效电阻![](/img/dic/Pastedimage20260108220016.png)
	- Charge Sharing：在CLK=0的时候，电荷在内部节点和输出节点上进行分享，导致输出节点上的电平降低![](/img/dic/Pastedimage20260108221955.png)
		- 计算：具体用那种方法，其实取决于 $C_{L}$ 和 $C_{a}$ 的大小，是否能够在X节点上升到 $V_{DD}-V_{Tn}$ 的临界之时达到平衡（$M_{a}$ 的栅极是$V_{DD}$ 所以有了这样的临界）
			- $\Delta V_{out} > -V_{Tn}$：如果 $C_{L}$ 很大（$V_{Tn}$ 很小），Out节点的电压几乎完全不变，那么有公式：$\Delta V_{out} = -\frac{C_a}{C_L} [V_{DD} - V_{Tn}(V_X)]$ 
			- $\Delta V_{out} < -V_{Tn}$：$C_a$ 太大， $C_L$ 太小，导致 $V_{out}$ 被拉低得非常厉害，跌破了 $V_{DD} - V_{Tn}$ ，那么有公式： $C_L V_{DD} = (C_L + C_a) V_{final}$ 
		- 解决方案：使用次级预充电晶体管 (secondary precharge transistors)对部分或所有内部节点进行预充电来克服电荷分享问题。![](/img/dic/Pastedimage20260108223019.png)
	- Backgate Coupling
		- 在动态电路与静态电路的接口处，动态信号（快速的电压变化）通过栅极电容耦合回电路的其他部分，导致后续电路出现噪声
		- 把动态电路的输出连到静态门最下面（如果是 NMOS）或最上面（如果是 PMOS）的管子（驱动outer inputs）
	- Clock Feedthrough
		- CLK和Out之间的寄生电容使得Out电压可能会升到$V_{DD}$以上
		- 时钟的快速上升/下降沿会耦合到Out产生噪声
		- 示意图![](/img/dic/Pastedimage20260108223941.png)
- 多级电路的解决方案：Domino Gates
	- 优点：比CMOS快1.5到2倍
	- 缺点：噪声能力弱，存在电荷分享，有电流泄露，以及单调性
	- 在动态级之后接一个反相的静态门，产生单调（0→1）的输出![](/img/dic/Pastedimage20260108225516.png)
	- 本质上是非反相的，只能实现正逻辑
		- 可以添加额外的反相器
		- 也可以级联动态门，不用中间的反相器
			- 对后一级的时钟信号进行延迟，确保上一级的求值已经结束
			- 每一级必须有Foot transistor
			- 使用Dual-Rail Domino
				- 产生互补的输出![](/img/dic/Pastedimage20260108230203.png)
	- 对于多级多米诺逻辑，如果在后面几级precharge阶段input都等于0，那么Foot transistor可以被删掉
		- 特别的，如果后面几级多米诺逻辑没有引入外部输入，那么后面几级都是footless的
	- 想要省去中间的静态反相器，可以使用 NP Dynamic CMOS
		- 动态使用两种类型的动态门![](/img/dic/Pastedimage20260108230924.png)
		- PDN输入只允许使输出1→0的输入，PUN输入只允许使输出0→1的输入
		- 缺点：P 型动态逻辑块依赖 PMOS 进行逻辑求值。由于空穴迁移率低，PMOS 通常比 NMOS 慢，导致整体电路速度变慢，或者为了匹配速度需要将 PMOS 做得很大，增加了面积。
	- 用于紧凑电路的多输出多米诺逻辑，将多个计算合并到一个单一的输出门中来增加面积，例如加法器：![](/img/dic/Pastedimage20260108231123.png)
		- 左下角的图合并了上面几张图的电 路结构，并用预充电器件进行充电
## 数据通路
- 对于数字IC设计而言，其结构主要分为以下几个部分
	- arithmetic unit
	- memory
	- control unit
	- interconnect
#### Adders(属于arithmetic unit)
- 通常做为关键路径，限制了整个电路的速度
- 设计优化
	- 逻辑：利用布尔方程来实现更快/更小的电路
	- 电路：调整晶体管尺寸和电路拓扑结构来优化速度
-  Full Adder
	- 输入 $A$ ，$B$ ，$C_{i}$ ，输出 $S$ 以及 $C_{o}$ 
	- $S=A \oplus B \oplus C_i$ 
	- $C_{o}=AB+(A+B)C_{i}$ 
	- 转换一下，让 $S$ 利用计算好的 $C_{o}$
		- $S = ABC_i + \bar{C_o}(A + B + C_i)$ 
		- CMOS表示：![](/img/dic/Pastedimage20260109133514.png)
	- 缺点：
		- 面积大（28T）
		- 负载中：输出信号连下一级全加器要连6个晶体管的栅极
		- 延迟长： $C_{i}$ 到 $C_{o}$ 要经过两级反相逻辑
	- 优点：
		- 从 $C_{i}$ 生成 $C_{o}$ 的PMOS网络只需要两个PMOS，降低了逻辑努力
		- 控制 $C_{i}$ 的晶体管离输出端较近，由于在实际使用中， $C_{i}$ 相比 $A$ 与 $B$ 更晚到达，因此由前面的优化方案最靠近输出节点可以减小输出的时间
	- 对于全加器，所有输入反相相当于所有输出反相，利用这一点可以简化逻辑，在实际搭电路的时候适当把输入反相，来获得输出交替为正相/反相的效果（奇偶交替）![](/img/dic/Pastedimage20260109140209.png)
	- Original Ripple-Carry Adder
		- 把全加器级联
		- $N$ 级全加器的传播延时：$t_{adder}=(N-1)t_{carry}+t_{sum}$ 
	- Mirror Adder![](/img/dic/Pastedimage20260110232613.png)
		- 利用全加器反相特性省去两个反相器
		- 优势：信号完整性强，输出电压可以达到满摆幅，无阈值电压损失，噪声容限高，电路稳定性与抗干扰能力出色，驱动能力强
		- 劣势：面积较大，延迟较高，逻辑路径中反相器与门电路的级数较多
	- XOR full adder![](/img/dic/Pastedimage20260109142536.png)
	- CPL full adder![](/img/dic/Pastedimage20260110232354.png)
		- 优势：晶体管数量少，面积小，延迟低
		- 劣势：阈值电压损失，驱动能力弱需要外加缓冲器
- RCA Adder/Subtractor(既做加法又做减法)
	- 用 $A+\bar{B}+1$ 等效 $A-B$（用了补码的思路）![](/img/dic/Pastedimage20260109142925.png)
	- 优点：逻辑简单，成本低
	- 缺点
		- 速度慢，依然是行波进位模式
		- 延迟高（延迟与位数成正比）
		- 功耗大，中间的加法器会在最终稳定前多次翻转状态，并产生毛刺，带来无效功耗
- 内部信号
	- 进位产生$G=AB$ 
	- 进位传播$P=A\oplus B$ 
	- 进位消除$D/K=\bar{A}\bar{B}$ 
	- $C_o=G+PC_{i}$
	- $S=P\oplus C_{i}$ 
- 曼彻斯特进位链
	- 观察到上述进位信号是互斥的，则可以根据上述信号的实际含义与互斥的属性设计出电路：![](/img/dic/Pastedimage20260109144043.png)
	- 用Elmore Delay模型建模，得到延迟的公式：$t_p = 0.69 \sum_{i=1}^{N} C_i (\sum_{j=1}^{i} R_j)= 0.69 \frac{N(N+1)}{2} RC$  ，可以知道延迟与级数 $N$ 的平方数成正比
	- 最长的曼彻斯特进位链大约是4
- 组进位
	- 将单位的 $p$ 和 $q$ 推广到多位的块/组，有以下的递推公式
		- $G_{i:j} = G_{i:k} + P_{i:k}G_{k-1:j}$ （$i\sim k$ 位是高位，剩下的是低位）
		- $P_{i:j} = P_{i:k}P_{k-1:j}$ 
		- $G_{0:0}=G_{0}=C_{in}$ ，$P_{0:0}=P_{0}=0$ ，$C_{i-1}=G_{i-1:0}$ （直接用 $G$ 取代 $C$ 的信号）
	- 如果一组之内的 $P$ 相与为1，那么直接用多路复用器将输入 $C_{i}$ 导向输出 $C_{o}$ ，无需经过计算
	- 4bit行波进位（用了PG Logic）![](/img/dic/Pastedimage20260109152020.png)
	- 什么是阶数（Valency）：一个逻辑门能同时处理几个进位输入
		- 使用高阶Cells可以大大减小树的级数
		- eg：$G_{i:j} = G_{i:k} + P_{i:k}(G_{k-1:l} + P_{k-1:l}(G_{l-1:m} + P_{l-1:m}G_{m-1:j}))$ 
	- PG Diagram![](/img/dic/Pastedimage20260109204941.png)
		- 黑色的cell代表既计算进位产生 $G$，也计算进位传播 $P$ 
		- 灰色的cell代表只计算进位产生 $G$（没有进位传播输出）
		- 白色的三角缓冲器代表信号增强或对齐
- 图示
	- Carry-Ripple![](/img/dic/Pastedimage20260109153200.png)
	- Carry-Skip/Carry-Bypass![](/img/dic/Pastedimage20260109161814.png)![](/img/dic/Pastedimage20260109170701.png)
		- 通过可变分组去减少逻辑层级![](/img/dic/Pastedimage20260109173426.png)
	- Carry Select![](/img/dic/Pastedimage20260109180220.png)
	- Carry Inc![](/img/dic/Pastedimage20260109183137.png)
	- B-tree![](/img/dic/Pastedimage20260109204515.png)
	- S-Tree![](/img/dic/Pastedimage20260109204554.png)
	- K-Tree![](/img/dic/Pastedimage20260109204607.png)

| Architecture                   | 介绍                                       | 时延公式                                                                                                                                                                                              | Classification | Logic Levels | Max Fanout | Tracks | Cells      |
| ------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------ | ---------- | ------ | ---------- |
| Carry-Ripple                   |                                          | $t_{ripple} = t_{pg} + (N-1)t_{AO} + t_{xor}$<br />$t_{pg}$：逐位进位传播/产生门（第1阶段）的延时<br /> $t_{AO}$：灰色单元中“与-或”逻辑（AND-OR）的延时<br /> $t_{xor}$：最终求和异或门（$S=P\oplus C_{i}$ ）的延时                                   |                | N-1          | 2          | 1      | N          |
| Carry-Skip/Carry-Bypass<br />n=4 | 组传播信号为1的时候，MUX选择组进位输入；为0时，选择串行进位加法器的进位输出 | $t_{skip} = t_{pg} + 2(n-1)t_{AO} + (k-1)t_{mux} + t_{xor}$ $t_{pg}$：一位进位传播/产生门的延时（每个bit计算出 $P$ $G$ 的时间）<br />$t_{AO}$：与或非门延时<br />$t_{mux}$：多路选择器延时<br /> $n$ 分组大小（一个组里面有多少个位）<br /> $k$ 分组数量（加法器分成多少个组） |                | N/4 + 5      | 3          | 1      | 1.25N      |
| Carry-Select                   | 分别计算进位输入为0和1的结果，然后根据真正的进位信号用多路选择器选通      | $t_{select} = t_{pg} + [n(第一组的位数) + (k-2)(中间的mux)]t_{AO} + t_{mux}$                                                                                                                               |                |              |            |        |            |
| Carry-Inc. n=4                 | 先假设没有进位，把结果算出来。如果后来发现真的有进位，我再给结果加 1（递增）  | $n$ 分组大小（一个组里面有多少个位）<br />$k$ 分组数量（加法器分成多少个组）<br />$t_{increment} = t_{pg} + [(n-1) + (k-1)]t_{AO} + t_{xor}$                                                                                         |                | N/4 + 2      | 5          | 1      | 2N         |
| Brent-Kung                     |                                          |                                                                                                                                                                                                   | (L-1, 0, 0)    | 2log₂N - 1   | 2          | 1      | 2N         |
| Sklansky                       |                                          |                                                                                                                                                                                                   | (0, L-1, 0)    | log₂N        | N/2 + 1    | 1      | 0.5 Nlog₂N |
| Kogge-Stone                    |                                          |                                                                                                                                                                                                   | (0, 0, L-1)    | log₂N        | 2          | N/2    | Nlog₂N     |
|                                |                                          |                                                                                                                                                                                                   |                |              |            |        |            |
- 如何计算最大扇出：在某一级的逻辑门输出端，需要驱动下一级多少个逻辑门的输入端。
- 最大跨度（Track）：在加法器的任意两级逻辑层之间，**横向布线**最拥挤的地方，同时并行通过了多少根线。
- 补充
	- Carry Select Adder
		- 线性进位选择加法器（Linear Carry Select Adder）![](/img/dic/Pastedimage20260109180934.png)
			- 计算是并行的，但进位信号的选择是串行的， $t$ 仍然与位数成线性关系
		- 平方根进位选择加法器（Square Root Carry Select Adder）![](/img/dic/Pastedimage20260109181222.png)
			- 为了不让后面的bit空等，采用可变分组大小
			- 总位数 $N$ 等于所有组的位数之和：$N = 2 + 3 + 4 + \dots + (P+1)$ → $N \approx \sum_{i=1}^{P} i = \frac{P(P+1)}{2}$  → $P \approx \sqrt{2N}$ 
			- 整个加法器的延迟主要取决于信号穿过这一串 MUX 的时间。因为 MUX 的数量是 P，所以延迟与 P 成正比。
			- 延迟是 $O(\sqrt{ N })$ 
	- Carry-Increment Adder
		- 可变分组大小![](/img/dic/Pastedimage20260109183525.png)
			- 同上：$t_{increment} = t_{pg} +\sqrt{ 2N }t_{AO} + t_{xor}$ 
			- 下图带buffer，延迟非关键路径的信号（为了防止信号竞争）
- 树型加法器分类：评估不同树型加法器在面积、速度、驱动能力之间的权衡
	- 对于N位加法器有以下理想模型：
		- 逻辑层级（延迟） $L = \log_2 N$ （越小越好）
		- 扇出（Fanout） $\le 2$ （越小越好，驱动快）
		- 布线轨道（Wire Tracks） $\le 1$ （越小越好，面积小，拥塞少）
	- 但实际上，所有的树形加法器都受限于公式：$\lambda + f + t = L - 1$ 
		- 实际层级 = $L + \lambda$ 
		- 实际扇出 = $2^{f+1}$ 
		- 实际轨道 = $2^t$ 
	- 从这个角度看前面提到的三个tree
		- B：面积优化型，布线最少 (Track=1)，扇出小，逻辑层级多，速度最慢。
		- S：逻辑深度优化型，逻辑层级最少，布线少，扇出极大 (Fanout高)，导致电气性能差。
		- K：速度优化型，逻辑层级最少，扇出小，理论速度最快，布线极复杂 (Track多)，面积最大，功耗高
	- 除此之外，在实际应用中，还存在一些tree在三个tree之间，使用混合架构。
		- B+K![](/img/dic/Pastedimage20260109213212.png)
		- B+S![](/img/dic/Pastedimage20260109213233.png)
		- S+K![](/img/dic/Pastedimage20260109213247.png)
## Timing/Sequential Circuits
- 组合逻辑：输出取决于此刻的输入
- 时序逻辑：输出取决于此刻和之前的输入
	- 举例：有限状态机/流水线
- Latch：当clk拉高的时候，把输入D传送到输出Q
- Register：当clk上升沿的时候，存储D
- 时序电路：在一大块组合逻辑之中适当插入register/latch
- 一些延迟
	- $t_{cd}$ ：contamination delay 输入到50%到输出到50%的时间最小值
	- $t_{pd}$ ：propagation delay 输入到50%到输出到50%的时间最大值
	- 对于Latch和FF而言
		- $t_{setup}$：在时钟上升沿之前要提前多久准备好数据
		- $t_{hold}$ ：在时钟上升沿之后数据要持续多久保持不变
	- 这些时序开销减少了可用的计算时间
- 因此有了一些延时约束，如果不满足这些约束，会带来建立时间约束or最大延时违例
	-  $T_{c}\geq t_{pcq}(FF的传播延迟)+t_{pd}+t_{setup}$ （实际上 $t_{pcq}$ 也可视作一种组合逻辑）
		- 违反这个约束会带来sequence overhead
		- 改进方法
			- 修改逻辑，让传播延迟变得更小
			- 提高时钟周期
			- 加入流水线，通过加register切开组合逻辑，从而让电路满足时序约束
	- $t_{ccq}+t_{cd}\geq t_{hold}$ 
		- 违反这个约束会带来hold time failure, or min-delay failure
		- 意思是说，在前面数据受clk影响改变的时间至少要大于保持时间，不然后续数据会因为小于保持时间被污染
		- 改进方法：重新设计逻辑
- 在芯片中，如何把时钟信号传递到芯片的每一个角落？使用时钟树，例如：H-Tree
	- 使用分形结构，可以将时钟信号送达至芯片上任意位置（任意精细的区域），所有路径上的延迟是相等的，但延迟的变动（由工艺、电压、温度等引起）会导致时钟偏斜。![](/img/dic/Pastedimage20260110142647.png)
	- Clock Skew（时钟偏斜）
		- 空间上两个不同点处时序上等同的两个时钟沿在到达时间上的偏差
		- 由时钟路径上的失配及时钟负载上的差别引起，取决于数据与时钟布线的方向，时钟偏差可正可负
		- 具有确定性（时不变）
		- 只会引起相移
		- $\delta(i,j)=t_{i}-t_{j}$ 
		- Positive Skew: ![](/img/dic/Pastedimage20260110145403.png)
			- $T_{c}+\delta\geq t_{pcq}+t_{pd}+t_{setup}$ 
			- $\delta+t_{hold}<t_{ccq}+t_{cd}$ 
		- Negative：正改负即可
		- 如果一个时序逻辑电路带有反馈（数据流向与时钟流向相反），会改变时钟偏斜的正负
		- 同一个电路系统中，可能同时存在正偏斜约束和负偏斜约束
	- 组合逻辑内部的关键路径是随输入状态变化的
	- Clock Jitter：空间上同一个点处时钟周期随时间的变化
		- 平均值为零的随机变量
		- 绝对抖动 (Absolute jitter, $t_{jitter}$)：某点处的一个时钟边沿相对于理想参照时钟边沿在最坏情况下的偏差绝对值。图中的灰色阴影区域表示这个不确定范围。
		- 周期至周期抖动 (Cycle-to-cycle jitter, $T_{jitter}$)：单个时钟周期相对于理想参照时钟的时变偏离。
		- 加入绝对抖动之后，时钟约束变为：
			- $t_{hold} + \delta + \mathbf{2t_{jitter}} \le t_{ccq} + t_{cd}$ 
			- $T + \delta - \mathbf{2t_{jitter}} \ge t_{pcq} + t_{pd} + t_{setup}$ 
			- 总之是让约束变得更紧了
- positive skew:上界宽松下界紧，nagetive相反；jitter：两边都收紧x2倍（这里指的是组合逻辑的上下界）
- 时钟抖动和时钟偏斜的来源
	- 时钟生成
	- 器件工艺偏差
	- 互连线
	- 电源
	- 温度
	- 电容负载
	- 邻近线路的耦合