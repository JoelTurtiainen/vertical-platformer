//TODO: clean the magic values
const characterOne = {
	imageSrc: './img/warrior/Idle.png',
	img: {
		width: 80,
		height: 55.5,
	},
	frameBuffer: 7,
	frameRate: 8,
	scale: 0.5,
	hitbox: {
		position: {
			x: 33,
			y: 26,
		},
		width: 14,
		height: 27,
	},
	animations: {
		Idle: {
			imageSrc: './img/warrior/Idle.png',
			frameRate: 8,
			frameBuffer: 8,
		},
		IdleLeft: {
			imageSrc: './img/warrior/IdleLeft.png',
			frameRate: 8,
			frameBuffer: 8,
		},
		Run: {
			imageSrc: './img/warrior/Run.png',
			frameRate: 8,
			frameBuffer: 5,
		},
		RunLeft: {
			imageSrc: './img/warrior/RunLeft.png',
			frameRate: 8,
			frameBuffer: 5,
		},
		Jump: {
			imageSrc: './img/warrior/Jump.png',
			frameRate: 2,
			frameBuffer: 6,
		},
		JumpLeft: {
			imageSrc: './img/warrior/JumpLeft.png',
			frameRate: 2,
			frameBuffer: 6,
		},
		Fall: {
			imageSrc: './img/warrior/Fall.png',
			frameRate: 2,
			frameBuffer: 4,
		},
		FallLeft: {
			imageSrc: './img/warrior/FallLeft.png',
			frameRate: 2,
			frameBuffer: 4,
		},
	},
};

//TODO: clean the magic values
const characterTwo = {
	imageSrc: './img/Froggo/Idle.png',
	scale: 0.8,
	img: {
		width: 51.2,
		height: 38.4,
	},
	frameBuffer: 8,
	frameRate: 4,
	hitbox: {
		position: {
			x: 18.6,
			y: 15,
		},
		width: 14,
		height: 10,
	},
	animations: {
		Idle: {
			imageSrc: './img/Froggo/Idle.png',
			frameRate: 4,
			frameBuffer: 8,
		},
		IdleLeft: {
			imageSrc: './img/Froggo/IdleLeft.png',
			frameRate: 4,
			frameBuffer: 8,
		},
		Run: {
			imageSrc: './img/Froggo/Idle.png',
			frameRate: 4,
			frameBuffer: 5,
		},
		RunLeft: {
			imageSrc: './img/Froggo/IdleLeft.png',
			frameRate: 4,
			frameBuffer: 5,
		},
		Jump: {
			imageSrc: './img/Froggo/Jump.png',
			frameRate: 1,
			frameBuffer: 6,
		},
		JumpLeft: {
			imageSrc: './img/Froggo/JumpLeft.png',
			frameRate: 1,
			frameBuffer: 6,
		},
		Fall: {
			imageSrc: './img/Froggo/Fall.png',
			frameRate: 1,
			frameBuffer: 4,
		},
		FallLeft: {
			imageSrc: './img/Froggo/FallLeft.png',
			frameRate: 1,
			frameBuffer: 4,
		},
	},
};