(function (root) {
  var Calc = root.Calc = root.Calc || {};
  var questions = [
    {
      id: 'lim-01', topic: 'limit', difficulty: 1,
      stem: '定義 $f(x)=x^2+2x$（$x\\ne2$），且 $f(2)=k$。若要讓 $f$ 在 $x=2$ 連續，$k$ 應為多少？',
      choices: [{ tex: '6', value: 6 }, { tex: '8', value: 8 }, { tex: '4', value: 4 }, { tex: '12', value: 12 }],
      answer: 1,
      solution: '連續要求函數值等於極限；$\\lim_{x\\to2}(x^2+2x)=2^2+2\\cdot2=8$，故 $k=8$。',
      check: N => N.limit(x => x*x+2*x, 2)
    },
    {
      id: 'lim-02', topic: 'limit', difficulty: 1,
      stem: '求 $\\lim_{x\\to 3}\\frac{x^2-9}{x-3}$。',
      choices: [{ tex: '0', value: 0 }, { tex: '3', value: 3 }, { tex: '\\text{不存在}', value: 'DNE' }, { tex: '6', value: 6 }],
      answer: 3,
      solution: '當 $x\\ne3$ 時可約成 $x+3$，所以極限為 $6$。',
      check: N => N.limit(x => (x*x-9)/(x-3), 3)
    },
    {
      id: 'lim-03', topic: 'limit', difficulty: 1,
      stem: '角度以弧度計，求 $\\lim_{x\\to0}\\frac{\\sin4x}{x}$。',
      choices: [{ tex: '4', value: 4 }, { tex: '1', value: 1 }, { tex: '\\frac14', value: 1/4 }, { tex: '0', value: 0 }],
      answer: 0,
      solution: '改寫成 $4\\frac{\\sin4x}{4x}$，利用基本三角極限得到 $4$。',
      check: N => N.limit(x => Math.sin(4*x)/x, 0)
    },
    {
      id: 'lim-04', topic: 'limit', difficulty: 2,
      stem: '求雙側極限 $\\lim_{x\\to0}\\frac{|x|}{x}$。',
      choices: [{ tex: '1', value: 1 }, { tex: '-1', value: -1 }, { tex: '\\text{不存在}', value: 'DNE' }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '右極限為 $1$，左極限為 $-1$；兩者不同，雙側極限不存在。',
      check: N => N.limit(x => Math.abs(x)/x, 0)
    },
    {
      id: 'lim-05', topic: 'limit', difficulty: 2,
      stem: '求右極限 $\\lim_{x\\to0^+}\\frac1x$。',
      choices: [{ tex: '-\\infty', value: '-inf' }, { tex: '+\\infty', value: '+inf' }, { tex: '0', value: 0 }, { tex: '\\text{不存在}', value: 'DNE' }],
      answer: 1,
      solution: '由正方向趨近零時，$1/x$ 保持正值且無界增大，故為 $+\\infty$。',
      check: N => N.limit(x => 1/x, 0, 'right')
    },
    {
      id: 'lim-06', topic: 'limit', difficulty: 2,
      stem: '定義分段函數：當 $x<1$ 時 $f(x)=2x+1$，當 $x>1$ 時 $f(x)=x^2+2$，且 $f(1)=k$。若要在 $x=1$ 連續，$k$ 應為多少？',
      choices: [{ tex: '2', value: 2 }, { tex: '1', value: 1 }, { tex: '\\text{不存在}', value: 'DNE' }, { tex: '3', value: 3 }],
      answer: 3,
      solution: '左極限為 $2\\cdot1+1=3$，右極限為 $1^2+2=3$；兩者相同，因此令 $f(1)=k=3$ 即連續。',
      check: N => N.limit(x => x < 1 ? 2*x+1 : x*x+2, 1)
    },
    {
      id: 'lim-07', topic: 'limit', difficulty: 2,
      stem: '求 $\\lim_{x\\to+\\infty}\\frac{5x^2-x}{2x^2+1}$。',
      choices: [{ tex: '\\frac52', value: 5/2 }, { tex: '\\frac25', value: 2/5 }, { tex: '0', value: 0 }, { tex: '+\\infty', value: '+inf' }],
      answer: 0,
      solution: '分子分母同除以 $x^2$，低次項趨零，得到最高次係數比 $5/2$。',
      check: N => N.limitInf(x => (5*x*x-x)/(2*x*x+1))
    },
    {
      id: 'lim-08', topic: 'limit', difficulty: 3,
      stem: '求 $\\lim_{x\\to0}\\frac{\\ln(1+2x)}{x}$。',
      choices: [{ tex: '1', value: 1 }, { tex: '\\frac12', value: 1/2 }, { tex: '2', value: 2 }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '令 $u=2x$，原式為 $2\\frac{\\ln(1+u)}u$，極限為 $2$。',
      check: N => N.limit(x => Math.log1p(2*x)/x, 0)
    },
    {
      id: 'lim-09', topic: 'limit', difficulty: 3,
      stem: '已知 $g(x)=\\frac{x^3-1}{x-1}$（$x\\ne1$）。若要讓 $g$ 在 $x=1$ 連續，$g(1)$ 應設為多少？',
      choices: [{ tex: '0', value: 0 }, { tex: '3', value: 3 }, { tex: '1', value: 1 }, { tex: '\\text{不存在}', value: 'DNE' }],
      answer: 1,
      solution: '約分後為 $x^2+x+1$，在 $x\\to1$ 時趨近 $3$，連續所需的函數值就是此極限。',
      check: N => N.limit(x => (x*x*x-1)/(x-1), 1)
    },
    {
      id: 'lim-10', topic: 'limit', difficulty: 3,
      stem: '求 $\\lim_{x\\to0}\\frac{1-\\cos3x}{x^2}$。',
      choices: [{ tex: '9', value: 9 }, { tex: '\\frac32', value: 3/2 }, { tex: '0', value: 0 }, { tex: '\\frac92', value: 9/2 }],
      answer: 3,
      solution: '利用 $1-\\cos3x=2\\sin^2(3x/2)$，可得極限 $2(3/2)^2=9/2$。',
      check: N => N.limit(x => (1-Math.cos(3*x))/(x*x), 0)
    },
    {
      id: 'der-01', topic: 'derivative', difficulty: 1,
      stem: '若 $f(x)=2x^3-5x$，求 $f\'(x)$。',
      choices: [{ tex: '6x^2-5', value: x => 6*x*x-5 }, { tex: '2x^2-5', value: x => 2*x*x-5 }, { tex: '6x^2', value: x => 6*x*x }, { tex: '6x^3-5', value: x => 6*x*x*x-5 }],
      answer: 0,
      solution: '逐項使用冪次法則，得 $f\'(x)=6x^2-5$。',
      check: N => x => N.diff(t => 2*t*t*t-5*t, x)
    },
    {
      id: 'der-02', topic: 'derivative', difficulty: 1,
      stem: '若 $f(x)=e^{2x}$，求 $f\'(x)$。',
      choices: [{ tex: 'e^{2x}', value: x => Math.exp(2*x) }, { tex: '2e^x', value: x => 2*Math.exp(x) }, { tex: '2e^{2x}', value: x => 2*Math.exp(2*x) }, { tex: '\\frac12e^{2x}', value: x => Math.exp(2*x)/2 }],
      answer: 2,
      solution: '指數函數微分後還須乘上內層 $2x$ 的導數，故為 $2e^{2x}$。',
      check: N => x => N.diff(t => Math.exp(2*t), x)
    },
    {
      id: 'der-03', topic: 'derivative', difficulty: 1,
      stem: '若 $f(x)=\\sin2x$，求 $f\'(x)$。',
      choices: [{ tex: '\\cos2x', value: x => Math.cos(2*x) }, { tex: '2\\cos2x', value: x => 2*Math.cos(2*x) }, { tex: '-2\\cos2x', value: x => -2*Math.cos(2*x) }, { tex: '2\\sin2x', value: x => 2*Math.sin(2*x) }],
      answer: 1,
      solution: '由鏈鎖律，$f\'(x)=\\cos2x\\cdot2$。',
      check: N => x => N.diff(t => Math.sin(2*t), x)
    },
    {
      id: 'der-04', topic: 'derivative', difficulty: 2,
      stem: '若 $f(x)=\\ln(3x+1)$（$x>-1/3$），求 $f\'(x)$。',
      samples: [0, 0.2, 0.8, 1.5],
      choices: [{ tex: '\\frac1{3x+1}', value: x => 1/(3*x+1) }, { tex: '\\frac3x', value: x => 3/x }, { tex: '\\frac1{x+1}', value: x => 1/(x+1) }, { tex: '\\frac3{3x+1}', value: x => 3/(3*x+1) }],
      answer: 3,
      solution: '令 $u=3x+1$，由 $(\\ln u)\'=u\'/u$ 得 $3/(3x+1)$。',
      check: N => x => N.diff(t => Math.log(3*t+1), x)
    },
    {
      id: 'der-05', topic: 'derivative', difficulty: 2,
      stem: '若 $f(x)=x\\cos x$，求 $f\'(x)$。',
      choices: [{ tex: '\\cos x-x\\sin x', value: x => Math.cos(x)-x*Math.sin(x) }, { tex: '-\\sin x', value: x => -Math.sin(x) }, { tex: '\\cos x+x\\sin x', value: x => Math.cos(x)+x*Math.sin(x) }, { tex: '-x\\sin x', value: x => -x*Math.sin(x) }],
      answer: 0,
      solution: '使用乘法法則，得 $1\\cdot\\cos x+x(-\\sin x)$。',
      check: N => x => N.diff(t => t*Math.cos(t), x)
    },
    {
      id: 'der-06', topic: 'derivative', difficulty: 2,
      stem: '若 $f(x)=\\frac{x}{x+2}$（$x\\ne-2$），求 $f\'(x)$。',
      choices: [{ tex: '\\frac1{x+2}', value: x => 1/(x+2) }, { tex: '-\\frac2{(x+2)^2}', value: x => -2/(x+2)**2 }, { tex: '\\frac2{(x+2)^2}', value: x => 2/(x+2)**2 }, { tex: '1', value: 1 }],
      answer: 2,
      solution: '商法則給出 $[(x+2)-x]/(x+2)^2=2/(x+2)^2$。',
      check: N => x => N.diff(t => t/(t+2), x)
    },
    {
      id: 'der-07', topic: 'derivative', difficulty: 2,
      stem: '若 $f(x)=\\sqrt{1+x^2}$，求 $f\'(x)$。',
      choices: [{ tex: '\\frac1{2\\sqrt{1+x^2}}', value: x => 1/(2*Math.sqrt(1+x*x)) }, { tex: '\\frac{x}{\\sqrt{1+x^2}}', value: x => x/Math.sqrt(1+x*x) }, { tex: '\\frac{2x}{\\sqrt{1+x^2}}', value: x => 2*x/Math.sqrt(1+x*x) }, { tex: '\\frac{x}{1+x^2}', value: x => x/(1+x*x) }],
      answer: 1,
      solution: '外層平方根微分後乘內層的 $2x$，約分得到 $x/\\sqrt{1+x^2}$。',
      check: N => x => N.diff(t => Math.sqrt(1+t*t), x)
    },
    {
      id: 'der-08', topic: 'derivative', difficulty: 3,
      stem: '若 $f(x)=\\arctan(3x)$，求 $f\'(x)$。',
      choices: [{ tex: '\\frac1{1+9x^2}', value: x => 1/(1+9*x*x) }, { tex: '\\frac3{1+3x^2}', value: x => 3/(1+3*x*x) }, { tex: '\\frac{-3}{1+9x^2}', value: x => -3/(1+9*x*x) }, { tex: '\\frac3{1+9x^2}', value: x => 3/(1+9*x*x) }],
      answer: 3,
      solution: '使用 $(\\arctan u)\'=u\'/(1+u^2)$，分子為 $3$，分母為 $1+9x^2$。',
      check: N => x => N.diff(t => Math.atan(3*t), x)
    },
    {
      id: 'der-09', topic: 'derivative', difficulty: 3,
      stem: '若 $f(x)=e^{x^2}$，求 $f\'(x)$。',
      choices: [{ tex: '2xe^{x^2}', value: x => 2*x*Math.exp(x*x) }, { tex: 'e^{x^2}', value: x => Math.exp(x*x) }, { tex: '2xe^x', value: x => 2*x*Math.exp(x) }, { tex: 'x^2e^{x^2}', value: x => x*x*Math.exp(x*x) }],
      answer: 0,
      solution: '內層 $x^2$ 的導數為 $2x$，鏈鎖律給出 $2xe^{x^2}$。',
      check: N => x => N.diff(t => Math.exp(t*t), x)
    },
    {
      id: 'der-10', topic: 'derivative', difficulty: 3,
      stem: '若 $f(x)=\\ln(\\sin x)$（$0<x<\\pi$），求 $f\'(x)$。',
      samples: [0.3, 0.7, 1.2, 2.1],
      choices: [{ tex: '\\frac1{\\sin x}', value: x => 1/Math.sin(x) }, { tex: '\\tan x', value: x => Math.tan(x) }, { tex: '\\frac{\\cos x}{\\sin x}', value: x => Math.cos(x)/Math.sin(x) }, { tex: '-\\frac{\\cos x}{\\sin x}', value: x => -Math.cos(x)/Math.sin(x) }],
      answer: 2,
      solution: '由對數與鏈鎖律，$f\'(x)=(\\sin x)\'/\\sin x=\\cos x/\\sin x$。',
      check: N => x => N.diff(t => Math.log(Math.sin(t)), x)
    },
    {
      id: 'int-01', topic: 'integral', difficulty: 1,
      stem: '求 $\\int_0^2 3x^2\\,dx$。',
      choices: [{ tex: '12', value: 12 }, { tex: '8', value: 8 }, { tex: '4', value: 4 }, { tex: '24', value: 24 }],
      answer: 1,
      solution: '反導函數為 $x^3$，代上下限得 $2^3-0^3=8$。',
      check: N => N.integrate(x => 3*x*x, 0, 2)
    },
    {
      id: 'int-02', topic: 'integral', difficulty: 1,
      stem: '求 $\\int_0^{\\pi/2}\\cos x\\,dx$。',
      choices: [{ tex: '0', value: 0 }, { tex: '-1', value: -1 }, { tex: '\\frac\\pi2', value: Math.PI/2 }, { tex: '1', value: 1 }],
      answer: 3,
      solution: '用反導函數 $\\sin x$，得到 $\\sin(\\pi/2)-\\sin0=1$。',
      check: N => N.integrate(Math.cos, 0, Math.PI/2)
    },
    {
      id: 'int-03', topic: 'integral', difficulty: 1,
      stem: '求 $\\int_1^3(2x-1)\\,dx$。',
      choices: [{ tex: '6', value: 6 }, { tex: '8', value: 8 }, { tex: '4', value: 4 }, { tex: '10', value: 10 }],
      answer: 0,
      solution: '反導函數為 $x^2-x$，故值為 $(9-3)-(1-1)=6$。',
      check: N => N.integrate(x => 2*x-1, 1, 3)
    },
    {
      id: 'int-04', topic: 'integral', difficulty: 2,
      stem: '求 $\\int_0^1 e^{2x}\\,dx$。',
      choices: [{ tex: 'e^2-1', value: Math.exp(2)-1 }, { tex: '2(e^2-1)', value: 2*(Math.exp(2)-1) }, { tex: '\\frac{e^2-1}2', value: (Math.exp(2)-1)/2 }, { tex: '\\frac{e-1}2', value: (Math.E-1)/2 }],
      answer: 2,
      solution: '反導函數為 $e^{2x}/2$，代入後為 $(e^2-1)/2$。',
      check: N => N.integrate(x => Math.exp(2*x), 0, 1)
    },
    {
      id: 'int-05', topic: 'integral', difficulty: 2,
      stem: '求 $\\int_0^1\\frac{2x}{1+x^2}\\,dx$。',
      choices: [{ tex: '\\frac12\\ln2', value: Math.log(2)/2 }, { tex: '\\ln2', value: Math.log(2) }, { tex: '2\\ln2', value: 2*Math.log(2) }, { tex: '\\frac12', value: 1/2 }],
      answer: 1,
      solution: '令 $u=1+x^2$，$du=2x\\,dx$，得到 $\\int_1^2du/u=\\ln2$。',
      check: N => N.integrate(x => 2*x/(1+x*x), 0, 1)
    },
    {
      id: 'int-06', topic: 'integral', difficulty: 2,
      stem: '求 $\\int_{-1}^1(x^3+2)\\,dx$。',
      choices: [{ tex: '0', value: 0 }, { tex: '2', value: 2 }, { tex: '\\frac92', value: 9/2 }, { tex: '4', value: 4 }],
      answer: 3,
      solution: '奇函數 $x^3$ 在對稱區間積分為零，常數項的積分是 $2\\cdot2=4$。',
      check: N => N.integrate(x => x*x*x+2, -1, 1)
    },
    {
      id: 'int-07', topic: 'integral', difficulty: 2,
      stem: '求 $\\int_0^2|x-1|\\,dx$。',
      choices: [{ tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '2', value: 2 }, { tex: '\\frac12', value: 1/2 }],
      answer: 0,
      solution: '在 $x=1$ 分段，左右各為底高皆一的三角形，總面積為 $1$。',
      check: N => N.integrate(x => Math.abs(x-1), 0, 2)
    },
    {
      id: 'int-08', topic: 'integral', difficulty: 3,
      stem: '求 $\\int_0^1 xe^x\\,dx$。',
      choices: [{ tex: 'e-1', value: Math.E-1 }, { tex: 'e', value: Math.E }, { tex: '1', value: 1 }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '分部積分得到 $xe^x-e^x$，上下限相減為 $0-(-1)=1$。',
      check: N => N.integrate(x => x*Math.exp(x), 0, 1)
    },
    {
      id: 'int-09', topic: 'integral', difficulty: 3,
      stem: '求 $\\int_0^\\pi\\sin^2x\\,dx$。',
      choices: [{ tex: '\\pi', value: Math.PI }, { tex: '\\frac\\pi2', value: Math.PI/2 }, { tex: '0', value: 0 }, { tex: '2', value: 2 }],
      answer: 1,
      solution: '用 $\\sin^2x=(1-\\cos2x)/2$，餘弦項在此區間積分為零，留下 $\\pi/2$。',
      check: N => N.integrate(x => Math.sin(x)**2, 0, Math.PI)
    },
    {
      id: 'int-10', topic: 'integral', difficulty: 3,
      stem: '求 $\\int_0^1 x\\sqrt{1+x^2}\\,dx$。',
      choices: [{ tex: '\\frac{2\\sqrt2-1}2', value: (2*Math.sqrt(2)-1)/2 }, { tex: '2\\sqrt2-1', value: 2*Math.sqrt(2)-1 }, { tex: '\\frac{\\sqrt2-1}3', value: (Math.sqrt(2)-1)/3 }, { tex: '\\frac{2\\sqrt2-1}3', value: (2*Math.sqrt(2)-1)/3 }],
      answer: 3,
      solution: '令 $u=1+x^2$，得 $\\frac12\\int_1^2u^{1/2}du=[u^{3/2}/3]_1^2$。',
      check: N => N.integrate(x => x*Math.sqrt(1+x*x), 0, 1)
    },
    {
      id: 'ser-01', topic: 'series', difficulty: 1,
      stem: '求等比級數 $\\sum_{n=0}^{\\infty}\\frac1{3^n}$ 的和。',
      choices: [{ tex: '3', value: 3 }, { tex: '\\frac12', value: 1/2 }, { tex: '\\frac32', value: 3/2 }, { tex: '1', value: 1 }],
      answer: 2,
      solution: '首項為 $1$，公比為 $1/3$，和為 $1/(1-1/3)=3/2$。',
      check: N => N.sum(n => 1/3**n, 0, 80)
    },
    {
      id: 'ser-02', topic: 'series', difficulty: 1,
      stem: '判斷 $\\sum_{n=1}^{\\infty}\\frac1n$ 是否收斂。',
      choices: [{ tex: '\\text{收斂}', value: 'converge' }, { tex: '\\text{發散}', value: 'diverge' }, { tex: '0', value: 0 }, { tex: '1', value: 1 }],
      answer: 1,
      solution: '這是 $p=1$ 的調和級數；雖然通項趨零，級數仍發散。',
      check: N => N.series(n => 1/n)
    },
    {
      id: 'ser-03', topic: 'series', difficulty: 1,
      stem: '判斷 $\\sum_{n=1}^{\\infty}\\frac1{n^2}$ 是否收斂。',
      choices: [{ tex: '\\text{收斂}', value: 'converge' }, { tex: '\\text{發散}', value: 'diverge' }, { tex: '0', value: 0 }, { tex: '1', value: 1 }],
      answer: 0,
      solution: '這是 $p=2>1$ 的 $p$ 級數，因此收斂。',
      check: N => N.series(n => 1/(n*n))
    },
    {
      id: 'ser-04', topic: 'series', difficulty: 2,
      stem: '判斷交錯級數 $\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}n$ 是否收斂。',
      choices: [{ tex: '\\text{發散}', value: 'diverge' }, { tex: '0', value: 0 }, { tex: '1', value: 1 }, { tex: '\\text{收斂}', value: 'converge' }],
      answer: 3,
      solution: '正項大小 $1/n$ 單調遞減至零，依交錯級數判別法收斂。',
      check: N => N.series(n => (-1)**(n+1)/n)
    },
    {
      id: 'ser-05', topic: 'series', difficulty: 2,
      stem: '判斷 $\\sum_{n=1}^{\\infty}\\frac{n}{n+1}$ 是否收斂。',
      choices: [{ tex: '\\text{收斂}', value: 'converge' }, { tex: '1', value: 1 }, { tex: '\\text{發散}', value: 'diverge' }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '通項 $n/(n+1)$ 趨近 $1$ 而非零，不符合級數收斂的必要條件。',
      check: N => N.series(n => n/(n+1))
    },
    {
      id: 'ser-06', topic: 'series', difficulty: 2,
      stem: '求 $\\sum_{n=1}^{\\infty}\\frac{n}{2^n}$ 的和。',
      choices: [{ tex: '1', value: 1 }, { tex: '2', value: 2 }, { tex: '\\frac12', value: 1/2 }, { tex: '4', value: 4 }],
      answer: 1,
      solution: '將等比級數微分後乘上 $r$，有 $\\sum nr^n=r/(1-r)^2$；代 $r=1/2$ 得 $2$。',
      check: N => N.sum(n => n/2**n, 1, 100)
    },
    {
      id: 'ser-07', topic: 'series', difficulty: 2,
      stem: '$e^{3x}$ 在 $x=0$ 的泰勒展開中，$x^2$ 項的係數是多少？',
      choices: [{ tex: '\\frac92', value: 9/2 }, { tex: '9', value: 9 }, { tex: '\\frac32', value: 3/2 }, { tex: '3', value: 3 }],
      answer: 0,
      solution: '係數為 $f\'\'(0)/2!$，由 $f\'\'(0)=9$ 得到 $9/2$。',
      check: N => N.diff(x => N.diff(t => Math.exp(3*t), x), 0)/2
    },
    {
      id: 'ser-08', topic: 'series', difficulty: 3,
      stem: '$\\sin2x$ 在 $x=0$ 的泰勒展開中，$x^3$ 項的係數是多少？',
      choices: [{ tex: '-8', value: -8 }, { tex: '\\frac43', value: 4/3 }, { tex: '-\\frac13', value: -1/3 }, { tex: '-\\frac43', value: -4/3 }],
      answer: 3,
      solution: '由 $\\sin2x=2x-(2x)^3/3!+\\cdots$，三次項係數為 $-8/6=-4/3$。',
      check: N => N.diff(x => N.diff(y => N.diff(t => Math.sin(2*t), y), x), 0)/6
    },
    {
      id: 'ser-09', topic: 'series', difficulty: 3,
      stem: '將 $x=6$ 代入冪級數 $\\sum_{n=1}^{\\infty}\\frac{(x-1)^n}{4^n}$，所得級數是否收斂？',
      choices: [{ tex: '\\text{收斂}', value: 'converge' }, { tex: '4', value: 4 }, { tex: '\\text{發散}', value: 'diverge' }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '代入後公比為 $(6-1)/4=5/4>1$，通項不趨零，所以發散。',
      check: N => N.series(n => ((6-1)/4)**n)
    },
    {
      id: 'ser-10', topic: 'series', difficulty: 3,
      stem: '判斷 $\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{\\sqrt n}$ 是否收斂。',
      choices: [{ tex: '\\text{發散}', value: 'diverge' }, { tex: '\\text{收斂}', value: 'converge' }, { tex: '0', value: 0 }, { tex: '1', value: 1 }],
      answer: 1,
      solution: '$1/\\sqrt n$ 單調遞減至零，交錯級數判別法保證收斂；絕對值級數則發散。',
      check: N => N.series(n => (-1)**(n+1)/Math.sqrt(n))
    }
  ];
  Calc.questions = questions;
  if (typeof module !== 'undefined') module.exports = questions;
}(typeof window !== 'undefined' ? window : globalThis));
