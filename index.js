const puppeteer = require('puppeteer');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	let rndStr = Math.random().toString(36).substring(2, 15);
	let dir = `/Users/ivandianov/Downloads/${rndStr}`
	let size = [1024, 1657]
	let num = 128
	let cols = Math.floor(Math.sqrt(num))
	let rows = Math.ceil(num / cols)
	let maxCollageSize = 4000
	let collageScale = Math.min(maxCollageSize / (cols * size[0]), maxCollageSize / (rows * size[1]))
	let miniatureWidth = size[0] * collageScale
	let miniatureHeight = size[1] * collageScale
	const url = `http://127.0.0.1:8080`;
	fs.mkdirSync(dir);

	let screenshots = []
	const page = await browser.newPage();
	await page.setViewport({ width: size[0], height: size[1] });
  for (let i=0; i<num; i++) {
		console.log(i)
    await page.goto(url);
    await page.waitForTimeout(100);
    let screenshot = await page.screenshot({ path: `${dir}/${i}.png` });
		screenshots.push(screenshot)
  }
	await page.close();
  await browser.close();

	async function createCollage(screenshots) {


		const canvas = createCanvas(miniatureWidth*cols, miniatureHeight*rows);
		const ctx = canvas.getContext('2d');

		let row = 0;
		let col = 0;
		for (const screenshot of screenshots) {
			const img = await loadImage(screenshot);
			ctx.drawImage(img, col * miniatureWidth, row * miniatureHeight, miniatureWidth, miniatureHeight);

			col++;
			if (col === cols) {
				col = 0;
				row++;
			}
		}
		const collageBuffer = canvas.toBuffer('image/png');
		fs.writeFileSync(`${dir}/collage.png`, collageBuffer);
	}

	await createCollage(screenshots)

})();

