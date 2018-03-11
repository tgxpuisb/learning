运行镜像 images

如果没有则远程下载一个

docker cp 可以把文件拷贝到docker镜像中去

docker commit 可以产生一个新的改动

docker rmi 可以删除一个镜像

docker stop可以停止一个容器

docker build 能够创建image(目前不知道怎么使用)

Dockerfile 语法
FROM 基础镜像
MAINTAINER 作者，维护者
CMD 执行的命令
RUN 执行命令
ADD 添加文件
COPY 拷贝文件
EXPOSE 暴露端口
WORKDIR 指定路径
ENV 设定环境变量
ENTERPOINT 容器入口
USER 指定用户
VOLUME mount point

镜像分层

Dockerfile每一行都会产生新层

Volume提供独立于容器之外的持久化存储
-v 当前目录:需要映射的目录，开发环境，本地与容器绑定

容器之间也可以共享数据

Registry镜像仓库

host 宿主机
image 镜像
registry 仓库
daemon 守护进程
client 客户端
