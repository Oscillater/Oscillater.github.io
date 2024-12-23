---
title: Python 速查
id: python
---
## * args
在Python中，`*args`是一种特殊的语法，用于在函数定义中传递任意数量的参数。这里的`args`是一个参数元组（tuple），它可以接收任意多个位置参数，并将它们作为一个元组传递给函数。

当在函数定义中使用`*args`时，意味着函数可以接受任意数量的参数，并将这些参数打包成一个元组。这样，在函数体内部，可以通过使用`args`来访问这个参数元组，然后对其中的参数进行操作。

下面是一个使用`*args`的简单示例：

```python
def my_function(*args):
    for arg in args:
        print(arg)

my_function(1, 2, 3, 4)
```

输出：
```
1
2
3
4
```

在上面的例子中，函数`my_function()`定义了一个参数`*args`，它可以接受任意数量的参数。当我们调用`my_function(1, 2, 3, 4)`时，这些参数会被打包成一个元组`(1, 2, 3, 4)`，然后在函数体内部使用`args`来访问这个元组，并打印出其中的每个参数。

## zip函数
`min()`函数和`zip()`函数：
```python
similar_word, similar_diff = min(zip(valid_words, words_diff), key=lambda item: item[1])
```
在这行代码中，首先使用`zip()`函数将`valid_words`和`words_diff`两个列表按索引进行配对。`zip()`函数将这两个列表中相同索引位置的元素打包成一个元组。例如，如果`valid_words`是`['apple', 'banana', 'orange']`，`words_diff`是`[2, 4, 3]`，那么`zip(valid_words, words_diff)`将返回一个可迭代对象，其中包含了`('apple', 2)`，`('banana', 4)`和`('orange', 3)`这三个元组。

然后，使用`min()`函数对这个可迭代对象进行求最小值的操作。`min()`函数接受一个关键字参数`key`，用于指定比较的键。在这里，使用了`lambda item: item[1]`作为`key`，表示按照每个元组的第二个元素进行比较。也就是说，`min()`函数将根据`words_diff`中的值来找到最小值所对应的元组。

最后，使用解构赋值的方式将最小值对应的单词和差异值分别赋值给变量`similar_word`和`similar_diff`。

## tuple与tuple 函数
### tuple
- 不可改变的元组（仅仅可以改变其名字所指的对象，而非对一个元组**本身**做一些改变的操作）
- 可以用tuple作为dictionary的key（而list却不可以，因为它们不能哈希化）
- 可以更改tuple中list的值
### tuple函数
`tuple()`是一个内置函数，用于将一个可迭代对象转换为元组（tuple）类型。

元组是Python中的一种不可变序列类型，它可以包含任意多个元素，并且元素的值和顺序都是固定的。元组使用圆括号进行表示，例如`(1, 2, 3)`。

`tuple()`函数可以接受一个可迭代对象作为参数，例如列表、字符串、字典等，然后将其转换为一个元组。如果参数本身就是一个元组，则不会进行任何转换，直接返回原始的元组。

以下是一些示例：
```python
numbers = [1, 2, 3, 4, 5]
numbers_tuple = tuple(numbers)
print(numbers_tuple)  ## 输出：(1, 2, 3, 4, 5)

string = "Hello, World!"
string_tuple = tuple(string)
print(string_tuple)  ## 输出：('H', 'e', 'l', 'l', 'o', ',', ' ', 'W', 'o', 'r', 'l', 'd', '!')

dict = {'a': 1, 'b': 2, 'c': 3}
dict_tuple = tuple(dict)
print(dict_tuple)  ## 输出：('a', 'b', 'c')
```

总结来说，`tuple()`函数用于将一个可迭代对象转换为元组，将对象的元素按照原始顺序保存在元组中，并且元组中的元素不可修改。
## Mutation
- 一个对象的变化叫做Mutation
- 当改变一个list的时候，原来的值也随之变动。
- 只有List和Dictionary可以变化
- 可以在函数中执行Mutation，可以改变其外面的值
## Is and Equal
- `<exp0> is <exp1>`是正确的，如果二者指向同一个对象
- `<exp0>==<exp1>`是正确的，如果两者的值相等
## list 中一些函数的用法
- `list.append()`用于加单个元素
- `list.expand()`用于加多个元素，且是可迭代元素（可以逐个访问）
## print和return
- print函数不打印string两端的''
- return函数在返回一个字符串时会返回两端的''