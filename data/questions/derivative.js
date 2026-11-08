(function (root) {
  var Calc = root.Calc = root.Calc || {};
  var questions = [
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
      id: 'der-11', topic: 'derivative', difficulty: 1,
      stem: '將 $f(x)=1/x^2$ 寫成冪次後微分，$f\'(x)$ 為何？',
      samples: [-2, -1, 0.5, 1.5],
      choices: [{ tex: '-2/x^3', value: x => -2/x**3 }, { tex: '2/x^3', value: x => 2/x**3 }, { tex: '-2/x', value: x => -2/x }, { tex: '-1/x^3', value: x => -1/x**3 }],
      answer: 0,
      solution: '因 $f(x)=x^{-2}$，冪次法則給出 $f\'(x)=-2x^{-3}$。',
      check: N => x => N.diff(t => 1/(t*t), x)
    },
    {
      id: 'der-12', topic: 'derivative', difficulty: 1,
      stem: '函數 $f(x)=x\\sqrt{x}$ 在 $x=4$ 的導數值是多少？',
      choices: [{ tex: '2', value: 2 }, { tex: '3', value: 3 }, { tex: '6', value: 6 }, { tex: '1/4', value: 1/4 }],
      answer: 1,
      solution: '將函數寫成 $x^{3/2}$，得 $f\'(x)=\\frac32\\sqrt{x}$，代入 $4$ 得 $3$。',
      check: N => N.diff(x => x*Math.sqrt(x), 4)
    },
    {
      id: 'der-13', topic: 'derivative', difficulty: 1,
      stem: '設 $f(x)=ax^2+x$，其中 $a$ 為常數。若 $f\'(1)=5$，求 $a$。',
      choices: [{ tex: '5/2', value: 5/2 }, { tex: '4', value: 4 }, { tex: '2', value: 2 }, { tex: '3', value: 3 }],
      answer: 2,
      solution: '由 $f\'(x)=2ax+1$，得 $2a+1=5$，故 $a=2$。',
      check: N => N.roots(a => N.diff(x => a*x*x+x, 1)-5, 0, 5)[0]
    },
    {
      id: 'der-14', topic: 'derivative', difficulty: 1,
      stem: '若 $g(x)=\\pi^2$ 對所有實數 $x$ 都成立，則 $g\'(x)$ 為何？',
      choices: [{ tex: '2\\pi', value: 2*Math.PI }, { tex: '\\pi^2', value: Math.PI**2 }, { tex: '1', value: 1 }, { tex: '0', value: 0 }],
      answer: 3,
      solution: '$\\pi^2$ 是常數，與 $x$ 無關，所以導數為 $0$。',
      check: N => x => N.diff(() => Math.PI**2, x)
    },
    {
      id: 'der-15', topic: 'derivative', difficulty: 1,
      stem: '對乘積 $p(x)=(x+1)(x-1)$ 使用乘法律，所得 $p\'(x)$ 為何？',
      choices: [{ tex: '2x', value: x => 2*x }, { tex: '1', value: 1 }, { tex: 'x-1', value: x => x-1 }, { tex: 'x+1', value: x => x+1 }],
      answer: 0,
      solution: '兩個因子的導數皆為 $1$，所以 $p\'(x)=(x-1)+(x+1)=2x$。',
      check: N => x => N.diff(t => (t+1)*(t-1), x)
    },
    {
      id: 'der-16', topic: 'derivative', difficulty: 1,
      stem: '令 $q(x)=(2x+1)/x$。求 $q\'(2)$。',
      choices: [{ tex: '1/4', value: 1/4 }, { tex: '-1/4', value: -1/4 }, { tex: '2', value: 2 }, { tex: '-1', value: -1 }],
      answer: 1,
      solution: '商法則得 $q\'(x)=[2x-(2x+1)]/x^2=-1/x^2$，代入 $2$ 得 $-1/4$。',
      check: N => N.diff(x => (2*x+1)/x, 2)
    },
    {
      id: 'der-17', topic: 'derivative', difficulty: 1,
      stem: '餘弦函數 $c(x)=\\cos x$ 的導函數是哪一個？',
      choices: [{ tex: '\\sin x', value: x => Math.sin(x) }, { tex: '-\\cos x', value: x => -Math.cos(x) }, { tex: '-\\sin x', value: x => -Math.sin(x) }, { tex: '\\cos x', value: x => Math.cos(x) }],
      answer: 2,
      solution: '餘弦的導數為負正弦，故 $c\'(x)=-\\sin x$。',
      check: N => x => N.diff(t => Math.cos(t), x)
    },
    {
      id: 'der-18', topic: 'derivative', difficulty: 1,
      stem: '若 $t(x)=\\tan x$，則 $t\'(0)$ 等於多少？',
      choices: [{ tex: '0', value: 0 }, { tex: '-1', value: -1 }, { tex: '\\text{不存在}', value: 'DNE' }, { tex: '1', value: 1 }],
      answer: 3,
      solution: '$t\'(x)=\\sec^2x$，所以 $t\'(0)=1$。',
      check: N => N.diff(x => Math.tan(x), 0)
    },
    {
      id: 'der-19', topic: 'derivative', difficulty: 1,
      stem: '自然對數 $L(x)=\\ln x$ 在 $x=e$ 的導數值為何？',
      choices: [{ tex: '1/e', value: 1/Math.E }, { tex: '1', value: 1 }, { tex: 'e', value: Math.E }, { tex: '-1/e', value: -1/Math.E }],
      answer: 0,
      solution: '$L\'(x)=1/x$，故 $L\'(e)=1/e$。',
      check: N => N.diff(x => Math.log(x), Math.E)
    },
    {
      id: 'der-20', topic: 'derivative', difficulty: 1,
      stem: '底數為常數的指數函數 $a(x)=3^x$，其導函數為何？',
      choices: [{ tex: '3^x', value: x => 3**x }, { tex: '3^x\\ln3', value: x => 3**x*Math.log(3) }, { tex: 'x3^{x-1}', value: x => x*3**(x-1) }, { tex: '3^x/\\ln3', value: x => 3**x/Math.log(3) }],
      answer: 1,
      solution: '寫成 $e^{x\\ln3}$ 後使用連鎖律，得 $a\'(x)=3^x\\ln3$。',
      check: N => x => N.diff(t => 3**t, x)
    },
    {
      id: 'der-21', topic: 'derivative', difficulty: 1,
      stem: '反餘弦函數 $r(x)=\\arccos x$ 在 $x=1/2$ 的導數值為何？',
      choices: [{ tex: '2/\\sqrt3', value: 2/Math.sqrt(3) }, { tex: '-4/3', value: -4/3 }, { tex: '-2/\\sqrt3', value: -2/Math.sqrt(3) }, { tex: '-\\sqrt3/2', value: -Math.sqrt(3)/2 }],
      answer: 2,
      solution: '由 $r\'(x)=-1/\\sqrt{1-x^2}$，代入 $x=1/2$ 得 $-2/\\sqrt3$。',
      check: N => N.diff(x => Math.acos(x), 0.5)
    },
    {
      id: 'der-22', topic: 'derivative', difficulty: 1,
      stem: '在 $-1<x<1$ 上，$s(x)=\\arcsin x$ 的導數是哪一個？',
      samples: [-0.7, -0.2, 0.3, 0.6],
      choices: [{ tex: '-1/\\sqrt{1-x^2}', value: x => -1/Math.sqrt(1-x*x) }, { tex: '1/(1-x^2)', value: x => 1/(1-x*x) }, { tex: '1/\\sqrt{1+x^2}', value: x => 1/Math.sqrt(1+x*x) }, { tex: '1/\\sqrt{1-x^2}', value: x => 1/Math.sqrt(1-x*x) }],
      answer: 3,
      solution: '反正弦的微分公式為 $s\'(x)=1/\\sqrt{1-x^2}$。',
      check: N => x => N.diff(t => Math.asin(t), x)
    },
    {
      id: 'der-23', topic: 'derivative', difficulty: 1,
      stem: '依導數定義，極限 $\\displaystyle\\lim_{h\\to0}\\frac{\\sqrt{4+h}-2}{h}$ 為何？',
      choices: [{ tex: '1/4', value: 1/4 }, { tex: '1/2', value: 1/2 }, { tex: '2', value: 2 }, { tex: '0', value: 0 }],
      answer: 0,
      solution: '此式為 $f(x)=\\sqrt{x}$ 的 $f\'(4)$；有理化後分母趨近 $2+2$，故極限為 $1/4$。',
      check: N => N.limit(h => (Math.sqrt(4+h)-2)/h, 0)
    },
    {
      id: 'der-24', topic: 'derivative', difficulty: 1,
      stem: '使用差商判斷：$f(x)=|x|$ 在 $x=0$ 的導數為何？',
      choices: [{ tex: '0', value: 0 }, { tex: '\\text{不存在}', value: 'DNE' }, { tex: '1', value: 1 }, { tex: '-1', value: -1 }],
      answer: 1,
      solution: '差商為 $|h|/h$，右極限為 $1$，左極限為 $-1$；兩者不同，所以導數不存在。',
      check: N => N.limit(h => (Math.abs(h)-Math.abs(0))/h, 0)
    },
    {
      id: 'der-25', topic: 'derivative', difficulty: 2,
      stem: '設 $f(x)=x^2\\ln x$（$x>0$），求其導函數。',
      samples: [0.4, 0.8, 1.5, 2.3],
      choices: [{ tex: '2x\\ln x', value: x => 2*x*Math.log(x) }, { tex: '2', value: 2 }, { tex: '2x\\ln x+x', value: x => 2*x*Math.log(x)+x }, { tex: '2x\\ln x+1/x', value: x => 2*x*Math.log(x)+1/x }],
      answer: 2,
      solution: '乘法律給出 $2x\\ln x+x^2(1/x)$，化簡為 $2x\\ln x+x$。',
      check: N => x => N.diff(t => t*t*Math.log(t), x)
    },
    {
      id: 'der-26', topic: 'derivative', difficulty: 2,
      stem: '指數與三角函數的乘積 $g(x)=e^x\\sin x$，微分後為何？',
      choices: [{ tex: 'e^x\\cos x', value: x => Math.exp(x)*Math.cos(x) }, { tex: 'e^x(\\sin x-\\cos x)', value: x => Math.exp(x)*(Math.sin(x)-Math.cos(x)) }, { tex: 'e^x\\sin x', value: x => Math.exp(x)*Math.sin(x) }, { tex: 'e^x(\\sin x+\\cos x)', value: x => Math.exp(x)*(Math.sin(x)+Math.cos(x)) }],
      answer: 3,
      solution: '兩個因子分別微分並相加，得 $g\'(x)=e^x\\sin x+e^x\\cos x$。',
      check: N => x => N.diff(t => Math.exp(t)*Math.sin(t), x)
    },
    {
      id: 'der-27', topic: 'derivative', difficulty: 2,
      stem: '對 $u(x)=\\frac{\\ln x}{x}$（$x>0$）使用除法律，結果為何？',
      samples: [0.4, 0.8, 1.5, 2.3],
      choices: [{ tex: '(1-\\ln x)/x^2', value: x => (1-Math.log(x))/(x*x) }, { tex: '(\\ln x-1)/x^2', value: x => (Math.log(x)-1)/(x*x) }, { tex: '1/x', value: x => 1/x }, { tex: '(1-\\ln x)/x', value: x => (1-Math.log(x))/x }],
      answer: 0,
      solution: '分子為 $(1/x)x-\\ln x$，分母為 $x^2$，故 $u\'(x)=(1-\\ln x)/x^2$。',
      check: N => x => N.diff(t => Math.log(t)/t, x)
    },
    {
      id: 'der-28', topic: 'derivative', difficulty: 2,
      stem: '求分式 $v(x)=\\frac{\\sin x}{1+x^2}$ 的導函數。',
      choices: [{ tex: '\\frac{\\cos x}{2x}', value: x => Math.cos(x)/(2*x) }, { tex: '\\frac{(1+x^2)\\cos x-2x\\sin x}{(1+x^2)^2}', value: x => ((1+x*x)*Math.cos(x)-2*x*Math.sin(x))/(1+x*x)**2 }, { tex: '\\frac{(1+x^2)\\cos x+2x\\sin x}{(1+x^2)^2}', value: x => ((1+x*x)*Math.cos(x)+2*x*Math.sin(x))/(1+x*x)**2 }, { tex: '\\frac{(1+x^2)\\cos x-2x\\sin x}{1+x^2}', value: x => ((1+x*x)*Math.cos(x)-2*x*Math.sin(x))/(1+x*x) }],
      answer: 1,
      solution: '除法律的分子是分母乘分子導數，再減去分子乘分母導數；分母須平方。',
      check: N => x => N.diff(t => Math.sin(t)/(1+t*t), x)
    },
    {
      id: 'der-29', topic: 'derivative', difficulty: 2,
      stem: '依序處理三層函數 $w(x)=\\sin((x^2+1)^3)$，求 $w\'(x)$。',
      samples: [-0.5, -0.2, 0.3, 0.7],
      choices: [{ tex: '3(x^2+1)^2\\cos((x^2+1)^3)', value: x => 3*(x*x+1)**2*Math.cos((x*x+1)**3) }, { tex: '6x\\cos((x^2+1)^3)', value: x => 6*x*Math.cos((x*x+1)**3) }, { tex: '6x(x^2+1)^2\\cos((x^2+1)^3)', value: x => 6*x*(x*x+1)**2*Math.cos((x*x+1)**3) }, { tex: '-6x(x^2+1)^2\\cos((x^2+1)^3)', value: x => -6*x*(x*x+1)**2*Math.cos((x*x+1)**3) }],
      answer: 2,
      solution: '由外而內的導數因子為 $\\cos((x^2+1)^3)$、$3(x^2+1)^2$、$2x$，三者相乘即可。',
      check: N => x => N.diff(t => Math.sin((t*t+1)**3), x)
    },
    {
      id: 'der-30', topic: 'derivative', difficulty: 2,
      stem: '若 $F(x)=\\ln\\sqrt{1+e^x}$，則 $F\'(x)$ 應為何？',
      choices: [{ tex: '\\frac1{2(1+e^x)}', value: x => 1/(2*(1+Math.exp(x))) }, { tex: '\\frac{e^x}{1+e^x}', value: x => Math.exp(x)/(1+Math.exp(x)) }, { tex: '\\frac{e^x}{2\\sqrt{1+e^x}}', value: x => Math.exp(x)/(2*Math.sqrt(1+Math.exp(x))) }, { tex: '\\frac{e^x}{2(1+e^x)}', value: x => Math.exp(x)/(2*(1+Math.exp(x))) }],
      answer: 3,
      solution: '先寫成 $F(x)=\\frac12\\ln(1+e^x)$，再乘上內層的導數 $e^x$。',
      check: N => x => N.diff(t => Math.log(Math.sqrt(1+Math.exp(t))), x)
    },
    {
      id: 'der-31', topic: 'derivative', difficulty: 2,
      stem: '在 $-\\pi/2<x<\\pi/2$ 上，函數 $S(x)=1/\\cos x$ 的導數為何？',
      samples: [-0.7, -0.2, 0.4, 1],
      choices: [{ tex: '\\sin x/\\cos^2x', value: x => Math.sin(x)/Math.cos(x)**2 }, { tex: '-\\sin x/\\cos^2x', value: x => -Math.sin(x)/Math.cos(x)**2 }, { tex: '-1/\\sin x', value: x => -1/Math.sin(x) }, { tex: '\\sin x/\\cos x', value: x => Math.sin(x)/Math.cos(x) }],
      answer: 0,
      solution: '將函數寫成 $(\\cos x)^{-1}$，得 $S\'(x)=-(\\cos x)^{-2}(-\\sin x)$。',
      check: N => x => N.diff(t => 1/Math.cos(t), x)
    },
    {
      id: 'der-32', topic: 'derivative', difficulty: 2,
      stem: '複合反正切函數 $A(x)=\\arctan(x^2)$ 的導函數為何？',
      choices: [{ tex: '\\frac1{1+x^4}', value: x => 1/(1+x**4) }, { tex: '\\frac{2x}{1+x^4}', value: x => 2*x/(1+x**4) }, { tex: '\\frac{2x}{1+x^2}', value: x => 2*x/(1+x*x) }, { tex: '-\\frac{2x}{1+x^4}', value: x => -2*x/(1+x**4) }],
      answer: 1,
      solution: '使用 $u\'/(1+u^2)$ 並令 $u=x^2$，分子為 $2x$，分母為 $1+x^4$。',
      check: N => x => N.diff(t => Math.atan(t*t), x)
    },
    {
      id: 'der-33', topic: 'derivative', difficulty: 2,
      stem: '曲線 $x^2+xy+y^2=7$ 在點 $(1,2)$ 的 $dy/dx$ 為何？',
      choices: [{ tex: '4/5', value: 4/5 }, { tex: '-1/2', value: -1/2 }, { tex: '-4/5', value: -4/5 }, { tex: '-4/3', value: -4/3 }],
      answer: 2,
      solution: '隱微分得 $2x+y+xy\'+2yy\'=0$，所以 $y\'=-(2x+y)/(x+2y)$，代入得 $-4/5$。',
      check: N => {
        const F = (x, y) => x*x+x*y+y*y-7;
        return -N.diff(x => F(x, 2), 1)/N.diff(y => F(1, y), 2);
      }
    },
    {
      id: 'der-34', topic: 'derivative', difficulty: 2,
      stem: '由 $e^y+xy=e+1$ 決定的曲線，在 $(1,1)$ 的 $dy/dx$ 等於多少？',
      choices: [{ tex: '-1/e', value: -1/Math.E }, { tex: '1/(e+1)', value: 1/(Math.E+1) }, { tex: '-1', value: -1 }, { tex: '-1/(e+1)', value: -1/(Math.E+1) }],
      answer: 3,
      solution: '兩邊微分得 $e^yy\'+y+xy\'=0$，故 $y\'=-y/(e^y+x)$；代入得 $-1/(e+1)$。',
      check: N => {
        const F = (x, y) => Math.exp(y)+x*y-Math.E-1;
        return -N.diff(x => F(x, 1), 1)/N.diff(y => F(1, y), 1);
      }
    },
    {
      id: 'der-35', topic: 'derivative', difficulty: 2,
      stem: '多項式 $P(x)=x^4-2x^3$ 的二階導函數 $P\'\'(x)$ 為何？',
      choices: [{ tex: '12x^2-12x', value: x => 12*x*x-12*x }, { tex: '4x^3-6x^2', value: x => 4*x**3-6*x*x }, { tex: '12x^2-6x', value: x => 12*x*x-6*x }, { tex: '24x-12', value: x => 24*x-12 }],
      answer: 0,
      solution: '先得 $P\'(x)=4x^3-6x^2$，再微分一次得 $P\'\'(x)=12x^2-12x$。',
      check: N => x => N.diff(t => N.diff(u => u**4-2*u**3, t), x)
    },
    {
      id: 'der-36', topic: 'derivative', difficulty: 2,
      stem: '令 $B(x)=\\sin x$，連續微分兩次後 $B\'\'(x)$ 是哪一個？',
      choices: [{ tex: '\\sin x', value: x => Math.sin(x) }, { tex: '-\\sin x', value: x => -Math.sin(x) }, { tex: '\\cos x', value: x => Math.cos(x) }, { tex: '-\\cos x', value: x => -Math.cos(x) }],
      answer: 1,
      solution: '第一次微分為 $\\cos x$，第二次微分為 $-\\sin x$。',
      check: N => x => N.diff(t => N.diff(u => Math.sin(u), t), x)
    },
    {
      id: 'der-37', topic: 'derivative', difficulty: 2,
      stem: '用對數微分法求 $f(x)=x^x$（$x>0$）在 $x=2$ 的導數值。',
      choices: [{ tex: '4\\ln2', value: 4*Math.log(2) }, { tex: '4', value: 4 }, { tex: '4(\\ln2+1)', value: 4*(Math.log(2)+1) }, { tex: '\\ln2+1', value: Math.log(2)+1 }],
      answer: 2,
      solution: '由 $\\ln f=x\\ln x$ 得 $f\'/f=\\ln x+1$，所以 $f\'(2)=4(\\ln2+1)$。',
      check: N => N.diff(x => x**x, 2)
    },
    {
      id: 'der-38', topic: 'derivative', difficulty: 3,
      stem: '三個因子的乘積 $H(x)=xe^x\\ln x$（$x>0$），求 $H\'(x)$。',
      samples: [0.4, 0.8, 1.5, 2.3],
      choices: [{ tex: 'e^x((x+1)\\ln x)', value: x => Math.exp(x)*(x+1)*Math.log(x) }, { tex: 'e^x', value: x => Math.exp(x) }, { tex: 'e^x(x\\ln x+1)', value: x => Math.exp(x)*(x*Math.log(x)+1) }, { tex: 'e^x((x+1)\\ln x+1)', value: x => Math.exp(x)*((x+1)*Math.log(x)+1) }],
      answer: 3,
      solution: '依序微分三個因子，得 $e^x\\ln x+xe^x\\ln x+e^x$；提出 $e^x$ 即得答案。',
      check: N => x => N.diff(t => t*Math.exp(t)*Math.log(t), x)
    },
    {
      id: 'der-39', topic: 'derivative', difficulty: 3,
      stem: '同時使用除法律與連鎖律，求 $R(x)=e^{x^2}/(x+1)$（$x\\ne-1$）的導函數。',
      samples: [-0.5, -0.2, 0.4, 1.3],
      choices: [{ tex: '\\frac{e^{x^2}(2x(x+1)-1)}{(x+1)^2}', value: x => Math.exp(x*x)*(2*x*(x+1)-1)/(x+1)**2 }, { tex: '\\frac{e^{x^2}x}{(x+1)^2}', value: x => Math.exp(x*x)*x/(x+1)**2 }, { tex: '\\frac{e^{x^2}(2x(x+1)+1)}{(x+1)^2}', value: x => Math.exp(x*x)*(2*x*(x+1)+1)/(x+1)**2 }, { tex: '\\frac{e^{x^2}(2x(x+1)-1)}{x+1}', value: x => Math.exp(x*x)*(2*x*(x+1)-1)/(x+1) }],
      answer: 0,
      solution: '分子的導數為 $2xe^{x^2}$；代入除法律後，分子可提出 $e^{x^2}$，分母為 $(x+1)^2$。',
      check: N => x => N.diff(t => Math.exp(t*t)/(t+1), x)
    },
    {
      id: 'der-40', topic: 'derivative', difficulty: 3,
      stem: '若 $J(x)=\\sin(e^{x^2})$，求 $J\'(1)$。',
      choices: [{ tex: 'e\\cos e', value: Math.E*Math.cos(Math.E) }, { tex: '2e\\cos e', value: 2*Math.E*Math.cos(Math.E) }, { tex: '2\\cos e', value: 2*Math.cos(Math.E) }, { tex: '2e\\cos1', value: 2*Math.E*Math.cos(1) }],
      answer: 1,
      solution: '依三層連鎖律得 $J\'(x)=\\cos(e^{x^2})e^{x^2}(2x)$，代入 $1$ 得 $2e\\cos e$。',
      check: N => N.diff(x => Math.sin(Math.exp(x*x)), 1)
    },
    {
      id: 'der-41', topic: 'derivative', difficulty: 3,
      stem: '對 $K(x)=\\ln(\\ln(1+x^2))$（$x>0$）進行微分，結果為何？',
      samples: [0.5, 1, 1.5, 2],
      choices: [{ tex: '\\frac1{\\ln(1+x^2)}', value: x => 1/Math.log(1+x*x) }, { tex: '\\frac{2x}{1+x^2}', value: x => 2*x/(1+x*x) }, { tex: '\\frac{2x}{(1+x^2)\\ln(1+x^2)}', value: x => 2*x/((1+x*x)*Math.log(1+x*x)) }, { tex: '\\frac1{(1+x^2)\\ln(1+x^2)}', value: x => 1/((1+x*x)*Math.log(1+x*x)) }],
      answer: 2,
      solution: '外層對數微分給出 $1/\\ln(1+x^2)$，再乘內層導數 $2x/(1+x^2)$。',
      check: N => x => N.diff(t => Math.log(Math.log(1+t*t)), x)
    },
    {
      id: 'der-42', topic: 'derivative', difficulty: 3,
      stem: '令 $U(x)=\\arcsin\\left(\\frac{x}{\\sqrt{1+x^2}}\\right)$，求 $U\'(x)$。',
      choices: [{ tex: '1/\\sqrt{1+x^2}', value: x => 1/Math.sqrt(1+x*x) }, { tex: '1/(1+x^2)^{3/2}', value: x => 1/(1+x*x)**1.5 }, { tex: '-1/(1+x^2)', value: x => -1/(1+x*x) }, { tex: '1/(1+x^2)', value: x => 1/(1+x*x) }],
      answer: 3,
      solution: '內層導數為 $(1+x^2)^{-3/2}$，反正弦公式的分母為 $\\sqrt{1-x^2/(1+x^2)}=(1+x^2)^{-1/2}$；相除得 $1/(1+x^2)$。',
      check: N => x => N.diff(t => Math.asin(t/Math.sqrt(1+t*t)), x)
    },
    {
      id: 'der-43', topic: 'derivative', difficulty: 3,
      stem: '在 $x>0$ 上，$V(x)=\\arccos(e^{-x})$ 的導數為何？',
      samples: [0.3, 0.7, 1.2, 2],
      choices: [{ tex: '\\frac{e^{-x}}{\\sqrt{1-e^{-2x}}}', value: x => Math.exp(-x)/Math.sqrt(1-Math.exp(-2*x)) }, { tex: '-\\frac{e^{-x}}{\\sqrt{1-e^{-2x}}}', value: x => -Math.exp(-x)/Math.sqrt(1-Math.exp(-2*x)) }, { tex: '\\frac1{\\sqrt{1-e^{-2x}}}', value: x => 1/Math.sqrt(1-Math.exp(-2*x)) }, { tex: '\\frac{e^{-x}}{\\sqrt{1-e^{-x}}}', value: x => Math.exp(-x)/Math.sqrt(1-Math.exp(-x)) }],
      answer: 0,
      solution: '反餘弦公式中的負號與 $(e^{-x})\'=-e^{-x}$ 抵消，分母內須將 $e^{-x}$ 平方。',
      check: N => x => N.diff(t => Math.acos(Math.exp(-t)), x)
    },
    {
      id: 'der-44', topic: 'derivative', difficulty: 3,
      stem: '在 $x,y>0$ 的曲線 $x^y+y^x=3$ 上，求點 $(2,1)$ 的 $dy/dx$。',
      choices: [{ tex: '-1/(2\\ln2)', value: -1/(2*Math.log(2)) }, { tex: '-1/(2\\ln2+2)', value: -1/(2*Math.log(2)+2) }, { tex: '1/(2\\ln2+2)', value: 1/(2*Math.log(2)+2) }, { tex: '-1/(\\ln2+2)', value: -1/(Math.log(2)+2) }],
      answer: 1,
      solution: '微分得 $x^y(y\'\\ln x+y/x)+y^x(\\ln y+xy\'/y)=0$。代入 $(2,1)$ 得 $1+(2\\ln2+2)y\'=0$。',
      check: N => {
        const F = (x, y) => x**y+y**x-3;
        return -N.diff(x => F(x, 1), 2)/N.diff(y => F(2, y), 1);
      }
    },
    {
      id: 'der-45', topic: 'derivative', difficulty: 3,
      stem: '令 $T(x)=x^5$，求三階導數在 $x=1$ 的值 $T^{(3)}(1)$。',
      choices: [{ tex: '20', value: 20 }, { tex: '120', value: 120 }, { tex: '60', value: 60 }, { tex: '5', value: 5 }],
      answer: 2,
      solution: '依序微分為 $5x^4$、$20x^3$、$60x^2$，所以 $T^{(3)}(1)=60$。',
      check: N => N.diff(x => N.diff(t => N.diff(u => u**5, t), x), 1)
    },
    {
      id: 'der-46', topic: 'derivative', difficulty: 3,
      stem: '對 $E(x)=e^{2x}$ 連續微分兩次，求 $E\'\'(x)$。',
      choices: [{ tex: '2e^{2x}', value: x => 2*Math.exp(2*x) }, { tex: 'e^{2x}', value: x => Math.exp(2*x) }, { tex: '4e^x', value: x => 4*Math.exp(x) }, { tex: '4e^{2x}', value: x => 4*Math.exp(2*x) }],
      answer: 3,
      solution: '每微分一次都須乘上內層導數 $2$，故 $E\'\'(x)=2\\cdot2e^{2x}=4e^{2x}$。',
      check: N => x => N.diff(t => N.diff(u => Math.exp(2*u), t), x)
    },
    {
      id: 'der-47', topic: 'derivative', difficulty: 3,
      stem: '將差商辨認為導數，求 $\\displaystyle\\lim_{h\\to0}\\frac{\\sin((1+h)^2)-\\sin1}{h}$。',
      choices: [{ tex: '2\\cos1', value: 2*Math.cos(1) }, { tex: '\\cos1', value: Math.cos(1) }, { tex: '2\\sin1', value: 2*Math.sin(1) }, { tex: '-2\\cos1', value: -2*Math.cos(1) }],
      answer: 0,
      solution: '此式為 $f(x)=\\sin(x^2)$ 在 $1$ 的導數；由 $f\'(x)=2x\\cos(x^2)$ 得 $2\\cos1$。',
      check: N => N.limit(h => (Math.sin((1+h)**2)-Math.sin(1))/h, 0)
    },
    {
      id: 'der-48', topic: 'derivative', difficulty: 3,
      stem: '對底數與指數都含 $x$ 的 $Y(x)=(1+x)^{\\sin x}$（$x>-1$），求 $Y\'(x)$。',
      samples: [-0.5, 0.3, 0.7, 1.2],
      choices: [{ tex: '(1+x)^{\\sin x}\\frac{\\sin x}{1+x}', value: x => (1+x)**Math.sin(x)*Math.sin(x)/(1+x) }, { tex: '(1+x)^{\\sin x}\\left(\\cos x\\ln(1+x)+\\frac{\\sin x}{1+x}\\right)', value: x => (1+x)**Math.sin(x)*(Math.cos(x)*Math.log(1+x)+Math.sin(x)/(1+x)) }, { tex: '(1+x)^{\\sin x}\\cos x\\ln(1+x)', value: x => (1+x)**Math.sin(x)*Math.cos(x)*Math.log(1+x) }, { tex: '\\cos x\\ln(1+x)+\\frac{\\sin x}{1+x}', value: x => Math.cos(x)*Math.log(1+x)+Math.sin(x)/(1+x) }],
      answer: 1,
      solution: '取對數得 $\\ln Y=\\sin x\\ln(1+x)$，微分右側須用乘法律；最後乘回 $Y$。',
      check: N => x => N.diff(t => (1+t)**Math.sin(t), x)
    },
    {
      id: 'der-49', topic: 'derivative', difficulty: 3,
      stem: '使用對數微分法，求 $Z(x)=\\frac{(1+x^2)^x}{\\sqrt{x}}$（$x>0$）的 $Z\'(1)$。',
      choices: [{ tex: '2\\ln2+2', value: 2*Math.log(2)+2 }, { tex: '\\ln2+1/2', value: Math.log(2)+0.5 }, { tex: '2\\ln2+1', value: 2*Math.log(2)+1 }, { tex: '2\\ln2+3', value: 2*Math.log(2)+3 }],
      answer: 2,
      solution: '由 $\\ln Z=x\\ln(1+x^2)-\\frac12\\ln x$ 得 $Z\'/Z=\\ln(1+x^2)+2x^2/(1+x^2)-1/(2x)$。在 $x=1$ 時 $Z=2$，故 $Z\'(1)=2\\ln2+1$。',
      check: N => N.diff(x => (1+x*x)**x/Math.sqrt(x), 1)
    },
    {
      id: 'der-50', topic: 'derivative', difficulty: 3,
      stem: '若 $Q(x)=\\ln(1+x^2)$，求包含除法律步驟的二階導函數 $Q\'\'(x)$。',
      choices: [{ tex: '\\frac{2x}{1+x^2}', value: x => 2*x/(1+x*x) }, { tex: '\\frac2{1+x^2}', value: x => 2/(1+x*x) }, { tex: '\\frac{2(1-x^2)}{1+x^2}', value: x => 2*(1-x*x)/(1+x*x) }, { tex: '\\frac{2(1-x^2)}{(1+x^2)^2}', value: x => 2*(1-x*x)/(1+x*x)**2 }],
      answer: 3,
      solution: '先得 $Q\'(x)=2x/(1+x^2)$；再用除法律得 $[2(1+x^2)-4x^2]/(1+x^2)^2$。',
      check: N => x => N.diff(t => N.diff(u => Math.log(1+u*u), t), x)
    }
  ];
  Calc.questionBank = Calc.questionBank || {};
  Calc.questionBank['derivative'] = questions;
  if (typeof module !== 'undefined') module.exports = questions;
}(typeof window !== 'undefined' ? window : globalThis));
