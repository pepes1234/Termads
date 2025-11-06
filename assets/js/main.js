// Basic typing support for the Termo-like grid and on-screen keyboard
// Contract
// - Inputs: physical keyboard (letters A-Z, Backspace, Enter) and clicks on .key[data-key]
// - Effects: fills the current row's boxes with letters, deletes with backspace, moves to next row on enter (when full)
// - Scope: works with rows .line-1 .. .line-6, each with 5 letter boxes as direct children

(function () {
	const TOTAL_ROWS = 6;
	const COLS = 5;

	// Build arrays of row elements and their tiles
	function getRowEls() {
		const els = [];
		for (let r = 1; r <= TOTAL_ROWS; r++) {
			const rowEl = document.querySelector(`.line-${r}`);
			if (rowEl) els.push(rowEl);
		}
		return els;
	}

	const rowEls = getRowEls();
	const rows = rowEls.map((rowEl) => Array.from(rowEl.children).slice(0, COLS));

	function isTileEmpty(tile) {
		return tile && tile.textContent.trim() === "";
	}

	function rowFilled(rowTiles) {
		return rowTiles.every((t) => !isTileEmpty(t));
	}

	function firstEmptyIndex(rowTiles) {
		return rowTiles.findIndex((t) => isTileEmpty(t));
	}

	function lastFilledIndex(rowTiles) {
		for (let c = COLS - 1; c >= 0; c--) {
			if (!isTileEmpty(rowTiles[c])) return c;
		}
		return -1;
	}

	function findCurrentRowIndex() {
		// current row is the first row that is not completely filled
		for (let r = 0; r < rows.length; r++) {
			if (!rowFilled(rows[r])) return r;
		}
		// if all are filled, stay on the last one
		return rows.length - 1;
	}

	let currentRow = findCurrentRowIndex();

	function updateRowStates() {
		for (let r = 0; r < rowEls.length; r++) {
			const el = rowEls[r];
			el.classList.remove("row-active", "row-inactive", "row-used");
			if (r < currentRow) {
				// previous rows considered used/locked
				el.classList.add("row-used");
			} else if (r === currentRow) {
				el.classList.add("row-active");
			} else {
				el.classList.add("row-inactive");
			}
		}
	}

	function setTile(rowIdx, colIdx, char) {
		const tile = rows[rowIdx]?.[colIdx];
		if (!tile) return;
		tile.textContent = char.toUpperCase();
		tile.classList.remove("incorrect", "wrong-position", "correct");
		tile.classList.add("typed");
		setTimeout(() => tile.classList.remove("typed"), 120);
	}

	function clearTile(rowIdx, colIdx) {
		const tile = rows[rowIdx]?.[colIdx];
		if (!tile) return;
		tile.textContent = "";
		tile.classList.remove("typed");
	}

	function handleLetter(letter) {
		// Only allow typing in the current row
		const rowTiles = rows[currentRow];
		if (!rowTiles) return;
		if (rowFilled(rowTiles)) return; // ignore if full
		const col = firstEmptyIndex(rowTiles);
		if (col === -1) return;
		setTile(currentRow, col, letter);
	}

	function handleBackspace() {
		const rowTiles = rows[currentRow];
		if (!rowTiles) return;
		const col = lastFilledIndex(rowTiles);
		if (col === -1) return; // nothing to delete
		clearTile(currentRow, col);
	}

	function handleEnter() {
		// If current row is full, advance to the next row (if available)
		const rowTiles = rows[currentRow];
		if (rowTiles && rowFilled(rowTiles) && currentRow < rows.length - 1) {
			currentRow += 1;
			updateRowStates();
		}
	}

	function isLetterKey(k) {
		return /^[a-zA-Z]$/.test(k);
	}

	// Physical keyboard
	window.addEventListener("keydown", (ev) => {
		const k = ev.key;
		if (isLetterKey(k)) {
			handleLetter(k);
			return;
		}
		if (k === "Backspace") {
			ev.preventDefault();
			handleBackspace();
			return;
		}
		if (k === "Enter") {
			handleEnter();
			return;
		}
	});

	// On-screen keyboard
	function handleKeyAction(dataKey) {
		if (!dataKey) return;
		const key = String(dataKey).toLowerCase();
		if (key === "enter") return handleEnter();
		if (key === "backspace") return handleBackspace();
		if (/^[a-z]$/.test(key)) return handleLetter(key);
	}

	document.addEventListener("click", (e) => {
		const btn = e.target.closest(".key[data-key]");
		if (!btn) return;
		const dataKey = btn.getAttribute("data-key");
		handleKeyAction(dataKey);
	});

	// Optional: clicking a tile only works in the active row (no row switching)
	rows.forEach((tiles, rIdx) => {
		tiles.forEach((tile) => {
			tile.addEventListener("click", () => {
				if (rIdx !== currentRow) return; // do nothing for inactive/used rows
				// no-op for now; could place a caret/visual state
			});
		});
	});

	// Initial state
	updateRowStates();
})();

