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
})();


// UI Controller
var UIController =(function(){
    var domItems = {
        // Admin Panel items
        questInsertBtn: document.getElementById('question-insert-btn')
    };
    
    return {
        getDomItems: domItems,
        addInputsDynamically: function(){
            var addInput = function() {
                
            };
        }
    };
    
})();


// Controller
var controller = (function(quizCtrl, UICtrl) {
    var selectedDomItems = UICtrl.getDomItems;
    
    UICtrl.addInputsDynamically();
    
})(quizController, UIController);

