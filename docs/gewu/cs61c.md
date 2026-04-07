---
title: CS61C
id: cs61c
---
## C
- `printf`:
	- `%s` means print a string
	- `%d` means print a decimal number
	- `%X` means print a hexadecimal number
- `^` bitwise XOR
- 取反最低位 `X^1` 注意不是 `~X`
- C Macro: "Find and replace"
- `typedef A B` def B as A
- `int32_t` means 32 bits, and 4 bytes
- Endianness and Alignment![](/img/cs61c/Pastedimage20240823214537.png)
	- Endianness: little endian
	- Alignment
- Address Space![](/img/cs61c/Pastedimage20240823215134.png)
	- passing pointers caller to callee is ok, but never callee to caller.
- `realloc(void* ptr, size_t size)`  returns new address of block.(in **heap**)
	- `realloc(NULL, size);` behaves like malloc
	- `realloc(ptr,0);` behaves like free
```C
**
//Safer
TYPE *tmp = realloc(ptr, NEW_SIZE);
if (tmp) { ptr = tmp; }
```
- valgrind
- Function Pointers![](/img/cs61c/Pastedimage20240824143327.png)
- dereference: access the data/value in the memory.
- Generic Pointers![](/img/cs61c/Pastedimage20240824143735.png)
- `void *end = (char *) arr + (nelems-1) * nbytes`, `(char *)` means that convert arr from void*(have defined that) to char*
- dereference a variable that is not a pointer--C will treat theat variable's underlying bits as if they were a pointer
- 字符串使用双引号而不是单引号。
## RISC-V
![](/img/cs61c/Pastedimage20240830180332.png)
![](/img/cs61c/Pastedimage20240831145408.png)
![](/img/cs61c/Pastedimage20240831145431.png)
- R-TYPE
![](/img/cs61c/Pastedimage20240831153828.png)
![](/img/cs61c/Pastedimage20240831153432.png)
- I-TYPE
![](/img/cs61c/Pastedimage20240831154101.png)
I*(shift instructions)
![](/img/cs61c/Pastedimage20240831154137.png)
![](/img/cs61c/Pastedimage20240831154218.png)
![](/img/cs61c/Pastedimage20240831154239.png)
- S-TYPE
![](/img/cs61c/Pastedimage20240831155625.png)
![](/img/cs61c/Pastedimage20240831155716.png)
- U-TYPE
![](/img/cs61c/Pastedimage20240831161919.png)
![](/img/cs61c/Pastedimage20240831161617.png)
- B-TYPE
![](/img/cs61c/Pastedimage20240831164634.png)
![](/img/cs61c/Pastedimage20240831164916.png)
- J-TYPE n  
![](/img/cs61c/Pastedimage20240831170250.png)
![](/img/cs61c/Pastedimage20240831170146.png)

:::warning
- load 是 load 某寄存器中存储的对应的地址（中的值）类似，而add是处理存储器中存储的值。
- `jal` 保存返回值，`j` 不保存返回值。
:::
## Compiler,Assembler,Linker,Loader
![](/img/cs61c/Pastedimage20240901125445.png)
- Compilation: what it actually means (and discovered it's just the first step in a very long process)
- Assembly: how human-readable parts of assembly code get swapped out for more machine-readable features
- Linking: how different files and libraries make their way into the final product
- Loading: how a system processes our code to run
## 数电
![](/img/cs61c/Pastedimage20240911162403.png)
![](/img/cs61c/Pastedimage20240911163343.png)
