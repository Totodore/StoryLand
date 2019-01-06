export class Timeline {
    constructor() {
        $("#nav_aside").append("<a class='timeline'>Frise chronologique</a>");  //Add the button at the end of the nav
        this.events();
    }
    loadTimeline(placeId) { //load function
        this.heading = $(Timeline.prototype.xml).find("heading");   //set head and body from the xml document
        this.body = $(Timeline.prototype.xml).find("events");
        var JSONArray = {   //set an array with basic info
            timeType: 'date',
            useTimeSuffix: false,
			startTime: -5000,
			endTime: 2000,
            markerIncrement: 100,
            data: {
                heading: [],
                events: []
            }  
        };
        $("#ctrl_header").html("<table><thead><tr><th>Début :</th><th>Fin :</th><th>Titre :</th></tr></thead></table>");    //add a table at the end
        $(this.heading).children().each(function(i) {   //for heach head
            JSONArray.data.heading.push({   //add the corresponding data in the JSON array
                "start": $(this).find("start").text(),
                "end": $(this).find("end").text(),
                "title": $(this).find("title").text(),
            });
            $("#ctrl_header > table").append("<tbody><tr id='"+i+"'><th xml='start'>"+$(this).find("start").text()+"</th><th xml='end'>"+$(this).find("end").text()+"</th><th xml='title'>"+$(this).find("title").text()+"</th></tr></tbody>");    //add the body with each informations
        });
        $("#ctrl_body").html("<table><thead><tr><th>Début :</th><th>Fin :</th><th>Titre :</th><th>Description :</th></tr></thead></table>");  
        $(this.body).children().each(function(i) {  //for each body
            JSONArray.data.events.push({    //add the corresponding data in the JSON array
                "start" : $(this).find("start").text(),
                "end" : $(this).find("end").text(),
                "title" : $(this).find("title").text(),
                "description" : $(this).find("description").text()
            });
            $("#ctrl_body > table").append("<tbody><tr id='"+i+"'><th xml='start'>"+$(this).find("start").text()+"</th><th xml='end'>"+$(this).find("end").text()+"</th><th xml='title'>"+$(this).find("title").text()+"</th><th xml='description'>"+$(this).find("description").text()+"</th></tr></tbody>");
            //add the body with each informations
        });
        if (placeId === "#modal_timeline") {
            $("#modal_timeline").append("<button class='valid'>Fermer la page d'édition</button>");
        }

        $(placeId).timespace(JSONArray); //Load the timeline
        this.events();  //load function with events
    }
    static setXml(xml) {    //set xml function
        Timeline.prototype.xml = xml;
    }
    static close() {    //autodestruction function
        $(".timeline").removeClass("onselect_fold");
        $("#wrap_timeline").remove();
    }
    savexml() {

    }
    hasinput() {    //function which return if table el have an input inside themselves
        let returner;
        $("th").each(function() {   //for each th
            if ($(this).has("input").length) {  //if it has a input
                returner = true;    //return true
                return false; //to break the loop
            }
            else {
                returner = false;   //return false
                return true;    //to continue the loop
            }
        });
        return returner;
    }
    events() {
        let pointer = this;
        $(".timeline").click(function() {   //if click on it
            $(this).addClass("onselect_fold");  //style it
            $("#wrap_content").html("<div id='wrap_timeline'></div>");  //add wrap timeline in the main content
            pointer.loadTimeline("#wrap_timeline"); //and load it
            $("#wrap_content").append("<button class='open_timeline'>Editer la frise chronologique</button>");  //append a button to edit it
            pointer.events();
        });
        // $(".open_timeline").click(function() {  //if click on this button 
        //     $("#modal_timeline").css("display", "block");   //display the modal
        //     $("#overlay").css("display", "block");
        //     pointer.loadTimeline("#disp_timeline"); //load the timeline in the modal
        //     $(document.body).css("overflow", "hidden"); //hide scroll bar in the main
        //     $(document.html).css("overflow", "hidden");
        // });
        $("#ctrl_header tbody th").dblclick(function() {    //on dlb click on one case
            if (!pointer.hasinput()) {  //if there isn't an input in a el
                if (isNaN(parseInt($(this).text()))) {  //if its text
                    $(this).html("<input type='text' class='edit_timeline' value='"+$(this).text()  +"'/>");    //add input text
                }
                else {  //if it's number 
                    $(this).html("<input type='number' class='edit_timeline' value='"+$(this).text()  +"'/>");  //add input number
                }
                $('.edit_timeline').select();   //select it
                pointer.events();
            }
        });
        $("#ctrl_body tbody th").dblclick(function() {
            if (!pointer.hasinput()) {
                pointer.oldEditText = $(this).text();
                if (isNaN(parseInt($(this).text())))
                    $(this).html("<input type='text' class='edit_timeline' value='"+$(this).text()  +"'/>");
                else {
                    $(this).html("<input type='number' class='edit_timeline' value='"+$(this).text()  +"'/>");
                }
                $('.edit_timeline').select();
            }
            pointer.events();
        });
        $(".edit_timeline").keypress(function(e) {
            if (e.which === 13) {   //on press enter
                let id = $(this).parent().parent().attr("id");
                let attr = $(this).parent().attr("xml");
                e.preventDefault();
                $(this).parent().text($(this).val());   //set the content of it inside the el
                $(pointer.heading).children().get(id).find(attr).text($(this).val());
            }
        });
        $(".valid").click(function() {
            $("#modal_timeline").css("display", "none");   //display the modal
            $("#overlay").css("display", "none");
            $(document.body).css("overflow", "auto"); //hide scroll bar in the main
            $(document.html).css("overflow", "auto");
        });
    }
}