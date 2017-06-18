# gitlab-ci使用说明

### 本文受众：
> 1.想对自己在gitlab上的代码仓库进行持续集成的人
>
> 2.在我司gitlab上面有自己的代码基础库的同学

### 什么是CI：

`CI`是`Continuous Integration`的简称，就是**持续集成**的意思。

也就是说，每次你的代码提交之后，持续集成系统都会对你的代码按照一定要求自动构建。

### 我们为什么需要CI

这里以公司代码基础库来讨论，可持续集成的代码库会给人更可信赖的感觉。如果有了完善的自动化测试用例也不用担心在改动代码的时候会破坏原有代码的功能。如果再有覆盖率测试，也能很大程度上提升代码的稳定性与专业性。

总得来说，让你的基础库可持续集成是一件无论对开发者与使用者都有利的一件事。

开发者可以更方便的管理代码，了解代码当前的状况，在集成新功能或者修复BUG的时候能够有完善的测试用例来保证。

代码使用者在使用的时候能够对代码库的稳定性有一个很好的了解。并且相信基础库是长期稳定不会出现新旧版本不兼容的BUG。

### 我们该怎么做

说了那么多的可持续集成的优点，接来下我会向大家简述我们可以怎么集成。`gitlab`提供了一个`gitlab-ci.yml`的配置文件来帮我们描述我们如何为该代码库进行持续集成。

#### 下面我们来初步了解下配置文件

首先我们先来了解几个概念：

#### Pipeline

每次提交都会触发`Pipeline`，相当于执行一次构建任务。如安装依赖、运行测试、编译等等。

#### Stages

表示构建阶段，一个`Pipeline`能够有很多个`Stages`，这些`Stages`会按照顺序执行，如果其中一个`Stages`在执行时候失败则后续`Stage`不会执行。只有当全部的`Stages`执行成功之后该次的`Pipeline`才会执行成功。

#### Jobs

表示一个工作，一个`Stage`中有多个`Jobs`，这些`Jobs`会并行执行。只有所有`Jobs`执行成功之后该`Stage`才会执行成功。也就是说一旦有一个`Jobs`执行失败，那么他的`Stage`也会相应的失败，从而导致整个`Pipeling`也会失败，最终`Build`失败。

那一个`gitlab-ci.yml`该怎么写呢？其实很简单：

```
# 定义 stages
stages:
    - build
    - test
    - cover

#定义参数
variables：
    URL: "http://npm.beibei.com"

# 定义job
job_name1:
    stage: build
    script:
        - echo "run shell script"

job_name2:
    stage: build
    script:
        - echo "run build script"

job_name3:
    stage: test
    script:
        - npm run test

job_name4:
    stage: cover
    script:
        - npm run cover
    coverage: '/^Statements\s*:\s*?([^%]+)/'
```

这是一个简单的`gitlab-ci.yml`配置，还有[更多的配置https://docs.gitlab.com/ce/ci/yaml/README.html#gitlab-ci-yml](https://docs.gitlab.com/ce/ci/yaml/README.html#gitlab-ci-yml)，可以参考官方文档。

接下来我们看一看公司的`gitlab-ci.yml`样板，会稍微复杂一些，因为引入了`docker`环境。

```
#阶段名：stage，docker镜像地址：image，执行命令：script，runner名：tags（Gitlab slave），上传文件：artifacts（将编译后的文件上传到Gitlab service）。
#定义构建和单元测试job的公共部分，包括docker镜像、runner。
.build_job: &build_definition
  image: 10.2.223.227:5002/gitlab_ci/centos7-node6-redis:v1
  script:
    - ln -s /opt/h5_lib/node_modules ./node_modules
    - npm install --registry $NPM_URL
    - npm update --registry $NPM_URL
    - npm run test-ci
  tags:
    - docker
    - node.js
#定义阶段
stages:
    - build_unittest

#以下内容可根据具体需求修改
#定义变量
variables:
   NPM_URL: "http://10.2.223.167:7001/"
#开发分支执行单元测试
build_dev:
  <<: *build_definition
  stage: build_unittest
  except:
    - master
    - tags
    - /^code_review_.*$/
  before_script:         #定义job-script之前执行的脚本
    - git merge origin/master --no-commit --no-ff
#master分支执行单元测试
build_master:
  <<: *build_definition
  stage: build_unittest
  only:
    - master
```

这里介绍一个新概念`.build_job`配置。这个配置以一个点`.`加上模板名来命名。意思是定义一个叫`build_definition`的“模板”然后会在`build_dev`和`build_master`这两个`Job`中预先调用这个“模板”的命令，该模板会使用`docker`镜像，并安装依赖环境，然后运行`npm run test-ci`的命令。最后这两个`Job`完成运行，然后`build_unittest`这个`stage`运行成功完成，整个项目就`build`成功了。

当然，实际情况中你可能并不需要按照上述操作进行，你只需要启动`docker`环境，安装好你的依赖，最后如何`build`你的代码，如何运用测试环境，都取决于你的脚本是如何配置的。

然后我们在`README.md`中放入对应的`build`和`coverage`等等的`label`的标签。此时，如果`gitlab`的`CI`构建成功，或者配置了测试覆盖率的检测。那么在README.md中就会显示你当前的项目是否构建成功，且测试覆盖率是多少。

### 再说如何进行测试

说到如何进行测试，对于前端而言，可以使用`mocha`，`AVA`等一系列测试框架能够对代码的逻辑进行测试。

此外前端还存在一种叫做“端对端”的测试，因为前端代码大多运行在浏览器这个宿主环境中。以`nightwatch`为例，这类测试工具能够使用`headless chrome`技术，模拟浏览器环境来进行测试，这样做能够做一个UI自动化测试。具体的测试集成方式大家可以参考`Vue`项目中`nightwatch`的配置方式，后续我会对前端测试相关话题再写一篇文章。

最后说一下测试覆盖率吧。这里推荐一个叫`instabul`的覆盖率框架，该框架中文名叫“伊斯坦布尔”是土耳其的首都，特产是地毯，而地毯恰恰就是用来覆盖的，在`gitlab`项目中点齿轮按钮找到`CI/CD Pipelines`选项，其中有一个正则的配置选项，输入`^Statements\s*:\s*([^%]+)`，即可在命令行的输出流中匹配到覆盖率测试的覆盖率百分比。

### 总结

上述内容，可以帮助我们初步了解`gitlab-ci.yml`配置，并完成可代码的可持续集成。希望大家能够为自己的代码库添加这一功能，让你的代码库更加的“专业可信赖”。

### 参考资料：

[用GitLab CI 进行持续集成https://segmentfault.com/a/1190000006120164](https://segmentfault.com/a/1190000006120164)

[GitLab-CI官网https://docs.gitlab.com/ce/ci/yaml/README.html#gitlab-ci-yml](https://docs.gitlab.com/ce/ci/yaml/README.html#gitlab-ci-yml)

[持续集成是什么http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)

[代码覆盖率工具 Istanbul 入门教程http://www.ruanyifeng.com/blog/2015/06/istanbul.html](http://www.ruanyifeng.com/blog/2015/06/istanbul.html)

[持续集成延伸阅读http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)
