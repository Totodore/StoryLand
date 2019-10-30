export class Url {
    static constructor() {
        Url.prototype.url = new URL(document.location.href);
        Url.prototype.path = Url.prototype.url.pathname;
        Url.prototype.paramHandler = Url.prototype.url.searchParams;
        Url.prototype.paramUrl = Url.prototype.url.search;
        Url.prototype.typeId = Url.prototype.paramHandler.get("type") || undefined;
        Url.prototype.foldId = Url.prototype.paramHandler.get("fold") || undefined;
        Url.prototype.fileId = Url.prototype.paramHandler.get("file") || undefined;
        Url.prototype.paramHandler.set("type", 0);
        Url.updateUrl();
        Url.getType();
        Url.getFold();
        Url.getFile();
    }
    static setType(id) {
        Url.prototype.paramHandler.delete("fold");
        Url.prototype.paramHandler.delete("file");
        Url.prototype.paramHandler.set("type", id);
        Url.prototype.paramUrl = Url.prototype.paramHandler.toString();
        Url.prototype.url.search = Url.prototype.paramUrl;   
        Url.updateUrl();
    }
    static setFold(id) {
        Url.prototype.paramHandler.delete("file");
        Url.prototype.paramHandler.set("fold", id);
        Url.prototype.paramUrl = Url.prototype.paramHandler.toString();
        Url.prototype.url.search = Url.prototype.paramUrl;
        Url.updateUrl();
    }
    static setFile(id) {
        Url.prototype.paramHandler.set("file", id);
        Url.prototype.paramUrl = Url.prototype.paramHandler.toString();
        Url.prototype.url.search = Url.prototype.paramUrl;
        Url.updateUrl();
    }
    static getType() {
        if (Url.prototype.typeId !== undefined)
            Url.prototype.type = $("#main_nav ul").children().get(Url.prototype.typeId).click();
    }
    static getFold() {
        if (Url.prototype.foldId !== undefined) {
            Url.prototype.fold = $("#folds").find("div[id=" + Url.prototype.foldId + "]");
            Url.prototype.fold.children().first().click();
        }
    }
    static getFile() {
        if (Url.prototype.fileId !== undefined && Url.prototype.fold !== undefined)
            Url.prototype.file = $(Url.prototype.fold).find("a[id=" + Url.prototype.fileId + "]").click();
    }
    static updateUrl() {
        history.pushState({reload: "page"}, "Documentation", Url.prototype.url.toString());
    }
}