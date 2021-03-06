一个能读取photoshop图层的工具库

### 开篇

今天给大家推荐一个厉害的工具库--psd.js

这个工具最大的亮点就是能够读取photoshop的psd文件中的图层信息，并且可以把单张图层导出生成png。在我看来这是一个连接了设计和技术的一个非常棒的库。我最近用它解决了一个小问题，完成了一个小功能，如果该功能正式启用可以节省开发和运营的很多时间。

最近我和我的程序员小伙伴们在工作中接到一个需求，要做一个相片拼图功能，用户可以用自己喜欢的图片，拼在一个选定的相框模板上面，然后生成一张拼图分享到各个社交平台上。

这个需求并不难。定义好描述模板的数据，然后写代码将用户选择的图片渲染到模板上面，最后再生成一张可供分享的图片就完成了。

一切进展都很顺利，但是在功能完成之后，后续新模板的制作上面出了一些小插曲，我们使用json的数据格式来描述模板的背景图、可上传图片张数、图片的宽、高等等相关数据。这些数据由谁来填写呢。后端同学说这事不归我管。设计师说我只管作图。几番讨（zheng）论（zhi）之后，最终大家决定由运营同学和设计同学来量设计稿每个模板的坐标和宽高并标注出来，然后后端同学苦逼的一个一个录入，手写json。于是大家都非常苦逼，模板有十几个，额外增加了非常多的工作量。并且后续还会有很多的模板，可以想象他们还会继续苦逼下去。

我是后来才知道这个情况的，出于好奇，我看了设计给出的psd设计稿和后端同学填写的json的结构后，我的脑海里面立马想起了这个工具库，最终我提议可以使用脚本来读取psd文件，然后只要设计同学遵循固定的图层结构来设计模板，我们就能读取到我们需要的数据，最终自动生成对应的json结构，如果后端同学提供接口，还能够完成模板图片上传，和模板数据直接写入数据库的操作，只需要设计师给出设计稿，我们就可以通过脚本来完成，整个过程就全部自动化掉了。

最终我写出了功能的原型，并且得到了小伙伴们的支持，他们也愿意配合我完善脚本，直到最终变得可用。可以想象，这个做法能为大家节省非常多的时间，运营同学可以把时间花在如何提升用户活跃度上，后端同学则可以把时间花在研究技术上。至于设计同学嘛。。。不好意思我不太懂设计，这里就不过多谈论了。

### 使用

它的使用方法很简单只需要简单的安装，引入，读取文件。

安装
```
npm install psd
```

```js
//引入
const PSD = require('psd')
//读取并解析psd文件
const psd = PSD.fromFile('./test.psd')
psd.parse()
//获取图层树的结构并导出成数据
const tree = psd.tree() //把图层转化成树状结构
console.log(tree.export())
```

```
{ children:
   [ { type: 'layer',
       visible: true,
       opacity: 1,
       blendingMode: 'normal',
       name: '图层 14',
       left: 0,
       right: 750,
       top: 0,
       bottom: 1000,
       height: 1000,
       width: 750,
       mask: {},
       text: undefined,
       image: {} }
   ...
   ...
   ...
   ...
   ],
  document:
   { width: 750,
     height: 1000,
     resources: {}
```

通过上面的json结构我们可以看出这是描述了图层位置、宽、高等一些数据。通过这些数据，我们就能够很好的获取的图层的相关信息。重要的是，它还能够单独得到到某个图层或者某个组（group）的节点并转化成web格式的图片。

```
tree
    .descendants()[0]
    .image
    .saveAsPng('.test.png')
    .then(() => {
        //do something
    })
```

具体的用法可以参考相应的文档[https://github.com/meltingice/psd.js](https://github.com/meltingice/psd.js)

### 总结

通过这个工具，我们利用程序极大地简化之前需要多人重复劳动完成的事情。如果稍加抽象，你可能会发现他有可能能够更快的帮设计师完成切图工作，并且应用到更广泛的地方去。

我们使用这个工具库，不仅仅是为了好玩，更是为了能自动化我们的工作。让我们的双手和大脑从一些没有技术含量，低效重复的工作中解放出来，转而投向到更有意义的工作中去。

最后把这样一个工具库推荐给大家，也希望大家能够更好的使用它。






