## 富文本框初探

最近在做一个需求，在移动端的webview的环境中实现一个简易的富文本编辑器。

本以为需求很简单，简单到只需要实现图文混排就可以了。但是在实际操作的时候发现，其实这其中没有想象的那么简单。

好在客户端的朋友扒了知乎和简书的web文本编辑器的代码做参考，加上查询了一些资料终于让我淌过了这些坑。

目前我遇到的坑有两个，一个是图片上传之后准确的插入文本框中，另一个是光标能够一直在软键盘的上方。第一个通过代码能够解决。第二个则与客户端同学共同配合解决。

下面我们来简单说一下要想写出一个简单的富文本编辑器需要做到一些什么吧。

首先是基础知识点，分别是`execCommand`，`Selection`，`Range`。直接查询MDN。

#### execCommand
简单来说`document.execCommand`是一个方法该方法允许运行命令来操纵可编辑区域的内容。大多数命令影响文档的选择。像什么加粗、标题、倾斜、背景色、文字大小、颜色、对齐方式等等基本上都可以通过这个命令来搞定。可以参考链接[https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)。

#### Selection
Selection对象表示用户选择的文本范围或插入符号的当前位置。它代表页面中的文本选区，可能横跨多个元素。文本选区由用户拖拽鼠标经过文字而产生。要获取用于检查或修改的Selection对象，请调用`window.getSelection()`。[https://developer.mozilla.org/zh-CN/docs/Web/API/Selection](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)。

#### Range
Range表示包含节点和部分文本节点的文档片段。它可以用`document.createRange`来创建，也可以用`selection.getRangeAt()`方法来获得。[https://developer.mozilla.org/zh-CN/docs/Web/API/Range](https://developer.mozilla.org/zh-CN/docs/Web/API/Range)。

此处我建议大家去简单的看看这些基础知识与API接口，如果不太了解可能后面的内容会有点难于理解。

可以说上面3个知识点基本上已经覆盖了一个富文本框的核心，如果你已经初步的研究过了，那么我可以放心的说，你已经能看懂所以的富文本框的代码的封装了。**上面3个类概念便是理解富文本框的最基本的理论了（划重点了哈）**。

不信？那我们来拆解一个简单的富文本框试试吧。这里我首推一个叫做`WangEditor`的编辑器。它是一个PC端的编辑器。3.0版本的`WangEditor`代码采用ES6module来书写使用rollup来进行打包。这类代码的结构是最容易看懂的。[https://github.com/wangfupeng1988/wangEditor/tree/master/src/js](https://github.com/wangfupeng1988/wangEditor/tree/master/src/js)。

`index.js`是一个入口文件。

`config.js`是一个默认配置文件。

`editor`是整个项目的核心文件，用来实例化整个editor并且初始化其他功能模块

`command`是一个对`execCommand`的封装。

`menus`里面放了许多的菜单，比如加粗、倾斜、字体大小等等

`selection`则是对`Selection`的封装，用来管理光标选取。这里要尤其注意两个方法，`saveRange`，`restoreSelection`。当用户进行图片上传的时候，文本框会失去焦点，而要想把图片正确插入最后一次光标焦点所在位置，则需要对区域进行存储，这两个便是实现富文本框添加各种内容的核心方法了。

`text`这个类用来将富文本框中的内容进行获取，或者设置。

`util`一些小工具的存放地。

具体源码阅读大家可以慢慢看，相信看完之后对大家的技术水平又是一个很大的提升。

### 总结

今天总算是把移动端的富文本框问题搞定得差不多了。还有一些小细节需要优化，这里说一下我踩过得一些坑吧。

0. 光标问题是个大坑。有些细节做不到也不要勉强。
1. 在移动端上软键盘是一个比较严重的问题，对于软键盘的呼出建议客户端帮忙监听并且与webview进行通信，这样前端好做出及时反映。
2. 安卓和ios存在一些差别。多写if-else吧，知乎干脆就直接写了两套代码。
3. 了解webview和客户端们各自的优势，这点很重要，目前就我看来，web的优势在于图文混排的排版，而客户端的优势在于比web能够获取到更多更全面的信息。所以如果想把交互做好，与客户端的通信有很多可以研究的地方。