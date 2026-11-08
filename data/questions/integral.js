(function (root) {
  var Calc = root.Calc = root.Calc || {};
  var questions = [
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
      id: 'int-11', topic: 'integral', difficulty: 1,
      stem: '求 $\\int(x^4-2x)\\,dx$，其中 $C$ 為任意常數。',
      choices: [{ tex: '\\frac{x^5}{5}-x^2+C', value: x => x**5/5-x*x }, { tex: '4x^3-2+C', value: x => 4*x**3-2 }, { tex: 'x^5-x^2+C', value: x => x**5-x*x }, { tex: '\\frac{x^5}{5}-2x^2+C', value: x => x**5/5-2*x*x }],
      answer: 0,
      solution: '逐項使用冪次積分公式，次方加一後除以新次方，得 $x^5/5-x^2+C$。',
      upToConstant: true,
      check: N => x => N.integrate(t => t**4-2*t, 0, x)
    },
    {
      id: 'int-12', topic: 'integral', difficulty: 1,
      stem: '下列哪個式子是 $\\sin x$ 的一般反導函數？其中 $C$ 為任意常數。',
      choices: [{ tex: '\\cos x+C', value: Math.cos }, { tex: '\\sin x+C', value: Math.sin }, { tex: '-\\cos x+C', value: x => -Math.cos(x) }, { tex: '-\\sin x+C', value: x => -Math.sin(x) }],
      answer: 2,
      solution: '因為 $(-\\cos x)\'=\\sin x$，所以反導函數為 $-\\cos x+C$。',
      upToConstant: true,
      check: N => x => N.integrate(Math.sin, 0, x)
    },
    {
      id: 'int-13', topic: 'integral', difficulty: 1,
      stem: '在 $x>0$ 上，$\\int \\frac1x\\,dx$ 等於哪一式？其中 $C$ 為任意常數。',
      choices: [{ tex: '-\\frac1{x^2}+C', value: x => -1/(x*x) }, { tex: '\\ln x+C', value: Math.log }, { tex: '-\\ln x+C', value: x => -Math.log(x) }, { tex: 'x\\ln x+C', value: x => x*Math.log(x) }],
      answer: 1,
      solution: '$x^{-1}$ 不適用分母為零的冪次公式；在正半軸上，其反導函數為 $\\ln x+C$。',
      samples: [0.4, 0.8, 1.5, 2.5], upToConstant: true,
      check: N => x => N.integrate(t => 1/t, 1, x)
    },
    {
      id: 'int-14', topic: 'integral', difficulty: 2,
      stem: '求 $\\int \\frac1{1+x^2}\\,dx$ 的一般形式，$C$ 為任意常數。',
      choices: [{ tex: '\\ln(1+x^2)+C', value: x => Math.log(1+x*x) }, { tex: '\\frac{x}{1+x^2}+C', value: x => x/(1+x*x) }, { tex: '-\\arctan x+C', value: x => -Math.atan(x) }, { tex: '\\arctan x+C', value: Math.atan }],
      answer: 3,
      solution: '反正切函數的導數為 $1/(1+x^2)$，因此答案為 $\\arctan x+C$。',
      upToConstant: true,
      check: N => x => N.integrate(t => 1/(1+t*t), 0, x)
    },
    {
      id: 'int-15', topic: 'integral', difficulty: 2,
      stem: '已知 $F\'(x)=1/\\sqrt{x}$（$x>0$）且 $F(1)=3$，求 $F(x)$。',
      choices: [{ tex: '2\\sqrt{x}+3', value: x => 2*Math.sqrt(x)+3 }, { tex: '2\\sqrt{x}+1', value: x => 2*Math.sqrt(x)+1 }, { tex: '\\frac12\\sqrt{x}+\\frac52', value: x => Math.sqrt(x)/2+2.5 }, { tex: '-2\\sqrt{x}+5', value: x => -2*Math.sqrt(x)+5 }],
      answer: 1,
      solution: '積分得 $F(x)=2\\sqrt{x}+C$；由 $F(1)=3$ 得 $C=1$。',
      samples: [0.25, 0.5, 1, 2, 4],
      check: N => x => 3+N.integrate(t => 1/Math.sqrt(t), 1, x)
    },
    {
      id: 'int-16', topic: 'integral', difficulty: 1,
      stem: '計算帶正負號的積分 $\\int_0^2(x-1)^3\\,dx$。',
      choices: [{ tex: '\\frac12', value: 1/2 }, { tex: '\\frac14', value: 1/4 }, { tex: '0', value: 0 }, { tex: '-\\frac12', value: -1/2 }],
      answer: 2,
      solution: '反導函數為 $(x-1)^4/4$，兩端的值相同，故積分為零。',
      check: N => N.integrate(x => (x-1)**3, 0, 2)
    },
    {
      id: 'int-17', topic: 'integral', difficulty: 2,
      stem: '設 $f(x)=\\begin{cases}x,&0\\le x<1,\\\\2-x,&1\\le x\\le3.\\end{cases}$ 求 $\\int_0^3 f(x)\\,dx$。',
      choices: [{ tex: '\\frac12', value: 1/2 }, { tex: '\\frac32', value: 3/2 }, { tex: '1', value: 1 }, { tex: '-\\frac12', value: -1/2 }],
      answer: 0,
      solution: '在 $x=1$ 分段，第一段積分為 $1/2$；第二段在 $x=2$ 左右的正負面積抵消為零。',
      check: N => N.integrate(x => x, 0, 1)+N.integrate(x => 2-x, 1, 3)
    },
    {
      id: 'int-18', topic: 'integral', difficulty: 1,
      stem: '令 $G(x)=\\int_0^x\\sqrt{1+t^2}\\,dt$，求 $G\'(3)$。',
      choices: [{ tex: '\\frac3{\\sqrt{10}}', value: 3/Math.sqrt(10) }, { tex: '10', value: 10 }, { tex: '\\sqrt{10}-1', value: Math.sqrt(10)-1 }, { tex: '\\sqrt{10}', value: Math.sqrt(10) }],
      answer: 3,
      solution: '由微積分基本定理，$G\'(x)=\\sqrt{1+x^2}$，代入 $x=3$ 得 $\\sqrt{10}$。',
      check: N => N.diff(x => N.integrate(t => Math.sqrt(1+t*t), 0, x), 3)
    },
    {
      id: 'int-19', topic: 'integral', difficulty: 2,
      stem: '若 $H(x)=\\int_0^{x^2}\\cos t\\,dt$，求 $H\'(\\sqrt{\\pi})$。',
      choices: [{ tex: '-1', value: -1 }, { tex: '-2\\sqrt{\\pi}', value: -2*Math.sqrt(Math.PI) }, { tex: '2\\sqrt{\\pi}', value: 2*Math.sqrt(Math.PI) }, { tex: '-\\sqrt{\\pi}', value: -Math.sqrt(Math.PI) }],
      answer: 1,
      solution: '基本定理配合連鎖律給出 $H\'(x)=2x\\cos(x^2)$，而 $\\cos\\pi=-1$。',
      check: N => N.diff(x => N.integrate(Math.cos, 0, x*x), Math.sqrt(Math.PI))
    },
    {
      id: 'int-20', topic: 'integral', difficulty: 3,
      stem: '設 $A(x)=\\int_x^{2x}(1+t^2)\\,dt$，求 $A\'(1)$。',
      choices: [{ tex: '8', value: 8 }, { tex: '3', value: 3 }, { tex: '10', value: 10 }, { tex: '12', value: 12 }],
      answer: 0,
      solution: '兩個端點都要微分：$A\'(x)=2(1+4x^2)-(1+x^2)$，代入得 $8$。',
      check: N => N.diff(x => N.integrate(t => 1+t*t, x, 2*x), 1)
    },
    {
      id: 'int-21', topic: 'integral', difficulty: 3,
      stem: '若 $B(x)=\\int_1^x\\ln(1+t^2)\\,dt$，求二階導數 $B\'\'(1)$。',
      choices: [{ tex: '\\ln2', value: Math.log(2) }, { tex: '2', value: 2 }, { tex: '1', value: 1 }, { tex: '\\frac12', value: 1/2 }],
      answer: 2,
      solution: '先得 $B\'(x)=\\ln(1+x^2)$，再微分得 $B\'\'(x)=2x/(1+x^2)$，故值為 $1$。',
      check: N => N.diff(x => N.diff(u => N.integrate(t => Math.log(1+t*t), 1, u), x), 1)
    },
    {
      id: 'int-22', topic: 'integral', difficulty: 3,
      stem: '令 $J(x)=\\int_{\\sin x}^1 e^{t^2}\\,dt$，求 $J\'(0)$。',
      choices: [{ tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '-e', value: -Math.E }, { tex: '-1', value: -1 }],
      answer: 3,
      solution: '變動的是下限，故 $J\'(x)=-e^{\\sin^2x}\\cos x$，代入零得 $-1$。',
      check: N => N.diff(x => N.integrate(t => Math.exp(t*t), Math.sin(x), 1), 0)
    },
    {
      id: 'int-23', topic: 'integral', difficulty: 1,
      stem: '曲線 $y=x$ 與 $y=x^2$ 在 $0\\le x\\le1$ 之間的面積為何？',
      choices: [{ tex: '\\frac13', value: 1/3 }, { tex: '\\frac16', value: 1/6 }, { tex: '-\\frac16', value: -1/6 }, { tex: '\\frac12', value: 1/2 }],
      answer: 1,
      solution: '此區間內 $x\\ge x^2$，面積為 $\\int_0^1(x-x^2)\\,dx=1/2-1/3=1/6$。',
      check: N => N.integrate(x => Math.abs(x-x*x), 0, 1)
    },
    {
      id: 'int-24', topic: 'integral', difficulty: 2,
      stem: '兩拋物線 $y=2-x^2$ 與 $y=x^2$ 所圍成的有限區域面積為何？',
      choices: [{ tex: '\\frac83', value: 8/3 }, { tex: '\\frac43', value: 4/3 }, { tex: '-\\frac83', value: -8/3 }, { tex: '\\frac{16}3', value: 16/3 }],
      answer: 0,
      solution: '交點橫座標為 $x=\\pm1$；積分上減下得 $\\int_{-1}^1(2-2x^2)\\,dx=8/3$。',
      check: N => {
        const bounds = N.roots(x => 2-2*x*x, -2, 2);
        return N.integrate(x => 2-2*x*x, bounds[0], bounds[1]);
      }
    },
    {
      id: 'int-25', topic: 'integral', difficulty: 3,
      stem: '求 $y=x^3$ 與 $y=x$ 在 $-1\\le x\\le1$ 之間的總面積。',
      choices: [{ tex: '0', value: 0 }, { tex: '\\frac14', value: 1/4 }, { tex: '1', value: 1 }, { tex: '\\frac12', value: 1/2 }],
      answer: 3,
      solution: '兩曲線在零點交換上下位置；利用對稱性，面積為 $2\\int_0^1(x-x^3)\\,dx=1/2$。',
      check: N => N.integrate(x => Math.abs(x*x*x-x), -1, 0)+N.integrate(x => Math.abs(x*x*x-x), 0, 1)
    },
    {
      id: 'int-26', topic: 'integral', difficulty: 3,
      stem: '在 $0\\le x\\le\\pi/2$ 中，$y=\\sin x$ 與 $y=\\cos x$ 之間的面積為何？',
      choices: [{ tex: '0', value: 0 }, { tex: '\\sqrt2-1', value: Math.sqrt(2)-1 }, { tex: '2\\sqrt2-2', value: 2*Math.sqrt(2)-2 }, { tex: '2\\sqrt2', value: 2*Math.sqrt(2) }],
      answer: 2,
      solution: '在交點 $x=\\pi/4$ 分段，面積為 $2\\int_0^{\\pi/4}(\\cos x-\\sin x)\\,dx=2\\sqrt2-2$。',
      check: N => {
        const cross = N.roots(x => Math.sin(x)-Math.cos(x), 0, Math.PI/2)[0];
        return N.integrate(x => Math.cos(x)-Math.sin(x), 0, cross)+N.integrate(x => Math.sin(x)-Math.cos(x), cross, Math.PI/2);
      }
    },
    {
      id: 'int-27', topic: 'integral', difficulty: 1,
      stem: '函數 $f(x)=x^2$ 在區間 $[0,3]$ 的平均值為何？',
      choices: [{ tex: '9', value: 9 }, { tex: '3', value: 3 }, { tex: '\\frac92', value: 9/2 }, { tex: '1', value: 1 }],
      answer: 1,
      solution: '平均值為積分除以區間長度，即 $\\frac13\\int_0^3 x^2\\,dx=3$。',
      check: N => N.integrate(x => x*x, 0, 3)/(3-0)
    },
    {
      id: 'int-28', topic: 'integral', difficulty: 1,
      stem: '溫度隨時間為 $T(t)=18+4t$，求 $1\\le t\\le3$ 這段時間的平均溫度。',
      choices: [{ tex: '52', value: 52 }, { tex: '8', value: 8 }, { tex: '30', value: 30 }, { tex: '26', value: 26 }],
      answer: 3,
      solution: '平均溫度為 $\\frac1{3-1}\\int_1^3(18+4t)\\,dt=26$。',
      check: N => N.integrate(t => 18+4*t, 1, 3)/(3-1)
    },
    {
      id: 'int-29', topic: 'integral', difficulty: 2,
      stem: '求 $f(x)=\\sin x$ 在半個週期 $[0,\\pi]$ 上的函數平均值。',
      choices: [{ tex: '\\frac2\\pi', value: 2/Math.PI }, { tex: '2', value: 2 }, { tex: '0', value: 0 }, { tex: '\\frac1\\pi', value: 1/Math.PI }],
      answer: 0,
      solution: '此區間的積分是 $2$，再除以長度 $\\pi$，得平均值 $2/\\pi$。',
      check: N => N.integrate(Math.sin, 0, Math.PI)/Math.PI
    },
    {
      id: 'int-30', topic: 'integral', difficulty: 3,
      stem: '函數 $f(x)=|\\ln x|$ 在 $[e^{-1},e]$ 上的平均值為何？',
      choices: [{ tex: '2-\\frac2e', value: 2-2/Math.E }, { tex: '\\frac2{e^2-1}', value: 2/(Math.E**2-1) }, { tex: '\\frac2{e+1}', value: 2/(Math.E+1) }, { tex: '\\frac1{e+1}', value: 1/(Math.E+1) }],
      answer: 2,
      solution: '在 $x=1$ 分段，積分為 $\\int_{e^{-1}}^1-\\ln x\\,dx+\\int_1^e\\ln x\\,dx=2-2/e$。除以區間長度 $e-e^{-1}$，化簡得 $2/(e+1)$。',
      check: N => (N.integrate(x => -Math.log(x), 1/Math.E, 1)+N.integrate(Math.log, 1, Math.E))/(Math.E-1/Math.E)
    },
    {
      id: 'int-31', topic: 'integral', difficulty: 1,
      stem: '利用奇偶性計算 $\\int_{-2}^2\\frac{x}{1+x^2}\\,dx$。',
      choices: [{ tex: '\\ln5', value: Math.log(5) }, { tex: '0', value: 0 }, { tex: '2\\ln5', value: 2*Math.log(5) }, { tex: '-\\ln5', value: -Math.log(5) }],
      answer: 1,
      solution: '被積函數是奇函數，在以零為中心的對稱區間上，積分為零。',
      check: N => N.integrate(x => x/(1+x*x), -2, 2)
    },
    {
      id: 'int-32', topic: 'integral', difficulty: 1,
      stem: '因 $e^{-|x|}$ 為偶函數，$\\int_{-1}^1 e^{-|x|}\\,dx$ 的值為何？',
      choices: [{ tex: '2(1-e^{-1})', value: 2*(1-1/Math.E) }, { tex: '0', value: 0 }, { tex: '1-e^{-1}', value: 1-1/Math.E }, { tex: '2(e-1)', value: 2*(Math.E-1) }],
      answer: 0,
      solution: '偶函數的積分是右半區間的兩倍，即 $2\\int_0^1 e^{-x}\\,dx=2(1-e^{-1})$。',
      check: N => N.integrate(x => Math.exp(-Math.abs(x)), -1, 0)+N.integrate(x => Math.exp(-Math.abs(x)), 0, 1)
    },
    {
      id: 'int-33', topic: 'integral', difficulty: 2,
      stem: '連續奇函數 $f$ 滿足 $\\int_0^2 f(x)\\,dx=3$，求 $\\int_{-2}^0[f(x)+x^2]\\,dx$。',
      choices: [{ tex: '\\frac{17}3', value: 17/3 }, { tex: '\\frac13', value: 1/3 }, { tex: '-3', value: -3 }, { tex: '-\\frac13', value: -1/3 }],
      answer: 3,
      solution: '奇函數的左半區間積分為 $-3$；加上 $\\int_{-2}^0x^2\\,dx=8/3$，得到 $-1/3$。',
      check: N => {
        const f = x => 1.5*x;
        if (Math.abs(N.integrate(f, 0, 2)-3) > 1e-8) throw new Error('實例不符合已知積分');
        return N.integrate(x => f(x)+x*x, -2, 0);
      }
    },
    {
      id: 'int-34', topic: 'integral', difficulty: 3,
      stem: '已知 $g(x)=1/(1+e^x)$ 滿足 $g(x)+g(-x)=1$，求 $\\int_{-1}^1 g(x)\\,dx$。',
      choices: [{ tex: '2', value: 2 }, { tex: '\\frac12', value: 1/2 }, { tex: '1', value: 1 }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '把負半軸換成正半軸後，積分為 $\\int_0^1[g(x)+g(-x)]\\,dx=\\int_0^1 1\\,dx=1$。',
      check: N => N.integrate(x => 1/(1+Math.exp(x)), -1, 1)
    },
    {
      id: 'int-35', topic: 'integral', difficulty: 1,
      stem: '已知 $\\int_1^4 f(x)\\,dx=7$ 且 $\\int_4^6 f(x)\\,dx=-2$，求 $\\int_1^6 f(x)\\,dx$。',
      choices: [{ tex: '9', value: 9 }, { tex: '5', value: 5 }, { tex: '-5', value: -5 }, { tex: '-14', value: -14 }],
      answer: 1,
      solution: '相鄰區間的積分可相加，故結果為 $7+(-2)=5$。',
      check: N => {
        const f = x => (17-4*x)/3;
        if (Math.abs(N.integrate(f, 1, 4)-7) > 1e-8 || Math.abs(N.integrate(f, 4, 6)+2) > 1e-8) throw new Error('實例不符合已知積分');
        return N.integrate(f, 1, 6);
      }
    },
    {
      id: 'int-36', topic: 'integral', difficulty: 1,
      stem: '若 $\\int_0^2 f(x)\\,dx=5$，則 $\\int_2^0 3f(x)\\,dx$ 等於多少？',
      choices: [{ tex: '-15', value: -15 }, { tex: '15', value: 15 }, { tex: '-5', value: -5 }, { tex: '-\\frac53', value: -5/3 }],
      answer: 0,
      solution: '常數 $3$ 可提出積分號，交換上下限又使符號反轉，故為 $-3\\cdot5=-15$。',
      check: N => {
        const f = x => 2.5*x;
        if (Math.abs(N.integrate(f, 0, 2)-5) > 1e-8) throw new Error('實例不符合已知積分');
        return N.integrate(x => 3*f(x), 2, 0);
      }
    },
    {
      id: 'int-37', topic: 'integral', difficulty: 2,
      stem: '已知 $\\int_0^3 f(x)\\,dx=4$、$\\int_1^3 f(x)\\,dx=6$，求 $\\int_0^1[2f(x)+1]\\,dx$。',
      choices: [{ tex: '5', value: 5 }, { tex: '-4', value: -4 }, { tex: '21', value: 21 }, { tex: '-3', value: -3 }],
      answer: 3,
      solution: '先得 $\\int_0^1 f(x)\\,dx=4-6=-2$；目標積分為 $2(-2)+1=-3$。',
      check: N => {
        const f = x => (10*x-11)/3;
        if (Math.abs(N.integrate(f, 0, 3)-4) > 1e-8 || Math.abs(N.integrate(f, 1, 3)-6) > 1e-8) throw new Error('實例不符合已知積分');
        return N.integrate(x => 2*f(x)+1, 0, 1);
      }
    },
    {
      id: 'int-38', topic: 'integral', difficulty: 3,
      stem: '設 $F(x)=\\int_0^x f(t)\\,dt$，且 $F(1)=2$、$F(3)=-1$。求 $\\int_3^1[f(x)+x]\\,dx$。',
      choices: [{ tex: '7', value: 7 }, { tex: '1', value: 1 }, { tex: '-1', value: -1 }, { tex: '-7', value: -7 }],
      answer: 2,
      solution: '函數部分為 $F(1)-F(3)=3$，而 $\\int_3^1x\\,dx=-4$，相加得 $-1$。',
      check: N => {
        const f = x => (19-14*x)/6;
        if (Math.abs(N.integrate(f, 0, 1)-2) > 1e-8 || Math.abs(N.integrate(f, 0, 3)+1) > 1e-8) throw new Error('實例不符合已知積分');
        return N.integrate(x => f(x)+x, 3, 1);
      }
    },
    {
      id: 'int-39', topic: 'integral', difficulty: 1,
      stem: '把右端點黎曼和化為定積分，求 $\\lim_{n\\to\\infty}\\sum_{i=1}^n\\frac{i}{n}\\frac1n$。',
      choices: [{ tex: '\\frac12', value: 1/2 }, { tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '\\frac13', value: 1/3 }],
      answer: 0,
      solution: '分割寬度為 $1/n$，取樣點為 $i/n$，故極限是 $\\int_0^1x\\,dx=1/2$。',
      check: N => N.limitInf(n => N.sum(i => (i/n)*(1/n), 1, n))
    },
    {
      id: 'int-40', topic: 'integral', difficulty: 2,
      stem: '求黎曼和的極限 $\\lim_{n\\to\\infty}\\sum_{i=1}^n\\frac2n\\sqrt{1+\\frac{2i}n}$。',
      choices: [{ tex: '\\frac{3\\sqrt3-1}{3}', value: (3*Math.sqrt(3)-1)/3 }, { tex: '2(\\sqrt3-1)', value: 2*(Math.sqrt(3)-1) }, { tex: '2\\sqrt3', value: 2*Math.sqrt(3) }, { tex: '\\frac23(3\\sqrt3-1)', value: 2*(3*Math.sqrt(3)-1)/3 }],
      answer: 3,
      solution: '此和對應 $\\int_1^3\\sqrt{x}\\,dx$，代入反導函數 $2x^{3/2}/3$ 得 $2(3\\sqrt3-1)/3$。',
      check: N => N.limitInf(n => N.sum(i => (2/n)*Math.sqrt(1+2*i/n), 1, n))
    },
    {
      id: 'int-41', topic: 'integral', difficulty: 3,
      stem: '使用每段中點取樣，求 $\\lim_{n\\to\\infty}\\frac\\pi n\\sum_{i=1}^n\\cos^2\\!\\left(\\frac{(i-1/2)\\pi}{n}\\right)$。',
      choices: [{ tex: '\\pi', value: Math.PI }, { tex: '\\frac\\pi2', value: Math.PI/2 }, { tex: '0', value: 0 }, { tex: '\\frac{\\pi^2}2', value: Math.PI**2/2 }],
      answer: 1,
      solution: '這是 $[0,\\pi]$ 上的中點黎曼和，極限為 $\\int_0^\\pi\\cos^2x\\,dx$。用 $\\cos^2x=(1+\\cos2x)/2$ 得 $\\pi/2$。',
      check: N => N.limitInf(n => (Math.PI/n)*N.sum(i => Math.cos((i-0.5)*Math.PI/n)**2, 1, n))
    },
    {
      id: 'int-42', topic: 'integral', difficulty: 3,
      stem: '將每項改寫成「函數值乘分割寬度」，求 $\\lim_{n\\to\\infty}\\sum_{i=1}^n\\frac1{n+i}$。',
      choices: [{ tex: '0', value: 0 }, { tex: '1', value: 1 }, { tex: '\\ln2', value: Math.log(2) }, { tex: '\\frac12', value: 1/2 }],
      answer: 2,
      solution: '因 $1/(n+i)=\\frac1n\\frac1{1+i/n}$，極限為 $\\int_0^1\\frac1{1+x}\\,dx=\\ln2$。',
      check: N => N.limitInf(n => N.sum(i => 1/(n+i), 1, n))
    },
    {
      id: 'int-43', topic: 'integral', difficulty: 2,
      stem: '判斷瑕積分 $\\int_1^\\infty\\frac1{x^2}\\,dx$；若收斂，求其值。',
      choices: [{ tex: '\\text{發散}', value: 'diverge' }, { tex: '-1', value: -1 }, { tex: '\\frac12', value: 1/2 }, { tex: '1', value: 1 }],
      answer: 3,
      solution: '先積到 $R$ 得 $1-1/R$，再令 $R\\to\\infty$，極限為 $1$，故收斂。',
      check: N => N.improper(x => 1/(x*x), 1, Infinity)
    },
    {
      id: 'int-44', topic: 'integral', difficulty: 2,
      stem: '被積函數在零點無界，瑕積分 $\\int_0^1\\frac1{\\sqrt{x}}\\,dx$ 是否收斂？若收斂，值為何？',
      choices: [{ tex: '2', value: 2 }, { tex: '1', value: 1 }, { tex: '\\frac12', value: 1/2 }, { tex: '\\text{發散}', value: 'diverge' }],
      answer: 0,
      solution: '從 $\\varepsilon>0$ 積到 $1$ 得 $2-2\\sqrt{\\varepsilon}$；令 $\\varepsilon\\to0^+$ 得 $2$，故收斂。',
      check: N => N.improper(x => 1/Math.sqrt(x), 0, 1)
    },
    {
      id: 'int-45', topic: 'integral', difficulty: 3,
      stem: '依通常瑕積分的定義（須分別處理零點兩側），$\\int_{-1}^1\\frac1{x^2}\\,dx$ 的結果為何？',
      choices: [{ tex: '0', value: 0 }, { tex: '\\text{發散}', value: 'diverge' }, { tex: '-2', value: -2 }, { tex: '2', value: 2 }],
      answer: 1,
      solution: '零點兩側須各自收斂才有積分值，但 $\\int_\\varepsilon^1 x^{-2}\\,dx=1/\\varepsilon-1\\to+\\infty$，所以發散。',
      check: N => {
        const left = N.improper(x => 1/(x*x), -1, 0);
        const right = N.improper(x => 1/(x*x), 0, 1);
        return left === 'diverge' || right === 'diverge' ? 'diverge' : left+right;
      }
    },
    {
      id: 'int-46', topic: 'integral', difficulty: 3,
      stem: '求無窮區間上的瑕積分 $\\int_0^\\infty e^{-2x}\\,dx$，或判定發散。',
      choices: [{ tex: '1', value: 1 }, { tex: '2', value: 2 }, { tex: '\\frac12', value: 1/2 }, { tex: '\\text{發散}', value: 'diverge' }],
      answer: 2,
      solution: '截斷到 $R$ 的積分是 $(1-e^{-2R})/2$；當 $R\\to\\infty$，指數項趨零，得 $1/2$。',
      check: N => N.improper(x => Math.exp(-2*x), 0, Infinity)
    },
    {
      id: 'int-47', topic: 'integral', difficulty: 1,
      stem: '將 $0\\le x\\le4$、$0\\le y\\le\\sqrt{x}$ 的區域繞 $x$ 軸旋轉一周，圓盤法算出的體積為何？',
      choices: [{ tex: '8\\pi', value: 8*Math.PI }, { tex: '\\frac{16\\pi}3', value: 16*Math.PI/3 }, { tex: '16\\pi', value: 16*Math.PI }, { tex: '8', value: 8 }],
      answer: 0,
      solution: '圓盤半徑為 $\\sqrt{x}$，截面積為 $\\pi x$，故體積為 $\\pi\\int_0^4x\\,dx=8\\pi$。',
      check: N => N.integrate(x => Math.PI*Math.sqrt(x)**2, 0, 4)
    },
    {
      id: 'int-48', topic: 'integral', difficulty: 2,
      stem: '由直線 $y=1-x$、$x$ 軸與 $y$ 軸圍成的三角形繞 $x$ 軸一周，其體積為何？',
      choices: [{ tex: '\\frac\\pi2', value: Math.PI/2 }, { tex: '\\frac{2\\pi}3', value: 2*Math.PI/3 }, { tex: '\\pi', value: Math.PI }, { tex: '\\frac\\pi3', value: Math.PI/3 }],
      answer: 3,
      solution: '圓盤半徑為 $1-x$，體積是 $\\pi\\int_0^1(1-x)^2\\,dx=\\pi/3$。',
      check: N => N.integrate(x => Math.PI*(1-x)**2, 0, 1)
    },
    {
      id: 'int-49', topic: 'integral', difficulty: 2,
      stem: '區域 $0\\le x\\le\\ln2$、$0\\le y\\le e^x$ 繞 $x$ 軸旋轉，求所得體積。',
      choices: [{ tex: '\\pi', value: Math.PI }, { tex: '\\frac{3\\pi}2', value: 3*Math.PI/2 }, { tex: '3\\pi', value: 3*Math.PI }, { tex: '\\pi\\ln2', value: Math.PI*Math.log(2) }],
      answer: 1,
      solution: '半徑平方為 $e^{2x}$，所以 $V=\\pi\\int_0^{\\ln2}e^{2x}\\,dx=\\pi(4-1)/2=3\\pi/2$。',
      check: N => N.integrate(x => Math.PI*Math.exp(x)**2, 0, Math.log(2))
    },
    {
      id: 'int-50', topic: 'integral', difficulty: 3,
      stem: '區域 $0\\le x\\le1$、$0\\le y\\le x^2$ 繞直線 $y=-1$ 旋轉一周，以外圓盤減內圓盤求體積。',
      choices: [{ tex: '\\frac\\pi5', value: Math.PI/5 }, { tex: '\\frac{28\\pi}{15}', value: 28*Math.PI/15 }, { tex: '\\frac{13\\pi}{15}', value: 13*Math.PI/15 }, { tex: '\\frac{2\\pi}3', value: 2*Math.PI/3 }],
      answer: 2,
      solution: '外半徑為 $x^2+1$，內半徑為 $1$。故 $V=\\pi\\int_0^1[(x^2+1)^2-1]\\,dx=\\pi(1/5+2/3)=13\\pi/15$。',
      check: N => N.integrate(x => N.integrate(y => 2*Math.PI*(y+1), 0, x*x), 0, 1)
    }
  ];
  Calc.questionBank = Calc.questionBank || {};
  Calc.questionBank['integral'] = questions;
  if (typeof module !== 'undefined') module.exports = questions;
}(typeof window !== 'undefined' ? window : globalThis));
