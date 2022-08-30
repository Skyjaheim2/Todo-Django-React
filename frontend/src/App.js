import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			todoList: [],
			activeItem: {
				id: null,
				title: '',
				completed: false,
			},
			editing: false,
		}
		this.fetchTasks = this.fetchTasks.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.getCookie = this.getCookie.bind(this)

		this.startEdit = this.startEdit.bind(this)
		this.deleteTask = this.deleteTask.bind(this)
		this.strikeUnStrike = this.strikeUnStrike.bind(this)
	}
	getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i].trim();
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) === (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
	componentDidMount() {
		// Runs after component have been mounted
		this.fetchTasks()
	}
	fetchTasks() {
		// console.log('Fetching..')

		fetch('api/task-list/')
			.then(res => res.json())
			.then(data => {
				this.setState({
					todoList: data
				})
			})
	}
	handleChange(e) {
		let {name, value} = e.target
		// console.log('Name:', name)
		// console.log('Value: ', value)

		this.setState({
			activeItem: {
				...this.state.activeItem,
				title: value
			}
		})
	}

	handleSubmit(e) {
		e.preventDefault()
		console.log('ITEM: ', this.state.activeItem)

		let csrf_token = this.getCookie('csrftoken')

		let url = `api/task-create`

		if (this.state.editing) {
			url = `api/task-update/${this.state.activeItem.id}`
			this.setState({
				editing: false
			})
		}
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'X-CSRFToken': csrf_token,
			},
			body: JSON.stringify(this.state.activeItem)
		})
		.then((res) => {
			this.fetchTasks()
			this.setState({
				activeItem: {
					id: null,
					title: '',
					completed: false,
				},
			})
		})
		.catch((err) => console.log('ERROR: ', err))
	}

	startEdit(task) {
		this.setState({
			activeItem: task,
			editing: true,
		})
	}
	deleteTask(task) {
		let csrf_token = this.getCookie('csrftoken')

		let url = `api/task-delete/${task.id}`
		fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
				'X-CSRFToken': csrf_token,
			},
		})
		.then(res => {
			this.fetchTasks()

		})
	}
	strikeUnStrike(task) {
		task.completed = !(task.completed)
		
		let url = `api/task-update/${task.id}`

		let csrf_token = this.getCookie('csrftoken')
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'X-CSRFToken': csrf_token,
			},
			body: JSON.stringify({'completed': task.completed, 'title': task.title})
		})
		.then(() => {
			this.fetchTasks()

		})
		.catch((err) => console.log('ERROR: ', err))
	}
	
	render() { 
		let tasks = this.state.todoList
		let self = this
		return (
			<div className='container'>
				<div id='task-container'>
					<div id='form-wrapper'>
						<form onSubmit={this.handleSubmit} id="form">
							<div className="flex-wrapper">
								<div style={{ flex: 6 }}>
									<input onChange={this.handleChange}  className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task.." />
								</div>

								<div style={{ flex: 1 }}>
									<input id="submit" className="btn btn-warning" type="submit" name="Add" />
								</div>
							</div>
						</form>
					</div>
					<div id='list-wrapper'>
						{tasks.map(function(task, index) {
							return (
								<div key={index} className="task-wrapper flex-wrapper">
									<div style={{ flex: 7 }} onClick={() => self.strikeUnStrike(task)}>
										{task.completed ? <strike>{task.title}</strike> : <span>{task.title}</span>}
									</div>
									<div style={{ flex: 1 }}>
										<button onClick={() => self.startEdit(task)} className='btn btn-sm btn-outline-info'>Edit</button>
									</div>
									<div style={{ flex: 1 }}>
										<button onClick={() => self.deleteTask(task)} className='btn btn-sm btn-outline-dark delete'>Del</button>
									</div>
									
								</div>
							)
						})}
					</div>
				</div>

			</div>
		);
	}
}
 
export default App;
