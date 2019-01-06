<?php
    if (isset($_POST['xml']))
        $xml = $_POST['xml'];
    else {
        header("HTTP/1.1 500 XML not detected");
        exit;
    }
    
    if (!$file = fopen("../../doc/main.xml","w+")) {
        header("HTTP/1.1 500 Impossible to reach main.xml");
        exit;
    }
    fwrite($file, $xml);
    fclose($file);

    if (filemtime("../../save/main.xml") + 600 < time()) {  //each ten minutes
        exec("yes | cp -rf ../../doc/* ../../save/");
        header("HTTP/1.1 200 Xml copy saved");
        echo "XML copy saved !";
    }
    else
        header("HTTP/1.1 200");
?>