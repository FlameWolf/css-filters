import { filterStore } from "../store/filter-store";

export default props => {
	return (
		<div className="my-1">
			<div className="d-flex">
				<label htmlFor={props.name}>{filterStore.filterDisplayText(props.name)}</label>
				<span className="ms-auto">{filterStore.filterCurrentValue(props.name)}{props.unit}</span>
			</div>
			<div className="d-flex">
				<input
					id={props.name}
					type="range"
					min={props.min}
					max={props.max}
					value={filterStore.filterCurrentValue(props.name)}
					onInput={event => filterStore.updateFilterValue(props.name, event.target.value)}/>
				<button
					className="btn btn-sm btn-secondary ms-2"
					onClick={() => filterStore.resetFilterValue(props.name)}>Reset</button>
			</div>
		</div>
	);
};