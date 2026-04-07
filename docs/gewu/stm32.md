---
title: 嵌入式（STM32）- GPIO
id: stm32
---
## GPIO
#### 基本配置
使用 IDE： STM32Cube IDE
使用芯片：STM327431CBU6 
#### 点亮LED
目的：使得小灯以1Hz的频率闪亮。
###### Step 1 图形化界面设置
![](/img/stm32/Pastedimage20240305103350.png)首先打开原理图，观察LED灯相关电路（右图）。可知在LED灯引脚高电平时，LED灯亮起。在原理图上找到LED的引脚，并且在IDE的图形化界面找到相关引脚。
在原理图中可以发现，LED0灯链接了PA3引脚。因此想点亮LED0时，PA3引脚须**输出**一个高电平。
打开IDE的图形化界面，点击PA4，选择GPIO_Output。右键-Enter User Label，输入用户自定义的名称（比如LED0），这样可以提高程序的复用性。
之后，在左侧弹出界面点击System Core-SYS-Debug-调节为Serial Wire。
Ctrl+S保存之后进入代码界面。（代码界面也可以通过：点开相关project-Core-Src-main.c得到）
###### Step 2 输入代码
打开代码界面，找到`main`函数，在`while`循环中的`USER CODE`注释中（如果不在两行注释中写，会被删除）输入如下代码。
```C++
HAL_GPIO_WritePin(LED0_GPIO_Port, LED0_Pin, GPIO_PIN_SET);
HAL_Delay(500);
HAL_GPIO_WritePin(LED0_GPIO_Port, LED0_Pin, GPIO_PIN_RESET);
HAL_Delay(500);
```

:::note
HAL 是 Handware Abstraction Layer ，是一个固件库。
Pin是芯片上的引脚，可以输入，也可以输出。像原理图上的PA4就是一个引脚；而Port则是一系列引脚的总和。像PA就是一系列引脚的总和。`HAL_GPIO_WritePin()`函数的第一个参数就是一个指向Port的指针，而第二个参数则是指向一个Pin的指针。
:::

