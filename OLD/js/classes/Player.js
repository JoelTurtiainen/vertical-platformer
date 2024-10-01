class Player extends Sprite {
	constructor({ position, collisionBlocks, platformCollisionBlocks, pickupCollisionBlocks, startEndCollisionBlocks, character }) {
		super({ imageSrc: character.imageSrc, frameRate: character.frameRate, scale: character.scale });
		this.position = Object.create(position);
		this.spawnPoint = Object.create(position);
		this.character = character;
		this.frameBuffer = this.character.frameBuffer;
		this.velocity = {
			x: 0,
			y: 1,
		};
		this.collisionBlocks = collisionBlocks;
		this.platformCollisionBlocks = platformCollisionBlocks;
		this.pickupCollisionBlocks = pickupCollisionBlocks;
		this.startEndCollisionBlocks = startEndCollisionBlocks
		this.hitbox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 10,
			height: 10,
		};

		this.animations = this.loadAnimations(this.character.animations);
		this.lastDirection = 'right';

		this.camerabox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		};

		this.stats = {
			health: 100,
			coins: 0,
			inventory: {},
		};
	}

	teleport({ position }) {
		this.position = Object.create(position);
	}

	getPosition() {
		return { x: player.hitbox.position.x + player.hitbox.width / 2, y: player.hitbox.position.y + player.hitbox.height };
	}

	loadAnimations(animations) {
		for (let key in animations) {
			const image = new Image();
			image.src = animations[key].imageSrc;

			animations[key].image = image;
		}
		return animations;
	}

	async switchCharacter(character) {
		// Store the current position & Image Size
		const currentPosition = { x: this.position.x, y: this.position.y };
		const hitboxYBottom = this.hitbox.position.y + this.hitbox.height;
		const currentImageSize = { width: this.width, height: this.height };

		// Load Animations
		this.animations = this.loadAnimations(character.animations);

		// Switch character
		this.currentFrame = 0;
		this.character = character;
		const lastDir = this.lastDirection === 'left' ? 'IdleLeft' : 'Idle';
		await this.updateImgSource({ imageSrc: this.animations[lastDir].imageSrc, scale: this.character.scale, frameRate: this.character.frameRate, frameBuffer: this.character.frameBuffer });

		// Get new image size and calculate offset
		const offsetX = (currentImageSize.width - this.width) / 2;

		// Calculate the new Y position relative to the hitbox's bottom
		const newYPosition = hitboxYBottom - this.character.hitbox.height;

		// Reapply the stored position with the offset
		this.position = { x: currentPosition.x + offsetX, y: newYPosition - this.character.hitbox.y };
	}

	switchSprite(key) {
		if (this.image === this.animations[key].image || !this.loaded) return;

		this.currentFrame = 0;
		this.image = this.animations[key].image;
		this.frameBuffer = this.animations[key].frameBuffer;
		this.frameRate = this.animations[key].frameRate;
	}

	updateCameraBox() {
		this.camerabox = {
			position: {
				x: this.position.x - 50,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		};
	}

	checkForHorizontalCanvasCollision() {
		if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 || this.hitbox.position.x + this.velocity.x <= 0) {
			this.velocity.x = 0;
		}
	}

	shouldPanCameraToTheLeft({ canvas, camera }) {
		const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
		const scaledDownCanvasWidth = canvas.width / 4;

		if (cameraboxRightSide >= 576) return;
		if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	shouldPanCameraToTheRight({ canvas, camera }) {
		if (this.camerabox.position.x <= 0) return;

		if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	shouldPanCameraDown({ canvas, camera }) {
		if (this.camerabox.position.y + this.velocity.y <= 0) return;

		if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
			camera.position.y -= this.velocity.y;
		}
	}

	shouldPanCameraUp({ canvas, camera }) {
		if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 432) return;

		const scaledCanvasHeight = canvas.height / 4;

		if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaledCanvasHeight) {
			camera.position.y -= this.velocity.y;
		}
	}

	update() {
		this.updateFrames();
		this.updateCameraBox();

		// Visualize camera bounding box
		// c.strokeStyle = 'rgba(255, 255, 255, 0.2)';
		// c.strokeRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height);

		// Visualize image bounding box
		c.fillStyle = 'rgba(0, 255, 0, 0.1)';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		// Visualize hitbox bounding box
		c.fillStyle = 'rgba(255, 0, 0, 0.2)';
		c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

		this.draw();

		this.position.x += this.velocity.x;
		this.updateHitbox();
		this.checkForHorizontalCollisions();
		this.applyGravity();
		this.updateHitbox();
		this.checkForVerticalCollisions();
		this.checkForStartEndCollisions()
	}

	updateHitbox() {
		this.hitbox = {
			position: {
				x: this.position.x - 8 + this.width / 2,
				y: this.position.y + this.character.hitbox.y,
			},
			width: 14,
			height: this.character.hitbox.height,
		};
	}

	checkForHorizontalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (
				collision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
			) {
				if (this.velocity.x > 0) {
					this.velocity.x = 0;
					const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

					this.position.x = collisionBlock.position.x - offset - 0.01;
					break;
				}
				if (this.velocity.x < 0) {
					const offset = this.hitbox.position.x - this.position.x;

					this.velocity.x = 0;
					this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
					break;
				}
			}
		}
		// Pickup collisions
		for (let i = 0; i < this.pickupCollisionBlocks.length; i++) {
			const item = this.pickupCollisionBlocks[i];

			if (
				collision({
					object1: this.hitbox,
					object2: item,
				})
			) {
				console.log(`Touched a pickup: ${item.name}`);
				item.collected = true;

				// remove the item from array
				this.pickupCollisionBlocks = this.pickupCollisionBlocks.filter((i) => i !== item);
				if (this.stats.inventory[item.name]) this.stats.inventory[item.name]++;
				else this.stats.inventory[item.name] = 1;
				break;
			}
		}
	}

	applyGravity() {
		this.velocity.y += gravity;
		this.position.y += this.velocity.y;
	}

	checkForVerticalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (
				collision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
			) {
				if (this.velocity.y > 0) {
					this.velocity.y = 0;

					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.position.y = collisionBlock.position.y - offset - 0.01;
					break;
				}
				if (this.velocity.y < 0) {
					const offset = this.hitbox.position.y - this.position.y;
					this.velocity.y = 0;
					this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
					break;
				}
			}
		}
		// platform collision blocks
		for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
			const platformCollisionBlock = this.platformCollisionBlocks[i];

			if (
				platformCollision({
					object1: this.hitbox,
					object2: platformCollisionBlock,
				})
			) {
				if (this.velocity.y > 0) {
					this.velocity.y = 0;

					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.position.y = platformCollisionBlock.position.y - offset - 0.01;
					break;
				}
			}
		}
	}

	checkForStartEndCollisions() {
		for (let i = 0; i < this.startEndCollisionBlocks.length; i++) {
			const startEndCollisionBlock = this.startEndCollisionBlocks[i];
	
			if (
				collision({
					object1: this.hitbox,
					object2: startEndCollisionBlock,
				})
			) {
				console.log('Hit start/end position');
				// Handle start/end collision logic here
				break;
			}
		}
	}
}