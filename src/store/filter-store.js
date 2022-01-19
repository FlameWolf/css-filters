import { createStore } from "solid-js/store";

export const [filterStore, setFilterStore] = createStore({
	filters: [
		{ name: "brightness", min: 0, max: 200, unit: "%" },
		{ name: "contrast", min: 0, max: 200, unit: "%" },
		{ name: "saturate", min: 0, max: 200, unit: "%", text: "Saturation" },
		{ name: "drop-shadow", min: 0, max: 50, default: 0, unit: "px", transform: (input, unit) => `0 0 ${input}${unit} #000000`, text: "Drop Shadow" },
		{ name: "grayscale", min: 0, max: 100, default: 0, unit: "%", text: "Greyscale" },
		{ name: "sepia", min: 0, max: 100, default: 0, unit: "%" },
		{ name: "invert", min: 0, max: 100, default: 0, unit: "%", text: "Inversion" },
		{ name: "opacity", min: 0, max: 100, default: 100, unit: "%" },
		{ name: "hue-rotate", min: 0, max: 360, default: 0, unit: "deg", text: "Hue Rotation" },
		{ name: "blur", min: 0, max: 50, default: 0, unit: "px", text: "Blurriness" }
	],
	filterDisplayText: name => {
		const filter = filterStore.filters.find(filter => filter.name === name);
		return filter.text || `${name[0].toUpperCase()}${name.slice(1)}`;
	},
	updateFilterValue: (name, value) => {
		setFilterStore(
			"filters",
			filter => filter.name === name,
			filter => ({
				value
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