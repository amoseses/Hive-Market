"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const questions = [
  { prompt: "Where was our first date?", answer: "ice skating", hint: "You should know this." },
  { prompt: "What is my middle name?", answer: "michael", aliases: ["micheal"], hint: "Named after an archangel." },
  { prompt: "What musical were we supposed to see when things happened?", answer: "into the woods", hint: "Lucas was Jack." },
  { prompt: "What restaurant did we go to for our six-month?", answer: "depauls table", aliases: ["depaul's table", "depauls"], hint: "Corner of Station Ave — 7 E Lancaster Ave, Ardmore." },
  { prompt: "What was the first movie we saw together?", answer: "the lego movie", aliases: ["lego movie"], hint: "Toys." },
  {
    prompt: "What text did I send you saying I liked you bar for bar?",
    answer: "i just wanted to be upfront for a sec weve been friends for a bit and thats honestly how i saw things up until recently since right before winter break started i realized i liking you a bit more than the friend u were after out first conversation the other day about the samy issue i understand that you see us as friends and i respect that i do want to stay friends i just dont want it to turn into one of those weird friendships where one person has feeling for the other im probably going to be a little quieter for a few days while i reset nothing personal i do really value our friendship i just to mentally return there",
    hint: "You have this one. Take your time. ♥",
    long: true,
  },
  { prompt: "What is our song?", answer: "risk it all", hint: "You should know this." },
  { prompt: "What is my Wawa order?", answer: "sweet chili chicken sandwich", aliases: ["sweet chilli chicken sandwich"], hint: "Sweet _______ _______ Sandwich." },
  { prompt: "What is our duet song?", answer: "more than i am", hint: "Little Women." },
  { prompt: "How many are left in the mysterious Target box?", answer: "25", aliases: ["twenty five", "twenty-five"], hint: "5 times since purchase." },
  { prompt: "Where did we go for my birthday?", answer: "b social", aliases: ["bsocial"], hint: "Near your house." },
  { prompt: "How many miles is the fastest drive to you?", answer: "299", numericRange: 5, hint: "CT-15N." },
];

type Question = (typeof questions)[number];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function distance(first: string, second: string) {
  const previous = Array.from({ length: second.length + 1 }, (_, index) => index);
  for (let i = 1; i <= first.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= second.length; j += 1) {
      const saved = previous[j];
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + Number(first[i - 1] !== second[j - 1]));
      diagonal = saved;
    }
  }
  return previous[second.length];
}

function isCorrect(input: string, question: Question) {
  const value = normalize(input);
  if (!value) return false;
  if (question.numericRange) return Math.abs(Number(value) - Number(question.answer)) <= question.numericRange;
  const answers = [question.answer, ...(question.aliases ?? [])].map(normalize);
  return answers.some((answer) => value === answer || distance(value, answer) / Math.max(value.length, answer.length) <= (question.long ? 0.055 : 0.22));
}

export default function LoveQuiz() {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const question = questions[index];
  const complete = index === questions.length;

  useEffect(() => { inputRef.current?.focus(); }, [index]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isCorrect(value, question)) {
      setMessage("Not quite — you know this. Try again, babe.");
      return;
    }
    setMessage("");
    setValue("");
    setShowHint(false);
    setIndex((current) => current + 1);
  }

  return (
    <main onCopy={(event) => event.preventDefault()} onCut={(event) => event.preventDefault()} onContextMenu={(event) => event.preventDefault()}>
      <div className="glow glow-one" /><div className="glow glow-two" />
      <section className="quiz-card" aria-live="polite">
        {!complete ? <>
          <header className="card-header">
            <span className="eyebrow">A LITTLE QUIZ FOR YOU</span>
            <span className="count">{String(index + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
          </header>
          <div className="progress" aria-label={`${index + 1} of ${questions.length} questions`}><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <div className="heart">♥</div>
          <h1>{question.prompt}</h1>
          <form onSubmit={submit}>
            {question.long ? <textarea ref={inputRef as React.RefObject<HTMLTextAreaElement>} value={value} onChange={(event) => setValue(event.target.value)} onPaste={(event) => event.preventDefault()} placeholder="Type it from the heart..." rows={7} /> : <input ref={inputRef as React.RefObject<HTMLInputElement>} value={value} onChange={(event) => setValue(event.target.value)} onPaste={(event) => event.preventDefault()} placeholder="Your answer..." autoComplete="off" />}
            {message && <p className="error">{message}</p>}
            <div className="actions"><button type="button" className="hint" onClick={() => setShowHint(!showHint)}>{showHint ? "Hide hint" : "Need a hint?"}</button><button className="next" type="submit">Continue <span>→</span></button></div>
            {showHint && <p className="hint-text">{question.hint}</p>}
          </form>
        </> : <div className="finish"><span className="corner-code">0121</span><div className="heart big-heart">♥</div><span className="eyebrow">YOU DID IT</span><h1>You know our story by heart.</h1><p>Every answer is another little reminder of how lucky I am to have you. I love our memories — and I love you even more.</p><div className="ending-note"><strong>6767</strong><span>remember this for later.. :)</span></div><div className="signature">always yours <span>♥</span></div><button className="restart" onClick={() => setIndex(0)}>Take it again</button></div>}
      </section>
    </main>
  );
}
