eA+规范中学习你不知道的Promise

我们大多数人都是通过阮一峰的ES6入门或者其他格式各样的blog来学习[Promise](http://es6.ruanyifeng.com/#docs/promise)的。

多数情况下，我们也只理解其中常用的用法。但是从最近室友找工作面试被问到的Promise问题和重读阮一峰ES6入门后，我才突然发现自己对Promise还远远没有达到了解的地步。
于是我决定去阅读Promise/A+的规范，读完规范后，我对Promise有了更深一层次的理解。以下是我的一些理解。

规范原文：[https://promisesaplus.com/](https://promisesaplus.com/)

规范中文：[http://www.ituring.com.cn/article/66566](http://www.ituring.com.cn/article/66566)

在讲述规范中概念之前，我们可以先来看看几个例子：

```
new Promise(resolve => {
    setTimeout(() => {
        resolve(1)
    })
}).then(res => {
    console.log(res)
    throw new Error('error')
}).then(() => {
    console.log(2)
}).catch(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})
```

在控制台中执行上面代码会打印出什么呢，还有下面代码：

```
new Promise(resolve => {
    resolve(x + 2) //x is not defined
}).then(() => {
    console.log(1)
}).catch((e) => {
    console.log(e)
})
```

这个会打印出什么呢，Promise的执行状态是fulfill（resolved）还是reject还是pending呢？

```
new Promise(resolve => {
    setTimeout(() => {
        resolve(x + 2) //x is not defined
    })
}).then(() => {
    console.log(1)
}).catch((e) => {
    console.log(e)
})
```

这个又会打印出什么呢？

揭晓答案，第一题会打印出`1，2，4`。第二题会打印出`ReferenceError: x is not defined`，然后Promise的状态是`resolved`。第三题则是无法捕获错误`Uncaught ReferenceError: x is not defined`

