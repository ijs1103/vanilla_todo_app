import { BOARD_TYPE } from './constant';
import { parsedUpdatedAt } from './aboutTime';
export const todoTemplate = (id, title) => {
	return `<li data-key=${id}>${title}<button class="btn--ok">확인</button>
	<button class="btn--delete">삭제</button>
	<button class="btn--update">수정</button></li>`
}
{/* <span class="material-icons">
						delete
					</span> */}
export const boardTemplate = boardType => {
	return `
		<div class="board ${boardType}">
			<div class="board__title">
				<h3>${BOARD_TYPE[`${boardType}`]}</h3>
				${boardType === 'done' ? `
				<div class="board--delete">	
				</div>` : ''}
			</div>
			<div class="board__content">
				<ul class="cards ${boardType}">
				</ul>
			</div>
		</div>
	`;
};

export const cardTemplate = ({id, title, done, order, updatedAt}) => {
	return `
		<li class="card" data-id=${id} data-done=${done} data-order=${order}>
			<div class="card__title">
				<button class="btn--delete">
				</button>
			</div>
			<div class="card-inner">
				<div class="card__content">
					<label>${title}</label>
					<input type="text" />
				</div>
				<div class="card__buttons content_buttons">
					${!done ? `<button class="btn--update">
					수정
				</button>` : ''}
				</div>
				<div class="card__buttons edit_buttons">
					<button class="btn--ok">
						확인
					</button>
					<button class="btn--cancel">
						취소
					</button>
				</div>
				<div class="card__updatedAt">${parsedUpdatedAt(updatedAt)}</div>
			</div>
		</li>
	`;
};