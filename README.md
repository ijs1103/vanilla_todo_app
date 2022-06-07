# 📌 할 일 관리(Todo) 프로젝트

- 과제 기한:
  - 과제 수행 기간: 05월 19일(목) ~ 06월 09일(목)
  - 코드 리뷰 기간: 06월 09일(목) ~ 06월 17일(금)
- 내용:
  - 주어진 API를 활용해 할 일 관리 프로젝트를 만들어보세요.

## 👉 요구사항

### 필수 요구사항

- [ ] 할 일 목록(list)을 조회(Read)할 수 있어야 합니다.
- [ ] 할 일 항목(item)을 추가(Create)할 수 있어야 합니다.
- [ ] 할 일 항목을 수정(Update)할 수 있어야 합니다.
- [ ] 할 일 항목을 삭제(Delete)할 할 수 있어야 합니다.
- [ ] 실제 서비스로 배포하고 접근 가능한 링크를 추가해야 합니다.

### 선택 요구사항

- [ ] 할 일 항목의 순서를 바꿀 수 있도록 만들어 보세요.
- [ ] 할 일을 완료하지 않은 항목과 완료한 항목을 분류해서 출력해 보세요.
- [ ] 할 일을 완료한 항목을 한번에 삭제할 수 있도록 만들어 보세요.
- [ ] 할 일 항목의 최신 수정일을 표시해 보세요.
- [ ] 최초 API 요청(Request)에 대한 로딩 애니메이션을 추가해 보세요.
- [ ] SCSS, Bootstrap 등을 구성해 프로젝트를 최대한 예쁘게(?) 만들어 보세요.

## 👉 느낀점

- `vue`와 `react`의 공통 원리인 데이터(상태)가 바뀌면 상태도 바뀌어야 한다는 어떻게 보면, 단순하지만 중요한 원칙을 바닐라로 todo웹을 구현하면서 몸소 체험하였다.

- `클로저`와 `IIFE`를 과제에 적용해보니 사용하는 이유를 납득하게 되었다.
- `Promise`를 잘 알고 있는 줄 알았으나 전혀 아니었다. 더 겸손하게 공부하자 !!

- 첫 설계의 중요성을 깨닫게 되는 계기였다. `하는중`탭을 만들고 시작했으나, api로 데이터를 받아오고 `Sortable` 라이브러리를 사용하여 잦은 데이터 변경이 일어나다보니, `localStorage`에 `하는중`탭의 데이터를 따로 저장하며 불러오는 것이 쓸데없는 비용만 발생하는 코드라고 판단하였고, `하는중`탭은 없애버렸다.

- 피그마 좀 더 배워야 겠다. 공부 안하고 쓰니 그림판이랑 별반 차이가 없다 ..

- `todo`를 `CUD`할 때마다, 전체 `todo`를 `read`하고  리렌더링 하도록 구현하였다. 이러한 두번의 `api` 호출 때문에, 가끔씩 서로 다른 보드간에 `todo`가 이동할 때 느릿느릿 변경되는 현상이 있다... 

- ~~저는 레트로 디자인을 좋아하는 사람입니다~~

## 👉 특징

- 윈도우 xp 디자인 (디지털 시계도 구현)
- 모달창으로 todo 입력 받음 
- 완료 보드로 todo를 드래그 하면 완료 처리
- w3c markup, css validation 적용

## 👉 새로 알게 된점

>### 클로저와 IIFE

아래 코드는 현재 시간을 `시:분:AM` 형식으로 파싱하고 그 값을 노드의 텍스트값으로 업데이트 해주는 코드입니다.

이 때, `querySelector`로 받아온 요소 값에 접근이 필요하지만 한번의 실행만 필요합니다.

따라서, 요소 값을 제외한 코드를 `클로저`로 만들어 주었고 함수 자체를 `IIFE`로 변경 하였습니다.

```js
const renderTime = (() => {
	const $navTime = document.querySelector('.nav__time');
	return () => {
		const newDate = new Date();
		let hours = newDate.getHours();
		let minutes = newDate.getMinutes();
		const AMPM = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 ? hours % 12 : 12; 
		minutes = minutes < 10 ? '0'+minutes : minutes;
		$navTime.textContent = `${hours} : ${minutes} ${AMPM}`;
	}
})();
```

>### scss 문법:  if문, 함수, darken

아래 scss 코드는 일종의 함수라고 볼 수 있습니다.

매개 변수에 따라서 if문 조건에 해당되는 `backgroundcolor`를 적용 시킵니다.

또한, `darken` 내장함수로 원하는 색상을 `%`단위로 어둡게 변경 시킬 수 있습니다.

```css
@mixin btn($func: false) {
	$bgc: '';

	@if $func==update {
		$bgc: map-get($color, btn-update);
	}

	@else if $func==ok {
		$bgc: map-get($color, btn-ok);
	}

	@else if $func==delete {
		$bgc: map-get($color, btn-delete);
	}

	@else {
		$bgc: map-get($color, btn-cancel);
	}
	&:hover {
		background-color: darken($bgc, 20%);
	}
    // 이하 생략
}
```

>### sortable.js

저의 todo웹은 서로 다른 보드간에 `todo`를 이동 시키면 그 즉시, 완료와 미완료 상태가 전환 되도록 구현 하였습니다.

이러한 처리를 위해, `sortable`의 `onAdd` 속성을 이용하였습니다. 

`onAdd`는 다른 `sortable`에서 현재 `sortable`로 `item`이 드래그 되었을 때, 이를 감지하여 호출되는 콜백 함수입니다.

`onAdd` 함수에서 `todo`의 완료 혹은 미완료 상태로 업데이트를 하고, 전체 `todo`를 리렌더링 하였습니다.

```js
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
				updateCard(id, title, type === DONE, order);
				await renderCards();
			}
```

> ### 반복문 안에서 비동기 처리

일반 `for문, forEach` 에서는 `promise`의 호출이 보장이 되지 않습니다. 

`for in, for of` 문에서는 기대했던대로 `promise`들의 순차적인 호출이 보장 됩니다.

`promise.all`에서는 `promise`들을 병렬적으로 처리하지만, 기대했던 순서로 실행이 보장이 되지 않고 하나의 비동기 함수라도 `reject`가 되면 `Promise.all` 전체가 `reject` 됩니다.

따라서, `for of` 문으로 반복되는 `promise`들을 호출 하였습니다. 

```js
for (const cardDone of $doneCards) {
	await deleteCard(cardDone.dataset.id);
}
```

## 링크

https://sparkly-dusk-f6877f.netlify.app/




