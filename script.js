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
})