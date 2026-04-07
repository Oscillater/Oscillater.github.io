---
title: 半导体器件
id: semi_dev
description: 不全，只有BJT
---
参考：
PPT
半导体器件基础
## BJT
- 双极晶体管，三个扩散区，两个 PN 结，发射极 (E) ，基极 (B) ，集电极 (C) 。![](/img/semi_dev/Pastedimage20250417133005.png)
- 掺杂浓度：发射极浓度最高，基极次之，集电极浓度最低。BE 结正偏， BC 结反偏时，电子从发射极越过基极被电场扫到集电极。只有在发射极时，电子是多子，在基极电子是*少子*。为了让电子不与基极的空穴复合，*基极的宽度会非常小*。![](/img/semi_dev/Pastedimage20250417132237.png)
- 考虑到 BJT 是少子器件，因此在对 BJT 进行分析时，也从少子的角度入手。![](/img/semi_dev/Pastedimage20250417132527.png)
-  BJT 工作特性与参数
	- 电流与电压
		- $I_{E}=I_{B}+I_{C}$
		- $V_{EB}+V_{BC}+V_{CE}=0$
	- 参数（*PNP BJT*）![](/img/semi_dev/Pastedimage20250417133930.png)
		- 发射效率：$\gamma=\frac{I_{Ep}(少子的电流)}{I_{Ep}+I_{En}(总发射极电流，在这里保持常数)}$ 少子造成的电流占比越大，输出的电流就越大。$0\leq\gamma\leq 1$ 希望它尽可能接近 $1$ 以获得增益。
		- 基区输运系数： $\beta^*=\frac{I_{Cp}(进入集电区的少数载流子)}{I_{Ep}(进入到基区的少数载流子)}$ 是在基区复合的载流子数量的表征。$0\leq\alpha_{T}\leq 1$ ，因为我们当然希望复合越少越好。
		- 集电区倍增因子： $\alpha^*=\frac{I_{C}(总集电极电流)}{I_{pC}(集电极少子电流)}$ 
		- 共基极电流放大系数： $\alpha=\frac{I_{C}}{I_{E}}=\gamma\beta^*\alpha^*$ 
		- 共射电流放大系数 $\beta=\frac{I_{C}}{I_{E}-I_{C}}=\frac{\alpha}{1-\alpha}$ 
