import { createStore } from "solid-js/store";

export const [filterStore, setFilterStore] = createStore({
	filters: [
		{ name: "brightness", min: 0, max: 200, unit: "%", enable: true },
		{ name: "contrast", min: 0, max: 200, unit: "%", enable: true },
		{ name: "saturate", min: 0, max: 200, unit: "%", text: "Saturation", enable: true },
		{ name: "drop-shadow", min: 0, max: 50, default: 0, unit: "px", transform: (input, unit) => `0 0 ${input}${unit} #000000`, text: "Drop Shadow", enable: true },
		{ name: "grayscale", min: 0, max: 100, default: 0, unit: "%", text: "Greyscale", enable: true },
		{ name: "sepia", min: 0, max: 100, default: 0, unit: "%", enable: true },
		{ name: "invert", min: 0, max: 100, default: 0, unit: "%", text: "Inversion", enable: true },
		{ name: "opacity", min: 0, max: 100, default: 100, unit: "%", enable: true },
		{ name: "hue-rotate", min: 0, max: 360, default: 0, unit: "deg", text: "Hue Rotation", enable: true },
		{ name: "blur", min: 0, max: 50, default: 0, unit: "px", text: "Blurriness", enable: true }
	],
	filterEnabled: name => filterStore.filters.find(filter => filter.name === name).enable,
	toggleFilter: name => {
		setFilterStore(
			"filters",
			filter => filter.name === name,
			filter => ({
				enable: !filter.enable
			})
		);
	},
	filterDisplayText: name => {
		const filter = filterStore.filters.find(filter => filter.name === name);
		return filter.text || `${name[0].toUpperCase()}${name.slice(1)}`;
	},
	updateFilterValue: (name, value) => {
		setFilterStore(
			"filters",
			filter => filter.name === name,
			filter => ({
				value,
				enable: true
			})
		);
	},
	filterDefaultValue: name => {
		const filter = filterStore.filters.find(filter => filter.name === name);
		return filter.default !== undefined ?
			filter.default :
			filter.max < filter.min ?
				filter.min :
				filter.min + ((filter.max - filter.min) / 2);
	},
	filterCurrentValue: name => {
		const filter = filterStore.filters.find(filter => filter.name === name);
		return filter.value !== undefined ? +filter.value : filterStore.filterDefaultValue(name);
	},
	resetFilterValue: name => {
		setFilterStore(
			"filters",
			filter => filter.name === name,
			filter => ({
				value: undefined
			})
		);
	},
	resetAllFilterValues: () => {
		setFilterStore("filters", {}, filter => ({
			value: undefined
		}));
	}
});