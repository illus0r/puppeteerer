#!/usr/bin/env node

const puppeteer = require('puppeteer');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const yargs = require('yargs');

const argv = yargs
  .option('maxsize', {
    describe: 'Maximum collage size',
    type: 'number',
    default: 4000,
  })
  .option('timeout', {
    describe: 'Page wait timeout',
    type: 'number',
    default: 100,
  })
  .help()
  .alias('help', 'h')
  .usage('Usage: $0 <url> [width [height [cols [rows]]]] [--maxsize] [--timeout]')
  .example('$0 http://127.0.0.1:8080', 'Render a collage with default parameters')
  .example('$0 http://127.0.0.1:8080 800 600 5 4 --maxsize=5000 --timeout=200', 'Render a collage with custom parameters')
  .demandCommand(1, 'You must provide at least one argument for the URL.')
  .argv;

(async () => {
  const args = argv._;
  const url = args[0];
  const width = parseInt(args[1]) || 512;
  const height = parseInt(args[2]) || width;
  const cols = parseInt(args[3]) || 4;
  const rows = parseInt(args[4]) || 4;

  const browser = await puppeteer.launch({ headless: false });
  let rndStr = Math.random().toString(36).substring(2, 15);
	let dir = process.cwd() + `/${rndStr}`;
  let size = [width, height];
  let num = cols * rows;
  let maxCollageSize = argv.maxsize;
  let collageScale = Math.min(maxCollageSize / (cols * size[0]), maxCollageSize / (rows * size[1]));
  let miniatureWidth = size[0] * collageScale;
  let miniatureHeight = size[1] * collageScale;

  fs.mkdirSync(dir);

  let screenshots = [];
  const page = await browser.newPage();
  await page.setViewport({ width: size[0], height: size[1] });
  for (let i = 0; i < num; i++) {
    console.log(i);
    await page.goto(url);
    await page.waitForTimeout(argv.timeout);
    let screenshot = await page.screenshot({ path: `${dir}/${i}.png` });
    screenshots.push(screenshot);
  }
  await page.close();
  await browser.close();

  async function createCollage(screenshots) {
    const canvas = createCanvas(miniatureWidth * cols, miniatureHeight * rows);
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

  await createCollage(screenshots);
})();
