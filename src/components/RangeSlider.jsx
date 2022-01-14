import { filterStore } from "../store/filter-store";

export default props => {
	return (
		<div class="my-1">
			<div class="d-flex">
				<label htmlFor={props.name}>{filterStore.filterDisplayText(props.name)}</label>
				<span class="ms-auto">{filterStore.filterCurrentValue(props.name)}{props.unit}</span>
			</div>
			<div class="d-flex">
				<input id={props.name} type="range" min={props.min} max={props.max} value={filterStore.filterCurrentValue(props.name)} onInput={event => filterStore.updateFilterValue(props.name, event.target.value)}/>
				<button class="btn btn-sm btn-secondary ms-2" onClick={() => filterStore.resetFilterValue(props.name)}>Reset</button>
			</div>
		</div>
	);
};