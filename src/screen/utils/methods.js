function* splitNParts(num, parts) {
	let sumParts = 0;
	for (let i = 0; i < parts - 1; i++) {
		const pn = Math.fround(Math.random() * (num - sumParts));
		yield pn;
		sumParts += pn;
	}
	yield num - sumParts;
}

export const getFSMovieRating = (itemX) => {
	const fsRating = itemX.fs_rating;
	const tempFSRating = {};
	if (fsRating && fsRating.total_votes > 10) {
		const totalVotes = fsRating.total_votes;
		Object.keys(fsRating).map((key) => {
			const value = fsRating[key];
			const percent = value * 100 / totalVotes;
			tempFSRating[key] = percent;
		});
	} else {
		const movieDetails = itemX;
		var totalSumOfRating = 0;
		var count = 0;
		movieDetails.ratings &&
			movieDetails.ratings.map((item) => {
				const name = item.source;
				var rating = null;
				if (name === 'Rotten Tomatoes') {
					rating = item.value.slice(0, 2);
				} else if (name === 'Internet Movie Database') {
					if (item.value.indexOf('.') > -1) {
						rating = Number(item.value.slice(0, 3)) * 10;
					} else {
						rating = Number(item.value.slice(0, 1)) * 10;
					}
				} else if (name === 'Metacritic') {
					rating = item.value.slice(0, 2);
				}

				totalSumOfRating = totalSumOfRating + Number(rating);
				count = count + 1;
				// console.log(name, item.value);
			});
		// console.log('sum1', totalSumOfRating);
		// console.log('count1', count);
		if (movieDetails.tmdb_rating) {
			totalSumOfRating = totalSumOfRating + Number(movieDetails.tmdb_rating);
			count = count + 1;
		}
		// console.log('sum2', totalSumOfRating);
		// console.log('count2', count);
		if (movieDetails.imdb_rating) {
			totalSumOfRating = totalSumOfRating + Number(movieDetails.imdb_rating);
			count = count + 1;
		}
		// console.log('sum3', totalSumOfRating);
		// console.log('count3', count);
		const avg = totalSumOfRating / count;
		tempFSRating['loved_it'] = parseInt(avg);
		const remaining = 100 - avg;
		const x = splitNParts(remaining, 3);
		const arrX = [ ...x ];
		if (avg < 50) {
			const b = arrX.sort();
			// console.log(JSON.stringify(b));
			tempFSRating['dumb_but_entertaining'] = parseInt(b[0]);
			tempFSRating['just_time_pass'] = parseInt(b[1]);
			tempFSRating['worthless'] = parseInt(b[2]);
			// console.log(JSON.stringify(tempFSRating));
		} else {
			tempFSRating['dumb_but_entertaining'] = parseInt(arrX[0]);
			tempFSRating['just_time_pass'] = parseInt(arrX[1]);
			tempFSRating['worthless'] = parseInt(arrX[2]);
			// console.log(JSON.stringify(tempFSRating));
		}
		// console.log('tempFSRating', JSON.stringify(tempFSRating));
		return tempFSRating || {};
	}
};
