import {Fold} from './fold.js';
import {File} from './file.js';
import {Timeline} from './timeline.js';
import {Url} from './url.js';
var xml; //xml general var
var actualName; //type general var
var actualNameEl; //type element general var
var foldList;
var timeline;
var url;
// !!! on load !!! //
$(function() {
    "use strict";
    $("#wrapper").css("cursor", "wait"); //cursor load
    $.ajax({    //get main.xml
        type: 'GET',
        url: '../../doc/main.xml',
        data: "t=" + new Date().getTime(),
        dataType: "xml",
        success: function(data) {
            xml = data;
            $("#wrapper").css("cursor", "initial"); //cursor normal
            actualNameEl = $("#main_nav > ul > li")[0];
            Fold.add_xml(data);
            Timeline.setXml(data);
            load($("#main_nav > ul > li")[0]);
            url = Url.constructor(xml);
        },
        error : function() {
            $("#wrapper").css("cursor", "initial"); //normal cursor
            alert("Erreur lors de l'obtention des données XML");
        }
    });
    tinymce.init({ //On initialise l'éditeur de texte
        selector:'#edit',
        plugins: "preview autolink image imagetools fullscreen textcolor colorpicker wordcount link lists code", //PLugins
        toolbar: "forecolor backcolor | link | bold italic underline | alignleft aligncenter alignright alignjustify | formatselect fontselect fontsizeselect | cut, copy, paste | bullist, numlist, | outdent, indent | image | preview, fullscreen", //Ce qui est affiché dans la toolbar
        content_css: "/src/css/editor.css",
        image_advtab: true, //On autorise les options avancées pour les images
        image_caption: true, //On autorise les legendes pour les images.
        images_upload_url: '/src/ajax/img_upload.php',
        convert_urls: false,
        height: 800,
        images_upload_handler: function(blobInfo, success, failure) {
            var xhr, formData;

            xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.open('POST', '/src/ajax/img_upload.php');

            xhr.onload = function () {
                var json;

                if (xhr.status !== 200) {
                    failure('HTTP Error: ' + xhr.statusText);
                    return;
                }

                json = JSON.parse(xhr.responseText);

                if (!json || typeof json.location !== 'string') {
                    failure('Invalid JSON: ' + xhr.responseText);
                    return;
                }

                success(json.location);
            };

            formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            xhr.send(formData);
        }
    });
    $("#main_nav > ul > li").click(function() {
        load(this);
        Url.setType($(this).attr("id"));
    });
    $(".add_fold").click(function() {
        foldList.push(new Fold(actualName));
    });
    $(".rm_fold").click(function() {
        remove_el();
    });
    $(document.body).keypress(function(e) {
        if (e.keyCode === 46) {   //on delete press
            remove_el();
        }
    });
    $(".edit_el").click(function() {
        $("#wrap_edit").css("display", "block");
        $("#wrap_content").html("");
        tinymce.activeEditor.render();
        if (File.getContent() !== "Aucun texte n'a été écrit pour l'instant.")
            tinymce.activeEditor.setContent(File.getContent());  //new text
    });
    $(".cancel_edit").click(function() {
         $("#wrap_edit").css("display", "none");
         tinymce.activeEditor.render(); //remove all the text from the editor
    });
    $(".valid_edit").click(function() {
        $("#wrap_edit").css("display", "none"); //close the modal windows
        var content = tinymce.activeEditor.getContent(); //get editor content
        File.saveContent(content);
        tinymce.activeEditor.render(); //new editor
    });
    function load(pointer) { //load all the folders from a type
        foldList = Array();
        Fold.prototype.us = Array();
        var name = $(pointer).attr("name");
        $(actualNameEl).removeClass("onselect_nav"); //remove the class from the old el
        actualNameEl = pointer; //set the new el
        actualName = name;
        $(pointer).addClass("onselect_nav"); //add the select class to the new el
        $("#folds").children().remove();
        $(".timeline").remove();
        $("#wrap_content").children().remove();
        $(".edit_el").css("display", "none");
        $(xml).find(actualName).children().each(function (i) {
            foldList.push(new Fold(actualName, i));
        });
        if ($(pointer).attr("name") === "chronologie") {
            timeline = new Timeline();
        }
    }
    function remove_el() {
        if (File.prototype.listSelected.length !== 0) {
            File.remove_file_html();
            File.remove_file_xml();
        }
        else if (confirm("La suppression de ce(s) dossier(s) supprimera tout leur contenu.")) {
            Fold.remove_fold_html();
            Fold.remove_fold_xml();
        }
    }
});