import {
	reorderTodos,
	createTodos,
	readTodos,
	updateTodos,
	deleteTodos
} from './api';
import {
	today,
	renderTime
} from './aboutTime';
import {
	boardTemplate,
	cardTemplate
} from './template';
import {
	TYPE
} from './constant';
import Sortable from 'sortablejs'

(() => {
	const get = target => document.querySelector(target);
	const getAll = target => document.querySelectorAll(target);
	const { TODO, DONE } = TYPE;
	const $today = get('.today');
	const $boards = get('.boards');
	const $modal = get('.modal');
	const $modalForm = $modal.querySelector('.modal__form');
	const $modalCurtain = $modal.querySelector('.modal__curtain');
	const $btnAdd = get('.btn--add');
	const $loader = get('.loader');
	const startLoading = () => $loader.classList.add('active');
	const stopLoading = () => $loader.classList.remove('active');
	const renderBoard = () => {
		$boards.insertAdjacentHTML('beforeend', boardTemplate(TODO));
		$boards.insertAdjacentHTML('beforeend', boardTemplate(DONE));
	};
	const renderCardsByType = (type, cards) => {
		const $cards = get(`.${type} .cards`);
		$cards.innerHTML = '';
		const newCards = cards.reduce((acc, cur) => acc + cardTemplate(cur), "");
		$cards.insertAdjacentHTML('beforeend', newCards);
	};
	const renderCards = (isInit = false) => {
		// isInit이 true일때만 로더 표시 
		isInit && startLoading();
		const todos = readTodos();
		todos.then(res => {
			const {
				data
			} = res;
			renderCardsByType(TODO, data.filter(cur => !cur.done));
			renderCardsByType(DONE, data.filter(cur => cur.done));
		}).then(() => isInit && stopLoading()).catch(error => alert(error.message));
	}
	const reorderCards = () => {
		// 1) 데이터 받아오고 
		const todos = readTodos();
		return todos.then(res => {
			const {
				data
			} = res;
			// 2) 리오더
			const isReordered = reorderTodos(data.map(cur => cur.id));
			if (!isReordered) throw new Error("순서가 변경되지 않았습니다.");
			// 3) 리렌더링
			renderCardsByType(TODO, data.filter(cur => !cur.done));
			renderCardsByType(DONE, data.filter(cur => cur.done));
		}).catch(error => alert(error.message));
	};
	const changeEditMode = e => {
		if (!e.target.closest('.card')) return;
		const $card = e.target.closest('.card');
		const $label = $card.querySelector('label');
		const $input = $card.querySelector('input[type="text"]');
		const $contentButtons = $card.querySelector('.content_buttons');
		const $editButtons = $card.querySelector('.edit_buttons');
		const value = $input.value;
		if (e.target.className === 'btn--update') {
			$label.style.display = 'none'
			$input.style.display = 'block'
			$contentButtons.style.display = 'none'
			$editButtons.style.display = 'flex'
			$input.focus()
			$input.value = ''
			// 처음 데이터를 불러오면 input에는 value값이 없다
			$input.value = value || $label.innerText
		}
		if (e.target.className === 'btn--cancel') {
			$label.style.display = 'block'
			$input.style.display = 'none'
			$contentButtons.style.display = 'flex'
			$editButtons.style.display = 'none'
			$input.value = $label.innerText
		}
	};
	const createCard = async title => {
		await createTodos(title);
		renderCards();
		await reorderCards();
	};
	const updateCard = (id, title, done, order) => {
		updateTodos(id, title, done, order).then(
			() => renderCards()
		);
	};
	const deleteCard = id => {
		return deleteTodos(id).then(isDeleted => {
			if (!isDeleted) alert("삭제가 되지 않았습니다");
		});
	};
	const onUpdateCard = e => {
		if (!e.target.closest('.card')) return;
		const $card = e.target.closest('.card');
		const id = $card.dataset.id;
		const $input = $card.querySelector('input[type="text"]');
		const title = $input.value;
		const done = 'true' === $card.dataset.done;
		const order = $card.dataset.order;
		if (e.target.className === 'btn--ok') {
			updateCard(id, title, done, order);
		}
	}
	const onDeleteCard = async e => {
		if (e.target.className !== 'btn--delete') return;
		const $card = e.target.closest('.card');
		const id = $card.dataset.id;
		await deleteCard(id).then(
			() => renderCards()
		);
	}

	const onSubmit = e => {
		e.preventDefault();
		const $input = e.target.querySelector('input');
		const title = $input.value;
		if (!title.trim()) return;
		createCard(title);
		$input.value = '';
		$modal.classList.remove('active');
		$btnAdd.classList.remove('clicked');
	}

	const sortable_options = type => {
		return {
			group: {
				name: `${type}`,
				put: type===TODO ? DONE : TODO
			},
			animation: 200,
			onAdd: async event => {
				const {
					item: {
						dataset: {
							id,
							order
						}
					},
					item
				} = event;
				const title = item.querySelector('label').textContent;
				updateCard(id, title, type === DONE, order).then(
					() => renderCards()
				);
			}
		};
	}
	const onbtnDeleteAllClick = async () => {
		const $doneCards = getAll('.cards.done .card');
		if (!$doneCards.length) return;
		if (!window.confirm("정말로 모두 삭제하시겠습니까?")) return;
		for (const cardDone of $doneCards) {
			await deleteCard(cardDone.dataset.id);
		}
		renderCards();
	};
	const toggleModal = () => {
		$modal.classList.toggle('active');
		$btnAdd.classList.toggle('clicked');
		if ($modal.classList.contains('active')) $modal.querySelector('input').focus();
	}
	const initTime = () => {
		$today.textContent = today();
		renderTime();
		// 1분 단위로 시간 표시 
		setInterval(renderTime, 60000);
	}
	const initTodos = () => {
		renderBoard();
		renderCards(1);
		const $cardsTodo = get('.cards.todo');
		const $cardsDone = get('.cards.done');
		Sortable.create($cardsTodo, sortable_options(TODO));
		Sortable.create($cardsDone, sortable_options(DONE));
	}
	const setEventHandler = () => {
		// 먼저 initTodos()로 board와 card를 렌더링 해야만, queyrSelector로 아래 값들을 받아 올수 있다.
		const $btnDeleteAll = $boards.querySelector('.board--delete');
		const $cardsAll = getAll('.cards');
		$btnDeleteAll.addEventListener('click', onbtnDeleteAllClick);
		$cardsAll.forEach(cardsEl => {
			cardsEl.addEventListener('click', changeEditMode);
			cardsEl.addEventListener('click', onUpdateCard);
			cardsEl.addEventListener('click', onDeleteCard);
		})
		$btnAdd.addEventListener('click', toggleModal);
		$modalCurtain.addEventListener('click', toggleModal);
		$modalForm.addEventListener('submit', onSubmit);
	}
	const init = () => {
		initTime();
		initTodos();
		setEventHandler();
	}
	window.addEventListener('DOMContentLoaded', init);
})()