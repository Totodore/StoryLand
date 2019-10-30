export class Xml {
    static save_xml(xml) {
        var xmlData = "<?xml version='1.0' encoding='utf-8'?>\n" + new XMLSerializer().serializeToString(xml.documentElement);
        var xml = new FormData();
        xml.append("xml", xmlData);
        $.ajax({
            type: 'POST',
            url: '/src/ajax/save_xml.php',
            data: xml,
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                $("#wrapper").css("cursor", "initial"); //cursor normal
                console.log(data);
            },
            error: function () {
                alert("Erreur lors de la sauvegarde des données XML");
            }
        });
    }
}