# 项目脚手架开发心得
基于yeoman开发属于自己的脚手架工具

---

### 初衷 

> 最近在做公司前端library库2.0的重构,经常要根据不同项目构建不同的工程化环境.联想到之前每次自己开发基础库时都要花一些时间来配置各种各样的工具,诸如:webpack2,eslint,babel,mocha等等,所以总是想着要是有一个比较基础的脚手架就好了.
> 
> 查询了下github,发现大部分工程化的脚手架工具都是基于vue,react,angular等等比较重型的框架的,有一些用于开发library库的脚手架也不是很满足当前的需求,于是我萌生了一个想法,为什么不能自己实现一个高度定制化的脚手架工具呢.
> 
> 于是开始了调研工作,决定采用基于yeoman安装的形式来开发脚手架工具.查询了下文档加上看了别人的写法,发现并不困难,通过一个下午的琢磨,最终终于搭建了一个自己的项目生成器.通过该工具可以加快开发library库的速度,把更多的时间花在代码本身而不是环境搭建上.

### 原理

> 通过阅读文档以及查看源代码,了解到了yeoman的generator的原理
> 
> 简单来说一个标准的脚手架应该包含如下几个功能 #代码模板(最基础的部件,)
>
	1. 命令行交互功能(用来获取用户的配置与选择,yeoman使用的是业界典范[Inquirer.js](https://github.com/SBoudrias/Inquirer.js))
	2. 代码模板(根据用户配置生成对应代码,yeoman在这一块基于ejs模板,当然也有基于mustache的)
	3. 文件处理
	4. 与其他工具(git, npm)整合
> 
> 对于命令行交互功能yeoman使用的是业界公认的经典[Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
> 
> 模板则使用的是ejs模板
> 
> 文件处理yeoman则使用的是[mem-fs-editor](https://github.com/sboudrias/mem-fs-editor),这是一种使用buffer流的[虚拟文件](https://github.com/gulpjs/vinyl-fs)
的框架,虚拟文件的理解可以类似于虚拟dom,具体理解目前作者处于意会状态,所以不做展开
>
> 最后是工具整合,yeoman封装了子进程模块,使得我们能够更优雅的执行类似`npm install xxx`,`git clone xxx`之类的代码操作
> 
> 通过上述模块,基于yeoman工具书写的generator能够完成通过用户配置继而生成代码片段,最后通过git管理,通过npm安装依赖等操作,生成一个可以立即使用的项目框架.这种工具被很形象的称为`脚手架`

### 实践

> 前面说了一大堆废话,现在让我们来具体实践一下,[英文文档在此](http://yeoman.io/authoring/),首先你需要全局安装yeoman,因为所有你写的generator最后都会通过yeoman来安装成项目

```
npm install -g yo
```

> 然后,找个文件夹创建你的项目,此时我们假设你要创建一个生成demo的脚手架,此时你可以给你的项目起个名字,最好是在npm网站上面没人用的,方便你把他发布到npm上
> 
> 现在假设我们要创建的脚手架名字就叫demo,此时你的所有项目都`必须`是generator-demo这个名字(yeoman文档上面用的是`must`这个词)
> 
> 接下来我们创建generator-demo文件夹,然后进入文件夹npm init,记得init时的项目名也一定是generator-demo

```
mkdir generator-demo
cd generator-demo
npm init
```

> npm init之后我们会得到package.json文件,对该文件进行如下配置

```
{
  "name": "generator-demo",
  "version": "0.1.0",
  "description": "",
  "files": [
    "generators"
  ],
  "keywords": ["yeoman-generator"],
  "dependencies": {
    "yeoman-generator": "^1.1.0"
  }
}
```

> yeoman的生成器提供很多分支生成方式,不过做为入门先不做详细介绍,有兴趣的可以自己看看文档,我们在generator-demo文件夹下创建一些固定格式的文件夹,具体形式如下

```
--- generator-demo
 |
 --- generators
  |
  --- app
   |
   --- template
    |
    --- src
    --- _package.json
    --- babelrc
    --- webpack.config.js
   --- index.js
--- package.json
```

> 该格式是yeoman约定好的,在app/template下面我们将会放将要生成的项目模板,而app/index.js将会描述当执行yeoman的yo demo 脚手架命令时该生成器如何使用模板生成代码
> 
> 在app/template文件夹的文件此时无论后缀如何,都会被视作模板,准确的说是ejs模板

### 逻辑编写
> 前面,我们提到index.js是描述改脚手架工具的核心文件,那么接下来我们来开始对其进行编写
> 
> 首先,我们需要引入 yeoman-generator 这个包,然后书写一个类去继承他,最后把该继承之后的类导出即可,随后的事情在你执行yeoman的时候就交给yeoman去解析了

``` js
"use strict"
const Generator = require('yeoman-generator')
class GeneratorLibrary extends Generator {
	constructor(args, opts){
		super(args, opts) // 尽可能保证super优先被调用
	}
	
	method1(){
		this.log('it will run second')
	}
	
	method2(){
		this.log('it will run third')
	}
	
	_method3(){
		this.log('it will not run')
	}
	
	initializing(){
		this.log('it will run first')
	}
	
	prompting(){
		this.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'Your project name',
				default: this.appname
			}
		]).then(answers => {
			this.log('it will run after initializing')
		})
	}
}
```

> 在类中,你可以写非常多的方法,yeoman按书写顺序由上而下的执行下去,也就是说,所有你书写的能被`Object.getPrototypeOf(GeneratorLibrary)`返回true的方法都会被按一定顺序执行,如果你不想让某些方法只是作为helper辅助其他任务而不想让他自动执行,可以把他私有化,在方法前面加`_`
> 
> 该执行顺序的优先级如下,在类中可以书写如下方法
> 	
> 	1. initializing(项目初始化,可以检查当前项目状态,或者配置等等,在构造函数之后执行)
> 	2. prompting(询问用户配置,方法里可以调用 this.prompt,它是Inquirer.js的实例)
> 	3. configuring(能够配置该项目,用处不大)
> 	4. default(执行你的自定义的一大堆方法)
> 	5. writing(写入文件)
> 	6. conflicts(如果项目中存在该文件,并且冲突,该如何解决)
> 	7. install(在新项目中执行npm或者bower或者yarn等等)
> 	8. end(项目收尾,clean,和你say goodbye)
> 
> 
> 当然在此之前,你最好了解一下基类的build-in内置方法,以免出现overwrite的现象覆盖原方法
> 
> yeoman-generator的常用内置方法有很多几个常用的如下
> 
> 	1. this.argument(name, config)
> 
> 		为命令行 yo demo xxx sss的参数命名  
> 		该方法只能出现在构造函数之中,调用根据顺序来,如:  
> 		this.argument('first', {})  
> 		this.argument('second', {})  
> 		接下来,在this.options.first中的值是xxx  
> 		而this.options.second中的值是sss
> 
> 	2. this.option('name', {})
> 
> 		获取命令行 yo demo --xx --ss的操作信息  
> 		this.option('xxx', {})  
> 		this.option('sss', {})  
> 		接下来同样是通过this.options.xx获取到是否有该操作
> 
> 	3. this.fs 一个文件操作类mem-fs的实例,负责处理文件与模板的拷贝
> 
>	4. this.log 在项目中yeoman`不允许`使用console.log,需要用log来代替
> 
>	5. this.composeWith yeoman允许在生成的时候同时调用另一个脚手架工具来辅助生成代码(类似模块化的感觉)
>
>	6. this.npmInstall or this.yarnInstall 用来在脚手架完成工作后安装模块
>
>	7. this.sourceRoot 返回 ./templates
> 
> 	8. this.templatePath('index.js') 返回 './templates/index.js'
> 
>	9. this.destinationRoot() 返回你将要安装的项目的路径
>
>	10. this.destinationPath('index.js') 返回你将要安装的路径 + '/index.js'
>
> 	11. this.fs.copyTpl 使用ejs编译模板,并进行拷贝
> 
>	12. this.fs.copy 直接拷贝模板
>
>	13. [更多API](http://yeoman.io/generator/)
>

---
> 实际情况中我们用不到这么多,下面是一个很简单的例子,还记得之前我们的项目结构么,假设我们现在要打包了

templates里面的_package.json文件可以这么写

``` json
{
  "name": "<%= appname %>",
  "version": "0.0.1",
  "description": "",
  "main": "dist/<%= appname %>.js",
  "jsnext:main": "src/<%= appname %>.js",
  "repository": "https://github.com/<%= name %>/<%= appname %>.git",
  "author": "<%= name %> <<%= email %>>",
  "bugs": {
  	"url": "https://github.com/<%= name %>/<%= appname %>/issues"
  },
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --open",
    "build": "cross-env NODE_ENV=production webpack --progress"
  },
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {
    "babel-core": "^6.23.1",
    "babel-loader": "^6.3.2",
    "babel-eslint": "^6.0.2",
    "babel-plugin-syntax-class-properties": "^6.13.0",
    "babel-preset-es2015": "^6.22.0",
    "babel-preset-stage-0": "^6.22.0",
    "cross-env": "^3.0.0",
    "eslint": "^2.7.0",
    "eslint-config-airbnb": "^7.0.0",
    "eslint-plugin-babel": "^3.2.0",
    "webpack": "^2.2.1",
    "webpack-dev-server": "^2.4.1",
    "webpack-merge": "^3.0.0",
    "mocha": "^2.4.5",
    "chai": "^3.5.0"
  }
}

```

index.js

``` js
"use strict"
const Generator = require('yeoman-generator')
class GeneratorLibrary extends Generator {
	constructor(args, opts){
		super(args, opts) // 尽可能保证super优先被调用
	}
	
	prompting(){
		this.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'Your project name',
				default: this.appname
			}
		]).then(answers => {
			this.appname = answers.name  //获取用户定义的项目名称
		})
	}
	
	writing(){
	
		// 编译模板,并注入一些变量,使得模板具有定制化
		this.fs.copyTpl(
			this.templatePath('_package.json'),
			this.destinationPath('package.json'),
			{
				appname: this.appname,
				name: this.user.git.name(),
				email: this.user.git.email()
			}
		)
		// 复制src及其文件夹下的内容
		this.fs.copy(
			this.templatePath('src'),
			this.destinationPath('src')
		)
		// babel
		this.fs.copy(
			this.templatePath('babelrc'),
			this.destinationPath('.babelrc')
		)
		// webpack.config.js
		this.fs.copy(
			this.templatePath('webpack.config.js'),
			this.destinationPath('webpack.config.js')
		)
	}
}
```

### 测试

> 到目前为止我们就算完成了一个初级项目的脚手架制作,然后到了调试环节,使用npm link,可以将模块变成环境变量,该方法仅供测试
> 
> 然后随便找一个文件夹,执行`yo demo`命令,输入appname信息(注意,demo代表的是generator-demo项目),一个项目就已经生成好了
> 
> 熟练了之后你会发现yeoman这个工具还是很好用的

```
npm link

# 找一个文件夹

yo demo
```

### 上线

> 最终我们将我们的脚手架工具发布到npm官网上去,然后再全局安装就可以使用了

```
npm publish 

npm install generator-demo -g

yo demo
```

> 最终生成的项目应该是这样的结构

```
--- src
 |
 --- some code
--- .babelrc
--- webpack.config.js
--- package.json
```

> 本教程旨在讲述一个简单的基于yeoman的脚手架工具如何搭建,如果详细阅读文档相信大家可以搭建出自定义度很高的, 功能更强大的脚手架工具











