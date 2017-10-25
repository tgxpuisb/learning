最近小伙伴们通过启动了内网的一个FTP服务器打破了公司对公共资源的封锁，所以突然对使用启动这些服务器很感兴趣，其实说到底主要还是协议的问题。

这里用Python来实现。

首先启动HTTP服务器，这个是最简单的：

```shell
python -m SimpleHTTPServer 8080
```

那么接下来如何启动FTP服务器呢：

首先需要先安装`pyftpdlib`，接下来执行命令行就可以了。

```shell
pip install pyftpdlib
python -m pyftpdlib -p 21
```

此时FTP服务器也启动完成了。

如果是要做成脚本则可以这样写

```python
import SimpleHTTPServer
import SocketServer

PORT = 8080

handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd =SocketServer.TCPServer(("", PORT), handler)

print("serving at port", PORT)
httpd.serve_forever()
```

FTP服务器的启动从网上抄的

```python
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer

def main():
    # Instantiate a dummy authorizer for managing 'virtual' users
    authorizer = DummyAuthorizer()

    # Define a new user having full r/w permissions and a read-only
    # anonymous user
    authorizer.add_user('user', '12345', '.', perm='elradfmwM')
    authorizer.add_anonymous(os.getcwd())

    # Instantiate FTP handler class
    handler = FTPHandler
    handler.authorizer = authorizer

    # Define a customized banner (string returned when client connects)
    handler.banner = "pyftpdlib based ftpd ready."

    # Specify a masquerade address and the range of ports to use for
    # passive connections.  Decomment in case you're behind a NAT.
    #handler.masquerade_address = '151.25.42.11'
    #handler.passive_ports = range(60000, 65535)

    # Instantiate FTP server class and listen on 0.0.0.0:2121
    address = ('', 2121)
    server = FTPServer(address, handler)

    # set a limit for connections
    server.max_cons = 256
    server.max_cons_per_ip = 5

    # start ftp server
    server.serve_forever()

if __name__ == '__main__':
    main()
```
