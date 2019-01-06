<?php
function random($car)
{
    $string = "";
    $chaine = "abcdefghijklmnpqrstuvwxy";
    srand((double)microtime() * 1000000);
    for ($i = 0; $i < $car; $i++) {
        $string .= $chaine[rand() % strlen($chaine)];
    }
    return $string;
}
// Images upload path
$imageFolder = "../../doc/images/";

reset($_FILES);
$temp = current($_FILES);
if (is_uploaded_file($temp['tmp_name'])) {
    $extension = pathinfo($temp['name'])['extension'];


    if ($extension != "png" AND $extension != "jpg" AND $extension != "jpeg" AND $extension != "gif") {
        header("HTTP/1.1 400 Cette extension n'est pas acceptee. Les extension acceptees sont : JPG, PNG, JPEG, GIF");
        return;
    }
    
    $random_name = random(5).".".$extension;
    // Accept upload if there was no origin, or if it is an accepted origin
    $filetowrite = $imageFolder . $random_name;
    move_uploaded_file($temp['tmp_name'], $filetowrite);
  
    // Respond to the successful upload with JSON.
    echo json_encode(array('location' => "/doc/images/".$random_name));
} else {
    // Notify editor that the upload failed
    header("HTTP/1.1 500 Server Error");
}
?>