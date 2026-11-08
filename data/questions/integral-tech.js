(function (root) {
  var Calc = root.Calc = root.Calc || {};
  var questions = [
    {
      id: 'itc-01', topic: 'integral-tech', difficulty: 1,
      stem: '求 $\\int x(1+x^2)^4\\,dx$。',
      choices: [
        { tex: '\\frac{(1+x^2)^5}{5}+C', value: x => (1+x*x)**5/5 },
        { tex: '\\frac{(1+x^2)^5}{10}+C', value: x => (1+x*x)**5/10 },
        { tex: '\\frac{(1+x^2)^5}{2}+C', value: x => (1+x*x)**5/2 },
        { tex: '\\frac{(1+x^2)^4}{8}+C', value: x => (1+x*x)**4/8 }
      ],
      answer: 1, upToConstant: true,
      solution: '令 $u=1+x^2$，則 $x\\,dx=du/2$。積分為 $\\frac12\\int u^4\\,du=u^5/10+C$。',
      check: N => x => N.integrate(t => t*(1+t*t)**4, 0, x)
    },
    {
      id: 'itc-02', topic: 'integral-tech', difficulty: 1,
      stem: '求 $\\int e^{\\sin x}\\cos x\\,dx$。',
      choices: [
        { tex: 'e^{\\cos x}+C', value: x => Math.exp(Math.cos(x)) },
        { tex: '-e^{\\sin x}+C', value: x => -Math.exp(Math.sin(x)) },
        { tex: '\\sin x\\,e^{\\sin x}+C', value: x => Math.sin(x)*Math.exp(Math.sin(x)) },
        { tex: 'e^{\\sin x}+C', value: x => Math.exp(Math.sin(x)) }
      ],
      answer: 3, upToConstant: true,
      solution: '取 $u=\\sin x$，恰有 $du=\\cos x\\,dx$。因此結果為 $e^u+C=e^{\\sin x}+C$。',
      check: N => x => N.integrate(t => Math.exp(Math.sin(t))*Math.cos(t), 0, x)
    },
    {
      id: 'itc-03', topic: 'integral-tech', difficulty: 1,
      stem: '在 $x>0$ 上，求 $\\int\\frac{(\\ln x)^2}{x}\\,dx$。',
      choices: [
        { tex: '\\frac{(\\ln x)^3}{3}+C', value: x => Math.log(x)**3/3 },
        { tex: '\\frac{(\\ln x)^2}{2}+C', value: x => Math.log(x)**2/2 },
        { tex: '(\\ln x)^3+C', value: x => Math.log(x)**3 },
        { tex: 'x(\\ln x)^2+C', value: x => x*Math.log(x)**2 }
      ],
      answer: 0, upToConstant: true, samples: [0.5, 0.8, 1.4, 2, 3],
      solution: '令 $u=\\ln x$，$du=dx/x$，原式化為 $\\int u^2\\,du=u^3/3+C$。',
      check: N => x => N.integrate(t => Math.log(t)**2/t, 1, x)
    },
    {
      id: 'itc-04', topic: 'integral-tech', difficulty: 1,
      stem: '求 $\\int\\frac{e^x}{1+e^x}\\,dx$。',
      choices: [
        { tex: '\\frac{1}{1+e^x}+C', value: x => 1/(1+Math.exp(x)) },
        { tex: '\\ln(1+e^{-x})+C', value: x => Math.log(1+Math.exp(-x)) },
        { tex: '\\ln(1+e^x)+C', value: x => Math.log(1+Math.exp(x)) },
        { tex: 'e^x\\ln(1+e^x)+C', value: x => Math.exp(x)*Math.log(1+Math.exp(x)) }
      ],
      answer: 2, upToConstant: true,
      solution: '取 $u=1+e^x$，則 $du=e^x\\,dx$。因 $u>0$，積分為 $\\ln u+C$。',
      check: N => x => N.integrate(t => Math.exp(t)/(1+Math.exp(t)), 0, x)
    },
    {
      id: 'itc-05', topic: 'integral-tech', difficulty: 1,
      stem: '求 $\\int\\frac{\\sin x}{\\sqrt{2+\\cos x}}\\,dx$。',
      choices: [
        { tex: '2\\sqrt{2+\\cos x}+C', value: x => 2*Math.sqrt(2+Math.cos(x)) },
        { tex: '-2\\sqrt{2+\\cos x}+C', value: x => -2*Math.sqrt(2+Math.cos(x)) },
        { tex: '-\\sqrt{2+\\cos x}+C', value: x => -Math.sqrt(2+Math.cos(x)) },
        { tex: '-\\frac23(2+\\cos x)^{3/2}+C', value: x => -2*(2+Math.cos(x))**1.5/3 }
      ],
      answer: 1, upToConstant: true,
      solution: '令 $u=2+\\cos x$，有 $du=-\\sin x\\,dx$。故原式為 $-\\int u^{-1/2}\\,du=-2\\sqrt u+C$。',
      check: N => x => N.integrate(t => Math.sin(t)/Math.sqrt(2+Math.cos(t)), 0, x)
    },
    {
      id: 'itc-06', topic: 'integral-tech', difficulty: 1,
      stem: '在 $x>1$ 上，求 $\\int\\frac{1}{x\\ln x}\\,dx$。',
      choices: [
        { tex: '\\ln x+C', value: x => Math.log(x) },
        { tex: '\\frac{(\\ln x)^2}{2}+C', value: x => Math.log(x)**2/2 },
        { tex: '-\\frac{1}{\\ln x}+C', value: x => -1/Math.log(x) },
        { tex: '\\ln(\\ln x)+C', value: x => Math.log(Math.log(x)) }
      ],
      answer: 3, upToConstant: true, samples: [1.3, 1.6, 2, 3, 4],
      solution: '令 $u=\\ln x>0$，則 $du=dx/x$。積分變成 $\\int du/u=\\ln(\\ln x)+C$。',
      check: N => x => N.integrate(t => 1/(t*Math.log(t)), 2, x)
    },
    {
      id: 'itc-07', topic: 'integral-tech', difficulty: 1,
      stem: '在 $-3<x<3$ 上，求 $\\int\\frac{x}{\\sqrt{9-x^2}}\\,dx$。',
      choices: [
        { tex: '-\\sqrt{9-x^2}+C', value: x => -Math.sqrt(9-x*x) },
        { tex: '\\sqrt{9-x^2}+C', value: x => Math.sqrt(9-x*x) },
        { tex: '-2\\sqrt{9-x^2}+C', value: x => -2*Math.sqrt(9-x*x) },
        { tex: '\\arcsin(x/3)+C', value: x => Math.asin(x/3) }
      ],
      answer: 0, upToConstant: true,
      solution: '令 $u=9-x^2$，則 $x\\,dx=-du/2$，得到 $-\\frac12\\int u^{-1/2}\\,du=-\\sqrt u+C$。',
      check: N => x => N.integrate(t => t/Math.sqrt(9-t*t), 0, x)
    },
    {
      id: 'itc-08', topic: 'integral-tech', difficulty: 1,
      stem: '求 $\\int x^2\\cos(x^3)\\,dx$。',
      choices: [
        { tex: '\\sin(x^3)+C', value: x => Math.sin(x**3) },
        { tex: '-\\frac13\\cos(x^3)+C', value: x => -Math.cos(x**3)/3 },
        { tex: '\\frac13\\sin(x^3)+C', value: x => Math.sin(x**3)/3 },
        { tex: '\\frac{x^3}{3}\\sin(x^3)+C', value: x => x**3*Math.sin(x**3)/3 }
      ],
      answer: 2, upToConstant: true,
      solution: '設 $u=x^3$，有 $du=3x^2\\,dx$。積分為 $\\frac13\\int\\cos u\\,du=\\sin(x^3)/3+C$。',
      check: N => x => N.integrate(t => t*t*Math.cos(t**3), 0, x)
    },
    {
      id: 'itc-09', topic: 'integral-tech', difficulty: 1,
      stem: '令 $u=x^2$ 計算 $\\int_0^1 2xe^{x^2}\\,dx$，其值為何？',
      choices: [
        { tex: '\\frac{e-1}{2}', value: (Math.E-1)/2 },
        { tex: 'e-1', value: Math.E-1 },
        { tex: '2(e-1)', value: 2*(Math.E-1) },
        { tex: 'e', value: Math.E }
      ],
      answer: 1,
      solution: '由 $du=2x\\,dx$，上下限 $x=0,1$ 對應 $u=0,1$。故積分為 $\\int_0^1 e^u\\,du=e-1$。',
      check: N => N.integrate(x => 2*x*Math.exp(x*x), 0, 1)
    },
    {
      id: 'itc-10', topic: 'integral-tech', difficulty: 1,
      stem: '把上下限一併換成 $u=1+\\ln x$ 後，$\\int_1^e\\frac{(1+\\ln x)^3}{x}\\,dx$ 等於多少？',
      choices: [
        { tex: '4', value: 4 },
        { tex: '15', value: 15 },
        { tex: '-\\frac{15}{4}', value: -15/4 },
        { tex: '\\frac{15}{4}', value: 15/4 }
      ],
      answer: 3,
      solution: '有 $du=dx/x$，新上下限是 $1$ 與 $2$。故 $\\int_1^2u^3\\,du=(2^4-1^4)/4=15/4$。',
      check: N => N.integrate(x => (1+Math.log(x))**3/x, 1, Math.E)
    },
    {
      id: 'itc-11', topic: 'integral-tech', difficulty: 1,
      stem: '以 $u=\\cos x$ 換元，求 $\\int_0^{\\pi/2}\\sin x\\cos^2x\\,dx$。',
      choices: [
        { tex: '\\frac13', value: 1/3 },
        { tex: '-\\frac13', value: -1/3 },
        { tex: '1', value: 1 },
        { tex: '\\frac12', value: 1/2 }
      ],
      answer: 0,
      solution: '新上下限由 $1$ 變為 $0$，且 $du=-\\sin x\\,dx$。所以原式為 $-\\int_1^0u^2\\,du=1/3$。',
      check: N => N.integrate(x => Math.sin(x)*Math.cos(x)**2, 0, Math.PI/2)
    },
    {
      id: 'itc-12', topic: 'integral-tech', difficulty: 1,
      stem: '計算 $\\int_0^1\\frac{x}{(1+x^2)^2}\\,dx$。',
      choices: [
        { tex: '\\frac12', value: 1/2 },
        { tex: '-\\frac14', value: -1/4 },
        { tex: '\\frac14', value: 1/4 },
        { tex: '\\frac{\\ln2}{2}', value: Math.log(2)/2 }
      ],
      answer: 2,
      solution: '令 $u=1+x^2$，新上下限為 $1,2$。原式為 $\\frac12\\int_1^2u^{-2}\\,du=[-1/(2u)]_1^2=1/4$。',
      check: N => N.integrate(x => x/(1+x*x)**2, 0, 1)
    },
    {
      id: 'itc-13', topic: 'integral-tech', difficulty: 1,
      stem: '用分部積分求 $\\int x\\cos x\\,dx$。',
      choices: [
        { tex: 'x\\sin x-\\cos x+C', value: x => x*Math.sin(x)-Math.cos(x) },
        { tex: 'x\\sin x+\\cos x+C', value: x => x*Math.sin(x)+Math.cos(x) },
        { tex: 'x\\sin x+C', value: x => x*Math.sin(x) },
        { tex: '\\frac{x^2}{2}\\sin x+C', value: x => x*x*Math.sin(x)/2 }
      ],
      answer: 1, upToConstant: true,
      solution: '選 $u=x$、$dv=\\cos x\\,dx$。由 $uv-\\int v\\,du$ 得 $x\\sin x-\\int\\sin x\\,dx=x\\sin x+\\cos x+C$。',
      check: N => x => N.integrate(t => t*Math.cos(t), 0, x)
    },
    {
      id: 'itc-14', topic: 'integral-tech', difficulty: 1,
      stem: '在 $x>0$ 上，求 $\\int\\ln x\\,dx$。',
      choices: [
        { tex: 'x\\ln x+C', value: x => x*Math.log(x) },
        { tex: '\\frac{(\\ln x)^2}{2}+C', value: x => Math.log(x)**2/2 },
        { tex: 'x\\ln x+x+C', value: x => x*Math.log(x)+x },
        { tex: 'x\\ln x-x+C', value: x => x*Math.log(x)-x }
      ],
      answer: 3, upToConstant: true, samples: [0.5, 0.8, 1.4, 2, 3],
      solution: '把 $\\ln x$ 視為 $\\ln x\\cdot1$，取 $u=\\ln x$、$dv=dx$。分部積分得 $x\\ln x-\\int1\\,dx=x\\ln x-x+C$。',
      check: N => x => N.integrate(Math.log, 1, x)
    },
    {
      id: 'itc-15', topic: 'integral-tech', difficulty: 1,
      stem: '計算 $\\int_0^1 xe^{-x}\\,dx$。',
      choices: [
        { tex: '1-\\frac2e', value: 1-2/Math.E },
        { tex: '1-\\frac1e', value: 1-1/Math.E },
        { tex: '\\frac2e-1', value: 2/Math.E-1 },
        { tex: '-\\frac1e', value: -1/Math.E }
      ],
      answer: 0,
      solution: '取 $u=x$、$dv=e^{-x}\\,dx$，反導函數是 $-(x+1)e^{-x}$。代入上下限得到 $-2/e-(-1)=1-2/e$。',
      check: N => N.integrate(x => x*Math.exp(-x), 0, 1)
    },
    {
      id: 'itc-16', topic: 'integral-tech', difficulty: 1,
      stem: '用降冪公式求 $\\int\\sin^2x\\,dx$。',
      choices: [
        { tex: '\\frac{x}{2}+\\frac{\\sin2x}{4}+C', value: x => x/2+Math.sin(2*x)/4 },
        { tex: 'x-\\frac{\\sin2x}{2}+C', value: x => x-Math.sin(2*x)/2 },
        { tex: '\\frac{x}{2}-\\frac{\\sin2x}{4}+C', value: x => x/2-Math.sin(2*x)/4 },
        { tex: '\\frac{x}{2}-\\frac{\\sin2x}{2}+C', value: x => x/2-Math.sin(2*x)/2 }
      ],
      answer: 2, upToConstant: true,
      solution: '由 $\\sin^2x=(1-\\cos2x)/2$，逐項積分得 $x/2-\\sin2x/4+C$。',
      check: N => x => N.integrate(t => Math.sin(t)**2, 0, x)
    },
    {
      id: 'itc-17', topic: 'integral-tech', difficulty: 1,
      stem: '在 $x>-1$ 上，求 $\\int\\frac{1}{(x+1)(x+2)}\\,dx$。',
      choices: [
        { tex: '\\ln((x+1)(x+2))+C', value: x => Math.log((x+1)*(x+2)) },
        { tex: '\\ln\\frac{x+1}{x+2}+C', value: x => Math.log((x+1)/(x+2)) },
        { tex: '\\ln\\frac{x+2}{x+1}+C', value: x => Math.log((x+2)/(x+1)) },
        { tex: '-\\frac{1}{(x+1)(x+2)}+C', value: x => -1/((x+1)*(x+2)) }
      ],
      answer: 1, upToConstant: true,
      solution: '拆成 $1/(x+1)-1/(x+2)$。逐項積分後合併為 $\\ln((x+1)/(x+2))+C$。',
      check: N => x => N.integrate(t => 1/((t+1)*(t+2)), 0, x)
    },
    {
      id: 'itc-18', topic: 'integral-tech', difficulty: 2,
      stem: '求 $\\int\\frac{x^3}{1+x^2}\\,dx$。',
      choices: [
        { tex: '\\frac{x^2}{2}+\\frac12\\ln(1+x^2)+C', value: x => x*x/2+Math.log(1+x*x)/2 },
        { tex: '\\frac12\\ln(1+x^2)+C', value: x => Math.log(1+x*x)/2 },
        { tex: 'x^2-\\ln(1+x^2)+C', value: x => x*x-Math.log(1+x*x) },
        { tex: '\\frac{x^2}{2}-\\frac12\\ln(1+x^2)+C', value: x => x*x/2-Math.log(1+x*x)/2 }
      ],
      answer: 3, upToConstant: true,
      solution: '令 $u=1+x^2$，有 $x^3\\,dx=(u-1)du/2$。積分變成 $\\frac12\\int(1-1/u)\\,du$，回代後將常數併入 $C$。',
      check: N => x => N.integrate(t => t**3/(1+t*t), 0, x)
    },
    {
      id: 'itc-19', topic: 'integral-tech', difficulty: 2,
      stem: '在 $x>0$ 上，求 $\\int\\frac{\\sqrt{x}}{1+\\sqrt{x}}\\,dx$。',
      choices: [
        { tex: 'x-2\\sqrt{x}+2\\ln(1+\\sqrt{x})+C', value: x => x-2*Math.sqrt(x)+2*Math.log(1+Math.sqrt(x)) },
        { tex: '\\sqrt{x}-\\ln(1+\\sqrt{x})+C', value: x => Math.sqrt(x)-Math.log(1+Math.sqrt(x)) },
        { tex: 'x-2\\sqrt{x}-2\\ln(1+\\sqrt{x})+C', value: x => x-2*Math.sqrt(x)-2*Math.log(1+Math.sqrt(x)) },
        { tex: 'x+2\\ln(1+\\sqrt{x})+C', value: x => x+2*Math.log(1+Math.sqrt(x)) }
      ],
      answer: 0, upToConstant: true, samples: [0.4, 0.8, 1.3, 2, 3],
      solution: '令 $u=\\sqrt{x}$，則 $dx=2u\\,du$。原式成為 $2\\int u^2/(1+u)\\,du=2\\int(u-1+1/(1+u))\\,du$，再回代。',
      check: N => x => N.integrate(t => Math.sqrt(t)/(1+Math.sqrt(t)), 1, x)
    },
    {
      id: 'itc-20', topic: 'integral-tech', difficulty: 2,
      stem: '以 $u=e^x+1$ 計算 $\\int_0^{\\ln2} e^x\\sqrt{e^x+1}\\,dx$。',
      choices: [
        { tex: '\\frac23(2\\sqrt2-1)', value: 2*(2*Math.sqrt(2)-1)/3 },
        { tex: '\\frac32(3\\sqrt3-2\\sqrt2)', value: 3*(3*Math.sqrt(3)-2*Math.sqrt(2))/2 },
        { tex: '\\frac23(3\\sqrt3-2\\sqrt2)', value: 2*(3*Math.sqrt(3)-2*Math.sqrt(2))/3 },
        { tex: '2\\sqrt3', value: 2*Math.sqrt(3) }
      ],
      answer: 2,
      solution: '有 $du=e^x\\,dx$，上下限換成 $2,3$。因此值為 $[2u^{3/2}/3]_2^3=2(3\\sqrt3-2\\sqrt2)/3$。',
      check: N => N.integrate(x => Math.exp(x)*Math.sqrt(Math.exp(x)+1), 0, Math.log(2))
    },
    {
      id: 'itc-21', topic: 'integral-tech', difficulty: 2,
      stem: '求 $\\int_0^1 x^3\\sqrt{1+x^2}\\,dx$，注意換元後仍須處理多項式因子。',
      choices: [
        { tex: '\\frac{2\\sqrt2-1}{3}', value: (2*Math.sqrt(2)-1)/3 },
        { tex: '\\frac{2(\\sqrt2+1)}{15}', value: 2*(Math.sqrt(2)+1)/15 },
        { tex: '\\frac{4(\\sqrt2+1)}{15}', value: 4*(Math.sqrt(2)+1)/15 },
        { tex: '\\frac{2(\\sqrt2-1)}{15}', value: 2*(Math.sqrt(2)-1)/15 }
      ],
      answer: 1,
      solution: '令 $u=1+x^2$，則 $x^3\\,dx=(u-1)du/2$，上下限為 $1,2$。原式為 $[u^{5/2}/5-u^{3/2}/3]_1^2=2(\\sqrt2+1)/15$。',
      check: N => N.integrate(x => x**3*Math.sqrt(1+x*x), 0, 1)
    },
    {
      id: 'itc-22', topic: 'integral-tech', difficulty: 2,
      stem: '求 $\\int\\arctan x\\,dx$。',
      choices: [
        { tex: 'x\\arctan x+\\frac12\\ln(1+x^2)+C', value: x => x*Math.atan(x)+Math.log(1+x*x)/2 },
        { tex: 'x\\arctan x+C', value: x => x*Math.atan(x) },
        { tex: '\\frac12(\\arctan x)^2+C', value: x => Math.atan(x)**2/2 },
        { tex: 'x\\arctan x-\\frac12\\ln(1+x^2)+C', value: x => x*Math.atan(x)-Math.log(1+x*x)/2 }
      ],
      answer: 3, upToConstant: true,
      solution: '取 $u=\\arctan x$、$dv=dx$，得到 $x\\arctan x-\\int x/(1+x^2)\\,dx$。剩下的積分是 $\\frac12\\ln(1+x^2)$。',
      check: N => x => N.integrate(Math.atan, 0, x)
    },
    {
      id: 'itc-23', topic: 'integral-tech', difficulty: 2,
      stem: '計算 $\\int_0^1 x\\ln(1+x)\\,dx$。',
      choices: [
        { tex: '\\frac14', value: 1/4 },
        { tex: '\\frac12\\ln2', value: Math.log(2)/2 },
        { tex: '\\ln2-\\frac14', value: Math.log(2)-1/4 },
        { tex: '-\\frac14', value: -1/4 }
      ],
      answer: 0,
      solution: '取 $u=\\ln(1+x)$、$dv=x\\,dx$，得 $\\ln2/2-\\frac12\\int_0^1x^2/(1+x)\\,dx$。以 $x^2/(1+x)=x-1+1/(1+x)$ 化簡，結果為 $1/4$。',
      check: N => N.integrate(x => x*Math.log(1+x), 0, 1)
    },
    {
      id: 'itc-24', topic: 'integral-tech', difficulty: 2,
      stem: '重複分部積分，求 $\\int x^2e^x\\,dx$。',
      choices: [
        { tex: 'e^x(x^2+2x+2)+C', value: x => Math.exp(x)*(x*x+2*x+2) },
        { tex: 'e^x(x^2-2x+2)+C', value: x => Math.exp(x)*(x*x-2*x+2) },
        { tex: 'e^x(x^2-2x)+C', value: x => Math.exp(x)*(x*x-2*x) },
        { tex: 'e^x(x^2-x+1)+C', value: x => Math.exp(x)*(x*x-x+1) }
      ],
      answer: 1, upToConstant: true,
      solution: '先得 $x^2e^x-2\\int xe^x\\,dx$，再對剩下的積分分部一次。整理為 $e^x(x^2-2x+2)+C$。',
      check: N => x => N.integrate(t => t*t*Math.exp(t), 0, x)
    },
    {
      id: 'itc-25', topic: 'integral-tech', difficulty: 2,
      stem: '計算 $\\int_0^\\pi x^2\\sin x\\,dx$。',
      choices: [
        { tex: '\\pi^2', value: Math.PI**2 },
        { tex: '\\pi^2+4', value: Math.PI**2+4 },
        { tex: '4-\\pi^2', value: 4-Math.PI**2 },
        { tex: '\\pi^2-4', value: Math.PI**2-4 }
      ],
      answer: 3,
      solution: '兩次分部積分可得反導函數 $-x^2\\cos x+2x\\sin x+2\\cos x$。代入 $0,\\pi$ 得 $(\\pi^2-2)-2=\\pi^2-4$。',
      check: N => N.integrate(x => x*x*Math.sin(x), 0, Math.PI)
    },
    {
      id: 'itc-26', topic: 'integral-tech', difficulty: 2,
      stem: '令 $I=\\int e^x\\sin x\\,dx$，經兩次分部積分消去循環後，$I$ 為何？',
      choices: [
        { tex: 'e^x(\\sin x-\\cos x)+C', value: x => Math.exp(x)*(Math.sin(x)-Math.cos(x)) },
        { tex: '\\frac{e^x}{2}(\\sin x+\\cos x)+C', value: x => Math.exp(x)*(Math.sin(x)+Math.cos(x))/2 },
        { tex: '\\frac{e^x}{2}(\\sin x-\\cos x)+C', value: x => Math.exp(x)*(Math.sin(x)-Math.cos(x))/2 },
        { tex: '\\frac{e^x}{2}(\\cos x-\\sin x)+C', value: x => Math.exp(x)*(Math.cos(x)-Math.sin(x))/2 }
      ],
      answer: 2, upToConstant: true,
      solution: '連做兩次分部積分得到 $I=e^x\\sin x-e^x\\cos x-I$（常數併入最後的 $C$）。移項除以 $2$ 即得答案。',
      check: N => x => N.integrate(t => Math.exp(t)*Math.sin(t), 0, x)
    },
    {
      id: 'itc-27', topic: 'integral-tech', difficulty: 2,
      stem: '利用循環型分部積分，求 $\\int_0^{\\pi/2}e^x\\cos x\\,dx$。',
      choices: [
        { tex: '\\frac{e^{\\pi/2}-1}{2}', value: (Math.exp(Math.PI/2)-1)/2 },
        { tex: '\\frac{e^{\\pi/2}+1}{2}', value: (Math.exp(Math.PI/2)+1)/2 },
        { tex: 'e^{\\pi/2}-1', value: Math.exp(Math.PI/2)-1 },
        { tex: '\\frac{e^{\\pi/2}}2', value: Math.exp(Math.PI/2)/2 }
      ],
      answer: 0,
      solution: '兩次分部積分並移項，可得反導函數 $e^x(\\sin x+\\cos x)/2$。上限值為 $e^{\\pi/2}/2$，下限值為 $1/2$。',
      check: N => N.integrate(x => Math.exp(x)*Math.cos(x), 0, Math.PI/2)
    },
    {
      id: 'itc-28', topic: 'integral-tech', difficulty: 2,
      stem: '在 $x>0$ 上，求 $\\int\\frac{1}{x(x+1)^2}\\,dx$。',
      choices: [
        { tex: '\\ln\\frac{x}{x+1}-\\frac1{x+1}+C', value: x => Math.log(x/(x+1))-1/(x+1) },
        { tex: '\\ln\\frac{x}{x+1}+\\frac1{x+1}+C', value: x => Math.log(x/(x+1))+1/(x+1) },
        { tex: '\\ln\\frac{x}{x+1}+C', value: x => Math.log(x/(x+1)) },
        { tex: '\\ln(x(x+1))+\\frac1{x+1}+C', value: x => Math.log(x*(x+1))+1/(x+1) }
      ],
      answer: 1, upToConstant: true, samples: [0.4, 0.8, 1.3, 2, 3],
      solution: '部分分式為 $1/x-1/(x+1)-1/(x+1)^2$，不可漏掉重根的一次項。積分得 $\\ln x-\\ln(x+1)+1/(x+1)+C$。',
      check: N => x => N.integrate(t => 1/(t*(t+1)**2), 1, x)
    },
    {
      id: 'itc-29', topic: 'integral-tech', difficulty: 2,
      stem: '將分母分解後，計算 $\\int_0^1\\frac{2x+3}{x^2+3x+2}\\,dx$。',
      choices: [
        { tex: '\\ln6', value: Math.log(6) },
        { tex: '\\ln\\frac43', value: Math.log(4/3) },
        { tex: '-\\ln3', value: -Math.log(3) },
        { tex: '\\ln3', value: Math.log(3) }
      ],
      answer: 3,
      solution: '被積函數可拆成 $1/(x+1)+1/(x+2)$。故積分為 $[\\ln((x+1)(x+2))]_0^1=\\ln6-\\ln2=\\ln3$。',
      check: N => N.integrate(x => (2*x+3)/(x*x+3*x+2), 0, 1)
    },
    {
      id: 'itc-30', topic: 'integral-tech', difficulty: 2,
      stem: '保留一個 $\\sin x$ 因子，求 $\\int\\sin^3x\\,dx$。',
      choices: [
        { tex: '-\\cos x-\\frac{\\cos^3x}{3}+C', value: x => -Math.cos(x)-Math.cos(x)**3/3 },
        { tex: '\\cos x-\\frac{\\cos^3x}{3}+C', value: x => Math.cos(x)-Math.cos(x)**3/3 },
        { tex: '-\\cos x+\\frac{\\cos^3x}{3}+C', value: x => -Math.cos(x)+Math.cos(x)**3/3 },
        { tex: '-\\cos x+\\cos^3x+C', value: x => -Math.cos(x)+Math.cos(x)**3 }
      ],
      answer: 2, upToConstant: true,
      solution: '寫成 $(1-\\cos^2x)\\sin x$，取 $u=\\cos x$。原式為 $-\\int(1-u^2)\\,du=-u+u^3/3+C$。',
      check: N => x => N.integrate(t => Math.sin(t)**3, 0, x)
    },
    {
      id: 'itc-31', topic: 'integral-tech', difficulty: 2,
      stem: '求 $\\int_0^{\\pi/2}\\sin^2x\\cos^2x\\,dx$。',
      choices: [
        { tex: '\\frac{\\pi}{16}', value: Math.PI/16 },
        { tex: '\\frac{\\pi}{8}', value: Math.PI/8 },
        { tex: '\\frac{\\pi}{4}', value: Math.PI/4 },
        { tex: '0', value: 0 }
      ],
      answer: 0,
      solution: '使用 $\\sin^2x\\cos^2x=(1-\\cos4x)/8$。振盪項在上下限皆為零，剩下 $\\frac18(\\pi/2)=\\pi/16$。',
      check: N => N.integrate(x => Math.sin(x)**2*Math.cos(x)**2, 0, Math.PI/2)
    },
    {
      id: 'itc-32', topic: 'integral-tech', difficulty: 2,
      stem: '用 $x=2\\tan\\theta$ 求 $\\int\\frac{1}{(x^2+4)^{3/2}}\\,dx$。',
      choices: [
        { tex: '\\frac{x}{\\sqrt{x^2+4}}+C', value: x => x/Math.sqrt(x*x+4) },
        { tex: '-\\frac{x}{4\\sqrt{x^2+4}}+C', value: x => -x/(4*Math.sqrt(x*x+4)) },
        { tex: '\\frac14\\arctan(x/2)+C', value: x => Math.atan(x/2)/4 },
        { tex: '\\frac{x}{4\\sqrt{x^2+4}}+C', value: x => x/(4*Math.sqrt(x*x+4)) }
      ],
      answer: 3, upToConstant: true,
      solution: '取 $-\\pi/2<\\theta<\\pi/2$，則 $dx=2\\sec^2\\theta\\,d\\theta$，原式化為 $\\frac14\\int\\cos\\theta\\,d\\theta$。由 $\\sin\\theta=x/\\sqrt{x^2+4}$ 回代。',
      check: N => x => N.integrate(t => 1/(t*t+4)**1.5, 0, x)
    },
    {
      id: 'itc-33', topic: 'integral-tech', difficulty: 2,
      stem: '以 $x=2\\sin\\theta$ 換元，求 $\\int_0^1\\frac{1}{\\sqrt{4-x^2}}\\,dx$。',
      choices: [
        { tex: '\\frac{\\pi}{3}', value: Math.PI/3 },
        { tex: '\\frac{\\pi}{6}', value: Math.PI/6 },
        { tex: '\\frac{\\pi}{12}', value: Math.PI/12 },
        { tex: '-\\frac{\\pi}{6}', value: -Math.PI/6 }
      ],
      answer: 1,
      solution: '在此區間 $\\theta$ 從 $0$ 到 $\\pi/6$，且分子、分母的 $2\\cos\\theta$ 抵消。原式化為 $\\int_0^{\\pi/6}d\\theta=\\pi/6$。',
      check: N => N.integrate(x => 1/Math.sqrt(4-x*x), 0, 1)
    },
    {
      id: 'itc-34', topic: 'integral-tech', difficulty: 2,
      stem: '在 $x>0$ 上處理 $\\int\\frac{x}{1+x^4}\\,dx$，以下「起手技巧與所得反導函數」配對何者正確？',
      choices: [
        { tex: '\\text{令 }u=x^4\\text{：}\\ \\frac14\\ln(1+x^4)+C', value: x => Math.log(1+x**4)/4 },
        { tex: '\\text{分部積分：}\\ \\frac{x^2}{2(1+x^4)}+C', value: x => x*x/(2*(1+x**4)) },
        { tex: '\\text{令 }u=x^2\\text{：}\\ \\frac12\\arctan(x^2)+C', value: x => Math.atan(x*x)/2 },
        { tex: '\\text{令 }u=x^2\\text{：}\\ \\arctan(x^2)+C', value: x => Math.atan(x*x) }
      ],
      answer: 2, upToConstant: true, samples: [0.3, 0.6, 1.2, 2, 3],
      solution: '分母可寫成 $1+(x^2)^2$，因此選 $u=x^2$ 可化成反正切的標準積分。由 $du=2x\\,dx$，前方必須保留 $1/2$。',
      check: N => x => N.integrate(t => t/(1+t**4), 1, x)
    },
    {
      id: 'itc-35', topic: 'integral-tech', difficulty: 3,
      stem: '在 $x>0$ 上，求 $\\int\\frac{\\ln x}{x(1+(\\ln x)^2)}\\,dx$。',
      choices: [
        { tex: '\\frac12\\ln(1+(\\ln x)^2)+C', value: x => Math.log(1+Math.log(x)**2)/2 },
        { tex: '\\ln(1+(\\ln x)^2)+C', value: x => Math.log(1+Math.log(x)**2) },
        { tex: '\\arctan(\\ln x)+C', value: x => Math.atan(Math.log(x)) },
        { tex: '\\frac{1}{2(1+(\\ln x)^2)}+C', value: x => 1/(2*(1+Math.log(x)**2)) }
      ],
      answer: 0, upToConstant: true, samples: [0.4, 0.7, 1.3, 2, 3],
      solution: '先令 $u=\\ln x$，再令 $v=1+u^2$。原式為 $\\int u/(1+u^2)\\,du=\\frac12\\ln(1+u^2)+C$。',
      check: N => x => N.integrate(t => Math.log(t)/(t*(1+Math.log(t)**2)), 1, x)
    },
    {
      id: 'itc-36', topic: 'integral-tech', difficulty: 3,
      stem: '連續換元計算 $\\int_0^{\\sqrt{\\ln2}}\\frac{xe^{x^2}}{1+e^{x^2}}\\,dx$。',
      choices: [
        { tex: '\\frac12\\ln3', value: Math.log(3)/2 },
        { tex: '\\ln\\frac32', value: Math.log(3/2) },
        { tex: '-\\frac12\\ln\\frac32', value: -Math.log(3/2)/2 },
        { tex: '\\frac12\\ln\\frac32', value: Math.log(3/2)/2 }
      ],
      answer: 3,
      solution: '令 $u=x^2$，新上下限為 $0,\\ln2$；再令 $v=1+e^u$，上下限變成 $2,3$。原式為 $\\frac12\\int_2^3dv/v=\\frac12\\ln(3/2)$。',
      check: N => N.integrate(x => x*Math.exp(x*x)/(1+Math.exp(x*x)), 0, Math.sqrt(Math.log(2)))
    },
    {
      id: 'itc-37', topic: 'integral-tech', difficulty: 3,
      stem: '在 $x>0$ 上，重複分部積分求 $\\int(\\ln x)^2\\,dx$。',
      choices: [
        { tex: 'x((\\ln x)^2+2\\ln x+2)+C', value: x => x*(Math.log(x)**2+2*Math.log(x)+2) },
        { tex: 'x((\\ln x)^2-2\\ln x+2)+C', value: x => x*(Math.log(x)**2-2*Math.log(x)+2) },
        { tex: 'x((\\ln x)^2-2\\ln x)+C', value: x => x*(Math.log(x)**2-2*Math.log(x)) },
        { tex: '\\frac{(\\ln x)^3}{3}+C', value: x => Math.log(x)**3/3 }
      ],
      answer: 1, upToConstant: true, samples: [0.4, 0.7, 1.3, 2, 3],
      solution: '取 $u=(\\ln x)^2$、$dv=dx$，得到 $x(\\ln x)^2-2\\int\\ln x\\,dx$。再分部積分一次，得 $x((\\ln x)^2-2\\ln x+2)+C$。',
      check: N => x => N.integrate(t => Math.log(t)**2, 1, x)
    },
    {
      id: 'itc-38', topic: 'integral-tech', difficulty: 3,
      stem: '三次分部積分後，$\\int_0^1 x^3e^x\\,dx$ 的精確值為何？',
      choices: [
        { tex: '6+2e', value: 6+2*Math.E },
        { tex: '-2e', value: -2*Math.E },
        { tex: '6-2e', value: 6-2*Math.E },
        { tex: '2e-6', value: 2*Math.E-6 }
      ],
      answer: 2,
      solution: '反覆降低多項式次數，得到反導函數 $e^x(x^3-3x^2+6x-6)$。上下限相減為 $-2e-(-6)=6-2e$。',
      check: N => N.integrate(x => x**3*Math.exp(x), 0, 1)
    },
    {
      id: 'itc-39', topic: 'integral-tech', difficulty: 3,
      stem: '結合循環型與分部積分，求 $\\int xe^x\\sin x\\,dx$。',
      choices: [
        { tex: '\\frac{e^x}{2}\\bigl(x(\\sin x-\\cos x)+\\cos x\\bigr)+C', value: x => Math.exp(x)*(x*(Math.sin(x)-Math.cos(x))+Math.cos(x))/2 },
        { tex: '\\frac{xe^x}{2}(\\sin x-\\cos x)+C', value: x => x*Math.exp(x)*(Math.sin(x)-Math.cos(x))/2 },
        { tex: '\\frac{e^x}{2}\\bigl(x(\\sin x-\\cos x)-\\cos x\\bigr)+C', value: x => Math.exp(x)*(x*(Math.sin(x)-Math.cos(x))-Math.cos(x))/2 },
        { tex: 'e^x\\bigl(x(\\sin x-\\cos x)+\\cos x\\bigr)+C', value: x => Math.exp(x)*(x*(Math.sin(x)-Math.cos(x))+Math.cos(x)) }
      ],
      answer: 0, upToConstant: true,
      solution: '先由循環型求得 $\\int e^x\\sin x\\,dx=e^x(\\sin x-\\cos x)/2$。再取 $u=x$ 分部積分，剩餘積分為 $-e^x\\cos x/2$，整理即得答案。',
      check: N => x => N.integrate(t => t*Math.exp(t)*Math.sin(t), 0, x)
    },
    {
      id: 'itc-40', topic: 'integral-tech', difficulty: 3,
      stem: '求 $\\int_0^{\\pi/2} xe^x\\cos x\\,dx$。',
      choices: [
        { tex: '\\frac{\\pi e^{\\pi/2}}4', value: Math.PI*Math.exp(Math.PI/2)/4 },
        { tex: '\\frac{(\\pi+2)e^{\\pi/2}}4', value: (Math.PI+2)*Math.exp(Math.PI/2)/4 },
        { tex: '\\frac{(2-\\pi)e^{\\pi/2}}4', value: (2-Math.PI)*Math.exp(Math.PI/2)/4 },
        { tex: '\\frac{(\\pi-2)e^{\\pi/2}}4', value: (Math.PI-2)*Math.exp(Math.PI/2)/4 }
      ],
      answer: 3,
      solution: '先用循環型得到 $\\int e^x\\cos x\\,dx=e^x(\\sin x+\\cos x)/2$，再對 $x$ 分部積分。反導函數是 $e^x(x(\\sin x+\\cos x)-\\sin x)/2$，代上下限即得 $(\\pi-2)e^{\\pi/2}/4$。',
      check: N => N.integrate(x => x*Math.exp(x)*Math.cos(x), 0, Math.PI/2)
    },
    {
      id: 'itc-41', topic: 'integral-tech', difficulty: 3,
      stem: '計算含不可約二次因子的積分 $\\int_0^1\\frac{1}{(x+1)(x^2+1)}\\,dx$。',
      choices: [
        { tex: '\\frac{\\ln2}{4}-\\frac{\\pi}{8}', value: Math.log(2)/4-Math.PI/8 },
        { tex: '\\frac{\\ln2}{4}+\\frac{\\pi}{8}', value: Math.log(2)/4+Math.PI/8 },
        { tex: '\\frac{3\\ln2}{4}+\\frac{\\pi}{8}', value: 3*Math.log(2)/4+Math.PI/8 },
        { tex: '\\frac{\\ln2}{2}+\\frac{\\pi}{4}', value: Math.log(2)/2+Math.PI/4 }
      ],
      answer: 1,
      solution: '拆成 $1/(2(x+1))+(1-x)/(2(x^2+1))$。反導函數為 $\\frac12\\ln(x+1)-\\frac14\\ln(x^2+1)+\\frac12\\arctan x$，代入得 $\\ln2/4+\\pi/8$。',
      check: N => N.integrate(x => 1/((x+1)*(x*x+1)), 0, 1)
    },
    {
      id: 'itc-42', topic: 'integral-tech', difficulty: 3,
      stem: '在 $x>1$ 上，先處理假分式再求 $\\int\\frac{x^2+1}{x-1}\\,dx$。',
      choices: [
        { tex: '\\frac{x^2}{2}+x+\\ln(x-1)+C', value: x => x*x/2+x+Math.log(x-1) },
        { tex: '\\frac{x^2}{2}+x-2\\ln(x-1)+C', value: x => x*x/2+x-2*Math.log(x-1) },
        { tex: '\\frac{x^2}{2}+x+2\\ln(x-1)+C', value: x => x*x/2+x+2*Math.log(x-1) },
        { tex: '\\frac{x^2}{2}+2\\ln(x-1)+C', value: x => x*x/2+2*Math.log(x-1) }
      ],
      answer: 2, upToConstant: true, samples: [1.3, 1.6, 2, 3, 4],
      solution: '長除法給出 $(x^2+1)/(x-1)=x+1+2/(x-1)$。逐項積分即為 $x^2/2+x+2\\ln(x-1)+C$。',
      check: N => x => N.integrate(t => (t*t+1)/(t-1), 2, x)
    },
    {
      id: 'itc-43', topic: 'integral-tech', difficulty: 3,
      stem: '利用正弦的奇次方，求 $\\int\\sin^5x\\cos^2x\\,dx$。',
      choices: [
        { tex: '-\\frac{\\cos^3x}{3}+\\frac{2\\cos^5x}{5}-\\frac{\\cos^7x}{7}+C', value: x => -(Math.cos(x)**3)/3+2*Math.cos(x)**5/5-Math.cos(x)**7/7 },
        { tex: '\\frac{\\cos^3x}{3}-\\frac{2\\cos^5x}{5}+\\frac{\\cos^7x}{7}+C', value: x => Math.cos(x)**3/3-2*Math.cos(x)**5/5+Math.cos(x)**7/7 },
        { tex: '-\\frac{\\cos^3x}{3}-\\frac{2\\cos^5x}{5}-\\frac{\\cos^7x}{7}+C', value: x => -(Math.cos(x)**3)/3-2*Math.cos(x)**5/5-Math.cos(x)**7/7 },
        { tex: '-\\frac{\\cos^3x}{3}+\\frac{\\cos^5x}{5}-\\frac{\\cos^7x}{7}+C', value: x => -(Math.cos(x)**3)/3+Math.cos(x)**5/5-Math.cos(x)**7/7 }
      ],
      answer: 0, upToConstant: true,
      solution: '保留 $\\sin x\\,dx$，其餘寫成 $(1-\\cos^2x)^2\\cos^2x$。取 $u=\\cos x$ 後積分為 $-\\int(u^2-2u^4+u^6)\\,du$，再回代。',
      check: N => x => N.integrate(t => Math.sin(t)**5*Math.cos(t)**2, 0, x)
    },
    {
      id: 'itc-44', topic: 'integral-tech', difficulty: 3,
      stem: '在 $-\\pi<x<\\pi$ 上，求 $\\int\\frac{\\sin^4x}{1+\\cos x}\\,dx$。',
      choices: [
        { tex: '\\frac{x}{2}-\\frac{\\sin2x}{4}+\\frac{\\sin^3x}{3}+C', value: x => x/2-Math.sin(2*x)/4+Math.sin(x)**3/3 },
        { tex: 'x-\\frac{\\sin2x}{2}-\\frac{\\sin^3x}{3}+C', value: x => x-Math.sin(2*x)/2-Math.sin(x)**3/3 },
        { tex: '\\frac{x}{2}-\\frac{\\sin2x}{4}-\\sin^3x+C', value: x => x/2-Math.sin(2*x)/4-Math.sin(x)**3 },
        { tex: '\\frac{x}{2}-\\frac{\\sin2x}{4}-\\frac{\\sin^3x}{3}+C', value: x => x/2-Math.sin(2*x)/4-Math.sin(x)**3/3 }
      ],
      answer: 3, upToConstant: true,
      solution: '用 $\\sin^2x=(1-\\cos x)(1+\\cos x)$ 約分，被積函數成為 $\\sin^2x-\\sin^2x\\cos x$。第一項降冪，第二項令 $u=\\sin x$，得 $x/2-\\sin2x/4-\\sin^3x/3+C$。',
      check: N => x => N.integrate(t => Math.sin(t)**4/(1+Math.cos(t)), 0, x)
    },
    {
      id: 'itc-45', topic: 'integral-tech', difficulty: 3,
      stem: '在 $-3<x<3$ 上，以三角代換求 $\\int\\sqrt{9-x^2}\\,dx$。',
      choices: [
        { tex: '\\frac{x}{2}\\sqrt{9-x^2}-\\frac92\\arcsin(x/3)+C', value: x => x*Math.sqrt(9-x*x)/2-9*Math.asin(x/3)/2 },
        { tex: '\\frac{x}{2}\\sqrt{9-x^2}+\\frac92\\arcsin(x/3)+C', value: x => x*Math.sqrt(9-x*x)/2+9*Math.asin(x/3)/2 },
        { tex: 'x\\sqrt{9-x^2}+9\\arcsin(x/3)+C', value: x => x*Math.sqrt(9-x*x)+9*Math.asin(x/3) },
        { tex: '\\frac{x}{2}\\sqrt{9-x^2}+\\frac12\\arcsin(x/3)+C', value: x => x*Math.sqrt(9-x*x)/2+Math.asin(x/3)/2 }
      ],
      answer: 1, upToConstant: true,
      solution: '令 $x=3\\sin\\theta$ 且 $-\\pi/2<\\theta<\\pi/2$，積分化為 $9\\int\\cos^2\\theta\\,d\\theta$。降冪並用 $\\theta=\\arcsin(x/3)$ 回代，得 $x\\sqrt{9-x^2}/2+9\\arcsin(x/3)/2+C$。',
      check: N => x => N.integrate(t => Math.sqrt(9-t*t), 0, x)
    },
    {
      id: 'itc-46', topic: 'integral-tech', difficulty: 3,
      stem: '在 $x>1$ 上，求 $\\int\\frac{1}{x^2\\sqrt{x^2-1}}\\,dx$。',
      choices: [
        { tex: '-\\frac{\\sqrt{x^2-1}}x+C', value: x => -Math.sqrt(x*x-1)/x },
        { tex: '\\frac{x}{\\sqrt{x^2-1}}+C', value: x => x/Math.sqrt(x*x-1) },
        { tex: '\\frac{\\sqrt{x^2-1}}x+C', value: x => Math.sqrt(x*x-1)/x },
        { tex: '\\arccos(1/x)+C', value: x => Math.acos(1/x) }
      ],
      answer: 2, upToConstant: true, samples: [1.3, 1.6, 2, 3, 4],
      solution: '令 $x=\\sec\\theta$，取 $0<\\theta<\\pi/2$，根號為 $\\tan\\theta$。積分化成 $\\int\\cos\\theta\\,d\\theta=\\sin\\theta+C$，回代得 $\\sqrt{x^2-1}/x+C$。',
      check: N => x => N.integrate(t => 1/(t*t*Math.sqrt(t*t-1)), 2, x)
    },
    {
      id: 'itc-47', topic: 'integral-tech', difficulty: 3,
      stem: '以三角代換計算 $\\int_0^1\\frac{x^2}{\\sqrt{4-x^2}}\\,dx$，並正確換上下限。',
      choices: [
        { tex: '\\frac{\\pi}{3}-\\frac{\\sqrt3}{2}', value: Math.PI/3-Math.sqrt(3)/2 },
        { tex: '\\frac{\\pi}{3}+\\frac{\\sqrt3}{2}', value: Math.PI/3+Math.sqrt(3)/2 },
        { tex: '\\frac{\\pi}{12}-\\frac{\\sqrt3}{8}', value: Math.PI/12-Math.sqrt(3)/8 },
        { tex: '\\frac{\\pi}{3}', value: Math.PI/3 }
      ],
      answer: 0,
      solution: '令 $x=2\\sin\\theta$，新上下限為 $0,\\pi/6$，原式變成 $4\\int_0^{\\pi/6}\\sin^2\\theta\\,d\\theta$。由反導函數 $2\\theta-\\sin2\\theta$ 得 $\\pi/3-\\sqrt3/2$。',
      check: N => N.integrate(x => x*x/Math.sqrt(4-x*x), 0, 1)
    },
    {
      id: 'itc-48', topic: 'integral-tech', difficulty: 3,
      stem: '在 $x>1$ 上，求 $\\int\\frac{\\sqrt{x^2-1}}x\\,dx$。',
      choices: [
        { tex: '\\sqrt{x^2-1}+\\arccos(1/x)+C', value: x => Math.sqrt(x*x-1)+Math.acos(1/x) },
        { tex: '\\sqrt{x^2-1}+C', value: x => Math.sqrt(x*x-1) },
        { tex: '\\arccos(1/x)-\\sqrt{x^2-1}+C', value: x => Math.acos(1/x)-Math.sqrt(x*x-1) },
        { tex: '\\sqrt{x^2-1}-\\arccos(1/x)+C', value: x => Math.sqrt(x*x-1)-Math.acos(1/x) }
      ],
      answer: 3, upToConstant: true, samples: [1.3, 1.6, 2, 3, 4],
      solution: '令 $x=\\sec\\theta$、$0<\\theta<\\pi/2$，原式成為 $\\int\\tan^2\\theta\\,d\\theta=\\tan\\theta-\\theta+C$。回代 $\\tan\\theta=\\sqrt{x^2-1}$ 與 $\\theta=\\arccos(1/x)$。',
      check: N => x => N.integrate(t => Math.sqrt(t*t-1)/t, 2, x)
    },
    {
      id: 'itc-49', topic: 'integral-tech', difficulty: 3,
      stem: '對 $x>0$ 的 $\\int x\\ln(1+x^2)\\,dx$，想先換元再分部積分，下列第一步何者正確？',
      choices: [
        { tex: 'u=1+x^2,\\quad\\int\\ln u\\,du', value: u => Math.log(u) },
        { tex: 'u=1+x^2,\\quad\\frac12\\int\\ln u\\,du', value: u => Math.log(u)/2 },
        { tex: 'u=1+x^2,\\quad\\frac12\\int u\\,du', value: u => u/2 },
        { tex: 'u=1+x^2,\\quad\\frac12\\int\\frac{1}{u}\\,du', value: u => 1/(2*u) }
      ],
      answer: 1, samples: [1.3, 1.6, 2, 2.5, 3],
      solution: '換元 $u=1+x^2$ 時，$x\\,dx=du/2$，因此先得到 $\\frac12\\int\\ln u\\,du$。再取 $\\ln u$ 為分部積分的微分項，可得 $(u\\ln u-u)/2+C$。',
      check: N => u => {
        const x = Math.sqrt(u-1);
        return x*Math.log(1+x*x)*N.diff(v => Math.sqrt(v-1), u);
      }
    },
    {
      id: 'itc-50', topic: 'integral-tech', difficulty: 3,
      stem: '在 $x>0$ 上計算 $\\int\\frac{\\ln x}{x^2}\\,dx$，以下「技巧與反導函數」配對何者正確？',
      choices: [
        { tex: '\\text{直接套冪次公式：}\\ -\\frac{\\ln x}{x}+C', value: x => -Math.log(x)/x },
        { tex: '\\text{換元 }u=\\ln x\\text{：}\\ \\frac{(\\ln x)^2}{2}+C', value: x => Math.log(x)**2/2 },
        { tex: '\\text{分部積分：}\\ -\\frac{\\ln x+1}{x}+C', value: x => -(Math.log(x)+1)/x },
        { tex: '\\text{分部積分：}\\ \\frac{1-\\ln x}{x}+C', value: x => (1-Math.log(x))/x }
      ],
      answer: 2, upToConstant: true, samples: [0.5, 0.8, 1.4, 2, 3],
      solution: '取 $u=\\ln x$、$dv=x^{-2}\\,dx$，則 $v=-1/x$。分部積分給出 $-\\ln x/x+\\int x^{-2}\\,dx=-(\\ln x+1)/x+C$。',
      check: N => x => N.integrate(t => Math.log(t)/(t*t), 1, x)
    }
  ];
  Calc.questionBank = Calc.questionBank || {};
  Calc.questionBank['integral-tech'] = questions;
  if (typeof module !== 'undefined') module.exports = questions;
}(typeof window !== 'undefined' ? window : globalThis));