:::note
输入内置函数时，用 Alt+/ 快捷键调出函数提示
想要查看任何量的定义时，Ctrl并点击函数名称可以看到其定义。
想要查找函数时，在[网站](https://www.st.com/en/embedded-software/stm32cubeg4.html##documentation)的第一个User manual处可以找到相关函数的用法。
:::

:::info
查找函数举例：Ctrl并点击函数名称
:::

查到`HAL_Delay`函数的代码为
```C++
__weak void HAL_Delay(uint32_t Delay)
{
	uint32_t tickstart = HAL_GetTick();
	uint32_t wait = Delay;
/* Add a freq to guarantee minimum wait */
	if (wait < HAL_MAX_DELAY){
	wait += (uint32_t)(uwTickFreq);
	}
//由这一行（点一点参数）可知，只要写了一个Delay函数，至少会等待1ms
	while ((HAL_GetTick() - tickstart) < wait){
	}
}
```
###### Step 3 调试和运行
点击上方栏中的调试按钮，选择默认设置。
调试开始后，函数停在`main`函数的第一行。
点击Step Over按钮，即开始单步调试。
其中，双击某行的行首以打断点。永久取消断点，再次双击即可；临时取消，在右侧栏中`recount`一栏将相关断点去掉即可。
:::note
有些函数譬如`HAL_Delay()`需要等待一些时间，调试时需要等时间过完之后才可以继续调试。
:::

#### 点按按钮
目的：按动一次按钮，灯亮起，再按一次按钮，灯关闭
###### 上拉/下拉电阻
![](/img/stm32/Pastedimage20240305175035.png)在观察电路图的时候，我们发现按钮的电路图如右图所示。芯片通过检测1处的电位来执行相关指令，所以说在设置引脚的时候要设置为**Input**。如果在按钮的左侧接一个电源，那么，当按钮闭合时，1获得低电平（因为通过按钮，1接地）。那么，当按钮断开时，是高电平还是低电平呢？这一点我们实际上是不清楚的，因为电平的值可能会随周围的电子环境发生变化。但是，我们实际上希望保证1侧的电平恒为高电平，这样可以方便我们针对这种情况编写相关程序。
因此，我们需要在1侧和电源之间接一个上拉电阻，以保证在按钮打开的情况下，1侧的电平恒为高电平。（参考：[上拉电阻时怎么工作的](https://www.build-electronic-circuits.com/pull-up-resistor/)）在GPIO的电路图中也可以看到这一点。（如下图所示）![](/img/stm32/Pastedimage20240306111216.png)
###### Step 1 图形化界面设置
观察电路图，发现SW0对应的端口是PC6，故而将PC6命名为SW0。注意，由于是检测按钮端的电平，故要设置为**Input**，并且在左侧选项列表System Core-GPIO中找到PC6，并且将其GPIO Pull-up/down设为Pull-up。
###### Step 2 输入代码
```C++
int main(void)
{
/* USER CODE BEGIN 1 */
/* USER CODE END 1 */
/* MCU Configuration--------------------------------------------------------*/
/* Reset of all peripherals, Initializes the Flash interface and the Systick. */
	HAL_Init();
/* USER CODE BEGIN Init */
/* USER CODE END Init */
/* Configure the system clock */
	SystemClock_Config();
/* USER CODE BEGIN SysInit */
/* USER CODE END SysInit */
/* Initialize all configured peripherals */
	MX_GPIO_Init();
/* USER CODE BEGIN 2 */
	int old_state=0;
/* USER CODE END 2 */
/* Infinite loop */
/* USER CODE BEGIN WHILE */
	while (1)
	{
/* USER CODE END WHILE */ 
/* USER CODE BEGIN 3 */
	int new_state = HAL_GPIO_ReadPin(SW0_GPIO_Port,SW0_PIN);
	if(old_state && !new_state){
		HAL_GPIO_TogglePin(LED0_GPIO_Port,LED0_PIN);
	}
	old_state = new_state;
	HAL_Delay(0);
	}
/* USER CODE END 3 */
}
```
###### 按键消抖
如果不加`HAL_Delay(0)`那行代码，会出现什么？由于按键是机械结构，所以按下按键前后信号有可能不稳定。如果不等待其稳定（也即等待1ms）后再继续循环，有可能会出现灯闪烁和按键动作不符的情况。

按键消抖的几种思路：
- 加长间隔时间
- 稳定一定时间后度数
- 忽略第一次跃变后一段时间的电平
- 取若干次的平均值，如果平均值大于高阈值，就认为处于高电位；如果平均值低于低阈值，就认为处于低电位。这个思路类似于模拟电路中滞回比较器的思路。
###### GPIO中Output和Input的内部结构
在这里我们加入一些GPIO的内部结构的知识，以便大家更好理解GPIO的输入和输出。

我们在这里补充一些数电知识，这些是一部分数电课不讲的。在数电课程上我们讲到了与门、或门和非门，那么这些门又是由什么基本元件组成的呢？让我们更深入一层，看一看门的基本结构。

首先我们得认识一个基本元件：MOS管，兴许一些学过模电的同学已经对它的内部结构和原理有所了解——不过没有了解也没关系，这部分内容不需要我们了解原理，只需要知道怎么用就行了。

MOS管分为两种，一种是NMOS管，一种是PMOS管。它们分别长这样：
&lt;!-- Excalidraw: Drawing 2024-03-06 10.33.30.excalidraw --&gt;
PMOS管的前面比NMOS管的前面多了一个小圆圈，是非门的符号，这与两种管子的原理无关，只是说明PMOS管的输入和输出与NMOS管的相反。

我们注意到，每一个管子都有三个极，分别叫做栅极(gate)、源极(source)和漏极(drain)。它们的性质也是有关三极间的电流和电压的。

NMOS管的性质如下表：其中当栅极输入为高电平（这里用1代替）时，产生从源极到漏极的电流。这种情况称之为close circult。反之，当栅极输入为低电平时，上述电流被截断，称为open circult。

| G    | 1             | 0            |
| ---- | ------------- | ------------ |
| i    | S→D           | -            |
| NAME | close circuit | open circult |
PMOS管的情况则恰好相反。

| G    | 0             | 1            |
|------|---------------|--------------|
| i    | S→D           | -            |
| NAME | close circuit | open circule |
了解了两个管子的性质，我们转回头来看一看GPIO的输出电路。你可以在RM0440 Reference manual的GPIO一章找到这个图。
![](/img/stm32/Pastedimage20240306111402.png)
在这个图中，你可以发现Output control连接着两个MOS管。我们利用上述MOS管的性质，可得：当Output control向两个管子输出1的时候，PMOS管出现open circuit，NMOS管出现close circuit。此时，输出的接口与$V_{ss}$连接，而$V_{ss}$的意思是接地(s指series)，输出低电平。反之，当Output control向两个管子输出0的时候，PMOS管出现close circuit，NMOS管出现open circuit。此时，输出的接口与$V_{DDIOx}$连接，$V_{DDIOx}$的意思则是板内电压，输出高电平。
实际上，这个电路实现了一个非门的功能。使用MOS管也可以实现与门/或门等其他门，

这样，我们对GPIO的输出有了一个基本的了解。
参考资料：[NMOS与PMOS](https://builtin.com/hardware/nmos-transistor)；[GPIO的输出](https://fastbitlab.com/gpio-behind-scene/)

#### 指令与寄存器
指令的底层逻辑反映在寄存器上，前面读取/写入函数本质上是在改变一些底层寄存器的值。
相关资料在：RM0440 Reference manual中GPIO这一章。
我们可以直接向寄存器中写入相关数值，以控制相关电平进行操作。这样做可以省略在图形化界面进行的操作。
通过看Reference manual的第347页的图片，你可以找到将特定引脚设为上拉/下拉的相关寄存器数据。
###### 配置
我们只需要在图形化界面把Debug（上面有提及，可以直接Ctrl+F搜索到）设置为Serial Wire。
###### 前置知识：位运算
- `0b`是二进制的前缀；`0O`是八进制的前缀；`0x`是十六进制的前缀；
- 逻辑与`&`，作用同数电中的与门，对每一位进行操作，比如`0b11 & 0b10 = 0b10`；
- 逻辑或`|`，作用同数电中的或门，对每一位进行操作，比如`0b11 | 0b10 = 0b11`；
- 逻辑异或`^`，作用同数电中的异或操作，对每一位进行操作，比如`0b11 ^ 0b10 = 0b01`；
- 逻辑非`~`，作用同数电中的非门，对每一位取非，比如`~0b11 = 0b00`
- 按位左移运算符`&lt;&lt;`，将运算数的所有二进制位向左移动，后面补上0，移几位就相当于乘了2的几次方。
- 按位右移运算符`&gt;&gt;`，将运算数的所有二进制位向右移动，如果第一个运算数是0，就补0，是1就补1（保证符号不变）
- 可以在不同进位制之间使用位运算（比如16进制和2进制）
- 如果想让某几位的数不变，可以让该数`&`上全为`1`的整数，并使用位操作调整位数。比如如果想让数`X`的后六位不变，可以用`X & ~(0b11&lt;&lt;6)`
- 如果想将原先为0的数置位，可以让该数`|`上要置的数。比如如果想置位数`X`的第七位和第八位为`01`，可以用`X | 0b01 &lt;&lt; 6`
###### 输入代码

```C++
int main(void)
{
/* USER CODE BEGIN 1 */
/* USER CODE END 1 */
/* MCU Configuration--------------------------------------------------------*/
/* Reset of all peripherals, Initializes the Flash interface and the Systick. */
	HAL_Init();
/* USER CODE BEGIN Init */
/* USER CODE END Init */
/* Configure the system clock */
	SystemClock_Config();
/* USER CODE BEGIN SysInit */
/* USER CODE END SysInit */
/* Initialize all configured peripherals */
	MX_GPIO_Init();
/* USER CODE BEGIN 2 */
//已知：LED对应的引脚为PA3；按钮对应的引脚是PC6
	_HAL_RCC_GPIOA_CLK_ENABLE();
	GPIOA -> MODER = (GPIOA -> MODER & ~(0b11 << 6)) | 0b01 << 6;
//注意要开启时钟。 
	_HAL_RCC_GPIOC_CLK_ENABLE();
	GPIOC -> MODER = (GPIOC -> MODER & ~(0b11 << 12)) | 0b00 << 12;
	GPIOC -> PUPDR = (GPIOC -> PUPDR & ~(0b11 << 12)) | 0b01 << 12;
//设置引脚的输入输出
/* USER CODE END 2 */
/* Infinite loop */
/* USER CODE BEGIN WHILE */
	while (1)
	{
/* USER CODE END WHILE */ 
/* USER CODE BEGIN 3 */
	if(GPIOC -> ODR & (1 << 6) ){
		GPIO -> ODR | = 1 << 3;
	}
	else{
		GPIIO -> ODR & = (1 << 3);
	}
	}
/* USER CODE END 3 */
}
```
相关寄存器的值，我们可以在Refernce manual相关章节的Register部分找到。
#### 点亮数码管
数码管的原理图如下
![](/img/stm32/Pastedimage20240306221913.png)
注意不同引脚的差别。右上角的MOS管通过信号控制DIG1/2/3/4是否接地。
###### Step 1 令一位数码管显示数字
这里贴两个函数：
```C++
void set_segment(uint8_t data)
{
	HAL_GPIO_WritePin(SEG0_GPIO_Port, SEG0_Pin, data & (1 << 0) ? GPIO_PIN_SET : GPIO_PIN_RESET);
	HAL_GPIO_WritePin(SEG1_GPIO_Port, SEG1_Pin, data & (1 << 1) ? GPIO_PIN_SET : GPIO_PIN_RESET);
	HAL_GPIO_WritePin(SEG2_GPIO_Port, SEG2_Pin, data & (1 << 2) ? GPIO_PIN_SET : GPIO_PIN_RESET);
	HAL_GPIO_WritePin(SEG3_GPIO_Port, SEG3_Pin, data & (1 << 3) ? GPIO_PIN_SET : GPIO_PIN_RESET);
	HAL_GPIO_WritePin(SEG4_GPIO_Port, SEG4_Pin, data & (1 << 4) ? GPIO_PIN_SET : GPIO_PIN_RESET);
	HAL_GPIO_WritePin(SEG5_GPIO_Port, SEG5_Pin, data & (1 << 5) ? GPIO_PIN_SET : GPIO_PIN_RESET);
	HAL_GPIO_WritePin(SEG6_GPIO_Port, SEG6_Pin, data & (1 << 6) ? GPIO_PIN_SET : GPIO_PIN_RESET);
	HAL_GPIO_WritePin(SEG7_GPIO_Port, SEG7_Pin, data & (1 << 7) ? GPIO_PIN_SET : GPIO_PIN_RESET);
}

void set_digit(int which)
{
	HAL_GPIO_WritePin(DIG0_GPIO_Port, DIG0_Pin, GPIO_PIN_RESET);
	HAL_GPIO_WritePin(DIG1_GPIO_Port, DIG1_Pin, GPIO_PIN_RESET);
	HAL_GPIO_WritePin(DIG2_GPIO_Port, DIG2_Pin, GPIO_PIN_RESET);
	HAL_GPIO_WritePin(DIG3_GPIO_Port, DIG3_Pin, GPIO_PIN_RESET);
	switch (which)
	{
	case 0:
		HAL_GPIO_WritePin(DIG0_GPIO_Port, DIG0_Pin, GPIO_PIN_SET);
		break;
	case 1:
		HAL_GPIO_WritePin(DIG1_GPIO_Port, DIG1_Pin, GPIO_PIN_SET);
		break;
	case 2:
		HAL_GPIO_WritePin(DIG2_GPIO_Port, DIG2_Pin, GPIO_PIN_SET);
		break;
	case 3:
		HAL_GPIO_WritePin(DIG3_GPIO_Port, DIG3_Pin, GPIO_PIN_SET);
		break;
	}
}
```
###### Step 2 令多位数码管显示不同的数字
![](/img/stm32/Pastedimage20240306224843.png)
观察数码管内部结构可知，同时让四位数码管显示不同的数字是不可能的，所以只能让不同位的数码管交替顺序显示，利用人的视觉暂留来显示相应的数字。这就是动态扫描。
###### Step 3 利用矩阵键盘控制数字的显示
矩阵键盘的原理：
![](/img/stm32/Pastedimage20240306230548.png)
从图中可以看出，矩阵键盘每行有一条线连接，每列也有一条线连接。仅取一根行线，其他行线浮空。将行线左侧置低电平，列线连接上拉电阻，那么不按键盘的时候，开关右侧为高电平；按下键盘，开关右侧为低电平。
![](/img/stm32/Pastedimage20240306231546.png)
在实际连接的时候，只要二极管左侧置低电平，那么右侧的就不会产生流入的电流。由于此处的SEG与数码管处有复用，需要在读数之前把四个数码管关掉。
这里给出`while(1)`循环中的函数。
```C++
set_segment(codes[key]);
set_digit(0);
HAL_Delay(0);
set_digit(-1);
for (int r = 0; r != 4; ++r)
{
	set_segment(1 << r);
	if (HAL_GPIO_ReadPin(KC0_GPIO_Port, KC0_Pin) == GPIO_PIN_SET)
	{
		int nums[] = {1, 4, 7, 0xA};
		key = nums[r];
		break;}
	if (HAL_GPIO_ReadPin(KC1_GPIO_Port, KC1_Pin) == GPIO_PIN_SET)
	{
		int nums[] = {2, 5, 8, 0};
		key = nums[r];
		break;
	}
	if (HAL_GPIO_ReadPin(KC2_GPIO_Port, KC2_Pin) == GPIO_PIN_SET)
	{
	int nums[] = {3, 6, 9, 0xB};
	key = nums[r];
	break;
	}
}
```