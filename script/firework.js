;(() => {
  const canvas = document.getElementById("fireworksCanvas")
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  const fireworks = []

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener("resize", resize)
  resize()

  class Particle {
    constructor(x, y, color) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3 + 2
      this.x = x
      this.y = y
      this.vx = Math.cos(angle) * speed
      this.vy = Math.sin(angle) * speed
      this.alpha = 1
      this.color = color
      this.size = Math.random() * 2 + 1
    }
    update() {
      this.x += this.vx
      this.y += this.vy
      this.vy += 0.03
      this.alpha -= 0.015
    }
    draw() {
      ctx.globalAlpha = Math.max(this.alpha, 0)
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }
  }

  const spawnFirework = (x, y) => {
    const colors = ["#ff6b6b", "#ffd166", "#06d6a0", "#4dabf7", "#c77dff"]
    const count = 30
    const particles = []
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]))
    }
    fireworks.push(particles)
  }

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const group = fireworks[i]
      group.forEach((p, idx) => {
        p.update()
        p.draw()
        if (p.alpha <= 0) {
          group.splice(idx, 1)
        }
      })
      if (!group.length) {
        fireworks.splice(i, 1)
      }
    }
    requestAnimationFrame(tick)
  }

  document.addEventListener("click", (e) => {
    const x = e.clientX
    const y = e.clientY
    spawnFirework(x, y)
  })

  tick()
})()

