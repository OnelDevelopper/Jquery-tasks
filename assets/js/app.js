$(document).ready(function(){
    console.log('init app');

    const form = $('#formApp')

    //sauvegarder les dpnnées dans le navigateur
    const saveData = (data) => {
        if ("localStorage" in window) {
            localStorage.setItem("tasks", JSON.stringify(data)) || [];
        }
    };

    //recevoir les données depuis le navigateur
    const getData = () => {
        if ("localStorage" in window) {
            return JSON.parse(localStorage.getItem("tasks"));
        } else {
            return [];
        }
    };
   
    //tableau  contenant les tâches
    let tasks = [];

    //créer une tâche
    form.submit(function(event){
        event.preventDefault()
        const input = $('input')
        const taskName = input.val().trim()
        if (taskName) {
            const task = {
                id: Math.round(Math.random() * 1000),
                name: taskName,
                createdAt: new Date(),
                updatedAt: null,
                isUpdating: false
            };
            tasks.push(task); 
            saveData(tasks)
            showTask();
        }
        form[0].reset()
    })

    //afficher les tâches
    const showTask = function(){
        const ul = $('.task-details');
        ul.empty();
        tasks.forEach(function(task) {
            const li = $('<li></li>');
            const span = $('<span></span>').text(task.name);
            const deleteBtn = $('<button></button>').text('Delete').addClass('delete').click(function(){
                deleteTask(task.id);
            });
    
            const checked = $('<i></i>').addClass('fa-regular fa-circle checked').click(function(){
                checked.css('display', 'none');
                unchecked.css('display', 'block');
                span.css('textDecoration', 'line-through');
                span.css('color', 'gray');
            });
    
            const unchecked = $('<i></i>').addClass('fa-solid fa-circle-check unchecked').click(function(){
                checked.css('display', 'block');
                unchecked.css('display', 'none');
                span.css('textDecoration', 'none');
                span.css('color', 'black');
            });
    
            if (task.isUpdating) {
                const input = $('<input>').addClass('input').val(task.name).change(function(event){
                    changeUpdateTask(event, task);
                });
    
                const acceptBtn = $('<button></button>').text('Ok ?').addClass('accept').click(function(){
                    saveUpdate(task);
                });
    
                li.append(input);
                li.append(acceptBtn);
            } else {
                span.text(task.name);
    
                const updateBtn = $('<button></button>').text('Edit').addClass('edit').click(function(){
                    updateTask(task);
                });
    
                li.append(span);
                li.append(updateBtn);
            }
    
            li.append(deleteBtn);
            li.append(checked);
            li.append(unchecked);
    
            ul.append(li)
        })
    }
    tasks = getData()
    showTask()
    
    //supprimer une tâche
    const deleteTask = function(id) {
        tasks = tasks.filter((task) => task.id !== id);
        saveData(tasks)
        showTask();
    };
    
    //initiation de la modification d'une tâche
    const updateTask = function(task){
        if (!task.isUpdating) {
            const index = tasks.findIndex(t => t.id === task.id);
            tasks[index].isUpdating = true;
        }
        saveData(tasks)
        showTask();
    };
    
    //modification de tâche
    const changeUpdateTask = function(event, task) {
        const name = $(event.target).val().trim();
        if (name) {
            task.name = name;
            task.updatedAt = new Date();
            const index = tasks.findIndex(t => t.id === task.id);
            tasks[index] = task;
            saveData(tasks)
        }
    };
    
    //sauvegarde de la modification
    const saveUpdate = function(task) {
        if (task.isUpdating) {
            const index = tasks.findIndex(t => t.id === task.id);
            tasks[index].isUpdating = !task.isUpdating;
        }
        saveData(tasks)
        showTask()
    };
    
})
