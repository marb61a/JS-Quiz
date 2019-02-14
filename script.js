// Quiz Controller
var quizController = (function() {
    // Question Constructor
    function Question(id, questionText, options, correctAnswer){
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
    
    var questionLocalStorage = {
        setQuestionCollection: function(newCollection){
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        
        getQuestionCollection: function() {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        
        removeQuestionCollection: function() {
            localStorage.removeItem('questionCollection');
        }
    };
    
    if(questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }
    
    var quizProgress = {
        questionIndex: 0
    };
    
    // Person Constructor
    function Person(id, firstname, lastname, score) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }
    
    var currPersonData = {
        fullname: [],
        score: 0
    };
    
    var personLocalStorage = {
        setPersonData: function(newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        
        getPersonData: function() {
            return JSON.parse(localStorage.getItem('personData'));  
        },
        
        removePersonData: function() {
            localStorage.removeItem('personData');
        }
    };
    
    
    
    return {
        getQuestionLocalStorage: questionLocalStorage,
        
        addQuestionOnLocalStorage: function(newQuestText, opts){
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
            
            if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }
            
            optionsArr = [];
            
            for(var i = 0; i < opts.length; i++) {
                if(opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }
                
                if(opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = optionsArr[i].value;
                    
                    isChecked = true;
                }
            }
            
            if(questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[
                    questionLocalStorage.getQuestionCollection().length - 1
                ].id + 1;
            } else {
                questionId = 0;
            }
            
            if(newQuestText.value !== "") {
                if(optionsArr.length > 1) {
                    if(isChecked) {
                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
                        
                        getStoredQuests = questionLocalStorage.getQuestionCollection();
                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);
                        
                        newQuestText.value = "";
                        for(var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }
                        
                        console.log(questionLocalStorage.getQuestionCollection());
                        return true;
                    } else {
                        alert('You missed to check correct answer, or you checked answer without value');
                        return false;
                    }
                } else {
                    alert('You must insert at least two options');
                    return false;
                }
            } else {
                alert('Please, Insert Question');
                return false;
            }
        },
        
        checkAnswer: function(ans) {
            if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
                return true;    
            } else {
                return false;
            }
        },
        
        isFinished: function() {
            return quizProgress.questionIndex +1 === questionLocalStorage.getQuestionCollection().length;            
        },
        
        addPerson: function() {
            var newPerson, personId, personData;
            if(personLocalStorage.getPersonData().length > 0) {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            } else {
                personId = 0;
            }
            
        }
    };

})();


