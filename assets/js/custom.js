const SENTINALS = [
    ["small", "big"],
    ["huge", "tiny"]
];

var LAST_CLICKED;

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
        $('#next-button').hide();
        $('.option').click(function() {
            //reset all buttons to unselected state 
            $('.option').removeClass('primary');
            // set the current state 
            LAST_CLICKED = $(this).text();
            console.log("LAST_CLICKED", LAST_CLICKED);
            $(this).addClass('primary');
            $('#next-button').click();
        });

        return $.ajax({
            url: "assets/data/pairs.json",
            dataType: "json"
        }).then(function(pairs) {
            tasks = [];
            // generate numSubtasks random indices, corresponding to pairs to show 
            var indices = new Set();
            var numToChoose = numSubtasks - SENTINALS.length;
            while (indices.size < numToChoose) {
                random = Math.floor(Math.random()*pairs.length);
                indices.add(random);
            }
            // push the real data 
            indices.forEach(function(index) {
                var options = pairs[index]; 
                shuffleArray(options);
                tasks.push(options);
            });
            // push the sentinals 
            tasks = tasks.concat(SENTINALS);
            shuffleArray(tasks);
            console.log("length tasks", tasks.length);
            return tasks;
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
        $(".option").removeClass("primary");
        // fill in the words on the buttons
        console.log("taskInput", taskInput);
        $('#word1-button').text(taskInput[0]);
        $('#word2-button').text(taskInput[1]);
        //reload old state
        if (taskOutput) {
            console.log("there was taskoutput");
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