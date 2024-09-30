const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;
let frames = 0;

canvas.width = 1024
canvas.height = 576

let parsedCollsions
let collisionBlocks
let background
let doors
const player = new Player({
    imageSrc: './img/king/idle.png',
    frameRate: 11,
    animations: {
        idleRight: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/idle.png',
        },
        idleLeft: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/idleLeft.png',
        },
        runRight: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: './img/king/runRight.png',
        },
        runLeft: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: './img/king/runLeft.png',
        },
        enterDoor: {
            frameRate: 8,
            frameBuffer: 4,
            loop: false,
            imageSrc: './img/king/enterDoor.png',
            onComplete: () => {
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++
                        if (level === 4) level = 1
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false
                        gsap.to(overlay, {
                            opacity: 0,
                        })
                    }
                })
            }
        },
    }
})



let level = 1
let levels = {
    1: {
        init: function () {
            parsedCollsions = collisionLevel1.parse2D()
            collisionBlocks = parsedCollsions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel1.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 767,
                        y: 270,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 7,
                    loop: false,
                    autoplay: false
                })
            ]

        }
    },
    2: {
        init: function () {
            parsedCollsions = collisionLevel2.parse2D()
            collisionBlocks = parsedCollsions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 96
            player.position.y = 140

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel2.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 772,
                        y: 336,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 7,
                    loop: false,
                    autoplay: false
                })
            ]

        }
    },
    3: {
        init: function () {
            parsedCollsions = collisionLevel3.parse2D()
            collisionBlocks = parsedCollsions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 760
            player.position.y = 210

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel3.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 176,
                        y: 334,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 7,
                    loop: false,
                    autoplay: false
                })
            ]

        }
    }
}

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

const overlay = {
    opacity: 0
}

function animate() {
    window.requestAnimationFrame(animate)

    const msNow = window.performance.now()
    const msPassed = msNow - msPrev
    if (msPassed < msPerFrame) return
    const excessTime = msPassed % msPerFrame
    msPrev = msNow - excessTime

    background.draw()
    // collisionBlocks.forEach(collisionBlock => {
    //     collisionBlock.draw()
    // })

    doors.forEach((door) => {
        door.draw()
    })


    player.handleInput(keys)
    player.draw()
    player.update()


    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
}
levels[level].init()
animate()
