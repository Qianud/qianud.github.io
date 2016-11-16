---
layout: default
title: Lamp环境下安装及使用coreseek(linux);
tit: spinx的Coreseek。
---
<br>
<hr>
<br>
   一.首先在你的Linux上先下载一个coreseek的一个linux的安装包,由于官网的下载地址已经不存在所以这里我已经以其他渠道下载完成

打开linux首先安装如下依赖包;(如果有的话只需要更新)

    yum -y install m4 autoconf automake libtool  
      
    yum -y install gcc gcc-c++ wget  
      
    yum -y install mysql-devel  

##mmseg3是一个中文分词插件

二.如果没有下载的话可以将根本文档带的安装包上传到linux,如果安装包已经放好

 执行如下命令:


    tar zxvf coreseek-3.2.14.tar.gz               
    <span style="font-family:Calibri;">                #  </span>解压命令<pre name="code" class="python">make  
    make install  
      
    cd /usr/local/coreseek/etc                         #进入coreseek安装完成的路径  
    <pre name="code" class="python">cd coreseek-3.2.14                                 # 进入目录  
    cd mmseg-3.2.14/                                   # 进入中文分词插件  
    ./bootstrap ./configure --prefix=/usr/local/mmseg3 # 检测配置  
    make && make install                               #编译 && 编译安装  
    cd ../csft-3.2.14/                                 # 进入配置目录  
    sh buildconf.sh                                    # 执行脚本  
    ./configure --prefix=/usr/local/coreseek  
     --without-python --without-unixodbc --with-mmseg  
     --with-mmseg-includes=/usr/local/mmseg3/include/mmseg/   
    --with-mmseg-libs=/usr/local/mmseg3/lib/ --with-mysql --host=arm   #检测配置  

三.安装过程需要修改一个配置文件

    vi src/sphinxexpr.cpp  

四.然后将所有的T val = ExprEval ( this->m_pArg, tMatch ).....修改为:  T val = this->ExprEval ( this->m_pArg, tMatch )(建议大家将此文件拿到本地进行修改)


    make  
    make install  
    cd /usr/local/coreseek/etc                         #进入coreseek安装完成的路径  

五.输入ls会看到3个文件:

example.sql  sphinx.conf.dist  sphinx-min.conf.dist

其中example.sql是示例sql脚本我们将其导入到数据库中的test数据库中作为测试数据(会创建两张表documents和tags)


    vi sphinx.conf  

六.输入以下内容:


    source src1     #<span style="color:#000000;">代表数据源里面主要包含了数据库的配置信息，<span style="font-family:Calibri;">src1</span><span style="font-family:宋体;">表示数据源名字</span><span style="font-family:Calibri;">,</span><span style="font-family:宋体;">可以随便写。</span></span>  
    {  
        type                    = mysql  
        sql_host                = 192.168.214.128  
        sql_user                = root  
        sql_pass                = root  
        sql_db                  = test  
        sql_port                = 3306  # optional, default is 3306  
        sql_sock                              = /tmp/mysql.sock  
        sql_query_pre = SET NAMES utf8  
        sql_query               = SELECT id, group_id, UNIX_TIMESTAMP(date_added) AS date_added, title, content FROM documents  
        sql_attr_uint           = group_id  
        sql_attr_timestamp      = date_added  
        sql_query_info          = SELECT * FROM documents WHERE id=$id  
    }  
    index test1      #<span style="color:#000000;">代表为哪个数据源创建索引<span style="font-family:Calibri;">,</span><span style="font-family:宋体;">与</span><span style="font-family:Calibri;">source *** </span><span style="font-family:宋体;">是成对出现的，其中的</span><span style="font-family:Calibri;">source</span><span style="font-family:宋体;">参数的值必须是某一个数据源的名字。</span></span>  
    {  
        source                  = src1  
        path                    = /usr/local/coreseek/var/data/test1  
        docinfo                 = extern  
        charset_type            = zh_cn.utf-8  
        mlock           = 0  
        morphology      = none  
        min_word_len        = 1  
        html_strip      = 0  
        charset_dictpath        = /usr/local/mmseg3/etc/  
        ngram_len                    = 0  
    }  
    indexer  
    {  
        mem_limit               = 32M  
    }  
      
      
    searchd  
    {  
        port                    = 9312  
        log                     = /usr/local/coreseek/var/log/searchd.log  
        query_log               = /usr/local/coreseek/var/log/query.log  
        read_timeout            = 5  
        max_children            = 30  
        pid_file                = /usr/local/coreseek/var/log/searchd.pid  
        max_matches             = 1000  
        seamless_rotate         = 1  
        preopen_indexes         = 0  
        unlink_old              = 1  
    }  

其他参数可以查看手册，这里不再赘述。

七.生成索引:


    /usr/local/coreseek/bin/indexer -c /usr/local/coreseek/etc/sphinx.conf --all   #<span style="color:#000000;">其中参数<span style="font-family:Calibri;">--all</span><span style="font-family:宋体;">表示生成所有索引</span></span>  

当然也可以是索引的名字例如：/usr/local/coreseek/bin/indexer -c /usr/local/coreseek/etc/sphinx.conf test1

八.执行后可以在/usr/local/coreseek/var/data目录中看到多出一些文件,是以索引名为文件名的不同的扩展名的文件

在不启动sphinx的情况下即可测试命令:


    <p><span style="color:#000000;"> /usr/local/coreseek/bin/search -c /usr/local/coreseek/etc/sphinx.conf number</span><span style="color:#000000;"> <span style="font-family:Calibri;"> #</span><span style="font-family:宋体;"> 这是开启</span><span style="font-family:Calibri;">sphinx</span><span style="font-family:宋体;">的命令行搜索就是说 </span><span style="font-family:Calibri;">number</span><span style="font-family:宋体;">是你要查询的数据名称</span></span></p><p><span style="color:#000000;"> /usr/local/coreseek/bin/searchd -c /usr/local/coreseek/etc/sphinx.conf<span style="font-family:Calibri;">                # </span>searchd<span style="font-family:宋体;">是开启</span><span style="font-family:Calibri;">sphinx</span><span style="font-family:宋体;">的搜索服务功能</span></span></p>  

九.在站点域名目录下创建一个文件列如test.PHP

在test.php文件中写入如下内容:   (注意与test同级需要将本身的sphinxapi类加载进来)


    <?php  
    header("content-type:text/html;charset=utf8");  
    include'./sphinxapi.php';  
    $sphinx= new SphinxClient();  
    $sphinx->SetServer  //('你linux上的ip地址',9312);  
    $res=$sphinx->Query("搜索字段","*");  //这里的*代表匹配所有定义好的规则  
    print_r($res);  
    ?>  