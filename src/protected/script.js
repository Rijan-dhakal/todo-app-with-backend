
const todoInput = document.querySelector('.todo-input');
const addBtn = document.querySelector('.add-btn');
const empty = document.querySelector('.empty-state');
const listContainer = document.querySelector('.todo-list')

const domain = 'http://localhost:3001'

let local = [];

(async ()=>{
    try {
        const response = await axios.get(`${domain}/api/todos`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.data.success && response.data.data) {
            local = response.data.data.map(todo => ({
                id: todo._id,
                text: todo.content,
                isCompleted: todo.completed
            }));
            displayList(local);
        }
    } catch (error) {
        console.error('Error fetching todos');
        
        if (error.response?.status === 401) {
            console.log('User not authenticated');
        }
    }
})();

// accepting input
const receiveInput = async function(e){
    e.preventDefault();
    let entered = todoInput.value.trim();
    todoInput.value = '';
    if(!entered) return;
    
    try {
        const response = await axios.post(`${domain}/api/todos`, {
            content: entered,
            completed: false
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.data.success && response.data.data) {
            const newTodo = {
                id: response.data.data._id,
                text: response.data.data.content,
                isCompleted: response.data.data.completed
            };
            local.push(newTodo);
            displayList(local);
        }
    } catch (error) {
        console.error('Error creating todo');
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
            await axios.delete(`${domain}/api/todos/${todoId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            local.splice(index, 1);
            displayList(local);
        } catch (error) {
            console.error('Error deleting todo');
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
            await axios.patch(`${domain}/api/todos/${todoId}`, {
                completed: newCompletedState
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            local[index].isCompleted = newCompletedState;
            displayList(local);
        } catch (error) {
            console.error('Error updating todo');
        }
    } else {
        console.log('No todo ID found');
    }
}



addBtn.addEventListener('click', receiveInput);
listContainer.addEventListener('click', removeItem);


displayList(local);