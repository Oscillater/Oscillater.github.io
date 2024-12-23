---
title: Typescript 学习
description: 感觉还是没学懂，不然本站会有更多功能
id: typescript
---
## Fundamentals
- statically-typed(javascript is dynamically-typed)
- **typescript is javascript with type checking
- tuple (data,pair)
- `oonst enum xxx{}` 可以生成更加精简的代码。
- function always return `undefined` if you not define it
- set parameter optional: adding `?` after it(default value: `taxYear=2022`) 
## Types
- union types `number | string` means the object is a number or a string.
- intersection types: `A | B` means to define the object you need define method in both class `A` and `B`
- optional access operator `?.`  and `?` means optional
- `speed: speed || 30` if speed is falsy number(`underfined ,null, '', false, 0`) ,speed equal to 30. but sometime speed equal to 0, so we use: `speed: speed ?? 30`  (if speed is `null` or `underfine`, use 30 as value)
- aaa `as` bb, limit the type of value, but type conversion isn't happened here or we use `<bbb>aaa` to do type assertion
- use `unknown` and narrowing , don't use `any`
- `never` means the function never returns
## Class and Interface
- dealing with a custiom account, using `instanceof` 
- `readonly` 
- add `?` can make sth optional
- prefix private properties with a `_`
- getter:
```TypeScript
//define the class
get balance ():number{
	return this._balance;
	}
}
console.log(account.balance);
```
- setter:
```TypeScript
//define the class
set balance(value:number){
//someting
	}
}
account.balance = 1;
```
- creating creatures dynamically: index signature property: `[seatnumber:string]:string;` 
- Inheritance: `super` 
- Method overriding: `override` 

> Classes should be open for extension and closed for modification.

- `privated` members can't be inheritanced.
- `abstract classes` 
- 只有类声明的时候可以使用 interface ，可以让实现更加简洁。接口不能有类的实现。
-  `class implement interface`
## Generic
- class
```Typescript
class KeyValuePair<T>{
	constructor(public key:T, public value:string){};
}
let pair = new KeyValuePair<string>("hello", "world");
let pair1 = new KeyValuePair<number>(1, "apple");
```
- constraints `<T extend number | string >` (limit to number & string)
- `class CompressibleStore<T> extends Store<T>` 
- `keyof T` 也即 T 的所有属性。
- type mapping
```TypeScript
interface Product{
  name:string;
  price: number;
}

type ReadOnlyProduct={
  readonly [Property in keyof Product]:Product[Property]
}
// also written as below: 
type ReadOnly<T>={
  readonly [Property in keyof T]:T[Property]
}
// can find them in typescript utility types
```
## Decorators
- applied in reverse order
- arrow function don't define their own `this` keyword
- `!` means that you know it wouldn't be `null` or `undefined`
## Modules
- import only file name
- `*` means everything
## Integration with JavaScript
- `@ts-nocheck` 
- declare file should describe all feature in the target module