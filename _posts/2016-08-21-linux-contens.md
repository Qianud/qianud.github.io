---
layout: default
title: linux一键安装环境 
tit: linux centos 一键安装环境 ;
imgurl: work2-header.png
---

phpStudy for Linux 支持Apache/Nginx/Tengine/Lighttpd，
<br>
支持php5.2/5.3/5.4/5.5切换
<br>
已经在centos-6.5,debian-7.4.,ubuntu-13.10测试成功
<br>
使用说明：
<br>
服务进程管理：phpstudy (start|stop|restart|uninstall)<br>
站点主机管理：phpstudy (add|del|list)<br>
ftpd用户管理：phpstudy ftp (add|del|list)<br>
<br>
项目地址：http://lamp.phpstudy.net/
<br>
<pre><code>
安装说明：
wget -c http://lamp.phpstudy.NET/phpstudy.bin <br>
chmod +x phpstudy.bin    #权限设置 <br>
./phpstudy.bin 　　　　#运行安装 <br>
</code></pre>
选择好PHP的版本安装即可。<br>
用时十到几十分钟不等，安装时间取决于电脑的下载速度和配置。<br>
也可以事先下载好完整，安装时无需下载。<br>

<br>
<hr>
<br>
如何切换php版：<br>
假如你先安装的apache+php5.3<br>
想切换成nginx+php5.4<br>
你就再走一次./phpstudy.bin<br>
但是你会发现有一行是否安装MySQL提示选不安装<br>
这样只需要编译nginx+php5.4<br>
从而节省时间，这样只需要几分钟即可。<br>
{{ page.date | date_to_string }}