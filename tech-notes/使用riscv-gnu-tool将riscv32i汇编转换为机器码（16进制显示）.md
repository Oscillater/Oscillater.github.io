---
date: 2025-05-24
tags: 
    - 环境配置
    - riscv
---
做大作业需要这个，踩了点坑，故记录

操作系统：linux（mac请看官方文档）我使用的是wsl（Ubuntu）

### 安装必要依赖
```bash
sudo apt update
sudo apt install -y \
  git\
  autoconf automake libtool \
  libmpc-dev libmpfr-dev libgmp-dev \
  texinfo gawk \
  python3 wget build-essential bison flex
```

之后从github上clone并编译riscv-gnu-toolchain
```bash
cd ~
git clone --recursive https://github.com/riscv/riscv-gnu-toolchain.git
cd riscv-gnu-toolchain
# 编译仅 32-bit ISA 支持，速度更快
./configure --prefix=/opt/riscv --with-arch=rv32i --with-abi=ilp32
make -j$(nproc)
```

上面那一步如果提示权限不够，需要在对应指令前面添加sudo
### 配置环境变量
```bash
nano ~/.bashrc
```
或者
```bash
vi ~/.bashrc
```
在末尾加入
```bash
export RISCV=/opt/riscv #你clone工具链的位置
export PATH=$RISCV/bin:$PATH
```

保存并退出（不要忘了:wq ^_^

验证配置是否成功

```bash
which riscv32-unknown-elf-gcc
```
若返回对应地址，则配置生效
### 添加对应脚本
到存放汇编文件的文件夹，在目录下打开wsl

新建脚本asm2hex.sh

```bash
#!/bin/bash
# 用法: ./asm2hex.sh filename.s
# 比如: ./asm2hex.sh test.s 会生成 test.hex

set -e

# 检查参数
if [ -z "$1" ]; then
  echo "❌ 错误：请输入 .s 汇编文件名作为参数，例如：./asm2hex.sh test.s"
  exit 1
fi

# 提取文件名（不带扩展名）
input_file="$1"
base_name="${input_file%.*}"

# 编译生成中间文件
riscv32-unknown-elf-as -march=rv32i -o "${base_name}.o" "$input_file"

# 转换为纯二进制文件
riscv32-unknown-elf-objcopy -O binary "${base_name}.o" "${base_name}.bin"

# 输出十六进制，每行一个指令，写入 .hex 文件
hexdump -ve '1/4 "%08x\n"' "${base_name}.bin" > "${base_name}.hex"

echo "✅ 成功生成：${base_name}.hex"
```

保存脚本之后，赋予执行权限
```bash
chmod +x asm2hex.sh
```

假设你的汇编文件名为 test.s ，执行脚本
```bash
 ./asm2hex.sh test.s
```

则可以看到转换为十六进制的输出，如果你编写的有错，也会给出提示。
示例
test.s 如下
```asm
.text
.global _start
_start:
  addi x1, x0, 5
  addi x2, x1, 10
```

得到的十六进制为
```
00500093
00a08113
```
可以通过[网站](https://luplab.gitlab.io/rvcodecjs/)验证其正确性

### 致谢

感谢 GPT-4o 对本文的大力支持
