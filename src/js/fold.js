import {Xml} from './xml.js';
import {File} from './file.js';
import { Timeline } from './timeline.js';
import {Url} from './url.js';
export class Fold {
    constructor(name, loadId) { //name for actual type and loadID is the id's folder which is going to be loaded
        File.prototype.us = Array(); // initialise us Array for File
        Fold.prototype.actualNameXml = $(Fold.prototype.xml).find(name); //global var node name xml
        Fold.prototype.fold_nbr = $("#folds").children().length;    //get number of children from the html DOM
        Fold.prototype.us.push(this);   //add this instance in the us array
        Fold.prototype.listSelected = Array(); //reset the list of select element
        this.id = Fold.prototype.fold_nbr;  //the corresponding id is the last fold so it's the size of the fold number
        if (loadId !== undefined) { //if loading 
            this.foldXml = $(Fold.prototype.actualNameXml).find("folder[id='" + loadId + "']");   //set the xml node fold
            $("#folds").append("<div class='fold' id='" + loadId + "'></div>"); //add the fold at the end of the folds
            this.el = $("#folds").children().last(); //set the HTML node fold
            $(this.el).append("<a class='title_fold' id='" + Fold.prototype.fold_nbr + "'>"+$(this.foldXml).attr("name")+"</a>");   //add the title in the fold wrap
            this.title_fold = $(this.el).children().last(); //get it in the html DOM
            $(this.el).append("<a class='file add_file'>Ajouter un fichier</a>");
            var pointer = this; //keep the instance in a var
            $(this.foldXml).children().each(function() {    //for each file of the folder in the XML DOM load them
                Fold.prototype.children.push(new File(Fold.prototype.actualNameXml, pointer, $(this).attr("id")));
                //1 : for the tab where it's loaded, the second is for the folder instance, 3 is the id of the future file
            });
            this.id = loadId;
        }
        else { //else if adding
            if (Fold.prototype.actualEditFold !== undefined) { //if actual editing
                this.rename_fold_html(); //rename it
                this.rename_fold_xml(); //save it in xml
            }
            if (Fold.prototype.listSelected.length !== 0) {    //if actual selecting
                this.close_fold_html(false); //close it
            }
            this.add_fold_html();   //adding fold to the HTML DOM
            this.add_fold_xml();    //adding fold to the XML DOM
            this.event();   //update events
            Fold.prototype.actualEditFold = this.title_fold;  //set the actualEditFold as this one
            this.id = Fold.prototype.fold_nbr;
        }
        this.event(); //update events
    }
    static add_xml(xml) {   //add xml file this has to be called before instancing the class
        Fold.prototype.xml = xml;
        Fold.prototype.us = Array();
        Fold.prototype.children = Array();
        File.add_xml(xml);  //give the XML DOM to File class
    }
    add_fold_xml() {    //add fold in the xml dom
        $(Fold.prototype.actualNameXml).append("<folder id='" + Fold.prototype.fold_nbr + "' name='' ></folder>");  //add a folder in the actualNode
        this.foldXml = $(Fold.prototype.actualNameXml).children().last();   //set the new node xml
        Xml.save_xml(Fold.prototype.xml);   //save xml file
        
    }
    add_fold_html() { //add fold_in the html dom
        if (Fold.prototype.openedFold !== undefined) {
            Fold.prototype.openedFold.close_fold_html();
        }
        $("#folds").append("<a class='fold' id='" + Fold.prototype.fold_nbr + "'></a>"); //append the fold wrapp
        this.el = $("#folds").children().last(); //set the fold wrapp
        $(this.el).append("<a class='title_fold' id='" + Fold.prototype.fold_nbr + "'><input type='text' class='text_fold'/></a>"); //append the title in the fold wrapp
        this.title_fold = $(this.el).children().last(); //set the title
        $(this.el).append("<a class='file add_file'>Ajouter un fichier</a>"); //append in the fold wrapp a button to add a file
        $(this.title_fold).find("input").select();  //focus text inside edit area
        this.event();   //update events
    }
    rename_fold_xml() {
        if (Fold.prototype.actualEditFold !== undefined) {  //in case of double triggering with kb event
            $(Fold.prototype.actualNameXml).find("folder[id='" + $(Fold.prototype.actualEditFold).attr("id") + "']").attr("name", this.editing_input);  //find the corresponding folder and change its name
            Fold.prototype.actualEditFold = undefined; //no actualEditFold anymore
            Xml.save_xml(Fold.prototype.xml);   //save xml file
        }
    }
    rename_fold_html() {
        if (Fold.prototype.actualEditFold !== undefined) { //in case of double triggering with kb event
            if (Fold.prototype.listSelected.length !== 0) { //if a fold is selected
                this.close_fold_html(); //close it
            }
            this.editing_input = $(Fold.prototype.actualEditFold).find("input").val() || "Nouveau Dossier"; //set content of editing
            $(Fold.prototype.actualEditFold).html(this.editing_input); //remove the edit text and set the apropriate content 
            $(Fold.prototype.actualEditFold.parent()).removeAttr("style");   //remove custom style
        }
        this.event();
    }
    edit_fold_html() {
        if (Fold.prototype.actualEditFold !== undefined) {  //if editing another fold rename it
            this.rename_fold_html();
            this.rename_fold_xml();
        }
        if (Fold.prototype.listSelected.length !== 0) {    //if another fold is selected close it
            this.close_fold_html(false);    //no another open fold after
        }
        Fold.prototype.actualEditFold = this.title_fold;    //set actual editing fold
        $(this.el).css("border-style", "dotted");   //set style
        this.editing_input = $(this.title_fold).text(); //set content which is going into the input el
        $(this.title_fold).html("<input type='text' class='text_fold' value=''/>"); //add input text
        $(this.title_fold).find("input").val(this.editing_input).select(); //add the content and select all the text
        $(this.title_fold).off("click");    //desactivate click in case
        this.event();   //update events
    }
    static remove_fold_html() {
        $(Fold.prototype.listSelected).each(function () {   //for each fold selected
            $(this.el).remove();    //remove the wrapp
            $(this.title_fold).remove();   //remove the title
        });
        $("#folds").children().each(function (i) {  //reprocess id with folds left
            $(this).attr("id", i);  //id for fold wrapp
            $(this).children().first().attr("id", i);   //id for fold title
        });
        $(".rm_fold").css("visibility", "hidden").css("opacity", "0");  //hide the button
    }
    static remove_fold_xml() {
        Fold.prototype.fold_nbr -= Fold.prototype.listSelected.length; //decrease the fold number by number of selected el
        $(Fold.prototype.listSelected).each(function() {   //for each selected el remove it from the xml DOM
            $(Fold.prototype.actualNameXml).find("folder[id='" + $(this.title_fold).attr("id") + "']").remove();
        });
        $(Fold.prototype.actualNameXml).children().each(function(i) {   //reprocess id with folds left
            $(this).attr("id", i);  //attr id whith index in the xml DOM
        });
        Fold.prototype.listSelected = Array();  //reset folds selected
        Xml.save_xml(Fold.prototype.xml);   //save xml
    }
    open_fold_html(slide) { //if this function is called with a select slide with the mouse
        if (Fold.prototype.actualEditFold !== undefined) { //if editing fold
            this.rename_fold_html(); //rename
            this.rename_fold_xml();
        }
        if (Fold.prototype.openedFold !== undefined) {
            Fold.prototype.openedFold.close_fold_html();
        }
        if (Fold.prototype.ctrPress || slide) { //if ctrl is pressed or mouse is slid on the element
            Fold.prototype.listSelected.push(this);  //add it to the list of selected folds
            $(this.title_fold).addClass("onselect_fold");   //add style
            $(".rm_fold").css("visibility", "initial").css("opacity", "1"); //display button
        }
        else {  //if just one fold is selected
            $(Fold.prototype.listSelected).each(function () {   //if other is open close
                this.close_fold_html(true);
            });
            $(".rm_fold").css("visibility", "initial").css("opacity", "1"); //display button
            $(this.title_fold).addClass("onselect_fold");   //add style for this one
            $(this.title_fold).addClass("onopen_fold");
            $(this.el).addClass("onopen_fold_wrap");    //add style for fold wrapp
            Fold.prototype.listSelected = Array();  //reset list of selected folds
            Fold.prototype.listSelected.push(this); //add this one to the list
            File.prototype.us = Array();
            Fold.prototype.openedFold = this;
            Url.setFold(this.id);
        }
        this.event();
    }
    close_fold_html(next) { //next : if another fold goind to be selected
        $(".title_fold").css("-moz-user-select", "initial").css("user-select", "initial");
        if (!next) {    //hide the remove button
            $(".rm_fold").css("visibility", "hidden").css("opacity", "0"); 
        }
        if (Fold.prototype.openedFold === undefined) {
            $(Fold.prototype.listSelected).each(function() {
                $(this.title_fold).removeClass("onselect_fold");   //remove style for each selected el
                $(this.title_fold).removeClass("onopen_fold");
                $(this.el).removeClass("onopen_fold_wrap");
                $(Fold.prototype.children).each(function() {
                    this.close_file_html(true); //close all children's files class
                });
            });
        }
        else {
            $(Fold.prototype.openedFold.title_fold).removeClass("onselect_fold");   //remove style for each selected el
            $(Fold.prototype.openedFold.title_fold).removeClass("onopen_fold");
            $(Fold.prototype.openedFold.el).removeClass("onopen_fold_wrap");
            $(Fold.prototype.children).each(function() {
                this.close_file_html(true); //close all children's files class
            });
        }
        Fold.prototype.listSelected = Array();  //reset list of selected folds
        Fold.prototype.openedFold = undefined;
        this.event();
    }
    event() {   //update event
        var pointer = this; //save this element
        $(this.title_fold).keypress(function (e) { 
            if (e.which === 13) {   //on enter press
                e.preventDefault();
                pointer.rename_fold_html(); //rename
                pointer.rename_fold_xml();
            }
            if (e.which === 46) {   //on delete press
                if (confirm("La suppression de ce(s) dossier(s) supprimera tout leur contenu.")) {
                    Fold.remove_fold_html();
                    Fold.remove_fold_xml();
                }
            }
        });
        $(document.body).keydown(function (e) {
            if (e.which === 17) {   //on ctrl press
                e.preventDefault();
                Fold.prototype.ctrPress = true;
            }
        });
        $(document.body).keyup(function (e) {
            if (e.which === 17) {   //on ctrl release
                e.preventDefault();
                Fold.prototype.ctrPress = false;
            }
        });
        $(this.title_fold).click(function () {  //on click on el
            if ($(this).hasClass("onopen_fold")) {    //if it's open
                pointer.close_fold_html(); //close it
            }
            else {    //otherwise open it
                pointer.open_fold_html();
            }
        });
        $(this.title_fold).dblclick(function () {   //on double click on el
            if ($(pointer.el).attr("style") !== "border-style: dotted;") {
                    pointer.edit_fold_html();
            }
        });
        $(this.title_fold).mouseover(function() {  
            if (Fold.prototype.mousedown) { //if sliding on the el
                pointer.open_fold_html(true);
            }
        });
        $(this.title_fold).mousedown(function () {
            Fold.prototype.mousedown = true;
        });
        $(document.body).mouseup(function () {
            Fold.prototype.mousedown = false;
        });
        $(this.el).find(".add_file").click(function() { //if click on add_file add a new File
            setTimeout(() => {
                Fold.prototype.canAddFold = true;
            }, 10);
            if (Fold.prototype.canAddFold) {
                Fold.prototype.children.push(new File(Fold.prototype.actualNameXml, pointer));
                Fold.prototype.canAddFold = false;
            }
        });
        $(".timeline").click(function() {
            pointer.close_fold_html();
        });
        $(this.el).on('dragstart', function (e) {e.preventDefault();});
    }
}