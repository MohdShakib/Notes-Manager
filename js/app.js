
(function(window){
    var app = (function(document){

        var alListContainerId, newListFormId, newListInputId, newListNoteId, submitButtontId;

       //localStorage.clear();
        
        var allLists  = localStorage.getItem('allLists') || [];
        var allTitles = localStorage.getItem('allTitles') || [];

        var storedAllLists = allLists;

        if(storedAllLists && storedAllLists.length > 0){
            storedAllLists   = JSON.parse(storedAllLists);
            allLists         = storedAllLists;
        }

        if(allTitles && allTitles.length){
            allTitles = allTitles.split(',');
        }


        var setAlListContainerId    =   function(alListContainerIdPar){
            alListContainerId  =   alListContainerIdPar;
        };

        var setNewListFormId    =   function(newListFormIdPar){
            newListFormId  =   newListFormIdPar;
        };

        var setNewListInputId   =   function(newListInputIdPar){
            newListInputId  =   newListInputIdPar;
        };

        var setNewListNoteId   =   function(newListNoteIdPar){
            newListNoteId  =   newListNoteIdPar;
        };        

        var setSubmitButtontId   =   function(submitButtontIdPar){
            submitButtontId  =   submitButtontIdPar;
        };

        var setSearchByTitleId   =   function(searchByTitleIdPar){
            searchByTitleId  =   searchByTitleIdPar;
        };
    

        var addEvent    =   function(evnt, elem, func) {

            if (elem.addEventListener)  // W3C DOM
                elem.addEventListener(evnt,func,false);
            else if (elem.attachEvent) { // IE DOM
                elem.attachEvent("on"+evnt, func);
            }
            else { // No much to do
                elem[evnt] = func;
            }
        };

        var createListElement =   function(listTitle, listNote, newItem){

            var emptyMessage  =  document.getElementById('empty-list');

            if(emptyMessage){
                emptyMessage.remove();
            }

            var listContainer       =   document.createElement('div');
            listContainer.className =   'col-sm-3 col-sm-offset-1 listContainer';

            var listTitleEle        =  document.createElement('strong');
            listTitleEle.innerHTML  =   listTitle;

            var close       =   document.createElement('span');
            close.className =   'close';
            close.innerHTML =   'X';


            addEvent('click',close,function(e){
               
                var removableTitle  = this.parentNode.getElementsByTagName('strong')[0].innerHTML;
                var titleIndex      = allTitles.indexOf(removableTitle);

                if(titleIndex > -1){
                    allTitles.splice(titleIndex,1);
                    allLists.splice(titleIndex,1);
                    localStorage.setItem('allLists',JSON.stringify(allLists));
                    localStorage.setItem('allTitles',allTitles);
                }

                if(!allTitles.length){
                    var listsContainerInstance       =   document.getElementById(alListContainerId);
                    listsContainerInstance.innerHTML = '<div id="empty-list">No notes available.</div>';
                }
               
                this.parentNode.parentNode.removeChild(listContainer);
            } );

        
            var list    =   document.createElement('ul');
            list.className = 'editable';

            var listElement             =   listNote;

            if(newItem){
                var listElement         =   document.createElement('li');
                listElement.innerHTML   =   listNote;
                list.appendChild(listElement);
            }else{
                list.innerHTML          =   listElement;
            }

            list.setAttribute('contenteditable','true');

            addEvent('blur',list,function(e){

                var editableContent = this.parentNode.getElementsByTagName('ul')[0].innerHTML;
                var editableTitle   = this.parentNode.getElementsByTagName('strong')[0].innerHTML;
                var titleIndex      = allTitles.indexOf(editableTitle);

                if(titleIndex > -1){
                    allLists[titleIndex].note = editableContent;
                    localStorage.setItem('allLists',JSON.stringify(allLists));
                }
                
            });

            listContainer.appendChild(listTitleEle);
            listContainer.appendChild(close);
            listContainer.appendChild(list);

            if(newItem){ // don't push when generating from localStorage
                allTitles.push(listTitle);
                allLists.push({'title': listTitle, 'note': listNote});

                localStorage.setItem('allLists',JSON.stringify(allLists));
                localStorage.setItem('allTitles',allTitles);
            }

            return listContainer;
        };

        var searchNotes = function(titleSearch){

             var emptyMessage            =   document.getElementById('empty-list');
             var storedAllLists          =   localStorage.getItem('allLists') || [];
             var listsContainerInstance  =   document.getElementById(alListContainerId);

             listsContainerInstance.innerHTML = '';

            if(storedAllLists && storedAllLists.length){
                storedAllLists = JSON.parse(storedAllLists);
                allLists         = storedAllLists;
            }

            if(emptyMessage){
                 emptyMessage.remove();
            }
             //storedAllLists = JSON.parse(storedAllLists);
             //allLists       = storedAllLists;

             var storedAllListsLength    =   storedAllLists.length;
             var noFoundFlag             =   1;

             if(storedAllLists && storedAllListsLength){
                
                for (var k = 0; k < storedAllListsLength; k++) {

                    if(storedAllLists[k].title.indexOf(titleSearch) > -1){
                        noFoundFlag = 0;
                        listsContainerInstance.appendChild(createListElement(storedAllLists[k].title, storedAllLists[k].note, false));
                    }
                    
                }
            }

            if(noFoundFlag){
                listsContainerInstance.innerHTML = '<div id="empty-list">No notes available.</div>';
            }

        };

        var bindForm    =   function(){

            var formInstance            =   document.getElementById(newListFormId);
            var listsContainerInstance  =   document.getElementById(alListContainerId);
            var inputField              =   document.getElementById(newListInputId);
            var inputNotes              =   document.getElementById(newListNoteId);
            var submitButtonInstance    =   document.getElementById(submitButtontId);
            var searchByTitleInstance   =   document.getElementById(searchByTitleId);
            
            var storedAllListsLength    =   storedAllLists.length;

            if(storedAllLists && storedAllListsLength){
                
                for (var k = 0; k < storedAllListsLength; k++) {

                    listsContainerInstance.appendChild(createListElement(storedAllLists[k].title, storedAllLists[k].note, false));
                
                };
            }

            addEvent('keyup', searchByTitleInstance, function(e){
                var searchString = searchByTitleInstance.value;
                searchNotes(searchString);
            });

            addEvent('click', submitButtonInstance,function(e){

                if(!(inputField.value && inputNotes.value)){
                    return false;
                }

                var i, duplicate_entry =  false, allTitlesLength = allTitles.length;

                for(i = 0; i < allTitlesLength; i++) {
                    if(allTitles[i] === inputField.value) {
                        duplicate_entry = true;
                        break;
                    }
                }

                if(duplicate_entry){
                    alert('Notes with same title already exist. Duplicate entry not allowed !');
                }else{
                    listsContainerInstance.appendChild(createListElement(inputField.value, inputNotes.value, true));
                }
            } );

        };

        return {
            setAlListContainerId : setAlListContainerId,
            setNewListFormId : setNewListFormId,
            setNewListInputId : setNewListInputId,
            setNewListNoteId : setNewListNoteId,
            setSubmitButtontId : setSubmitButtontId,
            setSearchByTitleId: setSearchByTitleId,
            searchNotes : searchNotes,
            bindForm : bindForm
        };

    })(window.document);

    window.app =   app;
})(window);

