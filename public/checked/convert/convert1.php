<?php
function auto_read($content, $charset) {
    $list = array('ASCII', 'GBK', 'UTF-8', 'GB2312', 'UTF-16LE', 'UTF-16BE', 'ISO-8859-1');
    $str = $content;
    foreach ($list as $item) {
        $tmp = mb_convert_encoding($str, $item, $item);
        if (md5($tmp) == md5($str)) {
            return mb_convert_encoding($str, $charset, $item);
        }
    }
    return "";
}

$file_path = __DIR__;
$dir_handle = opendir($file_path);
while ($file_name = @readdir($dir_handle))
{
    if ($file_name != '.' && $file_name != '..' && $file_name != 'convert.php' && pathinfo($file_name, PATHINFO_EXTENSION) == 'lrc')
    {
        $file = $file_path . DIRECTORY_SEPARATOR . $file_name;

        if (is_dir($file))
        {
            echo "{$file} is not a file!\n";
        }
        else
        {
            $content = file_get_contents($file);
            $result = auto_read($content, 'utf-8');
            if ('' == $result)
            {
                echo "{$file} can not convert!\n";
            }
            file_put_contents($file, $result);
        }
    }
}
echo '处理完毕';