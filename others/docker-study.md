### 一个前端视角中的docker

最近公司的PHP开发环境迁移到了docker平台上，部分Node项目也迁移到了docker，这给我的最直观的感受是环境搭建轻松了太多，安装上docker之后只需要一个docker run就可以轻松搞定。

在我的印象中docker其实是和虚拟机类似的，或者说，更像是一种更轻量级的虚拟机。在使用过程中，我对docker产生了浓厚的兴趣。于是花了一些时间去了解学习了一下。

了解docker首先从了解docker与虚拟机的区别来着手。
![image](https://mc.qcloudimg.com/static/img/6afde94bc4570cba2c9e27f0bdc81350/image.png)

由上图可以看出，虚拟机需要在原有操作系统基础上虚拟出一个操作系统，然后在此基础上构建软件应用。而docker直接在操作系统之上运用docker引擎，虚拟出一个容器在此基础上直接构建软件应用。

这让我想起了计算机操作系统的层级，基础硬件->操作系统->标准函数库->标准系统程序->应用层。
这样看来如果你只使用只是做软件开发相关的东西，使用docker的性能要比使用虚拟机要高得很多。除此之外docker的镜像更小，更加的轻便灵活，可移植性更好。

docker中有一个很重要的概念容器，容器在宿主机中是一个进程，容器可以看成是一个集装箱，这也是docker图标上一条蓝色鲸鱼背着的货物，所有的货物都被集装箱标准化了，而且相互隔离，集装箱是现代海运业务中一个时代性的发明。如果你对这个改变世界的箱子的历史有更深的了解，你一定能更加深刻的理解docker。值得一提的是“docker”这个单词的中文翻译是码头工人。集装箱的出现，让码头工人从繁重的体力劳动中解放了出来（你也可以认为是他们被取代了）能够去做一些更有意义的事情。这也隐喻着docker的出现可以让苦逼的开发者们不用关系系统的环境问题，而更专注于软件本身。

docker中的镜像image可以被看做是一个模板，模板用来创建容器，容器可以看成是镜像的一个实例使用Dockerfile可以创建镜像。

下面进入正题。

首先，我们从hello world开始，我们使用docker的目的就是要有一个虚拟出来的环境。下载并安装好docker之后，我们在命令行中输入。

```
docker run -i ubuntu /bin/echo "hello world"
```

如果是第一次使用可能需要一些时间，docker发现你本地没有ubuntu的镜像会去远程拉取，然后建立一个ubuntu的容器，当容器建立成功后你会看到终端打出了hello world。这说明你已经成功了第一步。

输入命令```docker images```可以查看你本地已经有的镜像。

输入命令```docker ps -al```则可以查看你当前所有的容器，此时你会看到有一个ubuntu的容器被你创建了出来，记得复制下它的CONTAINER ID，在容器没有别名的使用，对容器的很多操作需要这个id。

接下来我们输入命令```docker start CONTAINER ID```将这个ubuntu的容器启动。

然后输入命令```docker attach CONTAINER ID```，稍微等一会，此时你会发现你的终端命令行已经处于ubuntu的bash命令之下了，你可以执行点什么，比如`apt-get`等命令测试下这是否是货真价实的ubuntu。

接下来，我们做一个操作，由于docker与宿主机的通信是通过端口映射来实现的，所以这里我们在机器里面启动一个简单的http服务器，来验证一下。

这个ubuntu的镜像看起来比较基础没什么东西所以可以先安装一些能启动服务器的东西，比如nginx或者python，这里推荐python，启动方便无需配置。

安装好python之后，先退出当前终端，然后输入命令。
```
docker commit lyz/server
```

这个命令能让你在本地的images里面生成一个自己的镜像，此时，你的镜像中保存了你之前的改动。使用命令：

```
docker run -it -d -p 8080:8080 lyz/server
```

这里的意思将容器的8080端口映射到宿主机的8080端口上，然后用之前的方式进入这台机器中执行命令：

```
mkdir test-port
cd test-port
echo "Hello World" > index.html
python -m SimpleHTTPServer 8080
```

此时在宿主机的浏览器中访问`localhots:8080/index.html`就能够访问到docker中的index.html页面了。

我们已经成功的跑起来了一个hello world项目，肯定有同学要问了，不是说只需要一个命令么，感觉操作好多好复杂。接下来要介绍的一个内容叫Dockerfile，它的作用就是通过一系列配置，来简化上述操作的。

一般而言构建容器时都是使用的Dockerfile来进行操作的。一个Dockerfile分为基础镜像信息、维护者信息、镜像操作指令和容器启动时执行指令四个方面的信息。

```
# 基础镜像
FROM ubuntu
# 主要作者
MAINTAINER lyzdocker

# 在当前镜像基础上执行的命令
RUN apt-get update -y
RUN apt-get install python -y

# 暴露端口
EXPOSE 8080

# 运行容器时的操作命令
CMD ["python", "-m", "SimpleHTTPServer", "8080"]
```

在目录中书写好Dockerfile文件，然后使用```docker build -t lyz/server```你就可以自己build出一个镜像了（使用```docker images```能够找到），比之前的commit操作要简单了许多对吧，此外Dockerfile中还有很多的配置操作，这里就不一一举例了。

感兴趣的小伙伴，还可以找一找公司的docker项目中的Dockerfile文件学习学习，看看这些容器在启动前后都做了哪些操作。

至此，整个的一个docker初级使用方法就算是介绍完成了。本文的主要目的是对不会使用docker的小伙伴简单介绍下docker，以至于当大家接触到一些用docker当容器的项目的时候不会两眼一抹黑。

如果大家感兴趣的话，不妨翻阅文档可以了解到更多更有趣的内容，比如如何发布自己的镜像，如何使用数据卷共享数据等等，或者一些更深入的玩法，都等待着你自己去发现。

下面放一些学习资料：
- docker教程[http://www.runoob.com/docker/docker-tutorial.html](http://www.runoob.com/docker/docker-tutorial.html)
- docker官网[https://docker.com/](https://docker.com/)
- 腾讯云docker使用指南[https://cloud.tencent.com/developer/article/1004996](https://cloud.tencent.com/developer/article/1004996)
- docker中文[https://docs.docker-cn.com/](https://docs.docker-cn.com/)