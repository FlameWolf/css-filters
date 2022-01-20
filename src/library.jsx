export const trimFileName = function (fileName) {
	if(fileName.length <= 12) {
		return fileName;
	}
	const lastPeriodIndex = fileName.lastIndexOf(".");
	if (lastPeriodIndex < 0 || fileName.length - lastPeriodIndex > 5) {
		return `${fileName.substr(0, 4)}${String.fromCharCode(0x2026)}${fileName.substr(-4)}`;
	}
	return `${fileName.substr(0, 3)}${String.fromCharCode(0x2026)}${fileName.substr(lastPeriodIndex - 3)}`;
};