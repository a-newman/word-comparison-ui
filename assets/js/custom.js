const SENTINALS = [
    ["small", "big"],
    ["huge", "tiny"]
];
const NUM_REPEATS = 2;

var LAST_CLICKED;
var NUM_SUB_TASKS;

var dummies = [
    ['big', 'little'], 
    ['tiny', 'huge'], 
    ['enormous', 'miniscule'],
    ['large', 'small']
];

var custom = {
    loadTasks: function(numSubtasks) {
        /*
         * This function is called on page load and should implement the promise interface
         *
         * numSubtasks - int indicating what length array to return (how many subtasks this task should have)
         * 
         * returns: if config.meta.aggregate is set to false, an array of objects with length config.meta.numTasks,
         * one object for each task; else, an object that will be made available to all subtasks
         */
        // load the whole list of adjectives 
        // generate a random pair 

        //ui setup: remove the next button 
        NUM_SUB_TASKS = numSubtasks - 1;
        $('#next-button').hide();
        $('.option').click(function() {
            //reset all buttons to unselected state 
            $('.option').removeClass('primary');
            // set the current state 
            LAST_CLICKED = $(this).text();
            $(this).addClass('primary');
            $('#next-button').click();
        });

        var task = gup('task');
        if (task.length < 1) {
            task = '1'; 
        }
        return $.ajax({
            url: "assets/data/" + task + ".json",
            dataType: "json"
        }).then(function(pairs) {
            // var numToChoose = NUM_SUB_TASKS - SENTINALS.length - NUM_REPEATS;
            //var tasks = chooseRandomElts(pairs, numToChoose);
            var tasks = pairs;
            var repeats = chooseRandomElts(tasks, NUM_REPEATS);
            console.log("repeats", repeats);

            repeats.forEach(function(elt) {
                tasks.push([elt[0], elt[1]]); //copy the array so the order can be shuffled separately 
            })

            tasks.forEach(function(elt) {
                shuffleArray(elt);
            });

            // push the sentinals 
            tasks = tasks.concat(SENTINALS);
            shuffleArray(tasks);
            return dummies;
            //return tasks;
        });
    },
    showTask: function(taskInput, taskIndex, taskOutput) {
        /*
         * This function is called when the experiment view is unhidden 
         * or when the task index is changed
         *
         * taskInput - if config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex; else, the input object from loadTasks
         * taskIndex - the number of the current subtask 
         * taskOutput - a partially filled out task corresponding to the subtask taskIndex
         *   If config.meta.aggregate is set to false, this is the results object for the current 
         *   subtask. If config.meta.aggregate is set to true, this is the results object for the
         *   entire task. 
         * 
         * returns: None
         */
        if (taskIndex == NUM_SUB_TASKS) {
            $("#custom-task").hide();
            return;
        }
        $('#custom-task').show();
        $(".option").removeClass("primary");
        // fill in the words on the buttons
        $('#word1-button').text(taskInput[0]);
        $('#word2-button').text(taskInput[1]);
        //reload old state
        if (taskOutput) {
            $('.option').each(function(i, elt) {
                var obj = $(elt);
                if (obj.text() == taskOutput) {
                    obj.addClass('primary');
                }
            });
        }
    },
    collectData: function(taskInput, taskIndex, taskOutput) {
        /* 
         * This function should return the experiment data for the current task 
         * as an object. 
         *
         * taskInput - if config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex; else, the input object from loadTasks
         * taskIndex - the number of the current subtask 
         * taskOutput - outputs collected for the subtask taskIndex
         *   If config.meta.aggregate is set to false, this is the results object for the current 
         *   subtask. If config.meta.aggregate is set to true, this is the results object for the
         *   entire task.
         *
         * returns: if config.meta.aggregate is false, any object that will be stored as the new
         *   taskOutput for this subtask in the overall array of taskOutputs. If
         *   config.meta.aggregate is true, an object with key-value pairs to be merged with the
         *   taskOutput object.
         */
         //I am going to save the word that was chosen. 
        return LAST_CLICKED;
    },
    validateTask: function(taskInput, taskIndex, taskOutput) {
        /*
         * This function should return an error message if the 
         * data stored in taskOutput is not valid (e.g. fully filled out), and 
         * a falsey value otherwise
         *
         * taskInput - if config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex; else, the input object from loadTasks
         * taskIndex - the number of the current subtask 
         * taskOutput - outputs collected for the subtask taskIndex
         *   If config.meta.aggregate is set to false, this is the results object for the current 
         *   subtask. If config.meta.aggregate is set to true, this is the results object for the
         *   entire task
         * 
         * returns: string indicating error message or falsey value
         */
         return false;
        // if (taskOutput.trim().length > 0) {
        //     return null;
        // } else {
        //     return "please complete the task!";
        // }
    }
};


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function chooseRandomElts(array, n) {
    var indices = new Set();
    while (indices.size < n) {
        random = Math.floor(Math.random()*array.length);
        indices.add(random);
    }

    var ret = [];
    // push the real data 
    indices.forEach(function(index) {
        ret.push(array[index]);
    });
    return ret;
}

function gup(name) {
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var tmpURL = window.location.href;
    var results = regex.exec( tmpURL );
    if (results == null) return "";
    else return results[1];
}