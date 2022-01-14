import { createMemo, For } from "solid-js";
import RangeSlider from "./components/RangeSlider";
import { filterStore } from "./store/filter-store";

function App() {
	const filterString = createMemo(() => {
		return filterStore.filters.reduce((result, filter) => {
			const filterName = filter.name;
			const defaultValue = filterStore.filterDefaultValue(filterName);
			const currentValue = filterStore.filterCurrentValue(filterName);
			const transform = filter.transform || (x => x);
			return defaultValue === currentValue ?
				result :
				`${result}${filterName}: ${transform(currentValue)}; `;
		}, "").trim();
	});

	return (
		<>
			<div class="row">
				<h4 class="mb-4 fw-bold">CSS Filter Playground</h4>
			</div>
			<div class="row">
				<div class="col-10">
					<div class="position-relative">
						<img class="img-fluid" src="/src/assets/images/scenery.jpg" style={filterString()}/>
						<div class="position-absolute top-0 start-0 w-100 mt-4 px-2">
							<div class="d-flex align-items-center mb-2">
								<div class="highlighted">CSS:</div>
								<button class="btn btn-primary border border-white ms-auto" onClick={() => filterStore.resetAllFilterValues()}>Reset Image</button>
							</div>
							<textarea class="form-control" value={filterString()}></textarea>
						</div>
					</div>
				</div>
				<div class="col-2">
					<div class="d-flex flex-column justify-content-end">
						<For each={filterStore.filters}>
						{
							(filter, index) => <RangeSlider {...filter}/>
						}
						</For>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;