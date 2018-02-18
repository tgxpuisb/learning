git之前工作中用过多次，这篇学习笔记主要用于查漏补缺和对某些操作或者命令进行总结归纳以便能更深入的了解git。

#### 版本回退
git的版本可以理解成每一次commit都会像打游戏一样存一个版本（快照）。也就是说，一旦你打BOSS失败，你可以回到任何一个存档上面从新开始。

`git log`这个命令就是帮助你查看存档用的。加上`--pretty=oneline`参数可以省略很多不必要的信息。

回滚版本使用`git reset --hard HEAD`操作`HEAD`表示当前版本，`HEAD^^`表示之前两个版本，`HEAD~100`表示前100个版本。也可以用版本号来替换`HEAD`。

使用`git reflog`能查看你的每一条git命令。

#### 工作区，暂存区，分支区
工作区就是你写代码的地方。
当你使用`git add`的时候，你就把工作区的文件加入到了暂存区，接下来当你使用`git commit`的时候，你就把文件提交到了当前的分支。
提交代码之后，暂存区就会被清空。

`git diff 版本 -- readme.txt`查看工作区与当前版本的文件区别。

`git checkout -- file`能丢弃工作区的修改，能撤销至暂存区或者当前版本库的状态，`--`很重要，没有这个就会变成切换分支。

但是如果想要撤销的文件已经add到了暂存区，可以使用`git reset HEAD file`把暂存区文件撤回到工作区。

删除操作可以使用`rm`和`git rm`，删错了也不用怕，`git checkout -- file`还能帮你恢复。

#### 远程仓库

`git remote add origin url`可以把本地仓库和远程仓库建立联系。

`git push -u origin master`将代码提交到远程master分支上。

#### 分支管理

git的多次提交会形成一条线，这条线就是分支。把git的分支操作看成是一条树，切换分支和合并分支都是在移动这条树上的指针，每一个commit都是一个节点。

`git checkout -b dev`，`-b`表示创建并切换

`git branch -d dev`可以删除本地分支

`git merge --no-ff -m "merge with no-ff" dev`表示合并时不使用`Fast forward`模式

#### stash功能
git能把你正在工作区的代码暂存起来。等需要的时候再回复。

`git stash`保存代码进暂存区

`git stash list`查找暂存区的list

`git stash apply`|`git stash apply stash@{0}`能够恢复到该暂存区

`git stash drop`能够回复并删除暂存区代码

#### 标签功能
这个不是很常用

使用`git tag`可以打标签

`git tag -a <tagname> -m "blablabla..."`可以指定标签信息

`git show <tagname>`能够查看所有标签

#### 远程开发
一般开发的时候有devops，所以切换分支的时候是直接切换到远程分支

`git checkout -b myRelease origin/Release`

`git branch -r -d origin/branch-name`|
`git push origin :branch-name`删除远程分支
