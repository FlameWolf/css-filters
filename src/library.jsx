export const ellipsis = String.fromCharCode(0x2026);

export const trimFileName = function (fileName) {
	if (fileName.length <= 12) {
		return fileName;
	}
	const lastPeriodIndex = fileName.lastIndexOf(".");
	if (lastPeriodIndex < 0 || fileName.length - lastPeriodIndex > 5) {
		return `${fileName.substr(0, 4)}${ellipsis}${fileName.substr(-4)}`;
	}
	return `${fileName.substr(0, 3)}${ellipsis}${fileName.substr(lastPeriodIndex - 3)}`;
};

(function () {
	let pressTimer = false;
	const pressedEvent = new CustomEvent("press", {
		bubbles: true,
		cancelable: true,
		composed: true
	});
	const releasedEvent = new CustomEvent("release", {
		bubbles: true,
		cancelable: true,
		composed: true
	});
	const pressed = event => {
		if (event.buttons === 1) {
			pressTimer = setInterval(() => {
				event.target.dispatchEvent(pressedEvent);
			}, 100);
		}
	};
	const released = event => {
		clearInterval(pressTimer);
		event.target.dispatchEvent(releasedEvent);
	};
	globalThis.addEventListener("mousedown", pressed);
	globalThis.addEventListener("mouseup", released);
})();