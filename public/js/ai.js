const chatPanel = document.getElementById('chatPanel');
const sendBtn = document.getElementById('coachBtn');
const situationInput = document.getElementById('situation');
const goalInput = document.getElementById('goal');
const goalChips = [...document.querySelectorAll('.goal-chip[data-goal]')];

function addBubble(text, role = 'ai', extraClass = '') {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${role} ${extraClass}`.trim();
  if (extraClass.includes('typing-indicator')) {
    bubble.innerHTML = '<span></span><span></span><span></span>';
  } else if (role === 'ai' && window.matchMedia('(max-width: 640px)').matches) {
    const plain = String(text).replace(/<br\s*\/?>/gi, '\n').trim();
    if (plain.length > 220) {
      const preview = plain.slice(0, 220);
      bubble.innerHTML = `<span class="bubble-preview"></span><button type="button" class="bubble-more">더보기</button>`;
      const previewEl = bubble.querySelector('.bubble-preview');
      const moreBtn = bubble.querySelector('.bubble-more');
      let expanded = false;
      const render = () => {
        previewEl.textContent = expanded ? plain : `${preview}…`;
        moreBtn.textContent = expanded ? '접기' : '더보기';
      };
      moreBtn.addEventListener('click', () => {
        expanded = !expanded;
        render();
      });
      render();
    } else {
      bubble.textContent = plain;
    }
  } else {
    bubble.innerHTML = text;
  }
  chatPanel.appendChild(bubble);
  chatPanel.scrollTop = chatPanel.scrollHeight;
  return bubble;
}

function classifyCounselStyle(goal) {
  const text = String(goal || '').toLowerCase();
  if (!text) return 'care';
  if (/해결|전략|현실|팩폭|명쾌|결론/.test(text)) return 'solution';
  if (/분석|심리|패턴|원인/.test(text)) return 'analysis';
  if (/위로|공감|다정|따뜻/.test(text)) return 'care';
  return 'care';
}

function buildAdvice(situation, goal) {
  const cleanSituation = situation.slice(0, 56);
  const style = classifyCounselStyle(goal);

  const empathy = `지금 "${cleanSituation}" 때문에 마음이 흔들리는 건 너무 자연스러워. 네 감정이 과한 게 아니라, 그만큼 이 관계가 중요하다는 뜻이야.`;
  const reflection = '내가 이해한 핵심은 "상대의 신호가 애매해서 내가 더 불안해진 상태"에 가깝다는 거야. 맞는지 먼저 확인하고 싶어.';

  const askCare = '지금 제일 힘든 지점이 ① 기다림 ② 자책 ③ 확신 없음 중 어디에 가장 가까워? 한 가지만 골라줘.';
  const askAnalysis = '반복되는 패턴을 보려면 최근 비슷했던 장면 1개만 더 알려줘. (언제/무슨 말/네가 느낀 감정)';
  const askSolutionGate = '실행 전략이 필요하면 바로 줄 수 있어. 원하면 "해결 전략 줘"라고 말해줘. 우선은 네 마음부터 안전하게 정리해보자.';

  const lines = [empathy, reflection];

  if (style === 'analysis') {
    lines.push(askAnalysis);
  } else if (style === 'solution') {
    lines.push('좋아, 현실적인 방향을 원한다는 걸 반영해서 짧게 제안할게. 다만 결론을 서두르기보다 감정 정리 후 행동하는 순서로 갈게.');
    lines.push('📌 오늘의 실행 가이드\n• 감정 3단어 기록하기\n• 보내고 싶은 말 1문장으로 줄이기\n• 10분 뒤 다시 읽고 톤 조정하기');
  } else {
    lines.push(askCare);
    lines.push(askSolutionGate);
  }

  return lines.join('<br/><br/>');
}

function randomDelay(ch) {
  if (/[,.!?\n]/.test(ch)) return 140 + Math.random() * 120;
  if (/\s/.test(ch)) return 28 + Math.random() * 20;
  return 24 + Math.random() * 55;
}

async function typeBubbleHtml(html) {
  const bubble = addBubble('', 'ai', 'bubble-pop');
  const plain = String(html).replace(/<br\s*\/?>/gi, '\n');
  let out = '';
  for (let i = 0; i < plain.length; i += 1) {
    out += plain[i];
    bubble.innerHTML = out.replace(/\n/g, '<br/>');
    await new Promise((resolve) => setTimeout(resolve, randomDelay(plain[i])));
  }
  bubble.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function sendMessage() {
  const situation = situationInput.value.trim();
  const goal = goalInput.value.trim();
  if (!situation) return alert('고민 내용을 먼저 적어줘.');

  addBubble(situation, 'user');
  situationInput.value = '';

  const thinking = addBubble('', 'ai', 'typing-indicator bubble-pop');
  setTimeout(async () => {
    thinking.remove();
    await typeBubbleHtml(buildAdvice(situation, goal));
  }, 850);
}

goalChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    goalChips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    goalInput.value = chip.dataset.goal || '';
  });
});

goalInput.addEventListener('input', () => {
  goalChips.forEach((c) => {
    const active = (c.dataset.goal || '') === goalInput.value.trim();
    c.classList.toggle('active', active);
  });
});

sendBtn.addEventListener('click', sendMessage);
situationInput.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') sendMessage();
});
