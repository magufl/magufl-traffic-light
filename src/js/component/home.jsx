import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
	const [newTodo, setNewTodo] = useState("");
	const [todoList, setTodoList] = useState([{}]);
	const [visible, setVisible] = useState([]);

	// API constants and variables
	const urlToAPI = "https://assets.breatheco.de/apis/fake/todos/user/CL4UD3PT";
	const optionsGetTodos = {method: "GET",	headers: {'Content-Type' : 'application/json'}}


	// get tasks from API at first time app loads
	useEffect(()=>{
		getTodos();
	}, [])

	const getTodos = async () => {
		const response = await fetch(urlToAPI, optionsGetTodos);
		const data = await response.json();
		setTodoList(data);
	}

	// Handle new todo
	const handleNewTodoList = (e) => {
		// remove white spaces around todo
		let todo = e.target.value;
		console.log('before normalize', todo);
		
		// todo must have at least one letter or a number
		let regex = /^(?=.*[a-zA-Z0-9]).+$/;
		if (regex.test(todo)) {
			todo = normalizeTodo(todo);

			
			
			// todo must be unique to add to todoList and update API
			if (todoList.filter(t => t.label === todo).length === 0 && e.key === 'Enter'){
				const newTodoList = [...todoList, { label : todo, done : false }];
				updateTodos(newTodoList);
			}
		}else{console.log(`The task "${todo}" it's not valid!`)};
	}

	const normalizeTodo = (todo) => {
		// removing white spaces around and lowercase it
		let task = todo.trim().toLowerCase();
		
		// normalize condition depending on length of task
		// capitalizes first letter
		task.length > 1
		? task = task.charAt(0).toUpperCase() + task.slice(1)
		: task = task.charAt(0).toUpperCase();
		
		return task;
	};

	// update tasks at backend API
	// not optimized for large lists cause it's sending and retrieving the entire list
	const updateTodos = async (list = todoList) => {	
		console.table(list);
		const response = await fetch(urlToAPI, {
			method: "PUT",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify(list)
		})
		
		// if response is ok then local list its updated and input element is reseted
		if(response.ok) {
			setTodoList(list);
			setNewTodo("");
		}
	}
  
	const handleTaskMouseEnter = (index) => {
	  setVisible((prevState) => {
		const newState = [...prevState];
		newState[index] = true;
		return newState;
	  });
	};
  
	const handleTaskMouseLeave = (index) => {
	  setVisible((prevState) => {
		const newState = [...prevState];
		newState[index] = false;
		return newState;
	  });
	};
  
	return (
	  <div className="container text-center col-6 vh-100">
		<h1>Todo List</h1>
		<input
		  className="w-100 form-control"
		  value={newTodo}
		  placeholder={todoList.length <= 0 ? "No tasks, add a task!" : "Add a new todo"}
		  onChange={(e) => setNewTodo(e.target.value)}
		  onKeyUp={(e) => handleNewTodoList(e)}
		/>
		<ul className="list-group mt-3 shadow">
		  {todoList.map((todo, index) => {
			if(!todo.hidden){
				return (
				<li
					className="list-group-item list-group-item-action d-flex justify-content-between align-items-center fs-5"
					key={index}
					onMouseEnter={() => handleTaskMouseEnter(index)}
					onMouseLeave={() => handleTaskMouseLeave(index)}
				>
					{todo.label}
					<i
					className={`remove-btn fa-regular fa-circle-xmark fs-3 text-danger ${visible[index] ? "" : "invisible"}`}
					onClick={() => updateTodos(todoList.filter((task, i) => i != index))}
					></i>
				</li>
				);
			}
		  })}
		</ul>
	  </div>
	);
  };
  
  export default Home;