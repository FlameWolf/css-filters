import { createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { trimFileName } from "./library";
import { filterStore } from "./store/filter-store";
import sceneryImageUrl from "./assets/images/scenery.jpg";
import RangeSlider from "./components/RangeSlider";

function App() {
	const chooseImageText = "Choose Image";
	const [displayImageText, setDisplayImageText] = createSignal(chooseImageText);
	const [fileName, setFileName] = createSignal("scenery");
	const [imageUrl, setImageUrl] = createSignal(sceneryImageUrl);
	let imagePicker;
	let targetImage;

	const disposeUrl = url => {
		URL.revokeObjectURL(url);
	};

	const updateImage = () => {
		const files = imagePicker.files;
		if (files.length) {
			const selectedImage = files[0];
			const imageFileName = selectedImage.name;
			console.log(selectedImage);
			disposeUrl(imageUrl());
			setImageUrl(URL.createObjectURL(selectedImage));
			setFileName(imageFileName.indexOf(".") < 0 ? imageFileName : imageFileName.match(/(.*)+\./)[1]);
			setDisplayImageText(trimFileName(imageFileName));
		}
	};

	const resetImage = () => {
		imagePicker.value = "";
		disposeUrl(imageUrl());
		setImageUrl(sceneryImageUrl);
		setDisplayImageText(chooseImageText);
	};

	const downloadImage = () => {
		const outputImage = new Image();
		outputImage.src = imageUrl();
		outputImage.addEventListener("load", event => {
			const outputCanvas = document.createElement("canvas");
			const outputContext = outputCanvas.getContext("2d");
			const downloadLink = document.createElement("a");
			const downloadLinkStyle = downloadLink.style;
			outputCanvas.width = outputImage.naturalWidth;
			outputCanvas.height = outputImage.naturalHeight;
			outputContext.filter = filterString();
			outputContext.drawImage(outputImage, 0, 0);
			downloadLink.href = outputCanvas.toDataURL("image/png");
			downloadLink.download = `${fileName()}-filtered.png`;
			downloadLinkStyle.display = "none";
			downloadLinkStyle.visibility = "hidden";
			downloadLinkStyle.opacity = 0;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			setTimeout(function () {
				document.body.removeChild(downloadLink);
			});
		});
	};

	const filterString = createMemo(() => {
		return filterStore.filters
			.reduce((result, filter) => {
				const filterName = filter.name;
				const defaultValue = filterStore.filterDefaultValue(filterName);
				const currentValue = filterStore.filterCurrentValue(filterName);
				const unit = filter.unit;
				const transform = filter.transform;
				return defaultValue === currentValue ? result : `${result}${filterName}(${transform?.(currentValue, unit) || `${currentValue}${unit}`}) `;
			}, "")
			.trim();
	});

	const filterStyle = () => {
		const filter = filterString();
		return filter ? `filter: ${filter}` : "";
	};

	onCleanup(() => {
		disposeUrl(imageUrl());
	});

	return (
		<>
			<div class="row">
				<h4 class="mb-4 fw-bold">CSS Filter Playground</h4>
			</div>
			<div class="row">
				<div class="col-xxl-10 col-lg-9 col-md-12 mb-3 mb-lg-0">
					<div class="position-relative">
						<img ref={targetImage} class="w-100" src={imageUrl()} onError={resetImage} style={filterStyle()}/>
						<div class="position-absolute top-0 start-0 w-100 mt-4 px-2">
							<div class="d-flex align-items-center mb-2">
								<div class="highlighted">CSS:</div>
								<input ref={imagePicker} class="d-none" type="file" accept="image/*" onInput={updateImage}/>
								<div class="btn-group border border-white rounded ms-auto">
									<button class="btn btn-primary" onClick={() => imagePicker.click()}>{displayImageText()}</button>
									<Show when={displayImageText() !== chooseImageText}>
										<button class="btn btn-danger" onClick={resetImage}>
											<i class="bi bi-x-lg"></i>
										</button>
									</Show>
								</div>
								<div class="btn-group bg-secondary ms-2">
									<button class="btn btn-outline-light" onClick={filterStore.resetAllFilterValues}>
										<i class="bi bi-arrow-repeat"></i>
									</button>
									<button class="btn btn-outline-light" onClick={downloadImage}>
										<i class="bi bi-download"></i>
									</button>
								</div>
							</div>
							<textarea class="form-control" value={filterStyle()}></textarea>
						</div>
					</div>
				</div>
				<div class="col-xxl-2 col-lg-3 col-md-12">
					<div class="row">
						<For each={filterStore.filters}>{(filter, index) => <RangeSlider {...filter}/>}</For>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;