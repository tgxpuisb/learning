## 如何同步判断设备是否支持webp格式

今天，我想向大家介绍一种判断设备是否支持webp的方法，该方法与过去我们认知截然不同，因为他是一个同步判断的方法。

#### 前言

过去，我们通常采用让一个`img`标签去加载一张webp格式的图片的形式，通过判断注册在img标签上的`onload`回调或者`onerror`回来掉判断设备是否支持webp格式，这样的做法很简便，但是这个方法是**异步**的，我们无法第一时间得到我们想要的结果，只能通过一个回调函数进行判断。

```js
function checkWebp(cb){
	let img = new Image()
	img.onload = function(){
		cb(true)
	}
	img.onerror = function(){
		cb(false)
	}
	img.src = 'xxxx.webp'
}

// 使用
checkWebp(isSupport => {
	if(isSupport){
		//do somethings
	}else{
		//do otherthings
	}
})
```

#### 同步检查

回调函数的优点是简单、容易理解和部署，缺点是不利于代码的阅读和维护，各个部分之间高度耦合，流程会很混乱。同时异步具有传染性，一处使用了异步方法，那么依赖他的部分便统统成为了异步。

特别是当你读过《代码整洁之道》之后，你可能会对这种写法有一些不爽，事实也确实如此，我司lib库中就有专门判断webp支持情况的异步代码，其他依赖其判断结果的lib库也无一例外的选择了将自身的逻辑嵌套在一个这样的回调函数中。

难道我们就没有一种更“优雅”的方式么？比如这样：

```js
function isSupportWebpSync(){
	// ....
}

if(isSupportWebpSync()){
	// do something
}else{
	// do something
}
```

答案是有，而且不止一种。下面我们就来简要说明下这两种判断的方法吧

方法一

```js
function isSupportWebpSync(){
    const elem = document.createElement('canvas')
    if (!!(elem.getContext && elem.getContext('2d'))){
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
    }else{
        return false
    }
}

```

> 该方法原理是创建一张canvas画布，将其强行转成base64编码的webp图片，如果转码成功，那么开头会有webp相关的标识符

该方法发现于[stackoverflow](http://stackoverflow.com/questions/5573096/detecting-webp-support)一个得票第三名的方法，第一名是一个异步方法

方法二

```js
function supportWebp () {

    let support = true
    const d = document

    try {
        let el = d.createElement('object')
        el.type = 'image/webp'
        el.innerHTML = '!'
        d.body.appendChild(el)
        support = !el.offsetWidth
        d.body.removeChild(el)
    } catch (err) {
        support = false
    }

    return support
}
```

> 该方法很神奇，查了很多地方没有明确的解释，最后找到的一个解释是如果浏览器支持webp，那么这个object标签是不可见的否则就会显示高度，offsetWidth等于0

#### 测试
手上只有iPhone7，和一个安卓手机，所以测试范围比较小，但是在微信，自带浏览器，webivew（排除客户端使用工具自行解码webp图片）等环境下测试的结果都符合预期，所以期待更专业的测试结果

#### 总结

方法二，是我在阅读某开源项目源码时无意间发现的，当时只看到了方法名和return，直觉就告诉我这是一个同步检查设备webp支持情况的函数，对此我查阅了很多资料（国内的基本都是使用图片的方法），在stackoverflow上面查到了方法一，在另一篇blog上面查到了方法二简要的解释

后期我想我应该会完善设备测试，并推动我司在该方面lib库上的升级操作。通过这两个同步方法，相信大家以后在处理到这方面业务的时候代码能够写得更加简洁优雅






