最近跟着公司小伙伴们一起在学习一本叫《JavaScript设计模式与开发实践》，我花了大概两周的碎片时间加上周末的几个小时整块时间，完成了这本书的阅读。

按照书上描述前端编码中常见案例，再结合自己在工作中写的代码，我发现了自己代码的很多不足，但是同时也有很多地方的代码已经其实或多或少已经用上了一些设计模式的思想。总得来说整个过程给我感觉是一个一个的顿悟，这种感觉很美好。

在我写代码的很长一段时间里，我都很少提及到**设计模式**这样一个被我认为是“高端”的话题。我也总认为不能为了设计模式而去设计模式。所以久而久之，我便很少再去关注设计模式了。

随着时间的增长，我也能够去判断哪些代码写得优雅，哪些代码写的非常的糟糕，但是我无法说出代码好坏的具体原因。非常幸运，在这个时候我遇到了这样一本书。

与传统的讲设计模式的书不一样，此书是站在JavaScript这门语言的层面上来进行讲解，抛弃了Java设计模式对类型的苛刻要求，充分发挥了JavaScript动态语言和函数式编程的特性。使得整书的知识点和传统的面向对象不完全相同。非常推荐前端的小伙伴们去阅读下这本书，会有不一样的收获。

全书最开始几章，先介绍了JavaScript语言的特定、`this`关键字、闭包、高阶函数，以及基于原型继承的JavaScript对象系统。这是一些对后续设计模式讲解所必备的基础知识。中间部分才是正式的设计模式的讲解，在本书的末尾则讲解了一些使用设计模式的原则与实际编程技巧。

下面是一些我的所思所想：

### 发布订阅模式：

在大多项目开始使用ES6的Class语法糖进行编写的时候，偶尔会遇到一些异步操作。此时在回调函数中，如果直接粗暴的在一个类中调用另外一个实例的一个些方法或数据的时候，会显得代码逻辑很混乱。

```js
// bad-case
class Class1 {
    constructor(){}
    someAsyncOtion1(cb){}
}

class Class2 {
    constructor(){},
    someAsyncOtion2(cb){}
}

const class1 = new Class1()
const class2 = new Class2()
Class2.someAsyncOtion2(() => {
    class1.someAsyncOtion1(() => {
        // 整个的调用在异步逐渐增多后容易混乱
    })
})
```

此时我们就使用到了一个Event类。这个类的思想就是充分利用了发布-订阅模式。

```
class Event {

    listeners = {}

    constructor(){}

    on(type, cb){
        if(typeof type === 'string' && typeof cb === 'function'){
            this.listeners[type] = cb
        }
    }

    fire(type, ...other){
        let cb = this.listeners[type]
        if(typeof cb === 'function'){
            cb(...other)
        }
    }
}
```

其实代码非常简单，只需要实例化Event类，通过Event类就可以实现其他的类之间的通信，当然直接在已有的类中Mixin这个类也是可以的。

### 代理模式：

公司的`hybrid`库是一个前端调用客户端的基础库，可以使得前端具备一些客户端的能力。具体调用一个`hybrid`方法如下：

```js
hybrid.config({
    jsApiList: {
        'hybridMethod': 'required'
    }
}, function (err, result) {
    if (!err && result.indexOf('hybridMethod') > -1) {
        hybridMethod.hybridMethod({}, function () {
            //调用成功后的回调
        }) //这里才是真正的调用
    } 
})
```

是的，你没看错。为了调用一个方法，你需要写这么一堆复杂的代码，此外还要有两层回调。如果你有尝试过RTFSC(Read The F*cking Source Code)你会发现这个封装真的是非常的原始，丝毫不考虑使用者的感受。

我经常会调用时写错代码，在被坑过无数次之后，我选择了自己动手，封装了一个叫`simple_hybrid`的库，把繁琐的调用改成了如下形式的调用形式。

```
const hybrid = new Hybrid(['hybridMethod'])

hybrid.hybridMethod({}, function () {
    
})
```

当时我并不知道我用了怎样的设计模式。只是想通过封装让工具调用变得简单易懂。在读完本书后再回过头来看。这个库就是使用了代理模式（还有发布-订阅模式和单例模式）。开发者通过这一层代理直接传入想调用的方法，背后一系列复杂的操作，都由这个库来完成。最后只需要调用者调用完成，调用者根本不需要知道这其中经历了怎么样的细节。

就在刚才看完了代码之后，我对我之前封装的库又有了一些想法，会本着更易用，更高扩展的前提下对该库再重构一下。


### 装饰器模式：

在前端开发使用ajax的时候，经常会出现线上需要数据与线下需要配置不相同的情况。

比如下方代码。我们需要判断是否使用mock数据，并且uid等于11的配置是与后端在测试服务器上面联调时候需要的数据。发布上线的时候还需要注释掉。

