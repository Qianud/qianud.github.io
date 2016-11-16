---
layout: default
title: inotify+rsync安装配置，文件同步;
tit: 使用inotify+rsync来完成文件的同步功能;
imgurl: work4-header.png
---

>版权声明：本文为博主原创文章，未经博主允许不得转载。

<br>
<hr>
<br>
1.两台机器192.168.1.2，192.168.1.3，想把192.168.1.2的数据同步到192.168.1.3中
<br>
2.测试开始，可以先关闭防火墙和内核Linux的selinux的防火墙,避免防火墙影响（两台服务器均操作）
<br>
关闭防火墙，例如centos7，其他系统版本自己查询如何关闭

    $ systemctl stop firewalld.service #停止firewall  
    $ systemctl disable firewalld.service #禁止firewall开机启动  

关闭linux的selinux防火墙

永久性关闭：生效需要重启


    $ vi /etc/selinux/config  
    SELINUX=disabled  

临时性关闭：生效无需重启


    $ setenforce 0  


3.安装rsync（两台服务器均操作）
<br><br>
前往rsync官网下载最新版本 http://rsync.samba.org/ftp/rsync/src  找到最新的rsync-*.*.*.tar.gz

    $ tar zxvf rsync-*.*.*.tar.gz  
    $ cd rsync-*.*.*  
    $ ./configure --prefix=/usr/local/rsync  
    $ make && make install  


4.配置rsyncd.conf (192.168.1.3)<br>

    #pid文件的存放位置  
    pid file = /var/run/rsync.pid  
    #日志文件位置，启动rsync后自动产生这个文件，无需提前创建  
    log file = /var/log/rsync.log  
    #支持max connections参数的锁文件  
    lock file=/var/run/rsync.lock  
    #用户认证配置文件，里面保存用户名称和密码  
    secrets file = /etc/rsync.pw  
    #rsync启动时欢迎信息页面文件位置  
    motd file = /etc/rsyncd.motd  
    transfer logging = yes  
    log format = %t %a %m %f %b  
    syslog facility = local3  
    #自定义名称  
    [data]  
    #设置需要同步的目录  
    path = /data/test/  
    #模块名称与[data]自定义名称相同  
    comment = data  
    exclude = blank.png ; spinner.gif ; downsimple.png ; rails.png ; WEB-INF/  
    #默认端口  
    port = 873  
    #设置rsync运行权限为root  
    uid = root  
    #设置rsync运行权限为root  
    gid = root  
    #设置超时时间  
    timeout = 600  
    #最大连接数  
    max connections = 200  
    #默认为true，修改为no，增加对目录文件软连接的备份  
    use chroot = no  
    #设置rsync服务端文件为读写权限  
    read only = no  
    #不显示rsync服务端资源列表  
    list = no  
    #允许进行数据同步的客户端IP地址  
    hosts allow = 192.168.1.2  


4.可选：可以设置多个目录(192.168.1.3)<br>

    #增加test1目录  
    [test1]  
    path = /data/test1  
    list = yes  
    ignore errors  
    comment = ucweb-file system  
    secrets file = /etc/rsync.pw  
    exclude = blank.png ; spinner.gif ; downsimple.png ; rails.png ; WEB-INF/  

5.建立密码认证文件(192.168.1.3)<br>


    $ vi /etc/rsync.pw  
    root:123456  


配置rsyncd.motd文件，开始传送的时候会显示（192.168.1.3）

    $ vi /etc/rsyncd.motd  
    ###############################  
    #                             #  
    #        start rsync          #  
    #                             #  
    ###############################  


5.启动rsync（两台服务器均操作）<br>

    $ /usr/local/rsync/bin/rsync --daemon --config=/etc/rsyncd.conf  

开机启动rsync

    $ echo '/usr/local/rsync/bin/rsync --daemon --config=/etc/rsyncd.conf'>>/etc/rc.d/rc.local  


6.建立密码认证文件（192.168.1.2）<br>

    $ vi /etc/rsync.pw  
    123456  


7.测试开始（在192.168.1.2）<br>

先打开192.168.1.2上的/data/test/创建一个test.PHP测试文件，执行下面的命令

    $ /usr/local/rsync/bin/rsync -avH --port=873 --progress --delete /data/test/ root@192.168.1.3::data --password-file=/etc/rsync.pw  

查看192.168.1.3上/data/test目录下是否有同步过来的test.php

8.安装inotify-tools（192.168.1.2）<br>

    $ wget https://cloud.github.com/downloads/rvoicilas/inotify-tools/inotify-tools-3.14.tar.gz  
    $ tar zxvf inotify-tools-3.14.tar.gz   
    $ cd inotify-tools-3.14  
    $ ./configure --prefix=/usr/local/inotify  
    $ make && make install  

9.查看是否安装成功<br>

    $ ll /usr/local/inotify/bin/inotifywa*  


10.新建一个inotify.sh设置文件同步/root/inotify.sh,如果下面代码不管用可参考https://github.com/rvoicilas/inotify-tools/wiki#info
<br><br>
<pre>
	<code>
		
		#!/bin/sh


# get the current path
CURPATH=`pwd`


/usr/local/inotify/bin/inotifywait -mr --timefmt '%d/%m/%y %H:%M' --format '%T %w %f' \
-e close_write /data/test | while read date time dir file; do


       FILECHANGE=${dir}${file}
       # convert absolute path to relative
       FILECHANGEREL=`echo "$FILECHANGE" | sed 's_'$CURPATH'/__'`


       rsync -avH --port=873 --progress --delete /data/test/ root@192.168.1.3::data --password-file=/etc/rsync.pw
        echo "At ${time} on ${date}, file $FILECHANGE was backed up via rsync"
done


	</code>
</pre>
 
11.可执行权限与后台无输出运行
chmod 777 /root/inotify.sh
<br>
<pre>
	<code>
		sh /root/inotify.sh >/dev/null 2>&1 & 
	</code>
</pre>
    