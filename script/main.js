const fields = ["greeting", "greetingText", "wishHeading", "wishText", "textInChatBox"]

const setText = (key, value) => {
  if (!value) return
  const el = document.querySelector(`[data-node-name="${key}"]`)
  if (el) el.innerText = value
}

const setFonts = (fonts = []) => {
  fonts.forEach(font => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = font.path
    document.head.appendChild(link)
    if (font.name) {
      document.body.style.fontFamily = `${font.name}, ${document.body.style.fontFamily}`
    }
  })
}

const fetchData = () => {
  fetch("customize.json")
    .then(res => res.json())
    .then(data => {
      fields.forEach(key => setText(key, data[key]))
      setFonts(data.fonts)
    })
    .catch(() => {
      // 简单失败兜底，保持页面可用
      setFonts([])
    })
}

fetchData()

// 自动播放音乐（若浏览器阻止，将在首次点击时重试）
const audioSrc = "MP3/生日快乐歌.mp3"
let audio = null
let hasBoundRetry = false

const tryPlay = () => {
  if (!audio) return
  audio.play().catch(() => {
    // 静默处理，等待用户下一次交互
  })
}

const initMusic = () => {
  if (audio) return
  audio = new Audio(audioSrc)
  audio.loop = true
  audio.autoplay = true
  tryPlay()

  if (!hasBoundRetry) {
    hasBoundRetry = true
    document.addEventListener("click", tryPlay, { once: true })
  }
}

initMusic()

// 简易点击烟花特效（无外部依赖）
const canvas = document.getElementById("fireworksCanvas")
const ctx = canvas?.getContext("2d")
let particles = []

const resize = () => {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

const randomColor = () => {
  const colors = ["#ff6b6b", "#ffd166", "#06d6a0", "#118ab2", "#9b5de5"]
  return colors[Math.floor(Math.random() * colors.length)]
}

const spawn = (x, y, count = 30) => {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 3 + 2
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      size: Math.random() * 2 + 1,
      color: randomColor()
    })
  }
}

const update = () => {
  particles = particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.04, // 轻微重力
      alpha: p.alpha - 0.015
    }))
    .filter(p => p.alpha > 0)
}

const draw = () => {
  if (!ctx || !canvas) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particles.forEach(p => {
    ctx.globalAlpha = p.alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1
}

const loop = () => {
  update()
  draw()
  requestAnimationFrame(loop)
}

if (canvas && ctx) {
  resize()
  window.addEventListener("resize", resize)
  document.addEventListener("click", (e) => {
    spawn(e.clientX, e.clientY, 24)
  })
  loop()
}