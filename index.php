<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>StoryLand</title>
    <link rel="stylesheet" type="text/css" media="screen" href="./src/css/main.css" />
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/src/libs/timeline/css/jquery.timespace.dark.css?v3" />
    <script src="/src/libs/jquery-3.3.1.min.js"></script>
    <script src="/src/libs/tinymce/js/tinymce/jquery.tinymce.min.js"></script>
    <script src="/src/libs/tinymce/js/tinymce/tinymce.min.js"></script>
    <script src="/src/libs/timeline/jquery.timespace.js?v3"></script>
    <script src="/src/js/main.js" type="module"></script>
</head>
<body>
    <div id="wrapper">
        <nav id="main_nav">
            <ul>
                <li id='0' name="personnages"><a>Violence Éternelle</a></li>
                <li id='1' name="lieux"><a>Aube et Aurore</a></li>
                <li id='2' name="histoire_in"><a>Poussière de Joie</a></li>    
                <li id='3' name="histoire_out"><a>Informations</a></li>
                <li id='4' name="cartes"><a>L'auteur</a></li>
            </ul>
        </nav>
        <nav id="main_nav_mobile">
            <ul>
                li#
            </ul>
        </nav>
        <div id="wrap_aside">
            <aside id="nav_aside">
                <a class="rm_fold"><i class="material-icons">delete</i></a>
                <a class="add_fold"><i class="material-icons">create_new_folder</i></a>
                <hr class="border" />
                <div id="folds"></div>
            </aside> 
            <hr class="border" style="margin-top: 0">
            <?php if (!isset($_SESSION["admin"]) || $_SESSION["admin"] != "true") { ?>
                <a href="/admin/to_admin.php?url=<?php echo urlencode($_SERVER['REQUEST_URI'])?>" id="to_admin">Se connecter en Admin</a>
            <?php $admin = false; } else { ?>
                <a href="#" id="to_admin">Connecté en mode admin</a>
            <?php $admin = true; } ?>
        </div>
        <main id="content">
            <?php if ($admin) { ?>
                <a class="edit_el"><i class="material-icons">edit</i></a>
            <?php } ?>
            <div id="wrap_content">

            </div>
        </main>
    </div>
    <div id="wrap_edit">
        <textarea id="edit"></textarea><br />
        <div class="wrap_controls">
            <a class="valid_edit"><i class="material-icons">done</i></a><br />
            <a class="cancel_edit"><i class="material-icons">cancel</i></a><br />
        </div>
    </div>
    <div id="modal_timeline">
        <div id="disp_timeline">

        </div>
        <div id="ctrl_timeline">
            <h5>En-tête :</h5>
            <div id="ctrl_header"></div>
            <h5>Evenements :</h5>
            <div id="ctrl_body"></div>
        </div>
    </div>
    <div id="overlay"></div>
</body>
</html>