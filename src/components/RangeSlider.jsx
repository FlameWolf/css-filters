import { filterStore } from "../store/filter-store";

export default props => {
	let rangeInput;

	const updateFilterValue = value => {
		if(value < props.min || value > props.max) {
			return;
		}
		filterStore.updateFilterValue(props.name, value);
	};

	const decrementFilterValue = () => updateFilterValue(parseFloat(rangeInput.value) - 1);
	const incrementFilterValue = () => updateFilterValue(parseFloat(rangeInput.value) + 1);

	return (
		<div class="my-1 col-sm-6 col-md-4 col-lg-12">
			<div class="d-flex">
				<label htmlFor={props.name}>{filterStore.filterDisplayText(props.name)}</label>
				<span class="ms-auto">{filterStore.filterCurrentValue(props.name)}{props.unit}</span>
			</div>
			<div class="d-flex align-items-center">
				<button class="btn btn-lg p-0 border-0" classList={{ disabled: filterStore.filterCurrentValue(props.name) === props.min }} onPress={decrementFilterValue} onClick={decrementFilterValue}>
					<i class="bi bi-dash-circle"></i>
				</button>
				<input ref={rangeInput} id={props.name} class="form-range px-1" type="range" min={props.min} max={props.max} value={filterStore.filterCurrentValue(props.name)} onInput={() => updateFilterValue(parseFloat(rangeInput.value))}/>
				<button class="btn btn-lg p-0 border-0" classList={{ disabled: filterStore.filterCurrentValue(props.name) === props.max }} onPress={incrementFilterValue} onClick={incrementFilterValue}>
					<i class="bi bi-plus-circle"></i>
				</button>
				<button class="btn btn-sm btn-secondary ms-2" onClick={() => filterStore.resetFilterValue(props.name)}>Reset</button>
			</div>
		</div>
	);
};