import {useReducer} from 'react'
import type {QuestionDocument} from '~/types/question'
import {Navigate} from 'react-router-dom'
import {Question} from '../question'

enum QuizActionKind {
  CLICK = 'CLICK',
}

interface QuizProps {
  questions: QuestionDocument[]
}

interface QuizState {
  question: number
  winner?: string
  weights: {
    [slug: string]: number
  }
}

interface QuizActionPayload {
  weights: {
    slug: string
    value: number
  }[]
}

interface QuizAction {
  type: QuizActionKind
  payload: QuizActionPayload
}

const initialState: QuizState = {
  question: 0,
  weights: {},
}

function quizReducer(questions: QuestionDocument[]) {
  return function (state: QuizState, action: QuizAction) {
    switch (action.type) {
      case QuizActionKind.CLICK:
        const complete = questions.length <= state.question + 1
        const weights = action.payload.weights.reduce(
          (acc, {slug, value}) => ({...acc, [slug]: (state.weights[slug] ?? 0) + value}),
          state.weights
        )
        let winner
        if (complete)
          winner = Object.entries(weights)
            .map(([slug, value]) => ({slug, value}))
            .sort((a, b) => b.value - a.value)[0].slug
        return {
          ...state,
          question: state.question + 1,
          weights,
          winner,
        }
    }
    return state
  }
}

export function Quiz({questions}: QuizProps) {
  const [state, dispatch] = useReducer(quizReducer(questions), initialState)

  function handleClick(weights: {slug: string; value: number}[]) {
    dispatch({type: QuizActionKind.CLICK, payload: {weights}})
  }

  console.log({state})

  // TODO: Look into better way to route with Remix - submit form or something?
  if (state.winner) return <Navigate to={`/${state.winner}`} />

  return (
    <Question
      showWeights={true}
      question={questions[state.question]}
      questionClicked={handleClick}
    />
  )
}
