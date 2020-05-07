import './index.styl'


class ClipboardWriter {
	static writeTexts (texts) {
		const text = texts.join('\t');

		return new Promise(function(resolve, reject) {
			var success = false;
			function listener(e) {
				e.clipboardData.setData("text/plain", text);
				e.preventDefault();
				success = true;
			}
			document.addEventListener("copy", listener);
			document.execCommand("copy");
			document.removeEventListener("copy", listener);
			success ? resolve(): reject();
		});
	};
}


class Scraper {
	constructor() {
		this.results = [];
	}

	scrap() {
		this.results = [];

		this.results.push(this._scrapTitleAndUrl());
		this.results.push(this._scrapOriginPrice());
		this.results.push(this._scrapBestOff());
		this.results.push(this._scrapPublicDate());
		this.results.push(this._scrapScore());
		this.results.push(this._scrapCurrentDate());

		return this.results;
	}

	_scrapTitleAndUrl() {
		let title = document.querySelector('.apphub_AppName')?.innerText;

		let url = document.querySelector('.blockbg>a:last-child')?.baseURI;
		url = url.replace(/(.*?app\/\d+\/).*/, '$1');

		return `=HYPERLINK("${url}","${title}")`;
	}

	_scrapOriginPrice() {
		let price = document.querySelector('.game_purchase_action .discount_original_price,.game_purchase_price')?.innerText;

		var pattern = /.*?(\d+).*/;
		return price.replace(pattern, '$1');
	}

	_scrapBestOff() {
		let bestOff = document.body.querySelector('.steamdb_prices a').innerText;

		var pattern = /.*at.-(\d+)%.*/;
		return bestOff.replace(pattern, '$1');
	}

	_scrapPublicDate() {
		let date = document.querySelector('.release_date .date')?.innerText;

		var pattern = /(\d{4}).*?(\d{1,2}).*?(\d{1,2}).*/;
		return date.replace(pattern, '$1/$2/$3');
	}

	_scrapScore() {
		// There are 30-days(maybe) and all-days, we want the second one
		let scores = document.querySelectorAll('.nonresponsive_hidden.responsive_reviewdesc');
		let score = scores[scores.length - 1]?.innerText;

		var pattern = /.*?(\d+)%.*/s;
		return score.replace(pattern, '$1');
	}

	_scrapCurrentDate() {
		return new Date().toLocaleDateString();
	}
}

let timeToWait = 2000;
console.log(`Wait ${timeToWait/1000} second(s) for steamdb loading (for best off)`);
setTimeout(() => {
  console.log('Start to scrap steam info ...');
  let infos = new Scraper().scrap();

  console.log('Scraped info:', infos);
  ClipboardWriter.writeTexts(infos);
}, timeToWait);
