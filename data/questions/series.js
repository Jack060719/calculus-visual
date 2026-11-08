(function (root) {
  var Calc = root.Calc = root.Calc || {};
  var questions = [
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
    },
    {
      id: 'ser-11', topic: 'series', difficulty: 1,
      stem: '無窮等比和 $2-1+\\frac12-\\frac14+\\cdots$ 等於多少？',
      choices: [{ tex: '4', value: 4 }, { tex: '\\frac43', value: 4/3 }, { tex: '\\frac23', value: 2/3 }, { tex: '1', value: 1 }],
      answer: 1,
      solution: '首項為 $2$，公比為 $-1/2$，因此和為 $2/(1+1/2)=4/3$。',
      check: N => N.sum(n => 2*(-1/2)**n, 0, 80)
    },
    {
      id: 'ser-12', topic: 'series', difficulty: 1,
      stem: '等比級數從第三次方開始：$\\sum_{n=3}^{\\infty}(\\frac25)^n$ 的和是多少？',
      choices: [{ tex: '\\frac8{125}', value: 8/125 }, { tex: '\\frac23', value: 2/3 }, { tex: '\\frac8{75}', value: 8/75 }, { tex: '\\frac4{15}', value: 4/15 }],
      answer: 2,
      solution: '首項為 $(2/5)^3=8/125$，不是 $1$。除以 $1-2/5$ 得 $8/75$。',
      check: N => N.sum(n => (2/5)**n, 3, 80)
    },
    {
      id: 'ser-13', topic: 'series', difficulty: 2,
      stem: '使 $\\sum_{n=1}^{\\infty}n^{-k/2}$ 收斂的最小正整數 $k$ 是多少？',
      choices: [{ tex: '1', value: 1 }, { tex: '2', value: 2 }, { tex: '4', value: 4 }, { tex: '3', value: 3 }],
      answer: 3,
      solution: '$p$ 級數收斂需要 $k/2>1$，故 $k>2$，最小正整數為 $3$。',
      check: N => {
        for (var k = 1; k <= 4; k++) {
          if (N.series(n => n**(-k/2)) === 'converge') return k;
        }
      }
    },
    {
      id: 'ser-14', topic: 'series', difficulty: 1,
      stem: '級數 $\\sum_{n=1}^{\\infty}(-1)^n\\frac{n}{n+1}$ 應如何判斷？',
      choices: [{ tex: '\\text{收斂，正負項會抵消}', value: 'cancel' }, { tex: '\\text{收斂，因為通項有界}', value: 'bounded' }, { tex: '\\text{發散，因為通項不趨零}', value: 'diverge' }, { tex: '\\text{收斂，因為比值的絕對值趨近一}', value: 'ratio' }],
      answer: 2,
      solution: '通項的絕對值趨近 $1$，所以通項不可能趨近 $0$。正負交錯不足以保證收斂。',
      check: N => N.series(n => (-1)**n*n/(n+1))
    },
    {
      id: 'ser-15', topic: 'series', difficulty: 1,
      stem: '利用 $0<\\frac1{n^2+3}<\\frac1{n^2}$，可對 $\\sum_{n=1}^{\\infty}\\frac1{n^2+3}$ 得到哪個結論？',
      choices: [{ tex: '\\text{收斂，由收斂的上界級數比較}', value: 'converge' }, { tex: '\\text{發散，因為每項為正}', value: 'positive' }, { tex: '\\text{發散，因為有無窮多項}', value: 'infinite' }, { tex: '\\text{不能判斷，較小級數也可能發散}', value: 'unknown' }],
      answer: 0,
      solution: '$\\sum 1/n^2$ 收斂，而本題的每項非負且更小，因此由比較審斂法得知收斂。',
      check: N => N.series(n => 1/(n*n+3))
    },
    {
      id: 'ser-16', topic: 'series', difficulty: 1,
      stem: '對 $a_n=n/4^n$ 使用比值審斂法，$L=\\lim_{n\\to\\infty}|a_{n+1}/a_n|$ 是多少？',
      choices: [{ tex: '4', value: 4 }, { tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '\\frac14', value: 1/4 }],
      answer: 3,
      solution: '$a_{n+1}/a_n=(n+1)/(4n)$，極限為 $1/4<1$，故對應級數收斂。',
      check: N => {
        var term = n => n/4**n, safe = n => (n+1)/(4*n);
        [3,5,8].forEach(n => {
          if (Math.abs(Math.abs(term(n+1)/term(n))-safe(n)) > 1e-9*Math.max(1, Math.abs(safe(n)))) throw new Error('比值改寫與原式不等價');
        });
        return N.limitInf(safe);
      }
    },
    {
      id: 'ser-17', topic: 'series', difficulty: 1,
      stem: '設 $a_n=(\\frac{n+2}{3n})^n$，根值審斂法中的 $\\lim_{n\\to\\infty}\\sqrt[n]{|a_n|}$ 為何？',
      choices: [{ tex: '\\frac13', value: 1/3 }, { tex: '1', value: 1 }, { tex: '3', value: 3 }, { tex: '0', value: 0 }],
      answer: 0,
      solution: '取 $n$ 次方根後為 $(n+2)/(3n)$，其極限為 $1/3$。',
      check: N => {
        var term = n => ((n+2)/(3*n))**n, safe = n => (n+2)/(3*n);
        [3,5,8].forEach(n => {
          if (Math.abs(Math.abs(term(n))**(1/n)-safe(n)) > 1e-9*Math.max(1, Math.abs(safe(n)))) throw new Error('根值改寫與原式不等價');
        });
        return N.limitInf(safe);
      }
    },
    {
      id: 'ser-18', topic: 'series', difficulty: 1,
      stem: '將相鄰項消去後，$\\sum_{n=1}^{\\infty}(\\frac1{n+2}-\\frac1{n+3})$ 的和是多少？',
      choices: [{ tex: '\\frac14', value: 1/4 }, { tex: '\\frac13', value: 1/3 }, { tex: '\\frac1{12}', value: 1/12 }, { tex: '0', value: 0 }],
      answer: 1,
      solution: '前 $m$ 項的和為 $1/3-1/(m+3)$。令 $m$ 趨近無窮得 $1/3$。',
      check: N => N.sum(n => 1/(n+2)-1/(n+3), 1, 200000)
    },
    {
      id: 'ser-19', topic: 'series', difficulty: 1,
      stem: '$\\cos x$ 的麥克勞林級數中，二次項的係數為何？',
      choices: [{ tex: '\\frac12', value: 1/2 }, { tex: '-1', value: -1 }, { tex: '-\\frac12', value: -1/2 }, { tex: '0', value: 0 }],
      answer: 2,
      solution: '二次項係數為 $f\'\'(0)/2!$。因 $f\'\'(0)=-1$，係數為 $-1/2$。',
      check: N => N.diff(x => N.diff(Math.cos, x), 0)/2
    },
    {
      id: 'ser-20', topic: 'series', difficulty: 1,
      stem: '$\\frac1{1+x}=a_0+a_1x+a_2x^2+\\cdots$，依序列出 $(a_0,a_1,a_2)$。',
      choices: [{ tex: '(1,1,1)', value: [1,1,1] }, { tex: '(1,-1,-1)', value: [1,-1,-1] }, { tex: '(0,-1,1)', value: [0,-1,1] }, { tex: '(1,-1,1)', value: [1,-1,1] }],
      answer: 3,
      solution: '以公比 $-x$ 套用等比級數，得 $1-x+x^2-\\cdots$，所以係數為 $(1,-1,1)$。',
      check: N => {
        var f = x => 1/(1+x);
        return [f(0), N.diff(f, 0), N.diff(x => N.diff(f, x), 0)/2];
      }
    },
    {
      id: 'ser-21', topic: 'series', difficulty: 1,
      stem: '用 $e^x$ 在零點的二次泰勒多項式估計 $e^{0.2}$，得到哪個數？',
      choices: [{ tex: '1.22', value: 1.22 }, { tex: '1.2', value: 1.2 }, { tex: '1.24', value: 1.24 }, { tex: '0.22', value: 0.22 }],
      answer: 0,
      solution: '$P_2(x)=1+x+x^2/2$，代入 $0.2$ 得 $1+0.2+0.02=1.22$。',
      check: N => Math.exp(0)+N.diff(Math.exp, 0)*0.2+N.diff(x => N.diff(Math.exp, x), 0)*0.2**2/2
    },
    {
      id: 'ser-22', topic: 'series', difficulty: 1,
      stem: '利用指數函數的展開，求 $\\sum_{n=0}^{\\infty}\\frac1{n!}$。',
      choices: [{ tex: 'e-1', value: Math.E-1 }, { tex: 'e', value: Math.E }, { tex: '2e', value: 2*Math.E }, { tex: '1', value: 1 }],
      answer: 1,
      solution: '$e^x=\\sum_{n=0}^{\\infty}x^n/n!$，代 $x=1$ 即得 $e$；其中包含 $n=0$ 的項 $1$。',
      check: N => N.sum(n => {
        var factorial = 1;
        for (var k = 2; k <= n; k++) factorial *= k;
        return 1/factorial;
      }, 0, 20)
    },
    {
      id: 'ser-23', topic: 'series', difficulty: 1,
      stem: '$\\sum_{n=1}^{\\infty}(-1)^n/n^2$ 屬於哪種收斂情形？',
      choices: [{ tex: '\\text{條件收斂}', value: 'conditional' }, { tex: '\\text{發散}', value: 'diverge' }, { tex: '\\text{絕對收斂}', value: 'absolute' }, { tex: '\\text{通項不趨零}', value: 'nonzero' }],
      answer: 2,
      solution: '取絕對值後為收斂的 $p=2$ 級數，因此原級數絕對收斂。',
      check: N => {
        var term = n => (-1)**n/(n*n);
        if (N.series(n => Math.abs(term(n))) === 'converge') return 'absolute';
        return N.series(term) === 'converge' ? 'conditional' : 'diverge';
      }
    },
    {
      id: 'ser-24', topic: 'series', difficulty: 1,
      stem: '冪級數 $\\sum_{n=1}^{\\infty}n5^nx^n$ 的收斂半徑是多少？',
      choices: [{ tex: '5', value: 5 }, { tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '\\frac15', value: 1/5 }],
      answer: 3,
      solution: '相鄰係數之比為 $n/[5(n+1)]$，其極限給出半徑 $R=1/5$。',
      check: N => {
        var coefficient = n => n*5**n, safe = n => n/(5*(n+1));
        [3,5,8].forEach(n => {
          if (Math.abs(coefficient(n)/coefficient(n+1)-safe(n)) > 1e-9*Math.max(1, Math.abs(safe(n)))) throw new Error('係數比改寫與原式不等價');
        });
        return N.limitInf(safe);
      }
    },
    {
      id: 'ser-25', topic: 'series', difficulty: 1,
      stem: '將 $\\sin x/x$ 在零點連續延伸後，它的麥克勞林展開的常數項是多少？',
      choices: [{ tex: '1', value: 1 }, { tex: '0', value: 0 }, { tex: '-1', value: -1 }, { tex: '\\text{不存在}', value: 'DNE' }],
      answer: 0,
      solution: '由 $\\sin x=x-x^3/6+\\cdots$，除以 $x$ 後得 $1-x^2/6+\\cdots$，常數項為 $1$。',
      check: N => N.limit(x => Math.sin(x)/x, 0)
    },
    {
      id: 'ser-26', topic: 'series', difficulty: 2,
      stem: '以 $b_n=1/n^2$ 對 $a_n=(3n+2)/(n^3+1)$ 做極限比較，$\\lim_{n\\to\\infty}a_n/b_n$ 是多少？',
      choices: [{ tex: '0', value: 0 }, { tex: '3', value: 3 }, { tex: '\\frac13', value: 1/3 }, { tex: '1', value: 1 }],
      answer: 1,
      solution: '比值為 $(3n^3+2n^2)/(n^3+1)$，極限為 $3$。因 $0<3<\\infty$，原級數與 $\\sum1/n^2$ 同樣收斂。',
      check: N => N.limitInf(n => ((3*n+2)/(n**3+1))/(1/n**2))
    },
    {
      id: 'ser-27', topic: 'series', difficulty: 2,
      stem: '將 $\\sum_{n=1}^{\\infty}1/\\sqrt{n^2+1}$ 與調和級數極限比較，應選哪個結論？',
      choices: [{ tex: '\\text{收斂，因為分母有平方}', value: 'square' }, { tex: '\\text{收斂，因為通項趨零}', value: 'zero' }, { tex: '\\text{發散，比較極限為一}', value: 'diverge' }, { tex: '\\text{比較極限為零，無法判斷}', value: 'unknown' }],
      answer: 2,
      solution: '$[1/\\sqrt{n^2+1}]/(1/n)=n/\\sqrt{n^2+1}\\to1$。調和級數發散，所以本級數也發散。',
      check: N => N.series(n => 1/Math.sqrt(n*n+1))
    },
    {
      id: 'ser-28', topic: 'series', difficulty: 2,
      stem: '若 $a_n=n!/n^n$，比值審斂法的極限 $\\lim_{n\\to\\infty}a_{n+1}/a_n$ 為何？',
      choices: [{ tex: '1', value: 1 }, { tex: 'e', value: Math.E }, { tex: '0', value: 0 }, { tex: 'e^{-1}', value: 1/Math.E }],
      answer: 3,
      solution: '化簡得 $a_{n+1}/a_n=(n/(n+1))^n$，極限為 $e^{-1}<1$，所以級數收斂。',
      check: N => {
        var term = n => {
          var factorial = 1;
          for (var k = 2; k <= n; k++) factorial *= k;
          return factorial/n**n;
        };
        var safe = n => (n/(n+1))**n;
        [3,5,8].forEach(n => {
          if (Math.abs(term(n+1)/term(n)-safe(n)) > 1e-9*Math.max(1, Math.abs(safe(n)))) throw new Error('比值改寫與原式不等價');
        });
        return N.limitInf(safe);
      }
    },
    {
      id: 'ser-29', topic: 'series', difficulty: 2,
      stem: '對含平方指數的 $\\sum_{n=1}^{\\infty}2^{-n^2}$ 使用根值審斂法，根值極限 $L$ 是多少？',
      choices: [{ tex: '0', value: 0 }, { tex: '1', value: 1 }, { tex: '\\frac12', value: 1/2 }, { tex: '2', value: 2 }],
      answer: 0,
      solution: '取根後為 $(2^{-n^2})^{1/n}=2^{-n}$，其極限為 $0<1$，所以級數收斂；此級數本身不是固定公比的等比級數。',
      check: N => {
        var term = n => 2**(-n*n), safe = n => 2**(-n);
        [3,5,8].forEach(n => {
          if (Math.abs(term(n)**(1/n)-safe(n)) > 1e-9*Math.max(1, Math.abs(safe(n)))) throw new Error('根值改寫與原式不等價');
        });
        return N.limitInf(safe);
      }
    },
    {
      id: 'ser-30', topic: 'series', difficulty: 2,
      stem: '求對數望遠鏡級數 $\\sum_{n=1}^{\\infty}\\ln\\frac{(n+1)^2}{n(n+2)}$ 的和。',
      choices: [{ tex: '0', value: 0 }, { tex: '\\ln2', value: Math.log(2) }, { tex: '2\\ln2', value: 2*Math.log(2) }, { tex: '-\\ln2', value: -Math.log(2) }],
      answer: 1,
      solution: '每項寫成 $\\ln((n+1)/n)-\\ln((n+2)/(n+1))$，前 $m$ 項和為 $\\ln2-\\ln((m+2)/(m+1))$。極限為 $\\ln2$。',
      check: N => N.sum(n => Math.log((n+1)**2/(n*(n+2))), 1, 100000)
    },
    {
      id: 'ser-31', topic: 'series', difficulty: 2,
      stem: '含端點判斷，冪級數 $\\sum_{n=1}^{\\infty}x^n/n$ 的收斂區間為何？',
      choices: [{ tex: '(-1,1)', value: '(-1,1)' }, { tex: '[-1,1]', value: '[-1,1]' }, { tex: '[-1,1)', value: '[-1,1)' }, { tex: '(-1,1]', value: '(-1,1]' }],
      answer: 2,
      solution: '比值法得 $|x|<1$；$x=-1$ 時是交錯調和級數而收斂，$x=1$ 時是調和級數而發散。故區間為 $[-1,1)$。',
      check: N => {
        var coefficient = n => 1/n;
        var radius = Math.round(N.limitInf(n => coefficient(n)/coefficient(n+1)));
        var left = N.series(n => (-radius)**n/n) === 'converge';
        var right = N.series(n => radius**n/n) === 'converge';
        return (left ? '[' : '(')+(-radius)+','+radius+(right ? ']' : ')');
      }
    },
    {
      id: 'ser-32', topic: 'series', difficulty: 2,
      stem: '將 $\\ln x$ 在 $x=1$ 展開成 $a_0+a_1(x-1)+a_2(x-1)^2+\\cdots$，求 $(a_0,a_1,a_2)$。',
      choices: [{ tex: '(0,1,-1)', value: [0,1,-1] }, { tex: '(0,1,\\frac12)', value: [0,1,1/2] }, { tex: '(1,1,-\\frac12)', value: [1,1,-1/2] }, { tex: '(0,1,-\\frac12)', value: [0,1,-1/2] }],
      answer: 3,
      solution: '$f(1)=0$、$f\'(1)=1$、$f\'\'(1)=-1$，二次係數仍需除以 $2!$。',
      check: N => [Math.log(1), N.diff(Math.log, 1), N.diff(x => N.diff(Math.log, x), 1)/2]
    },
    {
      id: 'ser-33', topic: 'series', difficulty: 2,
      stem: '$\\ln(1+x)$ 的麥克勞林展開，保留到三次項的多項式是哪個？',
      choices: [{ tex: 'x-\\frac{x^2}2+\\frac{x^3}3', value: x => x-x*x/2+x**3/3 }, { tex: 'x+\\frac{x^2}2+\\frac{x^3}3', value: x => x+x*x/2+x**3/3 }, { tex: 'x-\\frac{x^2}2+\\frac{x^3}6', value: x => x-x*x/2+x**3/6 }, { tex: '1+x-\\frac{x^2}2+\\frac{x^3}3', value: x => 1+x-x*x/2+x**3/3 }],
      answer: 0,
      solution: '將等比展開 $1/(1+x)=1-x+x^2-\\cdots$ 從 $0$ 積到 $x$，得到 $x-x^2/2+x^3/3-\\cdots$。',
      check: N => {
        var f = x => Math.log(1+x);
        var a = N.diff(f, 0), b = N.diff(x => N.diff(f, x), 0)/2;
        var c = N.diff(x => N.diff(y => N.diff(f, y), x), 0)/6;
        return x => f(0)+a*x+b*x*x+c*x**3;
      }
    },
    {
      id: 'ser-34', topic: 'series', difficulty: 2,
      stem: '以 $f(x)=\\sqrt{1+x}$ 在零點的二次泰勒多項式近似 $\\sqrt{1.04}$，結果為何？',
      choices: [{ tex: '1.02', value: 1.02 }, { tex: '1.0198', value: 1.0198 }, { tex: '1.0202', value: 1.0202 }, { tex: '1.0392', value: 1.0392 }],
      answer: 1,
      solution: '$P_2(x)=1+x/2-x^2/8$，代 $x=0.04$ 得 $1.0198$。',
      check: N => {
        var f = x => Math.sqrt(1+x), h = 0.04;
        return f(0)+N.diff(f, 0)*h+N.diff(x => N.diff(f, x), 0)*h*h/2;
      }
    },
    {
      id: 'ser-35', topic: 'series', difficulty: 2,
      stem: '把 $x=1/2$ 代入對數展開，求 $\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n2^n}$。',
      choices: [{ tex: '\\ln2', value: Math.log(2) }, { tex: '-\\ln\\frac32', value: -Math.log(3/2) }, { tex: '\\ln\\frac32', value: Math.log(3/2) }, { tex: '\\frac12', value: 1/2 }],
      answer: 2,
      solution: '$\\ln(1+x)=\\sum_{n=1}^{\\infty}(-1)^{n+1}x^n/n$，代入 $x=1/2$ 得 $\\ln(3/2)$。',
      check: N => N.sum(n => (-1)**(n+1)/(n*2**n), 1, 80)
    },
    {
      id: 'ser-36', topic: 'series', difficulty: 2,
      stem: '用交錯級數的「下一項」誤差上界估計 $\\ln2=1-1/2+1/3-\\cdots$，至少取前幾項才能讓該上界嚴格小於 $0.01$？',
      choices: [{ tex: '99', value: 99 }, { tex: '10', value: 10 }, { tex: '101', value: 101 }, { tex: '100', value: 100 }],
      answer: 3,
      solution: '取前 $m$ 項的誤差上界為 $1/(m+1)$。要求 $1/(m+1)<0.01$，最小整數為 $m=100$。',
      check: N => {
        var term = n => (-1)**(n+1)/n;
        for (var m = 1; m <= 200; m++) {
          if (Math.abs(term(m+1)) < 0.01) return m;
        }
      }
    },
    {
      id: 'ser-37', topic: 'series', difficulty: 2,
      stem: '對遞減正函數 $f(x)=x^{-2}$，積分估計給出 $\\sum_{n=11}^{\\infty}1/n^2\\le\\int_{10}^{\\infty}x^{-2}\\,dx$；右側上界是多少？',
      choices: [{ tex: '\\frac1{10}', value: 1/10 }, { tex: '\\frac1{11}', value: 1/11 }, { tex: '\\frac1{100}', value: 1/100 }, { tex: '10', value: 10 }],
      answer: 0,
      solution: '$\\int_{10}^{b}x^{-2}\\,dx=1/10-1/b$，令 $b\\to\\infty$ 得尾和上界 $1/10$。',
      check: N => N.improper(x => x**(-2), 10, Infinity)
    },
    {
      id: 'ser-38', topic: 'series', difficulty: 3,
      stem: '中心不在零點：$\\sum_{n=1}^{\\infty}\\frac{(x-2)^n}{n^2 3^n}$ 的完整收斂區間為何？',
      choices: [{ tex: '(-1,5)', value: '(-1,5)' }, { tex: '[-1,5]', value: '[-1,5]' }, { tex: '[-3,3]', value: '[-3,3]' }, { tex: '[-1,5)', value: '[-1,5)' }],
      answer: 1,
      solution: '比值法給出 $|x-2|<3$。兩端 $x=-1,5$ 取絕對值後都是 $\\sum1/n^2$，均收斂，故為 $[-1,5]$。',
      check: N => {
        var original = (n, x) => (x-2)**n/(n*n*3**n);
        var term = (n, x) => ((x-2)/3)**n/(n*n);
        var ratio = n => 3*(n+1)**2/n**2;
        [3,5,8].forEach(n => {
          if (Math.abs(original(n, 3)/original(n+1, 3)-ratio(n)) > 1e-9*Math.max(1, Math.abs(ratio(n)))) throw new Error('係數比改寫與原式不等價');
          [-1,0,5].forEach(x => {
            if (Math.abs(original(n, x)-term(n, x)) > 1e-9*Math.max(1, Math.abs(term(n, x)))) throw new Error('端點通項改寫與原式不等價');
          });
        });
        var center = 2, radius = Math.round(N.limitInf(ratio));
        var left = N.series(n => term(n, center-radius)) === 'converge';
        var right = N.series(n => term(n, center+radius)) === 'converge';
        return (left ? '[' : '(')+(center-radius)+','+(center+radius)+(right ? ']' : ')');
      }
    },
    {
      id: 'ser-39', topic: 'series', difficulty: 3,
      stem: '含交錯係數與平移的 $\\sum_{n=1}^{\\infty}\\frac{(-1)^n(x+1)^n}{n2^n}$，收斂區間是哪個？',
      choices: [{ tex: '[-3,1)', value: '[-3,1)' }, { tex: '[-3,1]', value: '[-3,1]' }, { tex: '(-3,1]', value: '(-3,1]' }, { tex: '(-2,2]', value: '(-2,2]' }],
      answer: 2,
      solution: '半徑為 $2$、中心為 $-1$；$x=-3$ 時成為調和級數，$x=1$ 時成為交錯調和級數。故區間為 $(-3,1]$。',
      check: N => {
        var original = (n, x) => (-1)**n*(x+1)**n/(n*2**n);
        var term = (n, x) => (-1)**n*((x+1)/2)**n/n;
        var ratio = n => 2*(n+1)/n;
        [3,5,8].forEach(n => {
          if (Math.abs(Math.abs(original(n, 0)/original(n+1, 0))-ratio(n)) > 1e-9*Math.max(1, Math.abs(ratio(n)))) throw new Error('係數比改寫與原式不等價');
          [-3,0,1].forEach(x => {
            if (Math.abs(original(n, x)-term(n, x)) > 1e-9*Math.max(1, Math.abs(term(n, x)))) throw new Error('端點通項改寫與原式不等價');
          });
        });
        var center = -1, radius = Math.round(N.limitInf(ratio));
        var left = N.series(n => term(n, center-radius)) === 'converge';
        var right = N.series(n => term(n, center+radius)) === 'converge';
        return (left ? '[' : '(')+(center-radius)+','+(center+radius)+(right ? ']' : ')');
      }
    },
    {
      id: 'ser-40', topic: 'series', difficulty: 3,
      stem: '階乘在分母的冪級數 $\\sum_{n=0}^{\\infty}x^n/n!$，收斂半徑 $R$ 是多少？',
      choices: [{ tex: '0', value: 0 }, { tex: '1', value: 1 }, { tex: 'e', value: Math.E }, { tex: '\\infty', value: '+inf' }],
      answer: 3,
      solution: '對任意固定 $x$，相鄰項比值為 $|x|/(n+1)\\to0$，所以對所有實數 $x$ 都收斂，$R=\\infty$。',
      check: N => {
        var coefficient = n => {
          var factorial = 1;
          for (var k = 2; k <= n; k++) factorial *= k;
          return 1/factorial;
        };
        var safe = n => n+1;
        [3,5,8].forEach(n => {
          if (Math.abs(coefficient(n)/coefficient(n+1)-safe(n)) > 1e-9*Math.max(1, Math.abs(safe(n)))) throw new Error('係數比改寫與原式不等價');
        });
        return N.limitInf(safe);
      }
    },
    {
      id: 'ser-41', topic: 'series', difficulty: 3,
      stem: '階乘改在分子的 $\\sum_{n=0}^{\\infty}n!x^n$，其收斂半徑為何？',
      choices: [{ tex: '0', value: 0 }, { tex: '1', value: 1 }, { tex: '\\infty', value: '+inf' }, { tex: 'e^{-1}', value: 1/Math.E }],
      answer: 0,
      solution: '相鄰係數比為 $n!/(n+1)!=1/(n+1)\\to0$，故 $R=0$；只有 $x=0$ 收斂。',
      check: N => {
        var coefficient = n => {
          var factorial = 1;
          for (var k = 2; k <= n; k++) factorial *= k;
          return factorial;
        };
        var safe = n => 1/(n+1);
        [3,5,8].forEach(n => {
          if (Math.abs(coefficient(n)/coefficient(n+1)-safe(n)) > 1e-9*Math.max(1, Math.abs(safe(n)))) throw new Error('係數比改寫與原式不等價');
        });
        return N.limitInf(safe);
      }
    },
    {
      id: 'ser-42', topic: 'series', difficulty: 3,
      stem: '複合函數 $\\cos(x^2)$ 的麥克勞林級數中，$x^4$ 的係數是多少？',
      choices: [{ tex: '-\\frac1{24}', value: -1/24 }, { tex: '-\\frac12', value: -1/2 }, { tex: '\\frac12', value: 1/2 }, { tex: '0', value: 0 }],
      answer: 1,
      solution: '先寫 $\\cos u=1-u^2/2!+\\cdots$，再令 $u=x^2$，得到 $1-x^4/2+\\cdots$。',
      check: N => {
        var coefficient = N.diff(u => N.diff(Math.cos, u), 0)/2;
        var polynomial = x => Math.cos(0)+coefficient*x**4;
        [0.05,0.1,0.15].forEach(x => {
          if (Math.abs(Math.cos(x*x)-polynomial(x)) >= x**8) throw new Error('部分和與原函數不符');
        });
        return coefficient;
      }
    },
    {
      id: 'ser-43', topic: 'series', difficulty: 3,
      stem: '$x^2e^{-x}$ 在零點展開時，$x^5$ 項的係數為何？',
      choices: [{ tex: '\\frac16', value: 1/6 }, { tex: '-\\frac1{120}', value: -1/120 }, { tex: '-\\frac16', value: -1/6 }, { tex: '-1', value: -1 }],
      answer: 2,
      solution: '乘上 $x^2$ 只平移次方，所以取 $e^{-x}$ 的三次項係數 $(-1)^3/3!=-1/6$。',
      check: N => {
        var f = x => Math.exp(-x);
        var a = f(0), b = N.diff(f, 0), c = N.diff(x => N.diff(f, x), 0)/2;
        var coefficient = N.diff(x => N.diff(y => N.diff(f, y), x), 0)/6;
        var polynomial = x => x*x*(a+b*x+c*x*x+coefficient*x**3);
        [0.05,0.1,0.15].forEach(x => {
          if (Math.abs(x*x*Math.exp(-x)-polynomial(x)) >= x**6/24) throw new Error('部分和與原函數不符');
        });
        return coefficient;
      }
    },
    {
      id: 'ser-44', topic: 'series', difficulty: 3,
      stem: '乘積 $e^x\\sin x$ 的麥克勞林展開中，三次項的係數是多少？',
      choices: [{ tex: '\\frac12', value: 1/2 }, { tex: '-\\frac16', value: -1/6 }, { tex: '\\frac23', value: 2/3 }, { tex: '\\frac13', value: 1/3 }],
      answer: 3,
      solution: '三次項來自 $(x^2/2)x$ 與 $1(-x^3/6)$，係數為 $1/2-1/6=1/3$。',
      check: N => {
        var f = x => Math.exp(x)*Math.sin(x);
        return N.diff(x => N.diff(y => N.diff(f, y), x), 0)/6;
      }
    },
    {
      id: 'ser-45', topic: 'series', difficulty: 3,
      stem: '取 $\\sin x$ 的三次麥克勞林多項式，在 $x=0.3$ 時得到的近似值是多少？',
      choices: [{ tex: '0.2955', value: 0.2955 }, { tex: '0.3045', value: 0.3045 }, { tex: '0.273', value: 0.273 }, { tex: '0.3', value: 0.3 }],
      answer: 0,
      solution: '$P_3(x)=x-x^3/6$，代入 $0.3$ 得 $0.3-0.0045=0.2955$。',
      check: N => {
        var h = 0.3, f = Math.sin;
        return f(0)+N.diff(f, 0)*h+N.diff(x => N.diff(f, x), 0)*h*h/2+
          N.diff(x => N.diff(y => N.diff(f, y), x), 0)*h**3/6;
      }
    },
    {
      id: 'ser-46', topic: 'series', difficulty: 3,
      stem: '用 $f(x)=1/x$ 在 $x=2$ 的二次泰勒多項式估計 $1/2.1$，結果是哪個？',
      choices: [{ tex: '0.475', value: 0.475 }, { tex: '0.47625', value: 0.47625 }, { tex: '0.52625', value: 0.52625 }, { tex: '0.4775', value: 0.4775 }],
      answer: 1,
      solution: '在 $2$ 處有 $f=1/2$、$f\'=-1/4$、$f\'\'=1/4$。取增量 $h=0.1$，得 $1/2-h/4+h^2/8=0.47625$。',
      check: N => {
        var f = x => 1/x, h = 2.1-2;
        return f(2)+N.diff(f, 2)*h+N.diff(x => N.diff(f, x), 2)*h*h/2;
      }
    },
    {
      id: 'ser-47', topic: 'series', difficulty: 3,
      stem: '將等比級數微分兩次後，可求出 $\\sum_{n=2}^{\\infty}n(n-1)/3^n$ 的和為何？',
      choices: [{ tex: '\\frac94', value: 9/4 }, { tex: '\\frac38', value: 3/8 }, { tex: '\\frac34', value: 3/4 }, { tex: '\\frac32', value: 3/2 }],
      answer: 2,
      solution: '$\\sum n(n-1)r^n=2r^2/(1-r)^3$，代入 $r=1/3$ 得 $3/4$；需保留微分產生的 $2$ 及乘回的 $r^2$。',
      check: N => N.sum(n => n*(n-1)/3**n, 2, 100)
    },
    {
      id: 'ser-48', topic: 'series', difficulty: 3,
      stem: '由反正切的級數，求 $1-\\frac13+\\frac15-\\frac17+\\cdots$ 的和。',
      choices: [{ tex: '\\frac\\pi2', value: Math.PI/2 }, { tex: '\\ln2', value: Math.log(2) }, { tex: '-\\frac\\pi4', value: -Math.PI/4 }, { tex: '\\frac\\pi4', value: Math.PI/4 }],
      answer: 3,
      solution: '$\\arctan x=\\sum_{n=0}^{\\infty}(-1)^nx^{2n+1}/(2n+1)$，在 $x=1$ 也由交錯級數收斂，和為 $\\arctan1=\\pi/4$。',
      check: N => N.sum(n => (-1)**n/(2*n+1), 0, 200000)
    },
    {
      id: 'ser-49', topic: 'series', difficulty: 3,
      stem: '將 $1/(1+x^2)$ 的等比展開逐項積分，得到 $\\arctan x=b_1x+b_3x^3+b_5x^5+\\cdots$；求 $(b_1,b_3,b_5)$。',
      choices: [{ tex: '(1,-\\frac13,\\frac15)', value: [1,-1/3,1/5] }, { tex: '(1,-1,1)', value: [1,-1,1] }, { tex: '(1,\\frac13,\\frac15)', value: [1,1/3,1/5] }, { tex: '(1,-\\frac16,\\frac1{120})', value: [1,-1/6,1/120] }],
      answer: 0,
      solution: '$1/(1+x^2)=1-x^2+x^4-\\cdots$，從 $0$ 積到 $x$ 得 $x-x^3/3+x^5/5-\\cdots$。',
      check: N => {
        var f = Math.atan;
        // 五階中央差分直接取原函數值，再外推消去二階截斷誤差。
        var fifth = h => (f(3*h)-4*f(2*h)+5*f(h)-5*f(-h)+4*f(-2*h)-f(-3*h))/(240*h**5);
        var coefficients = [N.diff(f, 0), N.diff(x => N.diff(y => N.diff(f, y), x), 0)/6,
          (4*fifth(0.01)-fifth(0.02))/3];
        var polynomial = x => coefficients[0]*x+coefficients[1]*x**3+coefficients[2]*x**5;
        [0.05,0.1,0.15].forEach(x => {
          if (Math.abs(Math.atan(x)-polynomial(x)) >= x**7) throw new Error('部分和與原函數不符');
        });
        return coefficients;
      }
    },
    {
      id: 'ser-50', topic: 'series', difficulty: 3,
      stem: '用 $e^x$ 的二次麥克勞林多項式估計 $e^{0.1}$。若三階導數上界取 $M=\\max_{[0,0.1]}e^x$，拉格朗日餘項上界 $M(0.1)^3/3!$ 為何？',
      choices: [{ tex: '\\frac{e^{0.1}}{2000}', value: Math.exp(0.1)/2000 }, { tex: '\\frac{e^{0.1}}{6000}', value: Math.exp(0.1)/6000 }, { tex: '\\frac1{6000}', value: 1/6000 }, { tex: '\\frac{e^{0.1}}{200}', value: Math.exp(0.1)/200 }],
      answer: 1,
      solution: '三階導數為 $e^x$，在區間上遞增，所以 $M=e^{0.1}$。因此誤差不超過 $e^{0.1}(0.1)^3/6=e^{0.1}/6000$。',
      check: N => N.maximize(Math.exp, 0, 0.1).value*0.1**3/6
    }
  ];
  Calc.questionBank = Calc.questionBank || {};
  Calc.questionBank['series'] = questions;
  if (typeof module !== 'undefined') module.exports = questions;
}(typeof window !== 'undefined' ? window : globalThis));
