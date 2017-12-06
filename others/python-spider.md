上周我们发现了，github上面的不正常的点赞数。通过分析，我们制定了相应的爬取方案。这周我们开始进行实践。

爬取的第一步是要对页面进行分析，判断页面的渲染过程是后端直出的还是由Javascript渲染的、判断该站点有没有反爬虫措施等等。是否需要代理、是否需要多个账号等等。

所幸，爬取github是一个非常简单的过程，可以被看做是入门级的爬取。首先github的网站是restful风格、后端直出的、且没有爬取限制的，所以基本算得上是入门级的爬取了。

接下来，我们需要找到爬虫的入口页面，一个好的入口页面可以被看做是一个很好的切入点，如果入口页面选择好，会对后续的爬取有很大帮助。

最终我们选取基于Python的scrapy框架，以`https://github.com/CoderSavior?tab=stars`这个链接中的所有项目作为入口页面。

爬取的顺序是先爬取有问题的项目，然后再爬取给这些项目点赞的账号，接下来再去查看这些账号点赞的项目，然后再筛选出有问题的项目对这些项目进行后续的爬取。如此循环。最后我们根据项目的commits数和issues数量等作为参考依据，对所有项目进行筛选，并根据之前关联的数据，寻找具体是哪些账号在为这些项目点赞。

