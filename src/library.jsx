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

export const Cookie = {
	MAX_AGE_SECONDS: 2147483647,
	get: name => {
		const cookieString = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)?.[1];
		if (cookieString) {
			return decodeURIComponent(cookieString);
		}
	},
	set: (name, value, opts = {}) => {
		if (opts.days) {
			opts["max-age"] = opts.days * 60 * 60 * 24;
			delete opts.days;
		}
		opts = Object.entries(opts).reduce((accumulatedStr, [k, v]) => `${accumulatedStr}; ${k}=${v}`, "");
		document.cookie = name + "=" + encodeURIComponent(value) + opts;
	},
	delete: (name, opts) => Cookie.set(name, "", { "max-age": -1, ...opts })
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