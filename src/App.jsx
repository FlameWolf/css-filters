import { createMemo, For } from "solid-js";
import sceneryImageUrl from "./assets/images/scenery.jpg";
import RangeSlider from "./components/RangeSlider";
import { trimFileName } from "./library";
import { filterStore } from "./store/filter-store";

function App() {
	let imagePicker;
	let imagePickerDummy;
	let targetImage;
	const chooseImageText = "Choose Image";

	const updateImage = function() {
		const files = imagePicker.files;
		if(files.length) {
			const selectedImage = files[0];
			targetImage.src = URL.createObjectURL(selectedImage);
			imagePickerDummy.textContent = trimFileName(selectedImage.name);
		} else {
			targetImage.src = sceneryImageUrl;
			imagePickerDummy.textContent = chooseImageText;
		}
	};

	const filterString = createMemo(() => {
		const filterString = filterStore.filters
			.reduce((result, filter) => {
				const filterName = filter.name;
				const defaultValue = filterStore.filterDefaultValue(filterName);
				const currentValue = filterStore.filterCurrentValue(filterName);
				const unit = filter.unit;
				const transform = filter.transform;
				return defaultValue === currentValue ? result : `${result}${filterName}(${transform?.(currentValue, unit) || `${currentValue}${unit}`}) `;
			}, "")
			.trim();
		return filterString ? `filter: ${filterString};` : "";
	});

	return (
		<>
			<div class="row">
				<h4 class="mb-4 fw-bold">CSS Filter Playground</h4>
			</div>
			<div class="row">
				<div class="col">
					<div class="position-relative">
						<img ref={targetImage} class="w-100" src={sceneryImageUrl} style={filterString()}/>
						<div class="position-absolute top-0 start-0 w-100 mt-4 px-2">
							<div class="d-flex align-items-center mb-2">
								<div class="highlighted">CSS:</div>
								<input ref={imagePicker} class="d-none" type="file" accept="image/*" onInput={() => updateImage()}/>
								<button ref={imagePickerDummy} class="btn btn-primary border border-white ms-auto" onClick={() => imagePicker.click()}>{chooseImageText}</button>
								<button class="btn btn-secondary border border-white ms-2" onClick={() => filterStore.resetAllFilterValues()}>Reset Filters</button>
							</div>
							<textarea class="form-control" value={filterString()}></textarea>
						</div>
					</div>
				</div>
				<div class="col-2">
					<div class="d-flex flex-column justify-content-end">
						<For each={filterStore.filters}>{(filter, index) => <RangeSlider {...filter}/>}</For>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;