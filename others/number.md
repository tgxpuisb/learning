位运算是直接对整数在内存中的二进制位进行操作

位运算分为 按位与运算,按位或运算,按位异或,按位取反,带符号右移,无符号右移

加法和减法,乘法和除法互为逆运算

异或运算与自己互为逆运算

按位取反是把二进制中的0和1相反,通常在有负数的类型里第一位是代表正负的,所以在JS的语言中,按位取反时,得到的数值是之前的负数

JS的位运算是采用32位来进行计算的

-1 的二进制是1000 0001,但是计算机中存的是补码,也就是说是 1111 1110 的值加上1 最后补码是 1111 1111,所以-1按位取反的值是0000 0000

关于JS中的数字类型可以参考[资料](https://lifesinger.wordpress.com/2011/03/07/js-precision/)

看了一晚上,临睡觉的时候突然有了灵感


```math
1.2345 * 10^1
```

如果我们想把小数点移动一位 需要 * 10

SO如果是二进制呢,我们需要 * 2

```
1.0011 0011 0011 * 2
```

也就是说在IEEE双精度浮点中数值是如下方式表示的

```math
-1^s * M * 2^e
```

其中M 是一个写死了以1开头 加上剩下52个"空位"的描述的 1.(52个1或者0)然后再位数向前或者向后移动e个位置官当规定e处于[-1074, 971]这个值是指[-1024,1024]减去了53左右的位数偏差,其实关于e的区间就是那个存储位数,在查看的帖子中有两种版本的说法,但是其实意思都是相同的,都是用11位来表示偏移量

SO,你能根据这个推断出JS的最大和最小能表示的数了,当然其中会有精度丢失的情况

SO,精度什么时候不丢失呢,就是刚好用 53位数能够表示一个数的时候e要求是52以内,如果多了精度就丢失了

还可以得出一个结论：当十进制小数的二进制表示的有限数字不超过 52 位时，在 JavaScript 里是可以精确存储的

也就是说,如果在计算的时候 e 这个数涉及到要进位或者退位的时候就会出现精度丢失问题

再说下最小最大安全整数吧,根据1 + 52位的情况来看,安全数应该是[-2^53, 2^53],但是由于2^53 === 2^53+1,所以这个数是不安全的,最大安全数是2^53-1.

然后解释下2^53 和 2^53+1吧

2^53可以表示成1(53个0)

2^53+1可以表示成1(52个0)1

但是数值只能存储1后面52位,所以最后一位0和1就被忽略了,并且e=1,所以这时候两个数值就相等了,什么时候能不想等呢?答案是2^53+2,因为这个时候位数就会被保留下来,大家有兴趣的时候可以试一下

同理也能解释下为什么9999999999999999==10000000000000000值为真

以上和今天要学的位运算没太大关系,作为一个非计算机专业毕业的,我花了两个小时才搞懂这些基本规律,也算是为后续学习打个基础吧

a << b 左移动

32位中的第一位不动,只有31位在移动,另外一个就是1 << 32 == 1,也就是说没32位就循环一次

a >> b 右移动

同样是第一位不动,所有数字向右移动,其实感觉主要作用就是乘2和除2

a >>> b 无符号右移动

会把32位的数字都向右移动,如果是负数会变成一个很大的正数