import { useEffect, useRef, useState } from 'react'
import './App.css'

const TYPES = {
  Lenta: { cls: 'lenta', eta: ['3 semanas', '8 meses', '14 años'] },
  Dolorosa: { cls: 'dolorosa', eta: ['2 horas', '6 días', '3 meses'] },
  Rápida: { cls: 'rapida', eta: ['4 segundos', '9 segundos', 'menos de 1 minuto'] },
  Ridícula: { cls: 'ridicula', eta: ['un martes a la tarde', 'durante un estornudo', 'en la fila del banco'] },
  Dramática: { cls: 'dramatica', eta: ['en el clímax de la fiesta', 'a medianoche exacta', 'con música épica'] },
}

const MODULES = [
  {
    id: 'cuerpo',
    name: 'Escaneo corporal',
    hint: 'Térmico y estructural',
    steps: ['Midiendo temperatura corporal', 'Mapeando huesos y articulaciones', 'Calculando resistencia'],
    results: [
      { weakness: 'Rodillas en retirada: crujen al agacharse', type: 'Lenta', text: 'Desgaste progresivo. Cada escalón es un paso hacia el final.' },
      { weakness: 'Espalda de oficina: 9 horas sentado, cero estiramientos', type: 'Lenta', text: 'Colapso gradual, silla incluida.' },
      { weakness: 'Sistema inmune alimentado a puro café', type: 'Dolorosa', text: 'Abstinencia de cafeína súbita. Se recomienda no mirar.' },
      { weakness: 'Reflejos de abuelo: tarda 2 segundos en esquivar', type: 'Rápida', text: 'Ocurrirá antes de que termine esta frase.' },
      { weakness: 'Cosquillas en las costillas', type: 'Ridícula', text: 'Risa fatal. Eficiente e irónico.' },
    ],
  },
  {
    id: 'mente',
    name: 'Escaneo mental',
    hint: 'Patrones de pensamiento',
    steps: ['Infiltrando ondas cerebrales', 'Leyendo pensamientos recientes', 'Detectando puntos ciegos'],
    results: [
      { weakness: 'Dice «cinco minutitos más» y nunca cumple', type: 'Lenta', text: 'Postergación terminal. Se completará sola.' },
      { weakness: 'Curiosidad excesiva: aprieta todo botón desconocido', type: 'Rápida', text: 'Ya apretó uno.' },
      { weakness: 'Piensa en el trabajo a las 3 a. m.', type: 'Lenta', text: 'Insomnio acumulativo. Sin ruido, sin prisa.' },
      { weakness: 'Confía en cualquier cartel que diga «última oportunidad»', type: 'Dolorosa', text: 'Compras impulsivas hasta la ruina emocional.' },
      { weakness: 'Cree que el wifi llega hasta el baño', type: 'Ridícula', text: 'Se quedará sin señal en el peor momento posible.' },
    ],
  },
  {
    id: 'digital',
    name: 'Escaneo digital',
    hint: 'Celular, redes y contraseñas',
    steps: ['Interceptando señal del celular', 'Rastreando historial de búsqueda', 'Descifrando contraseñas'],
    results: [
      { weakness: 'Batería al 3 %, cargador olvidado en casa', type: 'Rápida', text: 'Apagado repentino. Sin despedida.' },
      { weakness: 'Una sola contraseña para todas las cuentas', type: 'Dolorosa', text: 'Caerán una por una, y con espectadores.' },
      { weakness: '200 pestañas abiertas, ninguna cerrada', type: 'Lenta', text: 'Asfixia de memoria RAM.' },
      { weakness: 'Acepta términos y condiciones sin leerlos', type: 'Dramática', text: 'Acaba de ceder sus derechos. Todos.' },
      { weakness: 'Responde «jajaja» sin haber leído el mensaje', type: 'Ridícula', text: 'Confundirá un aviso final con un meme.' },
    ],
  },
  {
    id: 'social',
    name: 'Escaneo social',
    hint: 'Vínculos y conducta en grupo',
    steps: ['Analizando círculo de contactos', 'Evaluando carisma', 'Calculando aliados disponibles'],
    results: [
      { weakness: 'Dice «ya llego» desde el sillón de su casa', type: 'Lenta', text: 'Llegará tarde. Siempre. Incluso a esto.' },
      { weakness: 'Opina en el grupo de WhatsApp familiar', type: 'Dolorosa', text: 'Treinta audios de respuesta. Sin salida.' },
      { weakness: 'Cuenta un chiste y lo explica después', type: 'Ridícula', text: 'Muerte por silencio incómodo.' },
      { weakness: 'Hace de cuenta que no ve a la gente para no saludar', type: 'Rápida', text: 'Sin testigos. Nadie lo notará.' },
      { weakness: 'Prometió «a las 12 me voy» a las 10', type: 'Dramática', text: 'Seguirá ahí a las 4. Final inevitable.' },
    ],
  },
  {
    id: 'veredicto',
    name: 'Veredicto final',
    hint: 'Análisis completo del sujeto',
    steps: ['Cruzando todos los datos', 'Simulando 14 millones de finales', 'Seleccionando el más conveniente'],
    results: [
      { weakness: 'Empieza la dieta los lunes y la abandona los martes', type: 'Lenta', text: 'Un final sin apuro, con postre incluido.' },
      { weakness: 'Dice «una sola cerveza» y se queda hasta el cierre', type: 'Dramática', text: 'Gran final, mala decisión.' },
      { weakness: 'Subestima a una IA con disfraz casero', type: 'Rápida', text: 'Error de cálculo. El último.' },
      { weakness: 'Abre archivos adjuntos de desconocidos', type: 'Dolorosa', text: 'Descargó su propio apagón.' },
      { weakness: 'Quiere sacarse una selfie con el villano', type: 'Ridícula', text: 'Saldrá en la foto. Será la última.' },
    ],
  },
]

