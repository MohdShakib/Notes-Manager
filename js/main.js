

/*
    Created By Mohd Shakib on 03-July-2014
*/

(function(config, app){
    app.setAlListContainerId(config.alListContainerId);
    app.setNewListInputId(config.newListInputId);
    app.setNewListNoteId(config.newListNoteId);
    app.setNewListFormId(config.newListFormId);
    app.setSearchByTitleId(config.searchByTitleId);
    app.setSubmitButtontId(config.submitButtonId);
    app.bindForm();

})(window.config, window.app);
