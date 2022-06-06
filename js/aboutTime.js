const today = () => {
	const newDate = new Date();
	return `${newDate.getFullYear()}.${newDate.getMonth()+1}.${newDate.getDate()}`;
}
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
//2022-05-28T04:39:05.346Z => 05-28 04:39
const parsedUpdatedAt = updatedAt => `${updatedAt.slice(5,10)} ${updatedAt.slice(11,16)}`;

export {today, renderTime, parsedUpdatedAt};
