最近在做一个拖拽上传功能，同时也基于VUE实现了一个拖拽功能。

本着折腾一下的想法，我去翻阅了MDN、W3C、stackoverflow等网站的相，资料去详细的了解了一下这个拖拽功能。慢慢的,我发现拖拽功能其实并不像想象中的那么复杂.下面是我的一些总结：

和拖放相关的一共有`drag`、`dragstart`、`dragend`、`dragover`、`dragenter`、`drop`、`dragleave`、`dragexit`。

### 拖与放

下面我们使用类似的鼠标事件来类比理解。首先，我们需要了解HTML5的拖放功能，它实际上分为`拖`与`放`。

`拖`是指当前拖动的元素，可以是一个设置了`draggable`为`true`的元素，也可以是一个从外部拖入的文件（平时看到的拖拽上传，就是基于这个来实现的）。

`放`是指将元素拖动到的`目标元素`。

也就是说，一个拖放过程是由至少两个元素来实现的，一个是`拖`一个是`放`。

理解了上述两个概念，现在我们来对拖放的事件进行一个分类，属于`拖`的操作的事件有：

**drag**：拖动当前元素时触发的事件类似`touchmove`事件，但是不同的是当你拖动元素的时候，即使不移动元素，该事件也会不停的触发。

**dragstart**：开始拖拽元素的时候触发的事件，类似于`touchstart`。

**dragend**: 拖拽动作结束时会触发的时间，类似于`touchend`。

接下来是`放`这个动作。作用在目标元素上面的事件。

**dragenter**：拖拽元素进入目标元素时候触发该事件，类似`mouseenter`。不过该事件可以向上冒泡。

**dragover**: 拖拽元素在目标元素上面移动的时候会触发该事件，类似`mouseover`。特别需要提的是，如果拖拽的元素是一张图片，那么浏览器的默认事件是会直接打开这张图片，所以在在该事件中阻止默认事件。

**dragleave**：拖拽元素离开目标元素的时候会触发该事件，类似`mouseleave`。该事件同样可以向上冒泡。

**dragexit**：一个很奇怪的事件，功能和`dragleave`几乎一样，简单来说就是当时在约定事件的时候各个浏览器厂商拖拽元素离开目标元素的实现名称不一样，后续浏览器厂商为了兼容有的同时实现了两个事件，有的则没有对此进行实现。所以我们一般来说不必使用这个事件，做一个了解就好[https://stackoverflow.com/questions/42775095/dragexit-vs-dragleave-which-should-be-used](https://stackoverflow.com/questions/42775095/dragexit-vs-dragleave-which-should-be-used)。

**drop**：当拖拽元素在目标元素上面放开时会触发。当改事件触发的时候，我们便可以认为完成了一次完整的拖放了。

到此整个的一个拖放过程的事件就讲完了。最后我们还要提到一个关键的属性。

**event.dataTransfer**：该属性是一个对象上挂载着拖拽传递的数据和一些方法（主要是`setData`和`getData`两个方法）。如果拖拽的是个文件，可以在`event.dataTransfer.files`上面拿到文件对象，之后我们再使用`formData`对象即可完成文件上传工作。具体还有很多属性和方法可以参考[https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer)。但是要注意兼容性问题。

### 示例

```js
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>document</title>
	<style>
		#dragElement {
			width: 100px;
			height: 100px;
			background: red;
			margin-bottom: 100px;
		}
		#dropElement {
			width: 500px;
			height: 500px;
			background: green;
		}
	</style>
</head>
<body>
	<div id="dragElement" draggable="true">拖动元素</div>
	<div id="dropElement">被拖动区域</div>
	<script>
		var dragEl = document.getElementById('dragElement')
		var dropEl = document.getElementById('dropElement')
		dragEl.addEventListener('dragstart', function (e) {
			console.log(e)
			console.log('dragstart')
		})
		dragEl.addEventListener('dragend', function (e) {
			console.log(e)
			console.log('dragend')
		})
		var drag = false
		dragEl.addEventListener('drag', function (e) {
			if (!drag) {
				console.log(e)
				console.log('drag')
				drag = true
			}
		})
		dropEl.addEventListener('dragenter', function (e) {
			console.log(e)
			console.log('dragenter')
		})
		dropEl.addEventListener('dragleave', function (e) {
			console.log(e)
			console.log('dragleave')
		})
		var dragover = false
		dropEl.addEventListener('dragover', function (e) {
			e.preventDefault()
			if (!dragover) {
				console.log(e)
				console.log('dragover')
				dragover = true
			}

		})
		dropEl.addEventListener('dragexit', function (e) {
			console.log(e)
			console.log('dragexit')
		})
		dropEl.addEventListener('drop', function (e) {
			e.preventDefault()
			console.log(e)
			console.log('drop')
		})
	</script>
</body>
</html>
```

将红色方块拖动至绿色方块的时候依次会触发`dragstart`，`drag`，`dragenter`，`dragover`，`drop`，`dragend`事件。

如果是从外部拖一个文件进入绿色区域则会触发`dragenter`,`drop`这两个事件

### 总结

了解HTML5的拖放功能，主要可以从`拖`与`放`这两个功能着手。一个拖放过程实际上就是这两个功能的共同作用。在使用的时候，要注意不同的事件应该绑定在不同的元素上面。

最近很久没有如此认真的去了解某一个知识点了。而相对于碎片化的学习，系统学习某一个知识点对我来说也非常重要。对于前端开发者而言MDN和Stack Overflow是一个非常好的系统学习的地方。