- 静态（直流）特性（发射极正偏，集电极反偏）
	- 基本假设：
		- 非简并，均匀掺杂（因此基区没有电场）的发射区，基区和集电区
		- 稳态条件
		- 准中性区小注入水平
		- 晶体管内只有漂移、扩散、热复合-产生过程发生
		- 耗尽区内热复合-产生可忽略
		- 发射区-集电区准中性层宽度远大于这些区域的少数载流子扩散长度
	- 思路：考虑到 BJT 是少子器件：少子浓度（特定点 $\to$ 少子分布） $\to$ 电流密度 $\to$ 电流-电压方程 $\to$ 从器件角度得到相关参数。
		- 特定点（耗尽层边缘）的少子浓度：![](/img/semi_dev/Pastedimage20250417143157.png)利用[半导体物理知识总结](/docs/gewu/semi_phy)之中的两个公式，可以求出特定点的少数载流子浓度。
			- $p_E\left(x=-x_E\right)=p_{E0} \cdot \exp\left(\frac{qV_{BE}}{kT}\right)$
			- $n_B\left(x=0\right)=n_{B0} \cdot \exp\left(\frac{qV_{BE}}{kT}\right)$
			- $n_B\left(x=x_B\right)=n_{B0} \cdot \exp\left(\frac{qV_{BC}}{kT}\right) \approx 0$
			- $p_C\left(x=x_2\right)=p_{C0} \cdot \exp\left(\frac{qV_{BC}}{kT}\right) \approx 0$
		- 计算少子分布
			- 基区：考虑少子分布计算的连续性方程：
				$$\frac{\partial n} {\partial\, t} \,=\, \frac{\partial n} {\partial\, t} \bigg|_{d r i f t} \,+\, \frac{\partial n} {\partial\, t} \bigg|_{d i f f} \,+\, \frac{\partial n} {\partial\, t} \bigg|_{t h e r m a l \atop R-G}+\left. \frac{\partial n} {\partial\, t} \right|_{\stackrel{o t h e r} {(li g h t. e t c )}}$$
				根据上面的条件和假设，以及基区少数载流子扩散长度 $L_{B}=\sqrt{ D_{n}\cdot \tau_{n} }$ ，得到： $\frac{\partial^2 \delta n}{\partial x^2} - \frac{\delta n}{L_B^2} = 0$
				求出通解并带入边界条件（除了上面求出的一个，还有 $\delta n_B(x=W_B) = -n_{B0}$）并化简，可以得到：
				$$n_B(x) = \delta n(x) + n_{B0} = n_{B0} \left\{ \left[ \exp\left( \frac{qV_{BE}}{kT} \right) - 1 \right] \left( 1 - \frac{x}{W_B} \right) - \frac{x}{W_B} + 1 \right\} = n_{B0} \exp\left( \frac{qV_{BE}}{kT} \right) \left( 1 - \frac{x}{W_B} \right)$$
				（在 $W_B \ll L_B$ 时）
			- 可以发现，基区的少子分布呈线性关系。这里的物理含义为 $W_{B}\ll L_{B}$ （在化简时），也就是不考虑复合。如果把这一点代回连续性方程，也会得到类似的结果。
			- 使用类似的办法，可以计算出发射区与集电区的少子分布。![](/img/semi_dev/Pastedimage20250417151030.png)
		- 下面，我们可以根据少子浓度的变化，计算其中的扩散电流，这里用到了扩散电流的计算（指菲克第一定律）。如果不考虑 $W_{b}\ll L_{B}$ 的条件，会发现得到的结果与 $V_{BE}$ 无关。但是，在计算 BJT 的情况时，我们需要考虑这一点。因此有：$J_n \approx q D_n \frac{n}{L}$，也即 $J_{nb}(x) = - \frac{q D_{nb} n_{b0}}{W_b} \exp\left( \frac{q V_{BE}}{k T} \right)$ 
			- 同理，可以算得其他地方的电流密度：![](/img/semi_dev/Pastedimage20250417152002.png)
		- 在这之后，我们可以根据计算得到的电流密度找到理想的电流电压方程了！真不容易！
			- $J_e = J_{pe}(x=-x_1) + J_{nb}(x=0)$
			  $J_c = J_{pc}(x=x_2) + J_{nb}(x=W_b)$ 
			  $J_b = - (J_c + J_e)$
			-  $I_{E}$ ：$I_E \equiv J_e A = a_{11} \left[ \exp\left( \frac{q V_{BE}}{k T} \right) - 1 \right] + a_{12} \left[ \exp\left( \frac{q V_{BC}}{k T} \right) - 1 \right]$
				其中 $a_{11} = - q A \left[ \frac{D_{nb} n_{b0}}{L_B} \coth\left( \frac{W_b}{L_B} \right) + \frac{D_{pe} p_{e0}}{L_E} \right]$
				$a_{12} = \frac{q A D_{nb} n_{b0}}{L_B} \operatorname{csch}\left( \frac{W_b}{L_B} \right)$
				- 基区较窄（ $W_{b}\approx L_{B}$） 时：$I_E = - q A \left[ \frac{D_{nb} n_{b0}}{W_b} + \frac{D_{pe} p_{e0}}{L_E} \right] \cdot \exp\left( \frac{q V_{BE}}{k T} \right) = I_{S2} \cdot \exp\left( \frac{V_{BE}}{V_t} \right)$
			-  $I_{C}$ ：$I_C \equiv -J_c A = a_{21} \left[ \exp\left( \frac{q V_{BE}}{k T} \right) - 1 \right] + a_{22} \left[ \exp\left( \frac{q V_{BC}}{k T} \right) - 1 \right]$
				其中 $a_{21} = \frac{q A D_{nb} n_{pb}^0}{L_B} \operatorname{csch}\left( \frac{W_b}{L_B} \right) = a_{12}$
				$a_{22} = - q A \left[ \frac{D_{nb} n_{b0}}{L_B} \coth\left( \frac{W_b}{L_B} \right) + \frac{D_{pc} p_{c0}}{L_C} \right]$
				- 基区较窄：$\alpha = \gamma \beta^* \alpha^* \approx \left(1 - \frac{W_b^2}{2 L_B^2}\right) \Bigg/ \left(1 + \frac{\rho_{sh,e}}{\rho_{sh,b}}\right)$ 其中 $I_s = - \frac{q A D_{nb} n_{b0}}{W_b}$，热电压 $V_t = \frac{k T}{q}$
			- 总结：![](/img/semi_dev/Pastedimage20250417153448.png)
		- 最后一步是计算电流增益。
			- 发射极注入效率：$\gamma = \frac{J_{ne}}{J_e} = \frac{1}{1 + I_{pe}/I_{ne}} = \frac{1}{1 + I_{pe}(-x_1)/I_{nb}(0)}$
				- 但这个公式过于理想，譬如 $D$ ，$N$ ，$W$ 都无法测量。因此在实际情况之中，用方块的电阻来估计发射极的注入效率。（扩散系数 $D_{n}=\mu_{n} \frac{kT}{q}$ ，电阻率 $\rho_{b}=(q\mu_{nb}n_{b})^{-1}$ ），从而得出 $\gamma=\left[ 1+{\frac{\frac{\rho_{e}}{W_{E}}}{\frac{\rho_{b}}{W_{B}}}} \right]^{-1}$ 。
				- 在实际的计算之中，将电阻简化为方块电阻：![](/img/semi_dev/Pastedimage20250417182153.png)于是有 $\gamma=\left( 1+\frac{R_{sh,e}}{R_{sh,b}} \right)^{-1}$ 
				- 若 $W_{b}\ll L_{B}$ 的条件不成立，那么$\gamma = \left[ 1 + \frac{D_{pe}}{D_{nb}} \cdot \frac{p_{e0}}{n_{b0}} \cdot \frac{L_B}{L_E} \cdot \frac{\tanh\left( \frac{W_b}{L_B} \right)}{\tanh\left( \frac{W_E}{L_E} \right)} \right]^{-1}$
			- 基区传递系数：$\beta^* = \frac{I_{nc}}{I_{ne}} = \frac{I_{nb}(W_b)}{I_{nb}(0)} = \frac{1}{\cosh(W_b / L_B)}$
				- 若 $W_{b}\ll L_{B}$ ，则：$\beta^* = \frac{I_{nc}}{I_{ne}} = \frac{I_{nb}(W_b)}{I_{nb}(0)} = \frac{1}{\cosh(W_b / L_B)}$
				- 分析时注意 $L_{B}=\sqrt{ D_{B}\tau }$ 
			- 共基极电流放大系数 $\alpha$ ：$\alpha = \gamma \beta^* \alpha^* \approx \left(1 - \frac{W_b^2}{2 L_B^2}\right) \Bigg/ \left(1 + \frac{\rho_{sh,e}}{\rho_{sh,b}}\right)$
