import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

function MathDisplay({ math }) {
  if (!math) {
    return null
  }

  return (
    <div className="math-display">
      <BlockMath math={`\\displaystyle ${math}`} />
    </div>
  )
}

export default MathDisplay