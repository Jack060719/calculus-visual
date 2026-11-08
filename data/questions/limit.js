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
      id: 'lim-11', topic: 'limit', difficulty: 1,
      stem: '多項式在各點皆連續，求 $\\lim_{x\\to-1}(x^3-2x+4)$。',
      choices: [{ tex: '1', value: 1 }, { tex: '5', value: 5 }, { tex: '7', value: 7 }, { tex: '3', value: 3 }],
      answer: 1,
      solution: '直接代入 $x=-1$，得 $(-1)^3-2(-1)+4=5$。',
      check: N => N.limit(x => x*x*x-2*x+4, -1)
    },
    {
      id: 'lim-12', topic: 'limit', difficulty: 1,
      stem: '求 $\\lim_{x\\to2}\\frac{x+1}{x^2+2}$，此處分母不為零。',
      choices: [{ tex: '2', value: 2 }, { tex: '1', value: 1 }, { tex: '\\frac12', value: 1/2 }, { tex: '\\frac34', value: 3/4 }],
      answer: 2,
      solution: '分母在 $x=2$ 時為 $6$，可直接代入，得到 $3/6=1/2$。',
      check: N => N.limit(x => (x+1)/(x*x+2), 2)
    },
    {
      id: 'lim-13', topic: 'limit', difficulty: 1,
      stem: '先將分子通分，求 $\\lim_{x\\to2}\\frac{1/x-1/2}{x-2}$。',
      choices: [{ tex: '0', value: 0 }, { tex: '\\frac14', value: 1/4 }, { tex: '-\\frac12', value: -1/2 }, { tex: '-\\frac14', value: -1/4 }],
      answer: 3,
      solution: '分子通分成 $(2-x)/(2x)$，與分母約分後為 $-1/(2x)$，極限為 $-1/4$。',
      check: N => N.limit(x => (1/x-1/2)/(x-2), 2)
    },
    {
      id: 'lim-14', topic: 'limit', difficulty: 1,
      stem: '利用共軛式求 $\\lim_{x\\to4}\\frac{\\sqrt{x+5}-3}{x-4}$。',
      choices: [{ tex: '\\frac16', value: 1/6 }, { tex: '\\frac13', value: 1/3 }, { tex: '6', value: 6 }, { tex: '0', value: 0 }],
      answer: 0,
      solution: '分子分母同乘 $\\sqrt{x+5}+3$，約分後為 $1/(\\sqrt{x+5}+3)$，極限是 $1/6$。',
      check: N => N.limit(x => (Math.sqrt(x+5)-3)/(x-4), 4)
    },
    {
      id: 'lim-15', topic: 'limit', difficulty: 1,
      stem: '分母含根號，求 $\\lim_{x\\to1}\\frac{x-1}{\\sqrt{x}-1}$。',
      choices: [{ tex: '0', value: 0 }, { tex: '2', value: 2 }, { tex: '\\frac12', value: 1/2 }, { tex: '1', value: 1 }],
      answer: 1,
      solution: '利用 $x-1=(\\sqrt{x}-1)(\\sqrt{x}+1)$，原式約成 $\\sqrt{x}+1$，極限為 $2$。',
      check: N => N.limit(x => (x-1)/(Math.sqrt(x)-1), 1)
    },
    {
      id: 'lim-16', topic: 'limit', difficulty: 1,
      stem: '角度以弧度計，求兩個正弦的比值極限 $\\lim_{x\\to0}\\frac{\\sin3x}{\\sin2x}$。',
      choices: [{ tex: '1', value: 1 }, { tex: '\\frac23', value: 2/3 }, { tex: '\\frac32', value: 3/2 }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '寫成 $\\frac32\\frac{\\sin3x}{3x}\\frac{2x}{\\sin2x}$，兩個基本極限皆為 $1$，故答案為 $3/2$。',
      check: N => N.limit(x => Math.sin(3*x)/Math.sin(2*x), 0)
    },
    {
      id: 'lim-17', topic: 'limit', difficulty: 1,
      stem: '分母次數較高時，$\\lim_{x\\to+\\infty}\\frac{2x+1}{x^2+4}$ 為何？',
      choices: [{ tex: '2', value: 2 }, { tex: '\\frac14', value: 1/4 }, { tex: '+\\infty', value: '+inf' }, { tex: '0', value: 0 }],
      answer: 3,
      solution: '同除以 $x^2$，分子為 $2/x+1/x^2$，分母趨近 $1$，所以極限為 $0$。',
      check: N => N.limitInf(x => (2*x+1)/(x*x+4))
    },
    {
      id: 'lim-18', topic: 'limit', difficulty: 1,
      stem: '曲線 $y=\\frac{\\sqrt{9x^2+1}}{x}$ 在 $x\\to+\\infty$ 時的水平漸近線為何？',
      choices: [{ tex: 'y=3', value: 3 }, { tex: 'y=9', value: 9 }, { tex: 'y=-3', value: -3 }, { tex: 'y=0', value: 0 }],
      answer: 0,
      solution: '正的 $x$ 滿足 $\\sqrt{x^2}=x$，故函數可寫成 $\\sqrt{9+1/x^2}$，趨近 $3$。',
      check: N => N.limitInf(x => Math.sqrt(9*x*x+1)/x)
    },
    {
      id: 'lim-19', topic: 'limit', difficulty: 1,
      stem: '只由左邊接近，求 $\\lim_{x\\to2^-}\\frac{|x-2|}{x-2}$。',
      choices: [{ tex: '1', value: 1 }, { tex: '-1', value: -1 }, { tex: '0', value: 0 }, { tex: '\\text{不存在}', value: 'DNE' }],
      answer: 1,
      solution: '當 $x<2$ 時 $|x-2|=-(x-2)$，商恆為 $-1$，因此左極限為 $-1$。',
      check: N => N.limit(x => Math.abs(x-2)/(x-2), 2, 'left')
    },
    {
      id: 'lim-20', topic: 'limit', difficulty: 1,
      stem: '設 $f(x)=x+1$（$x<0$）、$f(x)=x^2+2$（$x>0$），而 $f(0)=9$。求 $\\lim_{x\\to0^+}f(x)$。',
      choices: [{ tex: '9', value: 9 }, { tex: '1', value: 1 }, { tex: '2', value: 2 }, { tex: '\\text{不存在}', value: 'DNE' }],
      answer: 2,
      solution: '右極限使用 $x>0$ 的公式，故為 $0^2+2=2$；單點值 $f(0)$ 不影響極限。',
      check: N => N.limit(x => x < 0 ? x+1 : x*x+2, 0, 'right')
    },
    {
      id: 'lim-21', topic: 'limit', difficulty: 1,
      stem: '求 $\\lim_{x\\to3}\\frac1{(x-3)^2}$，此題考慮左右兩側。',
      choices: [{ tex: '0', value: 0 }, { tex: '-\\infty', value: '-inf' }, { tex: '\\text{不存在}', value: 'DNE' }, { tex: '+\\infty', value: '+inf' }],
      answer: 3,
      solution: '平方分母從兩側都以正值趨近零，倒數皆無界增大，故雙側無窮極限為 $+\\infty$。',
      check: N => N.limit(x => 1/(x-3)**2, 3)
    },
    {
      id: 'lim-22', topic: 'limit', difficulty: 1,
      stem: '已知 $0<|x|<1$ 時 $-x^2\\le f(x)\\le x^2$，由夾擠定理可得 $\\lim_{x\\to0}f(x)$ 為何？',
      choices: [{ tex: '0', value: 0 }, { tex: '1', value: 1 }, { tex: '-1', value: -1 }, { tex: '\\text{無法確定}', value: 'unknown' }],
      answer: 0,
      solution: '上下界 $-x^2$ 與 $x^2$ 皆趨近 $0$，因此夾在中間的 $f(x)$ 也趨近 $0$。',
      check: N => {
        const lower = N.limit(x => -x*x, 0), upper = N.limit(x => x*x, 0);
        return Math.abs(upper-lower) < 1e-6 ? (lower+upper)/2 : 'unknown';
      }
    },
    {
      id: 'lim-23', topic: 'limit', difficulty: 1,
      stem: '對連續函數 $f(x)=x^3+x-3$，下列哪個開區間可由端點異號及中間值定理保證至少一根？',
      choices: [{ tex: '(-2,-1)', value: [-2,-1] }, { tex: '(1,2)', value: [1,2] }, { tex: '(-1,0)', value: [-1,0] }, { tex: '(0,1)', value: [0,1] }],
      answer: 1,
      solution: '$f(1)=-1$、$f(2)=7$，兩端異號；多項式連續，所以 $(1,2)$ 至少有一根。',
      check: N => {
        const f = x => x*x*x+x-3;
        return [[-2,-1],[-1,0],[0,1],[1,2]].find(([a,b]) => f(a)*f(b) < 0);
      }
    },
    {
      id: 'lim-24', topic: 'limit', difficulty: 1,
      stem: '當正整數 $n$ 趨向無窮大，求 $\\lim_{n\\to\\infty}(1+1/n)^n$。',
      choices: [{ tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: 'e', value: Math.E }, { tex: '+\\infty', value: '+inf' }],
      answer: 2,
      solution: '這是 $e$ 的標準極限定義；底數趨近 $1$ 並不代表整個冪趨近 $1$。',
      check: N => N.limitInf(n => (1+1/n)**n)
    },
    {
      id: 'lim-25', topic: 'limit', difficulty: 2,
      stem: '分子可視為平方差，求 $\\lim_{x\\to2}\\frac{x^4-16}{x^2-4}$。',
      choices: [{ tex: '4', value: 4 }, { tex: '0', value: 0 }, { tex: '16', value: 16 }, { tex: '8', value: 8 }],
      answer: 3,
      solution: '$x^4-16=(x^2-4)(x^2+4)$，約分後代入得 $4+4=8$。',
      check: N => N.limit(x => (x**4-16)/(x*x-4), 2)
    },
    {
      id: 'lim-26', topic: 'limit', difficulty: 2,
      stem: '求含兩個根式的極限 $\\lim_{x\\to0}\\frac{\\sqrt{1+x}-\\sqrt{1-x}}{x}$。',
      choices: [{ tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '\\frac12', value: 1/2 }, { tex: '2', value: 2 }],
      answer: 0,
      solution: '乘以共軛式後，分子差為 $2x$，約分得到 $2/(\\sqrt{1+x}+\\sqrt{1-x})$，極限為 $1$。',
      check: N => N.limit(x => (Math.sqrt(1+x)-Math.sqrt(1-x))/x, 0)
    },
    {
      id: 'lim-27', topic: 'limit', difficulty: 2,
      stem: '角度以弧度計，求 $\\lim_{x\\to0}\\frac{1-\\cos x}{x\\sin x}$。',
      choices: [{ tex: '1', value: 1 }, { tex: '\\frac12', value: 1/2 }, { tex: '2', value: 2 }, { tex: '0', value: 0 }],
      answer: 1,
      solution: '用 $1-\\cos x=2\\sin^2(x/2)$ 與 $\\sin x=2\\sin(x/2)\\cos(x/2)$，原式化為 $\\sin(x/2)/(x\\cos(x/2))$，極限為 $1/2$。',
      check: N => N.limit(x => (1-Math.cos(x))/(x*Math.sin(x)), 0)
    },
    {
      id: 'lim-28', topic: 'limit', difficulty: 2,
      stem: '求 $\\lim_{x\\to+\\infty}x(\\sqrt{x^2+4}-x)$。',
      choices: [{ tex: '0', value: 0 }, { tex: '4', value: 4 }, { tex: '2', value: 2 }, { tex: '+\\infty', value: '+inf' }],
      answer: 2,
      solution: '有理化得到 $4x/(\\sqrt{x^2+4}+x)$，再除以 $x$，極限為 $4/(1+1)=2$。',
      check: N => N.limitInf(x => x*(Math.sqrt(x*x+4)-x))
    },
    {
      id: 'lim-29', topic: 'limit', difficulty: 2,
      stem: '注意 $x$ 的符號，求 $\\lim_{x\\to-\\infty}\\frac{\\sqrt{4x^2+x}}{x}$。',
      choices: [{ tex: '2', value: 2 }, { tex: '4', value: 4 }, { tex: '0', value: 0 }, { tex: '-2', value: -2 }],
      answer: 3,
      solution: '根號提出的是 $|x|$；在負方向 $|x|/x=-1$，因此極限為 $-\\sqrt4=-2$。',
      check: N => N.limitInf(t => Math.sqrt(4*t*t-t)/(-t))
    },
    {
      id: 'lim-30', topic: 'limit', difficulty: 2,
      stem: '設 $f(x)=ax+1$（$x<2$）、$f(x)=x^2-ax$（$x\\ge2$）。若 $f$ 在 $2$ 連續，$a$ 為何？',
      choices: [{ tex: '\\frac34', value: 3/4 }, { tex: '\\frac32', value: 3/2 }, { tex: '-\\frac34', value: -3/4 }, { tex: '1', value: 1 }],
      answer: 0,
      solution: '左右必須接合，故 $2a+1=4-2a$，解得 $a=3/4$。',
      check: N => N.roots(a => N.limit(x => a*x+1, 2, 'left')-N.limit(x => x*x-a*x, 2, 'right'), 0, 2)[0]
    },
    {
      id: 'lim-31', topic: 'limit', difficulty: 2,
      stem: '設 $f(x)=\\sin x/x$（$x\\ne0$），但 $f(0)=0$，角度以弧度計。$x=0$ 是哪一類點？',
      choices: [{ tex: '\\text{連續點}', value: 'continuous' }, { tex: '\\text{可去不連續點}', value: 'removable' }, { tex: '\\text{跳躍不連續點}', value: 'jump' }, { tex: '\\text{無窮不連續點}', value: 'infinite' }],
      answer: 1,
      solution: '左右極限同為 $1$，卻不等於 $f(0)=0$；只需改動單點值即可連續，故為可去不連續。',
      check: N => {
        const f = x => Math.sin(x)/x;
        const left = N.limit(f, 0, 'left'), right = N.limit(f, 0, 'right');
        if (typeof left !== 'number' || typeof right !== 'number') return 'infinite';
        if (Math.abs(left-right) > 1e-6) return 'jump';
        return Math.abs((left+right)/2-0) < 1e-6 ? 'continuous' : 'removable';
      }
    },
    {
      id: 'lim-32', topic: 'limit', difficulty: 2,
      stem: '函數 $f(x)=e^x$（$x<0$）、$f(x)=2+x$（$x\\ge0$）在 $0$ 的不連續類型為何？',
      choices: [{ tex: '\\text{可去不連續}', value: 'removable' }, { tex: '\\text{無窮不連續}', value: 'infinite' }, { tex: '\\text{跳躍不連續}', value: 'jump' }, { tex: '\\text{其實連續}', value: 'continuous' }],
      answer: 2,
      solution: '左極限為 $1$，右極限為 $2$；兩個有限的單側極限不相等，屬於跳躍不連續。',
      check: N => {
        const f = x => x < 0 ? Math.exp(x) : 2+x;
        const left = N.limit(f, 0, 'left'), right = N.limit(f, 0, 'right');
        if (typeof left !== 'number' || typeof right !== 'number') return 'infinite';
        if (Math.abs(left-right) > 1e-6) return 'jump';
        return Math.abs(left-f(0)) < 1e-6 ? 'continuous' : 'removable';
      }
    },
    {
      id: 'lim-33', topic: 'limit', difficulty: 2,
      stem: '角度以弧度計。用中間值定理判斷，方程 $\\cos x=x$ 的根可保證落在哪個開區間？',
      choices: [{ tex: '(-2,-1)', value: [-2,-1] }, { tex: '(-1,0)', value: [-1,0] }, { tex: '(1,2)', value: [1,2] }, { tex: '(0,1)', value: [0,1] }],
      answer: 3,
      solution: '令 $h(x)=\\cos x-x$，則 $h(0)=1>0$、$h(1)=\\cos1-1<0$；$h$ 連續，故 $(0,1)$ 至少有一根。',
      check: N => {
        const h = x => Math.cos(x)-x;
        return [[-2,-1],[-1,0],[0,1],[1,2]].find(([a,b]) => h(a)*h(b) < 0);
      }
    },
    {
      id: 'lim-34', topic: 'limit', difficulty: 2,
      stem: '對整數 $n>1$，求 $\\lim_{n\\to\\infty}\\left(\\frac{1+1/n}{1-1/n}\\right)^n$。',
      choices: [{ tex: 'e^2', value: Math.exp(2) }, { tex: '1', value: 1 }, { tex: 'e', value: Math.E }, { tex: 'e^{-2}', value: Math.exp(-2) }],
      answer: 0,
      solution: '取對數得到 $n\\ln(1+1/n)-n\\ln(1-1/n)\\to1-(-1)=2$，故原極限為 $e^2$。',
      check: N => N.limitInf(n => ((1+1/n)/(1-1/n))**n)
    },
    {
      id: 'lim-35', topic: 'limit', difficulty: 2,
      stem: '已知 $0<|x|<1$ 時 $0\\le h(x)\\le1$。即使 $h$ 可能振盪，$\\lim_{x\\to0}xh(x)$ 仍為何？',
      choices: [{ tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '-1', value: -1 }, { tex: '\\text{無法確定}', value: 'unknown' }],
      answer: 1,
      solution: '由 $|xh(x)|\\le|x|$，可得 $-|x|\\le xh(x)\\le|x|$。上下界皆趨近 $0$，所以極限為 $0$。',
      check: N => {
        const lower = N.limit(x => Math.min(x*0, x*1), 0), upper = N.limit(x => Math.max(x*0, x*1), 0);
        return Math.abs(upper-lower) < 1e-6 ? (lower+upper)/2 : 'unknown';
      }
    },
    {
      id: 'lim-36', topic: 'limit', difficulty: 2,
      stem: '已知 $a>0$，且 $f(x)=ax+2$（$x<0$）、$f(x)=(a^2+1)e^x$（$x\\ge0$）。若 $f$ 在 $0$ 連續，求 $a$。',
      choices: [{ tex: '-1', value: -1 }, { tex: '\\sqrt2', value: Math.sqrt(2) }, { tex: '1', value: 1 }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '接合條件為 $2=a^2+1$，得到 $a=\\pm1$；由 $a>0$ 選 $a=1$。',
      check: N => N.roots(a => N.limit(x => a*x+2, 0, 'left')-N.limit(x => (a*a+1)*Math.exp(x), 0, 'right'), 0, 2)[0]
    },
    {
      id: 'lim-37', topic: 'limit', difficulty: 3,
      stem: '一次項也被扣除時，求 $\\lim_{x\\to0}\\frac{\\sqrt{1+x}-1-x/2}{x^2}$。',
      choices: [{ tex: '0', value: 0 }, { tex: '\\frac18', value: 1/8 }, { tex: '-\\frac14', value: -1/4 }, { tex: '-\\frac18', value: -1/8 }],
      answer: 3,
      solution: '兩次利用共軛關係，可化為 $-1/[2(\\sqrt{1+x}+1)^2]$，代入極限得到 $-1/8$。',
      check: N => N.limit(x => (Math.sqrt(1+x)-1-x/2)/(x*x), 0)
    },
    {
      id: 'lim-38', topic: 'limit', difficulty: 3,
      stem: '角度以弧度計，求 $\\lim_{x\\to0}\\frac{\\tan x-\\sin x}{x^3}$。',
      choices: [{ tex: '\\frac12', value: 1/2 }, { tex: '0', value: 0 }, { tex: '1', value: 1 }, { tex: '-\\frac12', value: -1/2 }],
      answer: 0,
      solution: '分子寫成 $\\sin x(1-\\cos x)/\\cos x$，再用 $\\sin x/x\\to1$、$(1-\\cos x)/x^2\\to1/2$，得到 $1/2$。',
      check: N => N.limit(x => (Math.tan(x)-Math.sin(x))/x**3, 0)
    },
    {
      id: 'lim-39', topic: 'limit', difficulty: 3,
      stem: '角度以弧度計，求消去一次項後的極限 $\\lim_{x\\to0}\\frac{\\sin x-x\\cos x}{x^3}$。',
      choices: [{ tex: '\\frac16', value: 1/6 }, { tex: '\\frac13', value: 1/3 }, { tex: '-\\frac13', value: -1/3 }, { tex: '0', value: 0 }],
      answer: 1,
      solution: '分子與分母皆趨零，使用羅必達法則得 $\\lim_{x\\to0}\\frac{x\\sin x}{3x^2}=1/3$。',
      check: N => N.limit(x => (Math.sin(x)-x*Math.cos(x))/x**3, 0)
    },
    {
      id: 'lim-40', topic: 'limit', difficulty: 3,
      stem: '求標準 $e$ 極限的誤差倍率 $\\lim_{n\\to\\infty}n\\left(\\frac{(1+1/n)^n}{e}-1\\right)$。',
      choices: [{ tex: '0', value: 0 }, { tex: '\\frac12', value: 1/2 }, { tex: '-\\frac12', value: -1/2 }, { tex: '-1', value: -1 }],
      answer: 2,
      solution: '由 $\\ln(1+t)=t-t^2/2+O(t^3)$，知 $n\\ln(1+1/n)-1=-1/(2n)+O(1/n^2)$。再用 $(e^u-1)/u\\to1$，得到 $-1/2$。',
      check: N => N.limitInf(n => n*((1+1/n)**n/Math.E-1))
    },
    {
      id: 'lim-41', topic: 'limit', difficulty: 3,
      stem: '角度以弧度計，求 $\\lim_{x\\to0}\\frac{\\ln(\\cos x)}{x^2}$。',
      choices: [{ tex: '\\frac12', value: 1/2 }, { tex: '-1', value: -1 }, { tex: '0', value: 0 }, { tex: '-\\frac12', value: -1/2 }],
      answer: 3,
      solution: '令 $u=\\cos x-1$，則 $\\ln(1+u)/u\\to1$，而 $(\\cos x-1)/x^2\\to-1/2$，相乘得 $-1/2$。',
      check: N => N.limit(x => Math.log(Math.cos(x))/(x*x), 0)
    },
    {
      id: 'lim-42', topic: 'limit', difficulty: 3,
      stem: '兩個根式各自發散時，求 $\\lim_{x\\to+\\infty}(\\sqrt{x^2+3x}-\\sqrt{x^2-x})$。',
      choices: [{ tex: '2', value: 2 }, { tex: '4', value: 4 }, { tex: '1', value: 1 }, { tex: '0', value: 0 }],
      answer: 0,
      solution: '乘共軛後為 $4x/(\\sqrt{x^2+3x}+\\sqrt{x^2-x})$；上下同除以正的 $x$，得 $4/(1+1)=2$。',
      check: N => N.limitInf(x => Math.sqrt(x*x+3*x)-Math.sqrt(x*x-x))
    },
    {
      id: 'lim-43', topic: 'limit', difficulty: 3,
      stem: '函數 $f(x)=\\frac{x^2-1}{(x-1)(x+2)}$ 的所有垂直漸近線為何？',
      choices: [{ tex: 'x=1', value: [1] }, { tex: 'x=-2', value: [-2] }, { tex: 'x=-2\\text{ 與 }x=1', value: [-2,1] }, { tex: '\\text{沒有垂直漸近線}', value: [] }],
      answer: 1,
      solution: '約分後為 $(x+1)/(x+2)$；$x=1$ 只是可去的洞，$x=-2$ 的單側極限無窮，故只有 $x=-2$。',
      check: N => {
        const f = x => (x*x-1)/((x-1)*(x+2));
        return [-2,1].filter(a => ['left','right'].some(side => ['+inf','-inf'].includes(N.limit(f, a, side))));
      }
    },
    {
      id: 'lim-44', topic: 'limit', difficulty: 3,
      stem: '角度以弧度計，利用趨零的不同數列判斷 $\\lim_{x\\to0}\\sin(1/x)$。',
      choices: [{ tex: '0', value: 0 }, { tex: '1', value: 1 }, { tex: '\\text{不存在}', value: 'DNE' }, { tex: '-1', value: -1 }],
      answer: 2,
      solution: '取 $x_n=1/(2\\pi n+\\pi/2)$ 與 $y_n=1/(2\\pi n+3\\pi/2)$，函數值分別恆為 $1$ 與 $-1$。兩數列皆趨零而函數值極限不同，故原極限不存在。',
      check: N => {
        const f = x => Math.sin(1/x);
        const peak = N.limitInf(n => f(1/(2*Math.PI*n+Math.PI/2)));
        const trough = N.limitInf(n => f(1/(2*Math.PI*n+3*Math.PI/2)));
        return Math.abs(peak-trough) < 1e-6 ? (peak+trough)/2 : 'DNE';
      }
    },
    {
      id: 'lim-45', topic: 'limit', difficulty: 3,
      stem: '設 $f(x)=ax+b$（$x<1$）、$f(x)=x^2+ax$（$x>1$），且 $f(1)=4$。要在 $1$ 連續，$(a,b)$ 應為何？',
      choices: [{ tex: '(4,0)', value: [4,0] }, { tex: '(1,3)', value: [1,3] }, { tex: '(3,-1)', value: [3,-1] }, { tex: '(3,1)', value: [3,1] }],
      answer: 3,
      solution: '右極限給出 $1+a=4$，故 $a=3$；左極限要求 $a+b=4$，故 $b=1$。',
      check: N => {
        const a = N.roots(p => N.limit(x => x*x+p*x, 1, 'right')-4, 0, 5)[0];
        const b = N.roots(p => N.limit(x => a*x+p, 1, 'left')-4, -2, 5)[0];
        return [a,b];
      }
    },
    {
      id: 'lim-46', topic: 'limit', difficulty: 3,
      stem: '角度以弧度計。若 $g(x)=\\frac{e^{2x}-1}{\\sin3x}$（$x\\ne0$）要以 $g(0)=k$ 連續延伸，$k$ 為何？',
      choices: [{ tex: '\\frac23', value: 2/3 }, { tex: '\\frac32', value: 3/2 }, { tex: '2', value: 2 }, { tex: '0', value: 0 }],
      answer: 0,
      solution: '寫成 $\\frac23\\frac{e^{2x}-1}{2x}\\frac{3x}{\\sin3x}$，後兩因子皆趨近 $1$，故補值為 $2/3$。',
      check: N => N.limit(x => (Math.exp(2*x)-1)/Math.sin(3*x), 0)
    },
    {
      id: 'lim-47', topic: 'limit', difficulty: 3,
      stem: '在定義域 $x>0$ 中，以中間值定理判斷 $\\ln x+x^2=4$ 的根可保證位於哪個開區間？',
      choices: [{ tex: '(\\frac14,\\frac12)', value: [1/4,1/2] }, { tex: '(1,2)', value: [1,2] }, { tex: '(\\frac12,1)', value: [1/2,1] }, { tex: '(2,3)', value: [2,3] }],
      answer: 1,
      solution: '令 $h(x)=\\ln x+x^2-4$，在正半軸連續；$h(1)=-3$、$h(2)=\\ln2>0$，故 $(1,2)$ 至少有一根。',
      check: N => {
        const h = x => Math.log(x)+x*x-4;
        return [[1/4,1/2],[1/2,1],[1,2],[2,3]].find(([a,b]) => h(a)*h(b) < 0);
      }
    },
    {
      id: 'lim-48', topic: 'limit', difficulty: 3,
      stem: '求指數增量的數列極限 $\\lim_{n\\to\\infty}n(e^{1/n}-1)$。',
      choices: [{ tex: 'e', value: Math.E }, { tex: '+\\infty', value: '+inf' }, { tex: '1', value: 1 }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '令 $t=1/n\\to0^+$，原式成為 $(e^t-1)/t$，由指數函數的基本極限得到 $1$。',
      check: N => N.limitInf(n => n*(Math.exp(1/n)-1))
    },
    {
      id: 'lim-49', topic: 'limit', difficulty: 3,
      stem: '角度以弧度計，求雙側冪次極限 $\\lim_{x\\to0}(1+\\sin x)^{1/x}$。',
      choices: [{ tex: '1', value: 1 }, { tex: 'e^{-1}', value: Math.exp(-1) }, { tex: '0', value: 0 }, { tex: 'e', value: Math.E }],
      answer: 3,
      solution: '在零附近底數為正，可取對數；$\\ln(1+\\sin x)/x=[\\ln(1+\\sin x)/\\sin x](\\sin x/x)\\to1$，故原極限為 $e$。',
      check: N => N.limit(x => (1+Math.sin(x))**(1/x), 0)
    },
    {
      id: 'lim-50', topic: 'limit', difficulty: 3,
      stem: '角度以弧度計，結合三角恆等式與有理化，求 $\\lim_{x\\to0}\\frac{1-\\cos2x}{\\sqrt{1+x^2}-1}$。',
      choices: [{ tex: '4', value: 4 }, { tex: '2', value: 2 }, { tex: '1', value: 1 }, { tex: '0', value: 0 }],
      answer: 0,
      solution: '分子為 $2\\sin^2x$，分母有理化後為 $x^2/(\\sqrt{1+x^2}+1)$。因此極限為 $2\\cdot1^2\\cdot2=4$。',
      check: N => N.limit(x => (1-Math.cos(2*x))/(Math.sqrt(1+x*x)-1), 0)
    }
  ];
  Calc.questionBank = Calc.questionBank || {};
  Calc.questionBank['limit'] = questions;
  if (typeof module !== 'undefined') module.exports = questions;
}(typeof window !== 'undefined' ? window : globalThis));
