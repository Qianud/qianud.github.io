---
layout: default
title: php生成优惠码
tit: PHP生成唯一的促销/优惠/折扣码；
imgurl: work6-header.png
---

>版权声明：本文为博主原创文章，未经博主允许不得转载。

首先我们先搞清楚什么是促销/优惠/折扣码？它有什么用作；
<br>
每一个电子商务网站，现在有一种或多种类型的优惠/折扣/优惠券系统，给大家分享一下如何在PHP生成唯一的促销/折扣码。主要是实现一个优惠码系统，可用于跟踪用户来自某些特定的来源，例如有些主机促销的时候链接到别的页面会有优惠码生成，还有更多的促销代码等。因此，今天将讨论这样一个优惠码的实现过程 

<br>
<hr>
<br>
考虑的需求
代码应该很容易记住，因此保持短的长度是一个好主意，使用户可以很容易地记住它
没有特殊字符！它应该是字母数字组合，因为它会永远是为用户更容易记住
长度推广/折扣代码的正确。没有一个标准的长度，因为它取决于你想生成的长度，例如，如果你想生成1000代码的代码，那么你需要在至少4个字符代码。促销/优惠码长度通常为4到8个字符，但它取决于您的要求。

那好吧，让我们开始吧！让我们来看看代码，然后我会详细解释。它很容易
<br>
<hr>
<br>
<pre>
	<code>
    /** 
    * @param int $no_of_codes//定义一个int类型的参数 用来确定生成多少个优惠码 
    * @param array $exclude_codes_array//定义一个exclude_codes_array类型的数组 
    * @param int $code_length //定义一个code_length的参数来确定优惠码的长度 
    * @return array//返回数组 
    */  
    function generate_promotion_code($no_of_codes,$exclude_codes_array='',$code_length =6)  
    {  
    $characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";  
    $promotion_codes = array();//这个数组用来接收生成的优惠码  
    for($j = 0 ; $j < $no_of_codes; $j++)  
        {  
    $code = "";  
    for ($i = 0; $i < $code_length; $i++)  
        {  
    $code .= $characters[mt_rand(0, strlen($characters)-1)];  
        }  
    //如果生成的6位随机数不再我们定义的$promotion_codes函数里面  
    if(!in_array($code,$promotion_codes))  
        {  
    if(is_array($exclude_codes_array))//  
        {  
    if(!in_array($code,$exclude_codes_array))//排除已经使用的优惠码  
        {  
    $promotion_codes[$j] = $code;//将生成的新优惠码赋值给promotion_codes数组  
    }  
    else  
        {  
    $j--;  
      }  
    }  
    else  
        {  
    $promotion_codes[$j] = $code;//将优惠码赋值给数组  
       }  
    }  
    else  
         {  
    $j--;  
       }  
    }  
    return $promotion_codes;  
    }  
    echo 'Promotion / Discount Codes';  
    print_r(generate_promotion_code(100,'',6));  
	</code>
</pre>
<br>
<hr>
<br>
该代码由三个参数组成，
第一个参数是你要生成优惠码的个数（在这里是生成100个）。第二个参数exclude array，确保在当前列表中的生成唯一优惠码，所以如果你已经数据库中有一些未使用的代码，你可以把它传递给exclude。最后一个参数是优惠码的的长度。这个函数将返回规定长度的优惠码 这里是6位的优惠码。