// UI Controller
var UIController =(function(){
    var domItems = {
        // Admin Panel elements
        questInsertBtn: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestsWrapper: document.querySelector(".inserted-questions-wrapper"),
        questUpdateBtn: document.getElementById('question-update-btn'),
        questDeleteBtn: document.getElementById('question-delete-btn'),
        questsClearBtn: document.getElementById('questions-clear-btn'),
        
        // Quiz Section elements
        askedQuestText: document.getElementById('asked-question-text'),
        quizoptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('progress'),
        progressPar: document.getElementById('progress'),
        instAnsContainer: document.querySelector('.instant-answer-container'),
        instAnsText: document.getElementById('instant-answer-text'),
        instAnsDiv: document.getElementById('instant-answer-wrapper'), 
        emotionIcon: document.getElementById('emotion'), 
        nextQuestbtn: document.getElementById('next-question-btn')
        
    };
    
    return {
        getDomItems: domItems,
        addInputsDynamically: function(){
            var addInput = function() {
                var inputHTML, z;
                z = document.querySelectorAll(".admin-option").length;
                
                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' 
                + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' 
                + z + '" value=""></div>';
                
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
                
            };
            
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        
        createQuestionList: function(getQuestions) {
            var questHTML, numberingArr;
            numberingArr = [];
            
            domItems.insertedQuestsWrapper.innerHTML = "";
            
            for(var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                numberingArr.push(i + 1);
                questHTML = '<p><span>' + numberingArr[i] + '. ' +
                getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' +
                getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';
                
                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },
        
        editQuestList: function(event, storageQuestList, addInpsDynFn, updateQuestListFn) {
            var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;
            
            if('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1]);
                getStorageQuestList = storageQuestList.getQuestionCollection();
                
                for(var i = 0; i < getStorageQuestList.length; i++) {
                    if(getStorageQuestList[i].id === getId) {
                        foundItem = getStorageQuestList[i];
                        placeInArr = i;
                    }
                }
                
                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = "";
                optionHTML = '';
                
                for(var x = 0; x < foundItem.options.length; x++) {
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + 
                    x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + 
                    x + '" value="'+ foundItem.options[x] + '"></div>';
                }
                
                domItems.adminOptionsContainer.innerHTML = optionHTML;

                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questInsertBtn.style.visibility = 'hidden';
                domItems.questsClearBtn.style.pointerEvents = 'none';
                
                addInpsDynFn();
                
                var backDefaultView = function() {
                    var updatedOptions;
                    domItems.newQuestionText.value = '';
                    updatedOptions = document.querySelectorAll('.admin-option');

                    for(var i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }
                    
                    domItems.questDeleteBtn.style.visibility = 'hidden';
                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    domItems.questInsertBtn.style.visibility = 'visible';
                    domItems.questsClearBtn.style.pointerEvents = '';

                    updateQuestListFn(storageQuestList);
                };
                
                var updateQuestion = function() {
                    var newOptions, optionEls;
                    newOptions = [];
                    
                    optionEls.document.querySelectorAll('.admin-option');
                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = '';
                    
                    for(var i = 0; i < optionEls.length; i++) {
                        if(optionEls[i].value !== '') {
                            newOptions.push(optionEls[i].value);
                            
                            if(optionEls[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionEls[i].value;
                            }
                        }
                    }
                    
                    foundItem.options = newOptions;
                    if(foundItem.questionText !== '') {
                        if(foundItem.options.length > 1) {
                            if(foundItem.correctAnswer !== "") {
                                getStorageQuestList.splice(placeInArr, 1, foundItem);
                                getStorageQuestList.setQuestionCollection(getStorageQuestList);
                                backDefaultView();
                            }
                        } else {
                            alert('You missed to check correct answer, or you checked an answer without a value');
                        }
                    } else {
                        alert('Please, insert question');
                    }
                };
                
                domItems.questUpdateBtn.onclick = updateQuestion;
                
                var deleteQuestion = function() {
                    getStorageQuestList.splice(placeInArr, 1);
                    storageQuestList.setQuestionCollection(getStorageQuestList);
                    backDefaultView();
                };
                
                domItems.questDeleteBtn.onclick = deleteQuestion();
            }
        },
        
        clearQuestList: function(storageQuestList) {
            if(storageQuestList.getQuestionCollection() !== null) {
                if(storageQuestList.getQuestionCollection().length > 0) {
                    var conf = confirm('Warning! You will lose the entire question list');
                    
                    if(conf) {
                        storageQuestList.removeQuestionCollection();
                        domItems.insertedQuestsWrapper.innerHTML = "";
                    }
                }    
            }
        },
        
        displayQuestion: function(storageQuestList, progress) {
            var newOptionHTML, characterArr;
            characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];
            
            if(storageQuestList.getQuestionCollection().length > 0) {
                domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizoptionsWrapper.innerHTML = "";
                
                for(var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    newOptionHTML = '<div class="choice-' + i +'"><span class="choice-' + i +'">' + 
                    characterArr[i] + '</span><p  class="choice-' + i +'">' + 
                    storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';
                    
                    domItems.quizoptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },
        
        displayProgress: function(storageQuestList, progress) {
            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;
            domItems.progressBar.textContent = (progress.questionIndex + 1) + '/' + storageQuestList.getQuestionCollection().length;
        },
        
        newDesign: function(ansResult, selectedAnswer) {
            var twoOptions, index;
            index = 0;
            
            if(ansResult) {
                index = 1;
            }
            
            twoOptions = {
                instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
                instAnswerClass: ['red', 'green'],
                emotionType: ['images/sad.png', 'images/happy.png'],
                optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)']
            };
            
            domItems.quizoptionsWrapper.style.cssText = 'opacity: 0.6; pointer-events: none;';
            domItems.instAnsContainer.style.opacity = '1';
            domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
            domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];
            
            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];
        },
        
        resetDesign: function() {
            domItems.quizoptionsWrapper.style.cssText = '';
            domItems.instAnsContainer.style.opacity = '0';
        },
        
        getFullName: function(currPerson, storageList, admin) {
            if(domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== '') {
                if(!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {
                    
                }
            }    
        }
    };
    
})();


// Controller
var controller = (function(quizCtrl, UICtrl) {
    var selectedDomItems = UICtrl.getDomItems;
    
    UICtrl.addInputsDynamically();
    
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    
    selectedDomItems.questInsertBtn.addEventListener('click', function(){
        var adminOptions = document.querySelectorAll('.admin-option');
        
        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
        if(checkBoolean) {
            UI.createQuestionList(quizCtrl.getQuestionLocalStorage);    
        }
    });
    
    selectedDomItems.insertedQuestsWrapper.addEventListener('click', function(e) {
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);   
    });
    
    selectedDomItems.questsClearBtn.addEventListener('click', function() {
        UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
    });
    
    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    
    selectedDomItems.quizoptionsWrapper.addEventListener('click', function(e) {
        var updatedOptionsDiv = selectedDomItems.quizoptionsWrapper.querySelectorAll('div');
        for(var i = 0; i < updatedOptionsDiv.length; i++) {
            if(e.target.className === 'choice-' + i) {
                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                var answerResult = quizCtrl.checkAnswer(answer);
                
                UICtrl.newDesign(answerResult, answer);
                
                if(quizCtrl.isFinished()) {
                    selectedDomItems.nextQuestbtn.textContent = 'Finish';
                }
                
                var nextQuestion = function(questData, progress) {
                    if(quizCtrl.isFinished()) {
                        quizCtrl.addPerson();
                        UICtrl.finalResult(quizCtrl.getCurrPersonData);
                    } else {
                        UICtrl.resetDesign();
                        quizCtrl.getQuizProgress.questionIndex++;
                        
                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                    }
                };
                
                selectedDomItems.nextQuestbtn.onclick = function() {
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                };
            }
        }
    });
    
})(quizController, UIController);

