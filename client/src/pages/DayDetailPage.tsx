import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Badge, Button, ShellCard } from '../components/UI';
import type { TopicDetails } from '../types';

export function DayDetailPage() {
  const { id = '' } = useParams();
  const [topic, setTopic] = useState<TopicDetails | null>(null);
  const [reflectionSummary, setReflectionSummary] = useState<string>('');
  const [reflectionDrafts, setReflectionDrafts] = useState<string[]>([]);
  const [quizMessage, setQuizMessage] = useState<string | null>(null);

  const refresh = async () => {
    const data = await api.topicDetails(id);
    setTopic(data);
    setReflectionDrafts(
      Array.from({ length: data.reflection.requiredCount }, (_, index) => {
        const existing = data.reflection.answers.find((answer) => answer.QUESTION_INDEX === index);
        return existing?.RESPONSE_TEXT ?? '';
      }),
    );
    const feedback = await api.reflectionsFeedback(id);
    setReflectionSummary(feedback.summary);
  };

  useEffect(() => {
    void refresh();
  }, [id]);

  const completionRate = useMemo(() => {
    if (!topic) return 0;
    const done = topic.contentItems.filter((item) => item.USER_STATUS === 'COMPLETED').length;
    return Math.round((done / topic.contentItems.length) * 100);
  }, [topic]);

  if (!topic) {
    return <div className="text-slate-600">Loading topic...</div>;
  }

  return (
    <div className="space-y-6">
      <ShellCard>
        <Link to="/program" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Back to curriculum</Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge>Week {topic.WEEK}</Badge>
          <Badge>Day {topic.DAY_NUMBER}</Badge>
          <Badge>{completionRate}% done</Badge>
        </div>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">{topic.TITLE}</h2>
        <p className="mt-3 max-w-3xl text-slate-600">{topic.DESCRIPTION}</p>
      </ShellCard>

      <ShellCard title="Learning cards" subtitle="Mark content complete to unlock momentum and points.">
        <div className="space-y-4">
          {topic.contentItems.map((item) => (
            <div key={item.ID} className="rounded-[1.75rem] border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge>{item.TYPE}</Badge>
                    <Badge>{item.POINTS} pts</Badge>
                    {item.USER_STATUS === 'COMPLETED' ? <Badge>Completed</Badge> : null}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.TITLE}</h3>
                  <p className="mt-2 text-slate-600">{item.DESCRIPTION}</p>
                </div>
                {item.USER_STATUS !== 'COMPLETED' ? (
                  <Button onClick={() => void api.completeContent(item.ID).then(refresh)}>Mark complete</Button>
                ) : null}
              </div>

              {item.BODY ? <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{item.BODY}</div> : null}
              {item.URL ? <a href={item.URL} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-slate-950 underline">Open resource</a> : null}

              {item.QUIZ ? (
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-950">Quick check</div>
                  <div className="mt-2 text-sm text-slate-600">Pass score: {item.QUIZ.passingScore}%</div>
                  <div className="mt-4 space-y-4">
                    {item.QUIZ.questions.map((question, questionIndex) => (
                      <div key={question.prompt}>
                        <div className="text-sm font-medium text-slate-800">{questionIndex + 1}. {question.prompt}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {question.choices.map((choice, choiceIndex) => (
                            <button
                              key={choice}
                              className="rounded-full border border-slate-200 px-3 py-2 text-sm hover:border-slate-950"
                              onClick={async () => {
                                const score = choiceIndex === question.correctIndex ? 100 : 50;
                                await api.saveQuizPerformance({ quizId: item.ID, scorePercent: score });
                                if (score >= item.QUIZ!.passingScore) {
                                  await api.completeContent(item.ID, score);
                                }
                                setQuizMessage(score >= item.QUIZ!.passingScore ? 'Quiz passed. Content marked complete.' : 'Not quite. Saved score for retry.');
                                await refresh();
                              }}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {quizMessage ? <div className="mt-4 text-sm text-emerald-700">{quizMessage}</div> : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </ShellCard>

      <ShellCard title="Reflection" subtitle={reflectionSummary}>
        <div className="space-y-4">
          {reflectionDrafts.map((value, index) => {
            const existing = topic.reflection.answers.find((answer) => answer.QUESTION_INDEX === index);
            const question = existing?.QUESTION_TEXT ?? `Reflection prompt ${index + 1}`;
            return (
              <label key={index} className="block">
                <div className="mb-2 text-sm font-medium text-slate-800">{question}</div>
                <textarea
                  className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                  value={value}
                  onChange={(event) => setReflectionDrafts((current) => current.map((entry, entryIndex) => entryIndex === index ? event.target.value : entry))}
                />
              </label>
            );
          })}
          <Button onClick={() => void api.saveReflections(id, reflectionDrafts).then(refresh)}>Save reflections</Button>
        </div>
      </ShellCard>
    </div>
  );
}