接下来我们从零开始搭建爬虫项目。根据[官网](http://scrapy-chs.readthedocs.io/zh_CN/latest/intro/overview.html)的指导。首先我们使用pip3安装scrapy。

```
pip3 install Scrapy
```

接下来，只需要执行脚手架就可以初始化一个项目了。

```
scrapy startproject harmony-thumbs-up
```

项目名字叫和谐点赞，接下来我们的项目叫初始化成功了。

此时有几个概念需要我们去理解：

Item：定义在items.py里面一个类，声明之后的item实例可以被看做是一个字典。并且在访问该字典中字段的时候不会出现报错。

Spider：在spiders/文件夹下以文件的形式存在，是一个类。在一个Spider就是一个爬虫，通过`scrapy crawl spider_name`命令可以启动这个爬虫。

Xpath：一种定位xml和html标记语言中元素位置的语法，对于css写得比较多的前端，切换过程可能会有些许不适。

生成器：只生成器函数，当生成器函数执行到yield的时候会返回yield的值并且将函数的状态保存，直到下一次执行。会从yield之后的语句开始。如果你写过JS熟悉ES6的话，对生成器应该并不陌生，同样在scrapy爬虫中你也经常会看到yield，你大把他当做koa中的yield来理解就好了。

创建好之后的项目大概结构如下

```
harmony-thumbs-up/
    scrapy.cfg
    harmony-thumbs-up/
        __init__.py
        items.py
        pipelines.py
        settings.py
        spiders/
            __init__.py
            ...
```

我花了比较长的一段时间来弄懂这些文件的含义，其实也还算简单。

我们先来看看`settings.py`吧：

```py
ROBOTSTXT_OBEY = False
```

这句话的意思是否遵循网站根目录的爬虫规则，如果为True的话，你就有很多网站是爬不了的了。所以建议直接关掉。

```py
DEFAULT_REQUEST_HEADERS = {
    #.....
}
```
默认会带上的请求头，在编写爬虫的时候，有时候为了假装自己是一个正常用户，需要在请求头上面设置很多的内容，这块一般也需要进行设置。

然后是一些中间件和pipline的配置开关，我的建议是在了解了整个爬虫的工作流程之后根据实际情况按需配置，合理编写代码，不要把所有的逻辑写在一起就好。

接下来是`spiders`这个文件夹，在文件夹创建一个python文件。比如我们要根据一个用户点赞的页面去爬取项目，那么我们把这个命名为`project.py`

在里面书写一个爬虫项目的基础
```py
import scrapy


class PorjectSpider(scrapy.Spider):
    name = 'project'
    allowed_domains = ['github.com']
    start_urls = [
        'https://github.com/CoderSavior?tab=stars'
    ]

    def parse(self, response):
        print(response)
        # 在这里写爬取页面之后的响应逻辑

```

`name`表示爬虫的名字，这个名字是表明了一个spider的爬虫类型。

`allowed_domains`是指允许爬取的域名。

`start_urls`是指爬虫最开始爬取时的入口url。

`response`爬取之后的一个响应对象，有很多实用的方法和属性。

之后我们使用命令行运行这个爬虫：

```
scrapy crawl project
```

我们会看到控制台中打印出了response对象。

如果你的页面内容是后端渲染的，此时`response.body`中就有了整个页面的源代码。如何提取上面有价值的内容呢。这个时候`xpath`就出场了。

你可以把`xpath`理解成`xml`中的选择器，`xptah`同样也适用于`html`，只不过对于前端同学可能需要一点学习成本。

我们可以通过
```
response.xpath('//div[@class="col-12 d-block width-full py-4 border-bottom"]')
```
得到所有的项目的dom节点集合，然后对这个节点集合进行循环，再去寻找每个节点中的有效的内容，类似这样：
```py
    def parse(self, response):
        for sel in response.xpath('//div[@class="col-12 d-block width-full py-4 border-bottom"]'):
            stars = sel.xpath('div[4]/a/text()').extract()[1].strip()
            if 10 < int(stars) < 1000:
                # 如果项目的stars数量在10到1000之间则要记录
                project = ProjectItem()
                project['name'] = sel.xpath('div[1]/h3/a/@href').extract()[0].replace('/', '', 1)
                project['stars'] = sel.xpath('div[4]/a/text()').extract()[1].strip()
                yield project

        next_url = response.xpath('//a[@class="next_page"]/@href').extract_first()
        if next_url:
            yield scrapy.Request(url=self.base_url + next_url, callback=self.parse)
```

每当我们找到了一个符合规则的项目的时候，我们就把项目的字段拼装好，并且通过yield暂停生成器，把数据交给pipeline处理。最后因为项目有很多分页。我们需要找出分页链接，然后以类似递归的方式进行爬取。

此时我们把流程回到`yield project`上来，我们会把数据对象交给项目中的`piplines`来处理。该文件可以有很多个`pipeline`的类，通过在`settings`里面配置的优先级来执行
所有的`spider`都会走这些`pipeline`。所以我们会根据`spider.name`来进行区分不同的爬虫

```
class AppPipeline(object):
    def process_item(self, item, spider):
        if spider.name == 'project':
            # 处理数据入库等逻辑
```

至此，一个简单的爬虫流程我们就算是完成了。利用相同的方法，我们又写了几个爬虫，爬了十几万的github数据。数据量并不算大。并且还需要进行一些数据清洗。

下一步就是对数据进行一些分析，看看能否找出其中的一些端倪了。这一块并不是我擅长的，所以我需要花一些时间去学习。

总得来说github的爬取级别算是比较简单的了所以我也大胆的尝试了下Python。

在工作中我的小伙伴们经常要面临爬取一些反爬虫特别严格的网站，还会遇到一些JS渲染的网页，必要时还需要使用带有浏览器内核的爬虫。这块其实也是我擅长的，后面如果有机会可以给大家分享。

最后demo项目挂在了github上面大家如果感兴趣可以去看看。非常感谢公司擅长Python爬虫的小伙伴们的指点。还有你们提供的教程。

下一期，我会给大家分享通过数据分析之后的一些数据可视化操作。

#### 参考链接

[https://github.com/tgxpuisb/harmony-thumbs-up](https://github.com/tgxpuisb/harmony-thumbs-up)

[http://scrapy-chs.readthedocs.io/zh_CN/latest/intro/overview.html](http://scrapy-chs.readthedocs.io/zh_CN/latest/intro/overview.html)