- 理想晶体管四种工作模式下的少子分布![](/img/semi_dev/Pastedimage20250417183643.png)
#### 非理想特性
###### 结面积导致的非理想效应
考虑发射效率 $\gamma$ ：
$\gamma=\frac{J_{ne}}{J_{e}}=\frac{1}{1+\frac{J_{pe}}{J_{ne}}}$
这里直接用了 $J$ 电流密度做比，而不是 $I$ 做比，是因为默认两种电流流过的面积相等。然而发射区面积 $\neq$ 集电区面积。![](/img/semi_dev/Pastedimage20250422083611.png)![](/img/semi_dev/Pastedimage20250422083657.png)
则上式变为 $\gamma=\frac{I_{ne}}{I_{ne}+I_{pe}'+I_{ne}'}$ ，由 $\frac{I'_{pe}}{I_{ne}}=\frac{J_{pe}(A^*_{je}+A_{je_{0}})}{J_{ne}A^*_{je}}$ ，代入可得 $\gamma=\left( 1+\frac{A_{je_{0}}}{A^*_{je}} \right)^{-1}\left( 1+\frac{J_{pe}}{J_{ne}} \right)^{-1}$ 
###### 厄利效应（基区宽度调制效应）
随着 B-C 结反偏电压的增加，空间电荷区宽度增加，使得 $x_{B}$ 减小，这一减小，集电极电流也发生变化。![](/img/semi_dev/Pastedimage20250422084231.png)
因而在共射电路之中可以很明显地观测到这样的非理想现象：![](/img/semi_dev/Pastedimage20250422084253.png)
于是有
$\frac{dI_{c}}{dV_{CE}}=\frac{I_{c}}{V_{CE}+V_{A}} $
###### 复合效应
之前的计算没考虑复合效应，现在考虑电子和空穴在 PN 结中的复合效应。复合率与电子寿命和空穴寿命的倒数成正比。 $U=\frac{n_{max}}{\tau_{n}+\tau_{p}}$ 
势垒区： $np=n_{i}^2e^{ qV_{BE}/KT }$ ，开方后代入 $U=\frac{n_{i}}{2\tau}e^{ qV_{BE}/2kT }$
复合电流 $I_{re}=U=\frac{qn_{i}}{2\tau}e^{ qV_{BE}/2kT }\delta_{e}$ (发射结耗尽层宽度)
然后再考虑注入效率 $\gamma$ ，这时考虑复合电流，有 $\gamma=\frac{I_{ne}}{I_{ne}+I_{pe}+I_{re}}$
代入得： $$\gamma = \left[ 1 + \frac{\rho_e}{\rho_b} \frac{W_b}{L_E} + \frac{N_B \cdot W_b \cdot \delta_e}{2 n_i \cdot L_B^2} \exp\left( \frac{- q V_{BE}}{2 k T} \right) \right]^{-1}$$

