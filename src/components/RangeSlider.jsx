import { filterStore } from "../store/filter-store";

export default props => {
	let rangeInput;
	const filterName = props.name;
	const displayText = filterStore.filterDisplayText(filterName);

	const decrementFilterValue = () => updateFilterValue(parseFloat(rangeInput.value) - 1);

	const incrementFilterValue = () => updateFilterValue(parseFloat(rangeInput.value) + 1);

	const updateFilterValue = value => {
		if(value < props.min || value > props.max) {
			return;
		}
		filterStore.updateFilterValue(filterName, value);
	};

	return (
		<div class="my-1 col-sm-6 col-md-4 col-lg-12">
			<div class="d-flex">
				<input class="form-check-input mx-1" type="checkbox" title={`Toggle ${displayText.toLowerCase()}`} checked={filterStore.filterEnabled(filterName)} onInput={() => filterStore.toggleFilter(filterName)}/>
				<label class="ms-1" htmlFor={filterName}>{displayText}</label>
				<span class="ms-auto">{filterStore.filterCurrentValue(filterName)}{props.unit}</span>
			</div>
			<div class="d-flex align-items-center">
				<button class="btn btn-lg text-primary py-0 px-1 border-0" title={`Decrease ${displayText.toLowerCase()}`} classList={{ disabled: filterStore.filterCurrentValue(filterName) === props.min }} onPress={decrementFilterValue} onClick={decrementFilterValue}>
					<i class="bi bi-dash-circle"></i>
				</button>
				<input ref={rangeInput} id={filterName} class="form-range px-1" type="range" min={props.min} max={props.max} value={filterStore.filterCurrentValue(filterName)} title={displayText} onInput={() => updateFilterValue(parseFloat(rangeInput.value))}/>
				<button class="btn btn-lg text-primary py-0 px-1 border-0" title={`Increase ${displayText.toLowerCase()}`} classList={{ disabled: filterStore.filterCurrentValue(filterName) === props.max }} onPress={incrementFilterValue} onClick={incrementFilterValue}>
					<i class="bi bi-plus-circle"></i>
				</button>
				<button class="btn btn-lg text-danger py-0 px-1 border-0 ms-2" title={`Reset ${displayText.toLowerCase()}`} classList={{ disabled: filterStore.filterCurrentValue(filterName) === filterStore.filterDefaultValue(filterName) }} onClick={() => filterStore.resetFilterValue(filterName)}>
					<i class="bi bi-x-circle-fill"></i>
				</button>
			</div>
		</div>
	);
};