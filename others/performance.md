在浏览器加载的过程中，浏览器提供一个window.performance对象，这个对象上面挂载了一些属性和方法，能够方便开发者统计性能方面的数据。

该属性最早在Chrome实现，目前已经是一个规范了，在[can i use](https://caniuse.com/#feat=nav-timing)上面能查询到兼容性问题。

属性：

performance.timing：整个页面的加载数据

```
// 计算加载时间
function getPerformanceTiming () {  
    var performance = window.performance;
 
    if (!performance) {
        // 当前浏览器不支持
        console.log('你的浏览器不支持 performance 接口');
        return;
    }
 
    var t = performance.timing;
    var times = {};
 
    //【重要】页面加载完成的时间
    //【原因】这几乎代表了用户等待页面可用的时间
    times.loadPage = t.loadEventEnd - t.navigationStart;
 
    //【重要】解析 DOM 树结构的时间
    //【原因】反省下你的 DOM 树嵌套是不是太多了！
    times.domReady = t.domComplete - t.responseEnd;
 
    //【重要】重定向的时间
    //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
    times.redirect = t.redirectEnd - t.redirectStart;
 
    //【重要】DNS 查询时间
    //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)            
    times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
 
    //【重要】读取页面第一个字节的时间
    //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
    // TTFB 即 Time To First Byte 的意思
    // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    times.ttfb = t.responseStart - t.navigationStart;
 
    //【重要】内容加载完成的时间
    //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    times.request = t.responseEnd - t.requestStart;
 
    //【重要】执行 onload 回调函数的时间
    //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
    times.loadEvent = t.loadEventEnd - t.loadEventStart;
 
    // DNS 缓存时间
    times.appcache = t.domainLookupStart - t.fetchStart;
 
    // 卸载页面的时间
    times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;
 
    // TCP 建立连接完成握手的时间
    times.connect = t.connectEnd - t.connectStart;
 
    return times;
}
```

在实际中使用的时候，需要注意的是，有可能某些参数是0，此时数据会异常的大，这些大的数据是需要过滤的

performance.navigation：该对象中包含当前浏览器上下文导航内类型：redirectCount表示重定向次数，type：0表示正常进入，1表示location.reload()，2表示通过浏览器后退按钮进入，255表示以上3种方式之外


performance.memory：只有chrome实现了，里面有3个属性，JS内存使用，可使用的内存，内存大小限制。


方法

performance.getEntries|getEntriesByName|getEntriesByType：得到单个资源的加载数据

performance.mark：打mark

performance.now：一个更精确的计时，反应的是一个时间的偏移量，需要两次的时间相减

