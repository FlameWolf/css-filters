import { createMemo, createSignal, onCleanup, For, Show, createEffect } from "solid-js";
import { disposeUrl, trimFileName } from "./library";
import { filterStore } from "./store/filter-store";
import sceneryImageUrl from "./assets/images/scenery.jpg";
import RangeSlider from "./components/RangeSlider";

function App() {
	const chooseImageText = `<i class="bi bi-upload"></i>`;
	const sceneryFileName = "scenery";
	const [theme, setTheme] = createSignal(localStorage.getItem("theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"));
	const [displayImageText, setDisplayImageText] = createSignal(chooseImageText);
	const [fileName, setFileName] = createSignal(sceneryFileName);
	const [imageUrl, setImageUrl] = createSignal(sceneryImageUrl);
	const [showFilterBadge, setShowFilterBadge] = createSignal(true);
	const [applyFilter, setApplyFilter] = createSignal(true);
	let imagePicker;
	let targetImage;
	let filterBadge;
	let copyBadge;

	const isDark = createMemo(() => theme() === "dark");

	const filterString = createMemo(() => {
		return filterStore.filters
			.filter(filter => filter.enable)
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
		return filter ? `filter: ${filter.replace(filterStore.dropShadowColourRef, getComputedStyle(document.documentElement).getPropertyValue(filterStore.dropShadowColourVar))};` : "";
	};

	createEffect(previousFilter => {
		const currentFilter = filterString();
		if(currentFilter !== previousFilter) {
			setApplyFilter(true);
		}
		return currentFilter;
	});

	createEffect(() => {
		document.body.parentElement.setAttribute("data-bs-theme", isDark() ? "dark" : "light");
		const computedFilter = filterStyle();
		filterBadge.innerHTML = computedFilter;
		if(applyFilter()) {
			targetImage.style = computedFilter;
		}
		localStorage.setItem("theme", theme());
	});

	const updateTheme = () => setTheme(document.forms["theme-toggle"].elements["theme"].value);

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
		setFileName(sceneryFileName);
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
		outputImage.addEventListener("error", () => {
			outputImage = null;
		});
	};

	const copyFilterStyle = () => {
		navigator.clipboard.writeText(filterStyle());
		copyBadge.style.opacity = 1;
		copyBadge.style.zIndex = "unset";
		setTimeout(() => {
			copyBadge.removeAttribute("style");
		}, 1500);
	};

	onCleanup(() => {
		disposeUrl(imageUrl());
		copyBadge = null;
		targetImage = null;
		imagePicker = null;
	});

	return (
		<>
			<div class="row mb-4">
				<h4 class="d-inline-block fw-bold m-0 w-auto">CSS Filter Playground</h4>
				<form class="d-inline-block btn-group btn-group-sm w-auto ms-auto" name="theme-toggle" onInput={updateTheme}>
					<input id="theme-light" type="radio" class="btn-check" name="theme" value="light" checked={!isDark()}/>
					<label class="btn btn-outline-secondary" for="theme-light" title="Light theme">
						<i class="bi" classList={{ "bi-sun-fill": !isDark(), "bi-sun": isDark() }}></i>
					</label>
					<input id="theme-dark" type="radio" class="btn-check" name="theme" value="dark" checked={isDark()}/>
					<label class="btn btn-outline-secondary" for="theme-dark" title="Dark theme">
						<i class="bi" classList={{ "bi-moon-fill": isDark(), "bi-moon": !isDark() }}></i>
					</label>
				</form>
			</div>
			<div class="row">
				<div class="col-xxl-10 col-lg-9 col-md-12 mb-3 mb-lg-0">
					<div class="position-relative">
						<img ref={targetImage} class="w-100" src={imageUrl()} style={applyFilter() ? filterStyle() : ""}/>
						<div class="position-absolute top-0 start-0 w-100">
							<div class="d-flex align-items-center my-2 px-2">
								<input ref={imagePicker} class="d-none" type="file" accept="image/*" onInput={updateImage}/>
								<div class="btn-group btn-group-sm">
									<button class="btn btn-primary btn-outline-light" title="Open" innerHTML={displayImageText()} onClick={() => imagePicker.click()}></button>
									<Show when={displayImageText() !== chooseImageText}>
										<button class="btn btn-danger btn-outline-light" title="Close" onClick={resetImage}>
											<i class="bi bi-x-lg"></i>
										</button>
									</Show>
								</div>
								<Show when={filterString()}>
									<div class="btn-group btn-group-sm ms-1">
										<button class="btn btn-primary btn-outline-light" title="Reset" onClick={filterStore.resetAllFilterValues}>
											<i class="bi bi-arrow-repeat"></i>
										</button>
										<button class="btn btn-primary btn-outline-light" title="Save" onClick={downloadImage}>
											<i class="bi bi-download"></i>
										</button>
									</div>
									<div class="position-relative ms-auto">
										<span ref={copyBadge} class="position-absolute top-0 end-100 badge bg-dark copy-badge fade show me-1">Filter copied to clipboard</span>
										<div class="btn-group btn-group-sm me-1">
											<button class="btn btn-primary btn-outline-light" title="Toggle CSS" classList={{ active: !showFilterBadge() }} onClick={() => setShowFilterBadge(!showFilterBadge())}>
												{() => showFilterBadge() ? <i class="bi bi-code"></i> : <i class="bi bi-code-slash"></i>}
											</button>
											<button class="btn btn-primary btn-outline-light" title="Toggle filter" classList={{ active: !applyFilter() }} onClick={() => setApplyFilter(!applyFilter())}>
												{() => applyFilter() ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
											</button>
										</div>
										<button class="btn btn-primary btn-sm btn-outline-light" title="Copy" onClick={copyFilterStyle}>
											<i class="bi bi-clipboard"></i>
										</button>
									</div>
								</Show>
							</div>
							<Show when={showFilterBadge()}>
								<div class="d-flex justify-content-end px-2">
									<span ref={filterBadge} class="badge bg-dark filter-badge">{filterStyle()}</span>
								</div>
							</Show>
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