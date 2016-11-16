---
layout: default
title: php实现单点登陆
tit: php实现单点登陆Demo
---



1.准备两个虚拟域名

127.0.0.1  www.openpoor.com

127.0.0.1  www.myspace.com

2.在openpoor的根目录下创建以下文件

index.PHP

    <?php  
    session_start();  
      
    ?>  
    <!DOCTYPE html>  
    <html>  
    <head>  
    <meta charset="UTF-8"/>  
    <title>sync login</title>  
    </head>  
    <body>  
      
    <?php if(empty($_SESSION['username'])):?>  
    hello,游客;请先<a href="login.php">登录</a><a href="http://www.myspace.com/index.php">进入空间</a>  
    <?php else: ?>  
    hello,<?php echo $_SESSION['username']; ?>;<a href="http://www.myspace.com/index.php">进入空间</a>  
    <?php endif; ?>  
      <a href="http://www.openpoor.com/index.php">home</a>  
    </body>  
    </html>  


login.php


    <?php  
    session_start();  
    if(!empty($_POST['username'])){  
      require '../Des.php';  
      $_SESSION['username'] = $_POST['username'];  
      $redirect = 'http://www.openpoor.com/index.php';  
      header('Location:http://www.openpoor.com/sync.php?redirect='.urlencode($redirect).'&code='.Des::encrypt($_POST['username'],'openpoor'));exit;  
    }  
    ?>  
    <!DOCTYPE html>  
    <html>  
    <head>  
    <meta charset="UTF-8"/>  
    <title>sync login</title>  
    </head>  
    <body>  
    <form action="" method="post">  
      <input type="text" name="username" placeholder="用户名"/>  
      <input type="text" name="password" placeholder="密码"/>  
      <input type="submit" value="登录"/>  
    </form>  
    </body>  
    </html>  


sync.php


    <?php  
    $redirect = empty($_GET['redirect']) ? 'www.openpoor.com' : $_GET['redirect'];  
    if(empty($_GET['code'])){    
      header('Loaction:http://'.urldecode($redirect));  
      exit;  
    }  
      
    $apps = array(  
      'www.myspace.com/slogin.php'  
    );  
    ?>  
    <!DOCTYPE html>  
    <html>  
    <head>  
    <meta charset="UTF-8"/>  
    <?php foreach($apps as $v): ?>  
    <script type="text/javascript" src="http://<?php echo $v.'?code='.$_GET['code'] ?>"></script>  
    <?php endforeach; ?>  
    <title>passport</title>  
    </head>  
    <body>  
    <script type="text/javascript">  
    window.onload=function(){  
      location.replace('<?php echo $redirect; ?>');  
    }  
    </script>  
    </body>  
    </html>  


3.在myspace的根目录下创建如下文件

slogin文件 完成session的设置


    <?php  
    session_start();  
    header('Content-Type:text/javascript; charset=utf-8');  
    if(!empty($_GET['code'])){  
      require '../Des.php';  
      $username = Des::decrypt($_GET['code'],'openpoor');  
      if(!empty($username)){  
        header('P3P: CP="CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR"');  
        $_SESSION['username'] = $username;  
      }  
    }  
    ?>  


index.php


    <?php  
    session_start();  
    if(!empty($_SESSION['username']))  
    {  
        echo "欢迎来到".$_SESSION['username']."的空间";  
    }else{  
        echo "请先登录";  
    }  
    ?>  


4.Des.php的文件内容如下


    <?php  
    /** 
     *@see Yii CSecurityManager; 
     */  
    class Des{  
      
      public static function encrypt($data,$key){  
          $module=mcrypt_module_open('des','', MCRYPT_MODE_CBC,'');  
          $key=substr(md5($key),0,mcrypt_enc_get_key_size($module));  
          srand();  
          $iv=mcrypt_create_iv(mcrypt_enc_get_iv_size($module), MCRYPT_RAND);  
          mcrypt_generic_init($module,$key,$iv);  
          $encrypted=$iv.mcrypt_generic($module,$data);  
          mcrypt_generic_deinit($module);  
          mcrypt_module_close($module);  
          return md5($data).'_'.base64_encode($encrypted);  
      }  
        
      public static function decrypt($data,$key){      
          $_data = explode('_',$data,2);  
          if(count($_data)<2){  
        return false;  
          }  
          $data = base64_decode($_data[1]);        
          $module=mcrypt_module_open('des','', MCRYPT_MODE_CBC,'');  
          $key=substr(md5($key),0,mcrypt_enc_get_key_size($module));  
          $ivSize=mcrypt_enc_get_iv_size($module);  
          $iv=substr($data,0,$ivSize);  
          mcrypt_generic_init($module,$key,$iv);  
          $decrypted=mdecrypt_generic($module,substr($data,$ivSize,strlen($data)));  
          mcrypt_generic_deinit($module);  
          mcrypt_module_close($module);  
          $decrypted = rtrim($decrypted,"\0");         
          if($_data[0]!=md5($decrypted)){  
        return false;  
          }  
          return $decrypted;  
      }  
        
    }  
    ?>  

当在openpoor登录后将session信息传到其他域名下的文件下进行处理，以script标签包含的形式进行运行。


5.此时访问www.openpoor.com和www.myspace.com都是未登录状态
![]({{ site.baseurl }}/img/cookiesession/dandian1.png)
![]({{ site.baseurl }}/img/cookiesession/dandian2.png)
<br>
登录后两个域名下都是登录状态
<br>
![]({{ site.baseurl }}/img/cookiesession/dandian3.png)
![]({{ site.baseurl }}/img/cookiesession/dandian4.png)
<hr>
到此我们实现了一个简单的单点登录。
