import {Xml} from './xml.js';
import { Fold } from './fold.js';
import { Timeline } from './timeline.js';
import {Url} from './url.js';

export class File {
    constructor(actualNameXml, foldId, loadId) {    //actual name 
        this.parentClass = foldId;
        File.prototype.name = foldId.name;
        File.prototype.actualNameXml = actualNameXml;
        File.prototype.us.push(this);
        File.prototype.file_nbr = $(this.parentClass.el).children().length - 2;
        this.parentXml = foldId.foldXml;
        this.parentId = this.parentClass.id;
        if (loadId !== undefined) {
            this.fileXml = $(this.parentXml).find("file[id='"+ loadId+"']");
            this.content = $(this.fileXml).text() || "Aucun texte n'a été écrit pour l'instant.";
            $(this.parentClass.el).append("<a class='file' id='"+loadId+"'>"+ $(this.fileXml).attr("name") +"</a>");
            this.el = $(this.parentClass.el).children().last();
            this.id = loadId;
        }
        else {
            if (File.prototype.actualEditFile !== undefined) { //if actual editing
                this.rename_file_html(); //rename it
                this.rename_file_xml(); //save it in xml
            }
            if (File.prototype.listSelected.length !== 0) {    //if actual selecting
                this.close_file_html(false); //close it
            }
            this.add_file_html();   //adding fold to the HTML DOM
            this.add_file_xml();    //adding fold to the XML DOM
            this.content = "Aucun texte n'a été écrit pour l'instant.";
            this.event();   //update events
            File.prototype.actualEditFile = this.el;  //set the actualEditFile as this one
            this.id = File.prototype.file_nbr;
        }
        this.event(); //update events
    }
    static add_xml(xml) {   //add xml file this has to be called before instancing the class
        File.prototype.xml = xml;
       //set the fold number to -1 and cause of the array 0
        File.prototype.us = Array();
        File.prototype.listSelected = Array();
    }
    add_file_html() {
        $(this.parentClass.el).append("<a class='file' id='"+ File.prototype.file_nbr +"'><input type='text' class='text_fold'/></a>");
        this.el = $(this.parentClass.el).children().last(); //set the element 
        $(this.el).find("input").select();  //focus text inside edit area
        this.event();   //update events
    }
    add_file_xml() {
        $(this.parentXml).append("<file id='" + File.prototype.file_nbr + "' name='' ></file>");  //add a folder in the actualNode
        this.fileXml = $(this.parentXml).children().last();   //set the new node xml
        File.prototype.openedFile = this;
        Xml.save_xml(File.prototype.xml);   //save xml file
    }
    rename_file_html() {
        if (File.prototype.actualEditFile !== undefined) { //in case of double triggering with kb event
            if (File.prototype.listSelected.length !== 0) { //if a fold is selected
                this.close_fold_html(); //close it
            }
            this.editing_input = $(File.prototype.actualEditFile).find("input").val() || "Nouveau Fichier"; //set content of editing
            // this.editing_input);
            $(File.prototype.actualEditFile).html(this.editing_input); //remove the edit text and set the apropriate content
            $(File.prototype.actualEditFile).removeAttr("style");   //remove custom style
        }
    }
    rename_file_xml() {
        if (File.prototype.actualEditFile !== undefined) {  //in case of double triggering with kb event
            $(this.parentXml).find("file[id='" + $(File.prototype.actualEditFile).attr("id") + "']").attr("name", this.editing_input);
            //find the apropriate xml element and change the name by the name given
            File.prototype.actualEditFile = undefined; //no actualEditFile anymore
            Xml.save_xml(File.prototype.xml);   //save xml file
        }
    }
    edit_file_html() {
        if (File.prototype.actualEditFile !== undefined) {  //if editing another fold rename it
            this.rename_file_html();
            this.rename_file_xml();
        }
        if (File.prototype.listSelected.length !== 0) {    //if another fold is selected close it
            this.close_file_html(false);    //no another open fold after
        }
        File.prototype.actualEditFile = this.el;    //set actual editing fold
        this.editing_input = $(this.el).text();
        $(this.el).css("border-style", "dotted");   //set style
        $(this.el).html("<input type='text' class='text_fold' value=''/>"); //add input text and set the content inside
        // this.el);
        $(this.el).find("input").val(this.editing_input).select(); //select all the text
        this.event();   //update events
    }
    static remove_file_html() {
        var el = $(".fold[class='fold onopen_fold_wrap']");
        $(File.prototype.listSelected).each(function () {   //for each fold selected
            $(this.el).remove();   //remove it
        });
        $(el).children().not(".add_file").not(".title_fold").each(function (i) {  //reprocess id with folds left
            $(this).attr("id", i);
        });
        // $(".rm_fold").css("visibility", "hidden").css("opacity", "0");  //hide the button
    }
    static remove_file_xml() {
        File.prototype.file_nbr -= File.prototype.listSelected.length; //decrease the fold number by number of selected el
        $(File.prototype.listSelected).each(function() {   //for each selected el remove it from the xml DOM
            $(this.parentXml).find("file[id='" + $(this.el).attr("id") + "']").remove();
        });
        $(File.prototype.listSelected).each(function() {
            $(File.prototype.xml).find(File.prototype.actualNameXml).find("folder[id='"+ this.parentId +"']").children().each(function(i) {   //reprocess id with folds left
                $(this).attr("id", i);
            });
        });
        File.prototype.listSelected = Array();  //reset folds selected
        Xml.save_xml(File.prototype.xml);   //save xml
    }
    open_file_html(slide) {
        Timeline.close();
        if (File.prototype.actualEditFile !== undefined) { //if editing fold
            this.rename_file_html(); //rename
            this.rename_file_xml();
        }
        if (File.prototype.ctrPress || slide) { //if ctrl is pressed or mouse is slid on the element
            File.prototype.listSelected.push(this);  //add it to the list of selected folds
            $(this.el).addClass("onselect_fold");   //add style
            $(".rm_fold").css("visibility", "initial").css("opacity", "1"); //display button
            $(".edit_el").css("display", "none");
            $("#wrap_content").html("");
        }
        else {  //if just one fold is selected
            console.log(File.prototype.listSelected);
            if (File.prototype.listSelected.length !== 0){ //if another fold is selected 
                this.close_file_html(true); //close it
            }
            $(File.prototype.listSelected).each(function () {   //remove style for all the ancient selected folds
                $(this).removeClass("onselect_fold");
            });
            $(".rm_fold").css("visibility", "initial").css("opacity", "1"); //display button
            $(this.el).addClass("onselect_fold");   //add style for this one
            $("#wrap_content").html(this.content);
            $(".edit_el").css("display", "inline-block");
            File.prototype.listSelected = Array();  //reset list of selected folds
            File.prototype.listSelected.push(this); //add this one to the list
            Fold.prototype.openedFold = this.parentClass;
            File.prototype.openedFile = this;
            Url.setFile(this.id);
        }
    }
    close_file_html(next) { //next : if another fold goind to be selected
        $(".file").css("-moz-user-select", "initial").css("user-select", "initial");
        if (!next) {    //hide the remove button
            $(".rm_fold").css("visibility", "hidden").css("opacity", "0"); 
        }
        $(File.prototype.listSelected).each(function() {
            $(this.el).removeClass("onselect_fold");   //remove style for each selected el
        });
        File.prototype.listSelected = Array();  //reset list of selected folds
        File.prototype.openedFile = undefined;
        $("#wrap_content").html("");
        $(".edit_el").css("display", "none");
    }
    static saveContent(content) {
        String.prototype.htmlEscape = function() {
            return $('<div/>').text(this.toString()).html();
        };
        $(File.prototype.xml).find(File.prototype.actualNameXml).find("folder[id='"+ File.prototype.openedFile.parentId +"']").find(File.prototype.openedFile.fileXml).html(content.htmlEscape());
        File.prototype.openedFile.content = content;
        $("#wrap_content").html(content);
        Xml.save_xml(File.prototype.xml);
    }
    static getContent() {
        return File.prototype.openedFile.content;
    }
    event() {   //update event
        var pointer = this; //save this element
        $(this.el).keypress(function (e) { 
            if (e.which === 13) {   //on enter press
                e.preventDefault();

                pointer.rename_file_html(); //rename
                pointer.rename_file_xml();
            }
        });
        $(document.body).keydown(function (e) {
            if (e.which === 17) {   //on ctrl press
                e.preventDefault();
                File.prototype.ctrPress = true;
            }
        });
        $(document.body).keyup(function (e) {
            if (e.which === 17) {   //on ctrl release
                e.preventDefault();
                File.prototype.ctrPress = false;
            }
        });
        $(this.el).click(function () {  //on click on el
            pointer.open_file_html();
        });
        $(this.el).dblclick(function () {   //on double click on el
            if ($(this).attr("style") !== "border-style: dotted;") {
                pointer.edit_file_html();
            }
        });
        $(this.el).mouseover(function() {  
            if (File.prototype.mousedown) { //if sliding on the el
                pointer.open_file_html(true);
                $(".file").css("-moz-user-select", "none").css("user-select", "none");
            }
        });
        $(this.el).mousedown(function () {
            File.prototype.mousedown = true;
        });
        $(document.body).mouseup(function () {
            File.prototype.mousedown = false;
        });
    }
}