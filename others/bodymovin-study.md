# Bodymovin一个能够运行在三端动画的库

## Bodymovin简介

Bodymovin是一个`Adobe After Effects`动画导出插件，如果你做过对设计有了解，那么你一定听说过AE的大名。

> Adobe After Effects简称“AE”是Adobe公司推出的一款图形视频处理软件，适用于从事设计和视频特技的机构，包括电视台、动画制作公司、个人后期制作工作室以及多媒体工作室。属于层类型后期软件。

没错，就是它了。通常，开发者实现设计师动画效果的时候都需要设计师能够把效果导出一份可播放的视频或者图像，再给出一大堆关键节点的动效数据。然后开发者们利用自身平台提供的功能（例如前端会使用`Canvas`或者`SVG`，简单点的可以使用`CSS3`）来实现。有时候一个动效需要在三端来实现，这时候经常会出现由于程序员对动画描述的差异而导致三端动画效果出现不一致，然后设计师就很苦逼的来找开发修改这些动效。

利用`Bodymovin`，我们设计师可以把动效直接导出成json文件，然后我们使用Bodymovin库读取json数据，就可以实现动画效果了。Bodymovin可以生成`CSS3`，`Canvas`，`SVG`三种格式，并且它能够做到自适应。在安卓端和iOS端，airbnb开源了`lottie`库，该库能够在`Android`，`iOS`，`MacOS`，`React Native`多端实现`Bodymovin`导出的动画效果，于是三端就这么兼容了。

## Bodymovin使用

在web端，我们使用方式很简单。只需要导入`bodymovin.js`，然后使用`bodymovin.loadAnimation(data)`引入动画配置，然后调用`play`方法，动画就跑起来了，就这么简单。考虑到json数据较大`Bodymovin`还提供了多种引入`json`，具体可以参考文档。

一个简单的例子
```
<script src="/assets/libs/bodymovin.js"></script>
<script>
    var animData = {
        container: document.getElementById('bodymovin'),
        loop: true,
        renderer: 'canvas',
        autoplay: true,
        animationData: {/*动画导出数据放这里*/}
    };
    var anim = bodymovin.loadAnimation(animData);
    anim.play()
</script>
```

客户端的使用细节可以翻阅相关文档，这里就不描述了。

## 结论

通过对`Bodymovin`调研，得出以下结论

* `Bodymovin`体积较大，gzip之后的大小是完整版140+kb，轻量版本70+kb,引入大型JS库会很消耗性能，所以在动效不复杂且时间充裕的情况下，我们更愿意手动实现动画效果。
* 通过了解客户端实现动效有一定的困难，所以使用该方案能够很好的解决当前UI设计师对动画实现的要求。是个非常好的解决方案，在需要三端统一的情况下，通过使用基础库能够极大的提升开发效率，并且保证三端的一致性。

## 参考
[https://github.com/bodymovin/bodymovin](https://github.com/bodymovin/bodymovin)
[https://github.com/airbnb/lottie-android](https://github.com/airbnb/lottie-android)
[https://github.com/airbnb/lottie-ios](https://github.com/airbnb/lottie-ios)
[http://www.cnblogs.com/zamhown/p/6688369.html](http://www.cnblogs.com/zamhown/p/6688369.html)
[https://www.v2ex.com/t/349525](https://www.v2ex.com/t/349525)


