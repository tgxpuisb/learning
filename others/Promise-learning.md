# 从PromiseA+规范中学习你不知道的Promise

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

这几道题考察的是关于Promise调用链的执行情况。

从规范中能够看出来每一个Promise实例必须实现一个`then`方法，该方法传递两个参数`onFulfilled`，`onRejected`，这两个参数如果不是函数则被忽略。

接下来是重点了`then`方法必须返回一个新的Promise对象，这也是Promise能够被连贯调用的。包括`catch`也是一样的。

![](http://h0.hucdn.com/open/201716/c9c23471b9b444d6_1678x578.png)

```
promise2 = promise1.then(onFulfilled, onRejected)
```
- 如果`onFulfilled`或者`onRejected`返回一个值`x`则运行下面的Promise 解决过程：`[[Resolve]](promise2, x)`
- 如果`onFulfilled`或者`onRejected`抛出一个异常`e`，则`promise2`必须拒绝执行，并返回拒因`e`
- 如果`onFulfilled`不是函数且`promise1`成功执行，`promise2`必须成功执行并返回相同的值
- 如果`onRejected`不是函数且`promise1`拒绝执行，`promise2`必须拒绝执行并返回相同的据因

理解上面的“返回”部分非常重要，即：**不论`promise1`被`reject`还是被`resolve`时`promise2`都会被`resolve`,只有出现异常时才会被`rejected`**。

通过这几条规则，我们就能够很好的理解上述问题了。同时当我们回头去看阮一峰和其他教程的时候，也能更加理解其中的很多“建议”的由来了。比如建议使用`.then(() => {}).catch(() => {})`而不是`.then(() => {}, () => {})`的写法。同时，通过`.then(() => {}).then(() => {}).....`可以达到异步的串行调用。

最后Promise虽然能捕获异步中的错误，但是也仅仅是执行过程同步中出现的错误，而执行过程中的异步错误也是无法捕获的。

总结：一句话，规范和官方文档是第一手的资料。应该好好学习。