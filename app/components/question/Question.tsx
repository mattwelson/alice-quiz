import type {QuestionDocument} from '~/types/question'

interface QuestionProps {
  question: QuestionDocument
  showWeights?: boolean
  questionClicked: (
    weights: {
      slug: string
      value: number
    }[]
  ) => void
}

// TODO: handle click on an answer
// TODO: On click send selected weight through to a container, container then moves to next

export function Question({question, showWeights, questionClicked}: QuestionProps) {
  return (
    <div>
      <h1 className="mb-2 px-4 text-2xl">{question.text}</h1>
      <div className="grid gap-3">
        {question.answers.map((a) => (
          <div
            key={a._key}
            className="flex cursor-pointer justify-between rounded bg-sky-400 px-4 py-4 text-white transition-colors ease-in-out hover:bg-sky-300 dark:bg-sky-700 dark:hover:bg-sky-600"
            onClick={() => questionClicked(a.weights)}
          >
            <div className="font-bold">{a.text}</div>
            {showWeights && (
              <div className="opacity-70">{a.weights.map((w) => w.slug).join(', ')}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