// Sujetos fijos: cada uno tiene UN solo resultado, así que siempre sale el mismo.
// Cambiá `name` (lo que se ve en el botón) y los textos como quieras.
const PEOPLE = [
  {
    id: 'comida',
    name: 'Mati',
    hint: 'Sujeto ya identificado',
    steps: ['Localizando sujeto cerca de la comida', 'Calculando radio de acción del buffet', 'Midiendo velocidad de servido'],
    results: [
      { weakness: 'Los chinchulines, el asado, y todo lo demás', type: 'Dramática', text: 'Caerá defendiendo la última porción de pizza.', odds: 99, eta: 'cuando se acabe el postre' },
    ],
  },
  {
    id: 'organizadora',
    name: 'La organizadora',
    hint: 'Sujeto ya identificado',
    steps: ['Interceptando lista de invitados', 'Analizando nivel de control', 'Detectando planillas ocultas'],
    results: [
      { weakness: 'Necesita controlar hasta el último detalle de la fiesta', type: 'Rápida', text: 'Matar después de que termine la fiesta', odds: 97, eta: 'después de limpiar todo' },
    ],
  },
  {
    id: 'bardero',
    name: 'El bardero',
    hint: 'Sujeto ya identificado',
    steps: ['Detectando decibeles sospechosos', 'Rastreando origen del desorden', 'Calculando daños colaterales'],
    results: [
      { weakness: 'No puede quedarse callado', type: 'Dolorosa', text: 'Chucky domesticado será vengado', odds: 98, eta: 'cuando mejor la esté pasando' },
    ],
  },
]

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const hexLine = () =>
  Array.from({ length: 8 }, () => Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')).join(' ')

export default function App() {
  const [phase, setPhase] = useState('menu') // menu | scan | result
  const [mod, setMod] = useState(null)
  const [result, setResult] = useState(null)
  const [subject, setSubject] = useState('')
  const [progress, setProgress] = useState(0)
  const [lines, setLines] = useState([])
  const [voice, setVoice] = useState(true)
  const lastIndex = useRef({})

  const start = (m) => {
    let i
    do {
      i = Math.floor(Math.random() * m.results.length)
    } while (i === lastIndex.current[m.id] && m.results.length > 1)
    lastIndex.current[m.id] = i
    const r = m.results[i]
    setMod(m)
    setResult({
      ...r,
      odds: r.odds ?? 70 + Math.floor(Math.random() * 30),
      eta: r.eta ?? pick(TYPES[r.type].eta),
    })
    setSubject(PEOPLE.includes(m) ? 'SUJETO CONOCIDO' : `SUJETO-${1000 + Math.floor(Math.random() * 9000)}`)
    setProgress(0)
    setLines([])
    setPhase('scan')
  }

  // Animación de escaneo (~3,8 s)
  useEffect(() => {
    if (phase !== 'scan') return
    const t0 = performance.now()
    const DURATION = 3800
    const id = setInterval(() => {
      const p = Math.min(100, ((performance.now() - t0) / DURATION) * 100)
      setProgress(p)
      setLines((l) => [hexLine(), ...l].slice(0, 9))
      if (p >= 100) {
        clearInterval(id)
        setPhase('result')
      }
    }, 120)
    return () => clearInterval(id)
  }, [phase])

  // Voz robótica al mostrar el resultado
  useEffect(() => {
    if (phase !== 'result' || !voice || !result) return
    try {
      const u = new SpeechSynthesisUtterance(
        `${result.weakness}. Muerte ${result.type.toLowerCase()}. Probabilidad: ${result.odds} por ciento.`
      )
      u.lang = 'es-AR'
      u.pitch = 0.5
      u.rate = 0.85
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    } catch {
      /* el navegador no soporta voz */
    }
    return () => window.speechSynthesis?.cancel()
  }, [phase, voice, result])

  const stepText = mod ? mod.steps[Math.min(mod.steps.length - 1, Math.floor((progress / 100) * mod.steps.length))] : ''

  return (
    <main className="app">
      <header className="top">
        <h1>NÉMESIS-9</h1>
        <button
          className="voice"
          onClick={() => setVoice((v) => !v)}
          aria-pressed={voice}
          title="Activar o desactivar la voz"
        >
          Voz {voice ? 'activada' : 'apagada'}
        </button>
      </header>

      {phase === 'menu' && (
        <section className="menu">
          <p className="lead">Acercate. Elegí un módulo de análisis y quedate quieto.</p>
          <div className="buttons">
            {MODULES.map((m) => (
              <button key={m.id} className="mod" onClick={() => start(m)}>
                <span className="mod-name">{m.name}</span>
                <span className="mod-hint">{m.hint}</span>
              </button>
            ))}
            <button className="mod known" onClick={() => setPhase('people')}>
              <span className="mod-name">Sujetos conocidos</span>
              <span className="mod-hint">Objetivos ya identificados en la fiesta</span>
            </button>
          </div>
        </section>
      )}

      {phase === 'people' && (
        <section className="menu">
          <p className="lead">Objetivos identificados. Elegí a quién escanear.</p>
          <div className="buttons">
            {PEOPLE.map((p) => (
              <button key={p.id} className="mod known" onClick={() => start(p)}>
                <span className="mod-name">{p.name}</span>
                <span className="mod-hint">{p.hint}</span>
              </button>
            ))}
            <button className="ghost back" onClick={() => setPhase('menu')}>Volver</button>
          </div>
        </section>
      )}

      {phase === 'scan' && (
        <section className="scan" aria-live="polite">
          <div className="scanner">
            <div className="ring r1" />
            <div className="ring r2" />
            <div className="ring r3" />
            <div className="radar" />
            <svg viewBox="0 0 120 160" className="silhouette" aria-hidden="true">
              <circle cx="60" cy="48" r="22" />
              <path d="M16 150c0-34 20-54 44-54s44 20 44 54" />
            </svg>
            <div className="sweep" />
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
          </div>
          <p className="status">{stepText}…</p>
          <div className="bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100">
            <div className="bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <pre className="stream" aria-hidden="true">{lines.join('\n')}</pre>
        </section>
      )}

      {phase === 'result' && result && (
        <section className="result">
          <p className="subject">{subject} · {mod.name}</p>
          <h2 className="label">Debilidad detectada</h2>
          <p className="weakness">{result.weakness}</p>
          <h2 className="label">Muerte asignada</h2>
          <p className={`death ${TYPES[result.type].cls}`}>{result.type}</p>
          <p className="death-text">{result.text}</p>
          <dl className="facts">
            <div>
              <dt>Probabilidad</dt>
              <dd>{result.odds} %</dd>
            </div>
            <div>
              <dt>Ejecución estimada</dt>
              <dd>{result.eta}</dd>
            </div>
          </dl>
          <div className="actions">
            <button className="primary" onClick={() => start(mod)}>Repetir escaneo</button>
            <button className="ghost" onClick={() => setPhase(PEOPLE.includes(mod) ? 'people' : 'menu')}>
              {PEOPLE.includes(mod) ? 'Otro sujeto' : 'Otro módulo'}
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