```js
// case-1
const USE_MOCK = true
if (USE_MOCK) {
    $.ajax({
        url: 'mock-url',
        data: {
            // some other data
        }
    })   
} else {
    $.ajax({
        url: 'test-url',
        data: {
            uid: 11 在线下服务器联调时候使用
            // some other data
        }
    })
}

```

其实我们所做的操作仅仅是要给ajax增加一些固定的参数，严格说来这个方法没有太大问题，Uglifyjs在做代码压缩的时候甚至会帮你做优化，直接删除if-else分支中不可能走到的语句。问题出在是否优雅。并易于维护，包括我们最后发布上线需要改动的地方是否过多。针对上面的情况，我们可以做如下优化：


```js
Function.prototype.before = function (beforeFn) {
    var self = this
    return function () {
        beforeFn.apply(this, arguments)
        return self.apply(this, arguments)
    }
}
// 这里虽然扩展了原型，同样也有不扩展原型的装饰器版本

// 装饰器，在执行$.ajax的时候先改变其参数上面的url值
$.ajax = $.ajax.before(function (option) {
    option.url = 'mock-url'
})

// 装饰器2，在执行$.ajax的时候给data参数上面挂载uid
$.ajax = $.ajax.before(function (option) {
    option.data = option.data || {}
    option.data.uid = 11
})

```

通过上述改写，在调用$.ajax的时候就会先挂载uid等于11这个在线下服务器与后端联调时候的数据，再把url改成`mock-url`，这样写最大的好处是我们可以非常直观的装饰$.ajax的执行，而且当我们需要取消某个额外的操作的时候直接注释掉这个装饰器即可，比起直接去显示的修改某一行代码要优雅得很多。


### 状态模式：

曾经，有一个需求，描述是这样的，页面上面有一个按钮，用户因某个利益点而点击按钮，此时按钮文字和状态发生改变，如果用户没有下载过APP则引用帮用户下载APP，按钮提示正在下载，当下载结束按钮提示点击进入APP。

这个操作如果用流程图表示如下：

```
graph LR

button(按钮) -->|未安装|downing(下载中按钮) 
downing -->|下载成功|goto(进入APP按钮)

button-->|已安装|goto

goto-->|点击|app(进入app)

```

当时为了处理这些状态我想到了有限状态机和生成器函数，但是当时项目中并不支持ES6代码。于是我决定使用switch模拟，代码很挫，大致如下：

```js

var downloadAPP = (function (state) {

    function changeState (newState) {
        state = newState
    }
    return function () {
        switch (state) {
            case 'init':
                // do something
                changeState('download')
                break
            case 'downloading':
                // do something
                break
            case 'intoAPP':
                // do something
                changeState('init')
                break
        }
    }
})('init')

$('#button').on('click', function () {
    downloadAPP()
})

```

加上必要的封装，这样写在当时看来已经是一个不错的解决方案了。但是在学过设计模式之后，我发现这样写其实并不好（违反了开放-封闭原则），假设产品丧心病狂的在这个步骤中增加一些额外的状态，那么我需要改变这个函数的本身，当加入多个状态的时候，问题就更加凸显了，switch的分支会变得非常的庞大。这样是不利于维护的。在学习过状态模式之后，我逐渐了解到还有更好的解决方案：

```js

function init () {
    this.changeState(downloading)
}

function downloading () {
}

function intoAPP () {
    // 事物外部状态的改变触发了内部状态的改变
    this.changeState(init)
}

var downloadAPP = {
    stateMethod: init,
    changeState: function (method) {
    // Context 改变状态的上下文
    //事物的内部状态的改变所带来的行为的改变
        this.stateMethod = method
    },
    done: function () {
    // Request 状态模式中的请求处理
        this.stateMethod()
    }
}



$('#button').on('click', function () {
    downloadAPP.done()
})

```

改成这样的方法，我们把行为和状态做了一个很好的分离。如果产品想丧心病狂的要加功能，我们也只需要对增加的功能写几个函数即可,在额外写的函数中切换状态即可。不再需要去更改downloadAPP这个对象中的代码。

### 总结：

由于篇幅关系，很多案例还并没有分析到。本书是一本读完后值得仔细思考的一本书。书中作者反复强调不要为了设计模式而设计模式。一定是要根据场景来判断何种写法更符合编程的法则，而不是在想要怎么套用设计模式。

正如最后一个例子，你恐怕不会在任何一个地方（包括本书中）看到这样的一种写法，但是如果你仔细阅读注释，你会发现它符合对状态模式的基本定义。这只是一种针对JavasScript这门语言再结合具体事例而书写的一种特殊的例子。

本书所讲的知识，即是设计模式，又不是设计模式。在我看来他更像是《代码整洁之道》的另外一个版本，通过讲解设计模式，告诉了我们应该如何书写优雅，易读，可扩展的代码。
