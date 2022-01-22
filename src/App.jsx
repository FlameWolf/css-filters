import { createMemo, createSignal, onCleanup, For, Show } from "solid-js";
import { trimFileName } from "./library";
import { filterStore } from "./store/filter-store";
import sceneryImageUrl from "./assets/images/scenery.jpg";
import RangeSlider from "./components/RangeSlider";

function App() {
	const chooseImageText = `<i class="bi bi-folder2-open"></i>`;
	const [displayImageText, setDisplayImageText] = createSignal(chooseImageText);
	const [fileName, setFileName] = createSignal("scenery");
	const [imageUrl, setImageUrl] = createSignal(sceneryImageUrl);
	let imagePicker;
	let targetImage;
	let copyBadge;

	const disposeUrl = url => {
		URL.revokeObjectURL(url);
	};

	const updateImage = () => {
		let files = imagePicker.files;
		if (files.length) {
			let selectedImage = files[0];
			const imageFileName = selectedImage.name;
			let tempImage = new Image();
			let tempSource = URL.createObjectURL(selectedImage);
			tempImage.src = tempSource;
			tempImage.addEventListener("load", event => {
				disposeUrl(imageUrl());
				setImageUrl(tempSource);
				setFileName(imageFileName.indexOf(".") < 0 ? imageFileName : imageFileName.match(/(.*)+\./)[1]);
				setDisplayImageText(trimFileName(imageFileName));
				tempSource = null;
				tempImage = null;
			});
			tempImage.addEventListener("error", event => {
				disposeUrl(tempSource);
				tempImage = null;
			});
			selectedImage = null;
		}
		files = null;
	};

	const resetImage = () => {
		imagePicker.value = "";
		disposeUrl(imageUrl());
		setImageUrl(sceneryImageUrl);
		setDisplayImageText(chooseImageText);
	};

	const downloadImage = () => {
		let outputImage = new Image();
		outputImage.src = imageUrl();
		outputImage.addEventListener("load", event => {
			let outputCanvas = document.createElement("canvas");
			let outputContext = outputCanvas.getContext("2d");
			let downloadLink = document.createElement("a");
			let downloadLinkStyle = downloadLink.style;
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
				downloadLinkStyle = null;
				downloadLink = null;
			});
			outputContext = null;
			outputCanvas = null;
			outputImage = null;
		});
		outputImage.addEventListener("error", event => {
			outputImage = null;
		});
	};

	const copyFilterStyle = () => {
		navigator.clipboard.writeText(filterStyle());
		copyBadge.style.opacity = 1;
		setTimeout(() => {
			copyBadge.style.opacity = 0;
		}, 1500);
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
		return filter ? `filter: ${filter};` : "";
	};

	onCleanup(() => {
		disposeUrl(imageUrl());
		copyBadge = null;
		targetImage = null;
		imagePicker = null;
	});

	return (
		<>
			<div class="row">
				<h4 class="mb-4 fw-bold">CSS Filter Playground</h4>
			</div>
			<div class="row">
				<div class="col-xxl-10 col-lg-9 col-md-12 mb-3 mb-lg-0">
					<div class="position-relative">
						<img ref={targetImage} class="w-100" src={imageUrl()} style={filterStyle()}/>
						<div class="position-absolute top-0 start-0 w-100 mt-2 px-2">
							<div class="d-flex align-items-center mb-2">
								<div class="highlighted">CSS:</div>
								<input ref={imagePicker} class="d-none" type="file" accept="image/*" onInput={updateImage}/>
								<div class="btn-group rounded ms-auto">
									<button class="btn btn-primary btn-outline-light" innerHTML={displayImageText()} onClick={() => imagePicker.click()}></button>
									<Show when={displayImageText() !== chooseImageText}>
										<button class="btn btn-danger btn-outline-light" onClick={resetImage}>
											<i class="bi bi-x-lg"></i>
										</button>
									</Show>
								</div>
								<Show when={filterString()}>
									<div class="btn-group bg-secondary rounded ms-2">
										<button class="btn btn-outline-light" onClick={filterStore.resetAllFilterValues}>
											<i class="bi bi-arrow-repeat"></i>
										</button>
										<button class="btn btn-outline-light" onClick={downloadImage}>
											<i class="bi bi-download"></i>
										</button>
									</div>
								</Show>
							</div>
							<div class="position-relative">
								<div class="position-absolute top-0 start-0">
									<span class="badge bg-dark">{filterStyle()}</span>
								</div>
								<div class="position-absolute top-0 end-0">
									<span ref={copyBadge} class="badge bg-dark me-2 copy-badge fade show">Filter copied to clipboard</span>
									<Show when={filterString()}>
										<button class="btn btn-primary btn-outline-light" onClick={copyFilterStyle}>
											<i class="bi bi-clipboard"></i>
										</button>
									</Show>
								</div>
							</div>
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