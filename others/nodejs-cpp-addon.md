最近突发奇想，有一个上传图片的工具要开发，其中上传过程中需要秘钥和加密算法，由于是语言是JS，不太想把秘钥暴露出去，即使是写在项目里面也不太想。于是想到了能够写一个简单的C++扩展来存放算法与秘钥。

虽然我对C++的知识只停留在大学C语言的水平，不过查查资料什么的应该能够做出来。

通过查询资料得知大概原理如下：
- 首先需要引入`v8.h`和`node.h`
- 然后有一个`NODE_SET_METHOD`和`NODE_MODULE`用来注册方法和注册模块
- 然后需要使用`node-gyp`工具进行编译
- 书写`binding.gyp`文件，运行`node-gyp configure`最后调用`node-gyp build`方法
- 在node项目中`require('./build/Release/模块名')`即可使用了
- 目前还不太清楚打包是否需要分环境，后续会测试下

具体细节如下：

采用的是[网上的教程](http://www.cnblogs.com/nullcc/p/5846751.html)，朴灵的《深入浅出nodejs》上面的例子跑不起来了，估计是版本太老了。

hello.cc
```
// hello.cc
#include <node.h>
#include <v8.h>

using namespace v8;

void Method(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));
}

void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(addon, init)
```

binding.gyp
```
{
    "targets": [
        {
            "target_name": "addon",
            "sources": [ "hello.cc" ]
        }
    ]
}
```

index.js
```
const addon = require('./build/Release/addon')
console.log(addon.hello())
```

最后要注意的是，`target_name`中的配置和`NODE_MODULE`注册的方法要同名。后续我会尝试下在不同环境下面的模块build。
