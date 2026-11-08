(function (root) {
  var Calc = root.Calc = root.Calc || {};
  var questions = [
    {
      id: 'dap-01', topic: 'derivative-app', difficulty: 1,
      stem: '曲線 $y=x^2+3x$ 在 $x=1$ 處的切線斜率是多少？',
      choices: [{ tex: '5', value: 5 }, { tex: '4', value: 4 }, { tex: '2', value: 2 }, { tex: '3', value: 3 }],
      answer: 0,
      solution: '切線斜率為 $y\'=2x+3$ 在 $x=1$ 的值，即 $5$。',
      check: N => N.diff(x => x*x+3*x, 1)
    },
    {
      id: 'dap-02', topic: 'derivative-app', difficulty: 1,
      stem: '求 $y=\\sqrt{x}$ 在點 $(4,2)$ 的切線方程式。',
      choices: [{ tex: 'y=\\frac{x}{2}', value: x => x/2 }, { tex: 'y=\\frac{x}{4}+2', value: x => x/4+2 }, { tex: 'y=\\frac{x}{4}+1', value: x => x/4+1 }, { tex: 'y=4x-14', value: x => 4*x-14 }],
      answer: 2,
      solution: '斜率為 $1/(2\\sqrt4)=1/4$，代入點斜式得 $y-2=(x-4)/4$。',
      check: N => x => Math.sqrt(4)+N.diff(Math.sqrt, 4)*(x-4)
    },
    {
      id: 'dap-03', topic: 'derivative-app', difficulty: 2,
      stem: '曲線 $y=x\\ln x$（$x>0$）上，切線平行於 $y=2x+1$ 的點，其橫座標為何？',
      choices: [{ tex: 'e^2', value: Math.exp(2) }, { tex: 'e', value: Math.E }, { tex: '1', value: 1 }, { tex: 'e^{-1}', value: 1/Math.E }],
      answer: 1,
      solution: '由 $y\'=\\ln x+1=2$，得 $x=e$；切線平行只需斜率相同。',
      check: N => N.roots(x => N.diff(t => t*Math.log(t), x)-2, 0.2, 9)[0]
    },
    {
      id: 'dap-04', topic: 'derivative-app', difficulty: 3,
      stem: '橢圓 $x^2+4y^2=20$ 在點 $(2,2)$ 的切線方程式為何？',
      choices: [{ tex: 'y=-x+4', value: x => -x+4 }, { tex: 'y=\\frac{x}{4}+\\frac32', value: x => x/4+1.5 }, { tex: 'y=-4x+10', value: x => -4*x+10 }, { tex: 'y=-\\frac{x}{4}+\\frac52', value: x => -x/4+2.5 }],
      answer: 3,
      solution: '隱微分得 $2x+8yy\'=0$，故該點斜率為 $-1/4$，切線為 $y-2=-(x-2)/4$。',
      check: N => {
        const F = (x, y) => x*x+4*y*y-20;
        const m = -N.diff(x => F(x, 2), 2)/N.diff(y => F(2, y), 2);
        return x => 2+m*(x-2);
      }
    },
    {
      id: 'dap-05', topic: 'derivative-app', difficulty: 1,
      stem: '求拋物線 $y=x^2$ 在 $(1,1)$ 的法線方程式。',
      choices: [{ tex: 'y=2x-1', value: x => 2*x-1 }, { tex: 'y=\\frac{x}{2}+\\frac12', value: x => x/2+0.5 }, { tex: 'y=-\\frac{x}{2}+\\frac32', value: x => -x/2+1.5 }, { tex: 'y=-2x+3', value: x => -2*x+3 }],
      answer: 2,
      solution: '切線斜率為 $2$，法線斜率是負倒數 $-1/2$；再代入 $(1,1)$。',
      check: N => x => 1-(x-1)/N.diff(t => t*t, 1)
    },
    {
      id: 'dap-06', topic: 'derivative-app', difficulty: 2,
      stem: '對數曲線 $y=\\ln x$ 在 $x=e$ 的法線為何？',
      choices: [{ tex: 'y=-ex+e^2+1', value: x => -Math.E*x+Math.E**2+1 }, { tex: 'y=\\frac{x}{e}', value: x => x/Math.E }, { tex: 'y=ex-e^2+1', value: x => Math.E*x-Math.E**2+1 }, { tex: 'y=-ex+e^2', value: x => -Math.E*x+Math.E**2 }],
      answer: 0,
      solution: '該點是 $(e,1)$，切線斜率為 $1/e$，故法線為 $y-1=-e(x-e)$。',
      check: N => x => Math.log(Math.E)-(x-Math.E)/N.diff(Math.log, Math.E)
    },
    {
      id: 'dap-07', topic: 'derivative-app', difficulty: 3,
      stem: '曲線 $y=x^3$ 在原點的法線是哪一條直線？',
      choices: [{ tex: 'y=0', value: [0, 1, 0] }, { tex: 'y=x', value: [1, -1, 0] }, { tex: 'y=-x', value: [1, 1, 0] }, { tex: 'x=0', value: [1, 0, 0] }],
      answer: 3,
      solution: '原點的切線斜率為 $0$，切線水平，因此法線為鉛直線 $x=0$。',
      // 以 [A,B,C] 表示直線 Ax+By=C，法線方向為 (切線斜率,-1)。
      check: N => {
        const a = 0, f = x => x*x*x, m = N.diff(f, a);
        return [1, m, a+m*f(a)];
      }
    },
    {
      id: 'dap-08', topic: 'derivative-app', difficulty: 1,
      stem: '函數 $f(x)=x^3-3x$ 的所有臨界數（橫座標，由小到大）為何？',
      choices: [{ tex: '\\{-\\sqrt3,\\sqrt3\\}', value: [-Math.sqrt(3), Math.sqrt(3)] }, { tex: '\\{-1,1\\}', value: [-1, 1] }, { tex: '\\{0\\}', value: [0] }, { tex: '\\{-3,3\\}', value: [-3, 3] }],
      answer: 1,
      solution: '多項式處處可微，解 $f\'(x)=3x^2-3=0$ 得臨界數 $-1,1$。',
      check: N => N.roots(x => N.diff(t => t*t*t-3*t, x), -3, 3)
    },
    {
      id: 'dap-09', topic: 'derivative-app', difficulty: 2,
      stem: '函數 $f(x)=|x-2|$ 在哪個橫座標有「導數不存在」的臨界點？',
      choices: [{ tex: '0', value: 0 }, { tex: '-2', value: -2 }, { tex: '2', value: 2 }, { tex: '\\text{不存在}', value: 'none' }],
      answer: 2,
      solution: '在 $x=2$ 處，左斜率為 $-1$、右斜率為 $1$；函數有定義但不可微，所以是臨界點。',
      check: N => {
        const f = x => Math.abs(x-2), c = N.minimize(f, -1, 5).x, h = 0.01;
        return Math.abs((f(c+h)-f(c))/h-(f(c)-f(c-h))/h) > 1 ? c : 'none';
      }
    },
    {
      id: 'dap-10', topic: 'derivative-app', difficulty: 3,
      stem: '設 $f(x)=x^2/(x-1)$（$x\\ne1$），求全部臨界數，由小到大列出。',
      choices: [{ tex: '\\{0,2\\}', value: [0, 2] }, { tex: '\\{0,1,2\\}', value: [0, 1, 2] }, { tex: '\\{1\\}', value: [1] }, { tex: '\\{0\\}', value: [0] }],
      answer: 0,
      solution: '商法則得 $f\'(x)=x(x-2)/(x-1)^2$，故臨界數為 $0,2$；$x=1$ 不在定義域內。',
      check: N => {
        const d = x => N.diff(t => t*t/(t-1), x);
        return N.roots(d, -3, 0.5).concat(N.roots(d, 1.5, 4));
      }
    },
    {
      id: 'dap-11', topic: 'derivative-app', difficulty: 2,
      stem: '對 $f(x)=xe^{-x}$，使切線水平的橫座標為何？',
      choices: [{ tex: '0', value: 0 }, { tex: '-1', value: -1 }, { tex: '\\text{不存在}', value: 'none' }, { tex: '1', value: 1 }],
      answer: 3,
      solution: '乘法法則給出 $f\'(x)=e^{-x}(1-x)$，指數因子不為零，因此 $x=1$。',
      check: N => {
        const roots = N.roots(x => N.diff(t => t*Math.exp(-t), x), -2, 4);
        return roots.length ? roots[0] : 'none';
      }
    },
    {
      id: 'dap-12', topic: 'derivative-app', difficulty: 1,
      stem: '函數 $f(x)=x^2-6x+11$ 的局部極小值是多少（回答函數值）？',
      choices: [{ tex: '3', value: 3 }, { tex: '2', value: 2 }, { tex: '11', value: 11 }, { tex: '-2', value: -2 }],
      answer: 1,
      solution: '配方得 $f(x)=(x-3)^2+2$，所以在 $x=3$ 取得局部極小值 $2$。',
      check: N => N.minimize(x => x*x-6*x+11, 0, 6).value
    },
    {
      id: 'dap-13', topic: 'derivative-app', difficulty: 2,
      stem: '曲線 $y=x^3-6x^2+9x+1$ 的局部極大點座標是哪一個？',
      choices: [{ tex: '(3,1)', value: [3, 1] }, { tex: '(1,1)', value: [1, 1] }, { tex: '(1,5)', value: [1, 5] }, { tex: '(3,5)', value: [3, 5] }],
      answer: 2,
      solution: '由 $y\'=3(x-1)(x-3)$，在 $x=1$ 處導數由正轉負，且 $y(1)=5$。',
      check: N => {
        const f = x => x*x*x-6*x*x+9*x+1;
        const roots = N.roots(x => N.diff(f, x), -1, 4);
        const c = roots.find(x => N.diff(f, x-0.1) > 0 && N.diff(f, x+0.1) < 0);
        return [c, f(c)];
      }
    },
    {
      id: 'dap-14', topic: 'derivative-app', difficulty: 3,
      stem: '偶函數 $f(x)=x^4-4x^2$ 有兩個局部極小點，這兩點共同的函數值為何？',
      choices: [{ tex: '-2', value: -2 }, { tex: '0', value: 0 }, { tex: '4', value: 4 }, { tex: '-4', value: -4 }],
      answer: 3,
      solution: '由 $f\'(x)=4x(x^2-2)$，兩個極小點的橫座標為 $\\pm\\sqrt2$，代入都得 $-4$。',
      check: N => N.minimize(x => x**4-4*x*x, -3, 3).value
    },
    {
      id: 'dap-15', topic: 'derivative-app', difficulty: 2,
      stem: '已知 $f(x)=x^3$，原點屬於哪一種情況？',
      choices: [{ tex: '\\text{駐點，但不是局部極值點}', value: 'stationary' }, { tex: '\\text{局部極大點}', value: 'maximum' }, { tex: '\\text{局部極小點}', value: 'minimum' }, { tex: '\\text{不是駐點}', value: 'nonstationary' }],
      answer: 0,
      solution: '雖然 $f\'(0)=0$，但兩側 $f\'(x)=3x^2$ 都為正，函數持續遞增，沒有局部極值。',
      check: N => {
        const f = x => x*x*x, left = N.diff(f, -0.1), right = N.diff(f, 0.1);
        if (Math.abs(N.diff(f, 0)) > 1e-6) return 'nonstationary';
        return left > 0 && right < 0 ? 'maximum' : left < 0 && right > 0 ? 'minimum' : 'stationary';
      }
    },
    {
      id: 'dap-16', topic: 'derivative-app', difficulty: 1,
      stem: '在閉區間 $[0,3]$ 上，$f(x)=x^2-2x$ 的絕對最大值為何？',
      choices: [{ tex: '-1', value: -1 }, { tex: '0', value: 0 }, { tex: '3', value: 3 }, { tex: '1', value: 1 }],
      answer: 2,
      solution: '比較端點及臨界點：$f(0)=0$、$f(1)=-1$、$f(3)=3$，最大值為 $3$。',
      check: N => N.maximize(x => x*x-2*x, 0, 3).value
    },
    {
      id: 'dap-17', topic: 'derivative-app', difficulty: 2,
      stem: '求 $f(x)=x+1/x$ 在 $[1/2,3]$ 的絕對最小值。',
      choices: [{ tex: '1', value: 1 }, { tex: '2', value: 2 }, { tex: '\\frac52', value: 2.5 }, { tex: '\\frac{10}{3}', value: 10/3 }],
      answer: 1,
      solution: '區間內的臨界數為 $x=1$，函數值 $2$ 小於端點的 $5/2$ 與 $10/3$。',
      check: N => N.minimize(x => x+1/x, 0.5, 3).value
    },
    {
      id: 'dap-18', topic: 'derivative-app', difficulty: 3,
      stem: '函數 $f(x)=x^2e^{-x}$ 在 $[0,5]$ 的絕對最大值是多少？',
      choices: [{ tex: '4e^{-2}', value: 4*Math.exp(-2) }, { tex: '2e^{-2}', value: 2*Math.exp(-2) }, { tex: '25e^{-5}', value: 25*Math.exp(-5) }, { tex: '0', value: 0 }],
      answer: 0,
      solution: '$f\'(x)=xe^{-x}(2-x)$，在 $x=2$ 前增後減；比較端點後，最大值為 $4e^{-2}$。',
      check: N => N.maximize(x => x*x*Math.exp(-x), 0, 5).value
    },
    {
      id: 'dap-19', topic: 'derivative-app', difficulty: 1,
      stem: '限制 $0\\le x\\le\\pi/6$ 時，$y=\\sin x$ 的絕對最大值為何？',
      choices: [{ tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '\\frac{\\sqrt3}{2}', value: Math.sqrt(3)/2 }, { tex: '\\frac12', value: 0.5 }],
      answer: 3,
      solution: '此區間上 $\\cos x>0$，故函數遞增，最大值是右端點的 $\\sin(\\pi/6)=1/2$。',
      check: N => N.maximize(Math.sin, 0, Math.PI/6).value
    },
    {
      id: 'dap-20', topic: 'derivative-app', difficulty: 1,
      stem: '$f(x)=x^3-12x$ 的最大遞減開區間為何？',
      choices: [{ tex: '(-\\sqrt{12},\\sqrt{12})', value: [-Math.sqrt(12), Math.sqrt(12)] }, { tex: '(0,2)', value: [0, 2] }, { tex: '(-2,2)', value: [-2, 2] }, { tex: '(-4,4)', value: [-4, 4] }],
      answer: 2,
      solution: '由 $f\'(x)=3(x-2)(x+2)<0$，得遞減區間 $(-2,2)$。',
      check: N => {
        const d = x => N.diff(t => t*t*t-12*t, x), roots = N.roots(d, -5, 5);
        if (d((roots[0]+roots[1])/2) >= 0) throw new Error('中間區間不是遞減');
        return roots;
      }
    },
    {
      id: 'dap-21', topic: 'derivative-app', difficulty: 2,
      stem: '對 $f(x)=(\\ln x)/x$（$x>0$），最大遞增開區間為 $(0,b)$，求 $b$。',
      choices: [{ tex: 'e', value: Math.E }, { tex: '1', value: 1 }, { tex: 'e^{-1}', value: 1/Math.E }, { tex: 'e^2', value: Math.exp(2) }],
      answer: 0,
      solution: '$f\'(x)=(1-\\ln x)/x^2$，在 $0<x<e$ 為正，過了 $e$ 為負，故 $b=e$。',
      check: N => {
        const d = x => N.diff(t => Math.log(t)/t, x), b = N.roots(d, 0.2, 8)[0];
        if (!(d(b/2) > 0 && d(b+1) < 0)) throw new Error('導數符號不符');
        return b;
      }
    },
    {
      id: 'dap-22', topic: 'derivative-app', difficulty: 3,
      stem: '$f(x)=x+1/x$（$x\\ne0$）的遞增區間為 $(-\\infty,a)$ 與 $(b,\\infty)$，求 $(a,b)$。',
      choices: [{ tex: '(-1,0)', value: [-1, 0] }, { tex: '(0,1)', value: [0, 1] }, { tex: '(-1,1)', value: [-1, 1] }, { tex: '(0,0)', value: [0, 0] }],
      answer: 2,
      solution: '由 $f\'(x)=1-1/x^2>0$ 得 $|x|>1$；不能把定義域的缺口 $x=0$ 當作遞增區間端點。',
      check: N => {
        const d = x => N.diff(t => t+1/t, x);
        const roots = N.roots(d, -3, -0.2).concat(N.roots(d, 0.2, 3));
        if (!(d(-2) > 0 && d(-0.5) < 0 && d(0.5) < 0 && d(2) > 0)) throw new Error('區間符號不符');
        return roots;
      }
    },
    {
      id: 'dap-23', topic: 'derivative-app', difficulty: 1,
      stem: '函數 $f(x)=e^{-x}$ 在整條實數軸上的單調性為何？',
      choices: [{ tex: '\\text{嚴格遞增}', value: 'increasing' }, { tex: '\\text{嚴格遞減}', value: 'decreasing' }, { tex: '\\text{先減後增}', value: 'minimum' }, { tex: '\\text{先增後減}', value: 'maximum' }],
      answer: 1,
      solution: '因為 $f\'(x)=-e^{-x}<0$ 對每個實數都成立，所以嚴格遞減。',
      check: N => {
        const signs = [-4, -1, 0, 1, 4].map(x => Math.sign(N.diff(t => Math.exp(-t), x)));
        return signs.every(s => s < 0) ? 'decreasing' : signs.every(s => s > 0) ? 'increasing' : signs[0] < 0 ? 'minimum' : 'maximum';
      }
    },
    {
      id: 'dap-24', topic: 'derivative-app', difficulty: 1,
      stem: '$f(x)=x^3-6x^2$ 的反曲點橫座標是多少？',
      choices: [{ tex: '0', value: 0 }, { tex: '4', value: 4 }, { tex: '-2', value: -2 }, { tex: '2', value: 2 }],
      answer: 3,
      solution: '$f\'\'(x)=6x-12$ 在 $x=2$ 處由負變正，故此處為反曲點。',
      check: N => {
        const d2 = x => N.diff(t => N.diff(u => u*u*u-6*u*u, t), x);
        const c = N.roots(d2, 0, 4)[0];
        if (d2(c-0.2)*d2(c+0.2) >= 0) throw new Error('凹凸性未改變');
        return c;
      }
    },
    {
      id: 'dap-25', topic: 'derivative-app', difficulty: 2,
      stem: '曲線 $y=xe^{-x}$ 在 $(a,\\infty)$ 凹向上（$y\'\'>0$），且此區間不能再擴大，求 $a$。',
      choices: [{ tex: '2', value: 2 }, { tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '-2', value: -2 }],
      answer: 0,
      solution: '$y\'\'=e^{-x}(x-2)$，所以 $x>2$ 時凹向上，$a=2$。',
      check: N => {
        const d2 = x => N.diff(t => N.diff(u => u*Math.exp(-u), t), x);
        const a = N.roots(d2, 0, 4)[0];
        if (!(d2(a-0.2) < 0 && d2(a+0.2) > 0)) throw new Error('凹凸區間不符');
        return a;
      }
    },
    {
      id: 'dap-26', topic: 'derivative-app', difficulty: 3,
      stem: '函數 $f(x)=\\ln(1+x^2)$ 的全部反曲點橫座標，由小到大為何？',
      choices: [{ tex: '\\{0\\}', value: [0] }, { tex: '\\{-1,0,1\\}', value: [-1, 0, 1] }, { tex: '\\{-1,1\\}', value: [-1, 1] }, { tex: '\\{-\\sqrt2,\\sqrt2\\}', value: [-Math.sqrt(2), Math.sqrt(2)] }],
      answer: 2,
      solution: '$f\'\'(x)=2(1-x^2)/(1+x^2)^2$，在 $x=-1$ 與 $x=1$ 都變號，因此兩處都是反曲點。',
      check: N => {
        const d2 = x => N.diff(t => N.diff(u => Math.log(1+u*u), t), x);
        return N.roots(d2, -3, 3).filter(x => d2(x-0.1)*d2(x+0.1) < 0);
      }
    },
    {
      id: 'dap-27', topic: 'derivative-app', difficulty: 2,
      stem: '對 $y=x^4$，已知 $y\'\'(0)=0$，原點是否為反曲點？',
      choices: [{ tex: '\\text{是，因為二階導數為零}', value: 'zero' }, { tex: '\\text{是，因為切線水平}', value: 'horizontal' }, { tex: '\\text{否，因為原點不在曲線上}', value: 'offcurve' }, { tex: '\\text{否，因為兩側都凹向上}', value: 'same' }],
      answer: 3,
      solution: '$y\'\'=12x^2$ 在原點兩側皆為正，凹凸性沒有改變；二階導數為零本身不足以判定反曲點。',
      check: N => {
        const f = x => x**4, d2 = x => N.diff(t => N.diff(f, t), x);
        if (f(0) !== 0) return 'offcurve';
        return d2(-0.2) > 0 && d2(0.2) > 0 ? 'same' : Math.abs(d2(0)) < 1e-6 ? 'zero' : 'horizontal';
      }
    },
    {
      id: 'dap-28', topic: 'derivative-app', difficulty: 1,
      stem: '用長 $24$ 公尺的繩子圍成長方形，面積最大時，其中一邊長多少公尺？',
      choices: [{ tex: '12', value: 12 }, { tex: '6', value: 6 }, { tex: '3', value: 3 }, { tex: '24', value: 24 }],
      answer: 1,
      solution: '若一邊為 $x$，另一邊為 $12-x$；面積 $A=x(12-x)$ 在 $x=6$ 達最大。',
      check: N => N.maximize(x => x*(24/2-x), 0, 12).x
    },
    {
      id: 'dap-29', topic: 'derivative-app', difficulty: 2,
      stem: '一張邊長 $12$ 公分的正方形紙，四角各剪去邊長 $x$ 的小正方形後折成無蓋盒。要使容積最大，$x$ 應為多少公分？',
      choices: [{ tex: '6', value: 6 }, { tex: '4', value: 4 }, { tex: '2', value: 2 }, { tex: '3', value: 3 }],
      answer: 2,
      solution: '容積 $V=x(12-2x)^2$，$0<x<6$；由 $V\'=(12-2x)(12-6x)$ 得最大值出現在 $x=2$。',
      check: N => N.maximize(x => x*(12-2*x)**2, 0, 6).x
    },
    {
      id: 'dap-30', topic: 'derivative-app', difficulty: 3,
      stem: '有蓋圓柱罐的容積固定為 $54\\pi$ 立方公分。忽略厚度，使總表面積最小的半徑是多少公分？',
      choices: [{ tex: '3', value: 3 }, { tex: '\\sqrt[3]{54}', value: Math.cbrt(54) }, { tex: '6', value: 6 }, { tex: '\\sqrt[3]{27/2}', value: Math.cbrt(13.5) }],
      answer: 0,
      solution: '由 $h=54/r^2$ 得表面積 $S=2\\pi r^2+108\\pi/r$；$S\'=0$ 給出 $r^3=27$，且此處前減後增。',
      check: N => {
        const volume = 54*Math.PI;
        return N.minimize(r => 2*Math.PI*r*r+2*volume/r, 0.2, 12).x;
      }
    },
    {
      id: 'dap-31', topic: 'derivative-app', difficulty: 2,
      stem: '拋物線 $y=x^2$ 上距離 $(0,3)$ 最近的兩點中，位於右半平面的點，其橫座標為何？',
      choices: [{ tex: '\\sqrt3', value: Math.sqrt(3) }, { tex: '0', value: 0 }, { tex: '\\sqrt5', value: Math.sqrt(5) }, { tex: '\\sqrt{5/2}', value: Math.sqrt(2.5) }],
      answer: 3,
      solution: '最小化距離平方 $D=x^2+(x^2-3)^2$，其導數為 $2x(2x^2-5)$；正的極小點為 $x=\\sqrt{5/2}$。',
      check: N => N.minimize(x => x*x+(x*x-3)**2, 0, 4).x
    },
    {
      id: 'dap-32', topic: 'derivative-app', difficulty: 3,
      stem: '某商品售出 $q$ 件時單價為 $60-2q$ 元，總成本為 $6q+40$ 元（$0\\le q\\le30$，以連續模型計）。最大利潤為多少元？',
      choices: [{ tex: '320', value: 320 }, { tex: '\\frac{649}{2}', value: 324.5 }, { tex: '\\frac{729}{2}', value: 364.5 }, { tex: '\\frac{27}{2}', value: 13.5 }],
      answer: 1,
      solution: '利潤 $P=q(60-2q)-(6q+40)=-2q^2+54q-40$，在 $q=27/2$ 達最大值 $649/2$ 元。',
      check: N => N.maximize(q => q*(60-2*q)-(6*q+40), 0, 30).value
    },
    {
      id: 'dap-33', topic: 'derivative-app', difficulty: 1,
      stem: '兩個非負數的和固定為 $10$。它們的平方和最小時，較小的數是多少？',
      choices: [{ tex: '0', value: 0 }, { tex: '10', value: 10 }, { tex: '5', value: 5 }, { tex: '\\frac52', value: 2.5 }],
      answer: 2,
      solution: '令兩數為 $x$ 與 $10-x$，平方和的導數為 $4x-20$，最小值在兩數皆為 $5$ 時取得。',
      check: N => {
        const x = N.minimize(t => t*t+(10-t)**2, 0, 10).x;
        return Math.min(x, 10-x);
      }
    },
    {
      id: 'dap-34', topic: 'derivative-app', difficulty: 1,
      stem: '圓的半徑以每秒 $2$ 公分增加；半徑為 $3$ 公分時，面積每秒增加多少平方公分？',
      choices: [{ tex: '12\\pi', value: 12*Math.PI }, { tex: '6\\pi', value: 6*Math.PI }, { tex: '9\\pi', value: 9*Math.PI }, { tex: '4\\pi', value: 4*Math.PI }],
      answer: 0,
      solution: '由 $A=\\pi r^2$ 得 $dA/dt=2\\pi r\\,dr/dt=12\\pi$。',
      check: N => N.diff(t => Math.PI*(3+2*t)**2, 0)
    },
    {
      id: 'dap-35', topic: 'derivative-app', difficulty: 2,
      stem: '長 $10$ 公尺的梯子靠牆，底端以每秒 $2$ 公尺遠離牆。當底端離牆 $6$ 公尺時，頂端高度的變化率為多少公尺／秒（向上為正）？',
      choices: [{ tex: '\\frac32', value: 1.5 }, { tex: '-\\frac83', value: -8/3 }, { tex: '-\\frac34', value: -0.75 }, { tex: '-\\frac32', value: -1.5 }],
      answer: 3,
      solution: '$x^2+y^2=100$ 給出 $y=8$ 及 $y\'=-xx\'/y=-6\\cdot2/8=-3/2$。',
      check: N => N.diff(t => Math.sqrt(10**2-(6+2*t)**2), 0)
    },
    {
      id: 'dap-36', topic: 'derivative-app', difficulty: 3,
      stem: '倒圓錐水槽的水面半徑始終為水深的一半。以每秒 $3\\pi$ 立方公分注水，水深 $6$ 公分時，水面上升速率為多少公分／秒？',
      choices: [{ tex: '\\frac13', value: 1/3 }, { tex: '1', value: 1 }, { tex: '\\frac1{12}', value: 1/12 }, { tex: '\\frac19', value: 1/9 }],
      answer: 0,
      solution: '由 $r=h/2$ 得 $V=\\pi h^3/12$，所以 $dV/dt=(\\pi h^2/4)\\,dh/dt$；代入得 $dh/dt=1/3$。',
      check: N => {
        const volume = h => Math.PI*(h/2)**2*h/3;
        return 3*Math.PI/N.diff(volume, 6);
      }
    },
    {
      id: 'dap-37', topic: 'derivative-app', difficulty: 2,
      stem: '高 $6$ 公尺的路燈旁，一位身高 $2$ 公尺的人以每秒 $3$ 公尺遠離燈柱。地面上「影子本身的長度」每秒增加多少公尺？',
      choices: [{ tex: '\\frac92', value: 4.5 }, { tex: '3', value: 3 }, { tex: '\\frac32', value: 1.5 }, { tex: '1', value: 1 }],
      answer: 2,
      solution: '設人離燈柱 $x$、影長 $s$，相似三角形給出 $6/(x+s)=2/s$，故 $s=x/2$、$s\'=3/2$。',
      check: N => N.diff(t => 2*(4+3*t)/(6-2), 0)
    },
    {
      id: 'dap-38', topic: 'derivative-app', difficulty: 3,
      stem: '觀測者距垂直升空點的水平距離固定為 $8$ 公尺，物體高度 $6$ 公尺且以每秒 $5$ 公尺上升時，仰角的變化率為多少弧度／秒？',
      choices: [{ tex: '\\frac58', value: 5/8 }, { tex: '\\frac25', value: 0.4 }, { tex: '\\frac12', value: 0.5 }, { tex: '\\frac45', value: 0.8 }],
      answer: 1,
      solution: '由 $\\tan\\theta=y/8$，得 $\\theta\'=8y\'/(64+y^2)=40/100=2/5$。',
      check: N => N.diff(t => Math.atan((6+5*t)/8), 0)
    },
    {
      id: 'dap-39', topic: 'derivative-app', difficulty: 1,
      stem: '用 $f(x)=\\sqrt{x}$ 在 $a=4$ 的線性近似估計 $\\sqrt{4.12}$，結果為何？',
      choices: [{ tex: '2.12', value: 2.12 }, { tex: '2.06', value: 2.06 }, { tex: '2.015', value: 2.015 }, { tex: '2.03', value: 2.03 }],
      answer: 3,
      solution: '$L(x)=2+(x-4)/4$，所以 $L(4.12)=2.03$；增量應乘上斜率 $1/4$。',
      check: N => Math.sqrt(4)+N.diff(Math.sqrt, 4)*(4.12-4)
    },
    {
      id: 'dap-40', topic: 'derivative-app', difficulty: 1,
      stem: '以 $a=0$ 為展開點，使用 $e^x$ 的一次線性近似估計 $e^{0.02}$。',
      choices: [{ tex: '1.02', value: 1.02 }, { tex: '0.02', value: 0.02 }, { tex: '1.0002', value: 1.0002 }, { tex: '0.98', value: 0.98 }],
      answer: 0,
      solution: '$e^0=1$ 且 $f\'(0)=1$，所以 $L(x)=1+x$，代入 $0.02$ 得 $1.02$。',
      check: N => Math.exp(0)+N.diff(Math.exp, 0)*0.02
    },
    {
      id: 'dap-41', topic: 'derivative-app', difficulty: 2,
      stem: '用 $f(x)=x^{1/3}$ 在 $a=8$ 的切線，近似 $\\sqrt[3]{7.88}$ 的值為何？',
      choices: [{ tex: '1.88', value: 1.88 }, { tex: '2.01', value: 2.01 }, { tex: '1.99', value: 1.99 }, { tex: '1.96', value: 1.96 }],
      answer: 2,
      solution: '$f\'(8)=1/(3\\cdot8^{2/3})=1/12$，故線性估計為 $2+(7.88-8)/12=1.99$。',
      check: N => Math.cbrt(8)+N.diff(Math.cbrt, 8)*(7.88-8)
    },
    {
      id: 'dap-42', topic: 'derivative-app', difficulty: 3,
      stem: '為近似解 $\\ln x=1$，將 $\\ln x$ 在 $x_0=2$ 處線性化，再令線性式等於 $1$，所得 $x_1$ 為何？',
      choices: [{ tex: '2+\\frac{1-\\ln2}{2}', value: 2+(1-Math.log(2))/2 }, { tex: '4-2\\ln2', value: 4-2*Math.log(2) }, { tex: '2\\ln2', value: 2*Math.log(2) }, { tex: '2-2\\ln2', value: 2-2*Math.log(2) }],
      answer: 1,
      solution: '線性式為 $\\ln2+(x-2)/2$；令它等於 $1$，解得 $x_1=2+2(1-\\ln2)=4-2\\ln2$。',
      check: N => 2+(1-Math.log(2))/N.diff(Math.log, 2)
    },
    {
      id: 'dap-43', topic: 'derivative-app', difficulty: 1,
      stem: '對 $f(x)=x^2$ 在 $[1,5]$ 使用均值定理，滿足 $f\'(c)=[f(5)-f(1)]/(5-1)$ 的 $c$ 是多少？',
      choices: [{ tex: '6', value: 6 }, { tex: '2', value: 2 }, { tex: '4', value: 4 }, { tex: '3', value: 3 }],
      answer: 3,
      solution: '割線斜率為 $(25-1)/4=6$，由 $2c=6$ 得 $c=3\\in(1,5)$。',
      check: N => {
        const f = x => x*x, slope = (f(5)-f(1))/(5-1);
        return N.roots(x => N.diff(f, x)-slope, 1, 5)[0];
      }
    },
    {
      id: 'dap-44', topic: 'derivative-app', difficulty: 2,
      stem: '函數 $f(x)=\\ln x$ 在 $[1,e]$ 的均值定理保證的 $c$ 為何？',
      choices: [{ tex: 'e-1', value: Math.E-1 }, { tex: '\\frac1{e-1}', value: 1/(Math.E-1) }, { tex: '\\frac{e+1}{2}', value: (Math.E+1)/2 }, { tex: 'e', value: Math.E }],
      answer: 0,
      solution: '平均變化率為 $1/(e-1)$；由 $f\'(c)=1/c$ 得 $c=e-1$。',
      check: N => {
        const a = 1, b = Math.E, slope = (Math.log(b)-Math.log(a))/(b-a);
        return N.roots(x => N.diff(Math.log, x)-slope, a, b)[0];
      }
    },
    {
      id: 'dap-45', topic: 'derivative-app', difficulty: 2,
      stem: '在 $[1,9]$ 上，$f(x)=\\sqrt{x}$ 的哪個內點切線與兩端點連線平行（求橫座標）？',
      choices: [{ tex: '5', value: 5 }, { tex: '2', value: 2 }, { tex: '4', value: 4 }, { tex: '16', value: 16 }],
      answer: 2,
      solution: '割線斜率為 $(3-1)/(9-1)=1/4$，令 $1/(2\\sqrt c)=1/4$ 得 $c=4$。',
      check: N => {
        const slope = (Math.sqrt(9)-Math.sqrt(1))/(9-1);
        return N.roots(x => N.diff(Math.sqrt, x)-slope, 1, 9)[0];
      }
    },
    {
      id: 'dap-46', topic: 'derivative-app', difficulty: 3,
      stem: '對 $f(x)=x^3$ 在 $[-1,2]$ 使用均值定理，所有符合條件且位於開區間 $(-1,2)$ 的 $c$ 為何？',
      choices: [{ tex: '\\{-1,1\\}', value: [-1, 1] }, { tex: '\\{1\\}', value: [1] }, { tex: '\\{\\sqrt3\\}', value: [Math.sqrt(3)] }, { tex: '\\{0\\}', value: [0] }],
      answer: 1,
      solution: '平均斜率為 $(8-(-1))/3=3$，解 $3c^2=3$ 得 $\\pm1$；$-1$ 是端點而須排除，只剩 $c=1$。',
      check: N => {
        const f = x => x*x*x, a = -1, b = 2, slope = (f(b)-f(a))/(b-a);
        return N.roots(x => N.diff(f, x)-slope, a, b).filter(x => x > a+1e-6 && x < b-1e-6);
      }
    },
    {
      id: 'dap-47', topic: 'derivative-app', difficulty: 1,
      stem: '使用羅必達法則計算 $\\lim_{x\\to0}(e^x-1)/x$。',
      choices: [{ tex: '0', value: 0 }, { tex: '\\text{不存在}', value: 'DNE' }, { tex: 'e', value: Math.E }, { tex: '1', value: 1 }],
      answer: 3,
      solution: '原式為 $0/0$ 型，分子分母各微分一次，得 $\\lim_{x\\to0}e^x/1=1$。',
      check: N => N.limit(x => Math.expm1(x)/x, 0)
    },
    {
      id: 'dap-48', topic: 'derivative-app', difficulty: 3,
      stem: '求極限 $\\lim_{x\\to0}(\\sin x-x)/x^3$，可連續使用羅必達法則。',
      choices: [{ tex: '-\\frac16', value: -1/6 }, { tex: '\\frac16', value: 1/6 }, { tex: '-\\frac12', value: -0.5 }, { tex: '0', value: 0 }],
      answer: 0,
      solution: '依次微分分子分母三次，得到 $\\lim_{x\\to0}(-\\cos x)/6=-1/6$。',
      // 積分餘項避免 sin(x)-x 消去誤差，先在穩定點與原式比對。
      check: N => {
        const orig = x => (Math.sin(x)-x)/(x*x*x);
        const safe = x => N.integrate(t => -((1-t)**2)*Math.cos(x*t)/2, 0, 1);
        [0.2, 0.5, 1].forEach(x => {
          if (Math.abs(orig(x)-safe(x)) > 1e-9*Math.max(1, Math.abs(safe(x)))) throw new Error('積分改寫與原式不等價');
        });
        return N.limit(safe, 0);
      }
    },
    {
      id: 'dap-49', topic: 'derivative-app', difficulty: 3,
      stem: '用羅必達法則求 $\\lim_{x\\to0^+}x\\ln x$。',
      choices: [{ tex: '-1', value: -1 }, { tex: '-\\infty', value: '-inf' }, { tex: '0', value: 0 }, { tex: '+\\infty', value: '+inf' }],
      answer: 2,
      solution: '改寫成 $(\\ln x)/(1/x)$，屬於無窮比無窮型；微分後比值為 $-x$，右極限為 $0$。',
      check: N => {
        // 令 x=e^{-t}，從原式取樣，避免有限差分跨越 x=0。
        return N.limitInf(t => Math.exp(-t)*(-t));
      }
    },
    {
      id: 'dap-50', topic: 'derivative-app', difficulty: 3,
      stem: '求 $\\lim_{x\\to+\\infty}(\\ln x)/\\sqrt{x}$。',
      choices: [{ tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '+\\infty', value: '+inf' }, { tex: '\\frac12', value: 0.5 }],
      answer: 1,
      solution: '原式是無窮比無窮型，羅必達法則化為 $(1/x)/(1/(2\\sqrt x))=2/\\sqrt x$，極限為 $0$。',
      check: N => {
        // 令 x=e^t，在對數尺度上取原式，避免很慢的無窮遠收斂。
        return N.limitInf(t => t/Math.exp(t/2));
      }
    }
  ];
  Calc.questionBank = Calc.questionBank || {};
  Calc.questionBank['derivative-app'] = questions;
  if (typeof module !== 'undefined') module.exports = questions;
}(typeof window !== 'undefined' ? window : globalThis));
