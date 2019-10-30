<?php
    session_start();
    if (isset($_GET["url"])) {
        $_SESSION["admin"] = true;
        header("Location:".urldecode($_GET["url"]));
    }
    else
        header("HTTP/1.1 500 parameter not given");
?>