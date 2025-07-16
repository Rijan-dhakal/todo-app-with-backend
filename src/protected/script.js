
const todoInput = document.querySelector('.todo-input');
const addBtn = document.querySelector('.add-btn');
const empty = document.querySelector('.empty-state');
const listContainer = document.querySelector('.todo-list')

let local = [];

(async ()=>{
    try {
        const response = await fetch("http://localhost:3001/api/todos", {
            method: 'GET',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Todos fetched:', result);
            if (result.success && result.data) {

                local = result.data.map(todo => ({
                    id: todo._id,
                    text: todo.content,
                    isCompleted: todo.completed
                }));
                displayList(local);
            }
        } else {
            console.error('Failed to fetch todos:', response.status, response.statusText);
            
            if (response.status === 401) {
                console.log('User not authenticated');
            }
            
        }
    } catch (error) {
        console.error('Error fetching todos:', error);
        
    }
})();

// accepting input
const receiveInput = async function(e){
    e.preventDefault();
    let entered = todoInput.value.trim();
    todoInput.value = '';
    if(!entered) return;
    
    try {
        const response = await fetch("http://localhost:3001/api/todos", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: entered,
                completed: false
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
                
                const newTodo = {
                    id: result.data._id,
                    text: result.data.content,
                    isCompleted: result.data.completed
                };
                local.push(newTodo);
                displayList(local);
            }
        } else {
            console.error('Failed to create todo:', response.status);
        }
    } catch (error) {
        console.error('Error creating todo:', error);
    }
}

// displaying the lists
const displayList = function(local){
    listContainer.innerHTML = '';
    if(local.length == 0) {
        empty.classList.remove('hidden');
        return;
    } else{
        empty.classList.add('hidden');
    }
    
    local.forEach((ele, index) => {
        const html = `<li class="todo-item ${ele.isCompleted ? 'completed': ''}" data-index=${index} data-id="${ele.id || ''}">
                <input type="checkbox" class="todo-checkbox" ${ele.isCompleted ? 'checked' : ''}>
                <span class="todo-text ${ele.isCompleted ? 'completed': ''}">${ele.text}</span>
                <button class="delete-btn">Delete</button>
            </li>`
        
    listContainer.insertAdjacentHTML('afterbegin', html);
    });
     
}

const removeItem = async function(e){
    if(e.target.classList.contains('todo-checkbox')) {
        toggleComplete(e);
        return;
    }
    if(!e.target.closest('.delete-btn')) return;
    
    const target = e.target.closest('.todo-item');
    const todoId = target.dataset.id;
    const index = Number(target.dataset.index);
    
    if (todoId) {
        
        try {
            const response = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                local.splice(index, 1);
                displayList(local);
            } else {
                console.error('Failed to delete todo:', response.status);
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    } else {
        console.log('No todo ID found');
    }
}


const toggleComplete = async function(e){
    const target = e.target.closest('.todo-item');
    if (!target) return;

    const index = Number(target.dataset.index);
    const todoId = target.dataset.id;
    const newCompletedState = !local[index].isCompleted;
    
    if (todoId) {
        
        try {
            const response = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed: newCompletedState
                })
            });
            
            if (response.ok) {
                local[index].isCompleted = newCompletedState;
                displayList(local);
            } else {
                console.error('Failed to update todo:', response.status);
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    } else {
        console.log('No todo ID found');
    }
}



addBtn.addEventListener('click', receiveInput);
listContainer.addEventListener('click', removeItem);


displayList(local);