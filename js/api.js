import axios from 'axios'

const BASE_URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos'
const headers = {
  'Content-Type': 'application/json',
	apikey: process.env.API_KEY,
	username: 'kDT2_LeeJuSang'
}

const reorderTodos = async (todoIds) => {
	try {
		return await axios({
			url: `${BASE_URL}/reorder`,
			method: 'PUT',
			headers,
			data: {
				todoIds
			}
		})
	} catch (error) {
		alert(error);
	}
}
const createTodos = async title => {
	try {
		return await axios({
			url: BASE_URL,
			method: 'POST',
			headers,
			data: {
				title,
				order: 0
			}
		});
		
	} catch (error) {
		alert(error);
	}
}
const readTodos = async () => {
	try {
		return await axios({
			url: BASE_URL,
			method: 'GET',
			headers,
		})
	} catch (error) {
		alert(error);
	}
}
const updateTodos = async (id, title, done, order) => {
	try {
		return await axios({
			url: `${BASE_URL}/${id}`,
			method: 'PUT',
			headers,
			data: {
				title,
				done,
				order
			}
		})
	} catch (error) {
		alert(error);
	}
}
const deleteTodos = async (id) => {
	try {
		return await axios({
			url: `${BASE_URL}/${id}`,
			method: 'DELETE',
			headers,
		})
	} catch (error) {
		alert(error);
	}
}

export { reorderTodos, createTodos, readTodos, updateTodos, deleteTodos }