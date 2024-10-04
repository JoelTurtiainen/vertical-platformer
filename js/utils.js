Array.prototype.parse2D = function () {
	const rows = [];
	for (let i = 0; i < this.length; i += 16) {
		rows.push(this.slice(i, i + 16));
	}

	return rows;
};

Array.prototype.createObjectsFrom2D = function () {
	const objects = [];
	this.forEach((row, y) => {
		row.forEach((symbol, x) => {
			switch (symbol) {
				case 1: // Normal Block
					objects.push(
						new CollisionBlock({
							position: {
								x: x * 64,
								y: y * 64,
							},
						})
					);
					break;
				case 2: // Pickup
					objects.push(
						new CollectableBlock({
							position: {
								x: x * 64,
								y: y * 64,
							},
						})
					);
					break;
				case 3: // Trap Block
					objects.push(
						new TrapBlock({
							position: {
								x: x * 64,
								y: y * 64,
							},
						})
					);
					break;
				case 4: // Half Block
					objects.push(
						new CollisionBlock({
							position: {
								x: x * 64,
								y: y * 64,
							},
							height: 32,
						})
					);
					break;
			}
		});
	});

	return objects;
};

Array.prototype.createEntityArrayFromObject = function () {
	const objects = {
		collectable: [],
		solid: [],
	};
	this.forEach((entity) => {
		const name = entity.template.split('.')[0];
		const config = {
			position: { x: entity.x, y: entity.y },
			...entityDat[name],
		};

		switch (config.type) {
			case 'collectable':
				objects[config.type].push(new Coin(config));
				break;
			case 'solid':
				objects[config.type].push(new Crate(config));
				break;
		}
	});
	return objects;
};
